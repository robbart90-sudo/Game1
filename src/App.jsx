import { useState, useCallback, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import ScratchCard     from './components/ScratchCard';
import CardPicker      from './components/CardPicker';
import HeatMeter       from './components/HeatMeter';
import BalanceBar      from './components/BalanceBar';
import PrizeTierTable  from './components/PrizeTierTable';
import GameOverScreen  from './components/GameOverScreen';
import TimerDisplay    from './components/TimerDisplay';
import MilestoneBanner from './components/MilestoneBanner';
import GoalBar         from './components/GoalBar';
import { useSound }    from './hooks/useSound';
import { generateCard, STARTING_BALANCE } from './utils/lottery';
import { getRandomTheme } from './utils/themes';
import './App.css';

// Slide durations — 30% faster than original
const SLIDE_OUT_MS = 260;
const SLIDE_IN_MS  = 295;

const NORMAL_TIME  = 60;
const SPEED_TIME   = 30;
const GOAL_BALANCE = STARTING_BALANCE * 2;
const PICKER_COUNT = 6;

const MILESTONES = {
  firstWin:   { emoji: '🎉', label: 'FIRST WIN!',         sub: 'OFF TO THE RACES'    },
  onARoll:    { emoji: '🔥', label: 'ON A ROLL!',          sub: '3 WINS IN A ROW'     },
  highRoller: { emoji: '💎', label: 'HIGH ROLLER!',        sub: '500+ WIN'            },
  speedDemon: { emoji: '⚡', label: 'SPEED DEMON!',        sub: 'CARD SCRATCHED < 5S' },
  goalHit:    { emoji: '🏆', label: 'GOAL ACHIEVED!',      sub: 'BALANCE DOUBLED'     },
  lucky5:     { emoji: '🌟', label: '5 IN A ROW!',         sub: 'UNSTOPPABLE'         },
};

function makeOption(speedMode, balance, forceWin = false, isDark = false) {
  const theme = getRandomTheme();
  const cost  = speedMode ? 1 : theme.price;
  const card  = generateCard(speedMode ? { ...theme, price: 1 } : theme, forceWin);
  return { theme, card, cost, canAfford: balance >= cost, isDark };
}

function generatePickerOptions(speedMode, balance) {
  const options = [makeOption(speedMode, balance, true)];
  for (let i = 0; i < PICKER_COUNT - 1; i++) options.push(makeOption(speedMode, balance));
  return options.sort(() => Math.random() - 0.5);
}

// Flow State: descending winner guarantee per round
function generateFlowPickerOptions(speedMode, balance, flowRound) {
  const winCount   = Math.max(1, 7 - flowRound); // Rd1=6,Rd2=5,...,Rd6+=1
  const loserCount = PICKER_COUNT - winCount;
  const opts = [];
  for (let i = 0; i < winCount; i++)
    opts.push(makeOption(speedMode, balance, true, false));
  for (let i = 0; i < loserCount; i++)
    opts.push(makeOption(speedMode, balance, false, flowRound >= 4));
  return opts.sort(() => Math.random() - 0.5);
}

export default function App() {
  // ── Balance & stats ──────────────────────────────────────────────────────
  const [balance,     setBalance]     = useState(STARTING_BALANCE);
  const [totalWon,    setTotalWon]    = useState(0);
  const [totalSpent,  setTotalSpent]  = useState(0);
  const [cardsPlayed, setCardsPlayed] = useState(0);
  const [biggestWin,  setBiggestWin]  = useState(0);

  // ── Phase machine ────────────────────────────────────────────────────────
  const [phase,       setPhase]       = useState('intro');
  const [slideTarget, setSlideTarget] = useState('card');
  const [slideClass,  setSlideClass]  = useState('');
  const phaseRef = useRef('intro');

  // ── Card / picker state ───────────────────────────────────────────────────
  const [cardData,      setCardData]      = useState(null);
  const [winMsg,        setWinMsg]        = useState(null);
  const [cardFlash,     setCardFlash]     = useState('');
  const [pickerOptions, setPickerOptions] = useState([]);

  // ── Progression ──────────────────────────────────────────────────────────
  const [consecWins,   setConsecWins]   = useState(0);
  const [goalAchieved, setGoalAchieved] = useState(false);
  const [milestone,    setMilestone]    = useState(null);

  // ── Timer — lives in a ref, NEVER pauses for any reason ─────────────────
  const [timeLeft,       setTimeLeft]       = useState(NORMAL_TIME);
  const [speedMode,      setSpeedMode]      = useState(false);
  const timerIntervalRef = useRef(null);
  const timeLeftRef      = useRef(NORMAL_TIME);

  // ── Heat / Flow State ─────────────────────────────────────────────────────
  const [heat,           setHeat]           = useState(0);
  const [flowState,      setFlowState]      = useState(false);
  const [flowRound,      setFlowRound]      = useState(0);
  const [showFlowBanner, setShowFlowBanner] = useState(false);
  const heatRef      = useRef(0);
  const flowStateRef = useRef(false);
  const flowRoundRef = useRef(0);
  const flowDrainRef = useRef(null);

  // ── UI ────────────────────────────────────────────────────────────────────
  const [gameOver,  setGameOver]  = useState(false);
  const [goReason,  setGoReason]  = useState('coins');
  const [showTiers, setShowTiers] = useState(false);
  const [shaking,   setShaking]   = useState(false);

  // ── Stable refs ───────────────────────────────────────────────────────────
  const cardRef      = useRef(null);
  const balanceRef   = useRef(STARTING_BALANCE);
  const seenRef      = useRef(new Set());
  const speedModeRef = useRef(false);
  const soundRef     = useRef(null);
  const sound        = useSound();
  soundRef.current   = sound;

  useEffect(() => { speedModeRef.current = speedMode; }, [speedMode]);
  useEffect(() => { phaseRef.current = phase; },        [phase]);

  const updateBalance = (fn) => setBalance(b => {
    const next = fn(b);
    balanceRef.current = next;
    return next;
  });

  // ── Timer — setInterval, never reset by React renders ────────────────────
  const stopTimer = useCallback(() => {
    clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = null;
  }, []);

  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) return;
    timerIntervalRef.current = setInterval(() => {
      const next = --timeLeftRef.current;
      setTimeLeft(next);
      if (next > 0 && next <= 10) soundRef.current?.tick(next <= 5);
      if (next <= 0) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
        setGameOver(true);
        setGoReason('time');
      }
    }, 1000);
  }, []);

  const resetTimer = useCallback((duration) => {
    stopTimer();
    timeLeftRef.current = duration;
    setTimeLeft(duration);
  }, [stopTimer]);

  // ── Heat / Flow State ─────────────────────────────────────────────────────
  const exitFlowState = useCallback(() => {
    flowStateRef.current = false;
    setFlowState(false);
    setFlowRound(0);
    flowRoundRef.current = 0;
    clearInterval(flowDrainRef.current);
    flowDrainRef.current = null;
    heatRef.current = 0;
    setHeat(0);
  }, []);

  const enterFlowState = useCallback(() => {
    flowStateRef.current = true;
    flowRoundRef.current = 1;
    setFlowState(true);
    setFlowRound(1);
    setShowFlowBanner(true);
    setTimeout(() => setShowFlowBanner(false), 1000);
    clearInterval(flowDrainRef.current);
    // Drain ~8 pts/s
    flowDrainRef.current = setInterval(() => {
      heatRef.current = Math.max(0, heatRef.current - 1.2);
      setHeat(Math.round(heatRef.current));
      if (heatRef.current <= 0 && flowStateRef.current) exitFlowState();
    }, 150);
  }, [exitFlowState]);

  const updateHeat = useCallback((delta) => {
    heatRef.current = Math.max(0, Math.min(100, heatRef.current + delta));
    setHeat(Math.round(heatRef.current));
    if (heatRef.current >= 100 && !flowStateRef.current) enterFlowState();
  }, [enterFlowState]);

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
      soundRef.current?.ching(1);
    } else if (prize < 500) {
      setCardFlash('flash-medium');
      setTimeout(() => setCardFlash(''), 800);
      confetti({ particleCount: 80, spread: 65, origin: { y: 0.65 } });
      soundRef.current?.ching(2);
    } else if (prize < 5000) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.55 } });
      soundRef.current?.fanfare(true);
    } else {
      soundRef.current?.jackpot();
      let count = 0;
      const iv = setInterval(() => {
        confetti({ particleCount: 80, spread: 120, origin: { x: Math.random(), y: Math.random() * 0.6 }, colors: ['#FFD700','#FF6347','#00FF88','#FF00FF','#00FFFF'] });
        if (++count > 7) clearInterval(iv);
      }, 250);
    }
  }, []);

  // ── Slide helpers (30% faster) ────────────────────────────────────────────
  const slideOut = useCallback((onDone) => {
    setSlideClass('slide-out-left');
    setTimeout(() => { setSlideClass(''); onDone(); }, SLIDE_OUT_MS);
  }, []);

  const slideInNew = useCallback((onMount) => {
    setSlideClass('slide-in-right');
    onMount();
    setTimeout(() => setSlideClass(''), SLIDE_IN_MS);
  }, []);

  // ── Show picker (normal or flow, with optional pre-gen) ───────────────────
  const showPicker = useCallback((pregenOptions = null) => {
    if (balanceRef.current < 1) {
      stopTimer();
      setGameOver(true);
      setGoReason('coins');
      return;
    }
    const opts = pregenOptions ||
      (flowStateRef.current
        ? generateFlowPickerOptions(speedModeRef.current, balanceRef.current, flowRoundRef.current)
        : generatePickerOptions(speedModeRef.current, balanceRef.current));
    setPickerOptions(opts);
    slideOut(() => slideInNew(() => {
      setWinMsg(null); setCardFlash('');
      setSlideTarget('picker');
      setPhase('picking'); phaseRef.current = 'picking';
    }));
  }, [slideOut, slideInNew, stopTimer]);

  // ── Card complete handler ─────────────────────────────────────────────────
  const handleComplete = useCallback((scratchSecs) => {
    if (phaseRef.current !== 'playing') return;
    setPhase('result'); phaseRef.current = 'result';

    const card = cardRef.current;
    if (!card) return;
    const prize    = card.totalPrize;
    const isFlow   = flowStateRef.current;

    if (prize > 0) {
      updateBalance(b => b + prize);
      setTotalWon(t => t + prize);
      setBiggestWin(b => Math.max(b, prize));
      applyWinFeedback(prize);
      setConsecWins(c => {
        const n = c + 1;
        if (n === 1 && !seenRef.current.has('firstWin')) triggerMilestone('firstWin');
        if (n === 3) triggerMilestone('onARoll');
        if (n === 5) triggerMilestone('lucky5');
        return n;
      });
      if (prize >= 500) triggerMilestone('highRoller');
      setWinMsg({ text: `${prize >= 5000 ? '🏆 JACKPOT' : prize >= 500 ? '💎 BIG WIN' : prize >= 100 ? '⭐ WIN' : '🎉 WIN'} — +${prize.toLocaleString()} 🪙`, tier: prize >= 5000 ? 'jackpot' : prize >= 500 ? 'big' : prize >= 100 ? 'medium' : 'small' });
      if (!isFlow) updateHeat(prize >= 5000 ? 50 : prize >= 500 ? 35 : 18);
      if (isFlow) { const r = flowRoundRef.current + 1; flowRoundRef.current = r; setFlowRound(r); }
    } else {
      setConsecWins(0);
      soundRef.current?.tick(false);
      setWinMsg({ text: isFlow ? '💔 FLOW STATE BROKEN!' : 'No match — better luck next time!', tier: 'none' });
      if (isFlow) exitFlowState();
      else updateHeat(-10);
    }

    if (scratchSecs !== null && scratchSecs < 5 && !isFlow) {
      triggerMilestone('speedDemon');
      updateBalance(b => b + 5);
      setTotalWon(t => t + 5);
    }

    setBalance(b => {
      if (!goalAchieved && b >= GOAL_BALANCE) {
        setGoalAchieved(true);
        triggerMilestone('goalHit');
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#D4AF37','#FFE066','#fff'] });
      }
      return b;
    });

    const delay = prize > 0 ? 1500 : 1000;
    // Pre-generate next picker during result delay
    const pregenOptions = flowStateRef.current
      ? generateFlowPickerOptions(speedModeRef.current, balanceRef.current, flowRoundRef.current)
      : generatePickerOptions(speedModeRef.current, balanceRef.current);
    setTimeout(() => showPicker(pregenOptions), delay);
  }, [applyWinFeedback, exitFlowState, goalAchieved, triggerMilestone, updateHeat, showPicker]);

  // ── Flow state: player picks → auto-scratch ───────────────────────────────
  const handleFlowPick = useCallback((opt) => {
    const { card, cost } = opt;
    soundRef.current?.deal();
    updateBalance(b => b - cost);
    setTotalSpent(s => s + cost);
    setCardsPlayed(c => c + 1);
    cardRef.current = card;
    setCardData(card);
    slideOut(() => slideInNew(() => {
      setSlideTarget('card');
      setPhase('playing'); phaseRef.current = 'playing';
      setTimeout(() => handleComplete(null), 80);
    }));
  }, [slideOut, slideInNew, handleComplete]);

  // ── Normal: player picks from picker ──────────────────────────────────────
  const handlePick = useCallback((index) => {
    const opt = pickerOptions[index];
    if (!opt || !opt.canAfford) return;
    if (flowStateRef.current) { handleFlowPick(opt); return; }

    const { card, cost } = opt;
    soundRef.current?.deal();
    updateBalance(b => b - cost);
    setTotalSpent(s => s + cost);
    setCardsPlayed(c => c + 1);
    setWinMsg(null); setCardFlash('');
    cardRef.current = card;
    slideOut(() => slideInNew(() => {
      setCardData(card); setSlideTarget('card');
      setPhase('playing'); phaseRef.current = 'playing';
    }));
  }, [pickerOptions, slideOut, slideInNew, handleFlowPick]);

  // ── Start session ──────────────────────────────────────────────────────────
  const startFirstCard = useCallback(() => {
    const options = generatePickerOptions(speedModeRef.current, balanceRef.current);
    setPickerOptions(options);
    setSlideTarget('picker');
    setPhase('picking'); phaseRef.current = 'picking';
    startTimer();
  }, [startTimer]);

  // ── End session ────────────────────────────────────────────────────────────
  const handleEndSession = useCallback(() => {
    stopTimer();
    clearInterval(flowDrainRef.current);
    setGameOver(true);
    setGoReason('manual');
  }, [stopTimer]);

  // ── Speed mode toggle ──────────────────────────────────────────────────────
  const toggleSpeed = useCallback(() => {
    if (timerIntervalRef.current) return;
    setSpeedMode(s => {
      const next = !s;
      resetTimer(next ? SPEED_TIME : NORMAL_TIME);
      return next;
    });
  }, [resetTimer]);

  // ── Play again ────────────────────────────────────────────────────────────
  const handlePlayAgain = useCallback(() => {
    stopTimer(); exitFlowState();
    balanceRef.current = STARTING_BALANCE;
    seenRef.current = new Set();
    setBalance(STARTING_BALANCE);
    setTotalWon(0); setTotalSpent(0); setCardsPlayed(0); setBiggestWin(0);
    setCardData(null); setPickerOptions([]);
    setWinMsg(null); setCardFlash(''); setSlideClass(''); setSlideTarget('card');
    setConsecWins(0); setGoalAchieved(false); setMilestone(null);
    resetTimer(speedMode ? SPEED_TIME : NORMAL_TIME);
    setGameOver(false); setShaking(false);
    setPhase('intro'); phaseRef.current = 'intro';
  }, [stopTimer, exitFlowState, resetTimer, speedMode]);

  // Cleanup on unmount
  useEffect(() => () => { stopTimer(); clearInterval(flowDrainRef.current); }, [stopTimer]);

  const isActive = phase !== 'intro';

  return (
    <div className={`app ${shaking ? 'shaking' : ''} ${flowState ? 'flow-state' : ''}`}>

      {/* ── Flow State banner ─────────────────── */}
      {showFlowBanner && <div className="flow-state-banner">⚡ FLOW STATE ⚡</div>}

      {/* ── Header ──────────────────────────── */}
      <header className="app-header">
        <h1 className="title">🎰 Scratch &amp; Win</h1>
        <div className="header-right">
          <TimerDisplay timeLeft={timeLeft} active={!!timerIntervalRef.current} speedMode={speedMode} />
          <button className="info-btn" onClick={() => setShowTiers(true)}>ℹ️</button>
        </div>
      </header>

      <GoalBar balance={balance} achieved={goalAchieved} />
      <BalanceBar balance={balance} totalWon={totalWon} cardsPlayed={cardsPlayed} speedMode={speedMode} onSpeedToggle={toggleSpeed} />

      <main className="game-area">
        {phase === 'intro' && (
          <div className="intro">
            <div className="intro-icon">🎟️</div>
            <p>120 themed cards — scratch to reveal your prize</p>
            <p className="intro-sub">Match numbers · 1–20 🪙 per card · ⚡ for speed mode</p>
            <button className="action-btn buy-btn start-btn" onClick={startFirstCard}>🎟️ Start Scratching</button>
          </div>
        )}

        {/* Heat meter — full width, directly above card/picker */}
        {isActive && <HeatMeter heat={heat} flowState={flowState} flowRound={flowRound} />}

        {/* Card view */}
        {(phase === 'playing' || phase === 'result') && cardData && slideTarget === 'card' && (
          <div className={`card-area ${cardFlash} ${slideClass}`}>
            {flowState ? (
              /* Flow State: auto-scratched, just show result flash */
              <div className="flow-reveal-card">
                <div className="flow-reveal-flash" />
                {winMsg && <div className={`result-msg tier-${winMsg.tier} flow-msg`}>{winMsg.text}</div>}
              </div>
            ) : (
              <>
                <ScratchCard
                  key={`${cardData.theme.id}-${cardsPlayed}`}
                  cardData={cardData}
                  onComplete={handleComplete}
                  soundScratch={sound.scratch}
                  heat={heat}
                />
                {winMsg && <div className={`result-msg tier-${winMsg.tier}`}>{winMsg.text}</div>}
              </>
            )}
          </div>
        )}

        {/* Picker view */}
        {phase === 'picking' && slideTarget === 'picker' && (
          <div className={`picker-area ${slideClass}`}>
            <CardPicker options={pickerOptions} onPick={handlePick} flowState={flowState} />
          </div>
        )}
      </main>

      {isActive && !gameOver && (
        <footer className="app-footer">
          <button className="end-session-btn" onClick={handleEndSession}>End Session</button>
        </footer>
      )}

      <MilestoneBanner milestone={milestone} />
      {gameOver && <GameOverScreen stats={{ cardsPlayed, totalSpent, totalWon, biggestWin }} timeExpired={goReason === 'time'} onPlayAgain={handlePlayAgain} />}
      <PrizeTierTable visible={showTiers} onClose={() => setShowTiers(false)} />
    </div>
  );
}
