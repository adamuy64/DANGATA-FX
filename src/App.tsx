/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  FileSpreadsheet, 
  Layers, 
  TrendingUp,
  Download,
  Check
} from 'lucide-react';

import { ActiveTab, Transaction, MarketAsset, PortfolioItem, AppNotification } from './types';
import { 
  INITIAL_MARKET_ASSETS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_PORTFOLIO, 
  INITIAL_NOTIFICATIONS 
} from './data';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import MarketAnalysisView from './components/MarketAnalysisView';
import PortfolioView from './components/PortfolioView';
import TransactionsView from './components/TransactionsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import SupportView from './components/SupportView';

export default function App() {
  
  // Tab Routing Context
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Preference Settings Context
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [isPro, setIsPro] = useState(false);

  // Core Data States
  const [assets, setAssets] = useState<MarketAsset[]>(INITIAL_MARKET_ASSETS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Modal Control States
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Upgrade Checkout form States
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  // Export Progress form States
  const [exportFormat, setExportFormat] = useState<'CSV' | 'JSON' | 'PDF'>('CSV');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // Fetch from LocalStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('dfx_currency');
    const savedIsPro = localStorage.getItem('dfx_ispro');
    const savedTransactions = localStorage.getItem('dfx_transactions');
    const savedPortfolio = localStorage.getItem('dfx_portfolio');
    const savedNotifications = localStorage.getItem('dfx_notifications');

    if (savedCurrency) setCurrencySymbol(savedCurrency);
    if (savedIsPro) setIsPro(savedIsPro === 'true');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));

    // Dynamic price variance loop: Simulate market fluctuation ticks every 8 seconds
    const interval = setInterval(() => {
      setAssets(currentAssets => {
        const nextAssets = currentAssets.map(asset => {
          // Slight 0.1% to 0.4% fluctuation randomizer
          const ratio = 1 + ((Math.random() - 0.49) * 0.006);
          const nextPrice = asset.price * ratio;
          const nextSparkline = [...asset.sparkline.slice(1), nextPrice];
          return {
            ...asset,
            price: nextPrice,
            sparkline: nextSparkline,
            change24h: Number((asset.change24h + (ratio - 1) * 100).toFixed(2))
          };
        });

        // Update current price in Portfolio as well
        setPortfolio(currentPortfolio => {
          const nextPortfolio = currentPortfolio.map(item => {
            const match = nextAssets.find(a => a.symbol === item.symbol);
            if (!match) return item;
            const updatedValue = item.shares * match.price;
            const updatedProfit = updatedValue - (item.shares * item.avgBuyPrice);
            return {
              ...item,
              currentPrice: match.price,
              value: updatedValue,
              profit: updatedProfit,
              profitPercent: item.avgBuyPrice > 0 ? (updatedProfit / (item.shares * item.avgBuyPrice)) * 100 : 0
            };
          });
          localStorage.setItem('dfx_portfolio', JSON.stringify(nextPortfolio));
          return nextPortfolio;
        });

        return nextAssets;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Save changes to localStorage when states update
  const saveToStore = (key: string, data: any) => {
    localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
  };

  // Mark single Notification read
  const handleMarkRead = (id: string) => {
    const nextArr = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(nextArr);
    saveToStore('dfx_notifications', nextArr);
  };

  // Mark all notifications read
  const handleMarkAllRead = () => {
    const nextArr = notifications.map(n => ({ ...n, read: true }));
    setNotifications(nextArr);
    saveToStore('dfx_notifications', nextArr);
  };

  // Clear notifications
  const handleClearNotifications = () => {
    setNotifications([]);
    saveToStore('dfx_notifications', []);
  };

  // Central Order Execution Trade Engine
  const executeBrokerTrade = (symbol: string, type: 'Buy' | 'Sell', amount: number, price: number) => {
    const matchedAsset = assets.find(a => a.symbol === symbol);
    if (!matchedAsset) return;

    const totalCost = amount * price;

    // 1. Create and add transaction log
    const newTx: Transaction = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      asset: symbol,
      type,
      price,
      amount,
      total: totalCost,
      status: 'Completed'
    };

    const nextTxList = [newTx, ...transactions];
    setTransactions(nextTxList);
    saveToStore('dfx_transactions', nextTxList);

    // 2. Adjust Portfolio assets
    setPortfolio(currPortfolio => {
      let nextPortfolio = [...currPortfolio];
      const matchIndex = nextPortfolio.findIndex(item => item.symbol === symbol);

      if (type === 'Buy') {
        if (matchIndex >= 0) {
          // Exists already: Accumulate shares and adjust weighted entries average cost
          const existingItem = nextPortfolio[matchIndex];
          const newShares = existingItem.shares + amount;
          const newAvgPrice = ((existingItem.shares * existingItem.avgBuyPrice) + totalCost) / newShares;
          const newValue = newShares * price;
          const newProfit = newValue - (newShares * newAvgPrice);

          nextPortfolio[matchIndex] = {
            ...existingItem,
            shares: newShares,
            avgBuyPrice: newAvgPrice,
            currentPrice: price,
            value: newValue,
            profit: newProfit,
            profitPercent: newAvgPrice > 0 ? (newProfit / (newShares * newAvgPrice)) * 100 : 0
          };
        } else {
          // Create new portfolio item
          const colors = ['#00288e', '#006d30', '#757684', '#ba1a1a', '#700006'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const friendlyName = symbol.split('/')[0] || symbol;

          const newItem: PortfolioItem = {
            id: `PORT-${Date.now()}`,
            asset: matchedAsset.name,
            symbol,
            shares: amount,
            avgBuyPrice: price,
            currentPrice: price,
            value: totalCost,
            profit: 0,
            profitPercent: 0,
            color: randomColor
          };
          nextPortfolio.push(newItem);
        }
      } else {
        // Sell
        if (matchIndex >= 0) {
          const existingItem = nextPortfolio[matchIndex];
          // Restrict sell overflow - Sell at most owned amount
          const sellAmount = Math.min(existingItem.shares, amount);
          const remainingShares = existingItem.shares - sellAmount;
          
          if (remainingShares <= 0.0001) {
            // Remove completely
            nextPortfolio = nextPortfolio.filter(item => item.symbol !== symbol);
          } else {
            const newValue = remainingShares * price;
            const newProfit = newValue - (remainingShares * existingItem.avgBuyPrice);

            nextPortfolio[matchIndex] = {
              ...existingItem,
              shares: remainingShares,
              value: newValue,
              profit: newProfit,
              profitPercent: existingItem.avgBuyPrice > 0 ? (newProfit / (remainingShares * existingItem.avgBuyPrice)) * 100 : 0
            };
          }
        }
      }

      saveToStore('dfx_portfolio', nextPortfolio);
      return nextPortfolio;
    });

    // 3. Post a brand new Notification
    const newNotification: AppNotification = {
      id: `NOT-${Date.now()}`,
      title: 'Order Executed',
      message: `Your ${type} market order for ${amount} units of ${symbol} filled at ${price.toLocaleString()}`,
      time: 'Just now',
      read: false,
      type: 'success'
    };
    const nextAlertsList = [newNotification, ...notifications];
    setNotifications(nextAlertsList);
    saveToStore('dfx_notifications', nextAlertsList);
  };

  // Perform a full reset data back to baseline
  const resetAllData = () => {
    localStorage.clear();
    setCurrencySymbol('$');
    setIsPro(false);
    setAssets(INITIAL_MARKET_ASSETS);
    setTransactions(INITIAL_TRANSACTIONS);
    setPortfolio(INITIAL_PORTFOLIO);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveTab('dashboard');
  };

  // Checkouts handle
  const handleUpgradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardName) return;

    setUpgradeSuccess(true);
    setTimeout(() => {
      setIsPro(true);
      saveToStore('dfx_ispro', 'true');
      setShowUpgradeModal(false);
      setUpgradeSuccess(false);
      setCardNumber('');
      setCardName('');

      // Add dynamic alert
      const newNotification: AppNotification = {
        id: `NOT-${Date.now()}`,
        title: 'Upgrade Accomplished',
        message: 'Congratulations! Your account was upgraded to Pro Analyst status. Detailed models unlocked.',
        time: 'Just now',
        read: false,
        type: 'success'
      };
      setNotifications(prev => [newNotification, ...prev]);
    }, 1500);
  };

  // Exports handle
  const handleExportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);
    setExportComplete(false);

    // Simulate downloading latency
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => {
        setShowExportModal(false);
        setExportComplete(false);
      }, 1500);
    }, 2000);
  };

  // Quick route helper passed into profile clicks
  const navigateToTab = (tab: 'settings' | 'support' | 'market') => {
    setActiveTab(tab);
  };

  // Aggregation trackers
  const totalMarketValue = portfolio.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fa] dark:bg-[#131118] text-[#191c1d] dark:text-gray-100 transition-colors duration-300">
      
      {/* Sidebar navigation (Shared layout) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarIsOpen}
        onClose={() => setSidebarIsOpen(false)}
        onUpgradeClick={() => setShowUpgradeModal(true)}
      />

      {/* Main Content Area flow */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative bg-[#f8f9fa] dark:bg-[#131118]">
        
        {/* Top Navbar Header (Shared layout) */}
        <Header 
          onMenuToggle={() => setSidebarIsOpen(!sidebarIsOpen)}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllRead}
          onClearNotifications={handleClearNotifications}
          onNotificationRead={handleMarkRead}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNavigateToTab={navigateToTab}
          userEmail="adamuy64@gmail.com"
          isPro={isPro}
        />

        {/* Stateful Dynamic Router Views */}
        <div className="flex-1 min-h-[calc(100vh-4.5rem)]">
          {activeTab === 'dashboard' && (
            <DashboardView 
              onUpgradeClick={() => setShowUpgradeModal(true)}
              onExportClick={() => setShowExportModal(true)}
              currencySymbol={currencySymbol}
              isPro={isPro}
              totalMarketValue={totalMarketValue}
              activeTxCount={transactions.length}
            />
          )}

          {activeTab === 'market' && (
            <MarketAnalysisView 
              assets={assets}
              searchQuery={searchQuery}
              onTradeAction={(sym, type) => {
                const asset = assets.find(a => a.symbol === sym);
                if (asset) executeBrokerTrade(sym, type, 100, asset.price);
              }}
              currencySymbol={currencySymbol}
              isPro={isPro}
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioView 
              portfolio={portfolio}
              assets={assets}
              onExecuteTrade={executeBrokerTrade}
              currencySymbol={currencySymbol}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView 
              transactions={transactions}
              searchQuery={searchQuery}
              currencySymbol={currencySymbol}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView 
              portfolio={portfolio} 
              currencySymbol={currencySymbol}
              isPro={isPro}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView 
              currencySymbol={currencySymbol}
              setCurrencySymbol={setCurrencySymbol}
              isPro={isPro}
              setIsPro={setIsPro}
              onResetData={resetAllData}
            />
          )}

          {activeTab === 'support' && (
            <SupportView />
          )}
        </div>

      </main>

      {/* INTERACTIVE MODAL 1: Upgrade Pro Analyst Checkout Simulation */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] max-w-md w-full rounded-xl shadow-2xl p-6 relative"
            id="upgrade-modal-card"
          >
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute right-4 top-4 p-1 rounded-md hover:bg-[#f3f4f5] dark:hover:bg-[#2e3132]"
              id="close-upgrade-modal"
            >
              <X className="w-5 h-5 text-[#757684]" />
            </button>

            {upgradeSuccess ? (
              <div className="text-center py-8 space-y-4 animate-scale-up">
                <div className="w-16 h-16 bg-[#92f5a4]/25 text-[#006d30] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#191c1d] dark:text-white">Upgrade Succeeded!</h4>
                  <p className="text-xs text-[#757684] mt-1 max-w-xs mx-auto">
                    You have unlocked Pro capability metrics, Summer season models, custom correlations and alpha indices correctly. Enjoy!
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpgradeSubmit} className="space-y-4 text-xs font-semibold">
                
                {/* Title badge */}
                <div className="text-center pb-3 border-b border-[#e5e7eb] dark:border-[#2e3132]">
                  <div className="inline-flex items-center gap-1.5 p-1 px-3 bg-[#1e40af]/10 rounded-full font-black text-[#00288e] dark:text-[#b8c4ff] text-[10px] uppercase">
                    <Sparkles className="w-4 h-4 animate-pulse" /> Unlock Charts Pro
                  </div>
                  <h4 className="text-base font-extrabold tracking-tight mt-2 text-[#191c1d] dark:text-white">Dangata FX Premium License</h4>
                  <p className="text-[10px] text-[#757684]">Unblocks advanced forecasting engines and alpha metrics overlays.</p>
                </div>

                {/* Benefits */}
                <div className="space-y-2 p-3 bg-[#edeef0]/60 dark:bg-[#191520] rounded-lg border border-[#c4c5d5]/40 leading-relaxed font-semibold text-[#444653] dark:text-[#c4c5d5]">
                  <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#00288e] dark:text-[#b8c4ff]">
                    <ShieldCheck className="w-4 h-4 text-[#006d30]" /> Premium Privileges
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] font-medium font-sans">
                    <li>Dynamic summer scaling models.</li>
                    <li>Detailed analytical report generator outlines.</li>
                    <li>Advanced cross-asset correlation vectors (r-factors).</li>
                  </ul>
                </div>

                {/* Form fields */}
                <div className="space-y-3 font-medium">
                  <div>
                    <label className="block text-[10px] font-bold text-[#757684] uppercase mb-1">Holder Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Adam Dangata"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-transparent border border-[#c4c5d5] rounded p-2 outline-none font-semibold focus:border-[#00288e]"
                      id="checkout-cardname"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#757684] uppercase mb-1">Credit Card Number</label>
                    <div className="flex bg-transparent border border-[#c4c5d5] rounded p-2 focus-within:border-[#00288e]">
                      <CreditCard className="w-4 h-4 text-[#757684] mr-2" />
                      <input 
                        type="text" 
                        required
                        placeholder="4000 1234 5678 9010 (Test OK)"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="bg-transparent border-none focus:outline-none w-full text-xs font-semibold"
                        id="checkout-cardnumber"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#757684] uppercase mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        required
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-transparent border border-[#c4c5d5] rounded p-2 outline-none font-semibold focus:border-[#00288e]"
                        id="checkout-expiry"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#757684] uppercase mb-1">CVV Check</label>
                      <input 
                        type="password" 
                        required
                        maxLength={3}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-transparent border border-[#c4c5d5] rounded p-2 outline-none font-semibold focus:border-[#00288e]"
                        id="checkout-cvv"
                      />
                    </div>
                  </div>
                </div>

                {/* Pay Trigger */}
                <button
                  type="submit"
                  id="checkout-submit-btn"
                  className="w-full py-2.5 bg-[#00288e] hover:bg-[#173bab] text-white rounded font-bold uppercase tracking-wider hover:shadow-md transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-1.5 text-xs text-center"
                >
                  <CreditCard className="w-4 h-4" /> Charge Standard $49.00 Fee
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* INTERACTIVE MODAL 2: Premium Data Export Manager */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] max-w-sm w-full rounded-xl shadow-2xl p-6 relative text-xs text-[#191c1d] dark:text-white"
            id="export-modal-card"
          >
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute right-4 top-4 p-1 rounded-md hover:bg-[#f3f4f5] dark:hover:bg-[#2e3132]"
              id="close-export-modal"
            >
              <X className="w-5 h-5 text-[#757684]" />
            </button>

            {exportComplete ? (
              <div className="text-center py-6 space-y-4 animate-scale-up">
                <div className="w-12 h-12 bg-[#92f5a4]/25 text-[#006d30] rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm uppercase">Export Succeeded!</h4>
                  <p className="text-[11px] text-[#757684] mt-1">
                    Your formatted transaction ledger was compiled and transmitted as a file.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExportSubmit} className="space-y-4 font-semibold">
                
                <div className="text-center pb-2 border-b border-[#e5e7eb] dark:border-[#2e3132]">
                  <Download className="w-10 h-10 text-[#00288e] mx-auto mb-2" />
                  <h4 className="font-extrabold text-sm uppercase">Export Ledger History</h4>
                  <p className="text-[11px] text-[#757684]">Compile financial reports to file format</p>
                </div>

                {isExporting ? (
                  <div className="py-6 space-y-3.5 text-center">
                    <div className="w-full bg-[#e5e7eb] h-2 rounded overflow-hidden">
                      <div className="bg-[#00288e] h-full rounded w-3/4 animate-pulse" />
                    </div>
                    <p className="text-[10px] text-[#757684] uppercase tracking-wider animate-pulse font-bold">Compiling Excel rows...</p>
                  </div>
                ) : (
                  <div className="space-y-4 font-medium">
                    
                    {/* Format picks */}
                    <div>
                      <p className="text-[10px] text-[#757684] uppercase font-bold mb-1.5">Select Export Format</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'CSV Spreadsheet', value: 'CSV' },
                          { label: 'Raw JSON Object', value: 'JSON' },
                          { label: 'PDF Document', value: 'PDF' },
                        ].map((fmt) => (
                          <button
                            key={fmt.value}
                            type="button"
                            onClick={() => setExportFormat(fmt.value as any)}
                            className={`p-2 border text-center rounded transition-all active:scale-95 cursor-pointer font-bold uppercase text-[9px] tracking-wide ${
                              exportFormat === fmt.value
                                ? 'border-[#00288e] bg-[#1e40af]/10 text-[#00288e] dark:text-[#dde1ff]'
                                : 'border-[#c4c5d5]/60 hover:bg-[#f3f4f5]/30 text-[#444653]'
                            }`}
                          >
                            {fmt.value}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="export-submit-trigger"
                      className="w-full py-2.5 bg-[#00288e] hover:bg-[#173bab] text-white rounded font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                    >
                      <Download className="w-4 h-4" /> Begin Compilation
                    </button>
                  </div>
                )}

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
