/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActiveTab = 'dashboard' | 'market' | 'portfolio' | 'transactions' | 'reports' | 'settings' | 'support';

export interface Transaction {
  id: string;
  date: string;
  asset: string;
  type: 'Buy' | 'Sell';
  price: number;
  amount: number;
  total: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  sparkline: number[];
  category: 'Crypto' | 'FX' | 'Commodity';
}

export interface PortfolioItem {
  id: string;
  asset: string;
  symbol: string;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
  value: number;
  profit: number;
  profitPercent: number;
  color: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}
