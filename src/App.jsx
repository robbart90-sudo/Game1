import { useState, useCallback, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import ScratchCard    from './components/ScratchCard';
import CardPicker     from './components/CardPicker';
import BalanceBar     from './components/BalanceBar';
import PrizeTierTable from './components/PrizeTierTable';
import GameOverScreen from './components/GameOverScreen';
import TimerDisplay   from './components/TimerDisplay';
import MilestoneBanner from './components/MilestoneBanner';
import GoalBar        from './components/GoalBar';
import { useSound }   from './hooks/useSound';
import { generateCard, STARTING_BALANCE } from './utils/lottery';
import { getRandomTheme } from './utils/themes';
import './App.css';

const NORMAL_TIME  = 60;
const SPEED_TIME   = 30;
const GOAL_BALANCE = STARTING_BALANCE * 2; // 400
const PICKER_COUNT = 6;

// ─── Milestone definitions ────────────────────────────────────────────────────
const MILESTONES = {
  firstWin:   { emoji: '🎉', label: 'FIRST WIN!',         sub: 'OFF TO THE RACES'    },
  onARoll:    { emoji: '🔥', label: 'ON A ROLL!',          sub: '3 WINS IN A ROW'     },
  highRoller: { emoji: '💎', label: 'HIGH ROLLER!',        sub: '500+ WIN'            },
  speedDemon: { emoji: '⚡', label: 'SPEED DEMON!',        sub: 'CARD SCRATCHED < 5S' },
  goalHit:    { emoji: '🏆', label: 'GOAL ACHIEVED!',      sub: 'BALANCE DOUBLED'     },
  lucky5:     { emoji: '🌟', label: '5 IN A ROW!',         sub: 'UNSTOPPABLE'         },
};

// Build one card option object
function makeOption(speedMode, balance, forceWin = false) {
  const theme = getRandomTheme();
  const cost  = speedMode ? 1 : theme.price;
  const card  = generateCard(speedMode ? { ...theme, price: 1 } : theme, forceWin);
  return { theme, card, cost, canAfford: balance >= cost };
}

// Generate 6 picker options (1 guaranteed winner, 5 normal)
function generatePickerOptions(speedMode, balance) {
  const options = [];
  // 1 forced winner
  options.push(makeOption(speedMode, balance, true));
  // 5 standard
  for (let i = 0; i < PICKER_COUNT - 1; i++) {
    options.push(makeOption(speedMode, balance));
  }
  // Shuffle
  return options.sort(() => Math.random() - 0.5);
}

export default function App() {
  // ── Balance & stats ──────────────────────────────────────────────────────
  const [balance,     setBalance]     = useState(STARTING_BALANCE);
  const [totalWon,    setTotalWon]    = useState(0);
  const [totalSpent,  setTotalSpent]  = useState(0);
  const [cardsPlayed, setCardsPlayed] = useState(0);
  const [biggestWin,  setBiggestWin]  = useState(0);

  // ── Phase machine ────────────────────────────────────────────────────────
  // 'intro' | 'playing' | 'result' | 'picking' | 'transitioning'
  const [phase,         setPhase]         = useState('intro');
  const [slideTarget,   setSlideTarget]   = useState('card'); // 'card' | 'picker'
  const [slideClass,    setSlideClass]    = useState('');

  // ── Card state ───────────────────────────────────────────────────────────
  const [cardData,      setCardData]      = useState(null);
  const [winMsg,        setWinMsg]        = useState(null);
  const [cardFlash,     setCardFlash]     = useState('');

  // ── Picker state ─────────────────────────────────────────────────────────
  const [pickerOptions, setPickerOptions] = useState([]);

  // ── Progression ──────────────────────────────────────────────────────────
  const [consecWins,   setConsecWins]   = useState(0);
  const [goalAchieved, setGoalAchieved] = useState(false);
  const [milestone,    setMilestone]    = useState(null);

  // ── Timer ────────────────────────────────────────────────────────────────
  const [timeLeft,    setTimeLeft]    = useState(NORMAL_TIME);
  const [timerActive, setTimerActive] = useState(false);
  const [speedMode,   setSpeedMode]   = useState(false);

  // ── UI ───────────────────────────────────────────────────────────────────
  const [gameOver,  setGameOver]  = useState(false);
  const [goReason,  setGoReason]  = useState('coins');
  const [showTiers, setShowTiers] = useState(false);
  const [shaking,   setShaking]   = useState(false);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const cardRef      = useRef(null);
  const balanceRef   = useRef(STARTING_BALANCE);
  const seenRef      = useRef(new Set());
  const speedModeRef = useRef(false);
  const phaseRef     = useRef('intro');

  const updateBalance = (fn) => {
    setBalance(b => {
      const next = fn(b);
      balanceRef.current = next;
      return next;
    });
  };

  const sound = useSound();

  useEffect(() => { speedModeRef.current = speedMode; }, [speedMode]);
  useEffect(() => { phaseRef.current = phase; },        [phase]);

  // ── Timer countdown ───────────────────────────────────────────────────────
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

  // ── Milestone banner ──────────────────────────────────────────────────────
  const triggerMilestone = useCallback((key) => {
    if (seenRef.current.has(key)) return;
    seenRef.current.add(key);
    setMilestone(MILESTONES[key]);
    setTimeout(() => setMilestone(null), 3000);
  }, []);

  // ── Win feedback ──────────────────────────────────────────────────────────
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

  // ── Slide helper: animate out current view, then run callback ────────────
  const slideOut = useCallback((onDone) => {
    setSlideClass('slide-out-left');
    setTimeout(() => {
      setSlideClass('');
      onDone();
    }, 370);
  }, []);

  const slideInNew = useCallback((onMount) => {
    setSlideClass('slide-in-right');
    onMount();
    setTimeout(() => setSlideClass(''), 420);
  }, []);

  // ── Start first card (from intro) ────────────────────────────────────────
  const startFirstCard = useCallback(() => {
    // Immediately show the picker
    const options = generatePickerOptions(speedModeRef.current, balanceRef.current);
    setPickerOptions(options);
    setSlideTarget('picker');
    setPhase('picking');
    setTimerActive(true);
  }, []);

  // ── Player picks a card from the picker ──────────────────────────────────
  const handlePick = useCallback((index) => {
    const opt = pickerOptions[index];
    if (!opt || !opt.canAfford) return;

    const { card, cost } = opt;

    sound.deal();
    updateBalance(b => b - cost);
    setTotalSpent(s => s + cost);
    setCardsPlayed(c => c + 1);
    setWinMsg(null);
    setCardFlash('');

    cardRef.current = card;

    slideOut(() => {
      slideInNew(() => {
        setCardData(card);
        setSlideTarget('card');
        setPhase('playing');
      });
    });
  }, [pickerOptions, sound, slideOut, slideInNew]);

  // ── Card completed ────────────────────────────────────────────────────────
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

    // Goal check (read latest balance via setBalance functional form)
    setBalance(b => {
      if (!goalAchieved && b >= GOAL_BALANCE) {
        setGoalAchieved(true);
        triggerMilestone('goalHit');
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#D4AF37','#FFE066','#fff'] });
      }
      return b;
    });

    // After brief result delay, check affordability then show picker
    const delay = prize > 0 ? 1500 : 1000;
    setTimeout(() => {
      showPicker();
    }, delay);
  }, [applyWinFeedback, goalAchieved, triggerMilestone, sound]);

  // ── Show the picker after a card completes ────────────────────────────────
  const showPicker = useCallback(() => {
    // Check if out of coins (minimum card cost is 1)
    if (balanceRef.current < 1) {
      setTimerActive(false);
      setGameOver(true);
      setGoReason('coins');
      return;
    }

    const options = generatePickerOptions(speedModeRef.current, balanceRef.current);
    setPickerOptions(options);

    slideOut(() => {
      slideInNew(() => {
        setWinMsg(null);
        setCardFlash('');
        setSlideTarget('picker');
        setPhase('picking');
      });
    });
  }, [slideOut, slideInNew]);

  // ── End session manually ──────────────────────────────────────────────────
  const handleEndSession = useCallback(() => {
    setTimerActive(false);
    setGameOver(true);
    setGoReason('manual');
  }, []);

  // ── Speed mode toggle (before timer starts) ───────────────────────────────
  const toggleSpeed = useCallback(() => {
    if (timerActive) return;
    setSpeedMode(s => {
      const next = !s;
      setTimeLeft(next ? SPEED_TIME : NORMAL_TIME);
      return next;
    });
  }, [timerActive]);

  // ── Play again ───────────────────────────────────────────────────────────
  const handlePlayAgain = useCallback(() => {
    balanceRef.current = STARTING_BALANCE;
    seenRef.current    = new Set();
    setBalance(STARTING_BALANCE);
    setTotalWon(0);
    setTotalSpent(0);
    setCardsPlayed(0);
    setBiggestWin(0);
    setCardData(null);
    setPickerOptions([]);
    setWinMsg(null);
    setCardFlash('');
    setSlideClass('');
    setSlideTarget('card');
    setConsecWins(0);
    setGoalAchieved(false);
    setMilestone(null);
    setTimeLeft(speedMode ? SPEED_TIME : NORMAL_TIME);
    setTimerActive(false);
    setGameOver(false);
    setShaking(false);
    setPhase('intro');
  }, [speedMode]);

  const isActive = phase !== 'intro';

  return (
    <div className={`app ${shaking ? 'shaking' : ''}`}>

      {/* ── Header ──────────────────────────── */}
      <header className="app-header">
        <h1 className="title">🎰 Scratch &amp; Win</h1>
        <div className="header-right">
          <TimerDisplay timeLeft={timeLeft} active={timerActive} speedMode={speedMode} />
          <button className="info-btn" onClick={() => setShowTiers(true)}>ℹ️</button>
        </div>
      </header>

      {/* ── Goal bar ────────────────────────── */}
      <GoalBar balance={balance} achieved={goalAchieved} />

      {/* ── Stats bar ───────────────────────── */}
      <BalanceBar
        balance={balance}
        totalWon={totalWon}
        cardsPlayed={cardsPlayed}
        speedMode={speedMode}
        onSpeedToggle={toggleSpeed}
      />

      {/* ── Game area ───────────────────────── */}
      <main className="game-area">

        {/* Intro */}
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

        {/* Card view */}
        {(phase === 'playing' || phase === 'result') && cardData && slideTarget === 'card' && (
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

        {/* Picker view */}
        {phase === 'picking' && slideTarget === 'picker' && (
          <div className={`picker-area ${slideClass}`}>
            <CardPicker
              options={pickerOptions}
              onPick={handlePick}
            />
          </div>
        )}

        {/* Transitioning — empty so slide-out clears cleanly */}
        {phase === 'transitioning' && (
          <div className={`card-area ${slideClass}`} />
        )}
      </main>

      {/* ── End Session button ───────────────── */}
      {isActive && !gameOver && (
        <footer className="app-footer">
          <button className="end-session-btn" onClick={handleEndSession}>
            End Session
          </button>
        </footer>
      )}

      {/* ── Overlays ────────────────────────── */}
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
