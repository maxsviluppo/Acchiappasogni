import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Clock, Play, BookOpen, Heart, Bell } from 'lucide-react';
import { Fiaba } from '../data/fiabe';
import Image from 'next/image';

interface StoryCardProps {
  story: Fiaba;
  onSelect: (story: Fiaba) => void;
  isActive: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  isScheduled?: boolean;
  onToggleReminder?: (e: React.MouseEvent) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ 
  story, 
  onSelect, 
  isActive, 
  isFavorite = false, 
  onToggleFavorite,
  isScheduled = false,
  onToggleReminder
}) => {
  
  // Render specific rich visual covers representing the stories
  const renderCoverIllustration = () => {
    switch (story.illustrationType) {
      case 'star': // Celeste - Star who feared the dark
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f2b] via-[#141b4e] to-[#201c56] overflow-hidden">
            {/* Stars background */}
            <div className="absolute top-4 left-6 text-yellow-200/40 text-xs animate-pulse">✦</div>
            <div className="absolute top-12 right-12 text-blue-200/30 text-lg animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
            <div className="absolute bottom-24 left-16 text-pink-200/30 text-sm animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
            
            {/* Golden moon */}
            <svg className="absolute right-6 top-6 w-14 h-14 opacity-80" viewBox="0 0 100 100">
              <path d="M40,10 C65,10 85,28 85,55 C80,55 70,50 63,40 C55,55 58,78 72,88 C50,88 30,75 30,50 C30,28 35,15 40,10 Z" fill="#fef08a" />
            </svg>

            {/* Glowing cute star Celeste */}
            <div className="absolute inset-0 flex items-center justify-center -translate-y-6">
              <div className="relative">
                <div className="absolute -inset-8 bg-yellow-400/20 rounded-full filter blur-xl animate-pulse" />
                <svg className="w-24 h-24 drop-shadow-[0_0_12px_rgba(253,224,71,0.6)]" viewBox="0 0 100 100">
                  <path 
                    d="M50 5 L63 35 L95 38 L70 60 L78 92 L50 75 L22 92 L30 60 L5 38 L37 35 Z" 
                    fill="#fef08a" 
                    stroke="#fbbf24" 
                    strokeWidth="2" 
                    strokeLinejoin="round"
                  />
                  {/* Cute cartoon expression */}
                  <circle cx="40" cy="45" r="3" fill="#1e293b" />
                  <circle cx="60" cy="45" r="3" fill="#1e293b" />
                  <path d="M45 54 Q50 58 55 54" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="36" cy="49" r="2" fill="#ec4899" opacity="0.6"/>
                  <circle cx="64" cy="49" r="2" fill="#ec4899" opacity="0.6"/>
                </svg>
              </div>
            </div>
          </div>
        );

      case 'cloud': // Nuvolina - The Lazy Cloud
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-[#09153a] via-[#1b2b6c] to-[#39296e] overflow-hidden">
            {/* Stars background */}
            <div className="absolute top-8 left-8 text-white/30 text-sm animate-pulse">✦</div>
            <div className="absolute bottom-28 right-8 text-indigo-200/40 text-xs animate-pulse" style={{ animationDelay: '0.8s' }}>✦</div>
            
            {/* Wind breeze lines */}
            <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 200 200">
              <path d="M 10 110 Q 40 100 70 120 T 150 110" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 5"/>
              <path d="M 30 130 Q 70 115 100 135 T 180 125" fill="none" stroke="#a5f3fc" strokeWidth="1" strokeLinecap="round"/>
            </svg>

            {/* Cute puffy cloud Nuvolina */}
            <div className="absolute inset-0 flex items-center justify-center -translate-y-6">
              <div className="relative">
                <div className="absolute -inset-10 bg-sky-400/10 rounded-full filter blur-xl animate-pulse" />
                <svg className="w-28 h-20 drop-shadow-[0_8px_16px_rgba(255,255,255,0.2)]" viewBox="0 0 120 80" fill="#e0f2fe">
                  <path d="M30 60 C15 60 5 50 5 35 C5 20 20 15 30 20 C35 10 55 5 70 15 C85 5 105 10 105 25 C115 25 120 35 115 48 C115 55 105 60 95 60 Z" />
                  {/* Cute sleeping cartoon eyes */}
                  <path d="M42 35 Q47 38 50 35" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                  <path d="M70 35 Q75 38 78 35" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                  <path d="M57 44 Q60 42 63 44" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="39" cy="38" r="2.5" fill="#f43f5e" opacity="0.4" />
                  <circle cx="81" cy="38" r="2.5" fill="#f43f5e" opacity="0.4" />
                </svg>
              </div>
            </div>
          </div>
        );

      case 'flower': // Garden of Singing Flowers
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1e2f] via-[#211239] to-[#36102a] overflow-hidden">
            {/* Floating magical spores */}
            <div className="absolute top-6 left-12 w-2 h-2 rounded-full bg-pink-400/40 animate-ping" />
            <div className="absolute top-24 right-16 w-1.5 h-1.5 rounded-full bg-purple-300/40 animate-ping" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-28 left-8 w-2 h-2 rounded-full bg-yellow-200/30 animate-pulse" style={{ animationDelay: '0.5s' }} />

            {/* Glowing magic flower */}
            <div className="absolute inset-0 flex items-center justify-center -translate-y-6">
              <div className="relative">
                <div className="absolute -inset-10 bg-rose-500/15 rounded-full filter blur-xl animate-pulse" />
                <svg className="w-24 h-24 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-bounce" style={{ animationDuration: '4s' }} viewBox="0 0 100 100">
                  {/* Stem and leaves */}
                  <path d="M50 55 L50 90" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                  <path d="M50 70 Q35 65 32 60" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M50 78 Q65 73 68 68" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
                  
                  {/* Flower Petals */}
                  <circle cx="50" cy="50" r="14" fill="#f43f5e" />
                  <circle cx="50" cy="27" r="13" fill="#fda4af" />
                  <circle cx="50" cy="73" r="13" fill="#fda4af" />
                  <circle cx="27" cy="50" r="13" fill="#fda4af" />
                  <circle cx="73" cy="50" r="13" fill="#fda4af" />
                  <circle cx="34" cy="34" r="12" fill="#fda4af" />
                  <circle cx="66" cy="34" r="12" fill="#fda4af" />
                  <circle cx="34" cy="66" r="12" fill="#fda4af" />
                  <circle cx="66" cy="66" r="12" fill="#fda4af" />
                  
                  {/* Happy inside */}
                  <circle cx="50" cy="50" r="11" fill="#fef08a" />
                  <circle cx="45" cy="47" r="1.5" fill="#78350f" />
                  <circle cx="55" cy="47" r="1.5" fill="#78350f" />
                  <path d="M47 52 Q50 55 53 52" fill="none" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        );

      case 'owl': // Saggio gufo Barnaba
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-[#061e1b] via-[#0d2a23] to-[#24250c] overflow-hidden">
            {/* Stars background */}
            <div className="absolute top-10 right-10 text-yellow-300/30 text-xs animate-pulse">✦</div>
            <div className="absolute bottom-24 left-10 text-white/20 text-sm animate-pulse" style={{ animationDelay: '1.2s' }}>✦</div>

            {/* Tree Branch line */}
            <svg className="absolute bottom-16 left-0 w-full h-10 opacity-60" viewBox="0 0 200 40">
              <path d="M 0 20 Q 80 15 200 35" fill="none" stroke="#78350f" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M 60 18 Q 45 5 40 8" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            {/* Cute owl Barnaba */}
            <div className="absolute inset-0 flex items-center justify-center -translate-y-8">
              <div className="relative">
                <div className="absolute -inset-10 bg-amber-400/5 rounded-full filter blur-xl" />
                <svg className="w-20 h-24 drop-shadow-[0_4px_12px_rgba(120,53,4,0.3)]" viewBox="0 0 100 120">
                  {/* Ears/horns */}
                  <path d="M25 40 L35 25 L45 35" fill="#78350f" />
                  <path d="M75 40 L65 25 L55 35" fill="#78350f" />
                  {/* Body */}
                  <rect x="25" y="32" width="50" height="60" rx="25" fill="#92400e" />
                  {/* Chest feathers */}
                  <rect x="35" y="55" width="30" height="30" rx="15" fill="#fef3c7" />
                  {/* Cute sleepy eyes with glass circles */}
                  <circle cx="39" cy="48" r="10" fill="none" stroke="#fef08a" strokeWidth="2.5" />
                  <circle cx="61" cy="48" r="10" fill="none" stroke="#fef08a" strokeWidth="2.5" />
                  <line x1="49" y1="48" x2="51" y2="48" stroke="#fef08a" strokeWidth="2" />
                  {/* Closed eyelashes inside glasses */}
                  <path d="M35 48 Q39 51 43 48" fill="none" stroke="#312e81" strokeWidth="2" strokeLinecap="round" />
                  <path d="M57 48 Q61 51 65 48" fill="none" stroke="#312e81" strokeWidth="2" strokeLinecap="round" />
                  {/* Orange Beak */}
                  <polygon points="50,53 46,58 54,58" fill="#f97316" />
                </svg>
              </div>
            </div>
          </div>
        );

      case 'dolphin': // Kai - the Moon Dolphin
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-[#031525] via-[#092c43] to-[#124b61] overflow-hidden">
            {/* Water waves */}
            <svg className="absolute bottom-16 left-0 w-full h-16 opacity-45" viewBox="0 0 200 80">
              <path d="M 0 50 Q 50 30 100 50 T 200 50 L 200 80 L 0 80 Z" fill="#0c4a6e" />
              <path d="M 0 58 Q 50 42 100 58 T 200 58 L 200 80 L 0 80 Z" fill="#024361" opacity="0.7" />
            </svg>

            {/* Glowing moon reflections */}
            <div className="absolute top-4 left-6 text-yellow-300 text-lg animate-pulse">✦</div>

            {/* Beautiful cartoon jumping dolphin */}
            <div className="absolute inset-0 flex items-center justify-center -translate-y-8">
              <div className="relative">
                <div className="absolute -inset-10 bg-teal-400/10 rounded-full filter blur-xl animate-pulse" />
                <svg className="w-24 h-24 drop-shadow-[0_4px_12px_rgba(45,212,191,0.2)]" viewBox="0 0 100 100">
                  {/* Crescent curve body */}
                  <path 
                    d="M 15 65 Q 40 20 85 45 Q 65 30 35 60 C 25 70 18 73 15 65 Z" 
                    fill="#e0f2fe" 
                    stroke="#38bdf8" 
                    strokeWidth="1.5"
                  />
                  {/* Fin */}
                  <path d="M 46 38 Q 45 20 38 28 Z" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Tail fins */}
                  <path d="M 14 62 L 5 57 L 10 68 Z" fill="#bae6fd" />
                  {/* Sleepy eye */}
                  <path d="M 68 40 Q 72 42 74 39" fill="none" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-[#11112b] to-[#1d123d] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center -translate-y-6">
              <Sparkles className="w-16 h-16 text-indigo-400/50 animate-pulse" />
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden cursor-pointer rounded-[2.5rem] transition-all border group ${
        isActive
          ? 'border-pink-500 shadow-[0_12px_35px_rgba(236,72,153,0.25)] ring-2 ring-pink-500/20'
          : 'border-slate-800 hover:border-violet-500/40 shadow-xl'
      }`}
      onClick={() => onSelect(story)}
    >
      {/* Bookmark / Favorite Toggle Button */}
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e);
          }}
          className={`absolute top-5 right-5 z-20 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
            isFavorite 
              ? 'bg-rose-500 text-white border-rose-400 shadow-[0_4px_12px_rgba(244,63,94,0.3)] hover:scale-110 active:scale-95' 
              : 'bg-slate-950/40 text-slate-300 border-white/10 hover:bg-slate-900/60 hover:text-rose-400 hover:scale-105 active:scale-95'
          }`}
          title={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
        >
          <Heart className={`w-4 h-4 transition-transform duration-300 ${isFavorite ? 'fill-current scale-110' : ''}`} />
        </button>
      )}

      {/* Bedtime Reminder Toggle Button */}
      {onToggleReminder && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleReminder(e);
          }}
          className={`absolute top-5 left-5 z-20 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
            isScheduled 
              ? 'bg-amber-500 text-white border-amber-400 shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:scale-110 active:scale-95' 
              : 'bg-slate-950/40 text-slate-300 border-white/10 hover:bg-slate-900/60 hover:text-amber-400 hover:scale-105 active:scale-95'
          }`}
          title={isScheduled ? "Annulla promemoria per stasera" : "Ricordami stasera (Notifica della buonanotte)"}
        >
          <Bell className={`w-4 h-4 transition-transform duration-300 ${isScheduled ? 'animate-bounce text-yellow-300' : ''}`} />
        </button>
      )}

      {/* 1. MAIN COVER PHOTO (Beautiful vector illustration template or custom image) */}
      {story.coverImage ? (
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src={story.coverImage} 
            alt={`Copertina di ${story.title}`} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-slate-900/20 mix-blend-overlay" />
        </div>
      ) : (
        renderCoverIllustration()
      )}

      {/* 2. COVER TITLE & GRADIENT OVERLAY */}
      <div className="absolute inset-x-0 bottom-0 top-[35%] bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end p-5 select-text">
        
        {/* Glow point behind active state */}
        {isActive && (
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full filter blur-xl animate-pulse pointer-events-none" />
        )}

        {/* Duration — small and unobtrusive top of overlay */}
        <div className="flex items-center gap-1 mb-2">
          <Clock className="w-3 h-3 text-white/40" />
          <span className="text-[10px] text-white/40 font-light tracking-widest uppercase">{story.duration}</span>
          {isActive && <Sparkles className="w-3 h-3 text-yellow-300 animate-spin ml-1" />}
        </div>

        {/* Title */}
        <h3 className="serif-font text-xl sm:text-2xl font-light text-white leading-snug tracking-tight mb-1.5">
          {story.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-white/50 font-light leading-relaxed line-clamp-2 mb-4">
          {story.description}
        </p>

        {/* Bottom row: category label left, arrow right */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/35 uppercase tracking-widest font-medium">
            {story.category}
          </span>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            isActive 
              ? 'bg-white/20 text-white scale-110 border border-white/30' 
              : 'bg-white/10 text-white/60 border border-white/10 group-hover:bg-white/20 group-hover:text-white'
          }`}>
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
        </div>

      </div>
    </motion.div>
  );
};
