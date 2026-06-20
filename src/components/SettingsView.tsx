/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Settings as SettingsIcon,
  ShieldAlert, 
  Coins, 
  Bell, 
  ShieldCheck, 
  Trash2, 
  RefreshCcw,
  Sparkles
} from 'lucide-react';

interface SettingsViewProps {
  currencySymbol: string;
  setCurrencySymbol: (symbol: string) => void;
  isPro: boolean;
  setIsPro: (pro: boolean) => void;
  onResetData: () => void;
}

export default function SettingsView({ 
  currencySymbol, 
  setCurrencySymbol, 
  isPro, 
  setIsPro,
  onResetData 
}: SettingsViewProps) {
  
  // Local preferences states
  const [enableSMS, setEnableSMS] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [spreadAlerts, setSpreadAlerts] = useState(true);
  const [resetMessage, setResetMessage] = useState(false);

  // Currency drop helper
  const handleCurrencyDrop = (symbol: string) => {
    setCurrencySymbol(symbol);
  };

  const triggerReset = () => {
    onResetData();
    setResetMessage(true);
    setTimeout(() => setResetMessage(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      
      {/* View Header */}
      <div>
        <h3 className="font-sans text-2xl font-extrabold text-[#191c1d] tracking-tight">System Settings</h3>
        <p className="text-sm text-[#444653] dark:text-[#c4c5d5] mt-1 font-medium">
          Customize your broker preferences, currency standards, and notification parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Core Localization Settings */}
        <div className="bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5 space-y-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 mb-2 text-[#00288e] dark:text-[#b8c4ff] border-b border-[#e5e7eb] dark:border-[#2e3132] pb-3">
            <Coins className="w-5 h-5" />
            <h4 className="font-bold text-sm tracking-tight uppercase text-[#191c1d] dark:text-white">Localization Preferences</h4>
          </div>

          {/* Currencies picker */}
          <div className="space-y-3">
            <div>
              <p className="text-[11px] text-[#757684] uppercase font-bold mb-1.5">Standard Currency Denomination</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'USD ($)', sym: '$' },
                  { label: 'EUR (€)', sym: '€' },
                  { label: 'GBP (£)', sym: '£' },
                  { label: 'JPY (¥)', sym: '¥' },
                ].map((cur) => (
                  <button
                    key={cur.sym}
                    id={`set-currency-${cur.sym}`}
                    onClick={() => handleCurrencyDrop(cur.sym)}
                    className={`p-2 border text-center rounded transition-all active:scale-95 cursor-pointer font-bold ${
                      currencySymbol === cur.sym
                        ? 'border-[#00288e] bg-[#1e40af]/10 text-[#00288e] dark:text-[#dde1ff]'
                        : 'border-[#c4c5d5]/60 hover:bg-[#f3f4f5]/30 text-[#444653] dark:text-[#c4c5d5]'
                    }`}
                  >
                    {cur.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-[#757684] font-medium mt-1.5 leading-relaxed">
                Updating this option recalculates all net worth assets, listings, transactions, and report compilations.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Account Licensing settings */}
        <div className="bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5 space-y-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 mb-2 text-[#00288e] dark:text-[#b8c4ff] border-b border-[#e5e7eb] dark:border-[#2e3132] pb-3">
            <Sparkles className="w-5 h-5" />
            <h4 className="font-bold text-sm tracking-tight uppercase text-[#191c1d] dark:text-white">Broker Membership Account</h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#1e40af]/5 rounded-lg border border-[#00288e]/10">
              <div>
                <p className="font-black text-[#191c1d] dark:text-white">Pro Analytics Module</p>
                <p className="text-[10px] text-[#757684] mt-0.5 max-w-[210px] leading-relaxed">
                  Unblocks Summer scaling projections and detailed custom report narratives.
                </p>
              </div>

              {/* Pro Toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isPro}
                  id="settings-pro-toggle"
                  onChange={(e) => setIsPro(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00288e]" />
              </label>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-[#444653] dark:text-[#c4c5d5] justify-center pt-2">
              <ShieldCheck className="w-4 h-4 text-[#006d30]" />
              <span>{isPro ? 'Pro Member Account activated.' : 'Standard trial account (features limited).'}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Alert Rules Preferences */}
        <div className="bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5 space-y-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 mb-2 text-[#00288e] dark:text-[#b8c4ff] border-b border-[#e5e7eb] dark:border-[#2e3132] pb-3">
            <Bell className="w-5 h-5" />
            <h4 className="font-bold text-sm tracking-tight uppercase text-[#191c1d] dark:text-white">Notification Alert toggles</h4>
          </div>

          <div className="space-y-3 font-medium">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={spreadAlerts}
                onChange={(e) => setSpreadAlerts(e.target.checked)}
                className="w-4 h-4 text-[#00288e] rounded ring-none border-[#c4c5d5]"
              />
              <div>
                <p className="font-bold text-[#191c1d] dark:text-white mt-0.5">Spread Breakout Alerts</p>
                <p className="text-[10px] text-[#757684]">Notify when market spreads on EUR, GBP crosses exceed threshold filters.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="w-4 h-4 text-[#00288e] rounded ring-none border-[#c4c5d5]"
              />
              <div>
                <p className="font-bold text-[#191c1d] dark:text-white mt-0.5">Weekly Performance Reports</p>
                <p className="text-[10px] text-[#757684]">Deliver processed trade logs digests to your profile email inbox.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={enableSMS}
                onChange={(e) => setEnableSMS(e.target.checked)}
                className="w-4 h-4 text-[#00288e] rounded ring-none border-[#c4c5d5]"
              />
              <div>
                <p className="font-bold text-[#191c1d] dark:text-white mt-0.5">Critical System Alerts SMS</p>
                <p className="text-[10px] text-[#757684]">Send push signals during abnormal volume spikes directly to phone.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Card 4: Hardware and Data Reset */}
        <div className="bg-white dark:bg-[#201c2a] border border-[#e5e7eb] dark:border-[#2e3132] rounded-lg p-5 space-y-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 mb-2 text-[#ba1a1a] border-b border-[#e5e7eb] dark:border-[#2e3132] pb-3">
            <Trash2 className="w-5 h-5 text-[#ba1a1a]" />
            <h4 className="font-bold text-sm tracking-tight uppercase text-[#ba1a1a]">State Maintenance</h4>
          </div>

          <div className="space-y-4">
            <p className="text-[11px] text-[#444653] dark:text-[#c4c5d5] leading-relaxed font-medium">
              If elements fail to load properly, or if you want to wipe custom transactions and trader portfolio holdings back to pristine initial system settings, trigger the reset.
            </p>

            <button
              onClick={triggerReset}
              id="settings-reset-data-btn"
              className="px-4 py-2 bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white border border-[#ba1a1a]/20 rounded font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <RefreshCcw className="w-4 h-4" /> Reset Application Data
            </button>

            {resetMessage && (
              <p className="p-2.5 rounded bg-[#92f5a4]/10 border border-[#006d30]/20 text-[#006d30] font-bold text-center animate-fade-in text-[11px]">
                Application data and transaction states cleared successfully! Reloading...
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
