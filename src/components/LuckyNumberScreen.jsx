import { useState, useEffect } from 'react';
import './LuckyNumberScreen.css';

function pickFiveUnique() {
  const set = new Set();
  while (set.size < 5) set.add(Math.floor(Math.random() * 99) + 1);
  return [...set];
}

// Organic scattered positions — not a grid, not a row.
// Each entry: { left%, top%, rot deg, fontSize }
const SCATTER = [
  { left: '8%',  top: '12%', rot: -7,  fs: '3.4rem' },
  { left: '58%', top:  '6%', rot:  4,  fs: '2.9rem' },
  { left: '28%', top: '38%', rot: -2,  fs: '4.1rem' },
  { left: '62%', top: '56%', rot:  8,  fs: '2.7rem' },
  { left:  '4%', top: '62%', rot: -5,  fs: '3.2rem' },
];

export default function LuckyNumberScreen({ onPick }) {
  const [numbers]  = useState(pickFiveUnique);
  const [selected, setSelected] = useState(null);
  const [visible,  setVisible]  = useState(false);

  // Numbers float in after a short pause — Grig speaks first
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 380);
    return () => clearTimeout(t);
  }, []);

  const handlePick = (n, i) => {
    if (selected !== null) return;
    setSelected(i);
    setTimeout(() => onPick(n), 550);
  };

  return (
    <div className="lns-overlay">
      <div className="lns-field">
        {numbers.map((n, i) => {
          const s          = SCATTER[i];
          const isSelected = selected === i;
          const isFaded    = selected !== null && selected !== i;

          return (
            <button
              key={i}
              className={[
                'lns-num',
                visible    ? 'lns-num--visible'  : '',
                isSelected ? 'lns-num--selected' : '',
                isFaded    ? 'lns-num--faded'    : '',
              ].filter(Boolean).join(' ')}
              style={{
                left:           s.left,
                top:            s.top,
                fontSize:       s.fs,
                transform:      `rotate(${s.rot}deg)`,
                '--rot':        `${s.rot}deg`,
                animationDelay: `${i * 0.06}s`,
              }}
              onClick={() => handlePick(n, i)}
            >
              {String(n).padStart(2, '0')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
