// Web Audio & Speech utility for free-tier / local audio generation
export class AudioStudioEngine {
  private static audioCtx: AudioContext | null = null;

  static getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Speak text using browser Web Speech API
  static speak(
    text: string,
    options: {
      voiceName?: string;
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
    } = {}
  ): void {
    if (!('speechSynthesis' in window)) {
      console.warn('Web Speech API is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (options.voiceName) {
      const match = voices.find((v) => v.name.toLowerCase().includes(options.voiceName!.toLowerCase()));
      if (match) utterance.voice = match;
    }

    if (options.onEnd) {
      utterance.onend = options.onEnd;
      utterance.onerror = options.onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  static stopSpeech(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Generates a royalty-free rhythmic synth wave audio buffer for background music preview
  static async createLoFiLoopWav(): Promise<string> {
    const sampleRate = 44100;
    const duration = 4; // 4 second loop
    const numSamples = sampleRate * duration;
    const ctx = new OfflineAudioContext(1, numSamples, sampleRate);

    // Bass note
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, 0); // A2
    osc.frequency.setValueAtTime(130.81, 1); // C3
    osc.frequency.setValueAtTime(146.83, 2); // D3
    osc.frequency.setValueAtTime(98, 3); // G2

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, 0);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(duration);

    const renderedBuffer = await ctx.startRendering();
    return this.bufferToWave(renderedBuffer, numSamples);
  }

  // Convert AudioBuffer to WAV data URL
  private static bufferToWave(abuffer: AudioBuffer, totalSamples: number): string {
    const numOfChan = abuffer.numberOfChannels;
    const length = totalSamples * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    const channels: Float32Array[] = [];
    let sample = 0;
    let offset = 0;
    let pos = 0;

    function setUint16(data: number) {
      out.setUint16(pos, data, true);
      pos += 2;
    }
    function setUint32(data: number) {
      out.setUint32(pos, data, true);
      pos += 4;
    }

    // RIFF chunk
    out.setUint32(0, 0x46464952, true); // "RIFF"
    out.setUint32(4, length - 8, true);
    out.setUint32(8, 0x45564157, true); // "WAVE"
    out.setUint32(12, 0x20746d66, true); // "fmt "
    setUint32(16); // subchunk1size
    setUint16(1); // PCM
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16); // 16-bit
    out.setUint32(pos, 0x61746164, true); // "data"
    pos += 4;
    setUint32(length - pos - 4);

    for (let i = 0; i < abuffer.numberOfChannels; i++) {
      channels.push(abuffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    const blob = new Blob([out], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }
}
