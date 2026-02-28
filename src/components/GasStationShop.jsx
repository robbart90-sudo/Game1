import './GasStationShop.css';

// ─────────────────────────────────────────────────────────────────────────────
// SHOP ITEMS — edit prices and descriptions here.
// id           emoji  name            cost   desc shown in tooltip
// ─────────────────────────────────────────────────────────────────────────────
// ── BALANCE CONSTANTS — shop prices; edit here to tune economy ────────────────
export const SHOP_ITEMS = [
  { id: 'coffee',    emoji: '☕', name: 'Coffee',     cost: 25, label: 'More Time'            },
  { id: 'fries',     emoji: '🍟', name: 'Fries',      cost: 15, label: 'Bigger Brush'         },
  { id: 'gas',       emoji: '⛽', name: 'Gas',        cost: 30, label: 'Fill Flow State'      },
  { id: 'hotdog',    emoji: '🌭', name: 'Hot Dog',    cost: 20, label: 'Auto Scratch'         },
  { id: 'slushee',   emoji: '🥤', name: 'Slushee',    cost: 35, label: 'Freeze Timer'         },
  { id: 'luckystar', emoji: '⭐', name: 'Lucky Star', cost: 50, label: 'Next Win Guaranteed'  },
];
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export default function GasStationShop({
  balance, phase, brushBoostSecs, slusheeSecs, nextCardWin, onBuy,
}) {
  return (
    <div className="gss-wrap">
      <div className="gss-row">
        {SHOP_ITEMS.map(({ id, emoji, name, cost, label }) => {
          const isActive =
            (id === 'fries'     && brushBoostSecs > 0) ||
            (id === 'slushee'   && slusheeSecs    > 0) ||
            (id === 'luckystar' && nextCardWin);
          const cantAfford = balance < cost;
          // Hot Dog needs an active card to scratch
          const notAvail   = id === 'hotdog' && phase !== 'playing';
          const disabled   = cantAfford || notAvail || isActive;

          return (
            <div key={id} className="gss-item">
              <span className="gss-label">{label}</span>
              <button
                className={[
                  'gss-btn',
                  isActive   ? 'gss-btn--active'     : '',
                  !disabled  ? 'gss-btn--affordable' : '',
                  cantAfford ? 'gss-btn--broke'      : '',
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
    </div>
  );
}
