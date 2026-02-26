import { useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import ScratchCard from './components/ScratchCard';
import BalanceBar from './components/BalanceBar';
import PrizeTierTable from './components/PrizeTierTable';
import { drawPrize, getSymbolsForPrize, CARD_COST, STARTING_BALANCE } from './utils/lottery';
import './App.css';

function newCard() {
  const prize = drawPrize();
  return { prize, symbols: getSymbolsForPrize(prize), revealed: false, key: Date.now() };
}

export default function App() {
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [totalWon, setTotalWon] = useState(0);
  const [cardsPlayed, setCardsPlayed] = useState(0);
  const [card, setCard] = useState(null);
  const [showTiers, setShowTiers] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);
  const confettiIntervalRef = useRef(null);

  const fireConfetti = useCallback((prize) => {
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);

    if (prize.id === 'jackpot') {
      let count = 0;
      confettiIntervalRef.current = setInterval(() => {
        confetti({ particleCount: 60, spread: 100, origin: { y: 0.5 }, colors: ['#FFD700', '#FFA500', '#FF6347'] });
        count++;
        if (count > 6) clearInterval(confettiIntervalRef.current);
      }, 300);
    } else if (prize.id === 'big') {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    }
  }, []);

  const buyCard = useCallback(() => {
    if (balance < CARD_COST) return;
    setBalance((b) => b - CARD_COST);
    setCardsPlayed((c) => c + 1);
    setCard(newCard());
    setResultMsg(null);
  }, [balance]);

  const handleRevealed = useCallback(() => {
    setCard((prev) => {
      if (!prev) return prev;
      if (prev.prize.amount > 0) {
        setBalance((b) => b + prev.prize.amount);
        setTotalWon((t) => t + prev.prize.amount);
        fireConfetti(prev.prize);
        setResultMsg({ type: 'win', text: `${prev.prize.label}! You won ${prev.prize.amount} coins!` });
      } else {
        setResultMsg({ type: 'lose', text: 'Better luck next time!' });
      }
      return { ...prev, revealed: true };
    });
  }, [fireConfetti]);

  const handleReset = useCallback(() => {
    setBalance(STARTING_BALANCE);
    setTotalWon(0);
    setCardsPlayed(0);
    setCard(null);
    setResultMsg(null);
  }, []);

  const canBuy = balance >= CARD_COST;
  const isRevealed = card?.revealed;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="title">🎰 Scratch &amp; Win</h1>
        <button className="info-btn" onClick={() => setShowTiers(true)}>ℹ️ Prizes</button>
      </header>

      <BalanceBar balance={balance} totalWon={totalWon} cardsPlayed={cardsPlayed} />

      <main className="game-area">
        {!card && (
          <div className="intro">
            <div className="intro-icon">🎟️</div>
            <p>Buy a scratch card for <strong>10 🪙</strong> and try your luck!</p>
          </div>
        )}

        {card && (
          <div className="card-area">
            <ScratchCard
              key={card.key}
              prize={card.prize}
              symbols={card.symbols}
              revealed={isRevealed}
              onRevealed={handleRevealed}
            />
            {resultMsg && (
              <div className={`result-msg ${resultMsg.type}`}>
                {resultMsg.text}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        {!canBuy && cardsPlayed > 0 ? (
          <button className="action-btn reset-btn" onClick={handleReset}>
            🔄 Play Again (Reset Balance)
          </button>
        ) : (
          <button
            className="action-btn buy-btn"
            onClick={buyCard}
            disabled={!canBuy}
          >
            {isRevealed ? '🎟️ New Card  −10 🪙' : '🎟️ Buy Card  −10 🪙'}
          </button>
        )}
      </footer>

      <PrizeTierTable visible={showTiers} onClose={() => setShowTiers(false)} />
    </div>
  );
}
