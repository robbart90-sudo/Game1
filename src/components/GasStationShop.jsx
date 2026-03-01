import './GasStationShop.css';

// ─────────────────────────────────────────────────────────────────────────────
// SHOP ITEMS — edit prices and descriptions here.
// id           emoji  name            cost   desc shown in tooltip
// ─────────────────────────────────────────────────────────────────────────────
export const SHOP_ITEMS = [
  { id: 'coffee',    emoji: '☕', name: 'Coffee',     cost: 25,     label: 'More Time'            },
  { id: 'fries',     emoji: '🍟', name: 'Fries',      cost: 15,     label: 'Bigger Brush'         },
  { id: 'gas',       emoji: '⛽', name: 'Gas',        cost: 30,     label: 'Fill Flow State'      },
  { id: 'hotdog',    emoji: '🌭', name: 'Hot Dog',    cost: 20,     label: 'Auto Scratch'         },
  { id: 'slushee',   emoji: '🥤', name: 'Slushee',    cost: 35,     label: 'Freeze Timer'         },
  { id: 'luckystar', emoji: '⭐', name: 'Lucky Star', cost: 50,     label: 'Next Win Guaranteed'  },
  { id: 'car',       emoji: '🚗', name: 'A Car',      cost: 100000, label: 'Beat The Level!'      },
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

      {/* ── Regular powerups — 2 × 3 grid ──────────────────────────── */}
      <div className="gss-grid">
        {regularItems.map(({ id, emoji, name, cost, label }) => {
          const { isActive, cantAfford, disabled } = itemState({ id, cost });
          return (
            <div key={id} className="gss-item">
              <span className="gss-label">{label}</span>
              <button
                className={[
                  'gss-btn',
                  isActive    ? 'gss-btn--active'     : '',
                  !disabled   ? 'gss-btn--affordable' : '',
                  cantAfford  ? 'gss-btn--broke'      : '',
                ].join(' ')}
                disabled={disabled}
                onClick={() => onBuy(id)}
              >
                <span className="gss-emoji">{emoji}</span>
                <span className="gss-name">{name}</span>
                <span className="gss-cost">{cost}🪙</span>
              </button>
            </div>
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
