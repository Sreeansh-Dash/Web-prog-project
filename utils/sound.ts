// Simple Cyberpunk Sound Synthesizer using Web Audio API

let audioCtx: AudioContext | null = null;
let isMuted = false;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const initAudio = () => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
};

export const toggleMute = () => {
  isMuted = !isMuted;
  return isMuted;
};

export const getMuteState = () => isMuted;

const createOscillator = (type: OscillatorType, freq: number, duration: number, vol: number = 0.1) => {
  if (isMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
};

export const playSound = (type: 'click' | 'hover' | 'success' | 'error' | 'alarm' | 'type' | 'open') => {
  if (isMuted) return;
  const ctx = getCtx();

  switch (type) {
    case 'click':
      // High tech blip
      createOscillator('sine', 800, 0.1, 0.1);
      setTimeout(() => createOscillator('square', 1200, 0.05, 0.05), 50);
      break;
      
    case 'hover':
      // Subtle tick
      createOscillator('triangle', 2000, 0.02, 0.02);
      break;

    case 'success':
      // Positive Arpeggio
      const now = ctx.currentTime;
      [440, 554, 659, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.1, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.3);
      });
      break;

    case 'error':
      // Negative Buzz
      createOscillator('sawtooth', 150, 0.3, 0.2);
      createOscillator('sawtooth', 140, 0.3, 0.2);
      break;

    case 'alarm':
      // Siren
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
      break;

    case 'type':
      // Short noise/click
      createOscillator('square', 800, 0.03, 0.05);
      break;

    case 'open':
      // Swoosh
      createOscillator('sine', 200, 0.3, 0.1);
      setTimeout(() => createOscillator('sine', 600, 0.2, 0.1), 100);
      break;
  }
};
