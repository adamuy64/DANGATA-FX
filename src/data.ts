/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarketAsset, PortfolioItem, Transaction, AppNotification } from './types';

export const INITIAL_MONTHLY_SALES = [
  { month: 'January', units: 250, displayUnits: '250k' },
  { month: 'February', units: 350, displayUnits: '350k' },
  { month: 'March', units: 480, displayUnits: '480k' },
  { month: 'April', units: 620, displayUnits: '620k' },
  { month: 'May', units: 750, displayUnits: '750k' },
];

export const INITIAL_MARKET_ASSETS: MarketAsset[] = [
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    price: 1.0854,
    change24h: 0.24,
    volume: '$4.2B',
    sparkline: [1.0820, 1.0835, 1.0825, 1.0848, 1.0854],
    category: 'FX',
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    price: 1.2682,
    change24h: -0.15,
    volume: '$3.1B',
    sparkline: [1.2710, 1.2690, 1.2700, 1.2675, 1.2682],
    category: 'FX',
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    price: 151.42,
    change24h: 0.38,
    volume: '$5.5B',
    sparkline: [150.80, 151.10, 150.95, 151.30, 151.42],
    category: 'FX',
  },
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin / US Dollar',
    price: 67240.00,
    change24h: 4.82,
    volume: '$28.4B',
    sparkline: [63800, 64200, 65900, 66100, 67240],
    category: 'Crypto',
  },
  {
    symbol: 'ETH/USD',
    name: 'Ethereum / US Dollar',
    price: 3450.50,
    change24h: 2.12,
    volume: '$14.2B',
    sparkline: [3360, 3320, 3410, 3430, 3450.5],
    category: 'Crypto',
  },
  {
    symbol: 'GOLD',
    name: 'Gold Spot (Ounce)',
    price: 2178.60,
    change24h: -0.45,
    volume: '$1.8B',
    sparkline: [2190, 2185, 2188, 2175, 2178.6],
    category: 'Commodity',
  },
  {
    symbol: 'BRENT',
    name: 'Brent Crude Oil',
    price: 85.34,
    change24h: 1.15,
    volume: '$980M',
    sparkline: [84.10, 84.30, 84.80, 85.10, 85.34],
    category: 'Commodity',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-1048',
    date: '2026-06-20',
    asset: 'EUR/USD',
    type: 'Buy',
    price: 1.0854,
    amount: 100000,
    total: 108540,
    status: 'Completed',
  },
  {
    id: 'TX-1047',
    date: '2026-06-19',
    asset: 'BTC/USD',
    type: 'Buy',
    price: 64150.00,
    amount: 0.5,
    total: 32075,
    status: 'Completed',
  },
  {
    id: 'TX-1046',
    date: '2026-06-18',
    asset: 'GOLD',
    type: 'Sell',
    price: 2188.00,
    amount: 15,
    total: 32820,
    status: 'Completed',
  },
  {
    id: 'TX-1045',
    date: '2026-06-17',
    asset: 'GBP/USD',
    type: 'Buy',
    price: 1.2705,
    amount: 50000,
    total: 63525,
    status: 'Completed',
  },
  {
    id: 'TX-1044',
    date: '2026-06-15',
    asset: 'USD/JPY',
    type: 'Sell',
    price: 150.95,
    amount: 40000,
    total: 265, // JPY FX margin translation representation
    status: 'Completed',
  },
  {
    id: 'TX-1043',
    date: '2026-06-12',
    asset: 'ETH/USD',
    type: 'Buy',
    price: 3310.00,
    amount: 3.0,
    total: 9930,
    status: 'Failed',
  },
];

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'PORT-1',
    asset: 'Bitcoin',
    symbol: 'BTC/USD',
    shares: 1.25,
    avgBuyPrice: 61500.00,
    currentPrice: 67240.00,
    value: 84050.00,
    profit: 7175.00,
    profitPercent: 9.33,
    color: '#00288e', // Primary Blue
  },
  {
    id: 'PORT-2',
    asset: 'Euro / US Dollar',
    symbol: 'EUR/USD',
    shares: 250000,
    avgBuyPrice: 1.0820,
    currentPrice: 1.0854,
    value: 271350.00,
    profit: 850.00,
    profitPercent: 0.31,
    color: '#006d30', // Success Green
  },
  {
    id: 'PORT-3',
    asset: 'Gold Spot',
    symbol: 'GOLD',
    shares: 45,
    avgBuyPrice: 2140.00,
    currentPrice: 2178.60,
    value: 98037.00,
    profit: 1737.00,
    profitPercent: 1.80,
    color: '#757684', // Gray Neutral
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOT-1',
    title: 'Market Breakout Alert',
    message: 'BTC/USD breaks above dynamic key resistance at $67,000, setting new monthly highs.',
    time: '15 mins ago',
    read: false,
    type: 'success',
  },
  {
    id: 'NOT-2',
    title: 'Spread Adjustments',
    message: 'Daily FX swap values updated. Normal spreads apply on EUR and GBP crosses.',
    time: '2 hours ago',
    read: false,
    type: 'info',
  },
  {
    id: 'NOT-3',
    title: 'Security Sync Complete',
    message: 'Backup configurations loaded. Two-factor check successful on your login origin.',
    time: 'Yesterday',
    read: true,
    type: 'info',
  },
];

export const ADVERTISING_ROI_POINTS = [
  { spend: 12, revenue: 15 },
  { spend: 22, revenue: 28 },
  { spend: 31, revenue: 19 },
  { spend: 38, revenue: 42 },
  { spend: 48, revenue: 37 },
  { spend: 58, revenue: 58 },
  { spend: 68, revenue: 73 },
  { spend: 78, revenue: 64 },
  { spend: 89, revenue: 88 },
  { spend: 97, revenue: 92 },
];

export const PERFORMANCE_BAR_DATA = [
  { category: 'Cat A', standard: 60, status: 'Standard' },
  { category: 'Cat B', outperformer: 95, status: 'Outperformer' },
  { category: 'Cat C', standard: 45, status: 'Standard' },
  { category: 'Cat D', standard: 75, status: 'Standard' },
];

export const FAQ_ENTRIES = [
  {
    question: 'How often is Dangata FX market analytics data updated?',
    answer: 'Market analytics, pricing loops, and sparklines are refreshed automatically. Our server proxies real-time exchange rates, commodity benchmarks, and high-cap crypto asset prices.',
  },
  {
    question: 'How do I download tax-ready reports?',
    answer: 'Head to the Reports screen, configure your period parameters (e.g. Monthly, Quarterly, Yearly), pick your core metrics filter (e.g., Volatility, Net Profits), and click the export button to generate custom tax drafts or audit logs.',
  },
  {
    question: 'Can I link real brokerage or swap accounts?',
    answer: 'Dangata FX acts as an analytical overlay environment. In other versions, API integrations allow syncing native terminal accounts. Our support desk can guide key security configurations.',
  },
  {
    question: 'What is the "Upgrade Pro" feature?',
    answer: 'The Pro edition unlocks comprehensive visual indicators, dynamic custom alert parameters, priority market reports, and advanced correlation modeling for risk assessments.',
  },
];
