import { useState } from 'react';
import './CardPicker.css';

export default function CardPicker({ options, onPick }) {
  const [selected, setSelected] = useState(null);

  const handlePick = (i) => {
    if (selected !== null) return;
    if (!options[i].canAfford) return;
    setSelected(i);
    setTimeout(() => onPick(i), 380);
  };

  return (
    <div className="card-picker">
      <div className="picker-header">
        <div className="picker-title">✦ PICK YOUR CARD ✦</div>
        <div className="picker-sub">One card hides a guaranteed winner</div>
      </div>

      <div className="picker-grid">
        {options.map((opt, i) => {
          const { theme, cost, canAfford } = opt;
          const isSelected = selected === i;
          return (
            <button
              key={i}
              className={`picker-card
                ${!canAfford ? 'cant-afford' : ''}
                ${isSelected ? 'card-selected' : ''}
              `}
              style={{
                background: `linear-gradient(150deg, ${theme.palette.bg[0]} 0%, ${theme.palette.bg[1]} 100%)`,
                borderColor: canAfford ? theme.palette.border : 'rgba(255,255,255,0.1)',
                '--accent': theme.palette.accent,
              }}
              onClick={() => handlePick(i)}
              disabled={!canAfford || selected !== null}
            >
              {/* Shine layer */}
              <div className="picker-card-shine" />

              {/* Card back content */}
              <div className="picker-card-inner">
                <div
                  className="picker-emoji"
                  style={{ filter: canAfford ? 'none' : 'grayscale(1)' }}
                >
                  {theme.emoji}
                </div>
                <div
                  className="picker-name"
                  style={{ color: canAfford ? theme.palette.text : 'rgba(255,255,255,0.25)' }}
                >
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
                {!canAfford && (
                  <div className="picker-cant-label">Can't afford</div>
                )}
              </div>

              {/* Question mark overlay on card back */}
              {canAfford && (
                <div
                  className="picker-question"
                  style={{ color: `${theme.palette.border}55` }}
                >
                  ?
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
