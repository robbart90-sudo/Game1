import { useState, useEffect, useRef, useCallback } from 'react';
import './AttendantReaction.css';

// Timing constants
const TYPE_MS   = 28;    // ms between each character
const WAIT_MS   = 2400;  // ms to remain visible after typing completes
const ENTER_MS  = 200;   // ms for the fade-in CSS transition
const EXIT_MS   = 260;   // ms for the fade-out CSS transition

export default function AttendantReaction({ msg }) {
  // msg: { text: string, seq: number } | null

  const [bubbleMounted,  setBubbleMounted]  = useState(false); // whether bubble DOM node exists
  const [bubbleVisible,  setBubbleVisible]  = useState(false); // whether bubble is faded in
  const [displayText,    setDisplayText]    = useState('');

  const typeTimerRef = useRef(null);
  const waitTimerRef = useRef(null);
  const showTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const mountedRef   = useRef(false); // ref mirror of bubbleMounted for closure safety

  const clearTyping = () => {
    clearTimeout(typeTimerRef.current);
    clearTimeout(waitTimerRef.current);
  };

  // Fade out the bubble, then unmount it
  const doExit = useCallback(() => {
    setBubbleVisible(false);
    hideTimerRef.current = setTimeout(() => {
      setBubbleMounted(false);
      mountedRef.current = false;
      setDisplayText('');
    }, EXIT_MS);
  }, []);

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

    if (!mountedRef.current) {
      // Bubble is off — mount it then fade in
      mountedRef.current = true;
      setBubbleMounted(true);
      showTimerRef.current = setTimeout(() => {
        setBubbleVisible(true);
        setTimeout(() => typeText(msg.text), ENTER_MS);
      }, 16);
    } else {
      // Bubble is already visible — keep it visible, start new text
      setBubbleVisible(true);
      typeText(msg.text);
    }
  }, [msg, typeText]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup all timers on unmount
  useEffect(() => () => {
    clearTimeout(typeTimerRef.current);
    clearTimeout(waitTimerRef.current);
    clearTimeout(showTimerRef.current);
    clearTimeout(hideTimerRef.current);
  }, []);

  return (
    <div className="ar-wrap">
      {/* Portrait — always visible at the bottom of the play column */}
      <div className="ar-char-emoji">
        <span className="ar-char-icon">👴</span>
        <span className="ar-char-name">Grig the gas attendant</span>
      </div>

      {/* Bubble — appears below Grig, tail points up toward him */}
      {bubbleMounted && (
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
