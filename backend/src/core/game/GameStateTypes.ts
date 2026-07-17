import { Question } from '../../../../shared/types/question';

export enum MatchStatus {
  WAITING = 'WAITING',
  COUNTDOWN = 'COUNTDOWN',
  ROUND_ACTIVE = 'ROUND_ACTIVE',
  ROUND_FINISHED = 'ROUND_FINISHED',
  MATCH_FINISHED = 'MATCH_FINISHED',
  CANCELLED = 'CANCELLED'
}

export enum PlayerStatus {
  CONNECTED = 'CONNECTED',
  READY = 'READY',
  THINKING = 'THINKING',
  ANSWERED = 'ANSWERED',
  DISCONNECTED = 'DISCONNECTED'
}

export interface PlayerStats {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  skipped: number;
  perfectRounds: number;
  averageResponseTime: number;
  totalResponseTime: number; // to calculate average
}

export interface GamePlayer {
  userId: string;
  socketId: string;
  name: string;
  isHost: boolean;
  status: PlayerStatus;
  stats: PlayerStats;
}

export interface RoundResult {
  winnerId?: string;
  correctAnswer: string | string[];
  pointsAwarded: number;
  scores: { userId: string, score: number }[];
}

export interface RoundState {
  currentRound: number;
  totalRounds: number;
  startTime?: number;
  endTime?: number;
  winnerId?: string;
  result?: RoundResult;
}

export interface TimerState {
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  intervalId?: NodeJS.Timeout;
}

export interface QuestionState {
  currentQuestion?: Question;
  questionIndex: number;
  questionsUsed: Set<string>; // question IDs
  questionsRemaining: Question[];
}

export interface GameState {
  roomId: string;
  hostId: string;
  players: Map<string, GamePlayer>;
  matchStatus: MatchStatus;
  difficulty: string;
  language: string;
  
  questionState: QuestionState;
  roundState: RoundState;
  timerState: TimerState;
  
  matchWinnerId?: string;
  createdAt: number;
  startedAt?: number;
  
  // For backward compatibility
  answers: Record<string, string | string[]>;
  submitTimes: Record<string, number>;
  firstCorrectUserId?: string;
}
