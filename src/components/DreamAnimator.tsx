import React from 'react';
import { motion } from 'motion/react';

interface DreamAnimatorProps {
  isPlaying?: boolean;
  pulseSpeed?: number;
}

export const DreamAnimator: React.FC<DreamAnimatorProps> = ({ isPlaying = false, pulseSpeed = 1 }) => {
  const handleInteract = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX = 0;
    let clientY = 0;
    
    if ('clientX' in e && e.clientX !== 0) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if ('touches' in e && e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    if (clientX && clientY) {
      // Dispatch magical shining star dust at coordination point
      window.dispatchEvent(new CustomEvent('letter-particles', {
        detail: { x: clientX, y: clientY }
      }));
    }
  };

  return (
    <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto flex items-center justify-center pointer-events-none selective-glow">
      {/* CSS For Keyframe Animations */}
      <style>{`
        @keyframes swing-feather-left {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes swing-feather-center {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes swing-feather-right {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes float-dream {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes twinkle-star {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes drift-cloud-slow {
          0% { transform: translateX(-15px) translateY(0); }
          50% { transform: translateX(15px) translateY(2px); }
          100% { transform: translateX(-15px) translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.4; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(0.95); opacity: 0.4; }
        }
        .animate-swing-left { animation: swing-feather-left 3s ease-in-out infinite; transform-origin: top center; }
        .animate-swing-center { animation: swing-feather-center 3.5s ease-in-out infinite; transform-origin: top center; }
        .animate-swing-right { animation: swing-feather-right 2.8s ease-in-out infinite; transform-origin: top center; }
        .animate-float { animation: float-dream 5s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle-star 2s ease-in-out infinite; }
        .animate-drift { animation: drift-cloud-slow 8s ease-in-out infinite; }
        .animate-pulse-ring { animation: pulse-ring 4s ease-in-out infinite; }
      `}</style>

      {/* Cloud 1 in the background */}
      <div className="absolute top-12 -left-4 text-indigo-300/20 w-16 h-8 animate-drift">
        <svg viewBox="0 0 100 50" fill="currentColor">
          <path d="M20,40 C10,40 5,30 15,20 C10,10 30,5 45,15 C55,5 75,10 75,25 C85,25 90,35 80,42 C80,45 20,45 20,40 Z" />
        </svg>
      </div>

      {/* Cloud 2 in the background */}
      <div className="absolute bottom-16 -right-6 text-pink-300/10 w-24 h-12 [animation-delay:2s] animate-drift">
        <svg viewBox="0 0 100 50" fill="currentColor">
          <path d="M20,40 C10,40 5,30 15,20 C10,10 30,5 45,15 C55,5 75,10 75,25 C85,25 90,35 80,42 L20,40 Z" />
        </svg>
      </div>

      {/* Pulsing Aura */}
      <div className={`absolute w-56 h-56 rounded-full bg-violet-500/10 filter blur-xl transition-all duration-1000 ${
        isPlaying ? 'scale-125 opacity-100 bg-rose-500/15' : 'scale-100 opacity-60'
      } animate-pulse-ring`} />

      {/* Twinkling Stars */}
      <div className="absolute top-4 left-10 text-yellow-200 animate-twinkle text-lg">✦</div>
      <div className="absolute top-2 right-12 text-pink-200 animate-twinkle [animation-delay:0.7s] text-sm">✦</div>
      <div className="absolute bottom-12 left-12 text-blue-200 animate-twinkle [animation-delay:1.4s] text-xs">✦</div>
      <div className="absolute bottom-20 right-14 text-yellow-100 animate-twinkle [animation-delay:0.3s] text-lg">✦</div>

      <div className="animate-float flex flex-col items-center">
        <svg 
          width="180" 
          height="320" 
          viewBox="0 0 180 320" 
          className="drop-shadow-[0_15px_30px_rgba(168,85,247,0.3)] pointer-events-auto cursor-pointer"
          style={{ transform: isPlaying ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.5s' }}
        >
          {/* Main Dreamcatcher Circle Frame */}
          <circle 
            cx="90" 
            cy="100" 
            r="65" 
            fill="none" 
            stroke="url(#dreamcatcher-gradient)" 
            strokeWidth="10" 
            strokeLinecap="round"
          />
          {/* Inner ring edge */}
          <circle 
            cx="90" 
            cy="100" 
            r="58" 
            fill="none" 
            stroke="#a78bfa" 
            strokeWidth="1.5" 
            strokeDasharray="4 6" 
          />

          {/* Classic Authentic Dreamcatcher Web Pattern */}
          <path 
            d="M90 35 L129 123 L35 75 L145 75 L51 123 Z M90 45 L115 110 L50 85 L130 85 L65 110 Z" 
            fill="none" 
            stroke="url(#star-web-gradient)" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.9"
          />
          <circle cx="90" cy="100" r="15" fill="none" stroke="#fbcfe8" strokeWidth="1" opacity="0.6"/>

          {/* Glowing Center Crystal / Gem instead of cartoon moon */}
          <g transform="translate(90, 100)">
            <circle cx="0" cy="0" r="8" fill="url(#dreamcatcher-gradient)" className="animate-pulse" />
            <circle cx="0" cy="0" r="4" fill="#ffffff" className="drop-shadow-[0_0_10px_rgba(255,255,255,1)]" />
            <path d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill="#fef08a" className="animate-twinkle" />
          </g>

          {/* Beads holding the Feathers */}
          {/* Left bead */}
          <circle cx="45" cy="155" r="5" fill="#f472b6" />
          <circle cx="45" cy="162" r="4" fill="#6366f1" />
          {/* Center bead */}
          <circle cx="90" cy="168" r="6" fill="#fbcfe8" />
          <circle cx="90" cy="177" r="4" fill="#fcd34d" />
          {/* Right bead */}
          <circle cx="135" cy="155" r="5" fill="#f472b6" />
          <circle cx="135" cy="162" r="4" fill="#38bdf8" />

          {/* Hanging string lines */}
          <line x1="45" y1="150" x2="45" y2="180" stroke="#fbcfe8" strokeWidth="2" />
          <line x1="90" y1="165" x2="90" y2="195" stroke="#fbcfe8" strokeWidth="2.5" />
          <line x1="135" y1="150" x2="135" y2="180" stroke="#fbcfe8" strokeWidth="2" />

          {/* Detailed Cartoon Feathers with swinging anims (embedded through SVG classes) */}
          
          {/* Left Feather */}
          <motion.g 
            className="animate-swing-left" 
            style={{ transformOrigin: '45px 180px' }}
            whileHover={{ 
              rotate: [-5, 20, -20, 12, -8, 4, 0],
              scale: 1.12,
              transition: { duration: 1.2 }
            }}
            whileTap={{ scale: 0.95 }}
            onMouseMove={handleInteract}
            onTouchStart={handleInteract}
          >
            {/* Feather fluff background for body */}
            <path 
              d="M45 180 C30 195 25 220 45 240 C65 220 60 195 45 180 Z" 
              fill="url(#feather-left-grad)" 
              opacity="0.95"
            />
            {/* Quill line */}
            <line x1="45" y1="180" x2="45" y2="235" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M35 200 L45 205 M55 205 L45 210 M32 215 L45 218 M58 220 L45 223" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
          </motion.g>

          {/* Center Feather (Largest & Special) */}
          <motion.g 
            className="animate-swing-center" 
            style={{ transformOrigin: '90px 195px' }}
            whileHover={{ 
              rotate: [-2, 25, -25, 14, -10, 5, 0],
              scale: 1.15,
              transition: { duration: 1.4 }
            }}
            whileTap={{ scale: 0.95 }}
            onMouseMove={handleInteract}
            onTouchStart={handleInteract}
          >
            <path 
              d="M90 195 C70 215 65 250 90 275 C115 250 110 215 90 195 Z" 
              fill="url(#feather-center-grad)" 
              opacity="0.98"
            />
            <line x1="90" y1="195" x2="90" y2="268" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <path d="M78 220 L90 225 M102 225 L90 230 M75 238 L90 242 M105 242 L90 246 M78 252 L90 255" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          </motion.g>

          {/* Right Feather */}
          <motion.g 
            className="animate-swing-right" 
            style={{ transformOrigin: '135px 180px' }}
            whileHover={{ 
              rotate: [-6, 20, -20, 12, -8, 4, 0],
              scale: 1.12,
              transition: { duration: 1.2 }
            }}
            whileTap={{ scale: 0.95 }}
            onMouseMove={handleInteract}
            onTouchStart={handleInteract}
          >
            <path 
              d="M135 180 C120 195 115 220 135 240 C155 220 150 195 135 180 Z" 
              fill="url(#feather-right-grad)" 
              opacity="0.95"
            />
            <line x1="135" y1="180" x2="135" y2="235" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M125 200 L135 205 M145 205 L135 210 M122 215 L135 218 M148 220 L135 223" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
          </motion.g>

          {/* Definitions of beautiful magical gradients */}
          <defs>
            <linearGradient id="dreamcatcher-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f39c12" /> {/* Warm Wooden gold */}
              <stop offset="35%" stopColor="#db2777" /> {/* Magical magenta */}
              <stop offset="70%" stopColor="#7c3aed" /> {/* Dark violet */}
              <stop offset="100%" stopColor="#4f46e5" /> {/* Indigo */}
            </linearGradient>
            
            <linearGradient id="star-web-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="50%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>

            <linearGradient id="feather-left-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <linearGradient id="feather-center-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>

            <linearGradient id="feather-right-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
