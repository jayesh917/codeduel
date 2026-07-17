import { GameStateInstance } from '../game/GameState';
import { MatchStatus, PlayerStatus } from '../game/GameStateTypes';

import { TIMER_VALUES, QUESTION_POINTS } from '../../constants';
import { questionService } from '../../services/QuestionService';
import { MatchLifecycle } from './MatchLifecycle';

export class MatchEngine {

  static startMatchCountdown(match: GameStateInstance) {
    if (match.state.matchStatus === MatchStatus.ROUND_ACTIVE || match.state.matchStatus === MatchStatus.MATCH_FINISHED || match.state.matchStatus === MatchStatus.COUNTDOWN) return;
    
    MatchLifecycle.setStatus(match, MatchStatus.COUNTDOWN);
    match.state.startedAt = Date.now();
    
    match.state.questionState.questionsRemaining = questionService.getBalancedQuestions(match.state.language, match.state.roundState.totalRounds);
    
    if (match.legacyRoom) {
      match.legacyRoom.status = 'in-progress';
      match.legacyRoom.matchState = {
        questions: match.state.questionState.questionsRemaining,
        currentRoundIndex: 0,
        answers: {},
        submitTimes: {},
        timerDuration: 0,
        timeLeft: 0,
        roundStatus: 'playing',
        roundHistories: []
      };
    }

    console.log(`[MatchEngine] Match Started: ${match.getRoomId()}`);
        match.syncLegacyRoom();
    
    let countdown = 3;
    console.log(`[MatchEngine] Countdown Started: ${match.getRoomId()}`);
    
    const tick = () => {
      if (match.state.matchStatus === MatchStatus.CANCELLED) return;
            
      if (countdown <= 0) {
        this.startRound(match);
      } else {
        countdown--;
        setTimeout(tick, 1000);
      }
    };
    tick();
  }

  static startRound(match: GameStateInstance) {
    MatchLifecycle.setStatus(match, MatchStatus.ROUND_ACTIVE);
    
    match.state.answers = {};
    match.state.submitTimes = {};
    match.state.firstCorrectUserId = undefined;
    
    match.state.roundState.startTime = Date.now();
    match.state.roundState.winnerId = undefined;
    match.state.roundState.result = undefined;

    for (const player of match.state.players.values()) {
      if (player.status !== PlayerStatus.DISCONNECTED) {
        player.status = PlayerStatus.THINKING;
      }
    }

    let currentQuestion = match.state.questionState.questionsRemaining[match.state.roundState.currentRound];
    
    // Ensure unique questions are loaded, skipping those already in questionsUsed
    while (currentQuestion && match.state.questionState.questionsUsed.has(currentQuestion.id)) {
        // Find a replacement
        const replacement = questionService.getRandomQuestion(match.state.language, match.state.difficulty);
        if (replacement && !match.state.questionState.questionsUsed.has(replacement.id)) {
            match.state.questionState.questionsRemaining[match.state.roundState.currentRound] = replacement;
            currentQuestion = replacement;
        } else {
            break; // could not find replacement
        }
    }

    match.state.questionState.currentQuestion = currentQuestion;
    if (currentQuestion) match.state.questionState.questionsUsed.add(currentQuestion.id);

    match.state.difficulty = currentQuestion?.difficulty || 'Easy';
    
    let duration = TIMER_VALUES.HARD;
    if (match.state.difficulty === 'Easy') duration = TIMER_VALUES.EASY;
    else if (match.state.difficulty === 'Medium') duration = TIMER_VALUES.MEDIUM;

    if (match.legacyRoom.matchState) {
      match.legacyRoom.matchState.roundStatus = 'playing';
      match.legacyRoom.matchState.answers = {};
      match.legacyRoom.matchState.submitTimes = {};
      match.legacyRoom.matchState.firstCorrectUserId = undefined;
      match.legacyRoom.matchState.roundWinnerId = undefined;
      match.legacyRoom.matchState.roundResult = undefined;
    }

    console.log(`[MatchEngine] Round ${match.state.roundState.currentRound} Started in room ${match.getRoomId()}`);
        
    console.log(`[MatchEngine] Question Loaded: ${currentQuestion?.id}`);
        
    match.syncLegacyRoom();
    
    // Legacy support
    match.io.to(match.getRoomId()).emit('round-started', match.state.roundState.currentRound);

    this.startServerTimer(match, duration);
  }

  static startServerTimer(match: GameStateInstance, duration: number) {
    match.stopTimer();
    match.state.timerState.duration = duration;
    match.state.timerState.timeLeft = duration;
    match.state.timerState.isRunning = true;
    
    if (match.legacyRoom.matchState) {
      match.legacyRoom.matchState.timerDuration = duration;
      match.legacyRoom.matchState.timeLeft = duration;
    }

        
    // Legacy support
    match.broadcast('timer-started', { duration });

    match.state.timerState.intervalId = setInterval(() => {
      match.state.timerState.timeLeft -= 1;
      
      if (match.legacyRoom.matchState) {
        match.legacyRoom.matchState.timeLeft = match.state.timerState.timeLeft;
      }
      
      // legacy support
      match.io.to(match.getRoomId()).emit('timer-tick', match.state.timerState.timeLeft);
      
      if (match.state.timerState.timeLeft <= 0) {
        this.evaluateRound(match);
      }
    }, 1000);
  }

  static receiveAnswer(match: GameStateInstance, userId: string, answer: string | string[]) {
    if (match.state.matchStatus !== MatchStatus.ROUND_ACTIVE) return;
    
    const player = match.state.players.get(userId);
    if (!player || match.state.answers[userId] !== undefined) return;

    const responseTime = match.state.timerState.duration - match.state.timerState.timeLeft;
    match.state.answers[userId] = answer;
    match.state.submitTimes[userId] = responseTime;
    player.status = PlayerStatus.ANSWERED;
    player.stats.totalResponseTime += responseTime;

    const currentQuestion = match.state.questionState.currentQuestion;
    if (currentQuestion) {
      let isCorrect: boolean;
      if (Array.isArray(answer) && Array.isArray(currentQuestion.correctAnswer)) {
        isCorrect = JSON.stringify([...answer].sort()) === JSON.stringify([...currentQuestion.correctAnswer].sort());
      } else {
        isCorrect = answer === currentQuestion.correctAnswer;
      }

      if (isCorrect) {
        player.stats.correctAnswers++;
        if (!match.state.firstCorrectUserId) {
          match.state.firstCorrectUserId = userId;
        }
      } else {
        player.stats.wrongAnswers++;
      }
    }

    console.log(`[MatchEngine] Player Submitted: ${userId}`);
        match.syncLegacyRoom();
    
    match.io.to(match.getRoomId()).emit('player-answered', { userId, status: 'Answered' }); // Legacy

    // Check if all active players answered
    const activePlayers = Array.from(match.state.players.values()).filter(p => p.status !== PlayerStatus.DISCONNECTED);
    const allAnswered = activePlayers.every(p => p.status === PlayerStatus.ANSWERED);

    if (allAnswered && activePlayers.length === match.state.players.size) {
      this.evaluateRound(match);
    }
  }

  static evaluateRound(match: GameStateInstance) {
    match.stopTimer();
    MatchLifecycle.setStatus(match, MatchStatus.ROUND_FINISHED);
    match.state.roundState.endTime = Date.now();

    let pointsAwarded = 0;
    const winnerId = match.state.firstCorrectUserId;

    if (winnerId) {
      const winner = match.state.players.get(winnerId);
      if (winner) {
        if (match.state.difficulty === 'Easy') pointsAwarded = QUESTION_POINTS.EASY;
        else if (match.state.difficulty === 'Medium') pointsAwarded = QUESTION_POINTS.MEDIUM;
        else if (match.state.difficulty === 'Hard') pointsAwarded = QUESTION_POINTS.HARD;
        
        winner.stats.score += pointsAwarded;
      }
    }

    // Process skipped for players who didn't answer
    for (const player of match.state.players.values()) {
      if (player.status !== PlayerStatus.DISCONNECTED && match.state.answers[player.userId] === undefined) {
        player.stats.skipped++;
      }
    }

    const currentQuestion = match.state.questionState.currentQuestion;
    const scores = Array.from(match.state.players.values()).map(p => ({ userId: p.userId, score: p.stats.score }));

    match.state.roundState.winnerId = winnerId;
    match.state.roundState.result = {
      correctAnswer: currentQuestion?.correctAnswer || '',
      winnerId,
      pointsAwarded,
      scores
    };

    if (match.legacyRoom.matchState) {
      match.legacyRoom.matchState.roundStatus = 'showing-result';
      match.legacyRoom.matchState.roundWinnerId = winnerId;
      match.legacyRoom.matchState.roundResult = match.state.roundState.result;
      
      if (currentQuestion) {
        match.legacyRoom.matchState.roundHistories.push({
          question: currentQuestion,
          answers: { ...match.state.answers },
          submitTimes: { ...match.state.submitTimes },
          winnerId,
          pointsAwarded
        });
      }
    }

    console.log(`[MatchEngine] Round Finished. Winner: ${winnerId || 'None'}`);
        match.syncLegacyRoom();
    
    // Legacy support
    match.io.to(match.getRoomId()).emit('round-finished', match.state.roundState.result);

    setTimeout(() => {
      if (match.state.matchStatus === MatchStatus.CANCELLED) return;
      this.loadNextRound(match);
    }, 3000);
  }

  static loadNextRound(match: GameStateInstance) {
        match.state.roundState.currentRound += 1;
    if (match.legacyRoom.matchState) {
      match.legacyRoom.matchState.currentRoundIndex = match.state.roundState.currentRound;
    }
    
    if (match.state.roundState.currentRound >= match.state.roundState.totalRounds) {
      this.finishMatch(match);
    } else {
      this.startRound(match);
    }
  }

  static finishMatch(match: GameStateInstance) {
    MatchLifecycle.setStatus(match, MatchStatus.MATCH_FINISHED);
    
    let maxScore = -1;
    for (const player of match.state.players.values()) {
      if (player.stats.score > maxScore) {
        maxScore = player.stats.score;
        match.state.matchWinnerId = player.userId;
      }
    }

    if (match.legacyRoom) {
        match.legacyRoom.status = 'finished';
    }
    match.stopTimer();

        console.log(`[MatchEngine] Match Finished: ${match.getRoomId()}`);
        match.syncLegacyRoom();
    
    match.io.to(match.getRoomId()).emit('match-finished', match.legacyRoom); // Legacy
  }

  static destroyMatch(match: GameStateInstance) {
    MatchLifecycle.setStatus(match, MatchStatus.CANCELLED);
    match.stopTimer();
  }

  static handlePlayerDisconnect(match: GameStateInstance) {
    if (match.state.matchStatus === MatchStatus.ROUND_ACTIVE || match.state.matchStatus === MatchStatus.COUNTDOWN) {
      match.stopTimer();
      console.log(`[MatchEngine] Match paused due to disconnect: ${match.getRoomId()}`);
    }
  }

  static handlePlayerReconnect(match: GameStateInstance) {
    if (match.state.matchStatus === MatchStatus.ROUND_ACTIVE) {
      // Resume timer
      this.startServerTimer(match, match.state.timerState.timeLeft);
      console.log(`[MatchEngine] Match resumed after reconnect: ${match.getRoomId()}`);
    } else if (match.state.matchStatus === MatchStatus.COUNTDOWN) {
      // Restart countdown
      this.startMatchCountdown(match);
    }
  }

  static handleDisconnectTimeout(match: GameStateInstance, userId: string) {
    if (match.state.matchStatus === MatchStatus.MATCH_FINISHED || match.state.matchStatus === MatchStatus.CANCELLED) return;
    
    // Award win by disconnect
    const remainingPlayer = Array.from(match.state.players.values()).find(p => p.userId !== userId);
    if (remainingPlayer) {
      match.state.matchWinnerId = remainingPlayer.userId;
    }
    console.log(`[MatchEngine] Match Finished due to disconnect timeout: ${match.getRoomId()}`);
    
    MatchLifecycle.setStatus(match, MatchStatus.MATCH_FINISHED);
    
    if (match.legacyRoom) {
        match.legacyRoom.status = 'finished';
    }
    match.stopTimer();

            match.syncLegacyRoom();
    match.io.to(match.getRoomId()).emit('match-finished', match.legacyRoom);
  }
}
