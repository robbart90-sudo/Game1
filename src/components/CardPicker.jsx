import { useState, useEffect, useRef } from 'react';
import './CardPicker.css';

export default function CardPicker({ options, onPick, flowState = false, flowPickResult = null }) {
  const [selected,    setSelected]    = useState(null);
  const [refreshAnim, setRefreshAnim] = useState(false);
  const prevOptionsRef = useRef(options);

  const handlePick = (i) => {
    if (selected !== null) return;
    if (flowPickResult !== null) return; // block during result display
    if (!options[i].canAfford) return;
    setSelected(i);
    if (!flowState) {
      setTimeout(() => onPick(i), 360);
    } else {
      onPick(i); // flow: immediate, App handles inline result
    }
  };

  // Reset selection whenever options change (handles flow in-place refresh too)
  useEffect(() => {
    setSelected(null);
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

      <div className={`picker-grid ${refreshAnim ? 'flow-grid-refresh' : ''}`}>
        {options.map((opt, i) => {
          const { theme, cost, canAfford, isDark, isRisk } = opt;
          const isSelected   = selected === i;
          const isPickResult = flowPickResult?.index === i;
          const isWinCard    = isPickResult && flowPickResult.won;
          const isLoseCard   = isPickResult && !flowPickResult.won;
          const isPending    = isBlocked && !isPickResult;

          return (
            <div key={i} className="picker-item-wrap">
              <button
                className={[
                  'picker-card',
                  !canAfford  ? 'cant-afford'        : '',
                  isSelected  ? 'card-selected'      : '',
                  isDark      ? 'dark-shimmer'        : '',
                  isRisk      ? 'picker-card--risk'   : '',
                  isWinCard   ? 'flow-card-win'      : '',
                  isLoseCard  ? 'flow-card-lose'     : '',
                  isPending   ? 'flow-card-pending'  : '',
                ].filter(Boolean).join(' ')}
                style={{
                  background: isRisk
                    ? 'linear-gradient(150deg, #2a0000 0%, #1a0000 100%)'
                    : `linear-gradient(150deg, ${theme.palette.bg[0]} 0%, ${theme.palette.bg[1]} 100%)`,
                  borderColor: isRisk ? '#D81F26' : (canAfford ? theme.palette.border : 'rgba(255,255,255,0.1)'),
                  '--accent': isRisk ? '#FF4444' : theme.palette.accent,
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
                    {isRisk ? '⚠️' : theme.emoji}
                  </div>
                  <div className="picker-name" style={{ color: isRisk ? '#FF6666' : (canAfford ? theme.palette.text : 'rgba(255,255,255,0.25)') }}>
                    {isRisk ? 'RISK' : theme.name}
                  </div>
                  <div
                    className="picker-price-badge"
                    style={{
                      color: isRisk ? '#FF4444' : (canAfford ? theme.palette.accent : 'rgba(255,255,255,0.2)'),
                      borderColor: isRisk ? '#D81F2688' : (canAfford ? `${theme.palette.border}88` : 'rgba(255,255,255,0.1)'),
                    }}
                  >
                    {cost} 🪙
                  </div>
                  {!canAfford && <div className="picker-cant-label">Can't afford</div>}
                </div>

                {canAfford && !isBlocked && !isRisk && (
                  <div className="picker-question" style={{ color: `${theme.palette.border}55` }}>?</div>
                )}
              </button>
              {isRisk && canAfford && (
                <div className="risk-card-label">⚠ DOUBLE OR NOTHING</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
