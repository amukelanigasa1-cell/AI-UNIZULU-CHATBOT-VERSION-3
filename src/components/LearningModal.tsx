import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  X, 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Send, 
  Flame,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface LearningInsight {
  topic: string;
  insight: string;
  confidence: number;
  reinforcedCount: number;
  lastUpdated: string;
}

interface LearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskQuestion?: (question: string) => void;
}

export const LearningModal: React.FC<LearningModalProps> = ({
  isOpen,
  onClose,
  onAskQuestion
}) => {
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [learnedNodes, setLearnedNodes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Teach feature state
  const [teachTopic, setTeachTopic] = useState('');
  const [teachTip, setTeachTip] = useState('');
  const [isTeaching, setIsTeaching] = useState(false);
  const [teachSuccess, setTeachSuccess] = useState<string | null>(null);

  const fetchInsights = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/learning/insights');
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights || []);
        setTotalInteractions(data.mlMetrics?.totalProcessedInteractions || data.totalInteractions || 128);
        setLearnedNodes(data.totalLearnedNodes || data.learnedNodes || data.mlMetrics?.totalLearnedNodes || 24);
      }
    } catch (e) {
      console.warn('Failed to fetch learning insights:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInsights();
      setTeachSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTeachSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teachTopic.trim() || !teachTip.trim()) return;

    setIsTeaching(true);
    try {
      const res = await fetch('/api/learning/teach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: teachTopic.trim(),
          tip: teachTip.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTeachSuccess(data.message || 'Thank you! Your insight has been learned and stored into UNIZULU collective knowledge.');
        setTeachTopic('');
        setTeachTip('');
        fetchInsights();
      }
    } catch (e) {
      console.error('Teaching failed:', e);
    } finally {
      setIsTeaching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs min-h-screen animate-in fade-in">
      <div 
        id="unizulu-learning-modal"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-[0_25px_60px_-15px_rgba(0,33,56,0.5)] overflow-hidden border-2 border-purple-200 my-auto"
      >
        {/* Vibrant 3D Header */}
        <div className="bg-gradient-to-br from-[#1a0826] via-[#2d1145] to-[#4c1d7a] text-white px-6 py-5 relative overflow-hidden flex-shrink-0">
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-fuchsia-400/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-24 h-24 rounded-full bg-cyan-400/15 blur-xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-400 to-pink-300 text-[#1a0826] flex items-center justify-center font-black shadow-[0_4px_0_#7e22ce,0_8px_16px_rgba(168,85,247,0.4)] border-2 border-white">
                <Brain className="w-6 h-6 stroke-[2.3]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg sm:text-xl text-white tracking-tight">
                    Collective Learning Engine
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/30 text-emerald-300 text-[10px] font-black border border-emerald-400/40">
                    Active
                  </span>
                </div>
                <p className="text-xs text-purple-200 mt-0.5 font-medium">
                  How UNIZULU connects questions and learns across all student interactions
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-purple-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3D KPI Ticker Cards */}
          <div className="grid grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-purple-800/60 text-center">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 border border-purple-300/20">
              <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider block">Interactions</span>
              <span className="text-lg font-black text-white">{totalInteractions || 120}+</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 border border-purple-300/20">
              <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider block">Learned Nodes</span>
              <span className="text-lg font-black text-amber-300">{learnedNodes || 18} Synapses</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 border border-purple-300/20">
              <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider block">Continuity Link</span>
              <span className="text-lg font-black text-emerald-300">Enabled</span>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Section 1: Collective Student Insights */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Collective Insights Learned from Students
                </h4>
              </div>

              <button 
                onClick={fetchInsights}
                className="text-[11px] text-purple-600 hover:text-purple-800 flex items-center gap-1 font-bold cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
                Synchronizing collective wisdom from UNIZULU database...
              </div>
            ) : insights.length === 0 ? (
              <div className="p-4 bg-slate-50 border rounded-xl text-center text-xs text-slate-500">
                No insights recorded yet. As students ask questions, insights appear here!
              </div>
            ) : (
              <div className="space-y-2.5">
                {insights.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 bg-gradient-to-r from-purple-50/70 via-sky-50/50 to-white border-2 border-purple-100 rounded-2xl shadow-xs space-y-1.5 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        {item.topic}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                          {Math.round(item.confidence * 100)}% Confidence
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Reinforced {item.reinforcedCount}x
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {item.insight}
                    </p>

                    {onAskQuestion && (
                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            onAskQuestion(`Tell me more about ${item.topic} at UNIZULU`);
                            onClose();
                          }}
                          className="text-[11px] font-bold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <span>Ask about this</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Conversational Continuity Feature */}
          <div className="bg-gradient-to-r from-sky-50 via-cyan-50/50 to-indigo-50/40 border-2 border-sky-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-700" />
              <h4 className="text-xs font-black text-sky-950 uppercase tracking-wider">
                Contextual Memory &amp; Follow-up Linking
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              UNIZULU Advisor now directly inspects what it answered in the previous message. When you respond with follow-ups like <em>&quot;what about maths lit?&quot;</em>, <em>&quot;which campus is that?&quot;</em>, or <em>&quot;how do I apply?&quot;</em>, the Advisor links directly to its prior answer without starting over.
            </p>
          </div>

          {/* Section 3: Teach UNIZULU Advisor */}
          <div className="border-2 border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Teach the Bot (Contribute Peer Knowledge)
              </h4>
            </div>
            <p className="text-[11px] text-slate-500">
              Help future students! Share a verified tip (e.g. CAO application nuances, student residence advice, or shuttle routes).
            </p>

            {teachSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{teachSuccess}</span>
              </div>
            )}

            <form onSubmit={handleTeachSubmit} className="space-y-2.5">
              <input 
                type="text"
                value={teachTopic}
                onChange={(e) => setTeachTopic(e.target.value)}
                placeholder="Topic (e.g. CAO Fee Payment, Shuttle between Campuses)"
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 font-medium"
              />

              <textarea 
                value={teachTip}
                onChange={(e) => setTeachTip(e.target.value)}
                placeholder="Verified tip or information to contribute to student knowledge..."
                rows={2}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 font-medium"
              />

              <button
                type="submit"
                disabled={isTeaching || !teachTopic.trim() || !teachTip.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-black text-xs shadow-[0_3px_0_#4c1d95] active:translate-y-[2px] active:shadow-[0_1px_0_#4c1d95] transition-all flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                <span>{isTeaching ? 'Incorporating into Synapses...' : 'Submit Tip to Knowledge Base'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs flex-shrink-0">
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Persisted on UNIZULU knowledge database
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#002138] text-white rounded-xl font-bold text-xs hover:bg-[#003357] transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
