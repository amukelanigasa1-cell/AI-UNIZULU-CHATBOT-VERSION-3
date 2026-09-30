import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { ApsCalculatorPanel } from './components/ApsCalculatorPanel';
import { DocumentChecklistPanel } from './components/DocumentChecklistPanel';
import { FacultyExplorerPanel } from './components/FacultyExplorerPanel';
import { LearningPanel } from './components/LearningPanel';
import { FeedbackStatsModal } from './components/FeedbackStatsModal';
import { WelcomeCoverPage } from './components/WelcomeCoverPage';
import { ChatMessage, UserProfile, FeedbackPayload } from './types';
import { detectSouthAfricanLanguage, getLanguageByCode } from './data/languages';
import { LanguageSelectModal } from './components/LanguageSelectModal';
import { 
  saveChatMessageToFirestore, 
  saveFeedbackToFirestore
} from './lib/firebase';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  sender: 'assistant',
  text: `Hello and welcome! 👋🎓✨ I am your UNIZULU Academic & Admissions Advisor, proudly designed and developed by the **UNIZULU IT Team** (University of Zululand Information Technology & Systems Division)! 💻💙

I'm here to give you friendly, step-by-step guidance on undergraduate admissions, calculating your matric APS score (excluding Life Orientation), CAO codes, certified documents, and vibrant campus life across KwaDlangezwa and Richards Bay! 🏛️📚

Feel free to ask in English, isiZulu, Afrikaans, or any official language. What qualification or faculty would you like to explore today?`,
  timestamp: new Date().toISOString(),
  detectedLanguage: 'en',
  detectedLanguageName: 'English'
};

const DEFAULT_STUDENT_PROFILE: UserProfile = {
  id: 'student_session',
  name: 'Prospective Student',
  email: 'student@unizulu.ac.za',
  username: 'student',
  documentsChecklist: {
    certifiedId: false,
    matricResults: false,
    caoProofOfPayment: false,
    proofOfAddress: false,
    academicTranscript: false
  },
  createdAt: new Date().toISOString()
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('unizulu_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not restore chat history:', e);
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('unizulu_student_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.warn('Could not restore profile:', e);
    }
    return DEFAULT_STUDENT_PROFILE;
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('unizulu_chat_language');
      if (saved) return saved;
      return 'auto';
    } catch (e) {
      return 'auto';
    }
  });

  const [detectedLanguageCode, setDetectedLanguageCode] = useState<string>(() => {
    try {
      return localStorage.getItem('unizulu_detected_lang_code') || 'en';
    } catch {
      return 'en';
    }
  });

  const [detectedLanguageName, setDetectedLanguageName] = useState<string>(() => {
    try {
      return localStorage.getItem('unizulu_detected_lang_name') || 'English';
    } catch {
      return 'English';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('unizulu_detected_lang_code', detectedLanguageCode);
      localStorage.setItem('unizulu_detected_lang_name', detectedLanguageName);
    } catch (e) {
      console.warn('Could not persist detected language:', e);
    }
  }, [detectedLanguageCode, detectedLanguageName]);

  const [isLoading, setIsLoading] = useState(false);

  // Left Navigation Panel Active Tab & Collapsible State
  const [activeTab, setActiveTab] = useState<ActiveTab>('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Modals state
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Stored conversation / memory banner state
  const [historyBannerNotice, setHistoryBannerNotice] = useState<string | null>(null);

  // Auto-sync stored conversation from UNIZULU data on initial load if profile exists
  useEffect(() => {
    const identifier = userProfile?.username || userProfile?.email;
    if (!identifier) return;

    const fetchStoredHistory = async () => {
      try {
        const res = await fetch(`/api/conversations/${encodeURIComponent(identifier)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.conversation && Array.isArray(data.conversation) && data.conversation.length > 0) {
            setMessages(prev => {
              if (prev.length <= 1) {
                return data.conversation;
              }
              return prev;
            });
          }
        }
      } catch (err) {
        console.warn('Could not sync initial conversation from server data:', err);
      }
    };

    fetchStoredHistory();
  }, [userProfile?.username, userProfile?.email]);

  // Persist chat messages
  useEffect(() => {
    try {
      localStorage.setItem('unizulu_chat_messages', JSON.stringify(messages.slice(-20)));
    } catch (e) {
      console.warn('Could not persist messages:', e);
    }
  }, [messages]);

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem('unizulu_student_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.warn('Could not persist profile:', e);
    }
  }, [userProfile]);

  // Persist selected language
  useEffect(() => {
    try {
      localStorage.setItem('unizulu_chat_language', selectedLanguage);
    } catch (e) {
      console.warn('Could not persist language preference:', e);
    }
  }, [selectedLanguage]);

  // Send message to Gemini / Express API with language support
  const handleSendMessage = async (text: string, language?: string) => {
    const userText = text.trim();
    if (!userText || isLoading) return;

    const clientDetected = detectSouthAfricanLanguage(userText, detectedLanguageCode);
    setDetectedLanguageCode(clientDetected.code);
    setDetectedLanguageName(clientDetected.name);

    const langToUse = language || (selectedLanguage === 'auto' ? clientDetected.code : selectedLanguage);

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString(),
      detectedLanguage: clientDetected.code,
      detectedLanguageName: clientDetected.name
    };

    setMessages(prev => [...prev, userMessage]);
    if (userProfile?.id) {
      saveChatMessageToFirestore(userProfile.id, userMessage);
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-6),
          userProfile: userProfile,
          preferredLanguage: langToUse,
          clientDetectedLanguage: clientDetected.code
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      
      if (data.detectedLanguage && data.detectedLanguageName) {
        setDetectedLanguageCode(data.detectedLanguage);
        setDetectedLanguageName(data.detectedLanguageName);
      }

      if (data.identifiedUser) {
        setUserProfile(prev => ({ ...prev, ...data.identifiedUser }));
        setHistoryBannerNotice(`Retrieved student record for ${data.identifiedUser.name}${data.identifiedUser.apsScore !== undefined ? ` • APS: ${data.identifiedUser.apsScore}` : ''}.`);
      }

      const assistantMessage: ChatMessage = {
        id: data.id || `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toISOString(),
        suggestedActions: [],
        detectedLanguage: data.detectedLanguage,
        detectedLanguageName: data.detectedLanguageName,
        sources: [],
        isSearchGrounded: false,
        searchQueries: []
      };

      setMessages(prev => [...prev, assistantMessage]);
      if (userProfile?.id) {
        saveChatMessageToFirestore(userProfile.id, assistantMessage);
      }
    } catch (err: any) {
      console.error('Chat request failed:', err);
      const isZulu = langToUse === 'zu' || userText.toLowerCase().includes('ngifuna') || userText.toLowerCase().includes('amaphuzu');
      const isAfrikaans = langToUse === 'af' || userText.toLowerCase().includes('vereistes');

      let fallbackText = `Oops! I had a momentary hiccup connecting to the server. 🙈✨

Don't worry, your UNIZULU IT Team advisor is still right here! 💻💙 Feel free to send your message again or ask any question about UNIZULU courses, admissions, and campus life! 🎓🏛️`;

      if (isZulu) {
        fallbackText = `Hawu! Kube nenkingana yesikhashana yokuxhumana neseva. 🙈✨

Ungakhathazeki, umeluleki wakho we-UNIZULU IT Team usekhona lapha! 💻💙 Sicela uphinde uthumele umlayezo wakho noma ubuze ngamakhodi e-CAO kanye neziqu zase-UNIZULU! 🎓🏛️`;
      } else if (isAfrikaans) {
        fallbackText = `Oeps! Daar was 'n tydelike verbindingsprobleem met die bediener. 🙈✨

Moenie bekommerd wees nie, jou UNIZULU IT-span adviseur is steeds hier! 💻💙 Stuur gerus jou boodskap weer of vra enige vraag oor UNIZULU kwalifikasies en studentelewe! 🎓🏛️`;
      }

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toISOString(),
        detectedLanguage: isZulu ? 'zu' : isAfrikaans ? 'af' : 'en',
        detectedLanguageName: isZulu ? 'isiZulu' : isAfrikaans ? 'Afrikaans' : 'English',
        sources: []
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Feedback Submission handler
  const handleFeedbackSubmit = async (feedback: FeedbackPayload) => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback)
      });
      saveFeedbackToFirestore(feedback, userProfile?.id);
    } catch (e) {
      console.warn('Failed to submit feedback:', e);
    }
  };

  // Toggle document checklist directly without requiring sign-in
  const handleToggleDocument = async (docKey: keyof UserProfile['documentsChecklist']) => {
    const updatedChecklist = {
      ...userProfile.documentsChecklist,
      [docKey]: !userProfile.documentsChecklist[docKey]
    };

    const updatedProfile: UserProfile = {
      ...userProfile,
      documentsChecklist: updatedChecklist,
      updatedAt: new Date().toISOString()
    };

    setUserProfile(updatedProfile);

    try {
      await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });
    } catch (e) {
      console.warn('Failed to sync checklist to server:', e);
    }
  };

  // Save calculated APS directly
  const handleSaveAps = async (score: number) => {
    const updated = { ...userProfile, apsScore: score };
    setUserProfile(updated);
    try {
      await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.warn('Failed to save APS to server:', e);
    }
  };

  // Reset chat conversation back to clean initial state
  const handleResetChat = () => {
    const freshWelcome: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      sender: 'assistant',
      text: `Hello and welcome to the University of Zululand Admissions Assistant! 🎓

I'm here to give you friendly, step-by-step guidance on admissions, APS requirements, certified documents, and CAO applications.

Feel free to ask questions in any of South Africa's 11 official languages (such as isiZulu, English, or Afrikaans), and don't worry about spelling mistakes—I predict and understand typos automatically.

What qualification or faculty would you like to explore today?`,
      timestamp: new Date().toISOString()
    };
    setMessages([freshWelcome]);
    try {
      localStorage.removeItem('unizulu_chat_messages');
    } catch (e) {
      console.warn('Could not clear stored messages:', e);
    }
  };

  // Apply APS score question to chat
  const handleApplyScoreToChat = (score: number, details: string) => {
    handleSaveAps(score);
    handleSendMessage(details, selectedLanguage);
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      
      {/* Left Navigation Panel */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onNewChat={handleResetChat}
        userProfile={userProfile}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedLanguage={selectedLanguage}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
        
        {/* Sleek Top Navbar */}
        <Navbar
          userProfile={userProfile}
          activeTab={activeTab}
          isSidebarOpen={isSidebarOpen}
          onResetChat={handleResetChat}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          selectedLanguage={selectedLanguage}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        />

        {/* Active Session Status Bar */}
        <div className="bg-[#001726] text-slate-300 text-xs px-4 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Admissions Advisor Session: <strong className="text-white">University of Zululand (UNIZULU)</strong>
            </span>
          </div>
          <span className="text-[11px] text-sky-300 font-medium">
            2026 Admissions Open
          </span>
        </div>

        {/* Notification Toast */}
        {historyBannerNotice && (
          <div className="max-w-xl mx-auto w-full px-4 pt-2.5 z-20 animate-in fade-in slide-in-from-top-2">
            <div className="bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center justify-between border border-emerald-600">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>{historyBannerNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setHistoryBannerNotice(null)}
                className="p-1 rounded-md hover:bg-emerald-800 text-emerald-200 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Primary View Area */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          
          {/* 0. Welcome & Portal Overview View */}
          {activeTab === 'welcome' && (
            <div className="flex-1 overflow-y-auto">
              <WelcomeCoverPage
                userProfile={userProfile}
                selectedLanguage={selectedLanguage}
                onOpenChat={(initialPrompt) => {
                  setActiveTab('chat');
                  if (initialPrompt) {
                    handleSendMessage(initialPrompt, selectedLanguage);
                  }
                }}
                onOpenAps={() => setActiveTab('aps')}
                onOpenDocs={() => setActiveTab('documents')}
                onOpenFaculties={() => setActiveTab('faculties')}
                onOpenLanguage={() => setIsLanguageModalOpen(true)}
              />
            </div>
          )}

          {/* 1. Admissions Chat View */}
          {activeTab === 'chat' && (
            <>
              <ChatWindow
                messages={messages}
                isLoading={isLoading}
                userProfile={userProfile}
                onSendSuggestedAction={(action) => handleSendMessage(action, selectedLanguage)}
                onFeedbackSubmit={handleFeedbackSubmit}
                onOpenAps={() => setActiveTab('aps')}
                onOpenDocs={() => setActiveTab('documents')}
                onOpenFaculties={() => setActiveTab('faculties')}
                onResetChat={handleResetChat}
                onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
              />

              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                onResetChat={handleResetChat}
                detectedLanguageCode={detectedLanguageCode}
                detectedLanguageName={detectedLanguageName}
                onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
              />
            </>
          )}

          {/* 2. APS Calculator Panel (Amber / Gold Theme) */}
          {activeTab === 'aps' && (
            <ApsCalculatorPanel
              currentScore={userProfile?.apsScore}
              onApplyScoreToChat={(score, details) => {
                handleApplyScoreToChat(score, details);
                setActiveTab('chat');
              }}
              onSaveToProfile={handleSaveAps}
              onBackToChat={() => setActiveTab('chat')}
            />
          )}

          {/* 3. Required Documents Panel (Emerald / Teal Theme) */}
          {activeTab === 'documents' && (
            <DocumentChecklistPanel
              userProfile={userProfile}
              onToggleDocument={handleToggleDocument}
              onAskDocQuestion={(q) => {
                handleSendMessage(q, selectedLanguage);
                setActiveTab('chat');
              }}
              onBackToChat={() => setActiveTab('chat')}
            />
          )}

          {/* 4. Faculties & Degrees Panel (Indigo / Royal Blue Theme) */}
          {activeTab === 'faculties' && (
            <FacultyExplorerPanel
              onSelectProgramQuery={(prog, fac) => {
                handleSendMessage(`What are the detailed admission requirements, minimum APS, and CAO code for ${prog} in the ${fac} at UNIZULU?`, selectedLanguage);
                setActiveTab('chat');
              }}
              onBackToChat={() => setActiveTab('chat')}
            />
          )}

          {/* 5. Campus Knowledge & Learning Insights Panel (Violet / Purple Theme) */}
          {activeTab === 'learning' && (
            <LearningPanel
              onAskQuestion={(q) => {
                handleSendMessage(q, selectedLanguage);
                setActiveTab('chat');
              }}
              onBackToChat={() => setActiveTab('chat')}
            />
          )}
        </main>

        {/* Feedback Statistics Modal */}
        <FeedbackStatsModal
          isOpen={isStatsOpen}
          onClose={() => setIsStatsOpen(false)}
          onAskQuestion={(q) => handleSendMessage(q, selectedLanguage)}
        />

        {/* Dedicated Language Selection Modal (All 11 South African official languages) */}
        <LanguageSelectModal
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={(langCode) => {
            setSelectedLanguage(langCode);
            try {
              localStorage.setItem('unizulu_selected_lang', langCode);
            } catch (e) {
              console.warn('Could not persist language to localStorage:', e);
            }

            if (langCode !== 'auto') {
              const langInfo = getLanguageByCode(langCode);
              setDetectedLanguageCode(langInfo.code);
              setDetectedLanguageName(langInfo.name);
              setHistoryBannerNotice(`Language preference set to ${langInfo.name} (${langInfo.nativeName}) ${langInfo.flagOrIcon}. The advisor will converse 100% in ${langInfo.name}.`);
            } else {
              setHistoryBannerNotice('Language set to Auto-detect. The advisor will match whatever language you type.');
            }
          }}
          detectedLanguageCode={detectedLanguageCode}
          detectedLanguageName={detectedLanguageName}
        />

      </div>
    </div>
  );
}
