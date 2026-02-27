import { useEffect, useState } from 'react';
import './GameOverScreen.css';

export default function GameOverScreen({ stats, timeExpired, onPlayAgain }) {
  const [visible, setVisible] = useState(false);
  const { cardsPlayed, totalSpent, totalWon, biggestWin } = stats;
  const net = totalWon - totalSpent;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`go-overlay ${visible ? 'visible' : ''}`}>
      <div className="go-card">
        <div className="go-icon">{timeExpired ? '⏰' : '💸'}</div>
        <h1 className="go-title">{timeExpired ? "TIME'S UP" : 'GAME OVER'}</h1>
        <p className="go-sub">{timeExpired ? 'The clock has spoken.' : 'Your coins have spoken.'}</p>

        <div className="go-stats">
          <div className="go-row">
            <span>Cards Played</span>
            <strong>{cardsPlayed}</strong>
          </div>
          <div className="go-row">
            <span>Total Spent</span>
            <strong>{totalSpent.toLocaleString()} 🪙</strong>
          </div>
          <div className="go-row">
            <span>Total Won</span>
            <strong>{totalWon.toLocaleString()} 🪙</strong>
          </div>
          <div className="go-row">
            <span>Biggest Win</span>
            <strong>{biggestWin.toLocaleString()} 🪙</strong>
          </div>
          <div className={`go-net ${net >= 0 ? 'profit' : 'loss'}`}>
            <span>Net {net >= 0 ? 'Profit' : 'Loss'}</span>
            <strong>{net >= 0 ? '+' : ''}{net.toLocaleString()} 🪙</strong>
          </div>
        </div>

        <button className="go-btn" onClick={onPlayAgain}>
          🎰 Play Again
        </button>
      </div>
    </div>
  );
}
