import { Question } from '../../../shared/types/question';

// Use a relative path if they are on the same domain, or VITE_API_URL if specified
const API_URL = import.meta.env.VITE_API_URL || '';

export const questionApi = {
  getAll: async (): Promise<Question[]> => {
    const res = await fetch(`${API_URL}/api/questions`);
    if (!res.ok) throw new Error('Failed to fetch questions');
    return res.json();
  },
  getByLanguage: async (language: string): Promise<Question[]> => {
    const res = await fetch(`${API_URL}/api/questions/${encodeURIComponent(language)}`);
    if (!res.ok) throw new Error('Failed to fetch questions by language');
    return res.json();
  },
  getByDifficulty: async (difficulty: string): Promise<Question[]> => {
    const res = await fetch(`${API_URL}/api/questions/${encodeURIComponent(difficulty)}`);
    if (!res.ok) throw new Error('Failed to fetch questions by difficulty');
    return res.json();
  },
  getRandom: async (language?: string, difficulty?: string): Promise<Question> => {
    const params = new URLSearchParams();
    if (language) params.append('language', language);
    if (difficulty) params.append('difficulty', difficulty);
    const res = await fetch(`${API_URL}/api/questions/random?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch random question');
    return res.json();
  },
  getBalanced: async (language: string, bestOf: number): Promise<Question[]> => {
    const params = new URLSearchParams({ language, bestOf: bestOf.toString() });
    const res = await fetch(`${API_URL}/api/questions/balanced?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch balanced questions');
    return res.json();
  }
};
