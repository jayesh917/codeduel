import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/ui/PageWrapper';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Toast } from '../components/ui/Toast';
import { useRoom } from '../context/RoomContext';
import { Copy, Check } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

export default function Lobby() {
  const navigate = useNavigate();
  const { room } = useRoom();
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!room) {
      navigate('/');
    } else if (room.status === 'in-progress') {
      navigate('/battle');
    }
  }, [room, navigate]);

  if (!room) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setShowToast(true);
    setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 3000);
  };

  const host = room.players.find((p) => p.isHost);
  const player2 = room.players.find((p) => !p.isHost);

  return (
    <PageWrapper>
      <Container className="max-w-xl">
        <Section className="pt-16 pb-24">
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
            <AnimatePresence>
              {showToast && (
                <Toast variant="success" message="Room code copied to clipboard!" onClose={() => setShowToast(false)} />
              )}
            </AnimatePresence>
          </div>

          <Card className="p-8 border border-border bg-surface">
            <div className="flex justify-between items-center mb-8 border-b border-border pb-5">
              <h2 className="text-xl sm:text-2xl font-bold mb-0 flex items-center gap-3">
                Room Code: <span className="font-mono text-primary tracking-wider font-semibold bg-background px-3 py-1 rounded-lg border border-border">{room.id}</span>
              </h2>
              <button
                onClick={handleCopy}
                className="w-10 h-10 flex items-center justify-center text-secondary hover:text-white transition-all rounded-xl hover:bg-surface-hover border border-border cursor-pointer"
                title="Copy Room Code"
              >
                {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Host Player</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-base text-white">{host?.name || 'Unknown'}</p>
                  {host && !host.connected && (
                    <span className="text-[10px] text-danger bg-danger/10 px-2 py-0.5 rounded font-medium border border-danger/20">Offline</span>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Match Format</p>
                <p className="font-medium text-base text-white">Best of {room.bestOf}</p>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Player 2</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-base text-white">{player2?.name || 'Waiting...'}</p>
                  {player2 && !player2.connected && (
                    <span className="text-[10px] text-danger bg-danger/10 px-2 py-0.5 rounded font-medium border border-danger/20">Offline</span>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Language</p>
                <p className="font-medium text-base text-white">{room.language}</p>
              </div>
            </div>
            
            <div className="bg-background rounded-xl p-8 flex flex-col items-center justify-center border border-border border-dashed text-center">
              {room.players.length < 2 ? (
                <>
                  <Spinner size={24} className="mb-4 text-primary" />
                  <p className="text-base font-semibold text-white mb-1">Waiting for opponent to connect...</p>
                  <p className="text-xs text-secondary max-w-sm">Share the room code with your friend. The game will launch automatically when they join.</p>
                </>
              ) : (
                <>
                  {room.players.every((p) => p.connected) ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-success/15 text-success flex items-center justify-center mb-4">
                        <Check size={20} />
                      </div>
                      <p className="text-base font-semibold text-white mb-1">Both players connected.</p>
                      <p className="text-xs text-secondary">Synchronizing state and launching match...</p>
                    </>
                  ) : (
                    <>
                      <Spinner size={24} className="mb-4 text-danger" />
                      <p className="text-base font-semibold text-white mb-1">Opponent connection lost.</p>
                      <p className="text-xs text-secondary">Waiting for reconnection...</p>
                    </>
                  )}
                </>
              )}
            </div>
          </Card>
        </Section>
      </Container>
    </PageWrapper>
  );
}
