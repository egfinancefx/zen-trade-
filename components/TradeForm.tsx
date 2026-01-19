import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Trade, TradeSide, TradeStatus } from '../types';

interface TradeFormProps {
  onClose: () => void;
  onSubmit: (trade: Trade) => void;
  initialData?: Trade;
}

const TradeForm: React.FC<TradeFormProps> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<Trade>>({
    symbol: '',
    side: 'LONG',
    status: 'CLOSED',
    entryDate: new Date().toISOString().split('T')[0],
    entryPrice: 0,
    exitPrice: undefined,
    quantity: 0,
    fees: 0,
    strategy: 'Breakout',
    notes: '',
    ...initialData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate P/L automatically if closed
    let pnl = undefined;
    if (formData.status === 'CLOSED' && formData.entryPrice && formData.exitPrice && formData.quantity) {
      const multiplier = formData.side === 'LONG' ? 1 : -1;
      pnl = (formData.exitPrice - formData.entryPrice) * formData.quantity * multiplier - (formData.fees || 0);
    }

    const trade: Trade = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      symbol: (formData.symbol || '').toUpperCase(),
      side: formData.side as TradeSide,
      status: formData.status as TradeStatus,
      entryDate: formData.entryDate!,
      exitDate: formData.exitDate,
      entryPrice: Number(formData.entryPrice),
      exitPrice: formData.exitPrice ? Number(formData.exitPrice) : undefined,
      quantity: Number(formData.quantity),
      fees: Number(formData.fees),
      strategy: formData.strategy!,
      notes: formData.notes!,
      pnl
    };

    onSubmit(trade);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#0d0d0f] border border-zinc-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-indigo-500/10">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-xl font-bold">{initialData ? 'Edit Trade' : 'Log New Trade'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Symbol & Side */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Symbol</label>
                <input 
                  required
                  type="text" 
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  placeholder="e.g. BTCUSDT"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Trade Side</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, side: 'LONG' })}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      formData.side === 'LONG' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                    }`}
                  >
                    LONG
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, side: 'SHORT' })}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      formData.side === 'SHORT' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                    }`}
                  >
                    SHORT
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Quantity</label>
                  <input 
                    required
                    type="number" 
                    step="any"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Entry Price</label>
                  <input 
                    required
                    type="number" 
                    step="any"
                    value={formData.entryPrice}
                    onChange={(e) => setFormData({ ...formData, entryPrice: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/50"
                  />
                </div>
              </div>
            </div>

            {/* Status & Exit Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TradeStatus })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/50"
                >
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Exit Price</label>
                <input 
                  disabled={formData.status === 'OPEN'}
                  type="number" 
                  step="any"
                  value={formData.exitPrice || ''}
                  onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/50 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Strategy</label>
                <input 
                  type="text" 
                  value={formData.strategy}
                  onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                  placeholder="e.g. Trend Following"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Fees</label>
                <input 
                  type="number" 
                  step="any"
                  value={formData.fees}
                  onChange={(e) => setFormData({ ...formData, fees: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/50"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Notes & Context</label>
            <textarea 
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Why did you take this trade? How were you feeling?"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/50 resize-none"
            />
          </div>

          {formData.status === 'CLOSED' && formData.entryPrice && formData.exitPrice && (
            <div className="mt-4 p-4 rounded-xl bg-indigo-900/10 border border-indigo-900/30 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-sm font-medium text-indigo-200">
                  Estimated P/L: 
                  <span className={`ml-2 font-bold ${
                    ((formData.exitPrice - formData.entryPrice) * (formData.quantity || 0) * (formData.side === 'LONG' ? 1 : -1)) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    ${((formData.exitPrice - formData.entryPrice) * (formData.quantity || 0) * (formData.side === 'LONG' ? 1 : -1) - (formData.fees || 0)).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-zinc-800 font-bold text-sm text-zinc-500 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Update Trade' : 'Save Trade'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeForm;