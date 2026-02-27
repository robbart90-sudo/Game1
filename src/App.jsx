import { useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import ScratchCard from './components/ScratchCard';
import BalanceBar from './components/BalanceBar';
import PrizeTierTable from './components/PrizeTierTable';
import { generateCard, STARTING_BALANCE } from './utils/lottery';
import { getRandomTheme } from './utils/themes';
import './App.css';

export default function App() {
  const [balance, setBalance]         = useState(STARTING_BALANCE);
  const [totalWon, setTotalWon]       = useState(0);
  const [cardsPlayed, setCardsPlayed] = useState(0);
  const [cardData, setCardData]       = useState(null);
  const [winMsg, setWinMsg]           = useState(null);
  const [showTiers, setShowTiers]     = useState(false);

  // Sync ref so callbacks can read latest cardData without stale closure
  const cardRef = useRef(null);
  const setCard = useCallback((data) => {
    cardRef.current = data;
    setCardData(data);
  }, []);

  // ── Fire confetti ──────────────────────────────────────────────────────────
  const fireConfetti = useCallback((prize) => {
    if (prize >= 5000) {
      let count = 0;
      const iv = setInterval(() => {
        confetti({ particleCount: 70, spread: 110, origin: { y: 0.5 }, colors: ['#FFD700', '#FF6347', '#FFA500'] });
        if (++count > 5) clearInterval(iv);
      }, 300);
    } else if (prize >= 500) {
      confetti({ particleCount: 110, spread: 85, origin: { y: 0.6 } });
    } else {
      confetti({ particleCount: 55, spread: 60, origin: { y: 0.7 } });
    }
  }, []);

  // ── Buy a new card ─────────────────────────────────────────────────────────
  const buyCard = useCallback(() => {
    const theme = getRandomTheme();
    if (balance < theme.price) return;
    setBalance(b => b - theme.price);
    setCardsPlayed(c => c + 1);
    setWinMsg(null);
    setCard(generateCard(theme));
  }, [balance, setCard]);

  // ── Cell scratched ─────────────────────────────────────────────────────────
  const handleCellScratched = useCallback((cellIndex) => {
    const prev = cardRef.current;
    if (!prev) return;
    const cell = prev.cells[cellIndex];
    if (cell.scratched) return;

    // Award prize immediately for this cell
    if (cell.isMatch && cell.prize > 0) {
      setBalance(b => b + cell.prize);
      setTotalWon(t => t + cell.prize);
      fireConfetti(cell.prize);
    }

    const newCells = prev.cells.map((c, i) =>
      i === cellIndex ? { ...c, scratched: true } : c
    );
    const allDone = newCells.every(c => c.scratched);
    const updated = { ...prev, cells: newCells };
    setCard(updated);

    if (allDone) {
      const won = newCells.filter(c => c.isMatch).reduce((s, c) => s + c.prize, 0);
      setWinMsg(won > 0
        ? { type: 'win',  text: `You won ${won.toLocaleString()} coins! 🎉` }
        : { type: 'lose', text: 'No match this time. Try again!' });
    }
  }, [fireConfetti, setCard]);

  // ── Reveal all remaining cells ─────────────────────────────────────────────
  const handleRevealAll = useCallback(() => {
    const prev = cardRef.current;
    if (!prev) return;

    let earned = 0;
    const newCells = prev.cells.map(c => {
      if (!c.scratched && c.isMatch && c.prize > 0) earned += c.prize;
      return { ...c, scratched: true };
    });

    if (earned > 0) {
      setBalance(b => b + earned);
      setTotalWon(t => t + earned);
      fireConfetti(earned);
    }

    const totalWonOnCard = newCells.filter(c => c.isMatch).reduce((s, c) => s + c.prize, 0);
    setCard({ ...prev, cells: newCells });
    setWinMsg(totalWonOnCard > 0
      ? { type: 'win',  text: `You won ${totalWonOnCard.toLocaleString()} coins! 🎉` }
      : { type: 'lose', text: 'No match this time. Try again!' });
  }, [fireConfetti, setCard]);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setBalance(STARTING_BALANCE);
    setTotalWon(0);
    setCardsPlayed(0);
    setCard(null);
    setWinMsg(null);
  }, [setCard]);

  const lowestPrice  = 1; // cheapest card in the game
  const canBuy       = balance >= lowestPrice;
  const allScratched = cardData?.cells.every(c => c.scratched) ?? false;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="title">🎰 Scratch &amp; Win</h1>
        <button className="info-btn" onClick={() => setShowTiers(true)}>ℹ️ Odds</button>
      </header>

      <BalanceBar balance={balance} totalWon={totalWon} cardsPlayed={cardsPlayed} />

      <main className="game-area">
        {!cardData && (
          <div className="intro">
            <div className="intro-icon">🎟️</div>
            <p>120 themed cards — tap buy to get a random one!</p>
            <p className="intro-sub">Cards cost 1–20 🪙 · Match numbers to win</p>
          </div>
        )}

        {cardData && (
          <div className="card-area">
            <ScratchCard
              key={cardData.theme.id + cardsPlayed}
              cardData={cardData}
              onCellScratched={handleCellScratched}
              onRevealAll={handleRevealAll}
            />
            {winMsg && (
              <div className={`result-msg ${winMsg.type}`}>{winMsg.text}</div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        {!canBuy && cardsPlayed > 0 ? (
          <button className="action-btn reset-btn" onClick={handleReset}>
            🔄 Play Again (Reset)
          </button>
        ) : (
          <button
            className="action-btn buy-btn"
            onClick={buyCard}
            disabled={!canBuy}
          >
            {allScratched ? '🎟️ New Card' : cardData ? '🎟️ New Card' : '🎟️ Buy a Card'}
          </button>
        )}
      </footer>

      <PrizeTierTable visible={showTiers} onClose={() => setShowTiers(false)} />
    </div>
  );
}
