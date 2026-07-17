import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
      <div className="max-w-md space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-primary font-bold">404 Error</h3>
        <h1 className="text-4xl font-bold tracking-tight text-white mt-2">Page not found</h1>
        <p className="text-secondary text-sm leading-relaxed max-w-sm mx-auto">
          The arena you are looking for does not exist or has been closed. Please return to the homepage to create a new battle.
        </p>
        <div className="pt-4">
          <Button onClick={() => navigate('/')} size="md" variant="primary">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
