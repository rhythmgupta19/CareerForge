import React from 'react';

// Rarity metadata resolver using domain and type context
export const getBadgeMetadata = (badge) => {
  const name = (badge?.name || '').toLowerCase();
  const desc = (badge?.description || '').toLowerCase();
  const type = (badge?.type || '').toLowerCase();

  // 1. Determine Category
  let category = 'Learning';
  if (type === 'streak' || name.includes('streak') || name.includes('days')) {
    category = 'Streaks';
  } else if (type === 'domain-completion' || name.includes('master') || name.includes('survivor')) {
    category = 'Mastery';
  } else if (name.includes('project') || name.includes('playground') || desc.includes('project')) {
    category = 'Projects';
  } else if (name.includes('assessment') || name.includes('case study') || name.includes('certified') || type === 'assessment') {
    category = 'Career';
  }

  // 2. Determine Rarity Class
  let rarity = 'Common';
  if (category === 'Mastery') {
    rarity = 'Legendary';
  } else if (category === 'Career') {
    rarity = 'Epic';
  } else if (type === 'phase-completion') {
    if (name.includes('backend') || name.includes('final') || name.includes('deployment') || name.includes('monitoring') || name.includes('security audit')) {
      rarity = 'Epic';
    } else if (name.includes('react') || name.includes('javascript') || name.includes('sql') || name.includes('docker') || name.includes('kubernetes')) {
      rarity = 'Rare';
    } else {
      rarity = 'Uncommon';
    }
  } else if (type === 'special') {
    if (name.includes('warrior') || name.includes('survivor') || name.includes('wizard') || name.includes('recursion survivor')) {
      rarity = 'Rare';
    } else if (name.includes('explorer') || name.includes('stack explorer')) {
      rarity = 'Uncommon';
    } else {
      rarity = 'Common';
    }
  } else if (type === 'streak') {
    if (name.includes('monthly') || name.includes('30')) {
      rarity = 'Epic';
    } else if (name.includes('weekly') || name.includes('7') || name.includes('5')) {
      rarity = 'Uncommon';
    } else {
      rarity = 'Common';
    }
  }

  // Define rarity styles and tokens
  const rarityConfig = {
    Common: {
      name: 'Common',
      borderClass: 'border-slate-700/80',
      bgGrad: 'from-slate-900 to-slate-950',
      glowColor: 'rgba(100, 116, 139, 0.2)',
      glowFilter: 'drop-shadow-[0_0_6px_rgba(100,116,139,0.15)]',
      textColor: 'text-slate-400',
      badgeBg: 'bg-slate-900/30',
      ringColor: '#475569'
    },
    Uncommon: {
      name: 'Uncommon',
      borderClass: 'border-sky-600/80',
      bgGrad: 'from-sky-950/40 to-slate-950',
      glowColor: 'rgba(2, 132, 199, 0.3)',
      glowFilter: 'drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]',
      textColor: 'text-sky-400',
      badgeBg: 'bg-sky-950/20',
      ringColor: '#0284c7'
    },
    Rare: {
      name: 'Rare',
      borderClass: 'border-amber-500/80',
      bgGrad: 'from-amber-950/40 to-slate-950',
      glowColor: 'rgba(217, 119, 6, 0.45)',
      glowFilter: 'drop-shadow-[0_0_10px_rgba(245,158,11,0.45)]',
      textColor: 'text-amber-400',
      badgeBg: 'bg-amber-950/20',
      ringColor: '#d97706'
    },
    Epic: {
      name: 'Epic',
      borderClass: 'border-emerald-500/80',
      bgGrad: 'from-emerald-950/45 to-slate-950',
      glowColor: 'rgba(16, 185, 129, 0.55)',
      glowFilter: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.55)]',
      textColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/25',
      ringColor: '#10b981'
    },
    Legendary: {
      name: 'Legendary',
      borderClass: 'border-indigo-500/85',
      bgGrad: 'from-indigo-950/50 to-purple-950/50',
      glowColor: 'rgba(99, 102, 241, 0.8)',
      glowFilter: 'drop-shadow-[0_0_15px_rgba(99,102,241,0.7)]',
      textColor: 'text-indigo-400',
      badgeBg: 'bg-indigo-950/30',
      ringColor: '#6366f1'
    }
  };

  return {
    category,
    rarity: rarityConfig[rarity]
  };
};

// Retrieve SVG details & gradients based on tech/slug
const getDomainVisuals = (badge) => {
  const name = (badge?.name || '').toLowerCase();
  const slug = (badge?.domainId?.slug || '').toLowerCase();
  const type = (badge?.type || '').toLowerCase();

  // 1. JavaScript
  if (name.includes('javascript') || name.includes('es6') || name.includes('dom')) {
    return {
      name: 'JavaScript',
      colors: { from: '#facc15', to: '#eab308' },
      icon: (
        <g stroke="url(#jsGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </g>
      ),
      defs: (
        <linearGradient id="jsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      )
    };
  }

  // 2. React.js
  if (name.includes('react')) {
    return {
      name: 'React.js',
      colors: { from: '#38bdf8', to: '#0284c7' },
      icon: (
        <g stroke="url(#reactGrad)" strokeWidth="2" fill="none" strokeLinecap="round">
          <ellipse rx="9" ry="3.5" transform="rotate(0 12 12)" cx="12" cy="12" />
          <ellipse rx="9" ry="3.5" transform="rotate(60 12 12)" cx="12" cy="12" />
          <ellipse rx="9" ry="3.5" transform="rotate(120 12 12)" cx="12" cy="12" />
          <circle cx="12" cy="12" r="1.8" fill="#38bdf8" />
        </g>
      ),
      defs: (
        <linearGradient id="reactGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      )
    };
  }

  // 3. Node.js
  if (name.includes('node') || name.includes('express')) {
    return {
      name: 'Node.js',
      colors: { from: '#22c55e', to: '#15803d' },
      icon: (
        <g stroke="url(#nodeGrad)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 22 7.7 22 16.3 12 22 2 16.3 2 7.7" />
          <circle cx="12" cy="12" r="3" fill="#22c55e" fillOpacity="0.2" />
          <line x1="12" y1="2" x2="12" y2="9" />
          <line x1="2" y1="16.3" x2="9" y2="13.5" />
          <line x1="22" y1="16.3" x2="15" y2="13.5" />
        </g>
      ),
      defs: (
        <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      )
    };
  }

  // 4. MongoDB / Database
  if (name.includes('mongodb') || name.includes('database') || name.includes('sql')) {
    return {
      name: 'Databases',
      colors: { from: '#10b981', to: '#047857' },
      icon: (
        <g stroke="url(#dbGrad)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />
          <path d="M12 8c2.5 0 5-.5 5-1.5S14.5 5 12 5s-5 .5-5 1.5S9.5 8 12 8z" fill="#10b981" fillOpacity="0.15" />
        </g>
      ),
      defs: (
        <linearGradient id="dbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      )
    };
  }

  // 5. DSA
  if (slug === 'dsa' || name.includes('dsa') || name.includes('recursion') || name.includes('tree') || name.includes('array') || name.includes('stack')) {
    return {
      name: 'DSA',
      colors: { from: '#8b5cf6', to: '#6366f1' },
      icon: (
        <g stroke="url(#dsaGrad)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2.5" fill="#8b5cf6" fillOpacity="0.3" />
          <circle cx="6" cy="14" r="2.5" fill="#8b5cf6" fillOpacity="0.3" />
          <circle cx="18" cy="14" r="2.5" fill="#8b5cf6" fillOpacity="0.3" />
          <line x1="10.5" y1="7.2" x2="7.5" y2="11.8" />
          <line x1="13.5" y1="7.2" x2="16.5" y2="11.8" />
          <path d="M12 14v4a2 2 0 0 0 2 2h2" />
        </g>
      ),
      defs: (
        <linearGradient id="dsaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      )
    };
  }

  // 6. DevOps
  if (slug === 'devops' || name.includes('devops') || name.includes('docker') || name.includes('kubernetes')) {
    return {
      name: 'DevOps',
      colors: { from: '#f97316', to: '#ef4444' },
      icon: (
        <g stroke="url(#devopsGrad)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42 0-.83.07-1.22.2A6 6 0 0 0 3 11.5c0 3.4 2.6 6 6 6" />
          <circle cx="12" cy="15" r="2.5" />
          <path d="M12 11v1 M12 17v1 M8.5 13.5l.7.7 M14.8 15.8l.7.7 M8.5 16.5l.7-.7 M14.8 14.2l.7-.7" />
        </g>
      ),
      defs: (
        <linearGradient id="devopsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      )
    };
  }

  // 7. AI/ML
  if (slug === 'ai-ml' || name.includes('ai/') || name.includes('neural') || name.includes('deep learning')) {
    return {
      name: 'AI/ML',
      colors: { from: '#ec4899', to: '#a855f7' },
      icon: (
        <g stroke="url(#aiGrad)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="4" cy="12" r="2.2" fill="#ec4899" />
          <circle cx="12" cy="5" r="2.2" fill="#ec4899" />
          <circle cx="12" cy="12" r="2.2" fill="#ec4899" />
          <circle cx="12" cy="19" r="2.2" fill="#ec4899" />
          <circle cx="20" cy="8" r="2.2" fill="#ec4899" />
          <circle cx="20" cy="16" r="2.2" fill="#ec4899" />
          <line x1="5.8" y1="11" x2="10.2" y2="6" />
          <line x1="6" y1="12" x2="10" y2="12" />
          <line x1="5.8" y1="13" x2="10.2" y2="18" />
          <line x1="13.8" y1="6" x2="18.2" y2="7.5" />
          <line x1="13.8" y1="11" x2="18.2" y2="8.5" />
          <line x1="13.8" y1="13" x2="18.2" y2="15.5" />
          <line x1="13.8" y1="18" x2="18.2" y2="16.5" />
        </g>
      ),
      defs: (
        <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      )
    };
  }

  // 8. Cybersecurity
  if (slug === 'cybersecurity' || name.includes('security') || name.includes('hacking')) {
    return {
      name: 'Cybersecurity',
      colors: { from: '#6366f1', to: '#4f46e5' },
      icon: (
        <g stroke="url(#cyberGrad)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#6366f1" fillOpacity="0.1" />
          <circle cx="12" cy="11" r="2.2" />
          <path d="M12 13.2v2.8 M10 16h4" />
        </g>
      ),
      defs: (
        <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      )
    };
  }

  // 9. UI/UX
  if (slug === 'ui-ux' || name.includes('ui-ux') || name.includes('design')) {
    return {
      name: 'UI/UX Design',
      colors: { from: '#d946ef', to: '#db2777' },
      icon: (
        <g stroke="url(#uiGrad)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" fill="#d946ef" fillOpacity="0.15" />
          <circle cx="12" cy="12" r="2" />
        </g>
      ),
      defs: (
        <linearGradient id="uiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d946ef" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      )
    };
  }

  // 10. Web Development (Generic/HTML/CSS)
  if (slug === 'web-development' || name.includes('web-development') || name.includes('webdev') || name.includes('html') || name.includes('css')) {
    return {
      name: 'Web Development',
      colors: { from: '#06b6d4', to: '#4f46e5' },
      icon: (
        <g stroke="url(#webGrad)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <line x1="2" y1="8" x2="22" y2="8" />
          <polyline points="7 12 4 15 7 18" />
          <polyline points="17 12 20 15 17 18" />
          <line x1="13" y1="11" x2="11" y2="19" />
        </g>
      ),
      defs: (
        <linearGradient id="webGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      )
    };
  }

  // 11. Streaks / Action Flame
  if (type === 'streak' || name.includes('streak') || name.includes('days')) {
    return {
      name: 'Streak Flame',
      colors: { from: '#f43f5e', to: '#fb923c' },
      icon: (
        <g stroke="url(#streakGrad)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" fill="url(#streakGrad)" fillOpacity="0.15" />
        </g>
      ),
      defs: (
        <linearGradient id="streakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      )
    };
  }

  // 12. Generic / Achievement Medal
  return {
    name: 'Achievement',
    colors: { from: '#3b82f6', to: '#1d4ed8' },
    icon: (
      <g stroke="url(#genericGrad)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <polyline points="9 13 7 22 12 19 17 22 15 13" />
      </g>
    ),
    defs: (
      <linearGradient id="genericGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    )
  };
};

const BadgeVisual = ({ badge, size = 'md', locked = false }) => {
  const { rarity } = getBadgeMetadata(badge);
  const domain = getDomainVisuals(badge);

  // Dimensions mapping
  const sizeMap = {
    sm: { box: 'w-12 h-12', svg: 48, strokeWidth: 1.5, text: 'text-[9px]' },
    md: { box: 'w-20 h-20', svg: 80, strokeWidth: 2, text: 'text-xs' },
    lg: { box: 'w-28 h-28', svg: 112, strokeWidth: 2.5, text: 'text-sm' },
    xl: { box: 'w-36 h-36', svg: 144, strokeWidth: 3, text: 'text-base' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Render progression outer borders/frames
  const renderBadgeFrame = () => {
    const s = currentSize.svg;
    const borderCol = rarity.ringColor;
    const mid = s / 2;

    if (rarity.name === 'Legendary') {
      // Diamond starburst frame for Master level
      return (
        <g stroke={borderCol} strokeWidth={currentSize.strokeWidth + 1} fill="none" className="animate-[spin_40s_linear_infinite]">
          <polygon points={`${mid},2.5 ${s-2.5},${mid} ${mid},${s-2.5} 2.5,${mid}`} />
          <polygon points={`${mid},6 ${s-6},${mid} ${mid},${s-6} 6,${mid}`} strokeDasharray="3,3" />
          <circle cx={mid} cy={mid} r={mid - 8} strokeWidth={1} />
        </g>
      );
    }

    if (rarity.name === 'Epic') {
      // Octagonal frame for Expert level
      const d1 = s * 0.28;
      const d2 = s * 0.72;
      return (
        <g stroke={borderCol} strokeWidth={currentSize.strokeWidth} fill="none" className="animate-[pulse_3s_ease-in-out_infinite]">
          <polygon points={`${d1},2 ${d2},2 ${s-2},${d1} ${s-2},${d2} ${d2},${s-2} ${d1},${s-2} 2,${d2} 2,${d1}`} />
          <circle cx={mid} cy={mid} r={mid - 6} strokeWidth={1} strokeDasharray="2,2" />
        </g>
      );
    }

    if (rarity.name === 'Rare') {
      // Ornate Hexagonal shield for Advanced level
      return (
        <g stroke={borderCol} strokeWidth={currentSize.strokeWidth} fill="none">
          <polygon points={`${mid},2.5 ${s-2.5},${s*0.25} ${s-2.5},${s*0.75} ${mid},${s-2.5} 2.5,${s*0.75} 2.5,${s*0.25}`} />
          <polygon points={`${mid},6.5 ${s-6.5},${s*0.27} ${s-6.5},${s*0.73} ${mid},${s-6.5} 6.5,${s*0.73} 6.5,${s*0.27}`} strokeWidth={0.8} strokeDasharray="4,2" />
        </g>
      );
    }

    if (rarity.name === 'Uncommon') {
      // Square round-corner frame for Intermediate level
      return (
        <g stroke={borderCol} strokeWidth={currentSize.strokeWidth} fill="none">
          <rect x="3" y="3" width={s - 6} height={s - 6} rx="8" />
          <circle cx={mid} cy={mid} r={mid - 5} strokeWidth={0.8} />
        </g>
      );
    }

    // Common: Simple clean circle
    return (
      <g stroke={borderCol} strokeWidth={currentSize.strokeWidth - 0.5} fill="none">
        <circle cx={mid} cy={mid} r={mid - 3.5} />
      </g>
    );
  };

  return (
    <div 
      className={`relative ${currentSize.box} rounded-full flex items-center justify-center transition-all duration-300 ${locked ? 'grayscale opacity-35 hover:opacity-50' : 'hover:scale-105'} select-none`}
      style={{
        background: `radial-gradient(circle, ${rarity.glowColor} 0%, transparent 75%)`
      }}
    >
      {/* Glow aura */}
      {!locked && (
        <div 
          className={`absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none`}
          style={{ boxShadow: `0 0 18px ${rarity.ringColor}` }}
        />
      )}

      {/* Main SVG Badge */}
      <svg 
        width={currentSize.svg} 
        height={currentSize.svg} 
        viewBox={`0 0 ${currentSize.svg} ${currentSize.svg}`}
        className={`relative z-10 ${!locked ? rarity.glowFilter : ''}`}
      >
        <defs>
          {domain.defs}
          {/* Inner radial gradient */}
          <radialGradient id="innerBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
          </radialGradient>
        </defs>

        {/* Shield Background */}
        <circle 
          cx={currentSize.svg / 2} 
          cy={currentSize.svg / 2} 
          r={(currentSize.svg / 2) - 4} 
          fill="url(#innerBg)" 
        />

        {/* Outer Visual Frame */}
        {renderBadgeFrame()}

        {/* Central Icon container */}
        <g transform={`translate(${currentSize.svg * 0.2}, ${currentSize.svg * 0.2}) scale(${currentSize.svg * 0.6 / 24})`}>
          {domain.icon}
        </g>

        {/* Locked Lock Icon */}
        {locked && (
          <g transform={`translate(${(currentSize.svg / 2) - 6}, ${(currentSize.svg / 2) - 6}) scale(0.5)`} fill="#64748b" stroke="#020617" strokeWidth="2">
            <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 0 1 6 0v3H9z" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default BadgeVisual;
