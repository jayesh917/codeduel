import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border text-secondary py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-xs sm:text-sm font-light">
          &copy; {new Date().getFullYear()} CodeDuel. All rights reserved.
        </div>
        <div className="flex gap-6 text-xs sm:text-sm font-medium">
          <Link to="/" className="hover:text-white transition-colors">Status</Link>
          <Link to="/" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="/" className="hover:text-white transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
