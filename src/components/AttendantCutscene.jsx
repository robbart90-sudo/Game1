import { useState, useEffect, useRef, useCallback } from 'react';
import './AttendantCutscene.css';

const SPEECH          = "Scratchy lotto? I've got scratchy lotto.";
const TYPE_MS         = 50;   // ms per character
const PAUSE_MS        = 1500; // pause after typing finishes
const CHAR_APPEAR_MS  = 580;  // wait for character to finish sliding in before typing
const EXIT_ANIM_MS    = 650;  // duration of exit animation before signalling done

export default function AttendantCutscene({ onDone }) {
  // stage: 'entering' → 'typing' → 'pausing' → 'exiting'
  const [stage,    setStage]    = useState('entering');
  const [typedLen, setTypedLen] = useState(0);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }, [onDone]);

  // Skip on click anywhere
  const handleClick = useCallback(() => finish(), [finish]);

  // Stage machine — entering → typing → pausing → exiting → done
  useEffect(() => {
    if (stage === 'entering') {
      const t = setTimeout(() => setStage('typing'), CHAR_APPEAR_MS);
      return () => clearTimeout(t);
    }
    if (stage === 'pausing') {
      const t = setTimeout(() => setStage('exiting'), PAUSE_MS);
      return () => clearTimeout(t);
    }
    if (stage === 'exiting') {
      const t = setTimeout(finish, EXIT_ANIM_MS);
      return () => clearTimeout(t);
    }
  }, [stage, finish]);

  // Typewriter effect
  useEffect(() => {
    if (stage !== 'typing') return;
    if (typedLen >= SPEECH.length) { setStage('pausing'); return; }
    const t = setTimeout(() => setTypedLen(n => n + 1), TYPE_MS);
    return () => clearTimeout(t);
  }, [stage, typedLen]);

  const isExiting  = stage === 'exiting';
  const showBubble = stage !== 'entering';
  const textDone   = typedLen >= SPEECH.length;

  return (
    <div
      className={`ac-overlay${isExiting ? ' ac-overlay--out' : ''}`}
      onClick={handleClick}
      aria-label="Skip cutscene"
    >
      <div className={`ac-stage${isExiting ? ' ac-stage--out' : ''}`}>

        {showBubble && (
          <div className={`ac-bubble${isExiting ? ' ac-bubble--out' : ''}`}>
            {SPEECH.slice(0, typedLen)}
            {!textDone && <span className="ac-cursor" aria-hidden="true">|</span>}
          </div>
        )}

        <div className="ac-char">
          <div className="ac-char-emoji">
            <span className="ac-char-icon">👴</span>
            <span className="ac-char-name">Grig the gas attendant</span>
          </div>
        </div>

      </div>
    </div>
  );
}
