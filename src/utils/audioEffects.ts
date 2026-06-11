// Web Audio API Sound Synthesizer for Magic App Effects
// Fully client-side, zero-latency, no assets to load!

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playPoof = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.5, now); // Louder pop
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    // Sharp pop oscillator for popping bubble/letter effect
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now); // Start high pitch
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1); // Drop pitch very fast (creates a pop)
    
    osc.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  } catch (err) {
    console.warn('AudioContext failed to trigger or initialize:', err);
  }
};

/**
 * Plays a mechanical mouse click sound.
 */
export const playClick = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.3, now); // Tactile volume
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04); // Extremely short

    // White noise burst for mechanical switch sound
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Highpass to make it clicky/crisp like a mouse switch
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 4000;

    noise.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.05);
  } catch (err) {
    console.warn('AudioContext click failed:', err);
  }
};
