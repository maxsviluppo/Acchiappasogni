"use client";

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  isSparkle: boolean;
  angle?: number;
  speed?: number;
  gravity?: number;
  friction?: number;
}

export const MagicParticlesCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Color definitions
    const silverColors = [
      'rgba(241, 245, 249, 1)', // slate-100
      'rgba(226, 232, 240, 1)', // slate-200
      'rgba(203, 213, 225, 1)', // slate-300
      'rgba(248, 250, 252, 1)', // slate-50
      'rgba(148, 163, 184, 1)', // slate-400 (metallic)
    ];

    const magicColors = [
      '#eab308', // Gold
      '#f43f5e', // Pink Rose
      '#22c55e', // Emerald
      '#a855f7', // Purple
      '#3b82f6', // Sapphire Blue
    ];

    // Frame animation
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      // Draw and update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        if (p.isSparkle) {
          // Exploding burst particle physics
          p.vx *= p.friction ?? 0.96;
          p.vy *= p.friction ?? 0.96;
          p.vy += p.gravity ?? 0.08;
          
          p.x += p.vx;
          p.y += p.vy;
        } else {
          // Trail particle physics: drifting upwards slowly with slight sine horizontal wave
          p.y += p.vy;
          p.x += p.vx + Math.sin(p.y * 0.05) * 0.4;
        }

        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.size <= 0.1) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = p.isSparkle ? 10 : 4;
        ctx.shadowColor = p.color;

        // Draw sparkles as either tiny starry cross shapes or simple circle cores
        if (p.isSparkle && p.size > 2.5) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          // Draw horizontal ray
          ctx.moveTo(p.x - p.size, p.y);
          ctx.lineTo(p.x + p.size, p.y);
          // Draw vertical ray
          ctx.moveTo(p.x, p.y - p.size);
          ctx.lineTo(p.x, p.y + p.size);
          ctx.stroke();

          // Draw center core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Trail sparkles as elegant dual-colored starburst circles
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Tiny warm white core in the center for brilliant shininess
          if (p.size > 1.8) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    // Spawning Silver Trail Particles following pointer
    const handlePointerMove = (x: number, y: number) => {
      const lastPos = lastPosRef.current;
      const dist = lastPos ? Math.hypot(x - lastPos.x, y - lastPos.y) : 0;
      
      // Calculate how many particles to fill gap if moved fast
      const steps = Math.min(Math.floor(dist / 5) + 1, 6);
      
      for (let s = 0; s < steps; s++) {
        const t = steps > 1 ? s / (steps - 1) : 1;
        const px = lastPos ? lastPos.x + (x - lastPos.x) * t : x;
        const py = lastPos ? lastPos.y + (y - lastPos.y) * t : y;

        // Create silver metallic star sparkles
        particlesRef.current.push({
          x: px + (Math.random() - 0.5) * 6,
          y: py + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.5 - Math.random() * 0.8, // Float upwards gently
          size: 1 + Math.random() * 2.8,
          alpha: 0.9 + Math.random() * 0.1,
          decay: 0.015 + Math.random() * 0.015,
          color: silverColors[Math.floor(Math.random() * silverColors.length)],
          isSparkle: false,
        });
      }

      lastPosRef.current = { x, y };
    };

    // Client coordinate listeners
    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onMouseLeave = () => {
      lastPosRef.current = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    // Handle the custom "magic-burst" event for button explosions
    const handleMagicBurst = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number }>;
      const { x, y } = customEvent.detail;

      // Spawn a spectacular circular cloud of magical glowing sparks
      const particleCount = 45 + Math.floor(Math.random() * 15);
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6.5;
        const size = 2 + Math.random() * 4.5;

        particlesRef.current.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5, // slightly upwards explosion vector
          size: size,
          alpha: 1.0,
          decay: 0.012 + Math.random() * 0.012,
          color: magicColors[Math.floor(Math.random() * magicColors.length)],
          isSparkle: true,
          gravity: 0.09 + Math.random() * 0.06,
          friction: 0.94 + Math.random() * 0.03,
        });
      }
    };

    window.addEventListener('magic-burst', handleMagicBurst);

    // Handle the custom "letter-particles" event for letter-focused sparkles
    const handleLetterParticles = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number }>;
      const { x, y } = customEvent.detail;

      // Spawn a small group of elegant sparkling stars rising around the letter coordinate
      const particleCount = 8 + Math.floor(Math.random() * 6);
      const brightGoldColors = ['#f59e0b', '#eab308', '#fef08a', '#ffffff', '#a855f7'];
      for (let i = 0; i < particleCount; i++) {
        const speed = 0.4 + Math.random() * 1.6;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 1.5); // upwards arc
        const size = 1.2 + Math.random() * 2.5;

        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 20, // slightly offset horizontally to frame the letter
          y: y + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          size: size,
          alpha: 1.0,
          decay: 0.01 + Math.random() * 0.015,
          color: brightGoldColors[Math.floor(Math.random() * brightGoldColors.length)],
          isSparkle: true,
          gravity: 0.02,
          friction: 0.98,
        });
      }
    };

    window.addEventListener('letter-particles', handleLetterParticles);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('magic-burst', handleMagicBurst);
      window.removeEventListener('letter-particles', handleLetterParticles);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
