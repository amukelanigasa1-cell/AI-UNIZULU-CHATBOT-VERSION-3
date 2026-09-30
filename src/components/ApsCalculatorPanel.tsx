import React, { useState } from 'react';
import { 
  Calculator, 
  AlertCircle, 
  Sparkles, 
  RotateCcw, 
  ArrowRight,
  CheckCircle2,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

interface ApsCalculatorPanelProps {
  onApplyScoreToChat: (score: number, details: string) => void;
  onSaveToProfile?: (score: number) => void;
  onBackToChat: () => void;
  currentScore?: number;
}

interface SubjectEntry {
  id: string;
  name: string;
  level: number;
}

const DEFAULT_SUBJECTS: SubjectEntry[] = [
  { id: '1', name: 'English (Home or First Additional)', level: 5 },
  { id: '2', name: 'Mathematics / Pure Maths', level: 4 },
  { id: '3', name: 'Physical Sciences / Accounting', level: 4 },
  { id: '4', name: 'Life Sciences / Business Studies', level: 5 },
  { id: '5', name: 'Geography / History / Economics', level: 5 },
  { id: '6', name: 'isiZulu / 2nd Language / Elective', level: 5 },
];

const LEVEL_PERCENTAGES: Record<number, string> = {
  7: '80% - 100% (Outstanding)',
  6: '70% - 79% (Meritorious)',
  5: '60% - 69% (Substantial)',
  4: '50% - 59% (Adequate)',
  3: '40% - 49% (Moderate)',
  2: '30% - 39% (Elementary)',
  1: '0% - 29% (Not Achieved)',
};

export const ApsCalculatorPanel: React.FC<ApsCalculatorPanelProps> = ({
  onApplyScoreToChat,
  onSaveToProfile,
  onBackToChat,
  currentScore
}) => {
  const [subjects, setSubjects] = useState<SubjectEntry[]>(DEFAULT_SUBJECTS);
  const [mathType, setMathType] = useState<'pure' | 'lit'>('pure');

  const totalAps = subjects.reduce((sum, s) => sum + (s.level || 0), 0);

  const handleLevelChange = (id: string, newLevel: number) => {
    setSubjects(prev =>
      prev.map(s => (s.id === id ? { ...s, level: Number(newLevel) } : s))
    );
  };

  const handleSubjectNameChange = (id: string, newName: string) => {
    setSubjects(prev =>
      prev.map(s => (s.id === id ? { ...s, name: newName } : s))
    );
  };

  const handleReset = () => {
    setSubjects(DEFAULT_SUBJECTS);
  };

  const handleSendToAdvisor = () => {
    const summary = `My calculated NSC Admission Point Score (APS) is ${totalAps} points (Subjects: ${subjects.map(s => `${s.name}: Level ${s.level}`).join(', ')}). With ${mathType === 'pure' ? 'Pure Mathematics' : 'Mathematical Literacy'}, which UNIZULU faculties and degree programs do I qualify for?`;
    onApplyScoreToChat(totalAps, summary);
    if (onSaveToProfile) onSaveToProfile(totalAps);
  };

  // Qualification benchmark
  const getEligibilityMessage = (score: number) => {
    if (score >= 32) return 'Excellent! Qualifies for competitive degrees like Law (LLB), BCom, and Science.';
    if (score >= 28) return 'Great! Qualifies for most Bachelor degrees across Arts, Education, and Administration.';
    if (score >= 24) return 'Good! Qualifies for Diploma programs and select Bachelor degrees with foundational support.';
    return 'Lower than 24. Look into Higher Certificates or academic upgrading pathways.';
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Header - Warm Amber/Gold Theme */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToChat}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#002138] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Return to Admissions Chat"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-[#002138] flex items-center justify-center font-bold shadow-sm">
              <Calculator className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                UNIZULU Matric APS Calculator
              </h1>
              <p className="text-xs text-amber-800 font-medium">
                Official National Senior Certificate (NSC) Admission Point Score Formula
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Marks</span>
            </button>
          </div>
        </div>

        {/* Amber / Gold Prominent Result Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 rounded-2xl p-5 text-[#002138] shadow-sm border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-extrabold uppercase tracking-wider text-amber-950">
              Total Admission Point Score (Best 6 Subjects)
            </div>
            <div className="flex items-baseline justify-center sm:justify-start gap-2">
              <span className="text-4xl sm:text-5xl font-black">{totalAps}</span>
              <span className="text-lg font-bold text-amber-950">/ 42 Points Max</span>
            </div>
            <p className="text-xs text-amber-950 font-medium">
              {getEligibilityMessage(totalAps)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSendToAdvisor}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#002138] hover:bg-[#001726] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-102 active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Ask Advisor About This Score in Chat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Policy Notice Box */}
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>UNIZULU Admission Standard:</strong> Your APS is calculated using your <strong>best 6 NSC subjects</strong>. 
            In strict compliance with University of Zululand policy, <strong>Life Orientation is excluded</strong> from the APS calculation.
          </div>
        </div>

        {/* Mathematics Pathway Selector */}
        <div className="bg-white rounded-xl p-4 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-slate-800">Mathematics Pathway:</div>
            <div className="text-[11px] text-slate-500">
              Certain degrees (e.g., Computer Science, Accounting) require Pure Mathematics.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMathType('pure')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mathType === 'pure'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pure Mathematics
            </button>
            <button
              type="button"
              onClick={() => setMathType('lit')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mathType === 'lit'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Mathematical Literacy
            </button>
          </div>
        </div>

        {/* Subject Rows Card */}
        <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              NSC Matric Subjects (Enter Levels 1 - 7)
            </span>
            <span className="text-xs text-amber-800 font-semibold">
              Current Total: <strong>{totalAps} pts</strong>
            </span>
          </div>

          <div className="divide-y divide-slate-100 p-2 sm:p-4 space-y-2">
            {subjects.map((subj, index) => (
              <div
                key={subj.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl hover:bg-amber-50/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 flex-1">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={subj.name}
                    onChange={(e) => handleSubjectNameChange(subj.id, e.target.value)}
                    className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:outline-none px-1 py-0.5"
                  />
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <select
                    value={subj.level}
                    onChange={(e) => handleLevelChange(subj.id, Number(e.target.value))}
                    className="bg-slate-50 hover:bg-white border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    {[7, 6, 5, 4, 3, 2, 1].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        Level {lvl} ({lvl} pts) - {LEVEL_PERCENTAGES[lvl]}
                      </option>
                    ))}
                  </select>

                  <span className="w-12 text-center text-xs font-black text-amber-800 bg-amber-100/70 py-1 px-2 rounded-lg">
                    +{subj.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Benchmarks Reference Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-white border border-amber-200 text-xs space-y-1 shadow-2xs">
            <div className="font-bold text-amber-900">Law &amp; Humanities (CAL)</div>
            <div className="text-slate-600">LLB requires min 30 APS with English Level 5.</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-amber-200 text-xs space-y-1 shadow-2xs">
            <div className="font-bold text-amber-900">Science &amp; Agriculture</div>
            <div className="text-slate-600">Computer Science requires 28-32 APS with Pure Maths Level 4.</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-amber-200 text-xs space-y-1 shadow-2xs">
            <div className="font-bold text-amber-900">Education &amp; Commerce</div>
            <div className="text-slate-600">BEd and BCom require 26-28 APS with designated subject criteria.</div>
          </div>
        </div>

      </div>
    </div>
  );
};
