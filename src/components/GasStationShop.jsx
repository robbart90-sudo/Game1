import './GasStationShop.css';

// ─────────────────────────────────────────────────────────────────────────────
// SHOP ITEMS — edit prices and descriptions here.
// id           emoji  name            cost   desc shown in tooltip
// ─────────────────────────────────────────────────────────────────────────────
export const SHOP_ITEMS = [
  { id: 'coffee',    emoji: '☕', name: 'Coffee',     cost: 3, desc: '+10 sec'          },
  { id: 'fries',     emoji: '🍟', name: 'Fries',      cost: 4, desc: 'Big brush · 10s'  },
  { id: 'gas',       emoji: '⛽', name: 'Gas',        cost: 5, desc: 'Fill Flow State'  },
  { id: 'hotdog',    emoji: '🌭', name: 'Hot Dog',    cost: 4, desc: 'Auto-scratch'     },
  { id: 'slushee',   emoji: '🥤', name: 'Slushee',    cost: 3, desc: 'Freeze timer · 5s'},
  { id: 'luckystar', emoji: '⭐', name: 'Lucky Star', cost: 5, desc: 'Next card wins'   },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function GasStationShop({
  balance, phase, brushBoostSecs, slusheeSecs, nextCardWin, onBuy,
}) {
  return (
    <div className="gss-wrap">
      <div className="gss-row">
        {SHOP_ITEMS.map(({ id, emoji, name, cost, desc }) => {
          const isActive =
            (id === 'fries'     && brushBoostSecs > 0) ||
            (id === 'slushee'   && slusheeSecs    > 0) ||
            (id === 'luckystar' && nextCardWin);
          const cantAfford = balance < cost;
          // Hot Dog needs an active card to scratch
          const notAvail   = id === 'hotdog' && phase !== 'playing';
          const disabled   = cantAfford || notAvail || isActive;

          return (
            <button
              key={id}
              className={[
                'gss-btn',
                isActive   ? 'gss-btn--active'     : '',
                !disabled  ? 'gss-btn--affordable' : '',
                cantAfford ? 'gss-btn--broke'      : '',
              ].join(' ')}
              disabled={disabled}
              onClick={() => onBuy(id)}
              title={desc}
            >
              <span className="gss-emoji">{emoji}</span>
              <span className="gss-name">{name}</span>
              <span className="gss-cost">{cost}🪙</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
