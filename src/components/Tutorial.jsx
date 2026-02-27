import { useState } from 'react';
import './Tutorial.css';

const LS_KEY = 'sw_tutorial_seen';

export function tutorialHasSeen() {
  return localStorage.getItem(LS_KEY) === '1';
}

function markSeen() {
  localStorage.setItem(LS_KEY, '1');
}

const STEPS = [
  {
    label: '1 / 4',
    title: 'Scratch to Reveal',
    body: 'Drag your finger across the silver surface. Your numbers are hiding underneath.',
  },
  {
    label: '2 / 4',
    title: 'Match to Win',
    body: 'Any revealed number that matches a Lucky Number earns you that prize. More matches = bigger payout.',
  },
  {
    label: '3 / 4',
    title: 'Build Your Heat',
    body: 'Wins charge the Heat Meter. Hit 100% to enter ⚡ FLOW STATE — where the odds flip heavily in your favor.',
  },
  {
    label: '4 / 4',
    title: 'Clock Is Ticking',
    body: 'You have 60 seconds. Pick fast, scratch fast, win big. Good luck.',
  },
];

function Visual({ step }) {
  switch (step) {
    case 0:
      return (
        <div className="tut-visual tut-v-scratch">
          <div className="tut-foil">✦ SCRATCH ✦</div>
          <div className="tut-finger">☝️</div>
        </div>
      );
    case 1:
      return (
        <div className="tut-visual tut-v-match">
          <div className="tut-mini-label">LUCKY NUMBERS</div>
          <div className="tut-num-row">
            <span className="tut-num tut-lucky">07</span>
            <span className="tut-num tut-lucky">11</span>
            <span className="tut-num tut-lucky">42</span>
          </div>
          <div className="tut-match-arrow">↕</div>
          <div className="tut-mini-label">YOUR NUMBERS</div>
          <div className="tut-num-row">
            <span className="tut-num tut-win">07 ✓</span>
            <span className="tut-num">15</span>
            <span className="tut-num">33</span>
          </div>
        </div>
      );
    case 2:
      return (
        <div className="tut-visual tut-v-heat">
          <div className="tut-heat-row">
            <span className="tut-heat-lbl">🔥 HEAT</span>
            <span className="tut-heat-pct">83%</span>
          </div>
          <div className="tut-heat-track">
            <div className="tut-heat-fill" />
          </div>
          <div className="tut-flow-pill">⚡ FLOW STATE ⚡</div>
        </div>
      );
    case 3:
      return (
        <div className="tut-visual tut-v-timer">
          <div className="tut-big-clock">0:45</div>
          <div className="tut-clock-sub">SECONDS LEFT</div>
        </div>
      );
    default:
      return null;
  }
}

export default function Tutorial({ onDone }) {
  const [step, setStep]     = useState(0);
  const [exiting, setExiting] = useState(false);

  const finish = () => {
    markSeen();
    setExiting(true);
    setTimeout(onDone, 480);
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      finish();
    }
  };

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="tut-overlay" onClick={next}>
      <div
        className={`tut-card ${exiting ? 'tut-exit' : 'tut-enter'}`}
        onClick={next}
      >
        <button
          className="tut-skip"
          onClick={(e) => { e.stopPropagation(); finish(); }}
        >
          Skip ×
        </button>

        <div className="tut-step-label">{s.label}</div>

        <Visual key={step} step={step} />

        <h2 className="tut-title">{s.title}</h2>
        <p className="tut-body">{s.body}</p>

        <button
          className="tut-next-btn"
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          {isLast ? "Let's Play! 🎟️" : 'Got it →'}
        </button>

        <div className="tut-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={`tut-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
