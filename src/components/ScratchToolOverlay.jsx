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

  // ── Precision alignment — derive button Y from formation-indexed DOM elements ─
  //
  // Strategy:
  //   1. Map each formation cell (fc object) to its rendered .art-cell DOM element
  //      by index: element[i] is positioned at formCells[i].
  //   2. For each row group (from groupIntoRows), collect the viewport-space Y
  //      centres of all cells belonging to that row.
  //   3. Average those centres — this makes the result tilt-robust: when the ticket
  //      is rotated, cells in the same row fan out in viewport-Y, but their average
  //      is still the true row centre.
  //   4. Express each average relative to .scratch-tool-col so that
  //      `top: Xpx` + `transform: translateY(-50%)` centres the button on the row.
  const measurePositions = useCallback(() => {
    if (!outerRef.current || rows.length === 0) return;

    // The button column is the positioning parent (position: relative) for buttons.
    const colEl = outerRef.current.querySelector('.scratch-tool-col');
    if (!colEl) return;
    const colRect = colEl.getBoundingClientRect();
    if (colRect.height < 4) return;

    // .art-cell elements are rendered in formCells order: element[i] ↔ formCells[i].
    const cellEls = Array.from(outerRef.current.querySelectorAll('.art-cell'));
    if (cellEls.length < formCells.length) return;

    // Build a lookup: formation cell object reference → DOM element index.
    const fcIndexMap = new Map(formCells.map((fc, i) => [fc, i]));

    const ys = [];
    for (const row of rows) {
      // Collect viewport-Y centres for every DOM cell that belongs to this row.
      const centers = row.cells
        .map(r => {
          const idx = fcIndexMap.get(r.fc);
          if (idx == null) return null;
          const el = cellEls[idx];
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          if (rect.height < 1 || rect.width < 1) return null;
          return (rect.top + rect.bottom) / 2;
        })
        .filter(v => v !== null);

      if (centers.length === 0) return; // cells not yet in DOM — wait for next pass
      const avgY = centers.reduce((s, v) => s + v, 0) / centers.length;
      ys.push(avgY - colRect.top);
    }

    if (ys.length !== rows.length) return;

    setButtonYs(prev =>
      prev.length === ys.length && prev.every((v, i) => Math.abs(v - ys[i]) < 0.5)
        ? prev   // no meaningful change — skip re-render
        : ys
    );
  }, [rows, formCells]);

  // Re-measure after every render (catches new card, font load, etc.)
  useLayoutEffect(() => { measurePositions(); }, [measurePositions]);

  // Re-measure whenever the outer container resizes (covers window resize too,
  // since .scratch-tool-outer is a flex child that stretches with the viewport).
  useEffect(() => {
    if (!outerRef.current) return;
    const obs = new ResizeObserver(measurePositions);
    obs.observe(outerRef.current);
    // Belt-and-suspenders: also listen to the window resize event directly.
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
                style={{ top: `${buttonYs[i]}px` }}
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
          {...rest}
        />
      </div>
    </div>
  );
}
