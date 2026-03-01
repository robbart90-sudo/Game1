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

  // ── Precision alignment — derive button Y directly from live DOM measurements ──
  //
  // Strategy:
  //   1. Query all .art-cell elements rendered inside the card.
  //   2. Get their actual screen-space bounding rects via getBoundingClientRect().
  //   3. Sort rects by top, then group overlapping rects into horizontal bands —
  //      each band corresponds to one scratch row.
  //   4. Compute each band's vertical centre.
  //   5. Express that centre relative to .scratch-tool-col (the button container)
  //      so that `top: Xpx` on a button with `transform: translateY(-50%)` lands
  //      exactly on the band centre.
  //
  // This approach is layout-agnostic: it doesn't depend on the 18 px header
  // reservation inside .card-art, the formation fraction formulas, or any other
  // internal constant — it reads the truth straight from the rendered DOM.
  const measurePositions = useCallback(() => {
    if (!outerRef.current || rows.length === 0) return;

    // The button column is the positioning parent (position: relative) for buttons.
    const colEl = outerRef.current.querySelector('.scratch-tool-col');
    if (!colEl) return;
    const colRect = colEl.getBoundingClientRect();
    if (colRect.height < 4) return;

    // Collect every rendered scratch cell's bounding rect.
    const cellEls = Array.from(outerRef.current.querySelectorAll('.art-cell'));
    if (cellEls.length === 0) return;

    const rects = cellEls
      .map(el => el.getBoundingClientRect())
      .filter(r => r.height > 0 && r.width > 0)
      .sort((a, b) => a.top - b.top);

    if (rects.length === 0) return;

    // Group overlapping rects into row bands.
    // Two rects belong to the same band if the second rect's top is below
    // the current band's bottom (with 1 px sub-pixel tolerance).
    const bands = [];
    let band = null;
    for (const r of rects) {
      if (!band || r.top >= band.bottom - 1) {
        band = { top: r.top, bottom: r.bottom };
        bands.push(band);
      } else {
        band.bottom = Math.max(band.bottom, r.bottom);
      }
    }

    // If the DOM doesn't show the expected number of rows yet, bail and wait
    // for the next layout pass (useLayoutEffect will re-fire after next render).
    if (bands.length !== rows.length) return;

    // Convert each band's screen-space centre to a coordinate relative to the
    // button column top.  With `transform: translateY(-50%)` on the button,
    // setting `top` to this value centres the button on the row.
    const ys = bands.map(b => (b.top + b.bottom) / 2 - colRect.top);

    setButtonYs(prev =>
      prev.length === ys.length && prev.every((v, i) => Math.abs(v - ys[i]) < 0.5)
        ? prev   // no meaningful change — skip re-render
        : ys
    );
  }, [rows]);

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
