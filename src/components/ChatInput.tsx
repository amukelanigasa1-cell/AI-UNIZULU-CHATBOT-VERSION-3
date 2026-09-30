import React, { useState, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { getLanguageByCode, detectSouthAfricanLanguage } from '../data/languages';
import { LanguageSelectTab } from './LanguageSelectTab';

interface ChatInputProps {
  onSendMessage: (message: string, language?: string) => void;
  isLoading: boolean;
  selectedLanguage: string;
  onLanguageChange: (langCode: string) => void;
  onResetChat?: () => void;
  detectedLanguageCode?: string;
  detectedLanguageName?: string;
  onOpenLanguageModal?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading,
  selectedLanguage,
  onLanguageChange,
  detectedLanguageCode,
  detectedLanguageName,
  onOpenLanguageModal
}) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Real-time language detection: only tests when user has typed a meaningful word or phrase
  const trimmedInput = inputText.trim();
  const shouldCheckTyping = trimmedInput.length >= 4 && (trimmedInput.includes(' ') || /^(sawubona|sanibonani|dumela|dumelang|molo|molweni|lotjhani|avuxeni|goeiedag|goeiemôre)$/i.test(trimmedInput));
  const detectedFromTyping = shouldCheckTyping ? detectSouthAfricanLanguage(trimmedInput) : null;
  
  const activeDetectedLang = detectedFromTyping 
    || (detectedLanguageCode ? getLanguageByCode(detectedLanguageCode) : null)
    || (detectedLanguageName ? { code: 'auto', name: detectedLanguageName, nativeName: detectedLanguageName, flagOrIcon: '🇿🇦' } : null)
    || getLanguageByCode('en');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim(), selectedLanguage);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div id="unizulu-chat-input-container" className="bg-gradient-to-t from-white via-white/98 to-white/60 pt-2 pb-4 px-3 sm:px-6 sticky bottom-0 z-20 backdrop-blur-md">
      <div className="max-w-3xl mx-auto space-y-2">
        
        {/* Sleek, Horizontally Scrollable Language Selector (No redirect to modal/panel) */}
        <div className="w-full py-0.5">
          <LanguageSelectTab
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            detectedLanguageCode={activeDetectedLang?.code}
            detectedLanguageName={activeDetectedLang?.name}
          />
        </div>

        {/* Clean, Full-Width Message Typing Capsule */}
        <form 
          onSubmit={handleSubmit} 
          className="relative flex items-end gap-2 bg-[#f4f7fb] focus-within:bg-white rounded-[24px] border border-slate-200/90 shadow-sm p-2 sm:p-2.5 focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100/80 transition-all duration-200"
        >
          <textarea
            ref={inputRef}
            id="chat-user-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedLanguage === 'zu'
                ? "Bhala umbuzo wakho lapha (noma buza ukuthi nginjani namhlanje)..."
                : selectedLanguage === 'af'
                ? "Tik jou vraag hier in (of vra gerus hoe dit vandag met my gaan)..."
                : selectedLanguage === 'xh'
                ? "Bhala apha ubuze ngamaphuzu, iziqu, okanye uncokole nam..."
                : "Ask about admissions, degrees, APS, campus life, or just say hi & chat..."
            }
            rows={1}
            disabled={isLoading}
            className="w-full bg-transparent resize-none px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none max-h-32 min-h-[42px]"
          />

          <div className="flex items-center gap-1.5 flex-shrink-0 pb-0.5">
            {/* Lively Circular Send Button */}
            <button
              type="submit"
              id="btn-send-message"
              disabled={!inputText.trim() || isLoading}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-tr from-[#002138] to-blue-700 hover:from-blue-600 hover:to-sky-500 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:pointer-events-none shadow-xs cursor-pointer active:scale-95 group"
              title="Send message (Enter)"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </form>

        {/* Clean, Modern Footnote */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-3 pt-0.5 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-600 font-medium">
              UNIZULU Academic Companion
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-normal">Active Continuous Learning</span>
          </div>
          
          <div className="flex items-center gap-2 text-slate-400 text-[10px] sm:text-[11px]">
            <span>Official: <a href="https://www.unizulu.ac.za" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">unizulu.ac.za</a></span>
            <span>&bull;</span>
            <span>CAO: <span className="font-mono text-slate-700 font-bold">ZU-</span></span>
          </div>
        </div>

      </div>
    </div>
  );
};
