import './PrizeTierTable.css';

const TIERS = [
  { label: '🏆 JACKPOT',  matches: '3 numbers', prize: '500× price', chance: '1%'  },
  { label: '💎 BIG WIN',  matches: '2 numbers', prize: '150× price', chance: '4%'  },
  { label: '⭐ WIN',      matches: '1 number',  prize: '30× price',  chance: '15%' },
  { label: '🎉 SMALL WIN',matches: '1 number',  prize: '8× price',   chance: '30%' },
  { label: '😔 NO WIN',   matches: '—',         prize: '—',          chance: '50%' },
];

export default function PrizeTierTable({ visible, onClose }) {
  if (!visible) return null;
  return (
    <div className="tier-overlay" onClick={onClose}>
      <div className="tier-modal" onClick={(e) => e.stopPropagation()}>
        <h3>How to Play</h3>
        <p className="how-to">Match any of your <strong>9 numbers</strong> to the <strong>5 Lucky Numbers</strong> to win that cell's prize.</p>
        <table>
          <thead>
            <tr>
              <th>Result</th>
              <th>Matches</th>
              <th>Prize</th>
              <th>Odds</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((t) => (
              <tr key={t.label}>
                <td>{t.label}</td>
                <td>{t.matches}</td>
                <td>{t.prize}</td>
                <td>{t.chance}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="cost-note">Cards cost 1–20 <span className="coin">🪙</span> · 120 themes</p>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
