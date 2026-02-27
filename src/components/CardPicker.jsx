import { useState, useEffect, useRef } from 'react';
import './CardPicker.css';

const AUTO_SELECT_MS      = 2000;
const FLOW_AUTO_SELECT_MS = 1400; // faster in flow state

export default function CardPicker({ options, onPick, flowState = false, flowPickResult = null }) {
  const [selected,    setSelected]    = useState(null);
  const [autoProgress, setAutoProgress] = useState(1); // 1 → 0
  const [refreshAnim, setRefreshAnim] = useState(false);
  const autoTimerRef   = useRef(null);
  const autoRafRef     = useRef(null);
  const startRef       = useRef(null);
  const prevOptionsRef = useRef(options);

  const handlePick = (i) => {
    if (selected !== null) return;
    if (flowPickResult !== null) return; // block during result display
    if (!options[i].canAfford) return;
    clearTimeout(autoTimerRef.current);
    cancelAnimationFrame(autoRafRef.current);
    setSelected(i);
    if (!flowState) {
      setTimeout(() => onPick(i), 360);
    } else {
      onPick(i); // flow: immediate, App handles inline result
    }
  };

  // Auto-select — resets whenever options change (handles flow in-place refresh too)
  useEffect(() => {
    setSelected(null);
    startRef.current = performance.now();
    const duration = flowState ? FLOW_AUTO_SELECT_MS : AUTO_SELECT_MS;

    const tickRaf = (now) => {
      const elapsed   = now - startRef.current;
      const remaining = Math.max(0, 1 - elapsed / duration);
      setAutoProgress(remaining);
      if (remaining > 0) autoRafRef.current = requestAnimationFrame(tickRaf);
    };
    autoRafRef.current = requestAnimationFrame(tickRaf);

    autoTimerRef.current = setTimeout(() => {
      const affordable = options.map((_, i) => i).filter(i => options[i].canAfford);
      if (affordable.length > 0) {
        const idx = affordable[Math.floor(Math.random() * affordable.length)];
        setSelected(idx);
        if (!flowState) {
          setTimeout(() => onPick(idx), 360);
        } else {
          onPick(idx);
        }
      }
    }, duration);

    return () => {
      clearTimeout(autoTimerRef.current);
      cancelAnimationFrame(autoRafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  // Shuffle-in animation when flow options refresh in place
  useEffect(() => {
    if (!flowState) { prevOptionsRef.current = options; return; }
    if (prevOptionsRef.current !== options) {
      prevOptionsRef.current = options;
      setRefreshAnim(true);
      const t = setTimeout(() => setRefreshAnim(false), 340);
      return () => clearTimeout(t);
    }
  }, [options, flowState]);

  const isBlocked = flowPickResult !== null;

  return (
    <div className={`card-picker ${flowState ? 'flow-picker' : ''}`}>
      <div className="picker-header">
        <div className="picker-title">
          {flowState ? '⚡ PICK FAST ⚡' : '✦ PICK YOUR CARD ✦'}
        </div>
        <div className="picker-sub">
          {flowState
            ? 'Odds drop each round — stop when ahead!'
            : 'One card hides a guaranteed winner'}
        </div>
      </div>

      <div className="auto-select-track">
        <div className="auto-select-fill" style={{ width: `${autoProgress * 100}%` }} />
      </div>

      <div className={`picker-grid ${refreshAnim ? 'flow-grid-refresh' : ''}`}>
        {options.map((opt, i) => {
          const { theme, cost, canAfford, isDark } = opt;
          const isSelected   = selected === i;
          const isPickResult = flowPickResult?.index === i;
          const isWinCard    = isPickResult && flowPickResult.won;
          const isLoseCard   = isPickResult && !flowPickResult.won;
          const isPending    = isBlocked && !isPickResult;

          return (
            <button
              key={i}
              className={[
                'picker-card',
                !canAfford  ? 'cant-afford'       : '',
                isSelected  ? 'card-selected'     : '',
                isDark      ? 'dark-shimmer'       : '',
                isWinCard   ? 'flow-card-win'     : '',
                isLoseCard  ? 'flow-card-lose'    : '',
                isPending   ? 'flow-card-pending' : '',
              ].filter(Boolean).join(' ')}
              style={{
                background: `linear-gradient(150deg, ${theme.palette.bg[0]} 0%, ${theme.palette.bg[1]} 100%)`,
                borderColor: canAfford ? theme.palette.border : 'rgba(255,255,255,0.1)',
                '--accent': theme.palette.accent,
              }}
              onClick={() => handlePick(i)}
              disabled={!canAfford || isBlocked}
            >
              <div className="picker-card-shine" />
              {isDark && <div className="dark-shimmer-overlay" />}

              {/* Win overlay — gold flash */}
              {isWinCard && <div className="flow-win-overlay" />}
              {/* Lose overlay — red flash */}
              {isLoseCard && <div className="flow-lose-overlay" />}

              {/* Floating prize / no-match text */}
              {isWinCard && flowPickResult.prize > 0 && (
                <div className="flow-prize-float">+{flowPickResult.prize.toLocaleString()} 🪙</div>
              )}
              {isLoseCard && (
                <div className="flow-lose-text">No match</div>
              )}

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

              {canAfford && !isBlocked && (
                <div className="picker-question" style={{ color: `${theme.palette.border}55` }}>?</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
