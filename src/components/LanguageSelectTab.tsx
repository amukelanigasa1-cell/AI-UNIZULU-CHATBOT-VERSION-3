import React, { useRef, useEffect } from 'react';
import { Languages, ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { SA_LANGUAGES } from '../data/languages';

interface LanguageSelectTabProps {
  selectedLanguage: string;
  onLanguageChange: (langCode: string) => void;
  detectedLanguageCode?: string;
  detectedLanguageName?: string;
  className?: string;
  dropUp?: boolean;
  onOpenModal?: () => void;
}

export const LanguageSelectTab: React.FC<LanguageSelectTabProps> = ({
  selectedLanguage,
  onLanguageChange,
  detectedLanguageName,
  className = ''
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the selected language into view smoothly
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector<HTMLElement>(`[data-lang="${selectedLanguage}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedLanguage]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -180 : 180;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSelectLanguage = (code: string) => {
    // Directly select language right on the spot - NEVER redirects to any panel or modal
    onLanguageChange(code);
  };

  return (
    <div className={`w-full flex items-center gap-1.5 py-1 ${className}`}>
      {/* Label Indicator */}
      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex-shrink-0 select-none pl-1">
        <Languages className="w-3.5 h-3.5 text-sky-600" />
        <span className="hidden sm:inline">Language:</span>
      </div>

      {/* Left Scroll Button */}
      <button
        type="button"
        onClick={() => scroll('left')}
        className="h-6 w-6 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/90 shadow-2xs flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer active:scale-90"
        title="Scroll languages left"
        aria-label="Scroll languages left"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* Horizontally Scrollable Language Tabs Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex items-center gap-1.5 overflow-x-auto scroll-smooth py-1 px-1 select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {SA_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.code;
          const isAuto = lang.code === 'auto';
          const label = isAuto
            ? (detectedLanguageName ? `Auto (${detectedLanguageName})` : 'Auto-detect')
            : lang.name;

          return (
            <button
              key={lang.code}
              data-lang={lang.code}
              type="button"
              onClick={() => handleSelectLanguage(lang.code)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap active:scale-95 border ${
                isSelected
                  ? 'bg-[#002138] text-white border-[#002138] shadow-xs font-semibold ring-2 ring-sky-400/40'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 hover:border-slate-300 font-medium'
              }`}
              title={`${lang.name} (${lang.nativeName})`}
            >
              {isAuto ? (
                <Sparkles className={`w-3 h-3 ${isSelected ? 'text-amber-300' : 'text-sky-600'}`} />
              ) : (
                <span className="text-xs">{lang.flagOrIcon}</span>
              )}
              <span>{label}</span>
              {isSelected && (
                <Check className="w-3 h-3 text-sky-300 ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right Scroll Button */}
      <button
        type="button"
        onClick={() => scroll('right')}
        className="h-6 w-6 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/90 shadow-2xs flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer active:scale-90"
        title="Scroll languages right"
        aria-label="Scroll languages right"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
