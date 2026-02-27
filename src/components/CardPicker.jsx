import { useState, useEffect, useRef } from 'react';
import './CardPicker.css';

const AUTO_SELECT_MS = 2000;

export default function CardPicker({ options, onPick, flowState = false }) {
  const [selected,      setSelected]      = useState(null);
  const [autoProgress,  setAutoProgress]  = useState(1); // 1 → 0 over AUTO_SELECT_MS
  const autoTimerRef = useRef(null);
  const autoRafRef   = useRef(null);
  const startRef     = useRef(null);

  const handlePick = (i) => {
    if (selected !== null) return;
    if (!options[i].canAfford) return;
    // Cancel auto-select
    clearTimeout(autoTimerRef.current);
    cancelAnimationFrame(autoRafRef.current);
    setSelected(i);
    setTimeout(() => onPick(i), 360);
  };

  // Auto-select: after 2s, pick a random affordable card
  useEffect(() => {
    startRef.current = performance.now();

    // Animate the countdown bar
    const tickRaf = (now) => {
      const elapsed = now - startRef.current;
      const remaining = Math.max(0, 1 - elapsed / AUTO_SELECT_MS);
      setAutoProgress(remaining);
      if (remaining > 0) {
        autoRafRef.current = requestAnimationFrame(tickRaf);
      }
    };
    autoRafRef.current = requestAnimationFrame(tickRaf);

    autoTimerRef.current = setTimeout(() => {
      const affordable = options.map((o, i) => i).filter(i => options[i].canAfford);
      if (affordable.length > 0 && selected === null) {
        const idx = affordable[Math.floor(Math.random() * affordable.length)];
        setSelected(idx);
        setTimeout(() => onPick(idx), 360);
      }
    }, AUTO_SELECT_MS);

    return () => {
      clearTimeout(autoTimerRef.current);
      cancelAnimationFrame(autoRafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return (
    <div className={`card-picker ${flowState ? 'flow-picker' : ''}`}>
      <div className="picker-header">
        <div className="picker-title">
          {flowState ? '⚡ PICK FAST ⚡' : '✦ PICK YOUR CARD ✦'}
        </div>
        <div className="picker-sub">
          {flowState
            ? 'Flow State — cards auto-scratch!'
            : 'One card hides a guaranteed winner'}
        </div>
      </div>

      {/* Auto-select countdown bar */}
      <div className="auto-select-track">
        <div
          className="auto-select-fill"
          style={{ width: `${autoProgress * 100}%` }}
        />
      </div>

      <div className="picker-grid">
        {options.map((opt, i) => {
          const { theme, cost, canAfford, isDark } = opt;
          const isSelected = selected === i;
          return (
            <button
              key={i}
              className={[
                'picker-card',
                !canAfford  ? 'cant-afford'   : '',
                isSelected  ? 'card-selected' : '',
                isDark      ? 'dark-shimmer'  : '',
              ].join(' ')}
              style={{
                background: `linear-gradient(150deg, ${theme.palette.bg[0]} 0%, ${theme.palette.bg[1]} 100%)`,
                borderColor: canAfford ? theme.palette.border : 'rgba(255,255,255,0.1)',
                '--accent': theme.palette.accent,
              }}
              onClick={() => handlePick(i)}
              disabled={!canAfford || selected !== null}
            >
              <div className="picker-card-shine" />
              {/* Barely-perceptible dark shimmer on non-winner cards in Flow Round 4+ */}
              {isDark && <div className="dark-shimmer-overlay" />}

              <div className="picker-card-inner">
                <div className="picker-emoji" style={{ filter: canAfford ? 'none' : 'grayscale(1)' }}>
                  {theme.emoji}
                </div>
                <div className="picker-name" style={{ color: canAfford ? theme.palette.text : 'rgba(255,255,255,0.25)' }}>
                  {theme.name}
                </div>
                <div
                  className="picker-price-badge"
                  style={{
                    color: canAfford ? theme.palette.accent : 'rgba(255,255,255,0.2)',
                    borderColor: canAfford ? `${theme.palette.border}88` : 'rgba(255,255,255,0.1)',
                  }}
                >
                  {cost} 🪙
                </div>
                {!canAfford && <div className="picker-cant-label">Can't afford</div>}
              </div>

              {canAfford && (
                <div className="picker-question" style={{ color: `${theme.palette.border}55` }}>?</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
