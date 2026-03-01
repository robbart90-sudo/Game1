import { useState, useEffect, useRef, useCallback } from 'react';
import './AttendantReaction.css';

// Timing constants
const TYPE_MS   = 28;   // ms between each character
const WAIT_MS   = 2400; // ms to remain visible after typing completes
const SLIDE_MS  = 280;  // panel slide in/out duration — must match CSS transition

export default function AttendantReaction({ msg }) {
  // msg: { text: string, seq: number } | null

  const [mounted,       setMounted]       = useState(false); // panel DOM node exists
  const [panelVisible,  setPanelVisible]  = useState(false); // panel slid into view
  const [bubbleVisible, setBubbleVisible] = useState(false); // bubble faded in
  const [displayText,   setDisplayText]   = useState('');

  const mountedRef   = useRef(false); // ref mirror for closure safety
  const typeTimerRef = useRef(null);
  const waitTimerRef = useRef(null);
  const showTimerRef = useRef(null);
  const hideTimerRef = useRef(null);

  const clearTyping = () => {
    clearTimeout(typeTimerRef.current);
    clearTimeout(waitTimerRef.current);
  };

  // Slide the panel back out, then remove it from the DOM entirely
  const doExit = useCallback(() => {
    setBubbleVisible(false);
    setPanelVisible(false); // triggers slide-out CSS transition
    hideTimerRef.current = setTimeout(() => {
      setMounted(false);
      mountedRef.current = false;
      setDisplayText('');
    }, SLIDE_MS);
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
      // Panel is off — mount it, then slide in, then start text
      mountedRef.current = true;
      setMounted(true);
      showTimerRef.current = setTimeout(() => {
        setPanelVisible(true);            // starts slide-up CSS transition
        setTimeout(() => {
          setBubbleVisible(true);         // fades bubble in
          typeText(msg.text);             // starts typewriter
        }, SLIDE_MS);
      }, 16); // one paint frame so initial transform is applied before transition
    } else {
      // Panel already on screen — keep it, refresh bubble and text
      setBubbleVisible(false);
      setPanelVisible(true);
      showTimerRef.current = setTimeout(() => {
        setBubbleVisible(true);
        typeText(msg.text);
      }, 50);
    }
  }, [msg, typeText]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup all timers on unmount
  useEffect(() => () => {
    clearTimeout(typeTimerRef.current);
    clearTimeout(waitTimerRef.current);
    clearTimeout(showTimerRef.current);
    clearTimeout(hideTimerRef.current);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`ar-wrap${panelVisible ? ' ar-wrap--visible' : ''}`}>
      {/* Portrait */}
      <div className="ar-char-emoji">
        <span className="ar-char-icon">👴</span>
        <span className="ar-char-name">Grig the gas attendant</span>
      </div>

      {/* Bubble — tail points upward toward the portrait above */}
      <div
        className={`ar-bubble${bubbleVisible ? ' ar-bubble--visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {displayText}
        <span className="ar-cursor" aria-hidden="true">▌</span>
      </div>
    </div>
  );
}
