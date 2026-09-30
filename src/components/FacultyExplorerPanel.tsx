import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  MapPin, 
  Clock, 
  Award, 
  Sparkles, 
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Filter,
  Copy,
  Check
} from 'lucide-react';
import { UNIZULU_FACULTIES } from '../data/unizuluKnowledge';

interface FacultyExplorerPanelProps {
  onSelectProgramQuery: (programName: string, facultyName: string) => void;
  onBackToChat: () => void;
}

export const FacultyExplorerPanel: React.FC<FacultyExplorerPanelProps> = ({
  onSelectProgramQuery,
  onBackToChat
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');
  const [selectedCampus, setSelectedCampus] = useState<'ALL' | 'Richards Bay' | 'KwaDlangezwa'>('ALL');
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

    UNIZULU_FACULTIES.forEach(faculty => {
      faculty.popularDegrees.forEach(degree => {
        list.push({
          facultyName: faculty.name,
          facultyCode: faculty.code,
          deanery: faculty.deanery,
          ...degree
        });
      });
    });

    return list;
  }, []);

  const richardsBayCount = useMemo(() => {
    return allDegreesWithFaculty.filter(d => 
      d.campus === 'Richards Bay' || 
      d.campus === 'Both' || 
      (d.caoCode ? d.caoCode.includes('-R-') : false) ||
      d.title.toLowerCase().includes('richards bay')
    ).length;
  }, [allDegreesWithFaculty]);

  const kwaDlangezwaCount = useMemo(() => {
    return allDegreesWithFaculty.filter(d => 
      d.campus === 'KwaDlangezwa' || 
      d.campus === 'Both' || 
      (d.caoCode ? d.caoCode.includes('-M-') : false) ||
      !d.campus
    ).length;
  }, [allDegreesWithFaculty]);

  const filteredDegrees = useMemo(() => {
    return allDegreesWithFaculty.filter(deg => {
      const matchSearch = searchQuery.trim() === '' || 
        deg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deg.keyRequirements.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (deg.caoCode && deg.caoCode.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchFaculty = selectedFaculty === 'ALL' || deg.facultyCode === selectedFaculty;
      
      let matchCampus = true;
      if (selectedCampus === 'Richards Bay') {
        matchCampus = 
          deg.campus === 'Richards Bay' || 
          deg.campus === 'Both' || 
          Boolean(deg.caoCode && deg.caoCode.includes('-R-')) ||
          deg.title.toLowerCase().includes('richards bay');
      } else if (selectedCampus === 'KwaDlangezwa') {
        matchCampus = 
          deg.campus === 'KwaDlangezwa' || 
          deg.campus === 'Both' || 
          Boolean(deg.caoCode && deg.caoCode.includes('-M-')) ||
          !deg.campus;
      }

      return matchSearch && matchFaculty && matchCampus;
    });
  }, [allDegreesWithFaculty, searchQuery, selectedFaculty, selectedCampus]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCampusSelect = (campus: 'ALL' | 'Richards Bay' | 'KwaDlangezwa') => {
    setSelectedCampus(campus);
    if (campus === 'Richards Bay' && selectedFaculty !== 'ALL') {
      // Check if selected faculty has any courses at Richards Bay; if not, reset to ALL
      const hasCourses = allDegreesWithFaculty.some(d => 
        d.facultyCode === selectedFaculty && 
        (d.campus === 'Richards Bay' || d.campus === 'Both' || (d.caoCode && d.caoCode.includes('-R-')))
      );
      if (!hasCourses) {
        setSelectedFaculty('ALL');
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-8 bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation & Header - Indigo / Royal Blue Theme */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToChat}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#002138] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Return to Admissions Chat"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                UNIZULU Faculties &amp; Qualifications
              </h1>
              <p className="text-xs text-indigo-800 font-medium">
                Official 4 Faculties, Undergraduate Degrees, Diplomas, Minimum APS &amp; CAO Codes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs font-bold rounded-lg border border-indigo-300">
              {filteredDegrees.length} Qualifications
            </span>
          </div>
        </div>

        {/* Indigo Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-indigo-200 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by degree title, subject, or CAO code (e.g., Law, Computer Science, Nursing)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-xs sm:text-sm text-slate-800 focus:outline-none"
            />
          </div>

          {/* Faculty Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <button
              type="button"
              onClick={() => setSelectedFaculty('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedFaculty === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All 4 Faculties
            </button>

            {UNIZULU_FACULTIES.map(fac => (
              <button
                key={fac.code}
                type="button"
                onClick={() => setSelectedFaculty(fac.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedFaculty === fac.code
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {fac.code}: {fac.name.replace('Faculty of ', '')}
              </button>
            ))}
          </div>

          {/* Campus Filter */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs flex-wrap">
            <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              Campus:
            </span>

            <button
              type="button"
              onClick={() => handleCampusSelect('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCampus === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>All Campuses</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCampus === 'ALL' ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-600'
              }`}>
                {allDegreesWithFaculty.length}
              </span>
            </button>

            <button
              type="button"
              id="btn-filter-richards-bay"
              onClick={() => handleCampusSelect('Richards Bay')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCampus === 'Richards Bay'
                  ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-300'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span>Richards Bay Campus</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCampus === 'Richards Bay' ? 'bg-amber-800 text-amber-100' : 'bg-amber-200/80 text-amber-900'
              }`}>
                {richardsBayCount} courses
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleCampusSelect('KwaDlangezwa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCampus === 'KwaDlangezwa'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>KwaDlangezwa Campus</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCampus === 'KwaDlangezwa' ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-600'
              }`}>
                {kwaDlangezwaCount}
              </span>
            </button>
          </div>
        </div>

        {/* Active Filter Notice */}
        {selectedCampus === 'Richards Bay' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                Showing <strong>{filteredDegrees.length} qualifications</strong> recognized at <strong>Richards Bay Campus</strong> (CAO prefix <span className="font-mono font-bold">ZU-R-</span>).
              </span>
            </div>
            {selectedFaculty !== 'ALL' && (
              <button
                type="button"
                onClick={() => setSelectedFaculty('ALL')}
                className="underline font-bold text-amber-800 hover:text-amber-950 flex-shrink-0 cursor-pointer text-[11px]"
              >
                View all faculties at Richards Bay
              </button>
            )}
          </div>
        )}

        {/* Qualification Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredDegrees.map((deg, idx) => {
            const isRichardsBayCourse = 
              deg.campus === 'Richards Bay' || 
              Boolean(deg.caoCode && deg.caoCode.includes('-R-')) ||
              deg.title.toLowerCase().includes('richards bay');

            return (
              <div
                key={`${deg.title}-${idx}`}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between space-y-3 ${
                  isRichardsBayCourse 
                    ? 'border-amber-200/90 hover:border-amber-400 hover:shadow-sm' 
                    : 'border-slate-200 hover:border-indigo-400 hover:shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 truncate">
                      {deg.facultyName}
                    </span>
                    
                    {isRichardsBayCourse ? (
                      <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex-shrink-0">
                        <MapPin className="w-3 h-3 text-amber-700" />
                        <span>Richards Bay</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md text-slate-600 bg-slate-100 flex-shrink-0">
                        <MapPin className="w-3 h-3 text-indigo-500" />
                        <span>KwaDlangezwa</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                    {deg.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {deg.keyRequirements}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 text-xs">
                    <div className="flex items-center gap-1 font-bold text-slate-800">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Min {deg.minAps} APS</span>
                    </div>
                    {deg.caoCode && (
                      <button
                        type="button"
                        onClick={() => handleCopyCode(deg.caoCode!)}
                        className={`flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                          isRichardsBayCourse
                            ? 'text-amber-800 bg-amber-50 border-amber-200 hover:bg-amber-100'
                            : 'text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                        }`}
                        title="Click to copy CAO Code"
                      >
                        <span>{deg.caoCode}</span>
                        {copiedCode === deg.caoCode ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectProgramQuery(deg.title, deg.facultyName)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-200" />
                    <span>Ask in Chat</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDegrees.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-sm text-slate-800">No qualifications match your current filters.</p>
            <p className="text-xs text-slate-500">
              {selectedCampus === 'Richards Bay'
                ? 'Try clearing the faculty filter or search query to see all 8+ qualifications offered at Richards Bay Campus.'
                : 'Try searching for generic terms or selecting "All 4 Faculties".'}
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFaculty('ALL');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
