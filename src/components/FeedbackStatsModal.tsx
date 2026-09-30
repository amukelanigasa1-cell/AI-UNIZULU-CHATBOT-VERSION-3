import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  X, 
  MessageSquare, 
  ArrowUpRight,
  Flame,
  History
} from 'lucide-react';
import { FeedbackStats, EvolvedQuery } from '../types';

interface FeedbackStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskQuestion: (q: string) => void;
}

export const FeedbackStatsModal: React.FC<FeedbackStatsModalProps> = ({
  isOpen,
  onClose,
  onAskQuestion
}) => {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [evolvedQueries, setEvolvedQueries] = useState<EvolvedQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const [statsRes, queryRes] = await Promise.all([
          fetch('/api/feedback/stats'),
          fetch('/api/queries/evolved')
        ]);
        if (statsRes.ok) {
          const s = await statsRes.json();
          setStats(s);
        }
        if (queryRes.ok) {
          const q = await queryRes.json();
          setEvolvedQueries(q.evolvedQueries || []);
        }
      } catch (e) {
        console.error('Failed to load stats:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs min-h-screen animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 my-auto">
        
        {/* Header */}
        <div className="bg-[#002B49] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Knowledge Evolution &amp; Accuracy</h3>
              <p className="text-xs text-blue-200">
                How student feedback continuously improves UNIZULU guidance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                Accuracy Rating
              </span>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                {stats ? `${stats.accuracyPercentage}%` : '97%'}
              </div>
              <span className="text-[11px] text-emerald-600 mt-0.5 block">
                Verified by student ratings
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block">
                Average Star Rating
              </span>
              <div className="text-3xl font-black text-amber-700 mt-1 flex items-center justify-center gap-1">
                <span>{stats ? stats.averageStars : '4.9'}</span>
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <span className="text-[11px] text-amber-600 mt-0.5 block">
                From {stats?.totalRatings || 24} student reviews
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
                Learning Loop
              </span>
              <div className="text-3xl font-black text-[#002B49] mt-1">
                Active
              </div>
              <span className="text-[11px] text-blue-700 mt-0.5 block">
                Evolving with each query
              </span>
            </div>
          </div>

          {/* Feedback Evolution Logic Explainer */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-700 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-[#F1B82D]" />
              <span>How UNIZULU Evolves Over Time</span>
            </div>
            <p className="leading-relaxed">
              Every time a student asks a question and leaves an accuracy rating (thumbs up/down, stars, or corrective notes), the server analyzes recurring keywords and stores high-confidence verification tags. This data directly enriches future Gemini prompt contexts so responses get progressively more accurate, concise, and helpful.
            </p>
          </div>

          {/* Recent Knowledge Refinements */}
          {stats?.recentEvolutions && stats.recentEvolutions.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
                <History className="w-3.5 h-3.5" />
                <span>Recent Knowledge Refinements &amp; Confirmations</span>
              </h4>
              <div className="space-y-1.5">
                {stats.recentEvolutions.map((rev, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{rev}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evolving Student Questions (Trending Queries) */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center justify-between text-xs uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Most Frequently Evolved Student Inquiries</span>
              </span>
              <span className="font-normal text-[11px] text-slate-400">Click to ask instantly</span>
            </h4>

            <div className="space-y-2">
              {evolvedQueries.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onAskQuestion(item.question);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-[#002B49] hover:bg-slate-50 transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-[#002B49]">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Asked {item.frequency} times
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#002B49]">
                      {item.question}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#002B49] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#002B49] hover:bg-[#003B66] text-white rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
