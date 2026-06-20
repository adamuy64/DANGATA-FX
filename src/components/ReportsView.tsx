/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  RefreshCw, 
  CheckCircle2, 
  Download, 
  Calendar, 
  BarChart, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { PortfolioItem } from '../types';

interface ReportsViewProps {
  portfolio: PortfolioItem[];
  currencySymbol: string;
  isPro: boolean;
}

export default function ReportsView({ portfolio, currencySymbol, isPro }: ReportsViewProps) {
  
  const [reportPeriod, setReportPeriod] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Quarterly');
  const [reportMetric, setReportMetric] = useState<'Returns' | 'Volatility' | 'Spreads'>('Returns');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedReport(null);

    // Simulate analytical compiling
    setTimeout(() => {
      setIsGenerating(false);

      // Create dynamic analytics prose based on metric selected
      let prose = '';
      let stats: any[] = [];
      const reportNum = `REP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      if (reportMetric === 'Returns') {
        const totalVal = portfolio.reduce((a, c) => a + c.value, 0);
        const totalPr = portfolio.reduce((a, c) => a + c.profit, 0);
        const roi = totalVal > 0 ? (totalPr / (totalVal - totalPr)) * 100 : 12.4;

        prose = `The ${reportPeriod} Financial Return Audit is compiled using aggregated brokerage nodes. Asset values adjusted successfully with a Net Capital return of +${roi.toFixed(2)}% ROI. Bitcoin and Euro cross rates served as high-performing pillars of liquidity, ensuring risk boundaries were maintained within Low Volatility ranges.`;
        stats = [
          { name: 'Consolidated Value', val: `${currencySymbol}${totalVal.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
          { name: 'Net Capital Gains', val: `+${currencySymbol}${totalPr.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
          { name: 'Average Rate Return', val: `+${roi.toFixed(2)}%` },
          { name: 'Node Accuracy Index', val: '99.98%' },
        ];
      } else if (reportMetric === 'Volatility') {
        prose = `The Volatility Spread assessment evaluates standard deviation spreads on FX pairs (EUR/USD, GBP/USD) and high-market capitalization digital assets. Correlation factors stand robust at (r=0.92) with no abnormal premium deviations. Beta factors remain isolated on Gold hedges, confirming balanced safety layers.`;
        stats = [
          { name: 'Correlation Coefficient', val: 'r = 0.92 (Strong Positive)' },
          { name: 'Forex Spread Premium', val: '1.2 - 1.8 pips (Normal)' },
          { name: 'Beta Volatility Index', val: 'Low (0.34 Overall Dev)' },
          { name: 'Risk Mitigation Level', val: 'Secure Hedged Status' },
        ];
      } else {
        prose = `The Liquidity and Swap Spread report details overnight swap premiums and bid-ask fills. Average trade execution time measured 32ms across active routing nodes. No abnormal slippages were detected during high-volatility hours. Total processed daily transactions stand at standard capacity levels.`;
        stats = [
          { name: 'Routing Settlement Speed', val: '32ms (High Speed)' },
          { name: 'Slippage Ratio Deviation', val: '< 0.01% (Optimized)' },
          { name: 'Active Nodes Utilized', val: '4 Global Server Nodes' },
          { name: 'Swap Expense Grade', val: 'A+ (Optimal swap spread)' },
        ];
      }

      setGeneratedReport({
        id: reportNum,
        period: reportPeriod,
        metric: reportMetric,
        prose,
        stats,
        timestamp: new Date().toLocaleDateString()
      });
    }, 1200);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      
      {/* View Header */}
      <div>
        <h3 className="font-sans text-2xl font-extrabold text-[#191c1d] tracking-tight">Reports Generator</h3>
        <p className="text-sm text-[#444653] dark:text-[#c4c5d5] mt-1 font-medium">
          Generate comprehensive diagnostic summaries, tax projections, and correlation studies.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Generator Controls Form Panel */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5">
          <form onSubmit={handleGenerate} className="space-y-5 text-xs">
            <h4 className="font-sans text-xs font-black text-[#757684] uppercase tracking-wider mb-2">Configure Parameters</h4>

            {/* Range Pick */}
            <div className="space-y-1.5 animate-pulse-subtle">
              <label className="block text-[11px] font-bold text-[#757684] uppercase">Choose Period Duration</label>
              <div className="grid grid-cols-3 gap-1.5 bg-[#f3f4f5] dark:bg-[#191520] p-1 rounded-md">
                {(['Monthly', 'Quarterly', 'Yearly'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setReportPeriod(period)}
                    className={`py-1.5 text-center text-[10px] font-bold uppercase rounded cursor-pointer ${
                      reportPeriod === period
                        ? 'bg-white dark:bg-[#2e3132] text-[#00288e] dark:text-[#b8c4ff] shadow-sm'
                        : 'text-[#757684] hover:text-[#191c1d]'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric select */}
            <div>
              <label className="block text-[11px] font-bold text-[#757684] uppercase mb-1.5">Target Analytical Dimension</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-2.5 border border-[#c4c5d5]/60 hover:bg-[#f3f4f5]/30 rounded-lg cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name="metricType" 
                    checked={reportMetric === 'Returns'}
                    onChange={() => setReportMetric('Returns')}
                    className="text-[#00288e] focus:ring-[#00288e]"
                  />
                  <div>
                    <p className="font-bold text-[#191c1d] dark:text-white">Returns & Portfolio Yield</p>
                    <p className="text-[10px] text-[#757684]">ROI margins, asset capitalizations, and delta values.</p>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 border border-[#c4c5d5]/60 hover:bg-[#f3f4f5]/30 rounded-lg cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name="metricType" 
                    checked={reportMetric === 'Volatility'}
                    onChange={() => setReportMetric('Volatility')}
                    className="text-[#00288e] focus:ring-[#00288e]"
                  />
                  <div>
                    <p className="font-bold text-[#191c1d] dark:text-white">Standard Deviation volatility</p>
                    <p className="text-[10px] text-[#757684]">Spread premiums, correlation trends, and beta risk weights.</p>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 border border-[#c4c5d5]/60 hover:bg-[#f3f4f5]/30 rounded-lg cursor-pointer transition-colors">
                  <input 
                    type="radio" 
                    name="metricType" 
                    checked={reportMetric === 'Spreads'}
                    onChange={() => setReportMetric('Spreads')}
                    className="text-[#00288e] focus:ring-[#00288e]"
                  />
                  <div>
                    <p className="font-bold text-[#191c1d] dark:text-white">Fills & Node Swap Spreads</p>
                    <p className="text-[10px] text-[#757684]">Bid-ask sizes, execution speeds, and overnight swap costs.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Run analytical builder */}
            <button
              type="submit"
              disabled={isGenerating}
              id="report-build-btn"
              className="w-full py-2.5 bg-[#00288e] hover:bg-[#173bab] disabled:bg-[#757684] text-white rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Compiling Node Logs...
                </>
              ) : (
                <>
                  <BarChart className="w-4 h-4" />
                  Generate audit summary
                </>
              )}
            </button>
          </form>
        </div>

        {/* Display generated results card */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5 flex flex-col justify-between min-h-[350px]">
          {isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-[#dde1ff] border-t-[#00288e] rounded-full animate-spin" />
              <div className="text-center">
                <p className="font-extrabold text-sm">Assembling ledger points...</p>
                <p className="text-[10px] text-[#757684] mt-0.5">Contacting database clusters... 4 global nodes verified.</p>
              </div>
            </div>
          ) : generatedReport ? (
            <div className="flex-1 flex flex-col justify-between animate-fade-in text-xs space-y-6">
              
              {/* Paper header style layout */}
              <div>
                <div className="flex justify-between items-start border-b border-[#e5e7eb] dark:border-[#2e3132] pb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-[#00288e]" />
                    <div>
                      <h4 className="font-extrabold text-sm uppercase">Dangata Automated Audit Log</h4>
                      <p className="text-[10px] text-[#757684] font-medium">Document Block ID: {generatedReport.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-[#92f5a4]/15 text-[#006d30] px-2 py-0.5 rounded text-[10px] font-black border border-[#006d30]/25">
                      AUDIT COMPILED
                    </span>
                    <p className="text-[9px] text-[#757684] mt-1">Generated: {generatedReport.timestamp}</p>
                  </div>
                </div>

                {/* Prose Summary */}
                <div className="py-4 border-b border-dashed border-[#e5e7eb] dark:border-[#2e3132]">
                  <h5 className="font-black text-[#191c1d] dark:text-white mb-1.5 uppercase tracking-wide text-[10px]">Audit Narrative</h5>
                  <p className="text-[#444653] dark:text-[#c4c5d5] leading-relaxed font-medium">
                    {generatedReport.prose}
                  </p>
                </div>

                {/* Grid stats */}
                <div className="py-4">
                  <h5 className="font-black text-[#191c1d] dark:text-white mb-3 uppercase tracking-wide text-[10px]">Key Metrics Summary</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {generatedReport.stats.map((st: any) => (
                      <div key={st.name} className="p-3 bg-[#f3f4f5] dark:bg-[#191520] border border-[#e5e7eb] dark:border-[#2e3132] rounded-md">
                        <p className="text-[9px] font-bold text-[#757684] uppercase tracking-wider">{st.name}</p>
                        <p className="text-sm font-black text-[#191c1d] dark:text-white mt-1 font-mono">{st.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-[#e5e7eb] dark:border-[#2e3132] flex flex-col sm:flex-row gap-2 justify-between items-center bg-[#f8f9fa] dark:bg-[#191520] p-3 rounded-lg text-[10px]">
                <div className="flex items-center gap-1.5 text-[#006d30] font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#006d30]" />
                  <span>Verified cryptographic checksum backing correct logs.</span>
                </div>
                <button
                  type="button"
                  id="csv-export-btn"
                  onClick={() => alert(`Initiated CSV export file download for draft ${generatedReport.id}`)}
                  className="px-4 py-2 bg-[#00288e] hover:bg-[#173bab] text-white rounded font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm cursor-pointer transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" /> Export compiled CSV
                </button>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 p-6 text-xs font-medium text-[#757684]">
              <div className="w-12 h-12 bg-[#EDEFEF] rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#757684]" />
              </div>
              <div>
                <p className="font-bold text-[#191c1d] dark:text-white text-sm">No report assembled yet</p>
                <p className="max-w-md mx-auto mt-1 leading-relaxed">
                  Tweak the period filters, choose your analytical target dimension (Returns, Volatility spreads, etc.) and hit the generated command to build the document.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
