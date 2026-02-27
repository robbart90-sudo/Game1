import { useState, useRef, useCallback, useEffect } from 'react';
import './ToastManager.css';

// ── useToast hook ──────────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts]  = useState([]);
  const nextId = useRef(0);

  const addToast = useCallback((text, options = {}) => {
    const id = nextId.current++;
    const {
      type     = 'gold',   // gold | orange | red | green | blue | purple | jackpot
      size     = 'normal', // normal | large
      anim     = 'slide',  // slide | shake
      duration = 2000,
    } = options;

    setToasts(ts => {
      // Never stack more than 2 — drop oldest if needed
      const base = ts.length >= 2 ? ts.slice(-1) : ts;
      return [...base, { id, text, type, size, anim, exiting: false }];
    });

    // Schedule exit animation then removal
    setTimeout(() => {
      setToasts(ts => ts.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => {
        setToasts(ts => ts.filter(t => t.id !== id));
      }, 380);
    }, duration);
  }, []);

  return { toasts, addToast };
}

// ── Individual Toast ───────────────────────────────────────────────────────
function ToastItem({ text, type, size, anim, exiting }) {
  return (
    <div
      className={[
        'toast-item',
        `toast-${type}`,
        `toast-${size}`,
        exiting ? 'toast-exit' : 'toast-enter',
        anim === 'shake' ? 'toast-shake-anim' : '',
      ].filter(Boolean).join(' ')}
      aria-live="assertive"
    >
      {text}
    </div>
  );
}

// ── ToastManager renderer ──────────────────────────────────────────────────
export default function ToastManager({ toasts }) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => <ToastItem key={t.id} {...t} />)}
    </div>
  );
}
