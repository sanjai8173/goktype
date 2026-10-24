import { SoundPack } from '@/types';

class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playKey(pack: SoundPack, volume: number = 0.5, isSpace = false, isError = false) {
    if (pack === 'off' || volume <= 0) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume * 0.4, now);
      gainNode.connect(ctx.destination);

      if (isError) {
        this.playErrorSound(ctx, gainNode, now);
        return;
      }

      switch (pack) {
        case 'mechanical':
          this.playMechanical(ctx, gainNode, now, isSpace);
          break;
        case 'tactile':
          this.playTactile(ctx, gainNode, now, isSpace);
          break;
        case 'thock':
          this.playThock(ctx, gainNode, now, isSpace);
          break;
        case 'typewriter':
          this.playTypewriter(ctx, gainNode, now, isSpace);
          break;
        case 'pop':
          this.playPop(ctx, gainNode, now, isSpace);
          break;
        case 'beep':
          this.playBeep(ctx, gainNode, now, isSpace);
          break;
        default:
          this.playMechanical(ctx, gainNode, now, isSpace);
          break;
      }
    } catch {
      // AudioContext play failed silently
    }
  }

  // Mechanical switch: Crisp high click + body clack
  private playMechanical(ctx: AudioContext, master: GainNode, now: number, isSpace: boolean) {
    const jitter = (Math.random() - 0.5) * 0.1;
    const baseFreq = isSpace ? 280 : 380 * (1 + jitter);

    // Click tone
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq * 2.5, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.035);

    oscGain.gain.setValueAtTime(0.7, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(oscGain);
    oscGain.connect(master);
    osc.start(now);
    osc.stop(now + 0.04);

    // Noise snap (mechanical friction)
    this.playNoise(ctx, master, now, 0.02, 1800, 0.5);
  }

  // Tactile switch: Deep bump + rounded click
  private playTactile(ctx: AudioContext, master: GainNode, now: number, isSpace: boolean) {
    const jitter = (Math.random() - 0.5) * 0.08;
    const freq = isSpace ? 190 : 260 * (1 + jitter);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.05);

    oscGain.gain.setValueAtTime(0.8, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(oscGain);
    oscGain.connect(master);
    osc.start(now);
    osc.stop(now + 0.055);

    this.playNoise(ctx, master, now, 0.025, 900, 0.35);
  }

  // Deep Holy Panda "Thock": Deep bass hollow resonance
  private playThock(ctx: AudioContext, master: GainNode, now: number, isSpace: boolean) {
    const freq = isSpace ? 110 : 150 + (Math.random() - 0.5) * 20;

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.5, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.06);

    oscGain.gain.setValueAtTime(1.0, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(oscGain);
    oscGain.connect(master);
    osc.start(now);
    osc.stop(now + 0.065);

    this.playNoise(ctx, master, now, 0.04, 600, 0.5);
  }

  // Typewriter: Authentic vintage mechanical typewriter key strike with platen impact and chassis resonance
  private playTypewriter(ctx: AudioContext, master: GainNode, now: number, isSpace: boolean) {
    if (isSpace) {
      // Spacebar: Escapement ratchet click & hollow mechanical carriage advance
      const baseFreq = 160 + (Math.random() - 0.5) * 20;

      // Low hollow body thud
      const thud = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thud.type = 'triangle';
      thud.frequency.setValueAtTime(baseFreq * 1.5, now);
      thud.frequency.exponentialRampToValueAtTime(65, now + 0.055);

      thudGain.gain.setValueAtTime(0.75, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      thud.connect(thudGain);
      thudGain.connect(master);
      thud.start(now);
      thud.stop(now + 0.06);

      // Ratchet escapement tooth click & spring tension noise
      this.playNoise(ctx, master, now, 0.035, 1400, 0.5);
      this.playNoise(ctx, master, now + 0.006, 0.02, 2800, 0.3);
      return;
    }

    // Character key: Typebar hammer impact against ink ribbon & rubber platen cylinder
    const jitter = (Math.random() - 0.5) * 0.14;
    const strikeFreq = (2400 + (Math.random() - 0.5) * 250) * (1 + jitter);
    const bodyFreq = (360 + (Math.random() - 0.5) * 40) * (1 + jitter);

    // 1. Sharp metallic type slug impact (rapid frequency drop)
    const slug = ctx.createOscillator();
    const slugGain = ctx.createGain();
    slug.type = 'triangle';
    slug.frequency.setValueAtTime(strikeFreq, now);
    slug.frequency.exponentialRampToValueAtTime(450, now + 0.024);

    slugGain.gain.setValueAtTime(0.9, now);
    slugGain.gain.exponentialRampToValueAtTime(0.001, now + 0.024);

    slug.connect(slugGain);
    slugGain.connect(master);
    slug.start(now);
    slug.stop(now + 0.026);

    // 2. Heavy chassis / platen rubber body thud (gives mechanical depth)
    const body = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    body.type = 'sine';
    body.frequency.setValueAtTime(bodyFreq, now);
    body.frequency.exponentialRampToValueAtTime(85, now + 0.05);

    bodyGain.gain.setValueAtTime(0.8, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    body.connect(bodyGain);
    bodyGain.connect(master);
    body.start(now);
    body.stop(now + 0.055);

    // 3. Crisp mechanical impact noise snap (bandpass ribbon friction)
    this.playNoise(ctx, master, now, 0.028, 2600, 0.6);

    // 4. Mechanism lever travel noise
    this.playNoise(ctx, master, now + 0.003, 0.038, 1200, 0.35);

    // 5. High metallic harmonic overtone ring
    const ring = ctx.createOscillator();
    const ringGain = ctx.createGain();
    ring.type = 'sine';
    ring.frequency.setValueAtTime(4400 * (1 + jitter), now);
    ringGain.gain.setValueAtTime(0.14, now);
    ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    ring.connect(ringGain);
    ringGain.connect(master);
    ring.start(now);
    ring.stop(now + 0.045);
  }

  // Typewriter carriage return bell ('Ding!')
  public playBell(volume: number = 0.5) {
    if (volume <= 0) return;
    const ctx = this.initContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(volume * 0.45, now);
      master.connect(ctx.destination);

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2637, now); // E7 high bell chime

      oscGain.gain.setValueAtTime(0.85, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(oscGain);
      oscGain.connect(master);
      osc.start(now);
      osc.stop(now + 0.75);

      // Overtone harmonic
      const harm = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harm.type = 'sine';
      harm.frequency.setValueAtTime(5274, now);
      harmGain.gain.setValueAtTime(0.35, now);
      harmGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      harm.connect(harmGain);
      harmGain.connect(master);
      harm.start(now);
      harm.stop(now + 0.45);
    } catch {
      // ignore
    }
  }

  // Pop: Water bubble / soft wooden pop
  private playPop(ctx: AudioContext, master: GainNode, now: number, isSpace: boolean) {
    const baseFreq = isSpace ? 340 : 480 + (Math.random() - 0.5) * 60;
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 0.5, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.015);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.04);

    oscGain.gain.setValueAtTime(0.8, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(oscGain);
    oscGain.connect(master);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  // 8-bit retro synth beep
  private playBeep(ctx: AudioContext, master: GainNode, now: number, isSpace: boolean) {
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(isSpace ? 440 : 587.33, now);

    oscGain.gain.setValueAtTime(0.2, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(oscGain);
    oscGain.connect(master);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Error feedback sound (low thud)
  private playErrorSound(ctx: AudioContext, master: GainNode, now: number) {
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(oscGain);
    oscGain.connect(master);
    osc.start(now);
    osc.stop(now + 0.085);
  }

  // Helper to generate burst noise for mechanical clicks
  private playNoise(
    ctx: AudioContext,
    master: GainNode,
    now: number,
    duration: number,
    filterFreq: number,
    volume: number
  ) {
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    if (bufferSize <= 0) return;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(filterFreq, now);
    filter.Q.setValueAtTime(1.2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(volume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(master);

    noise.start(now);
    noise.stop(now + duration);
  }
}

export const soundPlayer = new SoundSynthesizer();
