import { useState, useCallback, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import ScratchCard from './components/ScratchCard';
import BalanceBar  from './components/BalanceBar';
import PrizeTierTable   from './components/PrizeTierTable';
import GameOverScreen   from './components/GameOverScreen';
import TimerDisplay     from './components/TimerDisplay';
import MilestoneBanner  from './components/MilestoneBanner';
import GoalBar          from './components/GoalBar';
import { useSound }     from './hooks/useSound';
import { generateCard, STARTING_BALANCE } from './utils/lottery';
import { getRandomTheme } from './utils/themes';
import './App.css';

const NORMAL_TIME = 60;
const SPEED_TIME  = 30;
const GOAL_BALANCE = STARTING_BALANCE * 2; // 400

// ─── Milestone definitions ────────────────────────────────────────────────────
const MILESTONES = {
  firstWin:   { emoji: '🎉', label: 'FIRST WIN!',         sub: 'OFF TO THE RACES' },
  onARoll:    { emoji: '🔥', label: 'ON A ROLL!',          sub: '3 WINS IN A ROW'  },
  highRoller: { emoji: '💎', label: 'HIGH ROLLER!',        sub: '500+ WIN'         },
  speedDemon: { emoji: '⚡', label: 'SPEED DEMON!',        sub: 'CARD SCRATCHED < 5S' },
  goalHit:    { emoji: '🏆', label: 'GOAL ACHIEVED!',      sub: 'BALANCE DOUBLED'  },
  lucky5:     { emoji: '🌟', label: '5 IN A ROW!',         sub: 'UNSTOPPABLE'      },
};

export default function App() {
  // ── Balance & stats ──────────────────────────────────────────────────────
  const [balance,     setBalance]     = useState(STARTING_BALANCE);
  const [totalWon,    setTotalWon]    = useState(0);
  const [totalSpent,  setTotalSpent]  = useState(0);
  const [cardsPlayed, setCardsPlayed] = useState(0);
  const [biggestWin,  setBiggestWin]  = useState(0);

  // ── Card ─────────────────────────────────────────────────────────────────
  const [cardData,    setCardData]    = useState(null);
  const [revealed,    setRevealed]    = useState(false);
  const [winMsg,      setWinMsg]      = useState(null);   // { text, tier }
  const [cardFlash,   setCardFlash]   = useState('');     // CSS class for flash

  // ── Progression ──────────────────────────────────────────────────────────
  const [consecWins,    setConsecWins]    = useState(0);
  const [goalAchieved,  setGoalAchieved]  = useState(false);
  const [milestone,     setMilestone]     = useState(null);
  const [seenMilestones, setSeenMilestones] = useState(new Set());

  // ── Timer ────────────────────────────────────────────────────────────────
  const [timeLeft,     setTimeLeft]     = useState(NORMAL_TIME);
  const [timerActive,  setTimerActive]  = useState(false);
  const [speedMode,    setSpeedMode]    = useState(false);

  // ── UI state ─────────────────────────────────────────────────────────────
  const [gameOver,   setGameOver]   = useState(false);
  const [goReason,   setGoReason]   = useState('coins');
  const [showTiers,  setShowTiers]  = useState(false);
  const [shaking,    setShaking]    = useState(false);

  // ── Sync refs for stale-closure safety ───────────────────────────────────
  const cardRef      = useRef(null);
  const balanceRef   = useRef(STARTING_BALANCE);
  const seenRef      = useRef(new Set());

  const updateBalance = (fn) => {
    setBalance(b => {
      const next = fn(b);
      balanceRef.current = next;
      return next;
    });
  };

  const sound = useSound();

  // ── Timer countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const id = setTimeout(() => {
      setTimeLeft(t => {
        const next = t - 1;
        if (next <= 10 && next > 0) sound.tick(next <= 5);
        if (next <= 0) {
          setTimerActive(false);
          setGameOver(true);
          setGoReason('time');
        }
        return next;
      });
    }, 1000);
    return () => clearTimeout(id);
  }, [timerActive, timeLeft, sound]);

  // ── Trigger milestone banner (dedup) ─────────────────────────────────────
  const triggerMilestone = useCallback((key) => {
    if (seenRef.current.has(key)) return;
    seenRef.current.add(key);
    setSeenMilestones(new Set(seenRef.current));
    setMilestone(MILESTONES[key]);
    setTimeout(() => setMilestone(null), 3000);
  }, []);

  // ── Win feedback by tier ──────────────────────────────────────────────────
  const applyWinFeedback = useCallback((prize) => {
    if (prize <= 0) return;

    if (prize < 100) {
      // Small win: gold flash + ching
      setCardFlash('flash-gold');
      setTimeout(() => setCardFlash(''), 600);
      sound.ching(1);
    } else if (prize < 500) {
      // Medium win: confetti + animated text
      setCardFlash('flash-medium');
      setTimeout(() => setCardFlash(''), 800);
      confetti({ particleCount: 80, spread: 65, origin: { y: 0.65 } });
      sound.ching(2);
    } else if (prize < 5000) {
      // Big win: screen shake + big confetti + fanfare
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.55 } });
      sound.fanfare(true);
    } else {
      // Jackpot: full takeover confetti + jackpot sound
      sound.jackpot();
      let count = 0;
      const iv = setInterval(() => {
        confetti({
          particleCount: 80,
          spread: 120,
          origin: { x: Math.random(), y: Math.random() * 0.6 },
          colors: ['#FFD700','#FF6347','#00FF88','#FF00FF','#00FFFF'],
        });
        if (++count > 7) clearInterval(iv);
      }, 250);
    }
  }, [sound]);

  // ── Buy a card ────────────────────────────────────────────────────────────
  const buyCard = useCallback(() => {
    const theme    = getRandomTheme();
    const cost     = speedMode ? 1 : theme.price;
    const curBal   = balanceRef.current;
    if (curBal < cost) return;

    sound.deal();
    updateBalance(b => b - cost);
    setTotalSpent(s => s + cost);
    setCardsPlayed(c => c + 1);
    setWinMsg(null);
    setCardFlash('');

    const newCard = generateCard(speedMode ? { ...theme, price: 1 } : theme);
    cardRef.current = newCard;
    setCardData(newCard);
    setRevealed(false);

    // Start timer on first card
    if (!timerActive && timeLeft > 0) setTimerActive(true);
  }, [speedMode, timerActive, timeLeft, sound]);

  // ── Card revealed (85% scratched) ────────────────────────────────────────
  const handleRevealed = useCallback((scratchSecs) => {
    const card = cardRef.current;
    if (!card) return;

    setRevealed(true);

    const prize = card.totalPrize;

    if (prize > 0) {
      updateBalance(b => b + prize);
      setTotalWon(t => t + prize);
      setBiggestWin(b => Math.max(b, prize));
      applyWinFeedback(prize);

      setConsecWins(c => {
        const next = c + 1;
        if (next === 1 && !seenRef.current.has('firstWin')) {
          triggerMilestone('firstWin');
        }
        if (next === 3) triggerMilestone('onARoll');
        if (next === 5) triggerMilestone('lucky5');
        return next;
      });

      if (prize >= 500) triggerMilestone('highRoller');

      setWinMsg({
        text: `${prize >= 5000 ? '🏆 JACKPOT' : prize >= 500 ? '💎 BIG WIN' : prize >= 100 ? '⭐ WIN'  : '🎉 WIN'} — +${prize.toLocaleString()} 🪙`,
        tier: prize >= 5000 ? 'jackpot' : prize >= 500 ? 'big' : prize >= 100 ? 'medium' : 'small',
      });
    } else {
      setConsecWins(0);
      sound.tick(false);
      setWinMsg({ text: 'No match — better luck next time!', tier: 'none' });
    }

    // Speed demon bonus: < 5s scratch
    if (scratchSecs !== null && scratchSecs < 5) {
      triggerMilestone('speedDemon');
      updateBalance(b => b + 5);
      setTotalWon(t => t + 5);
    }

    // Goal check (once)
    setBalance(b => {
      if (!goalAchieved && b >= GOAL_BALANCE) {
        setGoalAchieved(true);
        triggerMilestone('goalHit');
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#D4AF37','#FFE066','#fff'] });
      }
      return b;
    });

    // Game over if out of coins (check after prize credit)
    setTimeout(() => {
      const lowestCost = speedMode ? 1 : 1;
      if (balanceRef.current < lowestCost && timeLeft > 0) {
        setTimerActive(false);
        setGameOver(true);
        setGoReason('coins');
      }
    }, 800);
  }, [applyWinFeedback, goalAchieved, speedMode, timeLeft, triggerMilestone, sound]);

  // ── Speed mode toggle (only before game starts) ───────────────────────────
  const toggleSpeed = useCallback(() => {
    if (timerActive) return; // locked once timer starts
    setSpeedMode(s => {
      const next = !s;
      setTimeLeft(next ? SPEED_TIME : NORMAL_TIME);
      return next;
    });
  }, [timerActive]);

  // ── Play again (full reset) ───────────────────────────────────────────────
  const handlePlayAgain = useCallback(() => {
    balanceRef.current = STARTING_BALANCE;
    seenRef.current    = new Set();
    setBalance(STARTING_BALANCE);
    setTotalWon(0);
    setTotalSpent(0);
    setCardsPlayed(0);
    setBiggestWin(0);
    setCardData(null);
    setRevealed(false);
    setWinMsg(null);
    setCardFlash('');
    setConsecWins(0);
    setGoalAchieved(false);
    setMilestone(null);
    setSeenMilestones(new Set());
    setTimeLeft(speedMode ? SPEED_TIME : NORMAL_TIME);
    setTimerActive(false);
    setGameOver(false);
    setShaking(false);
  }, [speedMode]);

  const cardCost = speedMode
    ? 1
    : cardData && !revealed ? cardData.theme.price : 1;
  const lowestCost  = speedMode ? 1 : 1;
  const canBuy      = balance >= lowestCost && !gameOver;

  return (
    <div className={`app ${shaking ? 'shaking' : ''}`}>

      {/* ── Header row ─────────────────────────── */}
      <header className="app-header">
        <h1 className="title">🎰 Scratch &amp; Win</h1>
        <div className="header-right">
          <TimerDisplay
            timeLeft={timeLeft}
            active={timerActive}
            speedMode={speedMode}
          />
          <button className="info-btn" onClick={() => setShowTiers(true)}>ℹ️</button>
        </div>
      </header>

      {/* ── Goal bar ───────────────────────────── */}
      <GoalBar balance={balance} achieved={goalAchieved} />

      {/* ── Stats bar ──────────────────────────── */}
      <BalanceBar
        balance={balance}
        totalWon={totalWon}
        cardsPlayed={cardsPlayed}
        speedMode={speedMode}
        onSpeedToggle={toggleSpeed}
      />

      {/* ── Game area ──────────────────────────── */}
      <main className="game-area">
        {!cardData && (
          <div className="intro">
            <div className="intro-icon">🎟️</div>
            <p>120 themed cards — scratch to reveal your prize</p>
            <p className="intro-sub">Match numbers · 1–20 🪙 per card · ⚡ for speed mode</p>
          </div>
        )}

        {cardData && (
          <div className={`card-area ${cardFlash}`}>
            <ScratchCard
              key={`${cardData.theme.id}-${cardsPlayed}`}
              cardData={cardData}
              onRevealed={handleRevealed}
              revealed={revealed}
              soundScratch={sound.scratch}
            />
            {winMsg && (
              <div className={`result-msg tier-${winMsg.tier}`}>
                {winMsg.text}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Buy button ─────────────────────────── */}
      <footer className="app-footer">
        <button
          className="action-btn buy-btn"
          onClick={buyCard}
          disabled={!canBuy}
        >
          {cardData && !revealed
            ? '🎟️ New Card'
            : cardData && revealed
              ? '🎟️ Next Card'
              : '🎟️ Buy Card'}
        </button>
      </footer>

      {/* ── Overlays ───────────────────────────── */}
      <MilestoneBanner milestone={milestone} />

      {gameOver && (
        <GameOverScreen
          stats={{ cardsPlayed, totalSpent, totalWon, biggestWin }}
          timeExpired={goReason === 'time'}
          onPlayAgain={handlePlayAgain}
        />
      )}

      <PrizeTierTable visible={showTiers} onClose={() => setShowTiers(false)} />
    </div>
  );
}
