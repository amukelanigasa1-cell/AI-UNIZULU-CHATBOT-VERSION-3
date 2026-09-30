import React from 'react';

interface UnizuluLogoProps {
  className?: string;
  showText?: boolean;
}

export const UnizuluLogo: React.FC<UnizuluLogoProps> = ({ className = 'w-10 h-10', showText = true }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Official UNIZULU Emblem Crest from provided URL */}
      <div className={`${className} relative flex-shrink-0 flex items-center justify-center p-0.5 rounded-full bg-white/95 shadow-md ring-2 ring-[#F1B82D]/70 overflow-hidden`}>
        <img
          src="/unizulu-emblem.svg"
          alt="University of Zululand Emblem Crest"
          className="w-full h-full object-contain filter drop-shadow-xs"
          onError={(e) => {
            // If svg fails to render, gracefully show fallback text/crest
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* University Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase text-white font-serif">
              UNIVERSITY OF ZULULAND
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium tracking-tight">
            <span>KwaDlangezwa &bull; Richards Bay</span>
            <span className="hidden lg:inline-block text-white/40">|</span>
            <span className="hidden lg:inline-block text-slate-300">Admissions Portal</span>
          </div>
        </div>
      )}
    </div>
  );
};
