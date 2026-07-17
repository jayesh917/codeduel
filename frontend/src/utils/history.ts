import { RoundHistory } from '../../../shared/types';

export interface MatchRecord {
  id: string;
  myId: string;
  myName: string;
  opponentId: string;
  opponentName: string;
  language: string;
  bestOf: number;
  result: 'Win' | 'Loss' | 'Draw';
  myScore: number;
  opponentScore: number;
  accuracy: number;
  date: number;
  duration: number;
  rounds: RoundHistory[];
}

export function saveMatchHistory(record: MatchRecord) {
  const existing = getMatchHistory();
  if (!existing.find(m => m.id === record.id)) {
    existing.unshift(record);
    localStorage.setItem('codeDuelHistory', JSON.stringify(existing));
  }
}

export function getMatchHistory(): MatchRecord[] {
  const data = localStorage.getItem('codeDuelHistory');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}
