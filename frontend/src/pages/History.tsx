import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/ui/PageWrapper';
import { Container } from '../components/ui/Container';
import { getMatchHistory, MatchRecord } from '../utils/history';
import { Home, Search, ArrowUpDown, ChevronDown, Download } from 'lucide-react';
import { motion } from 'motion/react';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<MatchRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState<'All' | 'Win' | 'Loss' | 'Draw'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    setHistory(getMatchHistory());
  }, []);

  const filteredHistory = useMemo(() => {
    let result = history;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m => 
        m.opponentName.toLowerCase().includes(term) || 
        m.language.toLowerCase().includes(term)
      );
    }

    if (filterResult !== 'All') {
      result = result.filter(m => m.result === filterResult);
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') return b.date - a.date;
      return a.date - b.date;
    });

    return result;
  }, [history, searchTerm, filterResult, sortBy]);

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "codeduel_history.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <PageWrapper>
      <div className="border-b border-border bg-background sticky top-16 z-10">
        <Container className="max-w-6xl">
          <div className="py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-white flex items-center gap-3 mb-0">
              <button 
                onClick={() => navigate('/')}
                className="w-10 h-10 flex items-center justify-center text-secondary hover:text-white transition-all rounded-xl hover:bg-surface border border-border cursor-pointer"
                title="Go Home"
              >
                <Home size={18} />
              </button>
              Match History
            </h1>
            {history.length > 0 && (
              <button 
                onClick={exportJSON}
                className="flex items-center justify-center gap-2 text-xs font-semibold text-white bg-surface hover:bg-surface-hover px-4 h-[38px] rounded-xl border border-border transition-all cursor-pointer"
              >
                <Download size={14} /> Export JSON
              </button>
            )}
          </div>
        </Container>
      </div>

      <Container className="py-8 max-w-6xl">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-surface rounded-2xl border border-border flex items-center justify-center mb-6 text-secondary">
              <Search size={28} />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No matches played yet</h2>
            <p className="text-secondary mb-8 max-w-sm text-sm">
              Your match history will appear here once you complete a CodeDuel match.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 h-[46px] rounded-xl text-sm bg-primary hover:bg-primary-hover text-white font-medium transition-all cursor-pointer"
            >
              Start Playing
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                <input 
                  type="text"
                  placeholder="Search opponent or language..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl h-[40px] pl-10 pr-4 text-sm text-white placeholder-secondary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              
              <div className="flex gap-3">
                <div className="relative">
                  <select 
                    value={filterResult}
                    onChange={(e) => setFilterResult(e.target.value as 'All' | 'Win' | 'Loss' | 'Draw')}
                    className="appearance-none bg-surface border border-border rounded-xl h-[40px] pl-4 pr-10 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-all outline-none"
                  >
                    <option value="All">All Results</option>
                    <option value="Win">Wins</option>
                    <option value="Loss">Losses</option>
                    <option value="Draw">Draws</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                </div>
                
                <button
                  onClick={() => setSortBy(prev => prev === 'newest' ? 'oldest' : 'newest')}
                  className="flex items-center gap-2 bg-surface border border-border rounded-xl px-4 h-[40px] text-sm text-white hover:bg-surface-hover transition-all cursor-pointer outline-none"
                >
                  <ArrowUpDown size={14} className="text-secondary" />
                  {sortBy === 'newest' ? 'Newest' : 'Oldest'}
                </button>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background text-secondary text-[11px] uppercase tracking-wider border-b border-border">
                      <th className="px-6 py-3.5 font-semibold">Date</th>
                      <th className="px-6 py-3.5 font-semibold">Opponent</th>
                      <th className="px-6 py-3.5 font-semibold">Language</th>
                      <th className="px-6 py-3.5 font-semibold">Mode</th>
                      <th className="px-6 py-3.5 font-semibold">Result</th>
                      <th className="px-6 py-3.5 font-semibold">Score</th>
                      <th className="px-6 py-3.5 font-semibold">Accuracy</th>
                      <th className="px-6 py-3.5 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredHistory.map((m, idx) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.2 }}
                        key={m.id + idx} 
                        className="hover:bg-surface-hover/20 transition-colors"
                      >
                        <td className="px-6 py-4.5 whitespace-nowrap text-xs sm:text-sm text-secondary">
                          {formatDate(m.date)}
                        </td>
                        <td className="px-6 py-4.5 whitespace-nowrap text-xs sm:text-sm font-medium text-white">
                          {m.opponentName}
                        </td>
                        <td className="px-6 py-4.5 whitespace-nowrap text-xs sm:text-sm text-slate-300">
                          <span className="px-2 py-0.5 bg-background rounded-md border border-border text-xs text-secondary font-mono">{m.language}</span>
                        </td>
                        <td className="px-6 py-4.5 whitespace-nowrap text-xs sm:text-sm text-secondary">
                          Best of {m.bestOf}
                        </td>
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${
                            m.result === 'Win' ? 'text-success bg-success/10 border-success/20' :
                            m.result === 'Loss' ? 'text-danger bg-danger/10 border-danger/20' :
                            'text-secondary bg-surface-hover/25 border-border'
                          }`}>
                            {m.result}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 whitespace-nowrap text-xs sm:text-sm font-mono font-medium text-white">
                          {m.myScore} - {m.opponentScore}
                        </td>
                        <td className="px-6 py-4.5 whitespace-nowrap text-xs sm:text-sm text-secondary">
                          {m.accuracy}%
                        </td>
                        <td className="px-6 py-4.5 whitespace-nowrap text-xs sm:text-sm text-secondary font-mono">
                          {formatDuration(m.duration)}
                        </td>
                      </motion.tr>
                    ))}
                    {filteredHistory.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-secondary text-sm">
                          No matches match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Container>
    </PageWrapper>
  );
}
