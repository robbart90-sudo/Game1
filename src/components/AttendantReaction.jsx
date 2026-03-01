import { useState, useEffect, useRef, useCallback } from 'react';
import './AttendantReaction.css';

// Timing constants
const TYPE_MS  = 28;   // ms between each character
const WAIT_MS  = 2400; // ms to remain visible after typing completes
const ENTER_MS = 230;  // ms for the slide-in CSS transition

export default function AttendantReaction({ msg }) {
  // msg: { text: string, seq: number } | null
  // A new object reference on every notification; same reference between renders.
  const [mounted,     setMounted]     = useState(false); // whether the DOM node exists
  const [visible,     setVisible]     = useState(false); // whether the CSS slide-in class is applied
  const [displayText, setDisplayText] = useState('');

  const typeTimerRef = useRef(null);
  const waitTimerRef = useRef(null);
  const showTimerRef = useRef(null); // rAF-style delay before applying visible class
  const hideTimerRef = useRef(null); // delay between visible=false and mounted=false
  const mountedRef   = useRef(false); // ref mirror of mounted for use in effect closures

  // Clear in-flight typewriter timers (does not affect enter/exit timers)
  const clearTyping = () => {
    clearTimeout(typeTimerRef.current);
    clearTimeout(waitTimerRef.current);
  };

  // Slide out then unmount
  const doExit = useCallback(() => {
    setVisible(false);
    // 260 ms matches the CSS transition-duration for the exit direction
    hideTimerRef.current = setTimeout(() => {
      setMounted(false);
      mountedRef.current = false;
      setDisplayText('');
    }, 260);
  }, []);

  // Type text one character at a time, then schedule exit
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

    // Cancel any in-progress exit or typing
    clearTimeout(waitTimerRef.current);
    clearTimeout(hideTimerRef.current);
    clearTimeout(showTimerRef.current);
    clearTyping();

    if (!mountedRef.current) {
      // Character is off-screen — mount and slide in
      mountedRef.current = true;
      setMounted(true);
      // One frame delay so the DOM element exists before the CSS transition fires
      showTimerRef.current = setTimeout(() => {
        setVisible(true);
        // Start typing after the slide-in transition completes
        setTimeout(() => typeText(msg.text), ENTER_MS);
      }, 16);
    } else {
      // Character is already on screen — cancel any mid-exit, start new text
      setVisible(true);
      typeText(msg.text);
    }
  }, [msg, typeText]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup all timers when the component unmounts
  useEffect(() => () => {
    clearTimeout(typeTimerRef.current);
    clearTimeout(waitTimerRef.current);
    clearTimeout(showTimerRef.current);
    clearTimeout(hideTimerRef.current);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`ar-wrap${visible ? ' ar-wrap--visible' : ''}`}>
      <div className="ar-bubble" role="status" aria-live="polite">
        {displayText}
        <span className="ar-cursor" aria-hidden="true">▌</span>
      </div>

      <div className="ar-char-emoji">
        <span className="ar-char-icon">👴</span>
        <span className="ar-char-name">Grig the gas attendant</span>
      </div>
    </div>
  );
}
