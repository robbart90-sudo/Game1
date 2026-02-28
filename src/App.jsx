import { useState, useCallback, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import ScratchCard     from './components/ScratchCard';
import CardPicker      from './components/CardPicker';
import HeatMeter       from './components/HeatMeter';
import BalanceBar      from './components/BalanceBar';
import PrizeTierTable  from './components/PrizeTierTable';
import GameOverScreen  from './components/GameOverScreen';
import SegmentedBar    from './components/SegmentedBar';
import MilestoneBanner from './components/MilestoneBanner';
import GoalBar         from './components/GoalBar';
import Tutorial, { tutorialHasSeen } from './components/Tutorial';
import AttendantCutscene from './components/AttendantCutscene';
import GasStationShop, { SHOP_ITEMS } from './components/GasStationShop';
import ToastManager, { useToast } from './components/ToastManager';
import { useSound }    from './hooks/useSound';
import { generateCard, STARTING_BALANCE } from './utils/lottery';
import { getRandomTheme } from './utils/themes';
import './App.css';

// Slide durations — 50% faster than original (20% faster than previous 260/295)
const SLIDE_OUT_MS = 208;
const SLIDE_IN_MS  = 236;

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

function sortOptions(opts) {
  return opts.sort((a, b) => a.cost - b.cost || a.theme.name.localeCompare(b.theme.name));
}

function generatePickerOptions(speedMode, balance) {
  const options = [makeOption(speedMode, balance, true)];
  for (let i = 0; i < PICKER_COUNT - 1; i++) options.push(makeOption(speedMode, balance));
  return sortOptions(options);
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
  return sortOptions(opts);
}

export default function App() {
  // ── Toast system ──────────────────────────────────────────────────────────
  const { toasts, addToast: _addToast } = useToast();
  // Wrap addToast to play a subtle sound cue
  const addToast = useCallback((text, opts = {}) => {
    _addToast(text, opts);
    const isWarn = opts.anim === 'shake' || opts.type === 'red';
    soundRef.current?.tick(isWarn ? false : true);
  }, [_addToast]); // soundRef is a ref so no dep needed

  // ── Opening cutscene (first visit only) ──────────────────────────────────
  const [showCutscene, setShowCutscene] = useState(() => !localStorage.getItem('cutscene_seen'));

  // ── Tutorial ──────────────────────────────────────────────────────────────
  const [showTutorial, setShowTutorial] = useState(() => !tutorialHasSeen());

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
  const [cardData,       setCardData]       = useState(null);
  const [winMsg,         setWinMsg]         = useState(null);
  const [cardFlash,      setCardFlash]      = useState('');
  const [pickerOptions,  setPickerOptions]  = useState([]);
  // Flow State: result shown inline on picker — {index, won, prize} | null
  const [flowPickResult, setFlowPickResult] = useState(null);

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

  // ── Shop / powerup state ─────────────────────────────────────────────────
  const [brushBoostSecs, setBrushBoostSecs] = useState(0);
  const [slusheeSecs,    setSlusheeSecs]    = useState(0);
  const [nextCardWin,    setNextCardWin]    = useState(false);
  const [hotDogTrigger,  setHotDogTrigger]  = useState(0);
  const nextCardWinRef  = useRef(false);
  const friesTimerRef   = useRef(null);
  const slusheeTimerRef = useRef(null);
  const brushBoost = brushBoostSecs > 0 ? 1.5 : 1.0;

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
  const gameOverRef  = useRef(false);
  const sound        = useSound();
  soundRef.current   = sound;

  // ── Toast tracking refs (avoid re-triggering same toast) ──────────────────
  const consecWinsRef    = useRef(0);   // mirrors consecWins state for callbacks
  const speedStreakRef   = useRef(0);   // consecutive fast cards (< 4s)
  const heatToast50Ref  = useRef(false);
  const heatToast75Ref  = useRef(false);
  const lowBalanceRef   = useRef(false);
  const firstWinRef     = useRef(false);
  const goalToastRef    = useRef(false);

  useEffect(() => { speedModeRef.current = speedMode; },   [speedMode]);
  useEffect(() => { phaseRef.current = phase; },           [phase]);
  useEffect(() => { nextCardWinRef.current = nextCardWin; }, [nextCardWin]);
  useEffect(() => { gameOverRef.current = gameOver; },     [gameOver]);

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
    const cardsInFlow = flowRoundRef.current - 1; // rounds completed before exit
    flowStateRef.current = false;
    setFlowState(false);
    setFlowRound(0);
    flowRoundRef.current = 0;
    clearInterval(flowDrainRef.current);
    flowDrainRef.current = null;
    heatRef.current = 0;
    setHeat(0);
    heatToast50Ref.current = false;
    heatToast75Ref.current = false;
    startTimer(); // resume the countdown that was frozen on flow state entry
    if (cardsInFlow > 0) {
      addToast(`💨 Flow State over — ${cardsInFlow} card${cardsInFlow !== 1 ? 's' : ''} cashed`, { type: 'blue' });
    }
  }, [addToast, startTimer]);

  const enterFlowState = useCallback(() => {
    flowStateRef.current = true;
    flowRoundRef.current = 1;
    setFlowState(true);
    setFlowRound(1);
    setShowFlowBanner(true);
    setTimeout(() => setShowFlowBanner(false), 1000);
    clearInterval(flowDrainRef.current);
    stopTimer(); // freeze countdown during flow state
    addToast('⚡ FLOW STATE!', { type: 'gold', size: 'large' });
    // Drain ~8 pts/s
    flowDrainRef.current = setInterval(() => {
      heatRef.current = Math.max(0, heatRef.current - 1.2);
      setHeat(Math.round(heatRef.current));
      if (heatRef.current <= 0 && flowStateRef.current) exitFlowState();
    }, 150);
  }, [exitFlowState, addToast, stopTimer]);

  const updateHeat = useCallback((delta) => {
    heatRef.current = Math.max(0, Math.min(100, heatRef.current + delta));
    setHeat(Math.round(heatRef.current));
    const h = heatRef.current;
    if (delta > 0) {
      if (!heatToast50Ref.current && h >= 50) { heatToast50Ref.current = true; addToast('🌡️ Heating up...', { type: 'gold' }); }
      if (!heatToast75Ref.current && h >= 75) { heatToast75Ref.current = true; addToast('🔥 Almost there!', { type: 'orange' }); }
    } else {
      if (h < 50) heatToast50Ref.current = false;
      if (h < 75) heatToast75Ref.current = false;
    }
    if (h >= 100 && !flowStateRef.current) enterFlowState();
  }, [enterFlowState, addToast]);

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

  // ── Shop buy handler ──────────────────────────────────────────────────────
  const handleShopBuy = useCallback((id) => {
    const item = SHOP_ITEMS.find(i => i.id === id);
    if (!item || balanceRef.current < item.cost) return;
    updateBalance(b => b - item.cost);
    switch (id) {
      case 'coffee':
        timeLeftRef.current += 10;
        setTimeLeft(t => t + 10);
        addToast('☕ +10 seconds!', { type: 'blue' });
        break;
      case 'fries':
        setBrushBoostSecs(10);
        addToast('🍟 Big brush · 10s', { type: 'gold' });
        break;
      case 'gas':
        updateHeat(100);
        addToast('⛽ Heat maxed!', { type: 'orange' });
        break;
      case 'hotdog':
        setHotDogTrigger(t => t + 1);
        addToast('🌭 Auto-scratching!', { type: 'gold' });
        break;
      case 'slushee':
        setSlusheeSecs(5);
        stopTimer();
        addToast('🥤 Timer frozen · 5s', { type: 'blue' });
        break;
      case 'luckystar':
        setNextCardWin(true);
        addToast('⭐ Next card wins!', { type: 'gold' });
        break;
      default: break;
    }
  }, [addToast, updateHeat, stopTimer]);

  // ── Card complete handler (normal scratch only — flow state is handled by handleFlowPick)
  const handleComplete = useCallback((scratchSecs) => {
    if (phaseRef.current !== 'playing') return;
    setPhase('result'); phaseRef.current = 'result';

    const card  = cardRef.current;
    if (!card) return;
    const prize = card.totalPrize;
    const td    = 2000;

    if (prize > 0) {
      updateBalance(b => b + prize);
      setTotalWon(t => t + prize);
      setBiggestWin(b => Math.max(b, prize));
      applyWinFeedback(prize);

      addToast(`💰 +${prize.toLocaleString()} coins!`, { type: 'gold', duration: td });
      if (prize > 5000) addToast('💎 JACKPOT!', { type: 'jackpot', size: 'large', duration: td });
      else if (prize > 500) addToast('🤑 Big money!', { type: 'gold', duration: td });

      if (!firstWinRef.current) { firstWinRef.current = true; addToast('🎉 First blood!', { type: 'green', duration: td }); }

      setConsecWins(c => {
        const n = c + 1;
        consecWinsRef.current = n;
        if (n === 1 && !seenRef.current.has('firstWin')) triggerMilestone('firstWin');
        if (n === 3) { triggerMilestone('onARoll'); addToast('🔥 Three in a row!', { type: 'orange', duration: td }); }
        if (n === 5) { triggerMilestone('lucky5');  addToast("⚡ You're on FIRE!",  { type: 'red',    duration: td }); }
        if (n === 10) addToast('👑 UNSTOPPABLE', { type: 'gold', size: 'large', duration: td });
        return n;
      });

      if (prize >= 500) triggerMilestone('highRoller');
      setWinMsg({ text: `${prize >= 5000 ? '🏆 JACKPOT' : prize >= 500 ? '💎 BIG WIN' : prize >= 100 ? '⭐ WIN' : '🎉 WIN'} — +${prize.toLocaleString()} 🪙`, tier: prize >= 5000 ? 'jackpot' : prize >= 500 ? 'big' : prize >= 100 ? 'medium' : 'small' });
      updateHeat(prize >= 5000 ? 50 : prize >= 500 ? 35 : 18);
    } else {
      consecWinsRef.current = 0;
      setConsecWins(0);
      soundRef.current?.tick(false);
      setWinMsg({ text: 'No match — better luck next time!', tier: 'none' });
      updateHeat(-10);
    }

    // Speed toasts
    if (scratchSecs !== null) {
      if (scratchSecs < 3) addToast('⚡ Lightning round!', { type: 'blue' });
      if (scratchSecs < 4) {
        speedStreakRef.current++;
        if (speedStreakRef.current === 5) addToast('🚀 Speed demon!', { type: 'purple' });
      } else {
        speedStreakRef.current = 0;
      }
    }
    if (scratchSecs !== null && scratchSecs < 5) {
      triggerMilestone('speedDemon');
      updateBalance(b => b + 5);
      setTotalWon(t => t + 5);
    }

    setBalance(b => {
      if (!goalAchieved && b >= GOAL_BALANCE) {
        setGoalAchieved(true);
        triggerMilestone('goalHit');
        if (!goalToastRef.current) { goalToastRef.current = true; addToast('📈 Doubled up!', { type: 'green' }); }
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#D4AF37','#FFE066','#fff'] });
      }
      if (!lowBalanceRef.current && b < STARTING_BALANCE * 0.25 && b > 0) {
        lowBalanceRef.current = true;
        addToast('😬 Running low...', { type: 'red', anim: 'shake' });
      }
      return b;
    });

    const delay = prize > 0 ? 1200 : 800;
    // No pre-generated options — let showPicker check flowStateRef and pick the right generator
    setTimeout(() => showPicker(), delay);
  }, [applyWinFeedback, goalAchieved, triggerMilestone, updateHeat, showPicker, addToast]);

  // ── Flow state: player picks → resolve inline, no navigation ────────────
  const handleFlowPick = useCallback((index) => {
    const opt = pickerOptions[index];
    if (!opt || !opt.canAfford) return;

    soundRef.current?.deal();
    updateBalance(b => b - opt.cost);
    setTotalSpent(s => s + opt.cost);
    setCardsPlayed(c => c + 1);

    const card  = opt.card;
    const prize = card.totalPrize;
    const won   = prize > 0;
    const td    = 1200;

    if (won) {
      updateBalance(b => b + prize);
      setTotalWon(t => t + prize);
      setBiggestWin(b => Math.max(b, prize));
      applyWinFeedback(prize);

      addToast(`💰 +${prize.toLocaleString()} coins!`, { type: 'gold', duration: td });
      if (prize > 5000) addToast('💎 JACKPOT!', { type: 'jackpot', size: 'large', duration: td });
      else if (prize > 500) addToast('🤑 Big money!', { type: 'gold', duration: td });

      setConsecWins(c => {
        const n = c + 1;
        consecWinsRef.current = n;
        if (n === 3) addToast('🔥 Three in a row!', { type: 'orange', duration: td });
        if (n === 5) addToast("⚡ You're on FIRE!", { type: 'red', duration: td });
        return n;
      });

      // Advance flow round and show odds-warning toasts
      const r = flowRoundRef.current + 1;
      flowRoundRef.current = r;
      setFlowRound(r);
      if (r === 3) addToast('👀 Odds shifting...', { type: 'gold', duration: td });
      if (r === 5) addToast('😰 Getting risky...', { type: 'orange', anim: 'shake', duration: td });
      if (r >= 6)  addToast('🎲 One winner left...', { type: 'red',  anim: 'shake', duration: td });
    } else {
      consecWinsRef.current = 0;
      setConsecWins(0);
      soundRef.current?.tick(false);
      exitFlowState();
    }

    // Goal / low-balance checks
    setBalance(b => {
      if (!goalAchieved && b >= GOAL_BALANCE) {
        setGoalAchieved(true);
        triggerMilestone('goalHit');
        if (!goalToastRef.current) { goalToastRef.current = true; addToast('📈 Doubled up!', { type: 'green' }); }
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#D4AF37','#FFE066','#fff'] });
      }
      if (!lowBalanceRef.current && b < STARTING_BALANCE * 0.25 && b > 0) {
        lowBalanceRef.current = true;
        addToast('😬 Running low...', { type: 'red', anim: 'shake' });
      }
      return b;
    });

    // Show result on the picked card for 400ms, then refresh or exit
    setFlowPickResult({ index, won, prize });
    setTimeout(() => {
      setFlowPickResult(null);
      if (flowStateRef.current) {
        // Won — stay in flow state, refresh cards in place
        const newOpts = generateFlowPickerOptions(speedModeRef.current, balanceRef.current, flowRoundRef.current);
        setPickerOptions(newOpts);
      } else {
        // Lost — flow state ended, slide to normal picker
        showPicker();
      }
    }, 400);
  }, [pickerOptions, applyWinFeedback, exitFlowState, goalAchieved, triggerMilestone,
      addToast, showPicker]);

  // ── Normal: player picks from picker ──────────────────────────────────────
  const handlePick = useCallback((index) => {
    const opt = pickerOptions[index];
    if (!opt || !opt.canAfford) return;
    if (flowStateRef.current) { handleFlowPick(index); return; }

    const { cost } = opt;
    // Lucky Star: regenerate the chosen card as a guaranteed winner
    let card = opt.card;
    if (nextCardWinRef.current) {
      card = generateCard(opt.theme, true);
      setNextCardWin(false);
    }

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
    setCardData(null); setPickerOptions([]); setFlowPickResult(null);
    setWinMsg(null); setCardFlash(''); setSlideClass(''); setSlideTarget('card');
    setConsecWins(0); setGoalAchieved(false); setMilestone(null);
    resetTimer(speedMode ? SPEED_TIME : NORMAL_TIME);
    setGameOver(false); setShaking(false);
    setPhase('intro'); phaseRef.current = 'intro';
    // Reset shop state
    setBrushBoostSecs(0); setSlusheeSecs(0); setNextCardWin(false); setHotDogTrigger(0);
    nextCardWinRef.current = false;
    if (friesTimerRef.current)   { clearInterval(friesTimerRef.current);   friesTimerRef.current   = null; }
    if (slusheeTimerRef.current) { clearInterval(slusheeTimerRef.current); slusheeTimerRef.current = null; }
    // Reset toast tracking refs
    consecWinsRef.current  = 0;
    speedStreakRef.current  = 0;
    heatToast50Ref.current = false;
    heatToast75Ref.current = false;
    lowBalanceRef.current  = false;
    firstWinRef.current    = false;
    goalToastRef.current   = false;
  }, [stopTimer, exitFlowState, resetTimer, speedMode]);

  // ── Fries: 50% bigger brush countdown (10 s) ─────────────────────────────
  useEffect(() => {
    if (brushBoostSecs <= 0 || friesTimerRef.current) return;
    friesTimerRef.current = setInterval(() => {
      setBrushBoostSecs(s => {
        if (s <= 1) { clearInterval(friesTimerRef.current); friesTimerRef.current = null; return 0; }
        return s - 1;
      });
    }, 1000);
  }, [brushBoostSecs]);

  // ── Slushee: freeze main timer countdown (5 s) ────────────────────────────
  useEffect(() => {
    if (slusheeSecs <= 0 || slusheeTimerRef.current) return;
    slusheeTimerRef.current = setInterval(() => {
      setSlusheeSecs(s => {
        if (s <= 1) {
          clearInterval(slusheeTimerRef.current);
          slusheeTimerRef.current = null;
          if (!flowStateRef.current && !gameOverRef.current && phaseRef.current !== 'intro') startTimer();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [slusheeSecs, startTimer]);

  // Cleanup on unmount
  useEffect(() => () => {
    stopTimer();
    clearInterval(flowDrainRef.current);
    clearInterval(friesTimerRef.current);
    clearInterval(slusheeTimerRef.current);
  }, [stopTimer]);

  const isActive = phase !== 'intro';

  return (
    <div className={`app ${shaking ? 'shaking' : ''} ${flowState ? 'flow-state' : ''}`}>

      {/* ── Flow State banner ─────────────────── */}
      {showFlowBanner && <div className="flow-state-banner">⚡ FLOW STATE ⚡</div>}

      {/* ── Header ──────────────────────────── */}
      <header className="app-header">
        <h1 className="title">🎰 Scratch &amp; Win</h1>
        <div className="header-right">
          <button className="info-btn" onClick={() => setShowTutorial(true)} title="How to play">?</button>
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

        {/* ── Status panel: timer bar (top) + heat bar (bottom) ── */}
        {isActive && (
          <div className="status-panel">
            <SegmentedBar
              count={timeLeft}
              maxCount={speedMode ? SPEED_TIME : NORMAL_TIME}
              color={timeLeft <= 10 && !!timerIntervalRef.current ? 'timer-urgent' : 'timer'}
              label={speedMode ? '⚡ SPEED' : slusheeSecs > 0 ? '🥤 FROZEN' : '⏱ TIMER'}
              rightLabel={`${timeLeft}s`}
            />
            <HeatMeter heat={heat} flowState={flowState} flowRound={flowRound} />
            {brushBoostSecs > 0 && (
              <SegmentedBar count={brushBoostSecs} maxCount={10} color="fries"   label="🍟 BIG BRUSH" rightLabel={`${brushBoostSecs}s`} />
            )}
            {slusheeSecs > 0 && (
              <SegmentedBar count={slusheeSecs}    maxCount={5}  color="slushee" label="🥤 FROZEN"    rightLabel={`${slusheeSecs}s`}    />
            )}
          </div>
        )}

        {/* ── Gas Station Shop ─────────────────────────────────────── */}
        {isActive && !gameOver && (
          <GasStationShop
            balance={balance}
            phase={phase}
            brushBoostSecs={brushBoostSecs}
            slusheeSecs={slusheeSecs}
            nextCardWin={nextCardWin}
            onBuy={handleShopBuy}
          />
        )}

        {/* Card view — normal scratch only (never shown during flow state) */}
        {(phase === 'playing' || phase === 'result') && cardData && slideTarget === 'card' && (
          <div className={`card-area ${cardFlash} ${slideClass}`}>
            <ScratchCard
              key={`${cardData.theme.id}-${cardsPlayed}`}
              cardData={cardData}
              onComplete={handleComplete}
              soundScratch={sound.scratch}
              heat={heat}
              brushBoost={brushBoost}
              hotDogTrigger={hotDogTrigger}
            />
            {winMsg && <div className={`result-msg tier-${winMsg.tier}`}>{winMsg.text}</div>}
          </div>
        )}

        {/* Picker view — also the persistent flow state screen */}
        {phase === 'picking' && slideTarget === 'picker' && (
          <div className={`picker-area ${slideClass}`}>
            <CardPicker
              options={pickerOptions}
              onPick={handlePick}
              flowState={flowState}
              flowPickResult={flowPickResult}
            />
          </div>
        )}
      </main>

      {isActive && !gameOver && (
        <footer className="app-footer">
          <button className="end-session-btn" onClick={handleEndSession}>End Session</button>
        </footer>
      )}

      <MilestoneBanner milestone={milestone} />
      <ToastManager toasts={toasts} />
      {gameOver && <GameOverScreen stats={{ cardsPlayed, totalSpent, totalWon, biggestWin }} timeExpired={goReason === 'time'} onPlayAgain={handlePlayAgain} />}
      <PrizeTierTable visible={showTiers} onClose={() => setShowTiers(false)} />
      {showTutorial && <Tutorial onDone={() => setShowTutorial(false)} />}
      {showCutscene && (
        <AttendantCutscene onDone={() => {
          localStorage.setItem('cutscene_seen', '1');
          setShowCutscene(false);
        }} />
      )}
    </div>
  );
}
