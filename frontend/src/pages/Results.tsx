import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../context/RoomContext';
import { PageWrapper } from '../components/ui/PageWrapper';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Trophy, Copy, Check, Clock, Code, Target, FastForward, Play, History as HistoryIcon, Home } from 'lucide-react';
import { getUserId } from '../utils/userId';
import { saveMatchHistory, MatchRecord } from '../utils/history';
import { AnimatePresence } from 'motion/react';
import { Toast } from '../components/ui/Toast';

export default function Results() {
  const navigate = useNavigate();
  const { room, createRoom } = useRoom();
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!room || room.status !== 'finished') {
      navigate('/');
      return;
    }

    if (room && room.matchState) {
      const me = room.players.find(p => p.userId === getUserId());
      const opponent = room.players.find(p => p.userId !== getUserId());
      if (!me || !opponent) return;

      const myScore = me.score;
      const opponentScore = opponent.score;
      let result: 'Win' | 'Loss' | 'Draw' = 'Draw';
      if (myScore > opponentScore) result = 'Win';
      else if (myScore < opponentScore) result = 'Loss';

      let correctCount = 0;
      room.matchState.roundHistories.forEach(r => {
        if (r.winnerId === me.userId) {
          correctCount++;
        }
      });
      const accuracy = room.bestOf > 0 ? Math.round((correctCount / room.bestOf) * 100) : 0;
      const duration = Math.floor((Date.now() - room.createdAt) / 1000);

      const record: MatchRecord = {
        id: room.id,
        myId: me.userId,
        myName: me.name,
        opponentId: opponent.userId,
        opponentName: opponent.name,
        language: room.language,
        bestOf: room.bestOf,
        result,
        myScore,
        opponentScore,
        accuracy,
        date: Date.now(),
        duration,
        rounds: room.matchState.roundHistories
      };

      saveMatchHistory(record);
    }
  }, [room, navigate]);

  if (!room || room.status !== 'finished' || !room.matchState) return null;

  const me = room.players.find(p => p.userId === getUserId());
  const opponent = room.players.find(p => p.userId !== getUserId());

  const iWon = (me?.score || 0) > (opponent?.score || 0);
  const isDraw = (me?.score || 0) === (opponent?.score || 0);

  const durationStr = (() => {
    const d = Math.floor((Date.now() - room.createdAt) / 1000);
    const m = Math.floor(d / 60);
    const s = d % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  })();

  const formatAnswer = (ans: string | string[] | undefined) => {
    if (Array.isArray(ans)) return ans.join(', ');
    return ans || 'None';
  };

  const getMyAccuracy = () => {
    let correct = 0;
    room.matchState?.roundHistories.forEach(r => {
      if (r.winnerId === me?.userId) correct++;
    });
    return Math.round((correct / room.bestOf) * 100);
  };

  const getStats = () => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    let totalTime = 0;
    let fastest = Infinity;

    room.matchState?.roundHistories.forEach(r => {
      const myAns = r.answers[me?.userId || ''];
      const myTime = r.submitTimes[me?.userId || ''];
      if (!myAns) {
        skipped++;
      } else if (r.winnerId === me?.userId) {
        correct++;
        totalTime += myTime || 0;
        if (myTime && myTime < fastest) fastest = myTime;
      } else {
        wrong++;
        totalTime += myTime || 0;
      }
    });

    const avg = (correct + wrong) > 0 ? Math.round(totalTime / (correct + wrong)) : 0;
    return { correct, wrong, skipped, avg, fastest: fastest === Infinity ? 0 : fastest };
  };

  const stats = getStats();
  const accuracy = getMyAccuracy();

  const handleCopySummary = () => {
    const summary = `⚔️ CODEDUEL RESULT\n\n🏆 Winner: ${iWon ? me?.name : isDraw ? 'Draw' : opponent?.name}\n🔥 Final Score: ${me?.score} - ${opponent?.score}\n💻 Language: ${room.language}\n🎯 Accuracy: ${accuracy}%\n⏱ Duration: ${durationStr}\nBest Of ${room.bestOf}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setShowToast(true);
    setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 3000);
  };

  const handlePlayAgain = async () => {
    try {
      await createRoom(me?.name || 'Player 1', room.bestOf, room.language);
      navigate('/lobby');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PageWrapper>
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
        <AnimatePresence>
          {showToast && (
            <Toast variant="success" message="Match summary copied!" onClose={() => setShowToast(false)} />
          )}
        </AnimatePresence>
      </div>

      <Container className="max-w-5xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Result Card & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-8 text-center border-border bg-surface shadow-sm">
              <div className="flex justify-center mb-6">
                <div className={`p-4 rounded-full ${iWon ? 'bg-warning/15 text-warning' : isDraw ? 'bg-surface-hover text-secondary' : 'bg-danger/15 text-danger'}`}>
                  <Trophy size={40} />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-1 text-white">
                {iWon ? 'Victory!' : isDraw ? 'Draw!' : 'Defeat'}
              </h1>
              <p className="text-[11px] text-secondary mb-6 uppercase tracking-wider font-semibold">
                Match Completed
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className={`p-4 rounded-xl border ${iWon ? 'bg-warning/5 border-warning/20' : 'bg-background border-border'}`}>
                  <p className="text-[11px] text-secondary mb-1 truncate font-medium">{me?.name}</p>
                  <p className={`text-2xl font-mono font-bold ${iWon ? 'text-warning' : 'text-white'}`}>{me?.score}</p>
                </div>
                <div className={`p-4 rounded-xl border ${!iWon && !isDraw ? 'bg-warning/5 border-warning/20' : 'bg-background border-border'}`}>
                  <p className="text-[11px] text-secondary mb-1 truncate font-medium">{opponent?.name || 'Opponent'}</p>
                  <p className={`text-2xl font-mono font-bold ${!iWon && !isDraw ? 'text-warning' : 'text-white'}`}>{opponent?.score}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-left text-xs mb-6 bg-background p-4 rounded-xl border border-border">
                <div>
                  <p className="text-[10px] text-secondary uppercase tracking-wider mb-0.5">Language</p>
                  <p className="font-semibold text-white flex items-center gap-1.5 mb-0"><Code size={13} className="text-secondary" /> {room.language}</p>
                </div>
                <div>
                  <p className="text-[10px] text-secondary uppercase tracking-wider mb-0.5">Format</p>
                  <p className="font-semibold text-white flex items-center gap-1.5 mb-0"><Target size={13} className="text-secondary" /> Best of {room.bestOf}</p>
                </div>
                <div>
                  <p className="text-[10px] text-secondary uppercase tracking-wider mb-0.5">Accuracy</p>
                  <p className="font-semibold text-white mb-0">{accuracy}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-secondary uppercase tracking-wider mb-0.5">Duration</p>
                  <p className="font-semibold text-white flex items-center gap-1.5 mb-0"><Clock size={13} className="text-secondary" /> {durationStr}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handlePlayAgain}
                  className="w-full h-[46px] bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:-translate-y-[1px]"
                >
                  <Play size={16} /> Play Again
                </button>
                <button
                  onClick={handleCopySummary}
                  className="w-full h-[46px] bg-surface hover:bg-surface-hover text-white text-sm font-semibold rounded-xl border border-border transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-[1px]"
                >
                  {copied ? <Check size={16} className="text-success"/> : <Copy size={16} />} Copy Match Report
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/history')}
                    className="flex-1 h-[44px] bg-background hover:bg-surface-hover/30 text-secondary hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 border border-border cursor-pointer"
                  >
                    <HistoryIcon size={14} /> History
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="flex-1 h-[44px] bg-background hover:bg-surface-hover/30 text-secondary hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 border border-border cursor-pointer"
                  >
                    <Home size={14} /> Home
                  </button>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border bg-surface">
              <h3 className="font-bold text-white mb-4 uppercase tracking-wider text-[11px]">Performance Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-secondary">Rounds Won / Lost / Skipped</span>
                    <span className="font-semibold text-slate-200">
                      <span className="text-success">{stats.correct}</span> / <span className="text-danger">{stats.wrong}</span> / <span className="text-secondary">{stats.skipped}</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-background rounded-full flex overflow-hidden border border-border/20">
                    <div className="bg-success h-full transition-all" style={{ width: `${(stats.correct/room.bestOf)*100}%` }}></div>
                    <div className="bg-danger h-full transition-all" style={{ width: `${(stats.wrong/room.bestOf)*100}%` }}></div>
                    <div className="bg-secondary/40 h-full transition-all" style={{ width: `${(stats.skipped/room.bestOf)*100}%` }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded-xl border border-border">
                  <span className="text-xs text-secondary font-medium">Avg Answer Speed</span>
                  <span className="font-mono font-semibold text-white text-xs">{stats.avg}s</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded-xl border border-border">
                  <span className="text-xs text-secondary font-medium flex items-center gap-1.5"><FastForward size={13} className="text-primary"/> Peak Answer Speed</span>
                  <span className="font-mono font-semibold text-white text-xs">{stats.fastest}s</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Question Review */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              Question Review
            </h2>
            {room.matchState.roundHistories.map((r, i) => {
              const myAns = r.answers[me?.userId || ''];
              const oppAns = r.answers[opponent?.userId || ''];
              const isMyWin = r.winnerId === me?.userId;
              const myTime = r.submitTimes[me?.userId || ''];
              
              let statusText = 'Skipped';
              let statusColor = 'text-secondary bg-surface-hover/50 border-border';
              if (myAns) {
                if (isMyWin) {
                  statusText = 'Correct (Fastest)';
                  statusColor = 'text-success bg-success/10 border-success/20';
                } else {
                  let actuallyCorrect: boolean;
                  if (Array.isArray(myAns) && Array.isArray(r.question.correctAnswer)) {
                    actuallyCorrect = JSON.stringify([...myAns].sort()) === JSON.stringify([...r.question.correctAnswer].sort());
                  } else {
                    actuallyCorrect = myAns === r.question.correctAnswer;
                  }
                  
                  if (actuallyCorrect) {
                    statusText = 'Correct (Slow)';
                    statusColor = 'text-warning bg-warning/10 border-warning/20';
                  } else {
                    statusText = 'Wrong';
                    statusColor = 'text-danger bg-danger/10 border-danger/20';
                  }
                }
              }

              return (
                <Card key={i} className="p-6 border-border bg-surface">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 pb-4 border-b border-border">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-secondary font-mono text-xs font-semibold">ROUND {i + 1}</span>
                        <span className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${statusColor}`}>
                          {statusText}
                        </span>
                        {isMyWin && <span className="text-success text-xs font-semibold font-mono">+{r.pointsAwarded} PTS</span>}
                      </div>
                      <h4 className="font-semibold text-white mb-0 text-base">{r.question.title}</h4>
                    </div>
                    {myTime && (
                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[10px] text-secondary uppercase tracking-wider font-semibold">Response Speed</span>
                        <p className="font-mono text-white text-sm font-semibold mt-0.5">{myTime}s</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="bg-background p-3.5 rounded-xl border border-border">
                      <p className="text-[10px] text-secondary mb-1.5 font-sans font-semibold uppercase tracking-wider">Correct Answer</p>
                      <p className="text-success font-medium break-all whitespace-pre-wrap m-0">{formatAnswer(r.question.correctAnswer)}</p>
                    </div>
                    <div className="bg-background p-3.5 rounded-xl border border-border">
                      <p className="text-[10px] text-secondary mb-1.5 font-sans font-semibold uppercase tracking-wider">Your Submission</p>
                      <p className={`font-medium break-all whitespace-pre-wrap m-0 ${!myAns ? "text-secondary" : isMyWin || statusText === 'Correct (Slow)' ? "text-success" : "text-danger"}`}>
                        {formatAnswer(myAns)}
                      </p>
                    </div>
                    <div className="bg-background p-3.5 rounded-xl border border-border">
                      <p className="text-[10px] text-secondary mb-1.5 font-sans font-semibold uppercase tracking-wider">Opponent Submission</p>
                      <p className={`font-medium break-all whitespace-pre-wrap m-0 ${!oppAns ? "text-secondary" : r.winnerId === opponent?.userId ? "text-success" : "text-slate-300"}`}>
                        {formatAnswer(oppAns)}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

        </div>
      </Container>
    </PageWrapper>
  );
}
