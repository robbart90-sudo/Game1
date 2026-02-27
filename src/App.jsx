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

// Pre-generate a card, ensuring player can afford it
function makeCard(speedMode, balanceRef) {
  const theme = getRandomTheme();
  const cost  = speedMode ? 1 : theme.price;
  if (balanceRef.current < cost) return null;
  return { card: generateCard(speedMode ? { ...theme, price: 1 } : theme), cost };
}

export default function App() {
  // ── Balance & stats ──────────────────────────────────────────────────────
  const [balance,     setBalance]     = useState(STARTING_BALANCE);
  const [totalWon,    setTotalWon]    = useState(0);
  const [totalSpent,  setTotalSpent]  = useState(0);
  const [cardsPlayed, setCardsPlayed] = useState(0);
  const [biggestWin,  setBiggestWin]  = useState(0);

  // ── Card state ───────────────────────────────────────────────────────────
  // phase: 'intro' | 'playing' | 'result' | 'transitioning'
  const [phase,       setPhase]       = useState('intro');
  const [cardData,    setCardData]    = useState(null);
  const [nextCardData, setNextCardData] = useState(null);
  const [winMsg,      setWinMsg]      = useState(null);
  const [cardFlash,   setCardFlash]   = useState('');
  const [slideClass,  setSlideClass]  = useState('');

  // ── Progression ──────────────────────────────────────────────────────────
  const [consecWins,    setConsecWins]    = useState(0);
  const [goalAchieved,  setGoalAchieved]  = useState(false);
  const [milestone,     setMilestone]     = useState(null);

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
  const cardRef        = useRef(null);
  const balanceRef     = useRef(STARTING_BALANCE);
  const seenRef        = useRef(new Set());
  const speedModeRef   = useRef(false);
  const phaseRef       = useRef('intro');

  const updateBalance = (fn) => {
    setBalance(b => {
      const next = fn(b);
      balanceRef.current = next;
      return next;
    });
  };

  const sound = useSound();

  // Keep refs in sync
  useEffect(() => { speedModeRef.current = speedMode; }, [speedMode]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

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
    setMilestone(MILESTONES[key]);
    setTimeout(() => setMilestone(null), 3000);
  }, []);

  // ── Win feedback by tier ──────────────────────────────────────────────────
  const applyWinFeedback = useCallback((prize) => {
    if (prize <= 0) return;

    if (prize < 100) {
      setCardFlash('flash-gold');
      setTimeout(() => setCardFlash(''), 600);
      sound.ching(1);
    } else if (prize < 500) {
      setCardFlash('flash-medium');
      setTimeout(() => setCardFlash(''), 800);
      confetti({ particleCount: 80, spread: 65, origin: { y: 0.65 } });
      sound.ching(2);
    } else if (prize < 5000) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.55 } });
      sound.fanfare(true);
    } else {
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

  // ── Start the first card ──────────────────────────────────────────────────
  const startFirstCard = useCallback(() => {
    const result = makeCard(speedModeRef.current, balanceRef);
    if (!result) return;
    const { card, cost } = result;

    sound.deal();
    updateBalance(b => b - cost);
    setTotalSpent(s => s + cost);
    setCardsPlayed(c => c + 1);
    setWinMsg(null);
    setCardFlash('');

    cardRef.current = card;
    setCardData(card);
    setPhase('playing');

    // Pre-generate next card
    const nextResult = makeCard(speedModeRef.current, { current: balanceRef.current - cost });
    setNextCardData(nextResult ? nextResult.card : null);

    // Start timer on first card
    setTimerActive(true);
  }, [sound]);

  // ── Card completed (95% cells revealed) ──────────────────────────────────
  const handleComplete = useCallback((scratchSecs) => {
    if (phaseRef.current !== 'playing') return;
    setPhase('result');

    const card = cardRef.current;
    if (!card) return;

    const prize = card.totalPrize;

    if (prize > 0) {
      updateBalance(b => b + prize);
      setTotalWon(t => t + prize);
      setBiggestWin(b => Math.max(b, prize));
      applyWinFeedback(prize);

      setConsecWins(c => {
        const next = c + 1;
        if (next === 1 && !seenRef.current.has('firstWin')) triggerMilestone('firstWin');
        if (next === 3) triggerMilestone('onARoll');
        if (next === 5) triggerMilestone('lucky5');
        return next;
      });

      if (prize >= 500) triggerMilestone('highRoller');

      setWinMsg({
        text: `${prize >= 5000 ? '🏆 JACKPOT' : prize >= 500 ? '💎 BIG WIN' : prize >= 100 ? '⭐ WIN' : '🎉 WIN'} — +${prize.toLocaleString()} 🪙`,
        tier: prize >= 5000 ? 'jackpot' : prize >= 500 ? 'big' : prize >= 100 ? 'medium' : 'small',
      });
    } else {
      setConsecWins(0);
      sound.tick(false);
      setWinMsg({ text: 'No match — better luck next time!', tier: 'none' });
    }

    // Speed demon bonus
    if (scratchSecs !== null && scratchSecs < 5) {
      triggerMilestone('speedDemon');
      updateBalance(b => b + 5);
      setTotalWon(t => t + 5);
    }

    // Goal check
    setBalance(b => {
      if (!goalAchieved && b >= GOAL_BALANCE) {
        setGoalAchieved(true);
        triggerMilestone('goalHit');
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#D4AF37','#FFE066','#fff'] });
      }
      return b;
    });

    // Auto-progress delay: 1s for loss, 1.5s for win
    const delay = prize > 0 ? 1500 : 1000;
    setTimeout(() => {
      advanceCard();
    }, delay);
  }, [applyWinFeedback, goalAchieved, triggerMilestone, sound]);

  // ── Advance to next card ──────────────────────────────────────────────────
  const advanceCard = useCallback(() => {
    // Check if game over (out of coins or time)
    const lowestCost = speedModeRef.current ? 1 : 1;
    if (balanceRef.current < lowestCost) {
      setTimerActive(false);
      setGameOver(true);
      setGoReason('coins');
      return;
    }

    // Start slide transition
    setPhase('transitioning');
    setSlideClass('slide-out-left');

    setTimeout(() => {
      // Load pre-generated next card or make a new one
      let nextCard = nextCardData;
      let cost = speedModeRef.current ? 1 : (nextCard?.theme?.price ?? 1);

      if (!nextCard) {
        const result = makeCard(speedModeRef.current, balanceRef);
        if (!result) {
          setTimerActive(false);
          setGameOver(true);
          setGoReason('coins');
          return;
        }
        nextCard = result.card;
        cost     = result.cost;
      }

      sound.deal();
      updateBalance(b => b - cost);
      setTotalSpent(s => s + cost);
      setCardsPlayed(c => c + 1);
      setWinMsg(null);
      setCardFlash('');

      cardRef.current = nextCard;
      setCardData(nextCard);
      setSlideClass('slide-in-right');
      setPhase('playing');

      // Pre-generate the next card after this one
      const afterNext = makeCard(speedModeRef.current, { current: balanceRef.current - cost });
      setNextCardData(afterNext ? afterNext.card : null);

      setTimeout(() => setSlideClass(''), 420);
    }, 380);
  }, [nextCardData, sound]);

  // ── End session manually ──────────────────────────────────────────────────
  const handleEndSession = useCallback(() => {
    setTimerActive(false);
    setGameOver(true);
    setGoReason('manual');
  }, []);

  // ── Speed mode toggle (only before game starts) ───────────────────────────
  const toggleSpeed = useCallback(() => {
    if (timerActive) return;
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
    setNextCardData(null);
    setWinMsg(null);
    setCardFlash('');
    setSlideClass('');
    setConsecWins(0);
    setGoalAchieved(false);
    setMilestone(null);
    setTimeLeft(speedMode ? SPEED_TIME : NORMAL_TIME);
    setTimerActive(false);
    setGameOver(false);
    setShaking(false);
    setPhase('intro');
  }, [speedMode]);

  const isPlaying = phase === 'playing' || phase === 'result' || phase === 'transitioning';

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
        {phase === 'intro' && (
          <div className="intro">
            <div className="intro-icon">🎟️</div>
            <p>120 themed cards — scratch to reveal your prize</p>
            <p className="intro-sub">Match numbers · 1–20 🪙 per card · ⚡ for speed mode</p>
            <button className="action-btn buy-btn start-btn" onClick={startFirstCard}>
              🎟️ Start Scratching
            </button>
          </div>
        )}

        {cardData && isPlaying && (
          <div className={`card-area ${cardFlash} ${slideClass}`}>
            <ScratchCard
              key={`${cardData.theme.id}-${cardsPlayed}`}
              cardData={cardData}
              onComplete={handleComplete}
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

      {/* ── End Session button ──────────────────── */}
      {isPlaying && !gameOver && (
        <footer className="app-footer">
          <button className="end-session-btn" onClick={handleEndSession}>
            End Session
          </button>
        </footer>
      )}

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
