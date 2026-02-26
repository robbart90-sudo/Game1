import './PrizeTierTable.css';
import { PRIZE_TIERS } from '../utils/lottery';

export default function PrizeTierTable({ visible, onClose }) {
  if (!visible) return null;
  return (
    <div className="tier-overlay" onClick={onClose}>
      <div className="tier-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Prize Tiers</h3>
        <table>
          <thead>
            <tr>
              <th>Prize</th>
              <th>Coins</th>
              <th>Odds</th>
            </tr>
          </thead>
          <tbody>
            {PRIZE_TIERS.map((tier) => (
              <tr key={tier.id} style={{ borderLeft: `4px solid ${tier.color}` }}>
                <td>{tier.label}</td>
                <td>{tier.amount > 0 ? `+${tier.amount}` : '—'}</td>
                <td>{(tier.chance * 100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="cost-note">Each card costs 10 🪙</p>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
