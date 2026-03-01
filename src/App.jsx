import { useState, useCallback, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import ScratchToolOverlay from './components/ScratchToolOverlay';
import CardPicker      from './components/CardPicker';
import FlowMeter       from './components/FlowMeter';
import BalanceBar      from './components/BalanceBar';
import PrizeTierTable  from './components/PrizeTierTable';
import GameOverScreen  from './components/GameOverScreen';
import SegmentedBar    from './components/SegmentedBar';
import Tutorial, { tutorialHasSeen } from './components/Tutorial';
import AttendantCutscene from './components/AttendantCutscene';
import AttendantReaction from './components/AttendantReaction';
import GasStationShop, { SHOP_ITEMS } from './components/GasStationShop';
import { useSound }    from './hooks/useSound';
import { generateCard, STARTING_BALANCE, RISK_CARD_CHANCE, RISK_CARD_MIN_BALANCE } from './utils/lottery';
import { getRandomTheme } from './utils/themes';
import './App.css';

// ── localStorage keys ─────────────────────────────────────────────────────────
const LS_BALANCE    = 'grig_balance';
const LS_LIFETIME   = 'grig_lifetime_earned';
const LS_MILESTONES = 'grig_milestones';

// ── Lifetime earnings milestones — Grig reacts once per threshold, never repeats ─
const LIFETIME_MILESTONES = [
  { at:  2500, line: "You're better at this than most."              },
  { at:  5000, line: "I've seen a lot of people come through here."  },
  { at:  8000, line: "You keep this up, you won't need this place."  },
  { at: 12000, line: "There's a city, you know. For people like you." },
  { at: 16000, line: "Gamble City. That's where the real games are." },
  { at: 20000, line: "I've got a car, you know. Been sitting out back." },
  { at: 23000, line: "Keys are right here if you ever need them."    },
];

// Slide durations — 50% faster than original (20% faster than previous 260/295)
const SLIDE_OUT_MS = 208;
const SLIDE_IN_MS  = 236;

const NORMAL_TIME  = 60;
const SPEED_TIME   = 30;
const PICKER_COUNT = 6;

// ── BALANCE CONSTANTS — tweak economy here without touching game logic ─────────
const PASSIVE_DRAIN_COINS      = 1;  // coins deducted per tick
const PASSIVE_DRAIN_INTERVAL_S = 3;  // seconds between drain ticks

// ── Streak constants ──────────────────────────────────────────────────────────
const STREAK_SHOW_MIN      = 3;    // consecutive wins needed before badge appears
const STREAK_THRESHOLD_A   = 3;    // streak count where 1.5× prize mult activates
const STREAK_THRESHOLD_B   = 5;    // streak count where 2×  prize mult activates
const STREAK_THRESHOLD_C   = 7;    // streak count where 3×  prize mult activates
const STREAK_PRIZE_MULT_A  = 1.5;
const STREAK_PRIZE_MULT_B  = 2;
const STREAK_PRIZE_MULT_C  = 3;
const STREAK_FLOW_BONUS    = 0.15; // extra flow fill fraction per streak win above 2
// ─────────────────────────────────────────────────────────────────────────────

// ── Attendant dialogue lines ─────────────────────────────────────────────
const DIALOGUE_LINES = [
  "Clean up aisle 5.",
  "They should come pre-scratched.",
  "Take my card.",
  "We're going to need a new roll.",
  "Chicken dinner, and all that.",
  "Winner?",
  "Loser?",
  "I love my job.",
  "Good luck.",
  "Smells like gas.",
  "Nice one.",
  "New roll.",
];
const FLOW_MILESTONE_LINES = ["Hmm\u2026", "Never seen this\u2026", "My goodness!"];

// ── Pressure helpers (pure — outside component) ───────────────────────────
const PRESSURE_CLASS = ['', 'pressure-low', 'pressure-medium', 'pressure-high', 'pressure-critical'];

function lerpC(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

function timerPressure(t) {
  if (t > 45) return 0;
  if (t > 30)  return lerpC(0,  25, (45 - t) / 15);
  if (t > 15)  return lerpC(25, 50, (30 - t) / 15);
  if (t > 8)   return lerpC(50, 75, (15 - t) / 7);
  return               lerpC(75, 100, (8 - t) / 8);
}
function coinPressure(c) {
  if (c > 40) return 0;
  if (c > 25)  return lerpC(0,  25, (40 - c) / 15);
  if (c > 15)  return lerpC(25, 50, (25 - c) / 10);
  if (c > 8)   return lerpC(50, 75, (15 - c) / 7);
  return               lerpC(75, 100, (8 - c) / 8);
}
function pressureScore(t, c) { return (timerPressure(t) + coinPressure(c)) / 2; }
function pressureMult(t, c) {
  const s = pressureScore(t, c);
  if (s <= 0)  return 1;
  if (s <= 25) return lerpC(1,   1.5, s / 25);
  if (s <= 50) return lerpC(1.5, 2,   (s - 25) / 25);
  if (s <= 75) return lerpC(2,   3,   (s - 50) / 25);
  return              lerpC(3,   5,   (s - 75) / 25);
}
function calcPressureLvl(t, c) {
  const s = pressureScore(t, c);
  return s <= 0 ? 0 : s < 25 ? 1 : s < 50 ? 2 : s < 75 ? 3 : 4;
}

// Prize multiplier for the current streak count
function streakPrizeMult(n) {
  if (n >= STREAK_THRESHOLD_C) return STREAK_PRIZE_MULT_C;
  if (n >= STREAK_THRESHOLD_B) return STREAK_PRIZE_MULT_B;
  if (n >= STREAK_THRESHOLD_A) return STREAK_PRIZE_MULT_A;
  return 1;
}
// Extra flow fill multiplier — grows linearly above streak 2
function streakFlowMult(n) {
  return 1 + Math.max(0, n - 2) * STREAK_FLOW_BONUS;
}

function makeOption(speedMode, balance, forceWin = false, isDark = false) {
  const theme = getRandomTheme();
  const cost  = speedMode ? 1 : theme.price;
  const card  = generateCard(speedMode ? { ...theme, price: 1 } : theme, forceWin);
  return { theme, card, cost, canAfford: balance >= cost, isDark };
}

function sortOptions(opts) {
  return opts.sort((a, b) => a.cost - b.cost || a.theme.name.localeCompare(b.theme.name));
}

function generatePickerOptions(speedMode, balance, allowRisk = false) {
  const options = [makeOption(speedMode, balance, true)];
  for (let i = 0; i < PICKER_COUNT - 1; i++) options.push(makeOption(speedMode, balance));
  if (allowRisk && Math.random() < RISK_CARD_CHANCE) {
    const idx = Math.floor(Math.random() * options.length);
    options[idx] = { ...options[idx], isRisk: true };
  }
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
  // ── Attendant dialogue ────────────────────────────────────────────────────
  const attendantSeqRef = useRef(0);
  const [attendantMsg, setAttendantMsg] = useState(null);

  // Low-level: deliver a specific line to the attendant bubble
  const speakDialogue = useCallback((text) => {
    lastAttendantLineRef.current = text;
    setAttendantMsg({ text, seq: ++attendantSeqRef.current });
  }, []);

  // Ordered flow-state milestone lines ("Hmm…" / "Never seen this…" / "My goodness!")
  const triggerFlowMilestone = useCallback(() => {
    const idx  = Math.min(flowMilestoneCountRef.current, FLOW_MILESTONE_LINES.length - 1);
    flowMilestoneCountRef.current++;
    speakDialogue(FLOW_MILESTONE_LINES[idx]);
  }, [speakDialogue]);

  // Random quip from pool — no consecutive repeat; gas smell triggers follow-up
  const triggerAttendantDialogue = useCallback(() => {
    let line;
    if (nextIsGasReplyRef.current) {
      line = "Gas doesn't have a smell.";
      nextIsGasReplyRef.current = false;
    } else {
      const pool = DIALOGUE_LINES.filter(l => l !== lastAttendantLineRef.current);
      line = pool[Math.floor(Math.random() * pool.length)];
      if (line === "Smells like gas.") nextIsGasReplyRef.current = true;
    }
    speakDialogue(line);
  }, [speakDialogue]);

  // Called after every card — fires the attendant every 4th card
  const maybeShowAttendant = useCallback(() => {
    cardsSinceAttendantRef.current++;
    if (cardsSinceAttendantRef.current >= 4) {
      cardsSinceAttendantRef.current = 0;
      triggerAttendantDialogue();
    }
  }, [triggerAttendantDialogue]);

  // Fire the lowest unmet lifetime milestone (once per threshold, ever)
  const checkLifetimeMilestones = useCallback((earned) => {
    for (const m of LIFETIME_MILESTONES) {
      if (earned >= m.at && !triggeredMilestonesRef.current.has(m.at)) {
        triggeredMilestonesRef.current.add(m.at);
        localStorage.setItem(LS_MILESTONES, JSON.stringify([...triggeredMilestonesRef.current]));
        speakDialogue(m.line);
        cardsSinceAttendantRef.current = 0; // override the 4-card rule
        break; // one milestone per event — next one fires on the next win
      }
    }
  }, [speakDialogue]);

  // Add to lifetime earnings (persisted forever) and check milestones
  const addLifetimeEarned = useCallback((amount) => {
    if (amount <= 0) return;
    const next = lifetimeEarnedRef.current + amount;
    lifetimeEarnedRef.current = next;
    localStorage.setItem(LS_LIFETIME, next);
    checkLifetimeMilestones(next);
  }, [checkLifetimeMilestones]);

  // ── Opening cutscene (first visit only) ──────────────────────────────────
  const [showCutscene, setShowCutscene] = useState(() => !localStorage.getItem('cutscene_seen'));

  // ── Tutorial ──────────────────────────────────────────────────────────────
  const [showTutorial, setShowTutorial] = useState(() => !tutorialHasSeen());

  // ── Balance & stats ──────────────────────────────────────────────────────
  // Balance persists across sessions via localStorage; new players start at STARTING_BALANCE
  const initBalance = (() => {
    const v = localStorage.getItem(LS_BALANCE);
    return v !== null ? Number(v) : STARTING_BALANCE;
  })();
  const [balance,     setBalance]     = useState(initBalance);
  const [totalWon,    setTotalWon]    = useState(0);
  const [totalSpent,  setTotalSpent]  = useState(0);
  const [cardsPlayed, setCardsPlayed] = useState(0);
  const [biggestWin,  setBiggestWin]  = useState(0);
  const cardsPlayedRef = useRef(0);

  // ── Risk Card result overlay ──────────────────────────────────────────────
  const [riskResult, setRiskResult] = useState(null); // { won: bool } | null

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

  // ── Timer — lives in a ref, NEVER pauses for any reason ─────────────────
  const [timeLeft,       setTimeLeft]       = useState(NORMAL_TIME);
  const [speedMode,      setSpeedMode]      = useState(false);
  const timerIntervalRef = useRef(null);
  const timeLeftRef      = useRef(NORMAL_TIME);

  // ── Flow State Meter ──────────────────────────────────────────────────────
  const [flowLevel,      setFlowLevel]      = useState(0);
  const [flowState,      setFlowState]      = useState(false);
  const [flowRound,      setFlowRound]      = useState(0);
  const [showFlowBanner, setShowFlowBanner] = useState(false);
  const flowLevelRef = useRef(0);
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
  const drainIntervalRef = useRef(null);
  const brushBoost = brushBoostSecs > 0 ? 1.5 : 1.0;

  // ── Streak ───────────────────────────────────────────────────────────────
  const [consecWins,    setConsecWins]    = useState(0);
  const [prevStreak,    setPrevStreak]    = useState(0); // held briefly for break animation
  const consecWinsRef      = useRef(0);
  const streakBreakTimerRef = useRef(null);

  // ── UI ────────────────────────────────────────────────────────────────────
  const [gameOver,  setGameOver]  = useState(false);
  const [goReason,  setGoReason]  = useState('coins');
  const [showTiers, setShowTiers] = useState(false);
  const [shaking,   setShaking]   = useState(false);
  const [pressureLvl, setPressureLvl] = useState(0);
  const prevPressureLvlRef = useRef(0);

  // ── Stable refs ───────────────────────────────────────────────────────────
  const cardRef           = useRef(null);
  const balanceRef        = useRef(initBalance);
  const speedModeRef      = useRef(false);
  const soundRef          = useRef(null);
  const gameOverRef       = useRef(false);
  const lifetimeEarnedRef = useRef(Number(localStorage.getItem(LS_LIFETIME) || 0));
  const triggeredMilestonesRef = useRef(
    new Set(JSON.parse(localStorage.getItem(LS_MILESTONES) || '[]'))
  );
  const prizeRafCancelRef = useRef(null); // cancel fn for active prize count-up RAF
  const sound             = useSound();
  soundRef.current        = sound;

  // ── Balance animation duration — synced to prize count-up ─────────────────
  const [balanceDuration, setBalanceDuration] = useState(600);

  // ── Attendant dialogue state ──────────────────────────────────────────────
  const cardsSinceAttendantRef = useRef(0);   // resets to 0 after each quip
  const lastAttendantLineRef   = useRef(null); // prevent consecutive repeats
  const nextIsGasReplyRef      = useRef(false);// "Smells like gas." follow-up flag
  const flowMilestoneCountRef  = useRef(0);    // 0=Hmm, 1=Never seen, 2+=My goodness

  useEffect(() => { speedModeRef.current = speedMode; },         [speedMode]);
  useEffect(() => { phaseRef.current = phase; },                 [phase]);
  useEffect(() => { nextCardWinRef.current = nextCardWin; },     [nextCardWin]);
  useEffect(() => { gameOverRef.current = gameOver; },           [gameOver]);
  useEffect(() => { cardsPlayedRef.current = cardsPlayed; },     [cardsPlayed]);
  // Persist balance to localStorage whenever it changes
  useEffect(() => { localStorage.setItem(LS_BALANCE, balance); }, [balance]);

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

  const stopDrain = useCallback(() => {
    clearInterval(drainIntervalRef.current);
    drainIntervalRef.current = null;
  }, []);

  const startDrain = useCallback(() => {
    if (drainIntervalRef.current) return;
    drainIntervalRef.current = setInterval(() => {
      if (!timerIntervalRef.current) return; // timer paused (flow state or slushee) — skip tick
      if (balanceRef.current <= 0) return;
      const next = Math.max(0, balanceRef.current - PASSIVE_DRAIN_COINS);
      balanceRef.current = next;
      setBalance(next);
      if (next <= 0) {
        clearInterval(drainIntervalRef.current);
        drainIntervalRef.current = null;
        stopTimer();
        setGameOver(true);
        setGoReason('coins');
      }
    }, PASSIVE_DRAIN_INTERVAL_S * 1000);
  }, [stopTimer]);

  // ── Flow State Meter logic ────────────────────────────────────────────────
  const exitFlowState = useCallback(() => {
    flowStateRef.current = false;
    setFlowState(false);
    setFlowRound(0);
    flowRoundRef.current = 0;
    clearInterval(flowDrainRef.current);
    flowDrainRef.current = null;
    flowLevelRef.current = 0;
    setFlowLevel(0);
    startTimer(); // resume the countdown that was frozen on flow state entry
  }, [startTimer]);

  const enterFlowState = useCallback(() => {
    flowStateRef.current = true;
    flowRoundRef.current = 1;
    setFlowState(true);
    setFlowRound(1);
    setShowFlowBanner(true);
    setTimeout(() => setShowFlowBanner(false), 1000);
    clearInterval(flowDrainRef.current);
    stopTimer(); // freeze countdown during flow state
    soundRef.current?.flowActivate();
    triggerFlowMilestone();
    // Drain ~8 pts/s
    flowDrainRef.current = setInterval(() => {
      flowLevelRef.current = Math.max(0, flowLevelRef.current - 1.2);
      setFlowLevel(Math.round(flowLevelRef.current));
      if (flowLevelRef.current <= 0 && flowStateRef.current) exitFlowState();
    }, 150);
  }, [exitFlowState, stopTimer, triggerFlowMilestone]);

  const updateFlowLevel = useCallback((delta) => {
    flowLevelRef.current = Math.max(0, Math.min(100, flowLevelRef.current + delta));
    setFlowLevel(Math.round(flowLevelRef.current));
    if (flowLevelRef.current >= 100 && !flowStateRef.current) enterFlowState();
  }, [enterFlowState]);

  // ── Win feedback ──────────────────────────────────────────────────────────
  const applyWinFeedback = useCallback((prize) => {
    if (prize <= 0) return;
    if (prize < 20) {
      setCardFlash('flash-gold');
      setTimeout(() => setCardFlash(''), 600);
      soundRef.current?.ching(1);
    } else if (prize < 100) {
      setCardFlash('flash-medium');
      setTimeout(() => setCardFlash(''), 800);
      confetti({ particleCount: 80, spread: 65, origin: { y: 0.65 } });
      soundRef.current?.ching(2);
    } else if (prize < 500) {
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
      stopDrain();
      setGameOver(true);
      setGoReason('coins');
      return;
    }
    const allowRisk = !flowStateRef.current
      && cardsPlayedRef.current >= 3
      && balanceRef.current >= RISK_CARD_MIN_BALANCE;
    const opts = pregenOptions ||
      (flowStateRef.current
        ? generateFlowPickerOptions(speedModeRef.current, balanceRef.current, flowRoundRef.current)
        : generatePickerOptions(speedModeRef.current, balanceRef.current, allowRisk));
    setPickerOptions(opts);
    slideOut(() => slideInNew(() => {
      setWinMsg(null); setCardFlash('');
      setSlideTarget('picker');
      setPhase('picking'); phaseRef.current = 'picking';
    }));
  }, [slideOut, slideInNew, stopTimer, stopDrain]);

  // ── Shop buy handler ──────────────────────────────────────────────────────
  const handleShopBuy = useCallback((id) => {
    const item = SHOP_ITEMS.find(i => i.id === id);
    if (!item || balanceRef.current < item.cost) return;
    updateBalance(b => b - item.cost);
    switch (id) {
      case 'coffee':   timeLeftRef.current += 10; setTimeLeft(t => t + 10); break;
      case 'fries':    setBrushBoostSecs(10); break;
      case 'gas':      updateFlowLevel(100); break;
      case 'hotdog':   setHotDogTrigger(t => t + 1); break;
      case 'slushee':  setSlusheeSecs(5); stopTimer(); break;
      case 'luckystar': setNextCardWin(true); break;
      case 'car':       stopTimer(); speakDialogue('Keys are right here.'); setGoReason('win'); setGameOver(true); break;
      default: break;
    }
  }, [updateFlowLevel, stopTimer, speakDialogue]);

  // ── Card complete handler (normal scratch only — flow state is handled by handleFlowPick)
  const handleComplete = useCallback((scratchSecs) => {
    if (phaseRef.current !== 'playing') return;
    setPhase('result'); phaseRef.current = 'result';

    const card  = cardRef.current;
    if (!card) return;
    const prize = card.totalPrize;

    if (prize > 0) {
      // ── Streak: increment and apply prize multiplier ──────────────────
      const newStreak = consecWinsRef.current + 1;
      consecWinsRef.current = newStreak;
      setConsecWins(newStreak);
      // Clear any break-animation that might still be running
      if (newStreak === STREAK_SHOW_MIN && streakBreakTimerRef.current) {
        clearTimeout(streakBreakTimerRef.current);
        streakBreakTimerRef.current = null;
        setPrevStreak(0);
      }
      const sMult   = streakPrizeMult(newStreak);
      const boosted = sMult > 1 ? Math.floor(prize * sMult) : prize;
      const dur     = boosted >= 500 ? 2000 : boosted < 10 ? 400 : 800;
      const tier    = prize >= 500 ? 'jackpot' : prize >= 20 ? 'big' : 'small';
      const label   = prize >= 500 ? '🏆 JACKPOT' : prize >= 20 ? '💎 BIG WIN' : '🎉 WIN';
      const multTag = sMult > 1 ? `🔥×${sMult} ` : '';

      setBalanceDuration(dur);
      updateBalance(b => b + boosted);
      setTotalWon(t => t + boosted);
      setBiggestWin(b => Math.max(b, boosted));
      applyWinFeedback(prize); // visual tier based on base prize
      addLifetimeEarned(boosted);

      // ── Prize count-up animation ──────────────────────────────────────
      prizeRafCancelRef.current?.();
      const initText = sMult > 1
        ? `🔥×${sMult} ${label} — +0 🪙 → +${boosted.toLocaleString()} 🪙`
        : `${label} — +0 🪙`;
      setWinMsg({ text: initText, tier });
      prizeRafCancelRef.current = soundRef.current?.countUp(boosted, dur, (current, t) => {
        const finished = t >= 1;
        const text = finished
          ? `${multTag}${label} — +${boosted.toLocaleString()} 🪙`
          : sMult > 1
            ? `🔥×${sMult} ${label} — +${current.toLocaleString()} 🪙 → +${boosted.toLocaleString()} 🪙`
            : `${label} — +${current.toLocaleString()} 🪙`;
        setWinMsg({ text, tier });
      });

      const flowBase = prize >= 500 ? 50 : prize >= 30 ? 35 : 18;
      updateFlowLevel(flowBase * pressureMult(timeLeftRef.current, balanceRef.current) * streakFlowMult(newStreak));

      // ── Grig streak reactions (immediate — override 4-card rule) ──────
      if      (newStreak === STREAK_THRESHOLD_A) { speakDialogue('Hm.'); cardsSinceAttendantRef.current = 0; }
      else if (newStreak === STREAK_THRESHOLD_B) { speakDialogue('Chicken dinner, and all that.'); cardsSinceAttendantRef.current = 0; }
      else if (newStreak === STREAK_THRESHOLD_C) { speakDialogue('Never seen this\u2026'); cardsSinceAttendantRef.current = 0; }
      else                                        { maybeShowAttendant(); }

      // Wait for count-up to finish (+400ms buffer), min 1200ms
      const winDelay = Math.max(1200, dur + 400);
      setTimeout(() => { prizeRafCancelRef.current?.(); showPicker(); }, winDelay);
    } else {
      // ── Streak break ─────────────────────────────────────────────────
      const broken = consecWinsRef.current;
      consecWinsRef.current = 0;
      setConsecWins(0);
      if (broken >= STREAK_SHOW_MIN) {
        if (streakBreakTimerRef.current) clearTimeout(streakBreakTimerRef.current);
        setPrevStreak(broken);
        streakBreakTimerRef.current = setTimeout(() => {
          setPrevStreak(0);
          streakBreakTimerRef.current = null;
        }, 1600);
      }
      soundRef.current?.thud();
      setWinMsg({ text: 'No match — better luck next time!', tier: 'none' });
      updateFlowLevel(-10);
      maybeShowAttendant();
      setTimeout(() => showPicker(), 800);
    }
  }, [applyWinFeedback, updateFlowLevel, showPicker, maybeShowAttendant, speakDialogue, addLifetimeEarned]);

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

    if (won) {
      // ── Streak: increment and apply multiplier ─────────────────────
      const newStreak = consecWinsRef.current + 1;
      consecWinsRef.current = newStreak;
      setConsecWins(newStreak);
      if (newStreak === STREAK_SHOW_MIN && streakBreakTimerRef.current) {
        clearTimeout(streakBreakTimerRef.current);
        streakBreakTimerRef.current = null;
        setPrevStreak(0);
      }
      const sMult   = streakPrizeMult(newStreak);
      const boosted = sMult > 1 ? Math.floor(prize * sMult) : prize;
      updateBalance(b => b + boosted);
      setTotalWon(t => t + boosted);
      setBiggestWin(b => Math.max(b, boosted));
      applyWinFeedback(prize);
      addLifetimeEarned(boosted);
      const r = flowRoundRef.current + 1;
      flowRoundRef.current = r;
      setFlowRound(r);

      // Grig streak reactions
      if      (newStreak === STREAK_THRESHOLD_A) { speakDialogue('Hm.'); cardsSinceAttendantRef.current = 0; }
      else if (newStreak === STREAK_THRESHOLD_B) { speakDialogue('Chicken dinner, and all that.'); cardsSinceAttendantRef.current = 0; }
      else if (newStreak === STREAK_THRESHOLD_C) { speakDialogue('Never seen this\u2026'); cardsSinceAttendantRef.current = 0; }
      else                                        { maybeShowAttendant(); }
    } else {
      // ── Streak break ─────────────────────────────────────────────
      const broken = consecWinsRef.current;
      consecWinsRef.current = 0;
      setConsecWins(0);
      if (broken >= STREAK_SHOW_MIN) {
        if (streakBreakTimerRef.current) clearTimeout(streakBreakTimerRef.current);
        setPrevStreak(broken);
        streakBreakTimerRef.current = setTimeout(() => {
          setPrevStreak(0);
          streakBreakTimerRef.current = null;
        }, 1600);
      }
      soundRef.current?.thud();
      exitFlowState();
      maybeShowAttendant();
    }

    // Show result on the picked card for 400ms, then refresh or exit
    setFlowPickResult({ index, won, prize });
    setTimeout(() => {
      setFlowPickResult(null);
      if (flowStateRef.current) {
        const newOpts = generateFlowPickerOptions(speedModeRef.current, balanceRef.current, flowRoundRef.current);
        setPickerOptions(newOpts);
      } else {
        showPicker();
      }
    }, 400);
  }, [pickerOptions, applyWinFeedback, exitFlowState, maybeShowAttendant, showPicker, speakDialogue, addLifetimeEarned]);

  // ── Normal: player picks from picker ──────────────────────────────────────
  const handlePick = useCallback((index) => {
    const opt = pickerOptions[index];
    if (!opt || !opt.canAfford) return;
    if (flowStateRef.current) { handleFlowPick(index); return; }

    // ── Risk Card branch ────────────────────────────────────────────────
    if (opt.isRisk) {
      const { cost } = opt;
      soundRef.current?.deal();
      updateBalance(b => b - cost);
      setTotalSpent(s => s + cost);
      setCardsPlayed(c => c + 1);
      const won = Math.random() < 0.5;
      if (won) {
        updateBalance(b => b * 2);
        speakDialogue('Chicken dinner, and all that.');
      } else {
        updateBalance(() => 10);
        speakDialogue('Happens.');
      }
      setRiskResult({ won });
      setTimeout(() => { setRiskResult(null); showPicker(); }, 1500);
      return;
    }

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
    startDrain();
  }, [startTimer, startDrain]);

  // ── End session ────────────────────────────────────────────────────────────
  const handleEndSession = useCallback(() => {
    stopTimer();
    stopDrain();
    clearInterval(flowDrainRef.current);
    setGameOver(true);
    setGoReason('manual');
  }, [stopTimer, stopDrain]);

  // ── Speed mode toggle ──────────────────────────────────────────────────────
  const toggleSpeed = useCallback(() => {
    if (timerIntervalRef.current) return;
    setSpeedMode(s => {
      const next = !s;
      resetTimer(next ? SPEED_TIME : NORMAL_TIME);
      return next;
    });
  }, [resetTimer]);

  // ── Play again / Start Fresh ──────────────────────────────────────────────
  // Both paths share the same session reset. The only difference: startFresh
  // resets balance to STARTING_BALANCE; Play Again carries the balance over.
  const doRestart = useCallback((startFresh = false) => {
    // Reset flow state inline — do NOT call exitFlowState() here because it
    // calls startTimer(), which would restart the timer with the stale value
    // from the previous game before resetTimer() gets a chance to fix it.
    prizeRafCancelRef.current?.(); prizeRafCancelRef.current = null;
    setBalanceDuration(600);
    stopTimer(); stopDrain();
    flowStateRef.current = false; setFlowState(false);
    flowRoundRef.current = 0;    setFlowRound(0);
    flowLevelRef.current = 0;    setFlowLevel(0);
    clearInterval(flowDrainRef.current); flowDrainRef.current = null;
    if (startFresh) {
      // Start Fresh: reset balance to the starting amount
      balanceRef.current = STARTING_BALANCE;
      setBalance(STARTING_BALANCE);
      localStorage.setItem(LS_BALANCE, STARTING_BALANCE);
    }
    // Balance carries over on Play Again — no reset here
    setTotalWon(0); setTotalSpent(0); setCardsPlayed(0); setBiggestWin(0);
    cardsPlayedRef.current = 0;
    setCardData(null); setPickerOptions([]); setFlowPickResult(null); setRiskResult(null);
    setWinMsg(null); setCardFlash(''); setSlideClass(''); setSlideTarget('card');
    resetTimer(speedMode ? SPEED_TIME : NORMAL_TIME);
    setGameOver(false); setShaking(false);
    setPhase('intro'); phaseRef.current = 'intro';
    // Reset shop state
    setBrushBoostSecs(0); setSlusheeSecs(0); setNextCardWin(false); setHotDogTrigger(0);
    nextCardWinRef.current = false;
    if (friesTimerRef.current)   { clearInterval(friesTimerRef.current);   friesTimerRef.current   = null; }
    if (slusheeTimerRef.current) { clearInterval(slusheeTimerRef.current); slusheeTimerRef.current = null; }
    if (drainIntervalRef.current) { clearInterval(drainIntervalRef.current); drainIntervalRef.current = null; }
    // Reset session dialogue state (lifetime milestones and lifetimeEarned persist)
    cardsSinceAttendantRef.current = 0;
    lastAttendantLineRef.current   = null;
    nextIsGasReplyRef.current      = false;
    flowMilestoneCountRef.current  = 0;
    // Reset streak state
    consecWinsRef.current = 0;
    setConsecWins(0);
    setPrevStreak(0);
    if (streakBreakTimerRef.current) { clearTimeout(streakBreakTimerRef.current); streakBreakTimerRef.current = null; }
  }, [stopTimer, stopDrain, resetTimer, speedMode]);

  const handlePlayAgain  = useCallback(() => doRestart(false), [doRestart]);
  const handleStartFresh = useCallback(() => doRestart(true),  [doRestart]);

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

  // ── Pressure level — drives shake CSS class and flow fill-rate multiplier ──
  useEffect(() => {
    const active = phase !== 'intro' && !gameOver && !flowState;
    const lvl = active ? calcPressureLvl(timeLeft, balance) : 0;
    if (lvl !== prevPressureLvlRef.current) {
      prevPressureLvlRef.current = lvl;
      setPressureLvl(lvl);
    }
  }, [timeLeft, balance, flowState, gameOver, phase]);

  // Cleanup on unmount
  useEffect(() => () => {
    stopTimer();
    clearInterval(flowDrainRef.current);
    clearInterval(friesTimerRef.current);
    clearInterval(slusheeTimerRef.current);
    clearInterval(drainIntervalRef.current);
    clearTimeout(streakBreakTimerRef.current);
    prizeRafCancelRef.current?.();
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
          <button className="info-btn" onClick={sound.toggleMute} title={sound.muted ? 'Unmute' : 'Mute'}>{sound.muted ? '🔇' : '🔊'}</button>
          <button className="info-btn" onClick={() => setShowTutorial(true)} title="How to play">?</button>
          <button className="info-btn" onClick={() => setShowTiers(true)}>ℹ️</button>
        </div>
      </header>

      <BalanceBar balance={balance} totalWon={totalWon} cardsPlayed={cardsPlayed} speedMode={speedMode} onSpeedToggle={toggleSpeed} balanceDuration={balanceDuration} />

      <main className="game-area">
        {phase === 'intro' && (
          <div className="intro">
            <div className="intro-icon">🎟️</div>
            <p>120 themed cards — scratch to reveal your prize</p>
            <p className="intro-sub">Match numbers · 1–20 🪙 per card · ⚡ for speed mode</p>
            <button className="action-btn buy-btn start-btn" onClick={startFirstCard}>🎟️ Start Scratching</button>
          </div>
        )}

        {isActive && (
          <>
            {/* ── Right column — status + shop (DOM-first so it stacks above card on mobile) ── */}
            <div className="kiosk-right">
              <div className="status-panel">
                <SegmentedBar
                  count={timeLeft}
                  maxCount={speedMode ? SPEED_TIME : NORMAL_TIME}
                  color={timeLeft <= 10 && !!timerIntervalRef.current ? 'timer-urgent' : 'timer'}
                  label={speedMode ? '⚡ SPEED' : slusheeSecs > 0 ? '🥤 FROZEN' : '⏱ TIMER'}
                  rightLabel={`${timeLeft}s`}
                />
                <FlowMeter flowLevel={flowLevel} flowState={flowState} flowRound={flowRound} />
                {brushBoostSecs > 0 && (
                  <SegmentedBar count={brushBoostSecs} maxCount={10} color="fries"   label="🍟 BIG BRUSH" rightLabel={`${brushBoostSecs}s`} />
                )}
                {slusheeSecs > 0 && (
                  <SegmentedBar count={slusheeSecs}    maxCount={5}  color="slushee" label="🥤 FROZEN"    rightLabel={`${slusheeSecs}s`}    />
                )}
              </div>
              {!gameOver && (
                <GasStationShop
                  balance={balance}
                  phase={phase}
                  brushBoostSecs={brushBoostSecs}
                  slusheeSecs={slusheeSecs}
                  nextCardWin={nextCardWin}
                  onBuy={handleShopBuy}
                />
              )}
            </div>

            {/* ── Left column — streak badge + card + picker ──────────────── */}
            <div className="kiosk-left">
              {/* Streak badge */}
              {!gameOver && (consecWins >= STREAK_SHOW_MIN || prevStreak >= STREAK_SHOW_MIN) && (
                <div className={`streak-badge${prevStreak >= STREAK_SHOW_MIN && consecWins < STREAK_SHOW_MIN ? ' streak-breaking' : ''}`}>
                  🔥 x{consecWins >= STREAK_SHOW_MIN ? consecWins : prevStreak} STREAK
                </div>
              )}

              {/* Card view — normal scratch only (never shown during flow state) */}
              {(phase === 'playing' || phase === 'result') && cardData && slideTarget === 'card' && (
                <div className={`card-area ${cardFlash} ${slideClass} ${!flowState && pressureLvl > 0 ? PRESSURE_CLASS[pressureLvl] : ''}`}>
                  <ScratchToolOverlay
                    key={`${cardData.theme.id}-${cardsPlayed}`}
                    cardData={cardData}
                    onComplete={handleComplete}
                    soundScratch={sound.scratch}
                    flowLevel={flowLevel}
                    brushBoost={brushBoost}
                    hotDogTrigger={hotDogTrigger}
                    scratchToolUnlocked={true}
                    onFirstToolUse={() => speakDialogue('New roll.')}
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
            </div>
          </>
        )}
      </main>

      {isActive && !gameOver && (
        <footer className="app-footer">
          <button className="end-session-btn" onClick={handleEndSession}>End Session</button>
        </footer>
      )}

      {riskResult !== null && (
        <div className={`risk-result ${riskResult.won ? 'risk-result--win' : 'risk-result--lose'}`}>
          <div className="risk-result-card">
            <div className="risk-result-icon">{riskResult.won ? '🎰' : '💸'}</div>
            <div className="risk-result-text">{riskResult.won ? 'DOUBLED!' : 'WIPED OUT!'}</div>
          </div>
        </div>
      )}

      <AttendantReaction msg={attendantMsg} />
      {gameOver && <GameOverScreen stats={{ cardsPlayed, totalSpent, totalWon, biggestWin }} timeExpired={goReason === 'time'} won={goReason === 'win'} onPlayAgain={handlePlayAgain} onStartFresh={handleStartFresh} />}
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
