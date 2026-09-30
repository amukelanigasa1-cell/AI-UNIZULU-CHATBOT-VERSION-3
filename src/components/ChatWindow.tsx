import React, { useState, useRef, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  Scale, 
  Calculator, 
  FileCheck2, 
  BookOpen, 
  RotateCcw, 
  Languages, 
  Sparkles, 
  User, 
  Compass,
  GraduationCap
} from 'lucide-react';
import { ChatMessage, FeedbackPayload, UserProfile } from '../types';
import { TypewriterMarkdown } from './TypewriterMarkdown';
import { getLanguageByCode, detectSouthAfricanLanguage } from '../data/languages';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  userProfile?: UserProfile | null;
  onSendSuggestedAction: (actionText: string) => void;
  onFeedbackSubmit: (payload: FeedbackPayload) => void;
  onOpenAps: () => void;
  onOpenDocs: () => void;
  onOpenFaculties: () => void;
  onResetChat?: () => void;
  onOpenLanguageModal?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  userProfile,
  onSendSuggestedAction,
  onFeedbackSubmit,
  onOpenAps,
  onOpenDocs,
  onOpenFaculties,
  onResetChat,
  onOpenLanguageModal
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [ratedMessages, setRatedMessages] = useState<Record<string, 'up' | 'down'>>({});

  // Track latest message ID that was introduced
  const latestAssistantMessageId = [...messages].reverse().find(m => m.sender === 'assistant')?.id;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleThumbClick = (msg: ChatMessage, type: 'up' | 'down') => {
    setRatedMessages(prev => ({ ...prev, [msg.id]: type }));
    onFeedbackSubmit({
      messageId: msg.id,
      query: 'User query',
      responseSnippet: msg.text.substring(0, 150),
      isHelpful: type === 'up',
      rating: type === 'up' ? 5 : 2,
      accuracyTag: type === 'up' ? 'Accurate & clear' : 'Needs clarification'
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 max-w-4xl w-full mx-auto space-y-5">
      
      {/* Top Chat Action Bar (shows Reset Chat when messages exist) */}
      {messages.length > 1 && onResetChat && (
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 text-xs text-slate-500 animate-in fade-in">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-800">UNIZULU Academic Conversation</span>
            {userProfile?.isGuest ? (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                Guest Mode
              </span>
            ) : userProfile?.username ? (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                @{userProfile.username}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onResetChat}
            id="btn-reset-chat-header"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 shadow-2xs transition-all cursor-pointer"
            title="Start a new chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      )}

      {/* Empty State / Greeting Canvas */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center text-center py-6 sm:py-12 space-y-6 sm:space-y-8 animate-in fade-in">
          
          {/* Sparkle Pill + Expressive Greeting */}
          <div className="space-y-4 max-w-xl mx-auto flex flex-col items-center">
            {/* Academic Advisor Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-2.5 h-2.5" />
              </div>
              <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent font-bold">UNIZULU</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">Academic Admissions Advisor</span>
            </div>

            {/* Expressive Gemini-Style Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent block">
                  Hello, Future Scholar
                </span>
                <span className="text-slate-800 text-2xl sm:text-4xl block mt-1 font-semibold">
                  How can I help you today?
                </span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto pt-1 font-normal">
                Explore undergraduate degrees, calculate your matric APS points, get CAO codes, and ask anything about campus life at KwaDlangezwa and Richards Bay.
              </p>
            </div>
          </div>

          {/* Quick Academic Topics Gemini Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl text-left pt-2">
            <button
              onClick={() => onSendSuggestedAction('What are the admission requirements for Law (LLB) at UNIZULU?')}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between space-y-3 cursor-pointer text-left"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center font-bold group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                  <Scale className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  CAL Faculty
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                  Bachelor of Laws (LLB)
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-normal leading-normal">
                  Check minimum 30 APS score and English Level 5 requirements.
                </p>
              </div>
            </button>

            <button
              onClick={() => onSendSuggestedAction('How do I calculate my APS points from my Matric marks?')}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition-all group flex flex-col justify-between space-y-3 cursor-pointer text-left"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center font-bold group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
                  <Calculator className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Interactive Tool
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Calculate APS Score
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-normal leading-normal">
                  Test your Grade 11 or 12 matric marks (excluding Life Orientation).
                </p>
              </div>
            </button>

            <button
              onClick={() => onSendSuggestedAction('What are the subjects and requirements for BSc Computer Science?')}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col justify-between space-y-3 cursor-pointer text-left"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center font-bold group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs">
                  <BookOpen className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                  Science Faculty
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors">
                  BSc Computer Science
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-normal leading-normal">
                  Explore software, maths, and physics admission criteria.
                </p>
              </div>
            </button>

            <button
              onClick={() => onSendSuggestedAction('How do student residences, campus life, and NSFAS work at UNIZULU?')}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-400 hover:shadow-md transition-all group flex flex-col justify-between space-y-3 cursor-pointer text-left"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/80 flex items-center justify-center font-bold group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                  <Compass className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  Campus Life
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-purple-700 transition-colors">
                  Residences &amp; NSFAS
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-normal leading-normal">
                  Learn about accommodation at KwaDlangezwa and funding aid.
                </p>
              </div>
            </button>
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="flex items-center justify-center gap-2 pt-2 flex-wrap text-xs text-slate-500">
            <span className="text-slate-400 font-medium">Quick Open:</span>
            <button
              onClick={onOpenAps}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-600" />
              <span>APS Calculator</span>
            </button>
            <button
              onClick={onOpenDocs}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Documents Checklist</span>
            </button>
            <button
              onClick={onOpenFaculties}
              className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>4 Faculties</span>
            </button>
          </div>

        </div>
      ) : (
        /* Message Stream */
        <div className="space-y-6">
          {messages.map((message) => {
            const isUser = message.sender === 'user';

            if (isUser) {
              return (
                <div key={message.id} className="flex justify-end animate-in fade-in group">
                  <div className="flex items-start gap-3 max-w-[92%] sm:max-w-2xl flex-row-reverse">
                    {/* User Profile Avatar / Initial Badge (Gemini Style) */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs border-2 border-white flex-shrink-0 mt-0.5 overflow-hidden">
                      {userProfile?.photoURL ? (
                        <img src={userProfile.photoURL} alt={userProfile.name} className="w-full h-full object-cover" />
                      ) : userProfile?.name ? (
                        <span>{userProfile.name.charAt(0).toUpperCase()}</span>
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Gemini-Style Chat Bubble */}
                    <div className="bubble-gemini-user px-5 py-3 sm:py-3.5 text-xs sm:text-[14.5px] leading-relaxed font-normal shadow-xs">
                      <p className="whitespace-pre-wrap selection:bg-sky-200 text-slate-800">{message.text}</p>
                      <div className="flex items-center justify-end gap-1.5 mt-1.5 pt-1 border-t border-slate-200/50 text-[10px] text-slate-400 font-medium">
                        <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Assistant Message with Gemini Sparkle Avatar
            const isLatest = message.id === latestAssistantMessageId;

            return (
              <div key={message.id} className="flex items-start gap-3 sm:gap-4 animate-in fade-in">
                {/* Gemini Multi-Color Sparkle Avatar */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                  <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white fill-white/20" />
                </div>

                <div className="flex-1 min-w-0 space-y-3 bg-white bubble-gemini-assistant rounded-2xl sm:rounded-3xl p-4 sm:p-5 hover:border-sky-300 transition-all">
                  {/* Message Content */}
                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                    <TypewriterMarkdown 
                      content={message.text}
                      isLatest={isLatest}
                    />
                  </div>

                  {/* Gemini Action Bar (Copy, Language Badge, Thumbs Up/Down, Timestamp) */}
                  <div className="flex items-center gap-1.5 sm:gap-2 pt-2.5 border-t border-slate-100 text-slate-400 text-xs flex-wrap">
                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(message.text, message.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                      title="Copy response"
                    >
                      {copiedMessageId === message.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Small compact language badge placed right where listen was */}
                    {(() => {
                      const detectedCode = message.detectedLanguage;
                      const detectedName = message.detectedLanguageName;
                      const resolvedLang = (detectedCode && getLanguageByCode(detectedCode)) 
                        || (detectedName ? { code: 'auto', name: detectedName, nativeName: detectedName, flagOrIcon: '🇿🇦' } : null)
                        || detectSouthAfricanLanguage(message.text);
                      
                      const displayName = detectedName || resolvedLang.name || 'English';
                      const displayFlag = resolvedLang.flagOrIcon || '🇿🇦';

                      return onOpenLanguageModal ? (
                        <button
                          type="button"
                          id={`badge-responded-lang-${message.id}`}
                          onClick={onOpenLanguageModal}
                          className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-sky-50 hover:text-sky-900 hover:border-sky-300 border border-transparent px-2 py-0.5 rounded-md transition-all cursor-pointer" 
                          title={`Responded in ${displayName}. Tap to change language.`}
                        >
                          <span className="text-xs">{displayFlag}</span>
                          <span>{displayName}</span>
                        </button>
                      ) : (
                        <span 
                          id={`badge-responded-lang-${message.id}`}
                          className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md cursor-default" 
                          title={`Responded in ${displayName}`}
                        >
                          <span className="text-xs">{displayFlag}</span>
                          <span>{displayName}</span>
                        </span>
                      );
                    })()}

                    <div className="h-3 w-[1px] bg-slate-200"></div>

                    {/* Thumbs Feedback */}
                    <button
                      type="button"
                      onClick={() => handleThumbClick(message, 'up')}
                      className={`p-1.5 rounded-lg hover:bg-sky-50 transition-colors cursor-pointer ${
                        ratedMessages[message.id] === 'up' ? 'text-sky-600 bg-sky-50' : 'text-slate-500 hover:text-sky-700'
                      }`}
                      title="Helpful & accurate"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleThumbClick(message, 'down')}
                      className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer ${
                        ratedMessages[message.id] === 'down' ? 'text-slate-900 bg-slate-100 font-bold' : 'text-slate-500 hover:text-slate-700'
                      }`}
                      title="Needs improvement"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-[10px] text-slate-400 ml-auto font-medium">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}

          {/* Gemini Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 sm:gap-4 animate-in fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs animate-pulse">
                <Sparkles className="w-4 h-4 text-white" />
              </div>

              <div className="bg-white bubble-gemini-assistant rounded-2xl p-4 sm:p-5 max-w-md space-y-2 border border-slate-200/90 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
                  <span className="text-xs font-bold text-slate-800">UNIZULU Advisor is thinking...</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="h-2 bg-slate-200 rounded-full w-48 animate-pulse"></div>
                  <div className="h-2 bg-slate-100 rounded-full w-64 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      )}

    </div>
  );
};
