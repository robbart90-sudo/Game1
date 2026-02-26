import './BalanceBar.css';
import { CARD_COST } from '../utils/lottery';

export default function BalanceBar({ balance, totalWon, cardsPlayed }) {
  return (
    <div className="balance-bar">
      <div className="stat">
        <span className="stat-label">Balance</span>
        <span className="stat-value coins">{balance} 🪙</span>
      </div>
      <div className="divider" />
      <div className="stat">
        <span className="stat-label">Cards Played</span>
        <span className="stat-value">{cardsPlayed}</span>
      </div>
      <div className="divider" />
      <div className="stat">
        <span className="stat-label">Total Won</span>
        <span className="stat-value won">{totalWon} 🪙</span>
      </div>
    </div>
  );
}
