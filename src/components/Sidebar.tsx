/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  ReceiptText, 
  BarChart3, 
  Settings as SettingsIcon, 
  HelpCircle,
  X,
  Sparkles
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose, onUpgradeClick }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'market' as ActiveTab, label: 'Market Analysis', icon: TrendingUp },
    { id: 'portfolio' as ActiveTab, label: 'Portfolio', icon: Wallet },
    { id: 'transactions' as ActiveTab, label: 'Transactions', icon: ReceiptText },
    { id: 'reports' as ActiveTab, label: 'Reports', icon: BarChart3 },
  ];

  const bottomItems = [
    { id: 'settings' as ActiveTab, label: 'Settings', icon: SettingsIcon },
    { id: 'support' as ActiveTab, label: 'Support', icon: HelpCircle },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    onClose(); // Auto close on mobile select
  };

  const sidebarContent = (
    <div className="flex flex-col h-full py-6 px-4 border-r border-[#c4c5d5] bg-[#f3f4f5] dark:bg-[#191520] text-[#191c1d] dark:text-[#f3f4f5] w-64 shrink-0 justify-between transition-all">
      <div>
        {/* Brand Logo & Info */}
        <div className="mb-8 px-2 flex justify-between items-center">
          <div>
            <h1 className="font-sans text-2xl font-bold text-[#00288e] dark:text-[#b8c4ff] tracking-tight">
              DANGATA FX
            </h1>
            <p className="text-xs text-[#444653] dark:text-[#c4c5d5] opacity-80 mt-0.5 tracking-wider font-semibold">
              Financial Analytics
            </p>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={onClose} 
            className="md:hidden p-1.5 rounded-md hover:bg-[#e1e3e4] dark:hover:bg-[#444653]"
            aria-label="Close Sidebar"
            id="close-sidebar-btn"
          >
            <X className="w-5 h-5 text-[#444653] dark:text-[#c4c5d5]" />
          </button>
        </div>

        {/* Main Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidemenu-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-left active:scale-[0.98] ${
                  isActive
                    ? 'text-[#00288e] dark:text-[#dde1ff] font-bold bg-[#1e40af]/10 dark:bg-[#1e40af]/30 border-l-2 border-[#00288e]'
                    : 'text-[#444653] dark:text-[#c4c5d5] font-medium hover:bg-[#e7e8e9] dark:hover:bg-[#2e3132]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#00288e]' : 'text-[#757684]'}`} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Upgrader Banner & Utilities */}
      <div className="pt-6 space-y-4">
        {/* Upgrade Pro Widget */}
        <div className="px-3 py-4 bg-[#1e40af]/5 dark:bg-[#1e40af]/20 rounded-xl border border-[#00288e]/10 dark:border-[#b8c4ff]/10">
          <div className="flex items-center gap-1.5 mb-1.5 text-[#00288e] dark:text-[#b8c4ff]">
            <Sparkles className="w-4 h-4" />
            <p className="text-xs font-bold uppercase tracking-wider">Upgrade Pro</p>
          </div>
          <p className="text-[11px] text-[#444653] dark:text-[#c4c5d5] leading-relaxed mb-3">
            Unlock comprehensive models, live charts, and custom indicators.
          </p>
          <button 
            id="sidebar-upgrade-btn"
            onClick={onUpgradeClick}
            className="w-full py-2 bg-[#00288e] hover:bg-[#173bab] text-white rounded text-xs font-bold active:opacity-85 transition-all text-center uppercase tracking-wider"
          >
            Unlock Charts
          </button>
        </div>

        {/* Bottom Nav Links */}
        <div className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidemenu-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-left active:scale-[0.98] ${
                  isActive
                    ? 'text-[#00288e] dark:text-[#dde1ff] font-bold bg-[#1e40af]/10 dark:bg-[#1e40af]/30 border-l-2 border-[#00288e]'
                    : 'text-[#444653] dark:text-[#c4c5d5] font-medium hover:bg-[#e7e8e9] dark:hover:bg-[#2e3132]'
                }`}
              >
                <Icon className="w-5 h-5 text-[#757684]" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Always Visible) */}
      <aside className="hidden md:block h-full w-64 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={onClose} 
            className="fixed inset-0 bg-[#191c1d]/60 backdrop-blur-sm transition-opacity"
            id="sidebar-backdrop"
          />
          {/* Content container */}
          <div className="relative flex flex-col h-full shadow-2xl z-10 animate-fade-in-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
