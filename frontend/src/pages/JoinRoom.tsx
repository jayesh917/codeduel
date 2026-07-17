import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { PageWrapper } from '../components/ui/PageWrapper';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { useRoom } from '../context/RoomContext';
import { Toast } from '../components/ui/Toast';
import { AnimatePresence } from 'motion/react';

export default function JoinRoom() {
  const navigate = useNavigate();
  const { joinRoom, error, clearError } = useRoom();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('codeDuelPlayerName');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  useEffect(() => {
    if (error) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value.substring(0, 20));
  };

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 6);
    setRoomCode(value);
  };

  const isNameValid = playerName.trim().length > 0;
  const isRoomCodeValid = roomCode.length === 6;
  const isValid = isNameValid && isRoomCodeValid;

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    setIsSubmitting(true);
    localStorage.setItem('codeDuelPlayerName', playerName.trim());
    
    try {
      await joinRoom(playerName.trim(), roomCode);
      navigate('/lobby');
    } catch (err) {
      console.error('Failed to join room:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <Container className="max-w-md">
        <Section className="pt-16 pb-24">
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
            <AnimatePresence>
              {showToast && error && (
                <Toast variant="error" message={error} onClose={() => { setShowToast(false); clearError(); }} />
              )}
            </AnimatePresence>
          </div>

          <Card className="p-8 border border-border bg-surface">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Join Battle Room</h2>
              <p className="text-xs sm:text-sm text-secondary">
                Enter your opponent's room code to enter the arena
              </p>
            </div>

            <form onSubmit={handleJoinRoom} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="playerName" className="text-xs font-semibold text-white uppercase tracking-wider">
                    Player Name
                  </label>
                  <span className="text-[10px] text-secondary font-mono">
                    {playerName.length}/20
                  </span>
                </div>
                <Input
                  id="playerName"
                  type="text"
                  placeholder="Enter your username"
                  value={playerName}
                  onChange={handleNameChange}
                  autoComplete="off"
                  hasError={playerName.length > 0 && !isNameValid}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="roomCode" className="block text-xs font-semibold text-white uppercase tracking-wider">
                  Room Code
                </label>
                <Input
                  id="roomCode"
                  type="text"
                  placeholder="e.g. A7F9KD"
                  value={roomCode}
                  onChange={handleRoomCodeChange}
                  autoComplete="off"
                  className="tracking-[0.25em] uppercase font-mono placeholder:tracking-normal placeholder:font-sans text-center text-lg h-[50px]"
                />
                <p className="text-[11px] text-secondary text-center mt-1">
                  6-character alphanumeric code
                </p>
              </div>

              <Button
                type="submit"
                className="w-full mt-4"
                size="lg"
                disabled={!isValid}
                isLoading={isSubmitting}
              >
                Join Room
              </Button>
            </form>
          </Card>
        </Section>
      </Container>
    </PageWrapper>
  );
}
