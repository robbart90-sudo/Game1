import './GasStationShop.css';
import { MAX_ITEM_PURCHASES } from '../utils/lottery';

// ─────────────────────────────────────────────────────────────────────────────
// SHOP ITEMS — edit prices and descriptions here.
// ─────────────────────────────────────────────────────────────────────────────
export const SHOP_ITEMS = [
  { id: 'coffee',    emoji: '☕', name: 'Coffee',     cost: 25,    label: 'More Time',           category: 'time',    desc: 'Adds 10 seconds'             },
  { id: 'fries',     emoji: '🍟', name: 'Fries',      cost: 15,    label: 'Bigger Brush',        category: 'scratch', desc: '50% bigger brush for 10s'    },
  { id: 'gas',       emoji: '⛽', name: 'Gas',        cost: 30,    label: 'Fill Flow State',     category: 'flow',    desc: 'Fills Flow State instantly'  },
  { id: 'hotdog',    emoji: '🌭', name: 'Hot Dog',    cost: 20,    label: 'Auto Scratch',        category: 'scratch', desc: 'Auto-scratches card in 1s'   },
  { id: 'slushee',   emoji: '🥤', name: 'Slushee',    cost: 35,    label: 'Freeze Timer',        category: 'time',    desc: 'Freezes timer for 5s'        },
  { id: 'luckystar', emoji: '⭐', name: 'Lucky Star', cost: 50,    label: 'Next Win Guaranteed', category: 'luck',    desc: 'Next card guaranteed win'    },
  { id: 'car',       emoji: '🚗', name: 'A Car',      cost: 25000, label: 'Beat The Level!',     category: 'car',     desc: 'Beat The Level!'             },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function GasStationShop({
  balance, phase, brushBoostSecs, slusheeSecs, nextCardWin, purchaseCounts = {}, onBuy,
}) {
  const itemState = ({ id, cost }) => {
    const isActive   = (id === 'fries'     && brushBoostSecs > 0)
                    || (id === 'slushee'   && slusheeSecs    > 0)
                    || (id === 'luckystar' && nextCardWin);
    const cantAfford = balance < cost;
    const notAvail   = id === 'hotdog' && phase !== 'playing';
    const isMaxed    = id !== 'car' && (purchaseCounts[id] || 0) >= MAX_ITEM_PURCHASES;
    return { isActive, cantAfford, isMaxed, disabled: isMaxed || cantAfford || notAvail || isActive };
  };

  return (
    <div className="gss-wrap">

      {/* ── Section header ──────────────────────────────────────────── */}
      <div className="gss-header">⛽ Grig's Counter</div>

      {/* ── All items: 2×3 grid + full-width car at bottom ──────────── */}
      <div className="gss-grid">
        {SHOP_ITEMS.map(({ id, emoji, name, cost, desc, category }) => {
          const { isActive, cantAfford, isMaxed, disabled } = itemState({ id, cost });
          const purchaseCount = purchaseCounts[id] || 0;

          /* ── Car: full-width horizontal card ─────────────────────── */
          if (id === 'car') {
            return (
              <button
                key={id}
                className={[
                  'gss-card gss-card--car',
                  !disabled  ? 'gss-card--affordable' : '',
                  cantAfford ? 'gss-card--broke'      : '',
                ].filter(Boolean).join(' ')}
                disabled={disabled}
                onClick={() => onBuy(id)}
              >
                <span className="gss-car-emoji">{emoji}</span>
                <span className="gss-car-content">
                  <span className="gss-card-name">{name}</span>
                  <span className="gss-card-desc">{desc}</span>
                </span>
                <span className="gss-car-price">{cost.toLocaleString()}<span className="coin">🪙</span></span>
              </button>
            );
          }

          /* ── Regular powerup card ─────────────────────────────────── */
          const activeSecs = id === 'fries' ? brushBoostSecs
                           : id === 'slushee' ? slusheeSecs
                           : 0;

          const classes = [
            'gss-card',
            `gss-card--${category}`,
            isActive   ? 'gss-card--active'     : '',
            isMaxed    ? 'gss-card--maxed'       : '',
            !disabled  ? 'gss-card--affordable' : '',
            cantAfford && !isMaxed ? 'gss-card--broke' : '',
          ].filter(Boolean).join(' ');

          return (
            <button
              key={id}
              className={classes}
              disabled={disabled}
              onClick={() => onBuy(id)}
            >
              {isActive ? (
                <div className="gss-active-body">
                  {activeSecs > 0
                    ? <span className="gss-active-secs">{activeSecs}s</span>
                    : <span className="gss-active-check">✓</span>
                  }
                  <span className="gss-active-label">active</span>
                </div>
              ) : (
                <>
                  {!isMaxed && <span className="gss-badge">{cost}<span className="coin">🪙</span></span>}
                  <span className="gss-card-emoji">{emoji}</span>
                  <span className="gss-card-name">{name}</span>
                  <span className="gss-card-desc">{isMaxed ? 'Sold out' : desc}</span>
                </>
              )}
              <div className="gss-purchase-dots">
                {Array.from({ length: MAX_ITEM_PURCHASES }, (_, i) => (
                  <span key={i} className={`gss-purchase-dot${i < purchaseCount ? ' used' : ''}`} />
                ))}
              </div>
              {/* Desktop hover tooltip — visible only at ≥900px after 600ms */}
              <div className="gss-tooltip" role="tooltip">
                <span className="gss-tooltip-emoji">{emoji}</span>
                <span className="gss-tooltip-effect">{desc}</span>
                <span className="gss-tooltip-count">{purchaseCount} of {MAX_ITEM_PURCHASES} used</span>
                <span className="gss-tooltip-cost">{cost}<span className="coin">🪙</span></span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
