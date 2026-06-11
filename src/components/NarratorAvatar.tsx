import React from 'react';
import { motion } from 'motion/react';

export type AvatarType = 'cricket';

interface NarratorAvatarProps {
  type: AvatarType;
  isPlaying: boolean;
}

export const NarratorAvatar: React.FC<NarratorAvatarProps> = ({ isPlaying }) => {
  const getAvatarName = () => {
    return 'Grillo Saggio';
  };

  const getAvatarDescription = () => {
    return 'Voce saggia, pacata e custode dei sogni dorati';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-3xl border border-indigo-500/10 backdrop-blur-sm shadow-inner relative overflow-hidden group">
      {/* Decorative magical aura background */}
      <div className="absolute inset-0 bg-gradient-to-b opacity-10 transition-colors duration-500 from-emerald-500 to-transparent" />

      {/* Dynamic particles when talking */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-1/4 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" />
          <div className="absolute bottom-2 right-1/4 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 right-4 w-1 h-1 bg-sky-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      )}

      {/* Styled vector avatars */}
      <div className="w-24 h-24 relative flex items-center justify-center z-10">
        
        {/* Animated glow circle behind */}
        <div className={`absolute -inset-2 rounded-full filter blur-md opacity-30 transition-all duration-500 ${
          isPlaying 
            ? 'bg-emerald-400 animate-pulse'
            : 'bg-indigo-500/0'
        }`} />

        <motion.div
          animate={isPlaying ? {
            y: [0, -4, 0],
            scale: [1, 1.05, 1],
            rotate: [0, 1, -1, 0]
          } : {}}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            ease: "easeInOut"
          }}
          className="w-full h-full flex items-center justify-center"
        >
          {/* Adorable cartoon Cricket (Grillo Parlante/Grillo Saggio) */}
          <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-[0_4px_8px_rgba(16,185,129,0.3)]">
            
            {/* Long Curvy antennae (sensitive and magical) */}
            <g className={isPlaying ? 'animate-pulse' : ''}>
              {/* Left antenna */}
              <path d="M42,28 C35,16 20,12 12,18" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="12" cy="18" r="2.5" fill="#a3e635" />
              
              {/* Right antenna */}
              <path d="M58,28 C65,16 80,12 88,18" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="88" cy="18" r="2.5" fill="#a3e635" />
            </g>

            {/* Behind: Cute little wings */}
            <ellipse cx="32" cy="62" rx="6" ry="16" fill="#15803d" opacity="0.8" transform="rotate(-15 32 62)" />
            <ellipse cx="68" cy="62" rx="6" ry="16" fill="#15803d" opacity="0.8" transform="rotate(15 68 62)" />

            {/* Main cricket body split jacket (gentleman cricket look) */}
            <path d="M35,55 L50,85 L65,55 Z" fill="#166534" />
            {/* Golden bow tie */}
            <polygon points="44,57 50,61 56,57 50,53" fill="#eab308" />
            <circle cx="50" cy="57" r="2" fill="#ea580c" />

            {/* Adorable round head */}
            <circle cx="50" cy="42" r="18" fill="#22c55e" />

            {/* Glowing friendly eyes */}
            <circle cx="38" cy="39" r="6" fill="#ffffff" />
            <circle cx="62" cy="39" r="6" fill="#ffffff" />
            
            {/* Big pupils looking slightly inwards (cute cross-eyed anime style) */}
            <circle cx="40" cy="39" r={isPlaying ? '4' : '3.2'} fill="#1e293b" />
            <circle cx="60" cy="39" r={isPlaying ? '4' : '3.2'} fill="#1e293b" />
            
            {/* Pupil glints */}
            <circle cx="39" cy="37" r="1" fill="#ffffff" />
            <circle cx="59" cy="37" r="1" fill="#ffffff" />

            {/* Rosy blush cheeks */}
            <circle cx="32" cy="46" r="2.5" fill="#f43f5e" opacity="0.4" />
            <circle cx="68" cy="46" r="2.5" fill="#f43f5e" opacity="0.4" />

            {/* Smiling / Talking mouth */}
            {isPlaying ? (
              <ellipse cx="50" cy="48" rx="4" ry="5.5" fill="#991b1b" className="animate-bounce" />
            ) : (
              <path d="M45,47 Q50,51 55,47" fill="none" stroke="#14532d" strokeWidth="2" strokeLinecap="round" />
            )}

            {/* Gentle hands resting */}
            <path d="M34,60 Q45,64 48,58" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M66,60 Q55,64 52,58" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />

          </svg>
        </motion.div>
      </div>

      <span className="text-xs font-semibold text-slate-200 mt-2 tracking-wide">
        {getAvatarName()}
      </span>
      <span className="text-[10px] text-slate-400 font-light mt-0.5 text-center px-1 line-clamp-1">
        {getAvatarDescription()}
      </span>
    </div>
  );
};
