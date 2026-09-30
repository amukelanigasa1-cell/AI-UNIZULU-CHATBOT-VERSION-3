import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  MapPin, 
  Clock, 
  Award, 
  Sparkles, 
  X, 
  Copy, 
  Check, 
  GraduationCap,
  Filter,
  RotateCcw
} from 'lucide-react';
import { UNIZULU_FACULTIES } from '../data/unizuluKnowledge';

interface FacultyExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProgramQuery: (programName: string, facultyName: string) => void;
  onOpenApsWithTarget?: (targetAps: number) => void;
}

const QUICK_TAGS = [
  'Law',
  'Nursing',
  'Computer Science',
  'Education',
  'Accounting',
  'Agriculture',
  'Social Work',
  'Richards Bay'
];

export const FacultyExplorerModal: React.FC<FacultyExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectProgramQuery
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');
  const [selectedCampus, setSelectedCampus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Flatten all degrees with their parent faculty info
  const allDegreesWithFaculty = useMemo(() => {
    const list: Array<{
      facultyName: string;
      facultyCode: string;
      deanery: string;
      title: string;
      minAps: number;
      duration: string;
      keyRequirements: string;
      caoCode?: string;
      campus?: string;
      qualificationType?: string;
    }> = [];

    UNIZULU_FACULTIES.forEach(f => {
      f.popularDegrees.forEach(d => {
        list.push({
          facultyName: f.name,
          facultyCode: f.code,
          deanery: f.deanery,
          campus: d.campus || (d.title.includes('Richards Bay') || (d.caoCode && d.caoCode.includes('-R-')) ? 'Richards Bay' : 'KwaDlangezwa'),
          qualificationType: d.qualificationType || (d.title.toLowerCase().includes('diploma') ? 'Diploma' : d.title.toLowerCase().includes('certificate') ? 'Certificate' : 'Degree'),
          ...d
        });
      });
    });

    return list;
  }, []);

  // Filter degrees cleanly
  const filteredDegrees = useMemo(() => {
    return allDegreesWithFaculty.filter(deg => {
      // Faculty filter
      if (selectedFaculty !== 'ALL' && deg.facultyCode !== selectedFaculty) {
        return false;
      }

      // Campus filter
      if (selectedCampus !== 'ALL') {
        const c = (deg.campus || '').toLowerCase();
        if (selectedCampus === 'KwaDlangezwa' && !c.includes('kwadlangezwa')) return false;
        if (selectedCampus === 'Richards Bay' && !c.includes('richards bay')) return false;
      }

      // Qualification Type filter
      if (selectedType !== 'ALL') {
        const t = (deg.qualificationType || '').toLowerCase();
        if (selectedType === 'Degree' && !t.includes('degree')) return false;
        if (selectedType === 'Diploma' && !t.includes('diploma')) return false;
        if (selectedType === 'Certificate' && !t.includes('certificate')) return false;
      }

      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      const titleMatch = deg.title.toLowerCase().includes(q);
      const facMatch = deg.facultyName.toLowerCase().includes(q) || deg.facultyCode.toLowerCase().includes(q);
      const reqMatch = deg.keyRequirements.toLowerCase().includes(q);
      const caoMatch = deg.caoCode ? deg.caoCode.toLowerCase().includes(q) : false;
      const campusMatch = deg.campus ? deg.campus.toLowerCase().includes(q) : false;

      return titleMatch || facMatch || reqMatch || caoMatch || campusMatch;
    });
  }, [allDegreesWithFaculty, selectedFaculty, selectedCampus, selectedType, searchQuery]);

  if (!isOpen) return null;

  const handleCopyCao = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const hasActiveFilters = searchQuery !== '' || selectedFaculty !== 'ALL' || selectedCampus !== 'ALL' || selectedType !== 'ALL';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFaculty('ALL');
    setSelectedCampus('ALL');
    setSelectedType('ALL');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs min-h-screen animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 my-auto">
        
        {/* Header with Title & Close */}
        <div className="bg-[#002138] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1B82D] text-[#002B49] flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg tracking-tight">
                UNIZULU Faculty &amp; Programme Directory
              </h3>
              <p className="text-xs text-slate-300">
                Search and explore qualifications, campuses, APS entry marks, and CAO codes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close directory"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Convenient Filter & Search Bar - No Horizontal Scrolling! */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 flex-shrink-0">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by degree name, subject, or CAO code (e.g. Law, Computer Science, Nursing, B.Ed)..."
              className="w-full bg-white border border-slate-300 focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/15 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Simple Dropdowns & Filters: Wrap cleanly on any screen without sidewards scroll */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Faculty Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
              <span className="text-slate-500 font-medium">Faculty:</span>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All 4 Faculties</option>
                <option value="CAL">CAL &bull; Commerce, Admin &amp; Law</option>
                <option value="SAE">SAE &bull; Science, Agriculture &amp; Eng.</option>
                <option value="EDU">EDU &bull; Education</option>
                <option value="HSS">HSS &bull; Humanities &amp; Social Sciences</option>
              </select>
            </div>

            {/* Campus Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
              <span className="text-slate-500 font-medium">Campus:</span>
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Campuses</option>
                <option value="KwaDlangezwa">KwaDlangezwa (Main)</option>
                <option value="Richards Bay">Richards Bay</option>
              </select>
            </div>

            {/* Qualification Type Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
              <span className="text-slate-500 font-medium">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="Degree">Bachelor Degrees</option>
                <option value="Diploma">Diplomas</option>
                <option value="Certificate">Certificates</option>
              </select>
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-200/70 hover:bg-slate-200 font-medium transition-colors cursor-pointer ml-auto"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Quick Search Tag Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-slate-400" />
              Quick:
            </span>
            {QUICK_TAGS.map(tag => {
              const isActive = searchQuery.toLowerCase() === tag.toLowerCase() || 
                (tag === 'Richards Bay' && selectedCampus === 'Richards Bay');
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    if (tag === 'Richards Bay') {
                      setSelectedCampus(selectedCampus === 'Richards Bay' ? 'ALL' : 'Richards Bay');
                    } else {
                      setSearchQuery(searchQuery === tag ? '' : tag);
                    }
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#002138] text-white'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
            <span className="text-[11px] text-slate-400 ml-auto font-medium">
              {filteredDegrees.length} {filteredDegrees.length === 1 ? 'programme' : 'programmes'}
            </span>
          </div>
        </div>

        {/* Responsive Grid of Cards - 2 Columns on Desktop for Easy Scanning Without Endless Scrolling */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-50/60">
          {filteredDegrees.length === 0 ? (
            <div className="py-14 text-center text-slate-500 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No qualifications matched your search criteria</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try clearing your search or switching campus and faculty filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="text-xs text-blue-700 hover:underline font-bold px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredDegrees.map((deg, index) => (
                <div
                  key={`${deg.title}-${index}`}
                  className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
                >
                  {/* Card Header: Title & Badges */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#002B49] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {deg.facultyCode}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {deg.qualificationType || 'Degree'}
                        </span>
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          {deg.campus}
                        </span>
                      </div>

                      {/* APS Badge */}
                      {deg.minAps > 0 && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-950 border border-amber-300 rounded-md text-[11px] font-extrabold flex-shrink-0">
                          <Award className="w-3 h-3 text-[#F1B82D]" />
                          <span>APS {deg.minAps}</span>
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {deg.title}
                    </h4>

                    {/* CAO Code & Duration */}
                    <div className="flex items-center gap-2 text-xs">
                      {deg.caoCode && (
                        <div className="inline-flex items-center gap-1 bg-amber-50/80 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-md text-[11px] font-bold">
                          <span>CAO: {deg.caoCode}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCao(deg.caoCode!)}
                            className="hover:text-amber-950 p-0.5 cursor-pointer"
                            title="Copy CAO code"
                          >
                            {copiedCode === deg.caoCode ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-amber-700" />
                            )}
                          </button>
                        </div>
                      )}
                      <span className="text-slate-400 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {deg.duration}
                      </span>
                    </div>
                  </div>

                  {/* Requirements Box */}
                  <div className="bg-slate-50/90 p-2.5 rounded-lg border border-slate-200/70 text-xs text-slate-600 space-y-1">
                    <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-[#002B49]" />
                      <span>Requirements:</span>
                    </div>
                    <p className="line-clamp-3 text-[11px] text-slate-600 leading-relaxed">
                      {deg.keyRequirements}
                    </p>
                  </div>

                  {/* Card Action */}
                  <div className="pt-1 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProgramQuery(deg.title, deg.facultyName);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#002138] hover:bg-[#003B66] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs w-full sm:w-auto justify-center"
                    >
                      <Sparkles className="w-3 h-3 text-[#F1B82D]" />
                      <span>Ask Advisor About This</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clean Footer */}
        <div className="bg-white px-5 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <div className="text-slate-500 text-[11px]">
            Official criteria verified with UNIZULU Calendar &bull;{' '}
            <a href="https://www.unizulu.ac.za" target="_blank" rel="noopener noreferrer" className="underline text-blue-700 hover:text-blue-900 font-medium">
              unizulu.ac.za
            </a>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer transition-colors"
          >
            Close Directory
          </button>
        </div>

      </div>
    </div>
  );
};
