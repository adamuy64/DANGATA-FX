/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  PieChart as PieIcon, 
  LineChart, 
  HelpCircle,
  TrendingUp,
  Coins,
  ShieldCheck
} from 'lucide-react';
import { PortfolioItem, MarketAsset } from '../types';

interface PortfolioViewProps {
  portfolio: PortfolioItem[];
  assets: MarketAsset[];
  onExecuteTrade: (symbol: string, type: 'Buy' | 'Sell', amount: number, price: number) => void;
  currencySymbol: string;
}

export default function PortfolioView({ 
  portfolio, 
  assets, 
  onExecuteTrade,
  currencySymbol 
}: PortfolioViewProps) {
  
  // Local states for quick trade execution
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState(assets[0]?.symbol || 'EUR/USD');
  const [tradeType, setTradeType] = useState<'Buy' | 'Sell'>('Buy');
  const [tradeAmount, setTradeAmount] = useState<number>(1000);
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  // Calculate aggregations dynamically
  const totalValuation = portfolio.reduce((acc, item) => acc + item.value, 0);
  const totalProfit = portfolio.reduce((acc, item) => acc + item.profit, 0);
  const averageProfitPercent = totalValuation > 0 ? (totalProfit / (totalValuation - totalProfit)) * 100 : 0;

  // Let's calculate category allocation sizes for capital allocation bar
  // Match portfolio items to categories to build visual meter
  const allocation = portfolio.reduce((acc, item) => {
    // Determine category from assets
    const matchedAsset = assets.find(a => a.symbol === item.symbol);
    const category = matchedAsset ? matchedAsset.category : 'FX';
    acc[category] = (acc[category] || 0) + item.value;
    return acc;
  }, {} as Record<string, number>);

  const fxAlloc = allocation['FX'] || 0;
  const cryptoAlloc = allocation['Crypto'] || 0;
  const commodityAlloc = allocation['Commodity'] || 0;
  const totalAlloc = fxAlloc + cryptoAlloc + commodityAlloc || 1;

  const fxPct = (fxAlloc / totalAlloc) * 100;
  const cryptoPct = (cryptoAlloc / totalAlloc) * 100;
  const commodityPct = (commodityAlloc / totalAlloc) * 100;

  const handleQuickTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (tradeAmount <= 0) return;

    // Retrieve active asset price
    const assetMeta = assets.find(a => a.symbol === selectedAssetSymbol);
    if (!assetMeta) return;

    onExecuteTrade(selectedAssetSymbol, tradeType, tradeAmount, assetMeta.price);
    
    setTradeMessage(`Successfully executed ${tradeType} order for ${tradeAmount} units of ${selectedAssetSymbol}!`);
    setTimeout(() => setTradeMessage(null), 4000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      
      {/* View Header */}
      <div>
        <h3 className="font-sans text-2xl font-extrabold text-[#191c1d] tracking-tight">Portfolio Overview</h3>
        <p className="text-sm text-[#444653] dark:text-[#c4c5d5] mt-1 font-medium">
          Track entry limits, consolidated returns, and active capital allocations in real-time.
        </p>
      </div>

      {/* Highlights Metrics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Net Asset Worth Card */}
        <div className="bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] p-5 rounded-lg flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 bg-[#00288e]/10 w-24 h-24 rounded-bl-full opacity-60 pointer-events-none" />
          <div>
            <span className="text-[10px] font-bold text-[#757684] uppercase tracking-wider block">Net Wallet Valuation</span>
            <h4 className="text-3xl font-black text-[#191c1d] dark:text-white mt-1.5 font-sans">
              {currencySymbol}{totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h4>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#444653] dark:text-[#c4c5d5]">
            <Wallet className="w-4 h-4 text-[#00288e]" />
            <span>Consolidated asset reserves</span>
          </div>
        </div>

        {/* Total Returns Earnings Card */}
        <div className="bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] p-5 rounded-lg flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div>
            <span className="text-[10px] font-bold text-[#757684] uppercase tracking-wider block">Unrealized Profit / Loss</span>
            <h4 className={`text-3xl font-black mt-1.5 font-sans ${totalProfit >= 0 ? 'text-[#006d30]' : 'text-[#ba1a1a]'}`}>
              {totalProfit >= 0 ? '+' : ''}{currencySymbol}{totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h4>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold">
            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-black ${
              totalProfit >= 0 ? 'bg-[#92f5a4]/20 text-[#006d30]' : 'bg-[#ffdad6] text-[#ba1a1a]'
            }`}>
              {totalProfit >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {averageProfitPercent.toFixed(2)}% ROI
            </span>
            <span className="text-[#757684]">Overall yield</span>
          </div>
        </div>

        {/* Level Security Card */}
        <div className="bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] p-5 rounded-lg flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div>
            <span className="text-[10px] font-bold text-[#757684] uppercase tracking-wider block">Wallet diversification</span>
            <h4 className="text-3xl font-black text-[#00288e] dark:text-[#b8c4ff] mt-1.5 font-sans">
              Optimized
            </h4>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-[#006d30] font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Low volatility index backing</span>
          </div>
        </div>

      </div>

      {/* Main Grid Content Layout */}
      <div className="grid grid-cols-12 gap-6">

        {/* Holdings detail ledger */}
        <div className="col-span-12 xl:col-span-8 bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5">
          <h4 className="font-bold text-sm tracking-tight text-[#191c1d] dark:text-white uppercase mb-4">
            Asset Holdings Ledger
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]" id="portfolio-holdings-table">
              <thead>
                <tr className="border-b border-[#e5e7eb] dark:border-[#2e3132] text-[10px] font-black text-[#757684] tracking-wider uppercase">
                  <th className="py-2.5 px-2">Asset Name</th>
                  <th className="py-2.5 px-2 text-right">Holdings</th>
                  <th className="py-2.5 px-2 text-right">Avg Entry Price</th>
                  <th className="py-2.5 px-2 text-right">Current Price</th>
                  <th className="py-2.5 px-2 text-right">Net Value</th>
                  <th className="py-2.5 px-2 text-right">Net Profit</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#e5e7eb]/60 dark:divide-[#2e3132]/60">
                {portfolio.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-[#757684]">
                      No active holdings. Build your portfolio below!
                    </td>
                  </tr>
                ) : (
                  portfolio.map((item) => {
                    const isProfit = item.profit >= 0;
                    return (
                      <tr key={item.id} className="hover:bg-[#f3f4f5]/30 dark:hover:bg-[#282435] transition-colors">
                        
                        {/* Name symbol */}
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <div className="flex flex-col">
                              <span className="font-extrabold text-[#191c1d] dark:text-white">{item.asset}</span>
                              <span className="text-[10px] text-[#757684]">{item.symbol}</span>
                            </div>
                          </div>
                        </td>

                        {/* Holdings amount */}
                        <td className="py-3 px-2 text-right font-mono font-bold">
                          {item.shares.toLocaleString()}
                        </td>

                        {/* Average Entry */}
                        <td className="py-3 px-2 text-right font-mono text-[#757684] font-semibold">
                          {currencySymbol}{item.avgBuyPrice.toLocaleString(undefined, { minimumFractionDigits: item.avgBuyPrice < 10 ? 4 : 2 })}
                        </td>

                        {/* Current price ticker */}
                        <td className="py-3 px-2 text-right font-mono text-[#191c1d] dark:text-white font-extrabold">
                          {currencySymbol}{item.currentPrice.toLocaleString(undefined, { minimumFractionDigits: item.currentPrice < 10 ? 4 : 2 })}
                        </td>

                        {/* Net Value valuation */}
                        <td className="py-3 px-2 text-right font-mono font-extrabold">
                          {currencySymbol}{item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>

                        {/* Returns profit */}
                        <td className={`py-3 px-2 text-right font-mono font-bold`}>
                          <div className="flex flex-col items-end">
                            <span className={isProfit ? 'text-[#006d30]' : 'text-[#ba1a1a]'}>
                              {isProfit ? '+' : ''}{currencySymbol}{item.profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <span className={`text-[9px] px-1 rounded ${isProfit ? 'bg-[#92f5a4]/10 text-[#006d30]' : 'bg-[#ffdad6]/40 text-[#ba1a1a]'}`}>
                              {isProfit ? '↑' : '↓'} {item.profitPercent.toFixed(2)}%
                            </span>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Allocation Breakdown Bar Visual Indicator */}
          <div className="mt-8 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-[#757684] uppercase tracking-wider">
              <span>Capital Structure Diversification</span>
              <span>Total Assets: {portfolio.length}</span>
            </div>
            
            {/* 3 Colors Segmented Allocation Bar */}
            <div className="h-3 rounded-full overflow-hidden flex bg-[#e5e7eb] dark:bg-[#2e3132]">
              {fxPct > 0 && (
                <div 
                  className="bg-[#006d30] h-full transition-all duration-500" 
                  style={{ width: `${fxPct}%` }} 
                  title={`Forex Crosses: ${fxPct.toFixed(1)}%`}
                />
              )}
              {cryptoPct > 0 && (
                <div 
                  className="bg-[#00288e] h-full transition-all duration-500" 
                  style={{ width: `${cryptoPct}%` }} 
                  title={`Cryptocurrencies: ${cryptoPct.toFixed(1)}%`}
                />
              )}
              {commodityPct > 0 && (
                <div 
                  className="bg-[#757684] h-full transition-all duration-500" 
                  style={{ width: `${commodityPct}%` }} 
                  title={`Commodities: ${commodityPct.toFixed(1)}%`}
                />
              )}
            </div>

            {/* Allocation key legends */}
            <div className="flex flex-wrap gap-4 text-[10px] font-extrabold uppercase mt-1">
              {fxPct > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#006d30]" />
                  <span className="text-[#191c1d] dark:text-white">Forex cross ({fxPct.toFixed(1)}%)</span>
                </div>
              )}
              {cryptoPct > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00288e]" />
                  <span className="text-[#191c1d] dark:text-white">Crypto blocks ({cryptoPct.toFixed(1)}%)</span>
                </div>
              )}
              {commodityPct > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#757684]" />
                  <span className="text-[#191c1d] dark:text-white">Commodity reserves ({commodityPct.toFixed(1)}%)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Trade execution desk panel */}
        <div className="col-span-12 xl:col-span-4 bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5">
          <div className="flex items-center gap-1.5 mb-4 text-[#00288e] dark:text-[#b8c4ff]">
            <Coins className="w-5 h-5 animate-pulse" />
            <h4 className="font-bold text-sm tracking-tight uppercase text-[#191c1d] dark:text-white">
              Instant Trading Desk
            </h4>
          </div>

          <form onSubmit={handleQuickTrade} className="space-y-4 text-xs">
            
            {/* Asset Pick */}
            <div>
              <label className="block text-[11px] font-bold text-[#757684] uppercase mb-1">Pick Currency or Asset</label>
              <select 
                value={selectedAssetSymbol}
                onChange={(e) => setSelectedAssetSymbol(e.target.value)}
                className="w-full bg-white dark:bg-[#201c2a] border border-[#c4c5d5] rounded py-2 px-2.5 outline-none font-semibold focus:border-[#00288e]"
              >
                {assets.map(a => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.symbol} — {a.name} (${a.price.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Type Buy/Sell Toggle */}
            <div>
              <label className="block text-[11px] font-bold text-[#757684] uppercase mb-1">Action Type</label>
              <div className="grid grid-cols-2 gap-2 bg-[#f3f4f5] dark:bg-[#191520] p-1 rounded-md">
                <button
                  type="button"
                  id="trade-type-buy"
                  onClick={() => setTradeType('Buy')}
                  className={`py-1.5 text-center text-[10px] font-bold tracking-wide uppercase rounded transition-all cursor-pointer ${
                    tradeType === 'Buy'
                      ? 'bg-white dark:bg-[#2e3132] text-[#006d30] shadow-sm'
                      : 'text-[#757684]'
                  }`}
                >
                  Buy Long
                </button>
                <button
                  type="button"
                  id="trade-type-sell"
                  onClick={() => setTradeType('Sell')}
                  className={`py-1.5 text-center text-[10px] font-bold tracking-wide uppercase rounded transition-all cursor-pointer ${
                    tradeType === 'Sell'
                      ? 'bg-white dark:bg-[#2e3132] text-[#ba1a1a] shadow-sm'
                      : 'text-[#757684]'
                  }`}
                >
                  Sell Short
                </button>
              </div>
            </div>

            {/* Lot size amount */}
            <div>
              <label className="block text-[11px] font-bold text-[#757684] uppercase mb-1">Lot units Size / shares</label>
              <div className="flex py-2 px-3 border border-[#c4c5d5] rounded-md focus-within:border-[#00288e] bg-transparent">
                <input 
                  type="number" 
                  step="any"
                  value={tradeAmount === 0 ? '' : tradeAmount}
                  onChange={(e) => setTradeAmount(Number(e.target.value))}
                  className="bg-transparent border-none focus:outline-none w-full text-sm font-semibold"
                />
              </div>
            </div>

            {/* Submit Trade Trigger */}
            <button
              type="submit"
              id="submit-trade-btn"
              className="w-full py-2.5 bg-[#00288e] hover:bg-[#173bab] text-white rounded text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98]"
            >
              Confirm Broker Trade
            </button>

            {tradeMessage && (
              <div className="p-3 bg-[#92f5a4]/10 text-[#006d30] rounded border border-[#006d30]/20 font-sans font-semibold text-center mt-1 animate-fade-in">
                {tradeMessage}
              </div>
            )}

            <p className="text-[10px] text-[#757684] text-center leading-relaxed font-semibold">
              Warning: Mock financial engine logs. Trades immediately recalculate net capital allocations.
            </p>
          </form>
        </div>

      </div>

    </div>
  );
}
