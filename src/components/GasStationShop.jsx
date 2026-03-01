import './GasStationShop.css';

// ─────────────────────────────────────────────────────────────────────────────
// SHOP ITEMS — edit prices and descriptions here.
// ─────────────────────────────────────────────────────────────────────────────
export const SHOP_ITEMS = [
  { id: 'coffee',    emoji: '☕', name: 'Coffee',     cost: 25,     label: 'More Time',           category: 'time',    desc: 'Adds 10 seconds'             },
  { id: 'fries',     emoji: '🍟', name: 'Fries',      cost: 15,     label: 'Bigger Brush',        category: 'scratch', desc: '50% bigger brush for 10s'    },
  { id: 'gas',       emoji: '⛽', name: 'Gas',        cost: 30,     label: 'Fill Flow State',     category: 'flow',    desc: 'Fills Flow State instantly'  },
  { id: 'hotdog',    emoji: '🌭', name: 'Hot Dog',    cost: 20,     label: 'Auto Scratch',        category: 'scratch', desc: 'Auto-scratches card in 1s'   },
  { id: 'slushee',   emoji: '🥤', name: 'Slushee',    cost: 35,     label: 'Freeze Timer',        category: 'time',    desc: 'Freezes timer for 5s'        },
  { id: 'luckystar', emoji: '⭐', name: 'Lucky Star', cost: 50,     label: 'Next Win Guaranteed', category: 'luck',    desc: 'Next card guaranteed win'    },
  { id: 'car',       emoji: '🚗', name: 'A Car',      cost: 100000, label: 'Beat The Level!',     category: 'luck',    desc: 'Beat The Level!'             },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function GasStationShop({
  balance, phase, brushBoostSecs, slusheeSecs, nextCardWin, onBuy,
}) {
  const regularItems = SHOP_ITEMS.filter(i => i.id !== 'car');
  const carItem      = SHOP_ITEMS.find(i => i.id === 'car');

  const itemState = ({ id, cost }) => {
    const isActive  = (id === 'fries'     && brushBoostSecs > 0)
                   || (id === 'slushee'   && slusheeSecs    > 0)
                   || (id === 'luckystar' && nextCardWin);
    const cantAfford = balance < cost;
    const notAvail   = id === 'hotdog' && phase !== 'playing';
    return { isActive, cantAfford, disabled: cantAfford || notAvail || isActive };
  };

  return (
    <div className="gss-wrap">

      {/* ── Section header ──────────────────────────────────────────── */}
      <div className="gss-header">⛽ Grig's Counter</div>

      {/* ── Regular powerups — 2×3 grid on desktop, scroll row mobile ─ */}
      <div className="gss-grid">
        {regularItems.map(({ id, emoji, name, cost, desc, category }) => {
          const { isActive, cantAfford, disabled } = itemState({ id, cost });

          // Seconds remaining for active timed powerups
          const activeSecs = id === 'fries' ? brushBoostSecs
                           : id === 'slushee' ? slusheeSecs
                           : 0;

          const classes = [
            'gss-card',
            `gss-card--${category}`,
            isActive   ? 'gss-card--active'     : '',
            !disabled  ? 'gss-card--affordable' : '',
            cantAfford ? 'gss-card--broke'      : '',
          ].filter(Boolean).join(' ');

          return (
            <button
              key={id}
              className={classes}
              disabled={disabled}
              onClick={() => onBuy(id)}
            >
              {isActive ? (
                /* Active state: large seconds or check, replaces normal content */
                <div className="gss-active-body">
                  {activeSecs > 0
                    ? <span className="gss-active-secs">{activeSecs}s</span>
                    : <span className="gss-active-check">✓</span>
                  }
                  <span className="gss-active-label">active</span>
                </div>
              ) : (
                <>
                  <span className="gss-badge">{cost}🪙</span>
                  <span className="gss-card-emoji">{emoji}</span>
                  <span className="gss-card-name">{name}</span>
                  <span className="gss-card-desc">{desc}</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Car — full-width win item ───────────────────────────────── */}
      {carItem && (() => {
        const { cantAfford, disabled } = itemState(carItem);
        return (
          <div className="gss-car-row">
            <button
              className={[
                'gss-btn gss-btn--car',
                !disabled  ? 'gss-btn--affordable' : '',
                cantAfford ? 'gss-btn--broke'      : '',
              ].join(' ')}
              disabled={disabled}
              onClick={() => onBuy('car')}
            >
              <span className="gss-emoji gss-car-emoji">{carItem.emoji}</span>
              <span className="gss-car-body">
                <span className="gss-name">{carItem.name}</span>
                <span className="gss-car-sub">{carItem.label}</span>
              </span>
              <span className="gss-cost gss-car-cost">
                {carItem.cost.toLocaleString()}🪙
              </span>
            </button>
          </div>
        );
      })()}
    </div>
  );
}
