import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/ui/PageWrapper';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { useRoom, useTimer } from '../context/RoomContext';
import { getUserId } from '../utils/userId';
import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';

const formatTime = (seconds: number | null) => {
  if (seconds === null) return '--';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) {
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
  return s.toString();
};

const DesktopTimer = React.memo(({ timerDuration }: { timerDuration?: number }) => {
  const timeLeft = useTimer();
  const isTimerLow = timeLeft !== null && timeLeft <= 10;
  const timerPercentage = timeLeft !== null && timerDuration
    ? (timeLeft / timerDuration) * 100
    : 100;

  return (
    <div className="hidden lg:block">
      <Card className="p-6 text-center border-border bg-surface flex flex-col items-center justify-center">
        <p className="text-[10px] text-secondary uppercase tracking-wider font-semibold mb-4">Time Remaining</p>
        <div className={`text-5xl font-mono font-extralight tracking-tight ${isTimerLow ? 'text-danger animate-pulse' : 'text-white'}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="w-full h-1 bg-background rounded-full mt-6 overflow-hidden">
          <motion.div 
            className={`h-full ${isTimerLow ? 'bg-danger' : 'bg-primary'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${timerPercentage}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
      </Card>
    </div>
  );
});

const MobileTimer = React.memo(({ timerDuration }: { timerDuration?: number }) => {
  const timeLeft = useTimer();
  const isTimerLow = timeLeft !== null && timeLeft <= 10;
  const timerPercentage = timeLeft !== null && timerDuration
    ? (timeLeft / timerDuration) * 100
    : 100;

  return (
    <div className="lg:hidden mb-4 bg-surface border border-border rounded-xl p-4 flex items-center justify-between sticky top-[4.5rem] z-20 shadow-md" role="timer" aria-label="Time remaining">
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-secondary uppercase tracking-wider font-semibold">Time</span>
        <span className={`text-xl font-mono font-bold ${isTimerLow ? 'text-danger animate-pulse' : 'text-white'}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
      <div className="w-1/2 h-1.5 bg-background rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${isTimerLow ? 'bg-danger' : 'bg-primary'}`}
          initial={{ width: '100%' }}
          animate={{ width: `${timerPercentage}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </div>
    </div>
  );
});

export default function Battle() {
  const navigate = useNavigate();
  const { room, submitAnswer } = useRoom();
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);

  useEffect(() => {
    const storedRoomId = sessionStorage.getItem('codeDuelRoomId');
    if (!room && !storedRoomId) {
      navigate('/');
    } else if (room?.status === 'finished') {
      navigate('/results');
    } else if (room && room.status !== 'in-progress') {
      navigate('/lobby');
    }
  }, [room, navigate]);

  useEffect(() => {
    if (room?.matchState?.roundStatus === 'playing') {
      setSelectedAnswer(null);
    }
  }, [room?.matchState?.currentRoundIndex, room?.matchState?.roundStatus]);

  if (!room || !room.matchState) {
    return (
      <PageWrapper>
        <Container className="max-w-5xl flex h-[60vh] items-center justify-center">
          <Spinner size={32} className="text-primary" />
          <span className="ml-3 text-secondary">Reconnecting to battle...</span>
        </Container>
      </PageWrapper>
    );
  }

  const matchState = room.matchState;
  const currentQuestion = matchState.questions[matchState.currentRoundIndex];
  const me = room.players.find(p => p.userId === getUserId());
  const opponent = room.players.find(p => p.userId !== getUserId());
  const roundStatus = matchState.roundStatus;

  if (!currentQuestion) {
    return (
      <PageWrapper>
        <Container className="max-w-5xl flex h-[60vh] items-center justify-center">
          <Spinner size={32} className="text-primary" />
          <span className="ml-3 text-secondary">Loading question...</span>
        </Container>
      </PageWrapper>
    );
  }

  const handleOptionClick = (option: string) => {
    if (roundStatus !== 'playing' || me?.status === 'Answered') return;
    
    if (currentQuestion.type === 'Multiple Correct') {
      let newAnswers = Array.isArray(selectedAnswer) ? [...selectedAnswer] : [];
      if (newAnswers.includes(option)) {
        newAnswers = newAnswers.filter(a => a !== option);
      } else {
        newAnswers.push(option);
      }
      setSelectedAnswer(newAnswers);
    } else {
      setSelectedAnswer(option);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer && roundStatus === 'playing') {
      submitAnswer(selectedAnswer);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success bg-success/10 border-success/20';
      case 'Medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'Hard': return 'text-danger bg-danger/10 border-danger/20';
      default: return 'text-secondary bg-surface-hover/20 border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Thinking': return 'text-primary';
      case 'Answered': return 'text-success';
      case 'Disconnected': return 'text-danger';
      default: return 'text-secondary';
    }
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="border-b border-border bg-background sticky top-16 z-10">
        <Container className="max-w-5xl">
          <div className="py-4 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] text-secondary uppercase tracking-wider font-semibold mb-0.5">Room</p>
                <p className="font-mono text-primary font-semibold text-sm mb-0 select-all">{room.id}</p>
              </div>
              <div className="w-px h-6 bg-border"></div>
              <div>
                <p className="text-[10px] text-secondary uppercase tracking-wider font-semibold mb-0.5">Format</p>
                <p className="font-semibold text-white text-sm mb-0">Best of {room.bestOf}</p>
              </div>
              <div className="w-px h-6 bg-border"></div>
              <div>
                <p className="text-[10px] text-secondary uppercase tracking-wider font-semibold mb-0.5">Language</p>
                <p className="font-semibold text-white text-sm mb-0">{room.language}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-secondary uppercase tracking-wider font-semibold mb-0.5">Round Progress</p>
                <p className="font-semibold text-white text-sm mb-0">{matchState.currentRoundIndex + 1} / {room.bestOf}</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Players Panel */}
          <div className="lg:col-span-1 space-y-4 order-2 lg:order-1 lg:sticky lg:top-[7.5rem] lg:self-start">
            {/* Me */}
            <Card className="p-4 border-border bg-surface shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-base text-white mb-0">{me?.name} <span className="text-xs text-secondary font-normal">(You)</span></h3>
                <div className="bg-background px-2.5 py-0.5 rounded-lg border border-border">
                  <span className="font-mono font-bold text-primary text-xs">{me?.score || 0} PTS</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${me?.status === 'Answered' ? 'bg-success' : 'bg-primary animate-pulse'}`}></div>
                <span className={`text-xs font-semibold ${getStatusColor(me?.status || '')}`}>
                  {me?.status === 'Thinking' ? 'SOLVING' : me?.status?.toUpperCase()}
                </span>
              </div>
            </Card>

            {/* Opponent */}
            <Card className="p-4 border-border bg-surface shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-base text-white mb-0">{opponent?.name || 'Opponent'}</h3>
                <div className="bg-background px-2.5 py-0.5 rounded-lg border border-border">
                  <span className="font-mono font-bold text-primary text-xs">{opponent?.score || 0} PTS</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${opponent?.status === 'Answered' ? 'bg-success' : opponent?.status === 'Disconnected' ? 'bg-danger' : 'bg-primary animate-pulse'}`}></div>
                <span className={`text-xs font-semibold ${getStatusColor(opponent?.status || '')}`}>
                  {opponent?.status === 'Thinking' ? 'SOLVING' : opponent?.status?.toUpperCase()}
                </span>
              </div>
            </Card>

            {/* Timer for Desktop */}
            <DesktopTimer timerDuration={matchState.timerDuration} />
          </div>

          {/* Main Battle Area */}
          <div className="lg:col-span-2 order-1 lg:order-2 flex flex-col h-full">
            
            {/* Timer for Mobile/Tablet */}
            <MobileTimer timerDuration={matchState.timerDuration} />
            <Card className="flex-1 flex flex-col border-border bg-surface">
              {/* Question Header */}
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h2 className="text-xl font-bold text-white mb-0">{currentQuestion.title}</h2>
                  <span className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border whitespace-nowrap ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed">
                  <p className="mb-0 text-slate-300">{currentQuestion.question}</p>
                </div>
              </div>

              {/* Question Content */}
              <div className="p-6 flex-1 bg-background/30">
                {currentQuestion.description && (
                  <div className="font-mono text-xs bg-background p-4 rounded-xl border border-border text-slate-200 overflow-x-auto mb-6 leading-relaxed">
                    <pre className="m-0 whitespace-pre break-words sm:break-normal"><code>{currentQuestion.description}</code></pre>
                  </div>
                )}

                <div className="space-y-2.5">
                  {currentQuestion.options?.map((option, idx) => {
                    const isSelected = Array.isArray(selectedAnswer) 
                      ? selectedAnswer.includes(option)
                      : selectedAnswer === option;
                    
                    const isSubmitted = me?.status === 'Answered';
                    const showCorrect = roundStatus === 'showing-result' && 
                      (Array.isArray(currentQuestion.correctAnswer) 
                        ? currentQuestion.correctAnswer.includes(option)
                        : currentQuestion.correctAnswer === option);
                    const showWrong = roundStatus === 'showing-result' && isSelected && !showCorrect;

                    let btnClass = "w-full text-left p-4 min-h-[52px] rounded-xl border transition-all duration-150 font-mono text-xs sm:text-sm focus:outline-none cursor-pointer";
                    
                    if (roundStatus === 'showing-result') {
                      if (showCorrect) {
                        btnClass += " bg-success/15 border-success text-success font-medium";
                      } else if (showWrong) {
                        btnClass += " bg-danger/15 border-danger text-danger font-medium";
                      } else {
                        btnClass += " bg-surface border-border text-secondary opacity-40 cursor-not-allowed";
                      }
                    } else if (isSelected) {
                      btnClass += " bg-primary/10 border-primary text-white font-medium shadow-sm shadow-primary/5";
                    } else {
                      btnClass += ` bg-surface border-border text-secondary ${!isSubmitted ? 'hover:bg-surface-hover hover:text-white' : 'opacity-60 cursor-not-allowed'}`;
                    }

                    return (
                      <button
                        key={idx}
                        className={btnClass}
                        onClick={() => handleOptionClick(option)}
                        disabled={isSubmitted || roundStatus !== 'playing'}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-md bg-background border border-border flex items-center justify-center text-[10px] font-semibold text-secondary shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="break-all leading-normal">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Area */}
              <div className="p-5 border-t border-border bg-background/50">
                {roundStatus === 'playing' ? (
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-secondary font-medium">
                      {currentQuestion.type === 'Multiple Correct' ? 'Select all correct options.' : 'Choose one response.'}
                    </span>
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedAnswer || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0) || me?.status === 'Answered'}
                      className="px-6 h-[42px] bg-primary hover:bg-primary-hover disabled:bg-surface disabled:text-secondary border border-transparent disabled:border-border text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed"
                    >
                      {me?.status === 'Answered' ? 'Waiting for Opponent...' : 'Submit Choice'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-1">
                    <div>
                      {matchState.roundWinnerId === me?.userId ? (
                        <div className="flex items-center gap-2 text-success">
                          <Trophy size={16} />
                          <span className="font-bold text-sm">Round Won! (+{matchState.roundResult?.pointsAwarded} PTS)</span>
                        </div>
                      ) : matchState.roundWinnerId === opponent?.userId ? (
                        <div className="text-danger font-semibold text-sm">
                          Round lost. Opponent was faster.
                        </div>
                      ) : (
                        <div className="text-secondary font-medium text-sm">
                          Round tied. Nobody answered correctly.
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-secondary animate-pulse font-mono">
                      Loading next round...
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
          
        </div>
      </Container>
    </PageWrapper>
  );
}
