import { useRef, useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import ScratchCard from './ScratchCard';
import './ScratchToolOverlay.css';

// Must match ScratchCard.jsx
const BLOCK_ROWS  = 25;
const CH          = 190;   // canvas logical height — must match ScratchCard.jsx
const ART_LABEL_H = 18;    // reserved px at canvas top — must match CSS calc(18px + …)
const BLOCK_H     = CH / BLOCK_ROWS; // 7.6 canvas px per block row

// Group formation cells into horizontal row bands based on overlapping block rows.
// Cells whose block row ranges touch or overlap are merged into one row group.
// Block-row indices are computed using the same 18 px art-label offset as the canvas.
function groupIntoRows(formCells) {
  if (!formCells || !formCells.length) return [];

  const usableH = CH - ART_LABEL_H;
  const ranges = formCells.map(fc => ({
    fc,
    by0: Math.max(0,              Math.floor((ART_LABEL_H + fc.y * usableH) / BLOCK_H)),
    by1: Math.min(BLOCK_ROWS - 1, Math.ceil( (ART_LABEL_H + (fc.y + fc.h) * usableH) / BLOCK_H) - 1),
  }));

  ranges.sort((a, b) => a.by0 - b.by0);

  const rows = [];
  let current = null;
  for (const r of ranges) {
    if (!current || r.by0 > current.by1) {
      current = { by0: r.by0, by1: r.by1, cells: [r] };
      rows.push(current);
    } else {
      current.by1 = Math.max(current.by1, r.by1);
      current.cells.push(r);
    }
  }
  return rows;
}

export default function ScratchToolOverlay({
  cardData,
  onComplete,
  scratchToolUnlocked = false,
  onFirstToolUse,
  ...rest
}) {
  const outerRef   = useRef(null);
  const cardRef    = useRef(null);
  const firstFired = useRef(false);

  const [usedRows,  setUsedRows]  = useState(new Set());
  const [buttonYs,  setButtonYs]  = useState([]);

  const formCells = cardData?.theme?.formation?.cells ?? [];
  const rows = useMemo(() => groupIntoRows(formCells), [formCells]);

  // Reset per-card state; keep firstFired (session-level)
  useEffect(() => {
    setUsedRows(new Set());
    setButtonYs([]);
  }, [cardData]);

  // ── Button alignment — scratch canvas is the single source of truth ──────────
  //
  // Strategy:
  //   1. Find the scratch canvas element directly via querySelector.
  //   2. Call getBoundingClientRect() on it to get its exact rendered position
  //      and dimensions in viewport space (tilt, scale — all baked in).
  //   3. Do the same on the button column to get its viewport-space top.
  //   4. Canvas top relative to button column = canvasRect.top - colRect.top.
  //   5. Divide the canvas height evenly by numRows — each slice is one row.
  //   6. Centre each button at the middle of its slice.
  //
  // No parent-element math, no CSS formula constants, no formation fractions.
  const measurePositions = useCallback(() => {
    if (!outerRef.current || rows.length === 0) return;

    const colEl    = outerRef.current.querySelector('.scratch-tool-col');
    const canvasEl = outerRef.current.querySelector('.scratch-canvas');
    if (!colEl || !canvasEl) return; // canvas absent when card is completed

    const colRect    = colEl.getBoundingClientRect();
    const canvasRect = canvasEl.getBoundingClientRect();
    if (canvasRect.height < 4) return;

    // Canvas top expressed as an offset from the button column's top.
    // Both rects are in the same viewport coordinate space, so tilt is
    // automatically accounted for — no separate rotation correction needed.
    const canvasTopInCol = canvasRect.top - colRect.top;
    const rowH           = canvasRect.height / rows.length;

    const ys = rows.map((_, i) => canvasTopInCol + i * rowH + rowH / 2);

    setButtonYs(prev =>
      prev.length === ys.length && prev.every((v, i) => Math.abs(v - ys[i]) < 0.5)
        ? prev   // no meaningful change — avoid spurious re-render
        : ys
    );
  }, [rows]);

  // Re-measure after every render (catches new card, font load, etc.)
  useLayoutEffect(() => { measurePositions(); }, [measurePositions]);

  // Re-measure whenever the scratch canvas resizes (viewport changes, zoom, etc.).
  // The canvas is the reference element so we observe it directly.
  // The outer container is observed as a fallback — it always exists even when
  // the canvas is unmounted after card completion.
  useEffect(() => {
    if (!outerRef.current) return;
    const obs = new ResizeObserver(measurePositions);
    obs.observe(outerRef.current);
    const canvasEl = outerRef.current.querySelector('.scratch-canvas');
    if (canvasEl) obs.observe(canvasEl);
    window.addEventListener('resize', measurePositions);
    return () => {
      obs.disconnect();
      window.removeEventListener('resize', measurePositions);
    };
  }, [measurePositions]);

  const handleRowClick = useCallback((rowIdx, row) => {
    if (!cardRef.current) return;
    if (!firstFired.current) {
      firstFired.current = true;
      onFirstToolUse?.();
    }
    setUsedRows(prev => new Set([...prev, rowIdx]));
    cardRef.current.scratchRowBlocks?.(row.by0, row.by1, 400);
  }, [onFirstToolUse]);

  const handleComplete = useCallback((scratchTime) => {
    // Hide all remaining buttons when card completes
    setUsedRows(() => new Set(rows.map((_, i) => i)));
    onComplete?.(scratchTime);
  }, [rows, onComplete]);

  return (
    <div className="scratch-tool-outer" ref={outerRef}>
      {scratchToolUnlocked && (
        <div className="scratch-tool-col">
          {rows.map((row, i) => {
            if (usedRows.has(i) || buttonYs[i] === undefined) return null;
            return (
              <button
                key={i}
                className="scratch-tool-btn"
                style={{ top: `${buttonYs[i]}px`, outline: '1px solid red' /* DEBUG */ }}
                onClick={() => handleRowClick(i, row)}
                aria-label={`Scratch row ${i + 1}`}
              >
                ▶
              </button>
            );
          })}
        </div>
      )}
      <div className="scratch-tool-card-wrap">
        <ScratchCard
          ref={cardRef}
          cardData={cardData}
          onComplete={handleComplete}
          debugRows={rows.length}
          {...rest}
        />
      </div>
    </div>
  );
}
