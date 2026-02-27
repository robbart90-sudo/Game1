import { useState, useEffect, useRef } from 'react';

export function useAnimatedValue(target, duration = 700) {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const rafRef  = useRef(null);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;

    cancelAnimationFrame(rafRef.current);
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(from + (target - from) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}
