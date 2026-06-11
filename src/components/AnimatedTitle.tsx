import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

export const AnimatedTitle: React.FC = () => {
  const word = "Acchiappasogni";
  const [animatingLetters, setAnimatingLetters] = useState<{ [key: number]: number }>({});
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lastPoofTimeRef = useRef<number>(0);
  const lastSwipedIndexRef = useRef<number | null>(null);

  const triggerLetterAnim = (index: number) => {
    // If already animating heavily, we can still bump it to re-trigger but let's avoid excessive stacking
    setAnimatingLetters(prev => ({
      ...prev,
      [index]: (prev[index] || 0) + 1
    }));

    // Trigger visual particles
    const now = Date.now();
    if (now - lastPoofTimeRef.current > 60) {
      lastPoofTimeRef.current = now;
    }

    // Fire coordinates-based sparkling stars around the letter
    setTimeout(() => {
      const element = letterRefs.current[index];
      if (element) {
        const rect = element.getBoundingClientRect();
        const canvasX = rect.left + rect.width / 2;
        const canvasY = rect.top + rect.height / 2;
        
        // Spawn particles immediately (golden and magical)
        window.dispatchEvent(new CustomEvent('letter-particles', {
          detail: { x: canvasX, y: canvasY }
        }));

        // Delay a secondary small splash at the apex of the spring height stretch!
        setTimeout(() => {
          const updatedRect = element.getBoundingClientRect();
          window.dispatchEvent(new CustomEvent('letter-particles', {
            detail: { x: updatedRect.left + updatedRect.width / 2, y: updatedRect.top - 20 }
          }));
        }, 180);
      }
    }, 15);
  };

  // No automatic random animation

  // For touch screens: detect touch move over letters to "pop" them under the finger
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element && element.id && element.id.startsWith('title-char-')) {
        const idx = parseInt(element.id.replace('title-char-', ''), 10);
        if (!isNaN(idx) && idx !== lastSwipedIndexRef.current) {
          lastSwipedIndexRef.current = idx;
          triggerLetterAnim(idx);
        }
      } else {
        lastSwipedIndexRef.current = null;
      }
    }
  };

  const handleTouchEnd = () => {
    lastSwipedIndexRef.current = null;
  };

  return (
    <h1 
      className="serif-font text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-100 via-rose-100 to-indigo-300 mt-6 leading-normal pb-4 pt-1 drop-shadow-sm select-none flex items-center justify-center gap-0 sm:gap-0.5"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {word.split('').map((char, idx) => {
        // Use a unique key that changes with the animating counter to reset and replay the anim
        const animState = animatingLetters[idx] || 0;
        return (
          <motion.span
            key={`${idx}-${animState}`}
            ref={el => { letterRefs.current[idx] = el; }}
            animate={animState > 0 ? {
              scaleY: [1, 2.15, 0.42, 1.48, 0.72, 1.20, 0.90, 1.05, 1],
              scaleX: [1, 0.45, 1.60, 0.70, 1.30, 0.85, 1.10, 0.95, 1],
              y: [0, -45, 15, -18, 8, -4, 1, 0],
              rotate: [0, -22, 16, -11, 6, -2, 0]
            } : {}}
            transition={{
              duration: 2.3,
              ease: [0.175, 0.885, 0.32, 1.275] // extreme elastic spring custom bezier easing for rubbery rebound
            }}
            onMouseEnter={() => triggerLetterAnim(idx)}
            onTouchStart={() => {
              lastSwipedIndexRef.current = idx;
              triggerLetterAnim(idx);
            }}
            className="inline-block cursor-pointer origin-bottom select-none hover:text-yellow-200 transition-colors duration-100 px-[0.1px] sm:px-[0.3px]"
            id={`title-char-${idx}`}
          >
            {char}
          </motion.span>
        );
      })}
    </h1>
  );
};
