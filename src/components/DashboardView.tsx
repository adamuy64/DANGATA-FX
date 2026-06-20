/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  AlertCircle, 
  TrendingDown, 
  DollarSign, 
  FileSpreadsheet, 
  Sparkles,
  RefreshCw 
} from 'lucide-react';
import { INITIAL_MONTHLY_SALES, ADVERTISING_ROI_POINTS, PERFORMANCE_BAR_DATA } from '../data';

interface DashboardViewProps {
  onUpgradeClick: () => void;
  onExportClick: () => void;
  currencySymbol: string;
  isPro: boolean;
  totalMarketValue: number;
  activeTxCount: number;
}

export default function DashboardView({ 
  onUpgradeClick, 
  onExportClick, 
  currencySymbol,
  isPro,
  totalMarketValue,
  activeTxCount
}: DashboardViewProps) {
  
  // Date selection states
  const [dateRange, setDateRange] = useState('Jan 2024 - May 2024');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Chart interactivity states
  const [activeLinePoint, setActiveLinePoint] = useState<number | null>(null);
  const [hoveredDonutSegment, setHoveredDonutSegment] = useState<'A' | 'B' | 'Others' | null>(null);
  const [activeBarIdx, setActiveBarIdx] = useState<number | null>(null);
  const [activeScatterIdx, setActiveScatterIdx] = useState<number | null>(null);

  // Dynamic values based on time-periods
  const [periodFactor, setPeriodFactor] = useState(1.0);

  const handlePeriodChange = (label: string, factor: number) => {
    setDateRange(label);
    setPeriodFactor(factor);
    setShowDatePicker(false);
  };

  // SVG dimensions
  const lineWidth = 550;
  const lineHeight = 180;
  const linePoints = INITIAL_MONTHLY_SALES.map((item, idx) => {
    const x = 40 + (idx * (lineWidth - 80) / (INITIAL_MONTHLY_SALES.length - 1));
    const y = lineHeight - 20 - ((item.units * periodFactor * (lineHeight - 50)) / 850);
    return { ...item, x, y, idx, units: Math.round(item.units * periodFactor) };
  });

  // Re-generate line chart stroke path
  const linePath = linePoints.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Market share distribution specs
  const donutData = {
    A: { percentage: 55, name: 'Product A', color: '#00288e', raw: 420 },
    B: { percentage: 25, name: 'Product B', color: '#006d30', raw: 190 },
    Others: { percentage: 20, name: 'Others Group', color: '#757684', raw: 153 }
  };

  // Active donut label calculation
  const getDonutLabel = () => {
    if (hoveredDonutSegment === 'A' || !hoveredDonutSegment) {
      return { val: '55.0%', name: 'Product A' };
    }
    if (hoveredDonutSegment === 'B') {
      return { val: '25.0%', name: 'Product B' };
    }
    return { val: '20.0%', name: 'Others' };
  };

  const donutMetric = getDonutLabel();

  return (
    <div className="p-4 md:p-8 space-y-6">
      
      {/* 1. Header Page Title Card */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="font-sans text-2xl md:text-3xl font-extrabold text-[#191c1d] tracking-tight flex items-center gap-2">
            Financial Dashboard
          </h3>
          <p className="text-sm text-[#444653] dark:text-[#c4c5d5] mt-1 font-medium">
            Real-time analytical overview of market performance and sales growth indexes.
          </p>
        </div>

        {/* Date Filter & Export Utilities */}
        <div className="flex flex-wrap items-center gap-2 relative">
          <button 
            id="dashboard-datepicker-btn"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="px-4 py-2 border border-[#757684]/30 hover:border-[#00288e] bg-white dark:bg-[#201c2a] text-[#191c1d] dark:text-white rounded text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Calendar className="w-4 h-4 text-[#00288e]" />
            <span>{dateRange}</span>
          </button>

          {/* Custom Datepicker Droplist */}
          {showDatePicker && (
            <div 
              className="absolute right-0 top-11 bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] shadow-xl rounded-lg py-2 w-56 z-30 animate-fade-in text-xs"
              id="datepicker-dropdown"
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-[#757684] uppercase tracking-wider">Select Period</div>
              <button 
                onClick={() => handlePeriodChange('Jan 2024 - May 2024', 1.0)}
                className="w-full text-left px-4 py-2 hover:bg-[#f3f4f5] dark:hover:bg-[#2e3132] font-semibold text-[#191c1d] dark:text-white"
              >
                Jan 2024 - May 2024 (Baseline)
              </button>
              <button 
                onClick={() => handlePeriodChange('Q1 Peak - 2024', 0.82)}
                className="w-full text-left px-4 py-2 hover:bg-[#f3f4f5] dark:hover:bg-[#2e3132] font-semibold text-[#191c1d] dark:text-white"
              >
                Q1 Performance (0.82x scaling)
              </button>
              <button 
                onClick={() => handlePeriodChange('Summer Projections', 1.34)}
                className="w-full text-left px-4 py-2 hover:bg-[#f3f4f5] dark:hover:bg-[#2e3132] font-semibold text-[#191c1d] dark:text-white pointer-events-auto"
              >
                Summer Projections (1.34x scaling) { !isPro && '⭐ Pro' }
              </button>
            </div>
          )}

          <button 
            id="dashboard-export-btn"
            onClick={onExportClick}
            className="px-4 py-2 bg-[#00288e] hover:bg-[#173bab] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* 2. Charts Bento Grid */}
      <div className="grid grid-cols-12 gap-6">

        {/* [Chart A]: Line Chart - Monthly Sales Growth */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5 flex flex-col hover:shadow-lg transition-all duration-300 relative group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-sm tracking-tight text-[#191c1d] dark:text-white uppercase">
                Monthly Sales Growth
              </h4>
              <p className="text-[11px] text-[#757684] mt-0.5">Continuous volume of processed asset orders</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00288e]"></span>
              <span className="text-[11px] font-bold text-[#444653] dark:text-[#c4c5d5]">Sales Units ({currencySymbol})</span>
            </div>
          </div>

          {/* Handcrafted Responsive SVG Line Plot */}
          <div className="flex-1 min-h-[220px] relative mt-2 w-full flex items-center justify-center">
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox={`0 0 ${lineWidth} ${lineHeight}`}
              preserveAspectRatio="none"
              id="sales-line-chart"
            >
              {/* Baseline grid */}
              <line 
                x1="20" 
                y1={lineHeight - 20} 
                x2={lineWidth - 20} 
                y2={lineHeight - 20} 
                stroke="#e1e3e4" 
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <line 
                x1="20" 
                y1="30" 
                x2={lineWidth - 20} 
                y2="30" 
                stroke="#f3f4f5" 
                strokeWidth="1"
              />

              {/* Connected Line Path */}
              <path 
                d={linePath} 
                fill="none" 
                stroke="#00288e" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                className="transition-all duration-500"
              />

              {/* Glowing shaded area under the trend line */}
              <path
                d={`${linePath} L ${linePoints[linePoints.length - 1].x} ${lineHeight - 20} L ${linePoints[0].x} ${lineHeight - 20} Z`}
                fill="url(#lineGradient)"
                opacity="0.08"
                className="transition-all duration-500"
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00288e" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>

              {/* Interactive Point Rings & Interactive Hover Areas */}
              {linePoints.map((pt) => {
                const isHovered = activeLinePoint === pt.idx;
                return (
                  <g key={pt.idx} className="cursor-pointer">
                    {/* Invisible larger hover zone */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="16"
                      fill="transparent"
                      onMouseEnter={() => setActiveLinePoint(pt.idx)}
                      onMouseLeave={() => setActiveLinePoint(null)}
                    />
                    {/* Visible outer hover animation ring */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? "8" : "4.5"}
                      fill="#00288e"
                      stroke="#ffffff"
                      strokeWidth={isHovered ? "2.5" : "1.5"}
                      className="transition-all duration-200"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Dynamic Custom Floating Tooltip */}
            {activeLinePoint !== null && (
              <div 
                className="absolute bg-[#191c1d] text-white text-xs px-2.5 py-1.5 rounded-md shadow-xl pointer-events-none z-10 transition-all font-sans"
                style={{
                  left: `${(linePoints[activeLinePoint].x / lineWidth) * 90}%`,
                  top: `${(linePoints[activeLinePoint].y / lineHeight) * 70}%`
                }}
              >
                <p className="font-bold">{linePoints[activeLinePoint].month}</p>
                <p className="text-[10px] text-gray-300 mt-0.5">
                  Orders: <span className="font-mono text-white text-xs">{currencySymbol}{linePoints[activeLinePoint].units},000</span>
                </p>
              </div>
            )}
          </div>

          {/* X Axis Month Labels */}
          <div className="flex justify-between items-center mt-4 px-6 text-[10px] font-bold text-[#757684] uppercase tracking-wider">
            {INITIAL_MONTHLY_SALES.map((item, idx) => (
              <button 
                key={item.month}
                onClick={() => setActiveLinePoint(idx)}
                className={`transition-colors hover:text-[#00288e] ${activeLinePoint === idx ? 'text-[#00288e] underline' : ''}`}
              >
                {item.month}
              </button>
            ))}
          </div>
        </div>

        {/* [Chart B]: Pie/Donut Chart - Market Share */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5 flex flex-col hover:shadow-lg transition-all duration-300">
          <h4 className="font-bold text-sm tracking-tight text-[#191c1d] dark:text-white uppercase mb-4">
            Market Share Distribution
          </h4>

          <div className="flex-1 flex flex-col items-center justify-center">
            {/* The Donut Ring SVG */}
            <div className="relative w-44 h-44 group cursor-pointer">
              <svg className="w-full h-full rotate-[-90deg] overflow-visible" viewBox="0 0 36 36">
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.9" 
                  fill="transparent" 
                  stroke="#e1e3e4" 
                  strokeWidth="3.2" 
                />
                
                {/* Product A: 55% */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.9" 
                  fill="transparent" 
                  stroke={donutData.A.color} 
                  strokeWidth={hoveredDonutSegment === 'A' ? "4.5" : "3.6"} 
                  strokeDasharray="55 100" 
                  strokeDashoffset="0"
                  className="transition-all duration-300"
                  onMouseEnter={() => setHoveredDonutSegment('A')}
                  onMouseLeave={() => setHoveredDonutSegment(null)}
                />

                {/* Product B: 25% */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.9" 
                  fill="transparent" 
                  stroke={donutData.B.color} 
                  strokeWidth={hoveredDonutSegment === 'B' ? "4.5" : "3.6"} 
                  strokeDasharray="25 100" 
                  strokeDashoffset="-55"
                  className="transition-all duration-300"
                  onMouseEnter={() => setHoveredDonutSegment('B')}
                  onMouseLeave={() => setHoveredDonutSegment(null)}
                />

                {/* Others: 20% */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.9" 
                  fill="transparent" 
                  stroke={donutData.Others.color} 
                  strokeWidth={hoveredDonutSegment === 'Others' ? "4.5" : "3.6"} 
                  strokeDasharray="20 100" 
                  strokeDashoffset="-80"
                  className="transition-all duration-300"
                  onMouseEnter={() => setHoveredDonutSegment('Others')}
                  onMouseLeave={() => setHoveredDonutSegment(null)}
                />
              </svg>

              {/* Dynamic Inside Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-[#00288e] dark:text-[#b8c4ff] tracking-tight">
                  {donutMetric.val}
                </span>
                <span className="text-[10px] text-[#757684] font-bold uppercase tracking-wide">
                  {donutMetric.name}
                </span>
              </div>
            </div>

            {/* List Legends */}
            <div className="mt-6 w-full space-y-2 text-xs">
              {(Object.keys(donutData) as Array<keyof typeof donutData>).map((key) => {
                const item = donutData[key];
                const isHovered = hoveredDonutSegment === key;
                return (
                  <div 
                    key={key}
                    onMouseEnter={() => setHoveredDonutSegment(key)}
                    onMouseLeave={() => setHoveredDonutSegment(null)}
                    className={`flex items-center justify-between p-1.5 rounded-md transition-all cursor-crosshair ${
                      isHovered ? 'bg-[#f3f4f5] dark:bg-[#2c2837]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="font-semibold text-[#191c1d] dark:text-white">{item.name}</span>
                    </div>
                    <span className="font-mono text-[#757684] font-bold">
                      {item.percentage * periodFactor ? Math.round(item.percentage * periodFactor * 10) / 10 : item.percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* [Chart C]: Bar Chart - Product Performance Comparison */}
        <div className="col-span-12 md:col-span-6 bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5 flex flex-col hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-sm tracking-tight text-[#191c1d] dark:text-white uppercase">
                Product Performance comparison
              </h4>
              <p className="text-[11px] text-[#757684] mt-0.5">Rating values across internal business categories</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#b8c4ff] dark:bg-[#445bb3]"></span>
                <span className="text-[10px] font-bold text-[#757684] uppercase">Standard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#79db8d] dark:bg-[#007233]"></span>
                <span className="text-[10px] font-bold text-[#757684] uppercase">Outperformer</span>
              </div>
            </div>
          </div>

          {/* Interactive Bar Pillars */}
          <div className="h-56 flex items-end justify-around gap-4 pb-4 border-b border-[#e5e7eb] dark:border-[#2e3132] pt-4 relative">
            {PERFORMANCE_BAR_DATA.map((bar, idx) => {
              const heightPct = bar.standard ? bar.standard : bar.outperformer || 0;
              const scaledHeight = heightPct * periodFactor;
              const isOutperformer = !!bar.outperformer;
              const isHovered = activeBarIdx === idx;

              return (
                <div 
                  key={bar.category}
                  className="flex flex-col items-center w-full max-w-[60px] relative cursor-pointer"
                  onMouseEnter={() => setActiveBarIdx(idx)}
                  onMouseLeave={() => setActiveBarIdx(null)}
                >
                  {/* Dynamic Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-12 bg-[#191c1d] text-white text-[10px] p-1.5 rounded shadow-xl z-15 w-max">
                      <p className="font-bold">{bar.category} Score</p>
                      <p className="text-gray-300">Value: <span className="font-mono text-white text-xs">{Math.round(scaledHeight)}%</span></p>
                    </div>
                  )}

                  {/* Bar Box */}
                  <div 
                    className={`w-full rounded-t transition-all duration-300 outline-none ${
                      isOutperformer 
                        ? 'bg-[#006d30] dark:bg-[#92f5a4] hover:opacity-90' 
                        : 'bg-[#00288e] dark:bg-[#b8c4ff] hover:opacity-90'
                    } ${isHovered ? 'scale-x-105 shadow-md brightness-110' : ''}`}
                    style={{ height: `${Math.min(scaledHeight, 100)}%` }}
                  />

                  {/* Category Code Label */}
                  <span className="text-[10px] font-bold text-[#757684] uppercase mt-2">
                    {bar.category}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Compact summary detail caption */}
          <div className="mt-4 text-center">
            <span className="inline-flex text-[10px] text-[#444653] dark:text-[#c4c5d5] bg-[#f3f4f5] dark:bg-[#2e3132] px-3 py-1 rounded font-semibold">
              Category B outperforms overall with 95% market stability rating.
            </span>
          </div>
        </div>

        {/* [Chart D]: Scatter Chart - Advertising ROI Analysis */}
        <div className="col-span-12 md:col-span-6 bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5 flex flex-col hover:shadow-lg transition-all duration-300">
          <h4 className="font-bold text-sm tracking-tight text-[#191c1d] dark:text-white uppercase mb-2">
            Advertising ROI Analysis
          </h4>
          <p className="text-[11px] text-[#757684] mb-3">Relationship: Weekly Advertising Spend vs. Conversions</p>

          <div className="relative h-56 w-full border-l border-b border-[#e5e7eb] dark:border-[#2e3132] pt-4 pl-4 group">
            {/* Regression Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden" preserveAspectRatio="none" viewBox="0 0 100 100">
              <line 
                x1="10" y1="90" 
                x2="95" y2="10" 
                stroke="#00288e" 
                strokeOpacity="0.25"
                strokeWidth="1.5" 
                strokeDasharray="3,3" 
              />
            </svg>

            {/* Scatter coordinate nodes */}
            {ADVERTISING_ROI_POINTS.map((pt, idx) => {
              const isHovered = activeScatterIdx === idx;
              return (
                <div
                  key={idx}
                  className="absolute w-3.5 h-3.5 rounded-full cursor-help transition-all duration-200 hover:scale-130"
                  style={{
                    bottom: `${pt.revenue - 5}%`,
                    left: `${pt.spend - 5}%`,
                    backgroundColor: isHovered ? '#006d30' : '#00288e',
                    boxShadow: isHovered ? '0 0 12px #92f5a4' : 'none',
                  }}
                  onMouseEnter={() => setActiveScatterIdx(idx)}
                  onMouseLeave={() => setActiveScatterIdx(null)}
                >
                  {/* Scatter Floating Coordinate badge */}
                  {isHovered && (
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#191c1d] text-white text-[9px] p-1.5 rounded shadow-xl z-20 w-32 font-sans font-semibold">
                      <p className="text-gray-300">Spend: ${pt.spend}k</p>
                      <p className="text-white">Revenue: ${pt.revenue}k</p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Axes captions */}
            <div className="absolute -left-1 text-[9px] font-bold text-[#757684] tracking-wider uppercase top-1/2 -rotate-90">
              Sales Revenue
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#757684] tracking-wider uppercase">
              Advertising Spend
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center bg-[#f3f4f5] dark:bg-[#191520] p-3 rounded border border-[#e5e7eb] dark:border-[#2e3132]">
            <span className="text-xs font-semibold text-[#444653] dark:text-[#c4c5d5]">Pearson Product correlation (r)</span>
            <span className="font-mono text-xs text-[#00288e] dark:text-[#b8c4ff] font-bold">r = 0.92 (Strong Positive)</span>
          </div>
        </div>

      </div>

      {/* 3. Footer Summary Area Row */}
      <div className="bg-[#edeef0] dark:bg-[#1d1927] rounded-xl p-6 border border-[#c4c5d5] dark:border-[#2e3132] shadow-sm flex flex-wrap gap-6 justify-between">
        
        <div className="flex-1 min-w-[200px] border-r border-[#c4c5d5]/40 pr-4 last:border-0">
          <p className="text-[10px] font-bold text-[#757684] uppercase tracking-wider">Total Market Value</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h5 className="text-2xl md:text-3xl font-black text-[#191c1d] dark:text-white tracking-tight">
              {currencySymbol}{(totalMarketValue * periodFactor).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h5>
            <span className="text-xs font-bold text-[#006d30] flex items-center bg-[#92f5a4]/20 px-1.5 py-0.5 rounded gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> 12.4%
            </span>
          </div>
          <p className="text-[11px] text-[#757684] mt-0.5 font-semibold">Live asset valuation benchmark</p>
        </div>

        <div className="flex-1 min-w-[200px] border-r border-[#c4c5d5]/40 pr-4 last:border-0 md:pl-2">
          <p className="text-[10px] font-bold text-[#757684] uppercase tracking-wider">Portfolio Risk Index</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h5 className="text-2xl md:text-3xl font-black text-[#00288e] dark:text-[#b8c4ff] tracking-tight">
              Low Range
            </h5>
            <span className="text-xs font-bold text-[#006d30] uppercase bg-[#92f5a4]/20 px-1.5 py-0.5 rounded">
              Secure
            </span>
          </div>
          <p className="text-[11px] text-[#757684] mt-0.5 font-semibold font-sans">98.2% stable backing index</p>
        </div>

        <div className="flex-1 min-w-[200px] pr-2 last:border-0 md:pl-2">
          <p className="text-[10px] font-bold text-[#757684] uppercase tracking-wider">Active Transactions</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h5 className="text-2xl md:text-3xl font-black text-[#191c1d] dark:text-white tracking-tight">
              {activeTxCount}
            </h5>
            <span className="text-[10px] text-[#444653] dark:text-[#c4c5d5] bg-white/60 dark:bg-black/20 px-1.5 py-0.5 rounded font-black">
              Today
            </span>
          </div>
          <p className="text-[11px] text-[#757684] mt-0.5 font-semibold">Processed trades processed on our node</p>
        </div>

      </div>

    </div>
  );
}
