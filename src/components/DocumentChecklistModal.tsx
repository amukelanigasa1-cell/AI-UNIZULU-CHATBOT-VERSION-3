import React from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  ExternalLink, 
  X, 
  Building2, 
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { UserProfile } from '../types';

interface DocumentChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onToggleDocument: (docKey: keyof UserProfile['documentsChecklist']) => void;
  onAskDocQuestion: (docName: string) => void;
}

const REQUIRED_DOCS_INFO: Array<{
  key: keyof UserProfile['documentsChecklist'];
  title: string;
  badge: string;
  certRule: string;
  description: string;
  whoNeedsIt: string;
}> = [
  {
    key: 'certifiedId',
    title: 'Certified Copy of South African ID or Passport',
    badge: 'Mandatory',
    certRule: 'Must be stamped by SAPS, Post Office, or Commissioner of Oaths within last 3 months',
    description: 'Clear, high-contrast scan of your barcoded smart ID card (both sides) or green ID book. International students must provide a valid passport.',
    whoNeedsIt: 'Every undergraduate and postgraduate applicant.'
  },
  {
    key: 'matricResults',
    title: 'Grade 11 Report or Final Matric Certificate',
    badge: 'Academic',
    certRule: 'Official stamped school statement or certified Umalusi certificate',
    description: 'If currently in Grade 12: Upload your certified final Grade 11 end-of-year report. If already completed school: Upload your certified NSC Statement of Results.',
    whoNeedsIt: 'All prospective students.'
  },
  {
    key: 'caoProofOfPayment',
    title: 'Proof of CAO Application Fee Payment',
    badge: 'Financial',
    certRule: 'Official EasyPay receipt or bank deposit slip with CAO reference',
    description: 'R250 standard fee for South African citizens (or R470 late fee). The payment reference must clearly show your unique CAO application number.',
    whoNeedsIt: 'Undergraduate CAO applicants.'
  },
  {
    key: 'proofOfAddress',
    title: 'Proof of Residential Address',
    badge: 'Residence & General',
    certRule: 'Municipal utility bill, bank statement, or traditional authority letter under 3 months old',
    description: 'Required if you are applying for on-campus student housing at KwaDlangezwa or Richards Bay campuses, or for local regional admissions verification.',
    whoNeedsIt: 'Students applying for UNIZULU campus residences.'
  },
  {
    key: 'academicTranscript',
    title: 'Official Academic Transcript & Certificate of Conduct',
    badge: 'Transfer Students',
    certRule: 'Must bear the official seal and signature of your previous institution',
    description: 'Only required if you have previously registered or studied at another tertiary institution (university or TVET college).',
    whoNeedsIt: 'Transfer and upgrading students.'
  }
];

export const DocumentChecklistModal: React.FC<DocumentChecklistModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onToggleDocument,
  onAskDocQuestion
}) => {
  if (!isOpen) return null;

  const docs = userProfile?.documentsChecklist || {
    certifiedId: false,
    matricResults: false,
    caoProofOfPayment: false,
    proofOfAddress: false,
    academicTranscript: false
  };

  const completedCount = Object.values(docs).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / REQUIRED_DOCS_INFO.length) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs min-h-screen animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 my-auto">
        
        {/* Header */}
        <div className="bg-[#002138] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg tracking-tight">
                UNIZULU Document Submission Checklist
              </h3>
              <p className="text-xs text-slate-300">
                Ensure your documents meet certification standards before CAO upload
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-sm bg-slate-50/50">
          
          {/* Progress Banner */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Readiness Progress: {completedCount} of {REQUIRED_DOCS_INFO.length} Prepared</span>
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {progressPercent}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* SAPS Certification Rule Callout */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-900">
            <AlertCircle className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Certification Standard:</strong> All photocopies must be stamped by the <strong>South African Police Service (SAPS)</strong>, Post Office, or a registered Commissioner of Oaths. The stamp date must not be older than <strong>3 months</strong> at the time of submission.
            </div>
          </div>

          {/* Document Items List - Better Arranged */}
          <div className="space-y-3">
            {REQUIRED_DOCS_INFO.map(item => {
              const isChecked = !!docs[item.key];
              return (
                <div
                  key={item.key}
                  className={`p-4 rounded-xl border transition-all ${
                    isChecked
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleDocument(item.key)}
                      className="mt-0.5 text-emerald-600 focus:outline-none flex-shrink-0"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 hover:text-emerald-500" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <h4 className={`text-xs sm:text-sm font-bold ${isChecked ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {item.badge}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <span className="text-amber-800 font-medium">
                          ⚠️ {item.certRule}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onAskDocQuestion(item.title);
                            onClose();
                          }}
                          className="text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Ask Advisor how to certify</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CAO Upload Link */}
          <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-between text-xs text-slate-700">
            <span>Ready to submit? Upload files directly to your CAO profile:</span>
            <a
              href="https://www.cao.ac.za"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline"
            >
              <span>CAO Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-white px-5 sm:px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Checklist saves automatically
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-3d-navy px-5 py-2 bg-[#002138] hover:bg-[#003152] text-white rounded-xl text-xs font-bold cursor-pointer border border-sky-400/30"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
