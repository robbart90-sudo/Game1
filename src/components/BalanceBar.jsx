import './BalanceBar.css';
import { useAnimatedValue } from '../hooks/useAnimatedValue';

export default function BalanceBar({ balance, totalWon, cardsPlayed, speedMode, onSpeedToggle, balanceDuration = 600 }) {
  const animBalance = useAnimatedValue(balance, balanceDuration);
  const animWon     = useAnimatedValue(totalWon, 800);

  return (
    <div className="balance-bar">
      <div className="stat">
        <span className="stat-label">Balance</span>
        <span className="stat-value coins">{animBalance.toLocaleString()} 🪙</span>
      </div>
      <div className="divider" />
      <div className="stat">
        <span className="stat-label">Cards</span>
        <span className="stat-value">{cardsPlayed}</span>
      </div>
      <div className="divider" />
      <div className="stat">
        <span className="stat-label">Won</span>
        <span className="stat-value won">{animWon.toLocaleString()} 🪙</span>
      </div>
      <div className="divider" />
      <button
        className={`speed-toggle ${speedMode ? 'on' : ''}`}
        onClick={onSpeedToggle}
        title={speedMode ? 'Speed Mode ON — 30s, 1🪙 per card' : 'Normal Mode — 60s'}
      >
        ⚡
      </button>
    </div>
  );
}
