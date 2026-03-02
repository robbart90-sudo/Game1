import { useEffect, useRef, useState, useCallback } from 'react';
import './TitleScreen.css';

// ── Floating emoji pool ───────────────────────────────────────────────────────
const EMOJIS = ['🎟️','🃏','💰','⛽','☕','🍟','🌭','🥤','⭐','💎','🪙','🎰','🔥','💸'];

// ── Web Audio: 4-bar melody loop at 120 BPM in C major ───────────────────────
const N = {
  C3:130.81, D3:146.83, F3:174.61, G3:196.00,
  C4:261.63, E4:329.63, F4:349.23, G4:392.00, A4:440.00, B4:493.88,
  C5:523.25, D5:587.33,
};
const BEAT = 0.5; // 120 BPM
const LOOP_DUR = 16 * BEAT; // 8 s per loop

// [freq, startBeat, durationBeats]
const MELODY = [
  [N.C4,  0, 1], [N.E4,  1, 1], [N.G4,  2, 1], [N.E4,  3, 1],
  [N.F4,  4, 1], [N.A4,  5, 1], [N.C5,  6, 1], [N.A4,  7, 1],
  [N.G4,  8, 1], [N.B4,  9, 1], [N.D5, 10, 1], [N.B4, 11, 1],
  [N.E4, 12, 1], [N.G4, 13, 1], [N.C5, 14, 0.75], [N.C4, 14.75, 1.25],
];
const BASS = [
  [N.C3,  0, 2], [N.G3,  2, 2],
  [N.F3,  4, 2], [N.C3,  6, 2],
  [N.G3,  8, 2], [N.D3, 10, 2],
  [N.C3, 12, 2], [N.G3, 14, 2],
];

function scheduleBar(ctx, masterGain, t0) {
  for (const [freq, sb, db] of MELODY) {
    const ns = t0 + sb * BEAT;
    const nd = db * BEAT;
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ns);
    g.gain.setValueAtTime(0, ns);
    g.gain.linearRampToValueAtTime(0.10, ns + 0.01);
    g.gain.setValueAtTime(0.10, Math.max(ns + 0.01, ns + nd - 0.04));
    g.gain.linearRampToValueAtTime(0, ns + nd);
    osc.connect(g); g.connect(masterGain);
    osc.start(ns); osc.stop(ns + nd + 0.02);
  }
  for (const [freq, sb, db] of BASS) {
    const ns = t0 + sb * BEAT;
    const nd = db * BEAT;
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ns);
    g.gain.setValueAtTime(0, ns);
    g.gain.linearRampToValueAtTime(0.07, ns + 0.02);
    g.gain.setValueAtTime(0.07, Math.max(ns + 0.02, ns + nd - 0.06));
    g.gain.linearRampToValueAtTime(0, ns + nd);
    osc.connect(g); g.connect(masterGain);
    osc.start(ns); osc.stop(ns + nd + 0.02);
  }
}

// ── Particle helpers ──────────────────────────────────────────────────────────
let _nextId = 0;

function spawnParticle() {
  const edge = Math.floor(Math.random() * 4);
  const vw = window.innerWidth, vh = window.innerHeight;
  let x, y;
  if (edge === 0)      { x = Math.random() * vw; y = -70; }
  else if (edge === 1) { x = vw + 70; y = Math.random() * vh; }
  else if (edge === 2) { x = Math.random() * vw; y = vh + 70; }
  else                 { x = -70; y = Math.random() * vh; }

  const speed = 28 + Math.random() * 52;
  const angle = Math.atan2(vh / 2 - y, vw / 2 - x) + (Math.random() - 0.5) * 1.2;

  return {
    id: _nextId++,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: 1.2 + Math.random() * 2.0,
    opacity: 0.15 + Math.random() * 0.25,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 45,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TitleScreen({ onStart }) {
  const [flashing,  setFlashing]  = useState(false);
  const [tick,      setTick]      = useState(0); // forces re-render from RAF
  const particlesRef = useRef([]);
  const rafRef       = useRef(null);
  const audioCtxRef  = useRef(null);
  const masterGainRef = useRef(null);

  // ── Particle loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    // Seed initial particles spread across the viewport
    for (let i = 0; i < 24; i++) particlesRef.current.push(spawnParticle());

    let lastTime = performance.now();

    const loop = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const vw = window.innerWidth, vh = window.innerHeight;
      const ps = particlesRef.current;

      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.x        += p.vx * dt;
        p.y        += p.vy * dt;
        p.rotation += p.rotSpeed * dt;
        if (p.x < -100 || p.x > vw + 100 || p.y < -100 || p.y > vh + 100) {
          ps.splice(i, 1);
        }
      }
      while (ps.length < 24) ps.push(spawnParticle());

      setTick(t => t + 1);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
    };
  }, []);

  // ── Audio loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let ctx, masterGain, stopped = false, schedulerTimeout, nextLoop;

    function startMusic() {
      if (stopped) return;
      nextLoop = ctx.currentTime + 0.1;
      scheduler();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.0);
    }

    function scheduler() {
      if (stopped) return;
      while (nextLoop < ctx.currentTime + 2.5) {
        scheduleBar(ctx, masterGain, nextLoop);
        nextLoop += LOOP_DUR;
      }
      schedulerTimeout = setTimeout(scheduler, 1500);
    }

    try {
      // eslint-disable-next-line no-undef
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.connect(ctx.destination);
      audioCtxRef.current  = ctx;
      masterGainRef.current = masterGain;

      if (ctx.state === 'running') {
        startMusic();
      } else {
        // Chrome autoplay policy: resume on first user interaction
        const resume = () => {
          ctx.resume().then(() => { if (!stopped) startMusic(); });
        };
        document.addEventListener('click',      resume, { once: true });
        document.addEventListener('touchstart', resume, { once: true });
      }
    } catch (_) { /* Web Audio unavailable */ }

    return () => {
      stopped = true;
      clearTimeout(schedulerTimeout);
      ctx?.close();
    };
  }, []);

  // ── PLAY handler ────────────────────────────────────────────────────────────
  const handlePlay = useCallback(() => {
    // Stop particles
    cancelAnimationFrame(rafRef.current);

    // Fade out music
    const ctx = audioCtxRef.current;
    const mg  = masterGainRef.current;
    if (ctx && mg) {
      try {
        mg.gain.cancelScheduledValues(ctx.currentTime);
        mg.gain.setValueAtTime(mg.gain.value, ctx.currentTime);
        mg.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      } catch (_) {}
    }

    // White flash → hand off to App
    setFlashing(true);
    setTimeout(onStart, 150);
  }, [onStart]);

  return (
    <div className={`title-screen${flashing ? ' title-screen--flash' : ''}`}>
      {/* Floating emoji particles */}
      <div className="ts-particles" aria-hidden="true">
        {particlesRef.current.map(p => (
          <span
            key={p.id}
            className="ts-particle"
            style={{
              left:      p.x + 'px',
              top:       p.y + 'px',
              fontSize:  p.size + 'rem',
              opacity:   p.opacity,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      {/* Animated title */}
      <div className="ts-title-wrap" aria-label="Gas Station Scratchers">
        <span className="ts-word ts-word--gas">Gas</span>
        <span className="ts-word ts-word--station">Station</span>
        <span className="ts-word ts-word--scratchers">Scratchers</span>
      </div>

      {/* PLAY button */}
      <button className="ts-play-btn" onClick={handlePlay}>
        PLAY
      </button>
    </div>
  );
}
