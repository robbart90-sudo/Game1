import { useState } from 'react';
import './Tutorial.css';

const LS_KEY = 'sw_tutorial_seen';

export function tutorialHasSeen() {
  return localStorage.getItem(LS_KEY) === '1';
}

function markSeen() {
  localStorage.setItem(LS_KEY, '1');
}

const SLIDES = [
  {
    emoji: '🎟️',
    headline: 'Scratch to Win',
    body: 'Pick a card, scratch to reveal the numbers. Match enough to win coins. The more you pay for a card, the better your odds.',
  },
  {
    emoji: '⏱️',
    headline: 'The Clock Is Always Running',
    body: "You're racing the timer. Low time and low coins build your Flow State faster. Pressure is your friend.",
  },
  {
    emoji: '⚡',
    headline: 'Get Into Flow State',
    body: 'Fill the Flow State meter by winning and scratching fast. Hit 100% to freeze the timer, guarantee winners, and bend the game in your favor.',
  },
  {
    emoji: '⛽',
    headline: "Grig's Got What You Need",
    body: 'Spend coins at the counter for powerups — more time, bigger brush, instant Flow State. Use the row buttons on the left to auto-scratch entire rows at once.',
  },
  {
    emoji: '🔥',
    headline: 'Push Your Luck',
    body: 'Win consecutive cards to build a streak — payouts multiply up to 3×. Watch for red-bordered Risk Cards on the picker. Double or nothing. Your call.',
  },
];

export default function Tutorial({ onDone }) {
  const [step, setStep]       = useState(0);
  const [exiting, setExiting] = useState(false);

  const finish = () => {
    markSeen();
    setExiting(true);
    setTimeout(onDone, 420);
  };

  const next = () => {
    if (step < SLIDES.length - 1) {
      setStep(s => s + 1);
    } else {
      finish();
    }
  };

  const s      = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return (
    <div className="tut-overlay" onClick={next}>
      <div
        className={`tut-card ${exiting ? 'tut-exit' : 'tut-enter'}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="tut-skip"
          onClick={(e) => { e.stopPropagation(); finish(); }}
        >
          Skip ×
        </button>

        <div className="tut-emoji" key={step}>{s.emoji}</div>

        <h2 className="tut-title">{s.headline}</h2>
        <p className="tut-body">{s.body}</p>

        <button
          className="tut-next-btn"
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          {isLast ? "Let's Go 🎟️" : 'Next →'}
        </button>

        <div className="tut-dots">
          {SLIDES.map((_, i) => (
            <span key={i} className={`tut-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
