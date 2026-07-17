import { Link, useLocation } from 'react-router-dom';
import { Code2 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navLinks = [
    { path: '/create-room', label: 'Create Room' },
    { path: '/join-room', label: 'Join Room' },
    { path: '/lobby', label: 'Lobby' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary-hover transition-colors shadow-sm">
              <Code2 className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white select-none">CodeDuel</span>
          </Link>
          <nav className="flex items-center gap-6 sm:gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-150 py-1.5 px-3 rounded-lg ${
                    isActive 
                      ? 'text-primary bg-primary/5' 
                      : 'text-secondary hover:text-white hover:bg-surface-hover/30'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
