import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Calculator, 
  FileCheck2, 
  BookOpen, 
  MapPin, 
  Calendar, 
  Mail, 
  ArrowRight, 
  Award, 
  Languages, 
  ChevronRight,
  School
} from 'lucide-react';
import { UserProfile } from '../types';
import { UnizuluLogo } from './UnizuluLogo';
import { getLanguageByCode } from '../data/languages';
import { FCAL_MODULE_COURSES } from '../data/fcalModules';

export interface CampusSlide {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  location: string;
  badge: string;
}

export const CAMPUS_SLIDES: CampusSlide[] = [
  {
    id: 'unizulu-glass-library',
    url: '/campus/lib3.jpg',
    title: 'UNIZULU Central Library & Glass Administration Complex',
    subtitle: 'Flagship Academic Research Centre, Study Commons & Faculty Administration',
    location: 'KwaDlangezwa Main Campus • Central Library Quad',
    badge: 'Central Library'
  },
  {
    id: 'richards-bay-campus',
    url: '/campus/rbay.jpg',
    title: 'UNIZULU Richards Bay Campus Academic Complex',
    subtitle: 'Modern Coastal Urban Campus • Coastal Engineering & Business Hub',
    location: 'Richards Bay Urban Campus • Maritime Precinct',
    badge: 'Richards Bay Campus'
  },
  {
    id: 'library-walkway',
    url: '/campus/lib1.jpg',
    title: 'KwaDlangezwa Campus Library Entrance & Palm Walkway',
    subtitle: 'Iconic Academic Palm Boulevard Leading to Student Study Halls',
    location: 'KwaDlangezwa Main Campus • Library Walkway',
    badge: 'Library Walkway'
  },
  {
    id: 'library-precinct',
    url: '/campus/lib2.jpg',
    title: 'UNIZULU Academic Knowledge & Library Precinct',
    subtitle: 'Student Commons, Archives, Learning Resources & Lecture Theatres',
    location: 'KwaDlangezwa Main Campus • Academic Precinct',
    badge: 'Academic Precinct'
  },
  {
    id: 'dlangezwa-entrance',
    url: '/campus/slide1.jpg',
    title: 'KwaDlangezwa Campus Main Grounds & Walkways',
    subtitle: 'Primary Academic Campus • KwaDlangezwa, KwaZulu-Natal',
    location: 'KwaDlangezwa Main Campus • Academic Grounds',
    badge: 'Campus Walkways'
  },
  {
    id: 'admin-aerial',
    url: '/campus/slide3.jpg',
    title: 'UNIZULU Administration & Central Library Complex (Aerial View)',
    subtitle: 'Faculty Administration, Council Chambers & Academic Hub',
    location: 'Administration Quad • Aerial Panorama',
    badge: 'Administration Aerial'
  }
];

interface WelcomeCoverPageProps {
  userProfile: UserProfile | null;
  selectedLanguage: string;
  onOpenChat: (initialPrompt?: string) => void;
  onOpenAps: () => void;
  onOpenDocs: () => void;
  onOpenFaculties: () => void;
  onOpenLanguage: () => void;
}

export const WelcomeCoverPage: React.FC<WelcomeCoverPageProps> = ({
  userProfile: _userProfile,
  selectedLanguage,
  onOpenChat,
  onOpenAps,
  onOpenDocs,
  onOpenFaculties,
  onOpenLanguage,
}) => {
  const activeLang = getLanguageByCode(selectedLanguage);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-advance slideshow smoothly in background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % CAMPUS_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const quickQuestions = [
    {
      title: 'What can I study?',
      subtitle: 'Explore degree & diploma qualifications across all 4 faculties',
      icon: '🎓',
      prompt: 'What undergraduate qualifications can I study at the University of Zululand across all faculties?'
    },
    {
      title: 'Check Requirements',
      subtitle: 'Learn about minimum APS, subject requirements & endorsements',
      icon: '📋',
      prompt: 'What are the general admission requirements and minimum APS scores for UNIZULU programmes?'
    },
    {
      title: 'Course Recommendation',
      subtitle: 'Get advice on best programmes matching your Grade 11 or 12 marks',
      icon: '🎯',
      prompt: 'Can you recommend degrees and diplomas at UNIZULU based on my subject performance and interests?'
    },
    {
      title: 'Apply via CAO',
      subtitle: 'Step-by-step guidance on CAO codes, dates & payment',
      icon: '📝',
      prompt: 'How do I apply to the University of Zululand through the Central Applications Office (CAO) step by step?'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-950 text-slate-100 font-sans selection:bg-[#F1B82D] selection:text-[#002138] relative">
      
      {/* ============================================================== */}
      {/* 0. FULL-PAGE REAL CAMPUS PANORAMA SLIDESHOW BACKDROP          */}
      {/* ============================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {CAMPUS_SLIDES.map((slide, idx) => (
          <div 
            key={`bg-slide-${slide.id}`}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              idx === currentSlideIndex ? 'opacity-85' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('${slide.url}')`,
              backgroundPosition: 'center 35%'
            }}
          />
        ))}
      </div>
      {/* Neutral partly invisible scrim without color tint so background appears clearly */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-black/25" />

      {/* ============================================================== */}
      {/* 1. TOP PORTAL NAVIGATION BAR                                   */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <UnizuluLogo className="w-10 h-10 sm:w-11 sm:h-11" showText={true} />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector Button */}
          <button
            type="button"
            onClick={onOpenLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            title="Choose Language (isiZulu, English, Afrikaans, etc.)"
          >
            <Languages className="w-3.5 h-3.5 text-[#F1B82D]" />
            <span className="hidden md:inline">{activeLang.name}</span>
            <span className="md:hidden">{activeLang.code.toUpperCase()}</span>
          </button>

          {/* Primary Action Button: Chat with Advisor */}
          <button
            type="button"
            onClick={() => onOpenChat()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F1B82D] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-[#002138] font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-[#002138]" />
            <span>Chat with Advisor</span>
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. HERO SHOWCASE SECTION (Dual Split Screen Layout)            */}
      {/* ============================================================== */}
      <section className="relative z-10 px-4 sm:px-8 pt-6 pb-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT SIDE: Hero Visual & Real UNIZULU Campus Image Slideshow (7 Columns) */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden relative min-h-[500px] sm:min-h-[560px] flex flex-col justify-between p-6 sm:p-9 shadow-2xl border border-white/15 bg-slate-900 group">
            
            {/* The Real UNIZULU Photo Slideshow with Crossfade Effect */}
            <div className="absolute inset-0 overflow-hidden">
              {CAMPUS_SLIDES.map((slide, idx) => (
                <div 
                  key={`hero-slide-${slide.id}`}
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out ${
                    idx === currentSlideIndex 
                      ? 'opacity-100 scale-100 z-0' 
                      : 'opacity-0 scale-105 pointer-events-none -z-10'
                  }`}
                  style={{
                    backgroundImage: `url('${slide.url}')`,
                    backgroundPosition: 'center 40%'
                  }}
                />
              ))}
            </div>

            {/* Neutral Film Vignette Overlays without color wash */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 pointer-events-none" />

            {/* Top Floating Badge */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  2026 Admissions Open
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F1B82D]/25 text-[#F1B82D] border border-[#F1B82D]/40 text-xs font-bold backdrop-blur-md shadow-sm">
                  <Award className="w-3.5 h-3.5" />
                  KwaDlangezwa &amp; Richards Bay
                </span>
              </div>
            </div>

            {/* Bottom Real Building Info & Welcome Copy */}
            <div className="relative z-10 space-y-4 pt-12">
              
              {/* Authentic Campus Landmark Pill */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-xs text-amber-300 font-semibold shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-[#F1B82D] flex-shrink-0" />
                  <span>{CAMPUS_SLIDES[currentSlideIndex].location}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-sky-300 tracking-wide uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span>{CAMPUS_SLIDES[currentSlideIndex].title}</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight font-serif drop-shadow-md">
                  Welcome to the <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F1B82D] via-amber-300 to-white">
                    University of Zululand
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-slate-100 font-medium max-w-xl leading-relaxed drop-shadow-sm">
                  Restructured for Relevance, Empowering African Communities with World-Class Higher Education, Leadership, and Groundbreaking Research.
                </p>
              </div>

              {/* Campus Highlights Grid */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200 border-t border-white/20">
                <div className="flex items-start gap-2 bg-black/45 p-2.5 rounded-xl backdrop-blur-md border border-white/10">
                  <span className="text-base flex-shrink-0">🏛️</span>
                  <span><strong>Comprehensive University:</strong> Operating across modern rural (KwaDlangezwa) &amp; coastal urban (Richards Bay) campuses.</span>
                </div>
                <div className="flex items-start gap-2 bg-black/45 p-2.5 rounded-xl backdrop-blur-md border border-white/10">
                  <span className="text-base flex-shrink-0">🔬</span>
                  <span><strong>Innovation Hub:</strong> Home to Africa's award-winning Science Centre &amp; world-class academic departments.</span>
                </div>
              </div>

              {/* Direct Welcome Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenChat()}
                  className="px-6 py-3 rounded-xl bg-[#F1B82D] hover:bg-amber-400 text-[#002138] font-black text-sm tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-[#002138]" />
                  <span>Start Chatting Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onOpenFaculties}
                  className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-sky-300" />
                  <span>Explore 2026 Handbook</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Institutional Profile & Interactive Portal Panel (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-black/55 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/15 shadow-2xl space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F1B82D] to-amber-600 text-[#002138] flex items-center justify-center font-black text-lg shadow-md">
                    🎓
                  </div>
                  <div>
                    <h2 className="font-bold text-base sm:text-lg text-white">UNIZULU Portal</h2>
                    <p className="text-xs text-slate-400">Online Academic Advisor Interface</p>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                  FCAL 2026 Ready
                </span>
              </div>

              {/* Profile Bio */}
              <div className="mt-4 space-y-3">
                <div className="text-xs text-slate-300 leading-relaxed bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <p className="font-semibold text-white mb-1">🏛️ Institutional Profile:</p>
                  The University of Zululand offers accredited undergraduate degrees, diplomas, and postgraduate qualifications across four key faculties designed to meet Africa’s economic and developmental needs.
                </div>

                {/* Important Dates */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-emerald-950/50 border border-emerald-700/60 rounded-xl p-3 text-xs">
                    <span className="text-emerald-400 font-bold block text-[11px] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Applications Open
                    </span>
                    <span className="text-white font-extrabold text-sm block mt-0.5">1 March 2026</span>
                    <span className="text-[10px] text-emerald-300/80">Via CAO Portal</span>
                  </div>

                  <div className="bg-amber-950/50 border border-amber-700/60 rounded-xl p-3 text-xs">
                    <span className="text-amber-400 font-bold block text-[11px] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Closing Deadline
                    </span>
                    <span className="text-white font-extrabold text-sm block mt-0.5">31 October 2026</span>
                    <span className="text-[10px] text-amber-300/80">Strict on-time cut-off</span>
                  </div>
                </div>

                {/* Direct Campus Contacts */}
                <div className="bg-slate-800/70 rounded-xl p-3.5 border border-slate-700/70 space-y-2 text-xs">
                  <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider block">
                    Campus Enquiries &amp; Admissions:
                  </span>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      KwaDlangezwa (Main):
                    </span>
                    <a href="tel:+270359026649" className="font-bold text-white hover:text-[#F1B82D] transition-colors">
                      +27 (035) 902 6649
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      Richards Bay Campus:
                    </span>
                    <a href="tel:+270359026950" className="font-bold text-white hover:text-[#F1B82D] transition-colors">
                      +27 (035) 902 6950
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-700/60">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      Official Email:
                    </span>
                    <span className="font-mono text-white text-[11px]">admissions@unizulu.ac.za</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Service Action Launcher */}
            <div className="pt-2 border-t border-slate-700/80 space-y-3">
              <div className="text-xs text-slate-300 font-semibold flex items-center justify-between">
                <span>Select an Advisory Tool:</span>
                <span className="text-[10px] text-amber-400 font-bold">4 Modules Available</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onOpenAps}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-[#F1B82D] flex items-center justify-center font-bold">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold leading-tight group-hover:text-[#F1B82D] transition-colors">APS Calculator</div>
                    <div className="text-[10px] text-slate-400">Score Tracker</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={onOpenDocs}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold leading-tight group-hover:text-emerald-400 transition-colors">Documents</div>
                    <div className="text-[10px] text-slate-400">SAPS Checklist</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={onOpenFaculties}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-sky-400 flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold leading-tight group-hover:text-sky-300 transition-colors">Faculties</div>
                    <div className="text-[10px] text-slate-400">FCAL 2026</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={onOpenLanguage}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                    <Languages className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold leading-tight group-hover:text-purple-300 transition-colors">Languages</div>
                    <div className="text-[10px] text-slate-400">11 SA Tongues</div>
                  </div>
                </button>
              </div>

              {/* Chat CTA Banner */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenChat()}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Have admission questions? Chat Now 💬</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. QUICK ASK CARDS (Interactive Grid)                          */}
      {/* ============================================================== */}
      <section className="relative z-10 px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 font-serif">
              <Sparkles className="w-5 h-5 text-[#F1B82D]" />
              Instant Advisory &bull; Quick Inquiries
            </h2>
            <p className="text-xs text-slate-400">Click any card to start a tailored guidance session with our Admissions Advisor</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChat()}
            className="text-xs text-[#F1B82D] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Open Full Chat</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickQuestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onOpenChat(item.prompt)}
              className="text-left bg-black/45 hover:bg-black/65 backdrop-blur-md p-5 rounded-2xl border border-white/15 hover:border-amber-400/50 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#F1B82D] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span>Ask Advisor</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. FACULTY HIGHLIGHTS & 2026 HANDBOOK SHOWCASE                */}
      {/* ============================================================== */}
      <section className="relative z-10 px-4 sm:px-8 py-8 max-w-7xl mx-auto w-full">
        <div className="bg-black/55 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <School className="w-4 h-4" />
                Academic Excellence
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mt-1">
                Explore the Four UNIZULU Faculties
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Full 2026 Handbook accreditation covering degrees, augmented streams, and diploma tracks
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenFaculties}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-600 transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#F1B82D]" />
              <span>Browse All Handbooks</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* FCAL */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-blue-900/60 hover:border-blue-500/60 transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-800">
                  FCAL &bull; 2026 Handbook
                </span>
                <h4 className="font-bold text-white text-sm">Commerce, Administration &amp; Law</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Home to SAICA-accredited BCom Accounting Science, 4-year LLB, BAdmin, BCom double majors, and {FCAL_MODULE_COURSES.length}+ course modules.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenFaculties}
                className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer pt-2"
              >
                <span>View FCAL Courses</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* FSAE */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-emerald-900/60 hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                  FSAE
                </span>
                <h4 className="font-bold text-white text-sm">Science, Agriculture &amp; Engineering</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Electrical/Mechanical Engineering, Computer Science, Agriculture, Hydrology, Biochemistry, and Mathematics.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChat('Tell me about degrees offered in the Faculty of Science, Agriculture and Engineering')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer pt-2"
              >
                <span>Ask About Science</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* FED */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-amber-900/60 hover:border-amber-500/60 transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800">
                  FED
                </span>
                <h4 className="font-bold text-white text-sm">Faculty of Education</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bachelor of Education (BEd) Foundation Phase, Intermediate Phase, and Senior &amp; FET teaching specialisations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChat('What are the admission requirements for Bachelor of Education (BEd) at UNIZULU?')}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer pt-2"
              >
                <span>Ask About Education</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* FHSS */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-purple-900/60 hover:border-purple-500/60 transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-800">
                  FHSS
                </span>
                <h4 className="font-bold text-white text-sm">Humanities &amp; Social Sciences</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bachelor of Social Work (BSW), Psychology, Sociology, Communication Science, and Development Studies.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChat('What courses and degrees are offered in the Faculty of Humanities and Social Sciences?')}
                className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer pt-2"
              >
                <span>Ask About Humanities</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. FOOTER & INSTITUTIONAL DISCLAIMER                           */}
      {/* ============================================================== */}
      <footer className="mt-auto relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-md px-4 sm:px-8 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 p-1 flex items-center justify-center">
              <img src="/unizulu-emblem.svg" alt="UNIZULU Crest" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-slate-200 font-bold">University of Zululand (UNIZULU)</p>
              <p className="text-[11px] text-slate-400">KwaDlangezwa &amp; Richards Bay Campuses, KwaZulu-Natal, South Africa</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a 
              href="https://www.unizulu.ac.za" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-[#F1B82D] underline transition-colors"
            >
              Official Website (unizulu.ac.za)
            </a>
            <a 
              href="https://www.cao.ac.za" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-[#F1B82D] underline transition-colors"
            >
              CAO Portal (cao.ac.za)
            </a>
            <button
              type="button"
              onClick={() => onOpenChat()}
              className="text-[#F1B82D] font-bold hover:underline cursor-pointer"
            >
              Launch Chatbot
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
