import React from 'react';
import { 
  MessageSquare, 
  Calculator, 
  FileCheck2, 
  BookOpen, 
  Sparkles, 
  Plus, 
  ChevronLeft,
  Languages,
  School
} from 'lucide-react';
import { UserProfile } from '../types';
import { UnizuluLogo } from './UnizuluLogo';
import { getLanguageByCode } from '../data/languages';

export type ActiveTab = 'welcome' | 'chat' | 'aps' | 'documents' | 'faculties' | 'learning';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onNewChat: () => void;
  userProfile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage?: string;
  onOpenLanguageModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onNewChat,
  userProfile,
  isOpen,
  onClose,
  selectedLanguage = 'auto',
  onOpenLanguageModal
}) => {
  const activeLang = getLanguageByCode(selectedLanguage);
  const checkedDocsCount = userProfile
    ? Object.values(userProfile.documentsChecklist).filter(Boolean).length
    : 0;

  const handleTabClick = (tab: ActiveTab) => {
    onSelectTab(tab);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      onClose();
    }
  };

  const navItems = [
    {
      id: 'welcome' as ActiveTab,
      label: 'Welcome & Overview',
      description: 'Campus portal & guides',
      icon: School,
      badge: 'UNIZULU',
      colorClasses: {
        active: 'bg-amber-950/40 text-amber-200 border-l-4 border-[#F1B82D] font-semibold shadow-sm',
        iconBg: 'bg-[#F1B82D]/20 text-[#F1B82D]',
        activeIconBg: 'bg-[#F1B82D] text-[#002138]',
        border: 'border-l-4 border-[#F1B82D]'
      }
    },
    {
      id: 'chat' as ActiveTab,
      label: 'Admissions Chat',
      description: 'Admissions Advisor & Guidance',
      icon: MessageSquare,
      badge: null,
      colorClasses: {
        active: 'bg-slate-800 text-white font-semibold shadow-sm',
        iconBg: 'bg-sky-500/20 text-sky-400',
        activeIconBg: 'bg-sky-500 text-white',
        border: 'border-l-4 border-sky-400'
      }
    },
    {
      id: 'aps' as ActiveTab,
      label: 'APS Calculator',
      description: 'NSC Matric points (Excl. LO)',
      icon: Calculator,
      badge: userProfile?.apsScore ? `${userProfile.apsScore} pts` : null,
      colorClasses: {
        active: 'bg-amber-950/40 text-amber-200 border-l-4 border-amber-400 font-semibold shadow-sm',
        iconBg: 'bg-amber-500/20 text-amber-400',
        activeIconBg: 'bg-amber-500 text-[#002138]',
        badgeBg: 'bg-amber-400 text-amber-950'
      }
    },
    {
      id: 'documents' as ActiveTab,
      label: 'Required Documents',
      description: 'SAPS certified checklist',
      icon: FileCheck2,
      badge: `${checkedDocsCount}/5`,
      colorClasses: {
        active: 'bg-emerald-950/40 text-emerald-200 border-l-4 border-emerald-400 font-semibold shadow-sm',
        iconBg: 'bg-emerald-500/20 text-emerald-400',
        activeIconBg: 'bg-emerald-500 text-white',
        badgeBg: 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40'
      }
    },
    {
      id: 'faculties' as ActiveTab,
      label: 'Faculties & Degrees',
      description: 'CAL, Science, Arts, Edu',
      icon: BookOpen,
      badge: '4 Faculties',
      colorClasses: {
        active: 'bg-indigo-950/40 text-indigo-200 border-l-4 border-indigo-400 font-semibold shadow-sm',
        iconBg: 'bg-indigo-500/20 text-indigo-400',
        activeIconBg: 'bg-indigo-500 text-white',
        badgeBg: 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/40'
      }
    },
    {
      id: 'learning' as ActiveTab,
      label: 'Campus Knowledge & Tips',
      description: 'Campus student wisdom',
      icon: Sparkles,
      badge: 'Insights',
      colorClasses: {
        active: 'bg-purple-950/40 text-purple-200 border-l-4 border-purple-400 font-semibold shadow-sm',
        iconBg: 'bg-purple-500/20 text-purple-400',
        activeIconBg: 'bg-purple-500 text-white',
        badgeBg: 'bg-purple-500/30 text-purple-300 border border-purple-400/40'
      }
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container: Fully collapsible on desktop and mobile */}
      <aside
        id="unizulu-left-navigation-panel"
        className={`fixed md:relative inset-y-0 left-0 z-50 bg-[#001726] text-slate-200 flex flex-col transition-all duration-300 ease-in-out flex-shrink-0 ${
          isOpen
            ? 'w-72 translate-x-0 opacity-100 border-r border-slate-800 shadow-xl md:shadow-none'
            : 'w-0 -translate-x-full opacity-0 pointer-events-none overflow-hidden border-none'
        }`}
      >
        {/* Inner container to keep full 72 width content during transition */}
        <div className="w-72 h-full flex flex-col">
          {/* University Header & Close Button */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UnizuluLogo className="w-8 h-8" showText={false} />
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-white tracking-wide font-serif">
                  UNIZULU ADVISOR
                </span>
                <span className="text-[10px] text-sky-400 font-medium">
                  Academic &amp; Admissions Advisor
                </span>
              </div>
            </div>

            {/* Prominent Close Navigation Panel Button */}
            <button
              type="button"
              id="btn-sidebar-close"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Close navigation panel"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[11px] font-medium hidden sm:inline">Close</span>
            </button>
          </div>

          {/* "+ New Chat" Action Button */}
          <div className="p-3">
            <button
              type="button"
              id="btn-sidebar-new-chat"
              onClick={() => {
                onNewChat();
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 border border-sky-400/40 shadow-sm transition-all hover:shadow-sky-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Conversation</span>
            </button>
          </div>

          {/* Main Navigation Panel List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 custom-scrollbar">
          <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Admissions Tools
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                id={`btn-nav-panel-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`w-full group text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? item.colorClasses.active
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive ? item.colorClasses.activeIconBg : item.colorClasses.iconBg
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold truncate">{item.label}</div>
                    <div className="text-[10px] text-slate-400 truncate font-normal">
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold flex-shrink-0 ml-1.5 ${
                      isActive
                        ? item.colorClasses.badgeBg || 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Academic Info Card */}
          <div className="mt-4 p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] space-y-2">
            <div className="flex items-center justify-between text-slate-400 font-semibold">
              <span>Campuses</span>
              <span className="text-sky-400 font-bold">KZN, South Africa</span>
            </div>
            <div className="text-[10px] text-slate-400 leading-relaxed">
              &bull; <strong>KwaDlangezwa:</strong> Main Campus<br />
              &bull; <strong>Richards Bay:</strong> Science &amp; Business
            </div>
          </div>

          {/* Language Selection Row in Sidebar */}
          {onOpenLanguageModal && (
            <div className="mt-3">
              <button
                type="button"
                id="btn-sidebar-language"
                onClick={() => {
                  onOpenLanguageModal();
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    onClose();
                  }
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 hover:border-sky-500/50 transition-all text-left cursor-pointer group"
                title="Select preferred language"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Languages className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                      <span>Language</span>
                      <span className="text-[10px] text-sky-400 font-normal">({activeLang.flagOrIcon})</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {selectedLanguage === 'auto' ? 'Auto-detect' : activeLang.name}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-sky-400 font-semibold group-hover:underline flex-shrink-0 ml-1">
                  Change
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Admissions Session Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#001320]">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <div className="truncate">
              <div className="text-white font-semibold text-xs truncate">
                Admissions Advisor
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                2026 Academic Year
              </div>
            </div>
          </div>
        </div>
        </div>
      </aside>
    </>
  );
};
