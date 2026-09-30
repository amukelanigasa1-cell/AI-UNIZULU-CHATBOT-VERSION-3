import React, { useState, useMemo, useEffect } from 'react';
import { Languages, X, Check, Sparkles, Search, Globe2 } from 'lucide-react';
import { SA_LANGUAGES, SouthAfricanLanguage, getLanguageByCode } from '../data/languages';

interface LanguageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (langCode: string) => void;
  detectedLanguageCode?: string;
  detectedLanguageName?: string;
}

export const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage,
  detectedLanguageCode,
  detectedLanguageName
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredLanguages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return SA_LANGUAGES;
    return SA_LANGUAGES.filter(
      l =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const currentLang = getLanguageByCode(selectedLanguage);
  const detectedMeta = detectedLanguageName || (detectedLanguageCode ? getLanguageByCode(detectedLanguageCode).name : undefined);

  const handlePick = (code: string) => {
    onSelectLanguage(code);
    onClose();
  };

  return (
    <div
      id="language-select-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
    >
      <div
        id="language-select-modal-container"
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-[#002138] text-white p-4 sm:p-5 flex items-center justify-between border-b border-sky-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shadow-inner">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="language-modal-title" className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Select Language</span>
                <span className="text-xs font-normal text-sky-300">/ Khetha Ulimi</span>
              </h2>
              <p className="text-xs text-slate-300">
                All 11 South African official languages + Auto-detect
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-language-modal"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close language selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status & Search bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-slate-500 font-medium">
              Current Active Language:
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 font-bold border border-sky-200 text-xs">
              <span>{currentLang.flagOrIcon}</span>
              <span>{selectedLanguage === 'auto' ? `Auto (${detectedMeta || 'English'})` : currentLang.name}</span>
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-language-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by language name (e.g. Zulu, English, Afrikaans, Sesotho)..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all text-slate-900 placeholder:text-slate-400"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold px-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-2 flex-1 custom-scrollbar">
          {filteredLanguages.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No language found matching "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredLanguages.map((lang) => {
                const isSelected = selectedLanguage === lang.code;

                return (
                  <button
                    key={lang.code}
                    type="button"
                    id={`btn-select-lang-${lang.code}`}
                    onClick={() => handlePick(lang.code)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98] ${
                      isSelected
                        ? 'bg-[#002138] border-sky-600 text-white shadow-md ring-2 ring-sky-400/40'
                        : 'bg-white hover:bg-sky-50/70 border-slate-200 text-slate-800 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border ${
                          isSelected
                            ? 'bg-sky-500/20 border-sky-400/30'
                            : 'bg-slate-100 border-slate-200 group-hover:bg-white'
                        }`}
                      >
                        {lang.flagOrIcon}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {lang.name}
                          </span>
                          {lang.code === 'auto' && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-amber-950 font-bold uppercase tracking-wider">
                              Smart
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] truncate ${isSelected ? 'text-sky-200' : 'text-slate-500'}`}>
                          {lang.nativeName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center pl-2 flex-shrink-0">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-sky-400 text-[#002138] flex items-center justify-center font-bold shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-300 group-hover:border-sky-400 flex items-center justify-center transition-colors">
                          <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-sky-400 transition-colors" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
          <span>
            {selectedLanguage === 'auto'
              ? 'The advisor detects your language automatically when you type.'
              : `The advisor will respond 100% in ${currentLang.name} without mixing languages.`}
          </span>
        </div>
      </div>
    </div>
  );
};
