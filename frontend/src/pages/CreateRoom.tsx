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

export default function CreateRoom() {
  const navigate = useNavigate();
  const { createRoom, error, clearError } = useRoom();
  const [playerName, setPlayerName] = useState('');
  const [bestOf, setBestOf] = useState<number>(3);
  const [language, setLanguage] = useState<string>('Python');
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

  const isNameValid = playerName.trim().length > 0;

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNameValid) return;
    
    setIsSubmitting(true);
    localStorage.setItem('codeDuelPlayerName', playerName.trim());
    
    try {
      await createRoom(playerName.trim(), bestOf, language);
      navigate('/lobby');
    } catch (err) {
      console.error('Failed to create room:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const bestOfOptions = [3, 5, 10, 15];
  const languages = ['Python', 'JavaScript', 'C++', 'Java'];

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
              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Create Battle Room</h2>
              <p className="text-xs sm:text-sm text-secondary">
                Configure your combat settings and initialize the arena
              </p>
            </div>
            
            <form onSubmit={handleCreateRoom} className="space-y-6">
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

              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-white uppercase tracking-wider">
                  Target Language
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`h-[44px] rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                        language === lang
                          ? 'bg-primary text-white border-transparent shadow-sm'
                          : 'bg-background border border-border text-secondary hover:bg-surface-hover hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-white uppercase tracking-wider">
                  Rounds (Best Of)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {bestOfOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setBestOf(option)}
                      className={`h-[44px] rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                        bestOf === option
                          ? 'bg-primary text-white border-transparent shadow-sm'
                          : 'bg-background border border-border text-secondary hover:bg-surface-hover hover:text-white'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-4"
                size="lg"
                disabled={!isNameValid}
                isLoading={isSubmitting}
              >
                Create Room
              </Button>
            </form>
          </Card>
        </Section>
      </Container>
    </PageWrapper>
  );
}
