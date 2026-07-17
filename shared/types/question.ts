export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionType = 'Single Correct' | 'Multiple Correct' | 'Syntax Error' | 'Output Prediction' | 'Fill Missing Code' | 'Debug Code' | 'Code Writing';

export interface Question {
  id: string;
  language: string;
  difficulty: Difficulty;
  type: QuestionType;
  title: string;
  description: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  timeLimit: number;
  tags: string[];
  createdAt: number;
  hint?: string;
  difficultyColor?: string;
  estimatedTime?: string;
  topic?: string;
  languageVersion?: string;
}
