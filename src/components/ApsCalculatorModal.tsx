import React, { useState } from 'react';
import { 
  Calculator, 
  AlertCircle, 
  Sparkles, 
  X, 
  CheckCircle2, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';

interface ApsCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyScoreToChat: (score: number, details: string) => void;
  onSaveToProfile?: (score: number) => void;
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

export const ApsCalculatorModal: React.FC<ApsCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplyScoreToChat,
  onSaveToProfile,
  currentScore
}) => {
  const [subjects, setSubjects] = useState<SubjectEntry[]>(DEFAULT_SUBJECTS);
  const [mathType, setMathType] = useState<'pure' | 'lit'>('pure');

  if (!isOpen) return null;

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

  const handleAskAssistant = () => {
    const summary = `My calculated Admission Point Score (APS) is ${totalAps} points based on my NSC Matric subjects (${subjects.map(s => `${s.name}: Level ${s.level}`).join(', ')}). With ${mathType === 'pure' ? 'Pure Mathematics' : 'Mathematical Literacy'}, which UNIZULU faculties and degree programs can I qualify for, and what are their CAO codes?`;
    onApplyScoreToChat(totalAps, summary);
    if (onSaveToProfile) onSaveToProfile(totalAps);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs min-h-screen animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 my-auto">
        
        {/* Modal Header */}
        <div className="bg-[#002138] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1B82D] text-[#002B49] flex items-center justify-center font-bold shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg tracking-tight">
                UNIZULU Matric APS Calculator
              </h3>
              <p className="text-xs text-slate-300">
                Official Admission Point Score formula for NSC Matriculants
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-sm bg-slate-50/50">
          
          {/* Note Banner */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>UNIZULU Calculation Standard:</strong> APS is calculated using your <strong>best 6 subjects</strong>. Life Orientation is <strong>excluded</strong> from the point total in accordance with university admissions policy.
            </div>
          </div>

          {/* Math Type Toggle - Better Arranged */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-700">Mathematics Pathway:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMathType('pure')}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                  mathType === 'pure'
                    ? 'bg-[#002138] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pure Mathematics (BSc / BCom)
              </button>
              <button
                type="button"
                onClick={() => setMathType('lit')}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                  mathType === 'lit'
                    ? 'bg-[#002138] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Mathematical Literacy
              </button>
            </div>
          </div>

          {/* Subjects Table - Clean Aligned Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Matric Subject Name</span>
              <span>NSC Achievement Level (1–7)</span>
            </div>

            <div className="space-y-2">
              {subjects.map((sub, idx) => (
                <div 
                  key={sub.id} 
                  className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <span className="w-5 text-center text-xs font-bold text-slate-400">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={sub.name}
                    onChange={(e) => handleSubjectNameChange(sub.id, e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#002138] focus:bg-white"
                  />
                  <select
                    value={sub.level}
                    onChange={(e) => handleLevelChange(sub.id, Number(e.target.value))}
                    className="w-40 sm:w-44 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#002138] focus:outline-none focus:border-[#002138] focus:bg-white"
                  >
                    <option value={7}>Level 7 (80–100%) = 7 pts</option>
                    <option value={6}>Level 6 (70–79%) = 6 pts</option>
                    <option value={5}>Level 5 (60–69%) = 5 pts</option>
                    <option value={4}>Level 4 (50–59%) = 4 pts</option>
                    <option value={3}>Level 3 (40–49%) = 3 pts</option>
                    <option value={2}>Level 2 (30–39%) = 2 pts</option>
                    <option value={1}>Level 1 (0–29%) = 1 pt</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Results Summary Box - Perfectly Aligned */}
          <div className="bg-[#002138] text-white p-4 sm:p-5 rounded-2xl shadow-sm border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#F1B82D] font-bold block">
                  Calculated Admission Score
                </span>
                <div className="text-3xl font-black text-white mt-0.5">
                  {totalAps} <span className="text-sm font-normal text-slate-300">/ 42 Points</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#F1B82D] text-[#002B49]">
                  {totalAps >= 30 ? 'Bachelor Degree Eligible' : totalAps >= 26 ? 'General Degree Eligible' : 'Diploma / Certificate Route'}
                </span>
              </div>
            </div>

            {/* Faculty Alignment Quick Check */}
            <div className="pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className={`p-2.5 rounded-xl border ${totalAps >= 30 ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                <div className="font-bold">Law (LLB)</div>
                <div className="text-[11px]">Req: 30+ pts {totalAps >= 30 ? '✅' : '❌'}</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${totalAps >= 28 ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                <div className="font-bold">BSc Computing</div>
                <div className="text-[11px]">Req: 28+ pts {totalAps >= 28 ? '✅' : '❌'}</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${totalAps >= 26 ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                <div className="font-bold">Humanities</div>
                <div className="text-[11px]">Req: 26+ pts {totalAps >= 26 ? '✅' : '❌'}</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${totalAps >= 26 ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-200' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                <div className="font-bold">Education (B.Ed)</div>
                <div className="text-[11px]">Req: 26+ pts {totalAps >= 26 ? '✅' : '❌'}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-white px-5 sm:px-6 py-3.5 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Marks</span>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-3d-slate px-4 py-2 bg-slate-100 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-200 text-xs font-bold cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleAskAssistant}
              className="btn-3d-navy flex items-center gap-1.5 px-4 py-2 bg-[#002138] hover:bg-[#003152] text-white rounded-xl text-xs font-bold cursor-pointer border border-sky-400/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F1B82D]" />
              <span>Ask Advisor: What Can I Study?</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
