import { useRef, useCallback } from 'react';

export function useSound() {
  const ctxRef = useRef(null);
  const lastScratchRef = useRef(0);

  const ctx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  // "shhhk" scratch noise — throttled to avoid audio spam
  const scratch = useCallback(() => {
    const now = Date.now();
    if (now - lastScratchRef.current < 55) return;
    lastScratchRef.current = now;
    try {
      const ac = ctx();
      const bufSize = Math.floor(ac.sampleRate * 0.055);
      const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * 0.5;

      const src = ac.createBufferSource();
      src.buffer = buf;

      const bpf = ac.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.value = 2800;
      bpf.Q.value = 1.8;

      const g = ac.createGain();
      g.gain.setValueAtTime(0.22, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.055);

      src.connect(bpf); bpf.connect(g); g.connect(ac.destination);
      src.start(); src.stop(ac.currentTime + 0.06);
    } catch {}
  }, [ctx]);

  // Coin "ching" — pitch scales with win size
  const ching = useCallback((level = 1) => {
    try {
      const ac = ctx();
      const freqs = level === 1
        ? [1200, 1600]
        : level === 2
          ? [1400, 1900, 2400]
          : [1600, 2100, 2800, 3400];

      freqs.forEach((freq, i) => {
        const osc = ac.createOscillator();
        const g = ac.createGain();
        const t = ac.currentTime + i * 0.06;
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.3, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        osc.connect(g); g.connect(ac.destination);
        osc.start(t); osc.stop(t + 0.5);
      });
    } catch {}
  }, [ctx]);

  // Fanfare for big/medium wins
  const fanfare = useCallback((big = false) => {
    try {
      const ac = ctx();
      const notes = big
        ? [392, 523.25, 659.25, 783.99, 1046.5, 1318.5]
        : [523.25, 659.25, 783.99, 1046.5];

      notes.forEach((freq, i) => {
        const osc = ac.createOscillator();
        const g = ac.createGain();
        const t = ac.currentTime + i * 0.12;
        osc.type = 'triangle';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.32, t + 0.05);
        g.gain.setValueAtTime(0.32, t + 0.2);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
        osc.connect(g); g.connect(ac.destination);
        osc.start(t); osc.stop(t + 0.7);
      });
    } catch {}
  }, [ctx]);

  // Jackpot — ascending arpeggio + harmonics
  const jackpot = useCallback(() => {
    try {
      const ac = ctx();
      const notes = [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((freq, i) => {
        ['sine', 'triangle'].forEach((type, j) => {
          const osc = ac.createOscillator();
          const g = ac.createGain();
          const t = ac.currentTime + i * 0.075 + j * 0.01;
          osc.type = type;
          osc.frequency.value = freq;
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.2, t + 0.04);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
          osc.connect(g); g.connect(ac.destination);
          osc.start(t); osc.stop(t + 0.6);
        });
      });
    } catch {}
  }, [ctx]);

  // Timer tick — urgent when time is low
  const tick = useCallback((urgent = false) => {
    try {
      const ac = ctx();
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = 'square';
      osc.frequency.value = urgent ? 1100 : 660;
      g.gain.setValueAtTime(urgent ? 0.28 : 0.12, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
      osc.connect(g); g.connect(ac.destination);
      osc.start(); osc.stop(ac.currentTime + 0.09);
    } catch {}
  }, [ctx]);

  // Small "whoosh" on card deal
  const deal = useCallback(() => {
    try {
      const ac = ctx();
      const bufSize = Math.floor(ac.sampleRate * 0.18);
      const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        const env = Math.sin((i / bufSize) * Math.PI);
        d[i] = (Math.random() * 2 - 1) * env * 0.4;
      }
      const src = ac.createBufferSource();
      src.buffer = buf;
      const lpf = ac.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 1200;
      const g = ac.createGain();
      g.gain.value = 0.35;
      src.connect(lpf); lpf.connect(g); g.connect(ac.destination);
      src.start(); src.stop(ac.currentTime + 0.2);
    } catch {}
  }, [ctx]);

  return { scratch, ching, fanfare, jackpot, tick, deal };
}
