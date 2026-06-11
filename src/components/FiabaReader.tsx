"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Play, Square, Volume2, VolumeX, Moon, Sun } from 'lucide-react';
import { Fiaba } from '../data/fiabe';
import { generateStoryAudio, VoiceSpeed } from '../services/geminiService';

interface FiabaReaderProps {
  fiaba: Fiaba;
}

export const FiabaReader: React.FC<FiabaReaderProps> = ({ fiaba }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vibratingImg, setVibratingImg] = useState<number | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : 1;
    }
  }, [isMuted]);

  const handleStop = () => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
      currentSourceRef.current.disconnect();
      currentSourceRef.current = null;
    }
    setIsPlaying(false);
    setIsGenerating(false);
  };

  const handlePlayAudio = async () => {
    if (isPlaying) {
      handleStop();
      return;
    }

    setError(null);
    setIsGenerating(true);
    initAudioContext();

    try {
      const audioBuffer = await generateStoryAudio(fiaba.text, audioContextRef.current!, 'normal');
      
      if (audioBuffer) {
        handleStop(); // Stop any existing audio just in case

        const source = audioContextRef.current!.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(gainNodeRef.current!);

        source.onended = () => {
          setIsPlaying(false);
          currentSourceRef.current = null;
        };

        currentSourceRef.current = source;
        source.start(0);
        setIsPlaying(true);
      } else {
        setError('Non è stato possibile generare la voce. Verifica la tua Chiave API.');
      }
    } catch (err: any) {
      if (err.message === "API_KEY_ERROR" || err.name === "EncodingError") {
        setError('Errore Audio: Assicurati di aver inserito una Chiave API valida nelle impostazioni (Home).');
      } else {
        setError('Errore di connessione o autenticazione voce.');
      }
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Pulisci l'audio quando il componente viene smontato
  useEffect(() => {
    return () => {
      handleStop();
      if (audioContextRef.current?.state === 'running') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const paragraphs = fiaba.text.split('\n\n').filter(p => p.trim() !== '');

  const bgLight = fiaba.accentColorLight || '#f8f9ff';

  return (
    <div
      className={`min-h-screen font-sans flex flex-col antialiased transition-colors duration-500 max-md:[&::-webkit-scrollbar]:hidden max-md:[-ms-overflow-style:none] max-md:[scrollbar-width:none] ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'text-slate-900'}`}
      style={!isDarkMode ? { backgroundColor: bgLight } : undefined}
    >
      
      {/* Top Slide Header — tall cinematic */}
      <section className="relative w-full overflow-hidden min-h-[70vh] flex flex-col bg-slate-950">
        {(fiaba.slideImage || fiaba.coverImage) && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <Image 
              src={fiaba.slideImage || fiaba.coverImage!} 
              alt="Dettaglio copertina" 
              fill 
              className="object-cover object-top opacity-90" 
              priority
            />
            <div
              className={`absolute inset-0 bg-gradient-to-b from-black/10 via-slate-900/50 transition-colors duration-500 ${isDarkMode ? 'to-slate-900' : 'to-transparent'}`}
              style={!isDarkMode ? { background: `linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.35) 55%, ${bgLight} 100%)` } : undefined}
            />
          </div>
        )}

        {/* Navigation & Controls */}
        <nav className="relative z-20 w-full max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 transition-all text-white font-medium text-xs uppercase tracking-widest backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna alle Fiabe
          </Link>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 transition-all text-white backdrop-blur-md active:scale-95"
              title={isMuted ? "Attiva audio" : "Silenzia audio"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 transition-all text-white backdrop-blur-md active:scale-95"
              title={isDarkMode ? "Modalità chiara" : "Modalità scura"}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-200" /> : <Moon className="w-5 h-5 text-indigo-200" />}
            </button>
          </div>
        </nav>

        {/* Header Title Content (if no image) */}
        {!fiaba.coverImage && (
          <div className="relative z-10 flex-grow flex items-center justify-center px-6 pb-20">
            <div className="text-center max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-indigo-100 text-[10px] font-bold uppercase tracking-widest border border-white/15">
                {fiaba.category || 'Fiaba della Buonanotte'}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                {fiaba.title}
              </h1>
            </div>
          </div>
        )}
      </section>

      {/* Main Content Area */}
      <main className={`flex-grow w-full pb-32 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900' : ''}`}>
        <div className="max-w-4xl mx-auto px-6 relative">
          
          {/* Foto in Rilievo */}
          {fiaba.coverImage && (
            <div className={`relative w-full max-w-2xl mx-auto aspect-[4/3] -mt-32 sm:-mt-40 z-20 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 transform transition-all duration-700 hover:scale-[1.02] ${isDarkMode ? 'border-slate-800 shadow-indigo-900/40' : 'border-white shadow-indigo-900/20'}`}>
              <Image 
                src={fiaba.coverImage}
                alt={`Copertina di ${fiaba.title}`}
                fill
                className="object-cover"
                style={{ objectPosition: 'center calc(50% + 40px)' }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
            </div>
          )}

          {/* Text Content */}
          <article className="mt-16 sm:mt-24 max-w-2xl mx-auto">

            {/* Keyframe vibration */}
            <style>{`
              @keyframes wiggle {
                0%   { transform: rotate(0deg) scale(1); }
                15%  { transform: rotate(-2deg) scale(1.03); }
                30%  { transform: rotate(2deg) scale(1.03); }
                45%  { transform: rotate(-2deg) scale(1.02); }
                60%  { transform: rotate(2deg) scale(1.02); }
                75%  { transform: rotate(-1deg) scale(1.01); }
                90%  { transform: rotate(1deg) scale(1.01); }
                100% { transform: rotate(0deg) scale(1); }
              }
              .wiggle-anim { animation: wiggle 0.6s ease; }
            `}</style>
            
            <div className={`space-y-8 font-light text-lg leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {paragraphs.map((paragraph, index) => {
                const inlineImage = fiaba.inlineImages?.find(img => img.afterParagraph === index);
                
                return (
                  <React.Fragment key={index}>
                    <p>
                      {paragraph}
                    </p>
                    
                    {inlineImage && (
                      <div
                        className={`relative w-full max-w-md mx-auto aspect-[9/16] my-10 rounded-[1.5rem] overflow-hidden shadow-xl border-4 cursor-pointer select-none ${isDarkMode ? 'border-slate-800' : 'border-white'} ${vibratingImg === index ? 'wiggle-anim' : ''}`}
                        onClick={() => {
                          setVibratingImg(index);
                          setTimeout(() => setVibratingImg(null), 650);
                        }}
                      >
                        <Image 
                          src={inlineImage.src}
                          alt={inlineImage.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {error && (
              <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}
          </article>
        </div>
      </main>
      
      {/* Floating Audio Player Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
        <button
          onClick={handlePlayAudio}
          disabled={isGenerating}
          className={`flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl transition-all duration-300 ${
            isGenerating 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 scale-105'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-105 active:scale-95'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-200 rounded-full animate-spin" />
              <span className="font-semibold tracking-wide">Preparazione...</span>
            </>
          ) : isPlaying ? (
            <>
              <Square className="w-5 h-5 fill-current" />
              <span className="font-semibold tracking-wide">Ferma Lettura</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current ml-1" />
              <span className="font-semibold tracking-wide">Ascolta la Fiaba</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
