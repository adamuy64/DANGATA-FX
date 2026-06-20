/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Layers, 
  DollarSign, 
  Calculator,
  RefreshCw,
  TrendingUp as IconUp,
  Percent
} from 'lucide-react';
import { MarketAsset } from '../types';

interface MarketAnalysisViewProps {
  assets: MarketAsset[];
  searchQuery: string;
  onTradeAction: (symbol: string, type: 'Buy' | 'Sell') => void;
  currencySymbol: string;
  isPro: boolean;
}

export default function MarketAnalysisView({ 
  assets, 
  searchQuery, 
  onTradeAction, 
  currencySymbol,
  isPro
}: MarketAnalysisViewProps) {
  
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'FX' | 'Crypto' | 'Commodity'>('All');

  // Forex Currency calculator states
  const [convertAmount, setConvertAmount] = useState<number>(100);
  const [convertFrom, setConvertFrom] = useState('EUR');
  const [convertTo, setConvertTo] = useState('USD');
  const [convertResult, setConvertResult] = useState<number | null>(null);

  const mockRates: Record<string, number> = {
    'EUR_USD': 1.0854,
    'GBP_USD': 1.2682,
    'USD_JPY': 151.42,
    'USD_EUR': 0.9213,
    'USD_GBP': 0.7885,
    'EUR_GBP': 0.8559,
    'GBP_EUR': 1.1684,
    'EUR_JPY': 164.35,
    'GBP_JPY': 192.05,
    'JPY_USD': 0.0066
  };

  const calculateConversion = () => {
    if (convertFrom === convertTo) {
      setConvertResult(convertAmount);
      return;
    }
    const pair = `${convertFrom}_${convertTo}`;
    const inversePair = `${convertTo}_${convertFrom}`;
    
    if (mockRates[pair]) {
      setConvertResult(convertAmount * mockRates[pair]);
    } else if (mockRates[inversePair]) {
      setConvertResult(convertAmount / mockRates[inversePair]);
    } else {
      // General fallbacks
      setConvertResult(convertAmount * 1.25);
    }
  };

  // Filter our metrics
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = 
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 md:p-8 space-y-6">
      
      {/* View Header */}
      <div>
        <h3 className="font-sans text-2xl font-extrabold text-[#191c1d] tracking-tight">Market Analysis</h3>
        <p className="text-sm text-[#444653] dark:text-[#c4c5d5] mt-1 font-medium">
          Monitor real-time spreads, volume depth, and pricing sparks on global instruments.
        </p>
      </div>

      {/* Categories & Converter Layout Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Market Table List */}
        <div className="col-span-12 xl:col-span-8 bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            
            {/* Filters Tabs */}
            <div className="inline-flex bg-[#f3f4f5] dark:bg-[#191520] p-1 rounded-md text-xs">
              {(['All', 'FX', 'Crypto', 'Commodity'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded font-black tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-white dark:bg-[#2e3132] text-[#00288e] dark:text-[#dde1ff] shadow-sm'
                      : 'text-[#757684] hover:text-[#191c1d]'
                  }`}
                >
                  {cat === 'FX' ? 'Forex' : cat === 'All' ? 'All Asset reserves' : cat}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#757684] font-semibold flex items-center gap-1.5 bg-[#f3f4f5]/60 pr-2 pl-1 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-[#006d30] animate-pulse"></span>
              Live Feed Connected
            </div>
          </div>

          {/* List Matrix of tickers */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]" id="market-tickers-table">
              <thead>
                <tr className="border-b border-[#e5e7eb] dark:border-[#2e3132] text-[10px] font-black text-[#757684] tracking-wider uppercase">
                  <th className="py-3 px-2">Instrument</th>
                  <th className="py-3 px-2 text-right">Value</th>
                  <th className="py-3 px-2 text-right">24H change</th>
                  <th className="py-3 px-2 text-center">Trend chart</th>
                  <th className="py-3 px-2 text-right">Volume</th>
                  <th className="py-3 px-2 text-center">Execution</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#e5e7eb]/60 dark:divide-[#2e3132]/60">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-[#757684]">
                      No instruments found matching '{searchQuery}'
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => {
                    const isPositive = asset.change24h >= 0;

                    // Sparkline SVG parameters
                    const svgW = 100;
                    const svgH = 26;
                    const minP = Math.min(...asset.sparkline);
                    const maxP = Math.max(...asset.sparkline);
                    const deltaP = maxP - minP || 1;
                    const sparkPoints = asset.sparkline.map((val, index) => {
                      const x = (index * svgW) / (asset.sparkline.length - 1);
                      const y = svgH - 4 - (((val - minP) / deltaP) * (svgH - 8));
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <tr 
                        key={asset.symbol} 
                        className="hover:bg-[#f3f4f5]/30 dark:hover:bg-[#282435] transition-colors"
                      >
                        {/* Name and Symbol */}
                        <td className="py-3.5 px-2">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-[#191c1d] dark:text-white text-sm">
                              {asset.symbol}
                            </span>
                            <span className="text-[10px] text-[#757684] font-medium mt-0.5">
                              {asset.name}
                            </span>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-2 text-right font-mono font-bold text-sm">
                          {asset.category === 'FX' ? '' : currencySymbol}
                          {asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.category === 'FX' ? 4 : 2 })}
                        </td>

                        {/* 24h change */}
                        <td className="py-3.5 px-2 text-right">
                          <span className={`inline-flex items-center gap-0.5 font-bold rounded px-1.5 py-0.5 text-[10px] ${
                            isPositive 
                              ? 'bg-[#92f5a4]/20 text-[#006d30]' 
                              : 'bg-[#ffdad6] text-[#ba1a1a]'
                          }`}>
                            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {isPositive ? '+' : ''}{asset.change24h}%
                          </span>
                        </td>

                        {/* Sparkline Graphic */}
                        <td className="py-3.5 px-2">
                          <div className="flex justify-center">
                            <svg className="overflow-visible" width={svgW} height={svgH}>
                              <polyline
                                fill="none"
                                stroke={isPositive ? '#006d30' : '#ba1a1a'}
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={sparkPoints}
                              />
                            </svg>
                          </div>
                        </td>

                        {/* Volume */}
                        <td className="py-3.5 px-2 text-right font-mono text-[#757684] font-medium uppercase">
                          {asset.volume}
                        </td>

                        {/* Order action */}
                        <td className="py-3.5 px-2 text-center">
                          <div className="flex gap-1 justify-center">
                            <button
                              id={`trade-buy-${asset.symbol}`}
                              onClick={() => onTradeAction(asset.symbol, 'Buy')}
                              className="px-2 py-1 bg-[#1e40af]/10 text-[#00288e] hover:bg-[#00288e] hover:text-white dark:text-[#b8c4ff] rounded text-[10px] font-extrabold transition-all active:scale-95"
                            >
                              BUY
                            </button>
                            <button
                              id={`trade-sell-${asset.symbol}`}
                              onClick={() => onTradeAction(asset.symbol, 'Sell')}
                              className="px-2 py-1 bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white rounded text-[10px] font-extrabold transition-all active:scale-95"
                            >
                              SELL
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Margin Tool Section / Converter */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          
          {/* 1. Converter Calculator Widget */}
          <div className="bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5">
            <div className="flex items-center gap-1.5 mb-4 text-[#00288e] dark:text-[#b8c4ff]">
              <Calculator className="w-5 h-5" />
              <h4 className="font-extrabold text-sm tracking-tight uppercase text-[#191c1d] dark:text-white">
                Currency Converter
              </h4>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#757684] uppercase mb-1">Exchange Amount</label>
                <div className="flex py-2 px-3 border border-[#c4c5d5] rounded-md focus-within:border-[#00288e] bg-transparent">
                  <span className="text-[#757684] font-bold pr-1.5">$</span>
                  <input 
                    type="number"
                    value={convertAmount === 0 ? '' : convertAmount}
                    onChange={(e) => setConvertAmount(Number(e.target.value))}
                    className="bg-transparent border-none focus:outline-none w-full text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Selection row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#757684] uppercase mb-1">From currency</label>
                  <select 
                    value={convertFrom}
                    onChange={(e) => setConvertFrom(e.target.value)}
                    className="w-full bg-white dark:bg-[#201c2a] border border-[#c4c5d5] rounded py-2 px-2.5 outline-none font-semibold focus:border-[#00288e]"
                  >
                    <option value="USD">USD - Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - Pound</option>
                    <option value="JPY">JPY - Yen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#757684] uppercase mb-1">To currency</label>
                  <select 
                    value={convertTo}
                    onChange={(e) => setConvertTo(e.target.value)}
                    className="w-full bg-white dark:bg-[#201c2a] border border-[#c4c5d5] rounded py-2 px-2.5 outline-none font-semibold focus:border-[#00288e]"
                  >
                    <option value="USD">USD - Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - Pound</option>
                    <option value="JPY">JPY - Yen</option>
                  </select>
                </div>
              </div>

              <button
                id="calculate-conversion-btn"
                onClick={calculateConversion}
                className="w-full py-2.5 bg-[#00288e] hover:bg-[#173bab] text-white rounded text-xs font-bold active:scale-[0.98] transition-all uppercase tracking-wider"
              >
                Perform Conversion Rate
              </button>

              {convertResult !== null && (
                <div className="p-3 bg-[#f3f4f5] dark:bg-[#191520] rounded border border-[#e5e7eb] dark:border-[#2e3132] text-center">
                  <p className="text-[10px] text-[#757684] uppercase font-bold tracking-wider">Calculation sum</p>
                  <p className="text-xl font-black text-[#191c1d] dark:text-white mt-1">
                    {convertAmount} {convertFrom} = {convertResult.toLocaleString(undefined, { maximumFractionDigits: 4 })} {convertTo}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 2. Analytical Pro Insight card */}
          <div className="bg-[#1e40af]/5 border border-[#00288e]/10 rounded-xl p-5 relative overflow-hidden">
            <h5 className="font-extrabold text-sm text-[#00288e] tracking-tight mb-2">Correlation Insights</h5>
            <p className="text-xs text-[#444653] dark:text-[#c4c5d5] leading-relaxed mb-4">
              Cryptocurrency markets show a high positive correlation (r=0.88) with tech stock volume. Gold serves is acting as a traditional hedges index while USD crosses stabilize.
            </p>
            <div className="inline-flex gap-2 items-center text-[10px] font-bold text-[#00288e] bg-white/70 px-3 py-1 rounded">
              <Percent className="w-3 h-3" /> Alpha Index Adjusted
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
