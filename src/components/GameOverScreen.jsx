import { useEffect, useState } from 'react';
import './GameOverScreen.css';

export default function GameOverScreen({ stats, timeExpired, won, onPlayAgain, onStartFresh }) {
  const [visible, setVisible] = useState(false);
  const { cardsPlayed, totalSpent, totalWon, biggestWin } = stats;
  const net = totalWon - totalSpent;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`go-overlay ${visible ? 'visible' : ''}`}>
      <div className={`go-card ${won ? 'go-card--win' : ''}`}>
        <div className="go-icon">{won ? '🚗' : timeExpired ? '⏰' : '💸'}</div>

        {won ? (
          <>
            <h1 className="go-title">TO BE CONTINUED</h1>
            <p className="go-sub">Level 0 Complete.</p>
            <p className="go-grig-quote">"Keys are right here."</p>
          </>
        ) : (
          <>
            <h1 className="go-title">{timeExpired ? "TIME'S UP" : 'GAME OVER'}</h1>
            <p className="go-sub">{timeExpired ? 'The clock has spoken.' : 'Your coins have spoken.'}</p>
          </>
        )}

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

        {/* Primary: Play Again keeps balance. Secondary: Start Fresh resets to 150. */}
        <div className="go-btn-row">
          <button className="go-btn" onClick={onPlayAgain}>
            {won ? '🎰 Play Again' : '🎰 Play Again'}
          </button>
          <button className="go-btn go-btn--secondary" onClick={onStartFresh}>
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  );
}
