import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, Plus, Settings, BrainCircuit, Wallet } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TradeList from './components/TradeList';
import TradeForm from './components/TradeForm';
import Analysis from './components/Analysis';
import { Trade } from './types';

const App: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('zentrade_trades');
    return saved ? JSON.parse(saved) : [];
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | undefined>();

  useEffect(() => {
    localStorage.setItem('zentrade_trades', JSON.stringify(trades));
  }, [trades]);

  const addOrUpdateTrade = (trade: Trade) => {
    if (editingTrade) {
      setTrades(prev => prev.map(t => (t.id === trade.id ? trade : t)));
    } else {
      setTrades(prev => [trade, ...prev]);
    }
    setIsFormOpen(false);
    setEditingTrade(undefined);
  };

  const deleteTrade = (id: string) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      setTrades(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setIsFormOpen(true);
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-[#0a0a0b] text-zinc-100">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-800 bg-[#0d0d0f] flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">ZenTrade</h1>
            </div>

            <nav className="space-y-1">
              <SidebarLink to="/" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
              <SidebarLink to="/trades" icon={<List className="w-5 h-5" />} label="Trade Log" />
              <SidebarLink to="/analysis" icon={<BrainCircuit className="w-5 h-5" />} label="AI Insights" />
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-zinc-800">
            <button 
              onClick={() => { setEditingTrade(undefined); setIsFormOpen(true); }}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-900/20"
            >
              <Plus className="w-5 h-5" />
              <span>New Trade</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <header className="h-16 border-b border-zinc-800 bg-[#0d0d0f]/50 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-widest">
              Trading Journal v1.0
            </h2>
            <div className="flex items-center gap-4">
              <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </header>

          <div className="p-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard trades={trades} />} />
              <Route path="/trades" element={<TradeList trades={trades} onEdit={handleEdit} onDelete={deleteTrade} />} />
              <Route path="/analysis" element={<Analysis trades={trades} />} />
            </Routes>
          </div>
        </main>

        {/* Trade Form Modal */}
        {isFormOpen && (
          <TradeForm 
            onClose={() => { setIsFormOpen(false); setEditingTrade(undefined); }} 
            onSubmit={addOrUpdateTrade} 
            initialData={editingTrade}
          />
        )}
      </div>
    </Router>
  );
};

const SidebarLink: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? 'bg-zinc-800 text-white' 
          : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50'
      }`}
    >
      <span className={isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400 transition-colors'}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default App;