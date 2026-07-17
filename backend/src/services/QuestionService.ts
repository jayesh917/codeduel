import fs from 'fs';
import path from 'path';
import { Question } from '../../../shared/types';

class QuestionService {
  private questions: Question[] = [];
  private byLanguage: Map<string, Question[]> = new Map();
  private byLangAndDiff: Map<string, Question[]> = new Map();

  constructor() {
    this.loadQuestions();
  }

  private loadQuestions() {
    const dir = path.join(process.cwd(), 'backend/src/data/questions');
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            this.questions.push(...parsed);
            for (const q of parsed) {
              const lang = q.language.toLowerCase();
              if (!this.byLanguage.has(lang)) this.byLanguage.set(lang, []);
              this.byLanguage.get(lang).push(q);
              
              const langDiff = `${lang}-${q.difficulty.toLowerCase()}`;
              if (!this.byLangAndDiff.has(langDiff)) this.byLangAndDiff.set(langDiff, []);
              this.byLangAndDiff.get(langDiff).push(q);
            }
          }
        } catch {
          console.error(`Error parsing ${file}`);
        }
      }
    }
  }

  public getAllQuestions(): Question[] {
    return this.questions;
  }

  public getQuestionsByLanguage(language: string): Question[] {
    return this.byLanguage.get(language.toLowerCase()) || [];
  }

  public getQuestionsByDifficulty(difficulty: string): Question[] {
    return this.questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  public getRandomQuestion(language?: string, difficulty?: string): Question | null {
    let pool = this.questions;
    if (language && difficulty) {
      pool = this.byLangAndDiff.get(`${language.toLowerCase()}-${difficulty.toLowerCase()}`) || [];
    } else if (language) {
      pool = this.byLanguage.get(language.toLowerCase()) || [];
    } else if (difficulty) {
      pool = pool.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  public getBalancedQuestions(language: string, bestOf: number): Question[] {
    const lang = language.toLowerCase();
    const easy = this.byLangAndDiff.get(`${lang}-easy`) || [];
    const medium = this.byLangAndDiff.get(`${lang}-medium`) || [];
    const hard = this.byLangAndDiff.get(`${lang}-hard`) || [];

    const shuffle = (array: Question[]) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const shuffledEasy = shuffle(easy);
    const shuffledMedium = shuffle(medium);
    const shuffledHard = shuffle(hard);

    let eCount: number, mCount: number, hCount: number;
    if (bestOf === 3) { eCount = 1; mCount = 1; hCount = 1; }
    else if (bestOf === 5) { eCount = 2; mCount = 2; hCount = 1; }
    else if (bestOf === 10) { eCount = 3; mCount = 4; hCount = 3; }
    else if (bestOf === 15) { eCount = 5; mCount = 5; hCount = 5; }
    else { eCount = 1; mCount = 1; hCount = 1; } // fallback

    const selected = [
      ...shuffledEasy.slice(0, eCount),
      ...shuffledMedium.slice(0, mCount),
      ...shuffledHard.slice(0, hCount)
    ];

    return shuffle(selected); // shuffle the final list so difficulty is not predictable
  }
}

export const questionService = new QuestionService();
