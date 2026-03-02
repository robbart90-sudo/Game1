import { useState, useEffect, useRef, useCallback } from 'react';
import './AttendantReaction.css';

// ── Emotion-to-emoji map ──────────────────────────────────────────────────────
// This is the single source of truth for Grig's face.
// When real Grig illustrations are ready, swap emoji values for <img> src paths
// or CSS class names here — nothing else needs to change.
export const GRIG_EMOTIONS = {
  neutral:     '🧓',  // default resting face — random quips and standard lines
  win:         '😐',  // completely flat, no excitement
  loss:        '😐',  // identical to win — Grig does not care either way
  streak_low:  '🤨',  // mild interest, one eyebrow raised (streaks 3–5)
  streak_high: '😳',  // genuine surprise — the only time Grig looks truly affected (streak 7+)
  flow_1:      '🤔',  // something is registering ("Hmm…")
  flow_2:      '😯',  // quiet disbelief ("Never seen this…")
  flow_3:      '😦',  // as close to astonished as Grig gets ("My goodness!")
  milestone:   '👀',  // he's noticing you, saying nothing extra
  gas_smell:   '😑',  // deadpan corrector ("Gas doesn't have a smell.")
  harold:      '🫥',  // distant, somewhere else entirely
  risk_win:    '😶',  // pure nothing
  risk_loss:   '😶',  // identical, still nothing
};

// ── Timing constants ──────────────────────────────────────────────────────────
const TYPE_MS   = 28;   // ms between each character
const WAIT_MS   = 2400; // ms to remain visible after typing completes
const BUBBLE_MS = 200;  // bubble fade duration — must match CSS transition
const FADE_MS   = 75;   // half of the 0.15 s emotion crossfade

export default function AttendantReaction({ msg }) {
  // msg: { text: string, emotion: string, seq: number } | null

  const [mounted,       setMounted]       = useState(false); // bubble DOM exists
  const [bubbleVisible, setBubbleVisible] = useState(false); // bubble faded in
  const [displayText,   setDisplayText]   = useState('');
  const [emotionKey,    setEmotionKey]    = useState('neutral');
  const [emojiFading,   setEmojiFading]   = useState(false);

  const mountedRef      = useRef(false);
  const typeTimerRef    = useRef(null);
  const waitTimerRef    = useRef(null);
  const showTimerRef    = useRef(null);
  const hideTimerRef    = useRef(null);
  const emotionTimerRef = useRef(null);

  const clearTyping = () => {
    clearTimeout(typeTimerRef.current);
    clearTimeout(waitTimerRef.current);
  };

  // Crossfade the emotion emoji: fade out 75 ms → swap → fade in 75 ms
  const switchEmotion = useCallback((newEmotion) => {
    clearTimeout(emotionTimerRef.current);
    setEmojiFading(true);
    emotionTimerRef.current = setTimeout(() => {
      setEmotionKey(GRIG_EMOTIONS[newEmotion] ? newEmotion : 'neutral');
      setEmojiFading(false);
    }, FADE_MS);
  }, []);

  // Fade the bubble out and remove it from DOM; then reset emotion to neutral
  const doExit = useCallback(() => {
    setBubbleVisible(false);
    hideTimerRef.current = setTimeout(() => {
      setMounted(false);
      mountedRef.current = false;
      setDisplayText('');
      switchEmotion('neutral');
    }, BUBBLE_MS);
  }, [switchEmotion]);

  // Type characters one at a time, then schedule exit
  const typeText = useCallback((text) => {
    clearTyping();
    setDisplayText('');
    let i = 0;
    const tick = () => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i < text.length) {
        typeTimerRef.current = setTimeout(tick, TYPE_MS);
      } else {
        waitTimerRef.current = setTimeout(doExit, WAIT_MS);
      }
    };
    typeTimerRef.current = setTimeout(tick, TYPE_MS);
  }, [doExit]);

  useEffect(() => {
    if (!msg?.text) return;

    // Cancel any in-progress exit / typing
    clearTimeout(waitTimerRef.current);
    clearTimeout(hideTimerRef.current);
    clearTimeout(showTimerRef.current);
    clearTyping();

    // Crossfade to the incoming emotion right away
    switchEmotion(msg.emotion || 'neutral');

    if (!mountedRef.current) {
      // Bubble is off — mount it, then fade in and start typing
      mountedRef.current = true;
      setMounted(true);
      showTimerRef.current = setTimeout(() => {
        setBubbleVisible(true);
        typeText(msg.text);
      }, 16); // one paint frame so initial opacity is applied before transition
    } else {
      // Bubble already on screen — refresh text
      setBubbleVisible(false);
      showTimerRef.current = setTimeout(() => {
        setBubbleVisible(true);
        typeText(msg.text);
      }, 50);
    }
  }, [msg, typeText, switchEmotion]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup all timers on unmount
  useEffect(() => () => {
    clearTimeout(typeTimerRef.current);
    clearTimeout(waitTimerRef.current);
    clearTimeout(showTimerRef.current);
    clearTimeout(hideTimerRef.current);
    clearTimeout(emotionTimerRef.current);
  }, []);

  return (
    <div className={`ar-wrap${mounted ? ' ar-wrap--speaking' : ''}`}>
      {/* Portrait — always visible on desktop; slides in with panel on mobile */}
      <div className="ar-char-emoji">
        <span
          className={`ar-char-icon${emojiFading ? ' ar-char-icon--fade' : ''}`}
          aria-hidden="true"
        >
          {GRIG_EMOTIONS[emotionKey]}
        </span>
        <span className="ar-char-name">Grig the gas attendant</span>
      </div>

      {/* Speech bubble — only rendered while there is an active message */}
      {mounted && (
        <div
          className={`ar-bubble${bubbleVisible ? ' ar-bubble--visible' : ''}`}
          role="status"
          aria-live="polite"
        >
          {displayText}
          <span className="ar-cursor" aria-hidden="true">▌</span>
        </div>
      )}
    </div>
  );
}
