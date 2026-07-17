import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-300 font-sans overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
