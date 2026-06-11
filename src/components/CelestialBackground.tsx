import React, { useMemo } from 'react';

interface CelestialBackgroundProps {
  category?: string | null;
}

export const CelestialBackground: React.FC<CelestialBackgroundProps> = ({ category }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Generate random stars on mount so it's consistent but random
  const stars = useMemo(() => {
    if (!mounted) return [];
    const starArray = [];
    const colors = ['bg-white', 'bg-blue-100', 'bg-indigo-100', 'bg-yellow-100', 'bg-pink-100', 'bg-white', 'bg-white'];
    for (let i = 0; i < 150; i++) {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      // create a mix of many tiny distant stars and a few larger ones
      const isLarge = Math.random() > 0.95;
      const size = isLarge ? (Math.random() * 2 + 2) : (Math.random() * 1.5 + 0.5); 
      const delay = Math.random() * 8; // 0s to 8s delay
      const duration = Math.random() * 4 + 3; // 3s to 7s duration
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      starArray.push({
        id: i,
        top: `${top}%`,
        left: `${left}%`,
        size: `${size}px`,
        delay: `${delay}s`,
        duration: `${duration}s`,
        color,
      });
    }
    return starArray;
  }, []);

  // Theme definition based on selection
  const theme = useMemo(() => {
    // Elegant deep blue-indigo base: from-[#09153a] via-[#1b2b6c] to-[#39296e]
    // Inspired by classic "The Secret of Monkey Island" signature starry sky palette
    const baseBlueBg = '#09153a';
    const monkeyIslandGradient = 'radial-gradient(circle at 50% 85%, #39296e 0%, #1b2b6c 55%, #09153a 100%)';

    switch (category) {
      case 'Natura & Vento':
        return {
          baseBg: baseBlueBg,
          radialGradient: monkeyIslandGradient,
          nebula1Bg: 'radial-gradient(circle, rgba(16, 185, 129, 0.20) 0%, rgba(13, 148, 136, 0.06) 55%, rgba(0,0,0,0) 100%)',
          nebula2Bg: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(8, 47, 73, 0.05) 60%, rgba(0,0,0,0) 100%)',
          nebula3Bg: 'radial-gradient(circle, rgba(20, 184, 166, 0.14) 0%, rgba(13, 148, 136, 0.04) 50%, rgba(0,0,0,0) 100%)'
        };
      case 'Magia & Fiabe':
        return {
          baseBg: baseBlueBg,
          radialGradient: monkeyIslandGradient,
          nebula1Bg: 'radial-gradient(circle, rgba(236, 72, 153, 0.22) 0%, rgba(139, 92, 246, 0.08) 55%, rgba(0,0,0,0) 100%)',
          nebula2Bg: 'radial-gradient(circle, rgba(168, 85, 247, 0.16) 0%, rgba(88, 28, 135, 0.05) 60%, rgba(0,0,0,0) 100%)',
          nebula3Bg: 'radial-gradient(circle, rgba(217, 70, 239, 0.15) 0%, rgba(134, 25, 143, 0.04) 50%, rgba(0,0,0,0) 100%)'
        };
      case 'Avventura & Animali':
        return {
          baseBg: baseBlueBg,
          radialGradient: monkeyIslandGradient,
          nebula1Bg: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(249, 115, 22, 0.06) 55%, rgba(0,0,0,0) 100%)',
          nebula2Bg: 'radial-gradient(circle, rgba(239, 68, 68, 0.14) 0%, rgba(120, 11, 11, 0.04) 60%, rgba(0,0,0,0) 100%)',
          nebula3Bg: 'radial-gradient(circle, rgba(251, 191, 36, 0.14) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 100%)'
        };
      case 'Mare & Relax':
        return {
          baseBg: baseBlueBg,
          radialGradient: monkeyIslandGradient,
          nebula1Bg: 'radial-gradient(circle, rgba(20, 184, 166, 0.20) 0%, rgba(14, 165, 233, 0.08) 55%, rgba(0,0,0,0) 100%)',
          nebula2Bg: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(79, 70, 229, 0.05) 60%, rgba(0,0,0,0) 100%)',
          nebula3Bg: 'radial-gradient(circle, rgba(37, 99, 235, 0.14) 0%, rgba(34, 211, 238, 0.05) 50%, rgba(0,0,0,0) 100%)'
        };
      case 'Stelle & Sogni':
      default:
        return {
          baseBg: baseBlueBg,
          radialGradient: monkeyIslandGradient,
          nebula1Bg: 'radial-gradient(circle, rgba(6, 182, 212, 0.24) 0%, rgba(8, 47, 73, 0.08) 55%, rgba(0,0,0,0) 100%)',
          nebula2Bg: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(30, 27, 75, 0.05) 60%, rgba(0,0,0,0) 100%)',
          nebula3Bg: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(124, 58, 237, 0.04) 50%, rgba(0,0,0,0) 100%)'
        };
    }
  }, [category]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dynamic keyframe styles */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); box-shadow: 0 0 2px rgba(255,255,255,0.2); }
          50% { opacity: 1; transform: scale(1.6); box-shadow: 0 0 12px 3px rgba(255,255,255,0.9); background-color: #fff; }
        }

        @keyframes shooting-star-1 {
          0% {
            transform: translate3d(100px, -100px, 0) rotate(-45deg) scale(0);
            opacity: 0;
            width: 0px;
          }
          5% {
            opacity: 1;
            width: 100px;
            transform: translate3d(0, 0, 0) rotate(-45deg) scale(1);
          }
          15% {
            transform: translate3d(-300px, 300px, 0) rotate(-45deg) scale(0.3);
            opacity: 0;
            width: 0px;
          }
          100% {
            transform: translate3d(-300px, 300px, 0) rotate(-45deg) scale(0);
            opacity: 0;
          }
        }

        @keyframes shooting-star-2 {
          0% {
            transform: translate3d(200px, -50px, 0) rotate(-35deg) scale(0);
            opacity: 0;
            width: 0px;
          }
          3% {
            opacity: 1;
            width: 120px;
            transform: translate3d(0, 0, 0) rotate(-35deg) scale(1);
          }
          12% {
            transform: translate3d(-400px, 280px, 0) rotate(-35deg) scale(0.2);
            opacity: 0;
            width: 0px;
          }
          100% {
            transform: translate3d(-400px, 280px, 0) rotate(-35deg) scale(0);
            opacity: 0;
          }
        }

        @keyframes shooting-star-3 {
          0% {
            transform: translate3d(50px, -150px, 0) rotate(-50deg) scale(0);
            opacity: 0;
            width: 0px;
          }
          8% {
            opacity: 1;
            width: 80px;
            transform: translate3d(0, 0, 0) rotate(-50deg) scale(1.1);
          }
          18% {
            transform: translate3d(-200px, 240px, 0) rotate(-50deg) scale(0);
            opacity: 0;
            width: 0px;
          }
          100% {
            transform: translate3d(-200px, 240px, 0) rotate(-50deg) scale(0);
            opacity: 0;
          }
        }

        .animate-twinkle-star {
          animation: twinkle var(--star-duration, 3s) ease-in-out infinite;
          animation-delay: var(--star-delay, 0s);
        }

        .comet-1 {
          animation: shooting-star-1 14s linear infinite;
        }

        .comet-2 {
          animation: shooting-star-2 19s linear infinite;
          animation-delay: 4s;
        }

        .comet-3 {
          animation: shooting-star-3 25s linear infinite;
          animation-delay: 9s;
        }

        .smooth-bg-transition {
          transition: background 2s ease-in-out, background-color 2s ease-in-out;
        }
      `}</style>

      {/* Main beautiful base color */}
      <div 
        className="absolute inset-0 smooth-bg-transition" 
        style={{ backgroundColor: theme.baseBg }}
      />

      {/* Beautiful deep radial gradient base */}
      <div 
        className="absolute inset-0 smooth-bg-transition"
        style={{
          background: theme.radialGradient,
          opacity: 0.92
        }}
      />

      {/* Nebula Highlights / Colorful Glows in Corners with smooth state crossfading */}
      
      {/* Top Right Corner Nebula */}
      <div 
        className="absolute top-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full filter blur-[120px] pointer-events-none smooth-bg-transition"
        style={{
          background: theme.nebula1Bg
        }}
      />

      {/* Bottom Left Corner glow */}
      <div 
        className="absolute bottom-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full filter blur-[110px] pointer-events-none smooth-bg-transition"
        style={{
          background: theme.nebula2Bg
        }}
      />

      {/* Center ambient glow to light up the backdrop */}
      <div 
        className="absolute top-[20%] left-[20%] w-[60%] h-[40%] rounded-full filter blur-[130px] pointer-events-none opacity-40 mix-blend-color-dodge smooth-bg-transition"
        style={{
          background: theme.nebula3Bg
        }}
      />

      {/* Twinkling Stars Map */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`absolute rounded-full animate-twinkle-star ${star.color} shadow-[0_0_4px_rgba(255,255,255,0.4)]`}
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              '--star-duration': star.duration,
              '--star-delay': star.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Periodic Shooting Stars (Comets with custom linear layouts) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Comet 1: Starts in high top-right corner */}
        <div 
          className="absolute top-[15%] right-[10%] w-[100px] h-[1.5px] bg-gradient-to-l from-white via-indigo-200 to-transparent rounded-full opacity-0 origin-right comet-1 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />

        {/* Comet 2: Starts in center top/right */}
        <div 
          className="absolute top-[5%] right-[35%] w-[120px] h-[2px] bg-gradient-to-l from-white via-pink-200 to-transparent rounded-full opacity-0 origin-right comet-2 shadow-[0_0_10px_rgba(255,255,255,0.9)]"
        />

        {/* Comet 3: Starts in mid right edge */}
        <div 
          className="absolute top-[28%] right-[5%] w-[80px] h-[1.2px] bg-gradient-to-l from-white via-amber-100 to-transparent rounded-full opacity-0 origin-right comet-3 shadow-[0_0_6px_rgba(253,224,71,0.7)]"
        />
      </div>
    </div>
  );
};
