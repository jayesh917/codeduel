import { GameStateInstance } from '../game/GameState';
import { MatchStatus } from '../game/GameStateTypes';

export class MatchLifecycle {
  static setStatus(match: GameStateInstance, status: MatchStatus) {
    match.state.matchStatus = status;
    match.syncLegacyRoom();
  }

  static isPlayable(match: GameStateInstance): boolean {
    return match.state.matchStatus === MatchStatus.ROUND_ACTIVE || match.state.matchStatus === MatchStatus.COUNTDOWN;
  }
}
