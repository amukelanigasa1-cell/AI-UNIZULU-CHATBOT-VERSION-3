import React from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  ExternalLink, 
  Building2, 
  Sparkles,
  ShieldCheck,
  FileText,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';

interface DocumentChecklistPanelProps {
  userProfile: UserProfile | null;
  onToggleDocument: (docKey: keyof UserProfile['documentsChecklist']) => void;
  onAskDocQuestion: (docName: string) => void;
  onBackToChat: () => void;
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
    badge: 'Mandatory for All',
    certRule: 'Must be stamped by SAPS or Commissioner of Oaths within the last 3 months',
    description: 'High-contrast scan or photo of your barcoded smart ID card (both sides) or green ID book. International applicants must provide an unexpired passport.',
    whoNeedsIt: 'Every prospective undergraduate and postgraduate applicant.'
  },
  {
    key: 'matricResults',
    title: 'Grade 11 Final Report or Matric NSC Certificate',
    badge: 'Academic Proof',
    certRule: 'Official school stamped statement or certified Umalusi certificate',
    description: 'If currently in Grade 12: Upload your certified final Grade 11 end-of-year report. If you completed matric: Upload your certified NSC Statement of Results.',
    whoNeedsIt: 'All prospective students applying for any qualification.'
  },
  {
    key: 'caoProofOfPayment',
    title: 'Proof of CAO Application Fee Payment',
    badge: 'Financial Slip',
    certRule: 'Official EasyPay receipt or bank deposit slip with CAO reference',
    description: 'R250 standard fee for South African citizens (or R470 late fee). The payment reference MUST display your unique CAO number.',
    whoNeedsIt: 'All undergraduate CAO applicants.'
  },
  {
    key: 'proofOfAddress',
    title: 'Proof of Residential Address',
    badge: 'Residence & Local Verification',
    certRule: 'Utility bill, bank statement, or traditional authority letter under 3 months old',
    description: 'Required if applying for student housing on KwaDlangezwa or Richards Bay campuses, or for regional admissions verification.',
    whoNeedsIt: 'Students applying for on-campus residences.'
  },
  {
    key: 'academicTranscript',
    title: 'Official Academic Transcript & Certificate of Conduct',
    badge: 'Transfer Applicants',
    certRule: 'Must bear the official stamp and seal of your previous institution',
    description: 'Required only if you previously registered or completed modules at another university or TVET college.',
    whoNeedsIt: 'Transfer and upgrading students.'
  }
];

export const DocumentChecklistPanel: React.FC<DocumentChecklistPanelProps> = ({
  userProfile,
  onToggleDocument,
  onAskDocQuestion,
  onBackToChat
}) => {
  const checklist = userProfile?.documentsChecklist || {
    certifiedId: false,
    matricResults: false,
    caoProofOfPayment: false,
    proofOfAddress: false,
    academicTranscript: false
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const isComplete = completedCount === 5;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Header - Fresh Emerald/Teal Theme */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToChat}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#002138] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Return to Admissions Chat"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
              <FileCheck2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                UNIZULU Document Verification Checklist
              </h1>
              <p className="text-xs text-emerald-800 font-medium">
                SAPS &amp; Commissioner of Oaths Certification Guidelines for 2026 Admissions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg border border-emerald-300">
              {completedCount} of 5 Ready
            </span>
          </div>
        </div>

        {/* Emerald / Teal Prominent Progress Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-5 text-white shadow-sm border border-emerald-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Document Readiness Progress
            </div>
            <div className="flex items-baseline justify-center sm:justify-start gap-2">
              <span className="text-3xl sm:text-4xl font-black">
                {Math.round((completedCount / 5) * 100)}% Complete
              </span>
              <span className="text-xs text-emerald-200 font-semibold">({completedCount}/5 verified)</span>
            </div>
            <p className="text-xs text-emerald-100 font-normal">
              {isComplete
                ? 'All documents are ready! You can submit them to CAO or UNIZULU admissions.'
                : 'Check off each document as you get it certified to ensure zero admissions delays.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAskDocQuestion('What is the complete certified document upload procedure for UNIZULU via CAO?')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-102 active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Ask Advisor About Documents in Chat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Official SAPS Certification Warning */}
        <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Critical South African Certification Mandate:</strong> All photocopied documents must be stamped by the 
            <strong> South African Police Service (SAPS)</strong>, a Post Office official, or a registered Commissioner of Oaths. 
            The official stamp <strong>must not be older than 3 months</strong> at the date of application submission.
          </div>
        </div>

        {/* The 5 Required Documents Cards */}
        <div className="space-y-3">
          {REQUIRED_DOCS_INFO.map((doc) => {
            const isChecked = checklist[doc.key];

            return (
              <div
                key={doc.key}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isChecked
                    ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => onToggleDocument(doc.key)}
                      className="mt-0.5 flex-shrink-0 text-emerald-600 hover:scale-110 transition-transform cursor-pointer"
                      title={isChecked ? 'Mark as incomplete' : 'Mark as ready/certified'}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-6 h-6 fill-emerald-600 text-white" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 hover:text-emerald-500" />
                      )}
                    </button>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-sm sm:text-base font-bold ${isChecked ? 'text-emerald-950 line-through decoration-emerald-500' : 'text-slate-900'}`}>
                          {doc.title}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {doc.badge}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {doc.description}
                      </p>

                      <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Rule: {doc.certRule}</span>
                      </div>

                      <div className="text-[10px] text-slate-500">
                        Applicable to: <span className="font-medium text-slate-700">{doc.whoNeedsIt}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAskDocQuestion(`What are the specific certification details and upload tips for "${doc.title}" at UNIZULU?`)}
                    className="flex-shrink-0 text-xs text-emerald-700 hover:text-emerald-950 font-bold hover:underline hidden sm:inline-block cursor-pointer"
                  >
                    Ask about this &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Submission Guidance */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Where to upload: Central Applications Office (CAO) online portal or UNIZULU admissions email.</span>
          </div>
          <a
            href="https://www.cao.ac.za"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 font-bold hover:underline flex items-center gap-1 flex-shrink-0"
          >
            <span>Visit CAO.ac.za</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};
