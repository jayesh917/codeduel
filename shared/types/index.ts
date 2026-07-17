import { Question } from './question';

export interface Player {
  userId: string;
  socketId: string;
  name: string;
  isHost: boolean;
  connected: boolean;
  status: 'Waiting' | 'Thinking' | 'Answered' | 'Disconnected';
  score: number;
}

export interface RoundHistory {
  question: Question;
  answers: Record<string, string | string[]>;
  submitTimes: Record<string, number>;
  winnerId?: string;
  pointsAwarded: number;
}

export interface MatchState {
  questions: Question[];
  currentRoundIndex: number;
  answers: Record<string, string | string[]>;
  submitTimes: Record<string, number>;
  timerDuration: number;
  timeLeft: number;
  roundStatus: 'playing' | 'showing-result';
  firstCorrectUserId?: string;
  roundWinnerId?: string;
  roundResult?: { correctAnswer: string | string[], winnerId?: string, pointsAwarded: number, scores: { userId: string, score: number }[] };
  roundHistories: RoundHistory[];
}

export interface Room {
  id: string;
  bestOf: number;
  language: string;
  players: Player[];
  status: 'waiting' | 'preparing' | 'in-progress' | 'finished';
  createdAt: number;
  matchState?: MatchState;
  timerInterval?: ReturnType<typeof setInterval>;
}

export * from './question';
