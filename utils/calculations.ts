
import { Trade, TradeStats, ChartData } from '../types';

export const calculateStats = (trades: Trade[]): TradeStats => {
  const closedTrades = trades.filter(t => t.status === 'CLOSED' && t.pnl !== undefined);
  
  if (closedTrades.length === 0) {
    return {
      totalTrades: 0,
      winRate: 0,
      netPnl: 0,
      avgWin: 0,
      avgLoss: 0,
      profitFactor: 0,
      maxDrawdown: 0
    };
  }

  const netPnl = closedTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
  const wins = closedTrades.filter(t => (t.pnl || 0) > 0);
  const losses = closedTrades.filter(t => (t.pnl || 0) < 0);
  
  const grossWin = wins.reduce((acc, t) => acc + (t.pnl || 0), 0);
  const grossLoss = Math.abs(losses.reduce((acc, t) => acc + (t.pnl || 0), 0));

  return {
    totalTrades: closedTrades.length,
    winRate: wins.length / closedTrades.length,
    netPnl,
    avgWin: wins.length > 0 ? grossWin / wins.length : 0,
    avgLoss: losses.length > 0 ? grossLoss / losses.length : 0,
    profitFactor: grossLoss === 0 ? grossWin : grossWin / grossLoss,
    maxDrawdown: calculateMaxDrawdown(closedTrades)
  };
};

const calculateMaxDrawdown = (trades: Trade[]): number => {
  let peak = 0;
  let currentEquity = 0;
  let maxDD = 0;

  // Sorted by entry date
  const sortedTrades = [...trades].sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());

  for (const trade of sortedTrades) {
    currentEquity += (trade.pnl || 0);
    if (currentEquity > peak) {
      peak = currentEquity;
    }
    const dd = peak - currentEquity;
    if (dd > maxDD) {
      maxDD = dd;
    }
  }

  return maxDD;
};

export const getEquityCurveData = (trades: Trade[]): ChartData[] => {
  const closedTrades = trades
    .filter(t => t.status === 'CLOSED' && t.pnl !== undefined)
    .sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());

  let cumulativePnl = 0;
  const data: ChartData[] = closedTrades.map(t => {
    cumulativePnl += (t.pnl || 0);
    return {
      date: t.entryDate,
      equity: cumulativePnl,
      pnl: t.pnl || 0
    };
  });

  // Add initial point
  if (data.length > 0) {
    return [{ date: 'Initial', equity: 0, pnl: 0 }, ...data];
  }

  return [];
};
