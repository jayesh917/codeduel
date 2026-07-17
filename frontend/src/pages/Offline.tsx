import { WifiOff } from 'lucide-react';
import { PageWrapper } from '../components/ui/PageWrapper';
import { Container } from '../components/ui/Container';

export default function Offline() {
  return (
    <PageWrapper>
      <Container className="flex flex-col items-center justify-center h-[80vh] text-center max-w-md">
        <div className="w-16 h-16 bg-surface rounded-2xl border border-border flex items-center justify-center mb-6 text-secondary">
          <WifiOff size={28} />
        </div>
        <h2 className="text-xl font-semibold text-white mb-3">No connection detected</h2>
        <p className="text-secondary text-sm leading-relaxed max-w-xs mx-auto">
          CodeDuel requires an active internet connection to play real-time battles. Please check your network and we'll automatically reconnect.
        </p>
      </Container>
    </PageWrapper>
  );
}
