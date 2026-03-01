import { useRef, useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import ScratchCard from './ScratchCard';
import './ScratchToolOverlay.css';

// Must match ScratchCard.jsx
const BLOCK_ROWS = 25;

// Group formation cells into horizontal row bands based on overlapping block rows.
// Cells whose block row ranges touch or overlap are merged into one row group.
function groupIntoRows(formCells) {
  if (!formCells || !formCells.length) return [];

  const ranges = formCells.map(fc => ({
    fc,
    by0: Math.max(0, Math.floor(fc.y * BLOCK_ROWS)),
    by1: Math.min(BLOCK_ROWS - 1, Math.ceil((fc.y + fc.h) * BLOCK_ROWS) - 1),
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
  const cardRef     = useRef(null);
  const outerRef    = useRef(null);
  const firstFired  = useRef(false);

  const [usedRows,  setUsedRows]  = useState(new Set());
  const [buttonYs, setButtonYs] = useState([]);

  const formCells = cardData?.theme?.formation?.cells ?? [];
  const rows = useMemo(() => groupIntoRows(formCells), [formCells]);

  // Reset per-card state; keep firstFired (session-level)
  useEffect(() => {
    setUsedRows(new Set());
    setButtonYs([]);
  }, [cardData]);

  // Measure button Y positions relative to the outer wrapper
  const measurePositions = useCallback(() => {
    if (!outerRef.current) return;
    // Measure against card-art: formation fc.y/h fractions map directly to its height
    const szEl = outerRef.current.querySelector('.card-art');
    if (!szEl) return;

    const wrapRect = outerRef.current.getBoundingClientRect();
    const szRect   = szEl.getBoundingClientRect();
    const szTop    = szRect.top  - wrapRect.top;
    const szH      = szRect.height;
    if (szH < 10) return;

    const ys = rows.map(row => {
      const midFrac = row.cells.reduce((s, r) => s + r.fc.y + r.fc.h / 2, 0) / row.cells.length;
      return szTop + midFrac * szH;
    });

    setButtonYs(prev =>
      prev.length === ys.length && prev.every((v, i) => Math.abs(v - ys[i]) < 0.5)
        ? prev
        : ys
    );
  }, [rows]);

  // Measure after layout changes (card resize, new card, etc.)
  useLayoutEffect(() => { measurePositions(); }, [measurePositions]);

  useEffect(() => {
    if (!outerRef.current) return;
    const obs = new ResizeObserver(measurePositions);
    obs.observe(outerRef.current);
    return () => obs.disconnect();
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
