/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Menu, Search, Bell, Settings, HelpCircle, User, Check, Trash2, ShieldCheck, TrendingUp } from 'lucide-react';
import { AppNotification } from '../types';

interface HeaderProps {
  onMenuToggle: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onNotificationRead: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigateToTab: (tab: 'settings' | 'support' | 'market') => void;
  userEmail: string;
  isPro: boolean;
}

export default function Header({ 
  onMenuToggle, 
  notifications, 
  onMarkAllAsRead, 
  onClearNotifications, 
  onNotificationRead,
  searchQuery,
  setSearchQuery,
  onNavigateToTab,
  userEmail,
  isPro
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-8 h-18 shrink-0 bg-white dark:bg-[#191520] border-b border-[#e5e7eb] dark:border-[#2e3132] sticky top-0 z-20">
      
      {/* Search Bar / Menu button left */}
      <div className="flex items-center gap-4 lg:gap-8 flex-1">
        <button 
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-[#e7e8e9] dark:hover:bg-[#2e3132] text-[#191c1d] dark:text-[#f3f4f5] transition-all"
          aria-label="Open Menu"
          id="mobile-hamburger-btn"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="md:hidden font-sans text-lg font-bold text-[#00288e] dark:text-[#b8c4ff] tracking-tight">
          DANGATA FX
        </h2>

        {/* Global Search bar */}
        <div className="hidden md:flex items-center bg-[#f3f4f5] dark:bg-[#2e3132] px-4 py-2 rounded-full border border-[#c4c5d5] dark:border-[#444653] w-80 relative group focus-within:ring-2 focus-within:ring-[#00288e]/20 focus-within:border-[#00288e] transition-all">
          <Search className="w-5 h-5 text-[#757684]" />
          <input 
            type="text" 
            placeholder="Search markets or assets... (try 'EUR' or 'BTC')" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Auto route to markets if searching on another view, if useful
            }}
            className="bg-transparent border-none focus:outline-none text-sm text-[#191c1d] dark:text-white w-full ml-2 placeholder-[#757684]"
            id="global-search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[#757684] hover:text-[#191c1d] text-xs px-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Side Icons & Avatar */}
      <div className="flex items-center gap-3 sm:gap-4 relative">
        
        {/* Help icon */}
        <button
          onClick={() => onNavigateToTab('support')}
          className="p-2 rounded-full text-[#757684] hover:text-[#00288e] dark:hover:text-[#b8c4ff] hover:bg-[#f3f4f5] dark:hover:bg-[#201d2a] transition-all"
          title="Support Center"
          id="support-nav-icon"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Settings icon */}
        <button
          onClick={() => onNavigateToTab('settings')}
          className="p-2 rounded-full text-[#757684] hover:text-[#00288e] dark:hover:text-[#b8c4ff] hover:bg-[#f3f4f5] dark:hover:bg-[#201d2a] transition-all"
          title="Account Settings"
          id="settings-nav-icon"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Notification Bell toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className={`p-2 rounded-full text-[#757684] hover:text-[#00288e] dark:hover:text-[#b8c4ff] hover:bg-[#f3f4f5] dark:hover:bg-[#201d2a] transition-all relative ${
              showNotifications ? 'bg-[#f3f4f5] text-[#00288e]' : ''
            }`}
            title="Notifications"
            id="notification-bell-btn"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ba1a1a] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div 
              className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-[#201c2a] rounded-xl border border-[#e5e7eb] dark:border-[#2e3132] shadow-xl z-50 overflow-hidden animate-fade-in"
              id="notifications-panel"
            >
              <div className="p-4 border-b border-[#e5e7eb] dark:border-[#2e3132] flex justify-between items-center bg-[#f8f9fa] dark:bg-[#191520]">
                <h4 className="font-bold text-sm text-[#191c1d] dark:text-white">System Alerts</h4>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button 
                      onClick={onMarkAllAsRead}
                      className="text-xs text-[#00288e] dark:text-[#b8c4ff] hover:underline font-semibold flex items-center gap-0.5"
                    >
                      <Check className="w-3 h-3" /> Mark Read
                    </button>
                  )}
                  <button 
                    onClick={onClearNotifications}
                    className="text-xs text-[#ba1a1a] hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#e5e7eb] dark:divide-[#2e3132]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-[#757684] text-xs">
                    No active notifications.
                  </div>
                ) : (
                  notifications.map((not) => (
                    <div 
                      key={not.id} 
                      onClick={() => onNotificationRead(not.id)}
                      className={`p-4 hover:bg-[#f8f9fa] dark:hover:bg-[#282435] transition-colors cursor-pointer ${
                        !not.read ? 'bg-[#b8c4ff]/10 dark:bg-[#dde1ff]/5 font-medium' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          not.type === 'success' ? 'text-[#006d30]' : not.type === 'warning' ? 'text-[#ba1a1a]' : 'text-[#00288e]'
                        }`}>
                          {not.title}
                        </span>
                        <span className="text-[10px] text-[#757684]">{not.time}</span>
                      </div>
                      <p className="text-xs text-[#444653] dark:text-[#c4c5d5] mt-1 leading-relaxed">
                        {not.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar block */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="w-10 h-10 rounded-full bg-[#e1e3e4] border border-[#c4c5d5] dark:border-[#444653] overflow-hidden cursor-pointer active:opacity-85 transition-opacity flex items-center justify-center shadow-inner"
            title="Your Profile"
            id="profile-avatar-btn"
          >
            <img 
              className="w-full h-full object-cover" 
              alt="User profile portrait" 
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsRTPYOBDb-Gql84q4VyVRSuDSQQLO-dDKpBhbTdf-u1oTs1RYiZWueb_ayJPMbSk-ZtyNRY0SewyB26A1q_cVovq2-A8VCcgjrPa7mqN5ezh3s_2eG5NhnpBt3RV5YO1khTKlTZ8G0s5rVyXHoO_8pJmDgnErlUeufniofw0NO_y68BAITMEFGrG0J0mgNHWgkX5E8pM5kYApA1VoPqLtUnU8YAHNoOi-ITRYE6kEy3viFpCo8Wq1_Knly3iTXcBWumfw5Oi2xA6O"
            />
          </button>

          {/* Profile Popover Panel */}
          {showProfile && (
            <div 
              className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#201c2a] rounded-xl border border-[#e5e7eb] dark:border-[#2e3132] shadow-xl z-50 overflow-hidden animate-fade-in"
              id="profile-panel"
            >
              <div className="p-4 bg-[#f8f9fa] dark:bg-[#191520] border-b border-[#e5e7eb] dark:border-[#2e3132] text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border border-[#c4c5d5] dark:border-[#444653] mb-2 shadow-sm">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Corporate analyst profile portrait" 
                    referrerPolicy="no-referrer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsRTPYOBDb-Gql84q4VyVRSuDSQQLO-dDKpBhbTdf-u1oTs1RYiZWueb_ayJPMbSk-ZtyNRY0SewyB26A1q_cVovq2-A8VCcgjrPa7mqN5ezh3s_2eG5NhnpBt3RV5YO1khTKlTZ8G0s5rVyXHoO_8pJmDgnErlUeufniofw0NO_y68BAITMEFGrG0J0mgNHWgkX5E8pM5kYApA1VoPqLtUnU8YAHNoOi-ITRYE6kEy3viFpCo8Wq1_Knly3iTXcBWumfw5Oi2xA6O"
                  />
                </div>
                <h5 className="font-bold text-sm text-[#191c1d] dark:text-white">Adam Dangata</h5>
                <p className="text-[11px] text-[#444653] dark:text-[#c4c5d5] truncate mt-0.5">{userEmail}</p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1e40af]/10 text-[#00288e] dark:bg-[#dde1ff]/20 dark:text-[#dde1ff]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isPro ? 'Pro Analyst Account' : 'Standard Member'}
                </div>
              </div>

              <div className="p-2 space-y-1">
                <button 
                  onClick={() => { setShowProfile(false); onNavigateToTab('market'); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#444653] dark:text-[#c4c5d5] hover:bg-[#f3f4f5] dark:hover:bg-[#2c2837] flex items-center gap-2 transition-all"
                >
                  <TrendingUp className="w-4 h-4 text-[#757684]" /> Invest / Trade Markets
                </button>
                <button 
                  onClick={() => { setShowProfile(false); onNavigateToTab('settings'); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#444653] dark:text-[#c4c5d5] hover:bg-[#f3f4f5] dark:hover:bg-[#2c2837] flex items-center gap-2 transition-all"
                >
                  <User className="w-4 h-4 text-[#757684]" /> Configure Account details
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
