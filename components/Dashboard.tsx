
import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
// Import BarChart3 icon from lucide-react
import { TrendingUp, TrendingDown, Activity, Percent, Target, History, BarChart3 } from 'lucide-react';
import { Trade } from '../types';
import { calculateStats, getEquityCurveData } from '../utils/calculations';

interface DashboardProps {
  trades: Trade[];
}

const Dashboard: React.FC<DashboardProps> = ({ trades }) => {
  const stats = useMemo(() => calculateStats(trades), [trades]);
  const equityData = useMemo(() => getEquityCurveData(trades), [trades]);

  if (trades.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="p-6 bg-zinc-900 rounded-full mb-6">
          <History className="w-12 h-12 text-zinc-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2">No Trades Yet</h3>
        <p className="text-zinc-400 max-w-md">
          Start logging your trades to see performance analytics, equity curves, and strategy insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Net Profit" 
          value={`$${stats.netPnl.toLocaleString()}`} 
          subValue="Total P/L"
          icon={<Activity className="w-5 h-5" />}
          color={stats.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}
        />
        <StatCard 
          label="Win Rate" 
          value={`${(stats.winRate * 100).toFixed(1)}%`} 
          subValue={`${trades.filter(t => (t.pnl || 0) > 0).length} Wins / ${trades.filter(t => (t.pnl || 0) < 0).length} Losses`}
          icon={<Percent className="w-5 h-5" />}
          color="text-indigo-400"
        />
        <StatCard 
          label="Profit Factor" 
          value={stats.profitFactor.toFixed(2)} 
          subValue="Gross Win / Gross Loss"
          icon={<Target className="w-5 h-5" />}
          color="text-amber-400"
        />
        <StatCard 
          label="Avg. Trade" 
          value={`$${(stats.netPnl / trades.length).toFixed(2)}`} 
          subValue="Mean P/L per trade"
          icon={<Activity className="w-5 h-5" />}
          color="text-sky-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Equity Chart */}
        <div className="lg:col-span-2 bg-[#0d0d0f] border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Equity Curve
            </h3>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 bg-zinc-800 rounded text-zinc-400 uppercase font-bold tracking-tighter">Live Account</span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#4b5563" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis 
                  stroke="#4b5563" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d0d0f', border: '1px solid #374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="equity" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorEquity)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small P/L Distribution Chart */}
        <div className="bg-[#0d0d0f] border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-8 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Performance by Strategy
          </h3>
          <div className="space-y-6">
            {Object.entries(
              trades.reduce((acc, trade) => {
                acc[trade.strategy] = (acc[trade.strategy] || 0) + (trade.pnl || 0);
                return acc;
              }, {} as Record<string, number>)
            ).map(([strategy, pnl]: [string, number]) => ( // Explicitly typed as number to resolve unknown operator and property errors
              <div key={strategy}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-zinc-400 font-medium">{strategy}</span>
                  <span className={`text-sm font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${pnl >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                    style={{ width: `${Math.min(100, (Math.abs(pnl) / Math.max(1, stats.netPnl)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: string, subValue: string, icon: React.ReactNode, color: string }> = ({ label, value, subValue, icon, color }) => (
  <div className="bg-[#0d0d0f] border border-zinc-800 rounded-2xl p-6 shadow-sm hover:border-zinc-700 transition-colors">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
        {icon}
      </div>
      <span className="text-sm font-medium text-zinc-500">{label}</span>
    </div>
    <div className={`text-2xl font-bold mb-1 ${color}`}>
      {value}
    </div>
    <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
      {subValue}
    </div>
  </div>
);

export default Dashboard;
