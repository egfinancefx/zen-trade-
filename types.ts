
export type TradeSide = 'LONG' | 'SHORT';
export type TradeStatus = 'OPEN' | 'CLOSED';

export interface Trade {
  id: string;
  symbol: string;
  side: TradeSide;
  status: TradeStatus;
  entryDate: string;
  exitDate?: string;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  fees: number;
  strategy: string;
  notes: string;
  pnl?: number;
}

export interface TradeStats {
  totalTrades: number;
  winRate: number;
  netPnl: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  maxDrawdown: number;
}

export interface ChartData {
  date: string;
  equity: number;
  pnl: number;
}
