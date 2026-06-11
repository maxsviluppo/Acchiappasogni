export const decode = (base64: string): Uint8Array => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Polifill/Helper for decoding audio data correctly across browsers if needed,
// Gemini TTS currently returns raw PCM 16-bit 24kHz data which native decodeAudioData cannot parse without a WAV header.
export const decodeAudioData = async (
  bytes: Uint8Array,
  audioContext: AudioContext,
  sampleRate: number,
  channels: number
): Promise<AudioBuffer> => {
  try {
    const clonedBuffer = bytes.buffer.slice(0);
    return await audioContext.decodeAudioData(clonedBuffer);
  } catch (err) {
    console.warn("Native decode failed (expected for raw PCM). Decoding raw 16-bit PCM...", err);
    
    const dataView = new DataView(bytes.buffer);
    const numSamples = bytes.length / 2;
    const audioBuffer = audioContext.createBuffer(channels, numSamples, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    
    for (let i = 0; i < numSamples; i++) {
      const sample = dataView.getInt16(i * 2, true); // true = little-endian
      channelData[i] = sample / 32768.0;
    }
    
    return audioBuffer;
  }
};
