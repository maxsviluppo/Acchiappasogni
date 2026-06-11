"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { generateStoryAudio, VoiceSpeed } from '../services/geminiService';
import { FIABE_PREDEFINITE, Fiaba } from '../data/fiabe';
import { DreamAnimator } from '../components/DreamAnimator';
import { StoryCard } from '../components/StoryCard';
import { CelestialBackground } from '../components/CelestialBackground';
import { AnimatedTitle } from '../components/AnimatedTitle';
import { playClick } from '../utils/audioEffects';
import {
  Sparkles, 
  Settings, 
  Play, 
  Square, 
  BookOpen, 
  Mail, 
  X, 
  Volume2, 
  Clock,
  Star,
  Heart,
  Bell,
  Sliders,
  VolumeX,
  Moon
} from 'lucide-react';

const formatProgressTime = (timeInSeconds: number) => {
  const m = Math.floor(timeInSeconds / 60);
  const s = Math.floor(timeInSeconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default function App() {
  const router = useRouter();
  const [text, setText] = useState<string>('');
  const [selectedStory, setSelectedStory] = useState<Fiaba | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<VoiceSpeed>('normal');
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [hasCustomKey, setHasCustomKey] = useState<boolean>(false);

  // Global document-level click audio listener to play gentle clicking sounds
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Determine if clicked element is interactive (button, link, custom click, checkbox, etc.)
      const isInteractive = target.closest('button, a, [role="button"], .cursor-pointer, input[type="checkbox"], input[type="radio"], svg');
      if (isInteractive) {
        playClick();
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);
  
  // Global preference settings states
  const [isAutoScrollOn, setIsAutoScrollOn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('acchiappasogni_autoscroll');
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [isHighQualityVoice, setIsHighQualityVoice] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('acchiappasogni_high_quality');
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('acchiappasogni_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleToggleFavorite = (storyId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(storyId)
        ? prev.filter((id) => id !== storyId)
        : [...prev, storyId];
      localStorage.setItem('acchiappasogni_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const [scheduledReminders, setScheduledReminders] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('acchiappasogni_reminders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const timeoutsRef = useRef<{ [storyId: string]: any[] }>({});

  const showToastMsg = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => prev && prev.message === message ? null : prev);
    }, 6000);
  };

  const handleToggleAutoScroll = (enabled: boolean) => {
    setIsAutoScrollOn(enabled);
    localStorage.setItem('acchiappasogni_autoscroll', JSON.stringify(enabled));
    showToastMsg(enabled ? "Scorrimento testo automatico inserito ðŸ“œ" : "Scorrimento disattivato, puoi scorrere a mano ðŸ‘†", 'info');
  };

  const handleToggleHighQuality = (enabled: boolean) => {
    setIsHighQualityVoice(enabled);
    localStorage.setItem('acchiappasogni_high_quality', JSON.stringify(enabled));
    showToastMsg(enabled ? "Voce ad Alta Fedeltà impostata! ✨" : "Voce standard", 'info');
  };

  const handleToggleReminder = async (storyId: string) => {
    const story = FIABE_PREDEFINITE.find((s) => s.id === storyId);
    if (!story) return;

    const isAlreadyScheduled = scheduledReminders.includes(storyId);

    if (isAlreadyScheduled) {
      // Cancel reminder
      if (timeoutsRef.current[storyId]) {
        timeoutsRef.current[storyId].forEach(clearTimeout);
        delete timeoutsRef.current[storyId];
      }
      setScheduledReminders((prev) => {
        const updated = prev.filter((id) => id !== storyId);
        localStorage.setItem('acchiappasogni_reminders', JSON.stringify(updated));
        return updated;
      });
      showToastMsg(`Promemoria annullato per "${story.title}"`, 'info');
    } else {
      // Schedule reminder
      if (!('Notification' in window)) {
        showToastMsg("Notifiche non supportate. Ti ricorderemo la fiaba qui nell'app!", 'info');
        // Still toggle local state for visual confirmation
        setScheduledReminders((prev) => {
          const updated = [...prev, storyId];
          localStorage.setItem('acchiappasogni_reminders', JSON.stringify(updated));
          return updated;
        });
        return;
      }

      let permission = Notification.permission;
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission !== 'granted') {
        showToastMsg("Attiva le notifiche del browser per ricevere i promemoria!", 'error');
        return;
      }

      // Calculate time to bedtime (9:00 PM today or tomorrow)
      const now = new Date();
      const bedtime = new Date();
      bedtime.setHours(21, 0, 0, 0);
      if (now.getTime() > bedtime.getTime()) {
        bedtime.setDate(bedtime.getDate() + 1);
      }
      const delayMs = bedtime.getTime() - now.getTime();

      // Real Bedtime schedule
      const bedtimeTimeout = setTimeout(() => {
        if (Notification.permission === 'granted') {
          const n = new Notification("ðŸŒ™ Ora della nanna con Acchiappasogni", {
            body: `âœ¨ Ãˆ il momento perfetto per rilassarsi! Vieni ad ascoltare "${story.title}" prima di dormire.`,
            tag: `bedtime-${storyId}`
          });
          n.onclick = () => {
            window.focus();
            const elem = document.getElementById('lettore-fiaba');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          };
        }
      }, delayMs);

      // Instant preview test schedule in 8 seconds to show them right away
      const testTimeout = setTimeout(() => {
        if (Notification.permission === 'granted') {
          const n = new Notification("ðŸ”” Prova Promemoria Acchiappasogni", {
            body: `✨ Notifiche attive! Stasera alle 21:00 ti ricorderò di ascoltare "${story.title}". Prova riuscita!`,
            tag: `test-${storyId}`
          });
          n.onclick = () => {
            window.focus();
          };
        }
      }, 8000);

      timeoutsRef.current[storyId] = [bedtimeTimeout, testTimeout];

      setScheduledReminders((prev) => {
        const updated = [...prev, storyId];
        localStorage.setItem('acchiappasogni_reminders', JSON.stringify(updated));
        return updated;
      });

      showToastMsg(`Promemoria programmato alle 21:00! Ti invieremo un test tra 8 secondi.`, 'success');
    }
  };

  // Mount Effect to auto-reschedule any saved reminders and cleanup timeouts on unmount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      scheduledReminders.forEach((storyId) => {
        const story = FIABE_PREDEFINITE.find((s) => s.id === storyId);
        if (!story) return;

        const now = new Date();
        const bedtime = new Date();
        bedtime.setHours(21, 0, 0, 0);
        if (now.getTime() > bedtime.getTime()) {
          bedtime.setDate(bedtime.getDate() + 1);
        }
        const delayMs = bedtime.getTime() - now.getTime();

        const bedtimeTimeout = setTimeout(() => {
          if (Notification.permission === 'granted') {
            const n = new Notification("ðŸŒ™ Ora della nanna con Acchiappasogni", {
              body: `âœ¨ Ãˆ il momento perfetto per rilassarsi! Vieni ad ascoltare "${story.title}" prima di dormire.`,
              tag: `bedtime-${storyId}`
            });
            n.onclick = () => {
              window.focus();
            };
          }
        }, delayMs);

        timeoutsRef.current[storyId] = [bedtimeTimeout];
      });
    }

    return () => {
      Object.values(timeoutsRef.current).forEach((timeouts) => {
        timeouts.forEach(clearTimeout);
      });
    };
  }, []);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const storyViewerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);

  const [customApiKey, setCustomApiKey] = useState('');

  // Verificare lo stato della chiave personalizzata
  useEffect(() => {
    const checkKeyStatus = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasCustomKey(selected);
      } else {
        const localKey = localStorage.getItem('custom_gemini_key');
        if (localKey) {
          setHasCustomKey(true);
        }
      }
    };
    checkKeyStatus();
  }, []);

  const handleOpenKeyDialog = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasCustomKey(true);
      setShowSettings(false);
      setError(null);
    }
  };

  const handleSaveKey = () => {
    if (customApiKey.trim()) {
      localStorage.setItem('custom_gemini_key', customApiKey.trim());
      setHasCustomKey(true);
      setShowSettings(false);
      setError(null);
    }
  };

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const handleStop = useCallback(() => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {}
      currentSourceRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsPlaying(false);
    setPlaybackProgress(0);
    setCurrentTime(0);
  }, []);

  const animateScroll = useCallback(() => {
    if (!isPlaying || !audioContextRef.current) return;

    const elapsed = audioContextRef.current.currentTime - startTimeRef.current;
    const progress = Math.min(elapsed / durationRef.current, 1);

    setPlaybackProgress(progress * 100);
    setCurrentTime(Math.min(elapsed, durationRef.current));

    // Scroll primary text window slowly (only if autoScroll is enabled)
    if (isAutoScrollOn) {
      const container = storyViewerRef.current;
      if (container) {
        const maxScroll = container.scrollHeight - container.clientHeight;
        if (maxScroll > 0) {
          container.scrollTop = maxScroll * progress;
        }
      }
    }

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animateScroll);
    } else {
      setIsPlaying(false);
      setPlaybackProgress(100);
      setCurrentTime(durationRef.current);
    }
  }, [isPlaying, isAutoScrollOn]);

  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animateScroll);
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, animateScroll]);

  // Seleziona una fiaba predefinita e naviga
  const handleSelectStory = (story: Fiaba) => {
    handleStop();
    playClick();
    router.push(`/fiaba/${story.id}`);
  };

  const handleReadStory = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Beautiful magical burst feedback at the user's click coordinates
    if (e) {
      let x = e.clientX;
      let y = e.clientY;
      if (x === 0 && y === 0) {
        const rect = e.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
      window.dispatchEvent(new CustomEvent('magic-burst', { detail: { x, y } }));
    }

    if (!text.trim()) {
      setError('Per favore, seleziona una delle nostre fiabe per iniziare l\'ascolto.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    initAudioContext();

    try {
      const audioBuffer = await generateStoryAudio(text, audioContextRef.current!, speed);
      
      if (audioBuffer) {
        handleStop();

        const source = audioContextRef.current!.createBufferSource();
        source.buffer = audioBuffer;
        
        const playbackRates = { slow: 0.95, normal: 1.0, fast: 1.1 };
        const rate = playbackRates[speed];
        source.playbackRate.value = rate;

        const gainNode = audioContextRef.current!.createGain();
        source.connect(gainNode);
        gainNode.connect(audioContextRef.current!.destination);
        
        durationRef.current = audioBuffer.duration / rate;
        const now = audioContextRef.current!.currentTime;
        startTimeRef.current = now;

        const fadeDuration = Math.min(5, durationRef.current);
        const fadeStartTime = Math.max(now, now + durationRef.current - fadeDuration);

        gainNode.gain.setValueAtTime(1, now);
        if (fadeStartTime > now) {
          gainNode.gain.setValueAtTime(1, fadeStartTime);
        }
        gainNode.gain.linearRampToValueAtTime(0, now + durationRef.current);

        source.onended = () => {
          setIsPlaying(false);
          currentSourceRef.current = null;
        };

        const container = storyViewerRef.current;
        if (container) container.scrollTop = 0;

        currentSourceRef.current = source;
        source.start(0);
        setIsPlaying(true);
      } else {
        setError('Non è stato possibile generare la voce. Controlla la tua chiave API nelle impostazioni.');
      }
    } catch (err: any) {
      if (err.message === "API_KEY_ERROR") {
        setError('Errore di autenticazione. Seleziona nuovamente la tua chiave API nelle impostazioni.');
      } else {
        setError('Errore del server della voce. Se persiste, prova ad impostare la tua chiave personale.');
      }
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };



  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.error("Error playing audio", e));
      }
    }
  };

  // Funzione helper per ottenere l'etichetta della velocità vocale
  const getSpeedLabel = (speed: VoiceSpeed) => {
    switch (speed) {
      case 'slow': return 'Lenta e Rilassante';
      case 'normal': return 'Naturale (Consigliata)';
      case 'fast': return 'Leggermente più rapida';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-[#ec4899]/30 overflow-x-hidden relative">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
      
      {/* Premium celestial night sky with twinkling stars and shooting comets */}
      <CelestialBackground category={selectedStory?.category} />

      {/* Cartoon Sky Background from Slide with smooth fade at the bottom */}
      <div 
        className="absolute top-0 left-0 w-full h-[110vh] pointer-events-none z-0"
        style={{ 
          WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)', 
          maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
          transform: 'translateY(-80px)'
        }}
      >
        <Image 
          src="/stella/stellaslide2.png"
          alt="Sfondo Magico"
          fill
          className="object-cover object-top mix-blend-luminosity md:mix-blend-normal opacity-60"
          priority
        />
      </div>


      {/* Settings Panel Modal (Floating Overlay) */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300" onClick={() => setShowSettings(false)}>
          <div className="bg-slate-900 border border-indigo-500/20 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 max-w-md w-full shadow-2xl overflow-y-auto max-h-[85vh] text-left relative no-scrollbar" onClick={e => e.stopPropagation()}>
            
            <button 
              onClick={() => setShowSettings(false)} 
              className="absolute top-5 right-5 p-2.5 text-slate-400 hover:text-slate-100 bg-slate-950/40 hover:bg-slate-800 rounded-full transition-colors active:scale-90"
              title="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="p-3 bg-gradient-to-br from-indigo-500/10 to-violet-500/15 rounded-2xl text-indigo-400 border border-indigo-500/20">
                <Sliders className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h2 className="text-xl md:text-2xl font-light text-slate-100 serif-font">Configurazione Magica</h2>
                <p className="text-xs text-indigo-200 font-medium uppercase tracking-widest mt-0.5">Personalizza l'atmosfera</p>
              </div>
            </div>
            
            <div className="space-y-5">
              {/* Preferences Settings Block */}
              <section className="bg-slate-950/70 rounded-3xl p-4 sm:p-5 border border-indigo-500/10">
                <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-4 flex items-center gap-1.5 border-b border-indigo-500/10 pb-2">
                  âœ¨ Preferenze di Riproduzione
                </h3>
                
                <div className="space-y-4">
                  {/* Autoscroll Switch */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-200">Scorrimento Automatico</p>
                      <p className="text-xs text-slate-200 font-normal mt-0.5 leading-snug">Scorri il testo della fiaba sincronizzato con il procedere della voce</p>
                    </div>
                    <button
                      onClick={() => handleToggleAutoScroll(!isAutoScrollOn)}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                        isAutoScrollOn ? 'bg-indigo-500' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-200 ${
                        isAutoScrollOn ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* High Quality Voice Switch */}
                  <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-900">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-200">Voce ad Alta Fedeltà</p>
                      <p className="text-xs text-slate-200 font-normal mt-0.5 leading-snug">Utilizza i pre-set acustici avanzati per addolcire il timbro vocale</p>
                    </div>
                    <button
                      onClick={() => handleToggleHighQuality(!isHighQualityVoice)}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                        isHighQualityVoice ? 'bg-indigo-500' : 'bg-slate-800'
                      }`}
                    >
                      <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-200 ${
                        isHighQualityVoice ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </section>

              {/* API Section */}
              <section className="bg-slate-950/70 rounded-3xl p-4 sm:p-5 border border-indigo-500/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-yellow-300" /> API Gemini
                  </h3>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] sm:text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity"
                  >
                    Dove trovo la chiave?
                  </a>
                </div>
                <p className="text-xs text-slate-200 mb-4 font-normal leading-relaxed">
                  Stato account: {hasCustomKey ? (
                    <span className="text-emerald-400 font-semibold bg-emerald-400/10 px-2 py-0.5 rounded-full">Chiave Pro Attiva</span>
                  ) : (
                    <span className="text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded-full">Fornito dal Sistema</span>
                  )}
                </p>
                <div className="space-y-3">
                  {!hasCustomKey && (
                    <input 
                      type="password" 
                      placeholder="Incolla qui la tua API Key Gemini..." 
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  )}
                  <button
                    onClick={customApiKey.trim() ? handleSaveKey : handleOpenKeyDialog}
                    className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 text-xs"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-200" />
                    {hasCustomKey 
                      ? 'Cambia Chiave Personale' 
                      : (customApiKey.trim() ? 'Salva Chiave Personale' : 'Usa Chiave Pro Personale')}
                  </button>
                </div>
              </section>

              {/* Developer Info Section */}
              <section className="bg-rose-500/5 rounded-3xl p-4 sm:p-5 border border-rose-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
                  <span className="text-xs font-bold text-rose-300 tracking-wider uppercase">DevTools BY CASTRO MASSIMO</span>
                </div>
                <p className="text-xs text-slate-200 font-normal leading-relaxed mb-3">
                  Questa applicazione è sviluppata con cura da DevTools by Castro Massimo.
                  Per progetti personalizzati, scrivici oggi stesso.
                </p>
                <a
                  href="mailto:castromassimo@gmail.com"
                  className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-xl font-medium transition-all flex items-center justify-center gap-2 active:scale-95 text-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Invia una mail a Massimo
                </a>
              </section>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-800/60 text-center flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 tracking-widest italic uppercase">ACCHIAPPASOGNI • GRILLO SAGGIO v1.7.0</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: LA COPERTINA (Splash Cover Visual Landing) */}
      <section className="min-h-screen flex flex-col justify-between items-center px-4 py-8 md:py-12 relative z-10 select-none">
        
        {/* Settings button on Cover */}
        <header className="w-full max-w-6xl flex justify-end items-center px-4">
          <button 
            onClick={() => setShowSettings(true)}
            className="group p-3.5 bg-slate-950/40 backdrop-blur-sm hover:bg-slate-900/50 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center relative overflow-hidden"
            title="Pannello di Controllo"
            id="pulsante-mezza-luna"
          >
            {/* Ambient inner neon glow */}
            <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors duration-300" />
            
            {/* Glowing Moon Icon */}
            <Moon className="w-6 h-6 text-yellow-200 fill-yellow-200/20 group-hover:fill-yellow-200/60 transition-colors duration-300 drop-shadow-[0_0_5px_rgba(234,179,8,0.4)] group-hover:scale-110 group-hover:rotate-12" />
          </button>
        </header>

        {/* Central Cartoon Illustration Hero */}
        <div className="text-center my-auto flex flex-col items-center">
          {/* Beautiful cartoon dreamcatcher vector artwork */}
          <DreamAnimator isPlaying={isPlaying} />

          {/* Title and Beautiful branding */}
          <AnimatedTitle />
          <p className="text-slate-200 font-normal text-base md:text-xl max-w-lg mx-auto mt-4 px-4 leading-relaxed select-text">
            La dolce voce narrante per fiabe e sogni dorati. Culliamo la fantasia dei più piccini nel buio della cameretta.
          </p>
        </div>

        {/* Empty container keeping the flex layout balanced */}
        <div className="h-4" />
      </section>

      {/* SECTION 2: THE DASHBOARD WORKSPACE (Fairy tales Grid) */}
      <div id="biblioteca-fiabe" className="relative z-10 w-full max-w-6xl mx-auto px-4 py-16">
        
        {/* SECTION FOR BOOKMARKS / SEGNALIBRI */}
        {FIABE_PREDEFINITE.filter((s) => favorites.includes(s.id)).length > 0 && (
          <div className="mb-20 animate-in fade-in slide-in-from-top-5 duration-700">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 rounded-full border border-rose-500/20 mb-3">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
                <span className="text-[11px] font-bold tracking-widest text-[#f43f5e] uppercase">I Tuoi Segnalibri Magici</span>
              </div>
              <h2 className="serif-font text-3xl md:text-5xl font-light text-slate-100 mb-4">Preferiti del Cuore</h2>
              <p className="text-slate-400 font-light max-w-xl text-sm md:text-base">
                Le fiabe selezionate per i momenti più magici. Ritrovale comodamente qui.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
              {FIABE_PREDEFINITE.filter((s) => favorites.includes(s.id)).map((story) => (
                <StoryCard
                  key={`fav-${story.id}`}
                  story={story}
                  onSelect={handleSelectStory}
                  isActive={selectedStory?.id === story.id}
                  isFavorite={true}
                  onToggleFavorite={() => handleToggleFavorite(story.id)}
                  isScheduled={scheduledReminders.includes(story.id)}
                  onToggleReminder={() => handleToggleReminder(story.id)}
                />
              ))}
            </div>
            
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent mt-20" />
          </div>
        )}

        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="serif-font text-5xl md:text-7xl font-extralight text-transparent bg-clip-text bg-gradient-to-b from-rose-200 to-indigo-300 drop-shadow-md tracking-wide mt-8">
            Le Fiabe
          </h2>
        </div>

        {/* Pure Premium 3-column / 2-column Grid of Cartoon Covers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch animate-in fade-in slide-in-from-bottom-5 duration-700">
          {FIABE_PREDEFINITE.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onSelect={handleSelectStory}
              isActive={selectedStory?.id === story.id}
              isFavorite={favorites.includes(story.id)}
              onToggleFavorite={() => handleToggleFavorite(story.id)}
              isScheduled={scheduledReminders.includes(story.id)}
              onToggleReminder={() => handleToggleReminder(story.id)}
            />
          ))}
        </div>

        {/* SECTION 3: THE COZY PORTABLE PLAYER (Activated on Selezione) */}
        {text && (
          <div id="lettore-fiaba" className="mt-16 bg-gradient-to-br from-[#0e0e24] to-[#120b2d] border border-indigo-500/20 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden animate-in zoom-in duration-500">
            {/* Visual background waves */}
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-violet-600/10 rounded-full filter blur-2xl pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-rose-500/5 rounded-full filter blur-2xl pointer-events-none" />

            <div className="max-w-4xl mx-auto flex flex-col gap-6 relative z-10">
              
              {/* Player, Scrolling text & Controls */}
              <div className="w-full flex flex-col gap-6 justify-between">
                
                {/* Header inside Player */}
                <div className="flex flex-col gap-4 border-b border-indigo-500/10 pb-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-300 animate-pulse">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] flex items-center gap-1">
                          In Lettura {isPlaying && <Sparkles className="w-3 h-3 text-yellow-300 animate-spin" />}
                        </span>
                        <h4 className="serif-font text-base md:text-lg font-medium text-slate-200">
                          {selectedStory ? selectedStory.title : 'Fiaba Selezionata'}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {isPlaying && (
                        <span className="text-xs font-mono text-pink-400 font-medium px-2 py-0.5 bg-pink-500/5 rounded-md border border-pink-500/10">
                          {formatProgressTime(currentTime)} / {formatProgressTime(durationRef.current)}
                        </span>
                      )}
                      {selectedStory && (
                        <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-400" /> {selectedStory.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar container */}
                  <div className="w-full bg-slate-950/80 rounded-full h-1.5 relative overflow-hidden border border-indigo-500/10">
                    <div 
                      className="bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-500 h-full rounded-full transition-all duration-75 ease-out shadow-[0_0_8px_rgba(236,72,153,0.4)]"
                      style={{ width: `${playbackProgress}%` }}
                    />
                  </div>
                </div>

                {/* Synced auto-scrolling visual reader screen */}
                <div 
                  ref={storyViewerRef}
                  className="max-h-[220px] overflow-y-auto pr-2 mb-1 bg-slate-950/70 p-5 md:p-6 rounded-2xl border border-indigo-500/10 scroll-smooth text-slate-200 no-scrollbar leading-relaxed text-sm md:text-base"
                >
                  <p className="serif-font text-base md:text-lg whitespace-pre-line text-slate-200/90 leading-relaxed font-light">
                    {text}
                  </p>
                </div>

                {/* Speed Controller Section */}
                <div className="flex flex-col gap-2 bg-slate-950/40 p-4 rounded-2xl border border-indigo-500/5">
                  <label className="text-[10px] font-semibold text-indigo-300 uppercase tracking-widest ml-1 flex items-center gap-1">
                    Velocità della narrazione
                  </label>
                  <div className="flex p-1 bg-slate-950/80 rounded-xl max-w-sm border border-slate-800">
                    {(['slow', 'normal', 'fast'] as VoiceSpeed[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                          speed === s 
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/10' 
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {s === 'slow' ? 'Lenta' : s === 'normal' ? 'Normale' : 'Veloce'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loading & Error Indicators */}
                {error && (
                  <div className="p-4 bg-rose-950/40 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-light">
                    {error}
                  </div>
                )}

                {/* Primary control bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 pt-4 border-t border-indigo-500/10">
                  
                  {/* Playing details status */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isPlaying ? 'bg-emerald-400' : 'bg-indigo-400'
                      }`} />
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${
                        isPlaying ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`} />
                    </div>
                    
                    <span className="text-xs uppercase font-medium tracking-widest text-slate-400">
                      {isPlaying 
                        ? 'Voce angelica attiva...' 
                        : isGenerating 
                          ? 'Generazione melodia...' 
                          : 'Pronto ad ascoltare'}
                    </span>
                  </div>

                  {/* Primary Button togglers */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {isPlaying ? (
                      <button
                        onClick={handleStop}
                        className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-full font-medium transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Square className="w-4 h-4 fill-current" />
                        Ferma Voce
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleReadStory(e)}
                        disabled={isGenerating || !text.trim()}
                        className={`
                          w-full sm:w-auto px-10 py-4 rounded-full font-medium transition-all active:scale-95 flex items-center justify-center gap-2.5 shadow-xl
                          ${(isGenerating || !text.trim()) 
                            ? 'bg-slate-800 text-slate-500 border border-slate-800/40 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white shadow-xl shadow-pink-500/10'
                          }
                        `}
                      >
                        {isGenerating ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generazione in corso...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            Avvia Voce Dolce âœ¨
                          </>
                        )}
                      </button>
                    )}
                  </div>

                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* SECTION 4: COZY FOOTER */}
      <footer className="mt-20 border-t border-indigo-500/10 py-12 px-4 relative z-10 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-xl">ðŸ’¤</span>
              <span className="serif-font font-light text-xl text-slate-200">Acchiappasogni</span>
            </div>
            <p className="text-xs text-slate-500 font-light leading-relaxed max-w-sm">
              Fiabe della buonanotte lette dolcemente dall'intelligenza artificiale di Gemini. Progettato per favorire sogni tranquilli in tutta sicurezza.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Sviluppato da</span>
              <a href="mailto:castromassimo@gmail.com" className="text-rose-400 font-semibold hover:underline">
                CASTRO MASSIMO
              </a>
            </div>
            <p>Â© {new Date().getFullYear()} Acchiappasogni App â€¢ Tutti i diritti d'oro sono riservati.</p>
            {hasCustomKey && (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                Account Pro Attivo
              </span>
            )}
          </div>
        </div>
      </footer>

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`p-4 rounded-2xl border backdrop-blur-md shadow-2xl max-w-sm flex items-center gap-3 ${
            toast.type === 'success' 
              ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500/30 shadow-emerald-500/10' 
              : toast.type === 'error'
                ? 'bg-rose-950/95 text-rose-200 border-rose-500/30 shadow-rose-500/10'
                : 'bg-indigo-950/95 text-indigo-200 border-indigo-500/30 shadow-indigo-500/10'
          }`}>
            <div className={`p-2 rounded-xl ${
              toast.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : toast.type === 'error'
                  ? 'bg-rose-500/10 text-rose-400'
                  : 'bg-indigo-500/10 text-indigo-400'
            }`}>
              {toast.type === 'success' ? (
                <Sparkles className="w-5 h-5 animate-pulse" />
              ) : toast.type === 'error' ? (
                <X className="w-5 h-5 cursor-pointer" onClick={() => setToast(null)} />
              ) : (
                <Bell className="w-5 h-5 animate-bounce text-yellow-300" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold">
                {toast.type === 'success' ? 'Incantesimo Riuscito!' : toast.type === 'error' ? 'Attenzione' : 'Promemoria'}
              </p>
              <p className="text-[11px] text-slate-300 font-light mt-0.5 leading-snug">
                {toast.message}
              </p>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
