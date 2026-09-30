import React from 'react';

interface AdvisorAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export const AdvisorAvatar: React.FC<AdvisorAvatarProps> = ({
  size = 'md',
  className = '',
  animate = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 sm:w-9 sm:h-9',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
    xl: 'w-20 h-20 sm:w-24 sm:h-24'
  }[size];

  return (
    <div 
      className={`relative rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-tr from-amber-400 via-sky-400 to-cyan-200 p-[2.5px] shadow-[0_6px_16px_rgba(14,165,233,0.35),0_2px_4px_rgba(0,0,0,0.2)] border border-white/60 ${sizeClasses} ${className} ${animate ? 'animate-bounce duration-1000' : ''}`}
      aria-label="UNIZULU Academic Advisor Avatar"
    >
      {/* Crisp High-Res Collegiate Mascot Avatar SVG */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full rounded-full overflow-hidden"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Radial Glow */}
        <circle cx="50" cy="50" r="50" fill="#002138" />
        <circle cx="50" cy="45" r="40" fill="url(#advisor-bg-grad)" />

        <defs>
          <radialGradient id="advisor-bg-grad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="60%" stopColor="#003459" />
            <stop offset="100%" stopColor="#001827" />
          </radialGradient>
          <linearGradient id="skin-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8d5b4c" />
            <stop offset="100%" stopColor="#693e32" />
          </linearGradient>
          <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="collar-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* Collegiate Advisor Gown / Shoulders */}
        <path
          d="M16 100 C16 78 32 70 50 70 C68 70 84 78 84 100 Z"
          fill="#001a2e"
        />
        {/* Collegiate V-Collar in UNIZULU Sky & Gold */}
        <path
          d="M34 100 L50 78 L66 100 Z"
          fill="url(#collar-grad)"
        />
        <path
          d="M42 100 L50 86 L58 100 Z"
          fill="url(#gold-grad)"
        />

        {/* Neck */}
        <path
          d="M42 66 L58 66 L58 76 L42 76 Z"
          fill="#5a352a"
        />

        {/* Head / Face */}
        <ellipse cx="50" cy="52" rx="19" ry="20" fill="url(#skin-grad)" />

        {/* Friendly Expressive Smile */}
        <path
          d="M42 59 Q50 67 58 59"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Smile Cheek Highlights */}
        <ellipse cx="37" cy="56" rx="2.5" ry="1.5" fill="#a76856" opacity="0.6" />
        <ellipse cx="63" cy="56" rx="2.5" ry="1.5" fill="#a76856" opacity="0.6" />

        {/* Friendly Scholar Eyes */}
        <ellipse cx="43" cy="48" rx="2.8" ry="3.2" fill="#ffffff" />
        <ellipse cx="57" cy="48" rx="2.8" ry="3.2" fill="#ffffff" />
        <circle cx="43.5" cy="48" r="1.8" fill="#1e293b" />
        <circle cx="57.5" cy="48" r="1.8" fill="#1e293b" />
        <circle cx="44.2" cy="47.2" r="0.7" fill="#ffffff" />
        <circle cx="58.2" cy="47.2" r="0.7" fill="#ffffff" />

        {/* Warm Eyebrows */}
        <path d="M39 42 Q43 40 47 42" stroke="#2c1a15" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M53 42 Q57 40 61 42" stroke="#2c1a15" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Stylish Modern Scholar Glasses (Navy & Sky Blue frames) */}
        <rect x="36" y="44" width="13" height="10" rx="3.5" stroke="#38BDF8" strokeWidth="1.6" fill="rgba(56, 189, 248, 0.12)" />
        <rect x="51" y="44" width="13" height="10" rx="3.5" stroke="#38BDF8" strokeWidth="1.6" fill="rgba(56, 189, 248, 0.12)" />
        <path d="M49 48 L51 48" stroke="#38BDF8" strokeWidth="1.6" strokeLinecap="round" />

        {/* Academic Graduation Mortarboard Cap */}
        {/* Skull Cap Base */}
        <path d="M32 37 C32 29 68 29 68 37 Z" fill="#001827" />
        
        {/* Diamond Mortarboard Top with Gold Trim */}
        <polygon points="50,14 86,27 50,38 14,27" fill="#002138" stroke="#0284c7" strokeWidth="1" />
        <polygon points="50,16 83,27 50,36 17,27" fill="#002b49" />

        {/* Mortarboard Center Button */}
        <circle cx="50" cy="27" r="3" fill="url(#gold-grad)" />

        {/* Academic Gold Tassel swinging to the left */}
        <path
          d="M50 27 Q34 32 32 44"
          stroke="url(#gold-grad)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Tassel Fringe */}
        <polygon points="30,43 34,43 36,52 28,52" fill="url(#gold-grad)" />
      </svg>

      {/* Online / Active Indicator Dot */}
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-xs"></span>
    </div>
  );
};
