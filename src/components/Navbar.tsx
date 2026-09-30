import React from 'react';
import { 
  Menu,
  RotateCcw,
  Languages
} from 'lucide-react';
import { UserProfile } from '../types';
import { ActiveTab } from './Sidebar';
import { getLanguageByCode } from '../data/languages';

interface NavbarProps {
  userProfile: UserProfile | null;
  activeTab: ActiveTab;
  isSidebarOpen: boolean;
  onResetChat?: () => void;
  onToggleSidebar: () => void;
  selectedLanguage?: string;
  onOpenLanguageModal?: () => void;
}

const TAB_TITLES: Record<ActiveTab, { title: string; subtitle: string; badge?: string }> = {
  welcome: { title: 'Welcome & Overview', subtitle: 'Official UNIZULU Admissions Portal', badge: 'KwaDlangezwa & Richards Bay' },
  chat: { title: 'Admissions Chat', subtitle: 'Academic Advisor' },
  aps: { title: 'APS Calculator', subtitle: 'NSC Formula (Excl. LO)', badge: 'Gold Theme' },
  documents: { title: 'Required Documents', subtitle: 'SAPS Certified Checklist', badge: 'Emerald Theme' },
  faculties: { title: 'Faculties & Degrees', subtitle: '4 Faculties Explorer', badge: 'Indigo Theme' },
  learning: { title: 'Campus Knowledge & Tips', subtitle: 'Campus Insights', badge: 'Purple Theme' }
};

export const Navbar: React.FC<NavbarProps> = ({
  userProfile: _userProfile,
  activeTab,
  isSidebarOpen,
  onResetChat,
  onToggleSidebar,
  selectedLanguage = 'auto',
  onOpenLanguageModal
}) => {
  const currentTabInfo = TAB_TITLES[activeTab] || TAB_TITLES.chat;
  const activeLang = getLanguageByCode(selectedLanguage);

  return (
    <header id="unizulu-navbar" className="bg-[#001726] text-white border-b border-slate-800 sticky top-0 z-30 shadow-md backdrop-blur-md">
      <div className="px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
          
          {/* Left: Sidebar Open/Close Toggle + Active View Indicator */}
          <div className="flex-1 flex items-center justify-start gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              id="btn-toggle-sidebar"
              onClick={onToggleSidebar}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all cursor-pointer flex-shrink-0 ${
                !isSidebarOpen 
                  ? 'bg-sky-600 text-white shadow-xs hover:bg-sky-500' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
              }`}
              title={isSidebarOpen ? "Close navigation panel" : "Open navigation panel"}
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs font-semibold hidden md:inline">
                {isSidebarOpen ? 'Close Menu' : 'Menu'}
              </span>
            </button>

            <div className="hidden sm:flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm text-white tracking-tight truncate">
                {currentTabInfo.title}
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate">
                {currentTabInfo.subtitle}
              </span>
            </div>
          </div>

          {/* Center: UNIZULU Official Emblem with "University of Zululand" centered directly underneath */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center mx-auto py-1 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 relative flex-shrink-0 flex items-center justify-center p-1 rounded-full bg-white shadow-lg ring-2 ring-[#F1B82D] overflow-hidden transition-transform hover:scale-105">
              <img
                src="/unizulu-emblem.svg"
                alt="University of Zululand Emblem"
                className="w-full h-full object-contain filter drop-shadow-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wide uppercase text-white font-serif leading-tight mt-1">
              University of Zululand
            </span>
          </div>

          {/* Right: Language Selector + Reset Chat */}
          <div className="flex-1 flex items-center justify-end gap-1.5 sm:gap-2.5">
            {/* Language Selector Button */}
            {onOpenLanguageModal && (
              <button
                type="button"
                id="btn-nav-language"
                onClick={onOpenLanguageModal}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-200 hover:text-white bg-sky-950/70 hover:bg-sky-900/90 border border-sky-700/60 shadow-xs transition-colors cursor-pointer"
                title="Select language (All 11 South African official languages)"
              >
                <Languages className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span className="text-xs leading-none">{activeLang.flagOrIcon}</span>
                <span className="hidden sm:inline font-medium">
                  {selectedLanguage === 'auto' ? 'Language' : activeLang.name}
                </span>
              </button>
            )}

            {/* Reset Chat Button */}
            {onResetChat && (
              <button
                type="button"
                id="btn-nav-reset-chat"
                onClick={onResetChat}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
                title="Reset conversation and start fresh"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden lg:inline">Reset</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
