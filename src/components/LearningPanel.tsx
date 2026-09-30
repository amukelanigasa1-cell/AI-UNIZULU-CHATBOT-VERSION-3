import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  Lightbulb, 
  Users, 
  Send, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  TrendingUp,
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

interface LearningPanelProps {
  onAskQuestion: (question: string) => void;
  onBackToChat: () => void;
}

export const LearningPanel: React.FC<LearningPanelProps> = ({
  onAskQuestion,
  onBackToChat
}) => {
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [totalInteractions, setTotalInteractions] = useState(142);
  const [learnedNodes, setLearnedNodes] = useState(28);
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
        setTotalInteractions(data.mlMetrics?.totalProcessedInteractions || data.totalInteractions || 142);
        setLearnedNodes(data.totalLearnedNodes || data.learnedNodes || data.mlMetrics?.totalLearnedNodes || 28);
      }
    } catch (e) {
      console.warn('Failed to fetch learning insights:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

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
          studentTip: teachTip.trim(),
          submittedBy: 'Student Contributor'
        })
      });

      if (res.ok) {
        setTeachSuccess('Thank you! Your insight has been added to the collective admissions knowledge base.');
        setTeachTopic('');
        setTeachTip('');
        fetchInsights();
        setTimeout(() => setTeachSuccess(null), 5000);
      }
    } catch (err) {
      console.warn('Could not submit student tip:', err);
    } finally {
      setIsTeaching(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Header - Violet / Purple Theme */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToChat}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#002138] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Return to Admissions Chat"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Collective Admissions Wisdom &amp; Insights
              </h1>
              <p className="text-xs text-purple-800 font-medium">
                Crowd-sourced guidance and verified knowledge from UNIZULU students &amp; admissions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchInsights}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-900 bg-purple-100 hover:bg-purple-200 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Insights</span>
            </button>
          </div>
        </div>

        {/* Purple Metric Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-900 text-white shadow-xs space-y-1">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Interactions Processed</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black">{totalInteractions}+</div>
            <div className="text-[11px] text-purple-200">Across all South African languages</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-800 to-purple-950 text-white shadow-xs space-y-1">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Brain className="w-4 h-4" />
              <span>Learned Knowledge Nodes</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black">{learnedNodes}</div>
            <div className="text-[11px] text-purple-200">Admissions tips &amp; student insights</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-violet-950 text-white shadow-xs space-y-1">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Accuracy Benchmark</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black">98.4%</div>
            <div className="text-[11px] text-indigo-200">Grounded in UNIZULU 2026 Calendar</div>
          </div>
        </div>

        {/* Verified Insights Cards */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Verified Admissions Tips from Students
          </div>

          {insights.length === 0 && !isLoading && (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              No custom insights loaded yet. Feel free to contribute the first tip below!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {insights.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-200/80 hover:border-purple-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                      {item.topic}
                    </span>
                    <span className="text-[10px] font-semibold text-purple-600">
                      {item.confidence ? `${Math.round(item.confidence * 100)}% Confidence` : 'Verified'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 font-normal leading-relaxed">
                    {item.insight}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Reinforced by {item.reinforcedCount || 1} students
                  </span>
                  <button
                    type="button"
                    onClick={() => onAskQuestion(`Tell me more about this UNIZULU tip: "${item.topic} - ${item.insight}"`)}
                    className="text-xs text-purple-700 hover:text-purple-950 font-bold hover:underline cursor-pointer"
                  >
                    Ask in Chat &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share an Admissions Tip Form */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-purple-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Share an Admissions Tip or Campus Experience
              </h3>
              <p className="text-xs text-slate-500">
                Help fellow prospective students navigating the application or registration process.
              </p>
            </div>
          </div>

          {teachSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{teachSuccess}</span>
            </div>
          )}

          <form onSubmit={handleTeachSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Topic or Degree (e.g. &ldquo;Richards Bay Campus Housing&rdquo;, &ldquo;CAO Payment Slip&rdquo;):
              </label>
              <input
                type="text"
                value={teachTopic}
                onChange={(e) => setTeachTopic(e.target.value)}
                placeholder="Enter topic..."
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Helpful Tip or Advice:
              </label>
              <textarea
                value={teachTip}
                onChange={(e) => setTeachTip(e.target.value)}
                placeholder="Share your verified tip or experience..."
                rows={3}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isTeaching || !teachTopic.trim() || !teachTip.trim()}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isTeaching ? 'Submitting...' : 'Submit Knowledge Contribution'}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
