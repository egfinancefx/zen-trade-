
import React, { useState } from 'react';
import { Edit2, Trash2, Search, Filter, ExternalLink } from 'lucide-react';
import { Trade } from '../types';

interface TradeListProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
}

const TradeList: React.FC<TradeListProps> = ({ trades, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrades = trades.filter(t => 
    t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.strategy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Trade Log</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search symbol or strategy..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/50 w-full md:w-64"
            />
          </div>
          <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl px-4 py-2 text-sm transition-colors text-zinc-400">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-[#0d0d0f] border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 text-zinc-500 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Qty</th>
                <th className="px-6 py-4 text-right">Entry</th>
                <th className="px-6 py-4 text-right">Exit</th>
                <th className="px-6 py-4 text-right">P/L</th>
                <th className="px-6 py-4">Strategy</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredTrades.map(trade => (
                <tr key={trade.id} className="group hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-200 uppercase">{trade.symbol}</span>
                      <span className="text-[10px] text-zinc-500 mono">{new Date(trade.entryDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      trade.side === 'LONG' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400`}>
                      {trade.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-zinc-400">{trade.quantity}</td>
                  <td className="px-6 py-4 text-right font-medium text-zinc-400">${trade.entryPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-medium text-zinc-400">{trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '—'}</td>
                  <td className={`px-6 py-4 text-right font-bold ${
                    (trade.pnl || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {trade.pnl ? (trade.pnl >= 0 ? `+$${trade.pnl.toFixed(2)}` : `-$${Math.abs(trade.pnl).toFixed(2)}`) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-zinc-500 font-medium">{trade.strategy}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(trade)}
                        className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(trade.id)}
                        className="p-1.5 hover:bg-rose-900/30 rounded text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTrades.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-zinc-500">
                    No trades found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TradeList;
