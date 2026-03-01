import { useState, useRef, useEffect, useCallback } from 'react';
import './LuckyNumberScreen.css';

const ITEM_H  = 62;   // px height per digit row
const VISIBLE = 5;    // number of rows visible at once
const DIGITS  = Array.from({ length: 10 }, (_, i) => i);

// ── Single digit wheel (slot-machine / combination-lock feel) ────────────────
function DigitWheel({ value, onChange }) {
  const trackRef    = useRef(null);
  const scrollRef   = useRef(value * ITEM_H);
  const velRef      = useRef(0);
  const rafRef      = useRef(null);
  const dragRef     = useRef(null);
  const debRef      = useRef(null);

  // Clamp scroll to valid digit range
  const clamp = (v) => Math.max(0, Math.min(9 * ITEM_H, v));

  // Imperatively update track position and item opacity/scale each frame
  const renderFrame = useCallback(() => {
    if (!trackRef.current) return;
    const scroll = scrollRef.current;
    // Translate so the selected digit sits at the vertical center
    trackRef.current.style.transform = `translateY(${2 * ITEM_H - scroll}px)`;
    const items = trackRef.current.children;
    for (let d = 0; d < items.length; d++) {
      const dist = Math.abs(d * ITEM_H - scroll) / ITEM_H;
      items[d].style.opacity   = Math.max(0.10, 1 - dist * 0.30).toFixed(2);
      items[d].style.transform = `scale(${Math.max(0.70, 1 - dist * 0.10).toFixed(2)})`;
    }
  }, []);

  // After momentum decays, snap scroll to the nearest digit
  const snapToNearest = useCallback(() => {
    const snapped = Math.round(clamp(scrollRef.current) / ITEM_H);
    scrollRef.current = snapped * ITEM_H;
    renderFrame();
    onChange(snapped);
  }, [onChange, renderFrame]);

  // Deceleration loop
  const animateMomentum = useCallback(() => {
    velRef.current *= 0.88;
    if (Math.abs(velRef.current) < 0.5) {
      velRef.current = 0;
      snapToNearest();
      return;
    }
    scrollRef.current = clamp(scrollRef.current + velRef.current);
    renderFrame();
    rafRef.current = requestAnimationFrame(animateMomentum);
  }, [snapToNearest, renderFrame]);

  const stopMomentum = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }, []);

  const getClientY = (e) =>
    e.touches ? e.touches[0].clientY : e.clientY;

  const handlePointerDown = useCallback((e) => {
    stopMomentum();
    clearTimeout(debRef.current);
    velRef.current = 0;
    const y = getClientY(e);
    dragRef.current = { startY: y, startScroll: scrollRef.current };
    if (!e.touches) e.preventDefault();
  }, [stopMomentum]);

  const handlePointerMove = useCallback((e) => {
    if (!dragRef.current) return;
    const dy   = dragRef.current.startY - getClientY(e);
    const prev = scrollRef.current;
    scrollRef.current = clamp(dragRef.current.startScroll + dy);
    velRef.current    = scrollRef.current - prev;
    renderFrame();
  }, [renderFrame]);

  const handlePointerUp = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    rafRef.current  = requestAnimationFrame(animateMomentum);
  }, [animateMomentum]);

  const handleWheel = useCallback((e) => {
    stopMomentum();
    scrollRef.current = clamp(scrollRef.current + e.deltaY * 0.5);
    renderFrame();
    clearTimeout(debRef.current);
    debRef.current = setTimeout(snapToNearest, 150);
    e.preventDefault();
  }, [stopMomentum, renderFrame, snapToNearest]);

  useEffect(() => {
    renderFrame();

    // Non-passive wheel listener so we can call preventDefault
    const wheelEl = trackRef.current?.parentElement;
    if (wheelEl) wheelEl.addEventListener('wheel', handleWheel, { passive: false });

    // Global move/up/end so drag works when cursor leaves the wheel
    const onMove      = (e) => handlePointerMove(e);
    const onUp        = () => handlePointerUp();
    const onTouchMove = (e) => { handlePointerMove(e); };
    const onTouchEnd  = () => handlePointerUp();

    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseup',    onUp);
    window.addEventListener('touchmove',  onTouchMove, { passive: false });
    window.addEventListener('touchend',   onTouchEnd);

    return () => {
      if (wheelEl) wheelEl.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseup',    onUp);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('touchend',   onTouchEnd);
      stopMomentum();
      clearTimeout(debRef.current);
    };
  }, [handlePointerMove, handlePointerUp, handleWheel, renderFrame, stopMomentum]);

  return (
    <div
      className="lns-wheel"
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
    >
      <div className="lns-wheel-track" ref={trackRef}>
        {DIGITS.map((d) => (
          <div key={d} className="lns-wheel-item" style={{ top: `${d * ITEM_H}px` }}>
            {d}
          </div>
        ))}
      </div>
      <div className="lns-wheel-highlight"   aria-hidden="true" />
      <div className="lns-wheel-fade-top"    aria-hidden="true" />
      <div className="lns-wheel-fade-bottom" aria-hidden="true" />
    </div>
  );
}

// ── One-time lucky number selection screen ───────────────────────────────────
export default function LuckyNumberScreen({ onPick }) {
  const [tens,  setTens]  = useState(0);
  const [units, setUnits] = useState(0);

  const number  = tens * 10 + units;
  const isValid = number >= 1 && number <= 99;

  const handleConfirm = () => {
    if (isValid) onPick(number);
  };

  return (
    <div className="lns-overlay">
      <div className="lns-panel">
        <p className="lns-title">What's your lucky number?</p>

        <div className="lns-wheels">
          <DigitWheel value={tens}  onChange={setTens}  />
          <DigitWheel value={units} onChange={setUnits} />
        </div>

        <div className={`lns-preview${isValid ? '' : ' lns-preview--dim'}`}>
          {String(number).padStart(2, '0')}
        </div>

        <button
          className="lns-confirm"
          onClick={handleConfirm}
          disabled={!isValid}
        >
          That's my number.
        </button>
      </div>
    </div>
  );
}
