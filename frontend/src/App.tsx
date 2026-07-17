import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoomProvider } from './context/RoomContext';
import { Spinner } from './components/ui/Spinner';
import Offline from './pages/Offline';
import AppLayout from './layouts/AppLayout';

const Home = React.lazy(() => import('./pages/Home'));
const Lobby = React.lazy(() => import('./pages/Lobby'));
const Battle = React.lazy(() => import('./pages/Battle'));
const Results = React.lazy(() => import('./pages/Results'));
const History = React.lazy(() => import('./pages/History'));
const CreateRoom = React.lazy(() => import('./pages/CreateRoom'));
const JoinRoom = React.lazy(() => import('./pages/JoinRoom'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOffline) {
    return <Offline />;
  }

  return (
    <Router>
      <RoomProvider>
        <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-900"><Spinner size={32} className="text-blue-500" /></div>}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/create-room" element={<CreateRoom />} />
              <Route path="/join-room" element={<JoinRoom />} />
              <Route path="/lobby" element={<Lobby />} />
              <Route path="/battle" element={<Battle />} />
              <Route path="/results" element={<Results />} />
              <Route path="/history" element={<History />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </RoomProvider>
    </Router>
  );
}

export default App;
