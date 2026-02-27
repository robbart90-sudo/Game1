import { useRef, useEffect, useCallback, useState } from 'react';
import Sparkles    from './Sparkles';
import CardHeader  from './CardHeader';
import './ScratchCard.css';

const CW = 320;
const CH = 190;

// ── Block grid constants ──────────────────────────────────────────────────
const BLOCK_COLS = 40;
const BLOCK_ROWS = 25;
const BLOCK_W    = CW / BLOCK_COLS;   // 8px
const BLOCK_H    = CH / BLOCK_ROWS;   // 7.6px
const TOTAL_BLOCKS = BLOCK_COLS * BLOCK_ROWS; // 1000

// Base half-width of the scratch brush (px). Velocity elongates the stroke.
const BASE_BRUSH_R = 28;

// Coverage thresholds
const WIN_CELL_THRESHOLD  = 0.50;
const LOSS_CELL_THRESHOLD = 0.05;
const CARD_COMPLETE_AT    = 0.95;
const CHECK_EVERY         = 3; // check more often since block ops are cheap

// Silver/foil debris colors
const SILVER_COLORS = ['#e8e8e8', '#c0c0c0', '#d4d4d4', '#f0f0f0', '#aaaaaa', '#b8b8b8'];

// Pre-computed per-block variation — stable across renders (module-level constant)
const BLOCK_JITTER = (() => {
  // Use seeded-ish values so it's consistent across re-renders of same card
  const arr = new Array(TOTAL_BLOCKS);
  for (let i = 0; i < TOTAL_BLOCKS; i++) {
    // Simple deterministic pseudo-random from index
    const s1 = Math.sin(i * 127.1) * 43758.5453;
    const s2 = Math.sin(i * 311.7) * 43758.5453;
    const s3 = Math.sin(i * 74.3)  * 43758.5453;
    arr[i] = {
      dx:     (s1 - Math.floor(s1) - 0.5) * 5.0,   // ±2.5px edge jitter (scratch boundary only)
      dy:     (s2 - Math.floor(s2) - 0.5) * 5.0,
      lShift: (s3 - Math.floor(s3)) * 26 - 13,      // ±13 lightness shift (foil micro-texture)
    };
  }
  return arr;
})();

function lighten(hex, amt) {
  try {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (n >> 16) + amt);
    const g = Math.min(255, ((n >> 8) & 0xff) + amt);
    const b = Math.min(255, (n & 0xff) + amt);
    return `rgb(${r},${g},${b})`;
  } catch { return hex; }
}

// Convert cell fractional coords to block-grid indices
function cellBlockBounds(fc) {
  const x0 = Math.floor(fc.x * BLOCK_COLS);
  const y0 = Math.floor(fc.y * BLOCK_ROWS);
  const x1 = Math.min(BLOCK_COLS - 1, Math.ceil((fc.x + fc.w) * BLOCK_COLS));
  const y1 = Math.min(BLOCK_ROWS - 1, Math.ceil((fc.y + fc.h) * BLOCK_ROWS));
  return { x0, y0, x1, y1 };
}

export default function ScratchCard({ cardData, onComplete, soundScratch, heat = 0 }) {
  const { theme, luckyNumbers, cells } = cardData;
  const { palette, formation, tilt } = theme;
  const formCells  = formation ? formation.cells : [];
  const luckyStyle = formation ? formation.luckyStyle : 'row';

  // Brush radius scales with heat: +20% at ≥75 heat
  const brushRadius = heat >= 75 ? BASE_BRUSH_R * 1.2 : BASE_BRUSH_R;

  // Which lucky numbers are actual matches (for post-reveal flash)
  const matchedNums = new Set(cells.filter(c => c.isMatch).map(c => c.number));

  const displayRef     = useRef(null);
  const blockCanvasRef = useRef(null);  // pre-rendered foil block texture
  const scratchedRef   = useRef(null);  // Uint8Array[TOTAL_BLOCKS] — binary scratched state
  const scratchedCountRef = useRef(0);
  const lastPosRef     = useRef(null);  // { bxF, byF, cx, cy } — last pointer position
  const velRef         = useRef({ nx: 1, ny: 0 }); // smoothed velocity unit-vector
  const animRef        = useRef(null);
  const pointerDown    = useRef(false);
  const scratchCount   = useRef(0);
  const scratchStart   = useRef(null);
  const revealedRef    = useRef(false);
  const particlesRef   = useRef([]);
  const dealingRef     = useRef(true);

  const [sparkles,  setSparkles]  = useState(false);
  const [isDealing, setIsDealing] = useState(true);
  const [completed, setCompleted] = useState(false);

  // ── Sparkles + deal animation ────────────────────────────────────────────
  useEffect(() => {
    setSparkles(true);
    setIsDealing(true);
    setCompleted(false);
    dealingRef.current      = true;
    revealedRef.current     = false;
    particlesRef.current    = [];
    lastPosRef.current      = null;
    velRef.current          = { nx: 1, ny: 0 };
    scratchCount.current    = 0;
    scratchStart.current    = null;
    scratchedCountRef.current = 0;

    // Fresh scratch state
    scratchedRef.current = new Uint8Array(TOTAL_BLOCKS);

    const t1 = setTimeout(() => setSparkles(false), 1200);
    const t2 = setTimeout(() => { setIsDealing(false); dealingRef.current = false; }, 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [cardData]);

  // ── Build foil block canvas (pre-rendered texture per card) ───────────────
  useEffect(() => {
    const bc = document.createElement('canvas');
    bc.width  = CW;
    bc.height = CH;
    blockCanvasRef.current = bc;
    const octx = bc.getContext('2d');

    // Step 1: Solid seamless metallic base (fully opaque — no see-through at all)
    const baseGrad = octx.createLinearGradient(0, 0, CW, CH);
    baseGrad.addColorStop(0,    lighten(palette.scratch, 70));
    baseGrad.addColorStop(0.2,  lighten(palette.scratch, 95));
    baseGrad.addColorStop(0.45, lighten(palette.scratch, 55));
    baseGrad.addColorStop(0.7,  lighten(palette.scratch, 85));
    baseGrad.addColorStop(1,    lighten(palette.scratch, 45));
    octx.fillStyle = baseGrad;
    octx.fillRect(0, 0, CW, CH);

    // Step 2: Subtle per-block lightness variation — no gaps, no position jitter
    // This gives a faint micro-texture to the foil without any grid seams
    for (let by = 0; by < BLOCK_ROWS; by++) {
      for (let bx = 0; bx < BLOCK_COLS; bx++) {
        const { lShift } = BLOCK_JITTER[by * BLOCK_COLS + bx];
        const a = (lShift / 13) * 0.07; // ±7% alpha overlay — very subtle
        octx.fillStyle = a > 0 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${-a})`;
        // Fill exactly the block cell — no gap, no position offset
        octx.fillRect(bx * BLOCK_W, by * BLOCK_H, BLOCK_W, BLOCK_H);
      }
    }

    // Step 3: Diagonal grain lines (classic metallic lottery ticket look)
    octx.strokeStyle = 'rgba(255,255,255,0.07)';
    octx.lineWidth   = 1;
    for (let x = -CH; x < CW + CH; x += 8) {
      octx.beginPath();
      octx.moveTo(x, 0);
      octx.lineTo(x + CH, CH);
      octx.stroke();
    }

    // Step 4: Overall shimmer wash
    const wash = octx.createLinearGradient(0, 0, CW, CH);
    wash.addColorStop(0,    'rgba(255,255,255,0.20)');
    wash.addColorStop(0.3,  'rgba(255,255,255,0.06)');
    wash.addColorStop(0.55, 'rgba(255,255,255,0.24)');
    wash.addColorStop(0.8,  'rgba(255,255,255,0.04)');
    wash.addColorStop(1,    'rgba(255,255,255,0.14)');
    octx.fillStyle = wash;
    octx.fillRect(0, 0, CW, CH);

    // Step 5: Embossed cell guides — shows exactly where to scratch, like a real ticket
    // Uses same canvas coordinates as the coverage detection (fc.x*CW, fc.y*CH).
    for (const fc of formCells) {
      const cx = fc.x * CW;
      const cy = fc.y * CH;
      const cw = fc.w * CW;
      const ch = fc.h * CH;

      // Raised-panel effect: shadow on bottom+right, highlight on top+left
      octx.lineWidth = 1.5;
      octx.strokeStyle = 'rgba(0,0,0,0.30)';
      octx.beginPath();
      octx.moveTo(cx,      cy + ch);  // bottom-left
      octx.lineTo(cx + cw, cy + ch);  // bottom-right
      octx.lineTo(cx + cw, cy);       // top-right
      octx.stroke();

      octx.strokeStyle = 'rgba(255,255,255,0.50)';
      octx.beginPath();
      octx.moveTo(cx + cw, cy);  // top-right
      octx.lineTo(cx,      cy);  // top-left
      octx.lineTo(cx,      cy + ch);  // bottom-left
      octx.stroke();

      // Inner dashed boundary (classic scratch-ticket style)
      octx.strokeStyle = 'rgba(255,255,255,0.22)';
      octx.lineWidth = 0.75;
      octx.setLineDash([2, 2]);
      octx.strokeRect(cx + 3, cy + 3, cw - 6, ch - 6);
      octx.setLineDash([]);

    }

  }, [cardData, palette.scratch, formCells]);

  // ── Scratch a single block ────────────────────────────────────────────────
  const scratchBlock = useCallback((bx, by) => {
    if (bx < 0 || bx >= BLOCK_COLS || by < 0 || by >= BLOCK_ROWS) return;
    const idx = by * BLOCK_COLS + bx;
    if (scratchedRef.current[idx]) return; // already scratched
    scratchedRef.current[idx] = 1;
    scratchedCountRef.current++;

    // Spawn debris particle at block centre
    const px = (bx + 0.5) * BLOCK_W;
    const py = (by + 0.5) * BLOCK_H;
    if (Math.random() < 0.35) { // not every block — keeps it subtle
      particlesRef.current.push({
        x: px, y: py,
        vx: (Math.random() - 0.5) * 2.2,
        vy: (Math.random() - 0.5) * 2.2,
        size: 0.8 + Math.random() * 1.8,
        angle: Math.random() * Math.PI,
        color: SILVER_COLORS[Math.floor(Math.random() * SILVER_COLORS.length)],
        born: Date.now(),
      });
    }
  }, []);

  // ── Block-based cell coverage (no pixel reads) ────────────────────────────
  const cellBlockCoverage = useCallback((fc) => {
    const { x0, y0, x1, y1 } = cellBlockBounds(fc);
    let total = 0, scratched = 0;
    for (let by = y0; by <= y1; by++) {
      for (let bx = x0; bx <= x1; bx++) {
        total++;
        if (scratchedRef.current[by * BLOCK_COLS + bx]) scratched++;
      }
    }
    return total > 0 ? scratched / total : 0;
  }, []);

  // ── Check overall coverage and fire onComplete ────────────────────────────
  const checkCoverage = useCallback(() => {
    if (revealedRef.current || formCells.length === 0) return;
    let revealedCells = 0;
    cells.forEach((cell, i) => {
      const fc = formCells[i];
      if (!fc) return;
      const threshold = cell.isMatch ? WIN_CELL_THRESHOLD : LOSS_CELL_THRESHOLD;
      if (cellBlockCoverage(fc) >= threshold) revealedCells++;
    });
    if (revealedCells / formCells.length >= CARD_COMPLETE_AT) {
      revealedRef.current = true;
      setCompleted(true);
      cancelAnimationFrame(animRef.current);
      const scratchSecs = scratchStart.current
        ? (Date.now() - scratchStart.current) / 1000
        : null;
      onComplete(scratchSecs);
    }
  }, [cells, formCells, cellBlockCoverage, onComplete]);

  // ── Canvas render loop ────────────────────────────────────────────────────
  useEffect(() => {
    let hue = 0;

    const render = (ts) => {
      const canvas = displayRef.current;
      const bc     = blockCanvasRef.current;
      const sc     = scratchedRef.current;
      if (!canvas || !bc || !sc) { animRef.current = requestAnimationFrame(render); return; }
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, CW, CH);

      // ── 1. Draw pre-rendered foil block texture ──────────────────────────
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(bc, 0, 0);

      // ── 2. Erase scratched blocks (destination-out) ──────────────────────
      // Each block is erased at a slightly jittered position — this creates
      // jagged/chunky edges at the scratch boundary while the interior stays
      // clean. Oversize by 5px ensures adjacent scratched blocks overlap so
      // no thin lines appear inside a fully-scratched region.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,1)';
      for (let by = 0; by < BLOCK_ROWS; by++) {
        for (let bx = 0; bx < BLOCK_COLS; bx++) {
          if (!sc[by * BLOCK_COLS + bx]) continue;
          const { dx, dy } = BLOCK_JITTER[by * BLOCK_COLS + bx];
          ctx.fillRect(
            Math.floor(bx * BLOCK_W + dx),
            Math.floor(by * BLOCK_H + dy),
            BLOCK_W + 5,
            BLOCK_H + 5,
          );
        }
      }

      // ── 3. Iridescent shimmer + specular (source-atop = only on unscratched foil) ──
      ctx.globalCompositeOperation = 'source-atop';

      hue = (hue + 0.5) % 360;
      const iriGrad = ctx.createLinearGradient(0, 0, CW, CH);
      iriGrad.addColorStop(0,    `hsla(${hue},       95%, 65%, 0.13)`);
      iriGrad.addColorStop(0.25, `hsla(${hue + 60},  95%, 65%, 0.18)`);
      iriGrad.addColorStop(0.5,  `hsla(${hue + 140}, 95%, 65%, 0.13)`);
      iriGrad.addColorStop(0.75, `hsla(${hue + 220}, 95%, 65%, 0.18)`);
      iriGrad.addColorStop(1,    `hsla(${hue + 300}, 95%, 65%, 0.11)`);
      ctx.fillStyle = iriGrad;
      ctx.fillRect(0, 0, CW, CH);

      // Specular highlight
      const sp = ((ts * 0.00035) % 1.6 - 0.3) * CW;
      const shim = ctx.createLinearGradient(sp - 100, 0, sp + 100, 0);
      shim.addColorStop(0,    'rgba(255,255,255,0)');
      shim.addColorStop(0.3,  'rgba(255,255,255,0.07)');
      shim.addColorStop(0.5,  'rgba(255,255,255,0.24)');
      shim.addColorStop(0.7,  'rgba(255,255,255,0.07)');
      shim.addColorStop(1,    'rgba(255,255,255,0)');
      ctx.fillStyle = shim;
      ctx.fillRect(0, 0, CW, CH);

      ctx.globalCompositeOperation = 'source-over';

      // ── 5. Debris particles ──────────────────────────────────────────────
      const now = Date.now();
      particlesRef.current = particlesRef.current.filter(p => now - p.born < 600);
      for (const p of particlesRef.current) {
        const age = (now - p.born) / 600;
        ctx.globalAlpha = (1 - age) * 0.75;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.ellipse(
          p.x + p.vx * age * 14,
          p.y + p.vy * age * 14,
          p.size, p.size * 0.5, p.angle, 0, Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [cardData]);

  // ── scratchAt — converts canvas coords to blocks, with line interpolation ─
  const scratchAt = useCallback((clientX, clientY) => {
    if (revealedRef.current || dealingRef.current) return;
    const canvas = displayRef.current;
    if (!canvas) return;

    if (!scratchStart.current) scratchStart.current = Date.now();
    soundScratch?.();

    const rect = canvas.getBoundingClientRect();
    const sx = CW / rect.width;
    const sy = CH / rect.height;
    const cx = (clientX - rect.left) * sx;
    const cy = (clientY - rect.top)  * sy;

    const bxF = cx / BLOCK_W;
    const byF = cy / BLOCK_H;

    // ── Velocity: direction + speed ───────────────────────────────────────
    // Blend raw frame-delta direction into a smoothed unit vector so the
    // brush orientation follows direction changes without flickering.
    let speed = 0;
    if (lastPosRef.current) {
      const { cx: lcx, cy: lcy } = lastPosRef.current;
      const dvx = cx - lcx;
      const dvy = cy - lcy;
      speed = Math.sqrt(dvx * dvx + dvy * dvy);
      if (speed > 0.5) {
        const alpha  = 0.65; // higher = snappier direction tracking
        const rawNx  = dvx / speed;
        const rawNy  = dvy / speed;
        const bx     = alpha * rawNx + (1 - alpha) * velRef.current.nx;
        const by_    = alpha * rawNy + (1 - alpha) * velRef.current.ny;
        const blen   = Math.sqrt(bx * bx + by_ * by_) || 1;
        velRef.current = { nx: bx / blen, ny: by_ / blen };
      }
    }
    const { nx: nvx, ny: nvy } = velRef.current;

    // ── Speed-shaped brush ellipse ────────────────────────────────────────
    // At rest  → near-circle (~19px radius)
    // At speed → thin streak (long axis up to ~56px, perp as low as ~11px)
    // MAX_SPEED ~28 px/frame = fast full-card swipe at 60 fps
    const t        = Math.min(speed / 28, 1);
    const halfLong = brushRadius * (0.68 + 1.32 * t); // 19 → 56 px
    const halfPerp = brushRadius * (0.68 - 0.28 * t); // 19 → 11 px
    const hl2      = halfLong * halfLong;
    const hp2      = halfPerp * halfPerp;

    // ── Stamp one oriented ellipse at canvas position (scx, scy) ─────────
    const stampAt = (scx, scy) => {
      // Bounding box in block indices (use halfLong for both axes — safe over-estimate)
      const bx0 = Math.max(0,              Math.floor((scx - halfLong) / BLOCK_W));
      const by0 = Math.max(0,              Math.floor((scy - halfLong) / BLOCK_H));
      const bx1 = Math.min(BLOCK_COLS - 1, Math.ceil( (scx + halfLong) / BLOCK_W));
      const by1 = Math.min(BLOCK_ROWS - 1, Math.ceil( (scy + halfLong) / BLOCK_H));

      for (let by = by0; by <= by1; by++) {
        for (let bx = bx0; bx <= bx1; bx++) {
          // Jitter block centre for organic, ragged edges
          const j  = BLOCK_JITTER[by * BLOCK_COLS + bx];
          const px = (bx + 0.5) * BLOCK_W - scx + j.dx * 1.2;
          const py = (by + 0.5) * BLOCK_H - scy + j.dy * 1.2;

          // Rotate into velocity-aligned ellipse frame
          const along = px *  nvx + py * nvy;
          const perp  = px * -nvy + py * nvx;

          if ((along * along) / hl2 + (perp * perp) / hp2 <= 1.0) {
            scratchBlock(bx, by);
          }
        }
      }
    };

    // ── Interpolate stamps along the stroke ───────────────────────────────
    // Step = halfPerp × 0.55 — just enough overlap in the narrow axis so
    // no gaps appear, without redundant stamps in the long axis.
    if (lastPosRef.current) {
      const { cx: lcx, cy: lcy } = lastPosRef.current;
      const dist     = Math.sqrt((cx - lcx) ** 2 + (cy - lcy) ** 2);
      const stepSize = Math.max(halfPerp * 0.55, 2);
      const steps    = Math.max(1, Math.ceil(dist / stepSize));
      for (let s = 1; s <= steps; s++) {
        stampAt(
          lcx + (cx - lcx) * (s / steps),
          lcy + (cy - lcy) * (s / steps),
        );
      }
    } else {
      stampAt(cx, cy);
    }

    lastPosRef.current = { bxF, byF, cx, cy };
    // ─────────────────────────────────────────────────────────────────────

    // Coverage check
    scratchCount.current++;
    if (scratchCount.current % CHECK_EVERY === 0) {
      checkCoverage();
    }
  }, [brushRadius, scratchBlock, checkCoverage, soundScratch]);

  // ── Window-level pointer listeners ────────────────────────────────────────
  useEffect(() => {
    const onMove  = (e) => { if (pointerDown.current) scratchAt(e.clientX, e.clientY); };
    const onUp    = ()  => { pointerDown.current = false; lastPosRef.current = null; };
    const onTMove = (e) => {
      if (!pointerDown.current) return;
      e.preventDefault();
      scratchAt(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTEnd  = () => { pointerDown.current = false; lastPosRef.current = null; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    window.addEventListener('touchmove', onTMove, { passive: false });
    window.addEventListener('touchend',  onTEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('touchmove', onTMove);
      window.removeEventListener('touchend',  onTEnd);
    };
  }, [scratchAt]);

  // ── Spacebar: instantly reveal all LOSING cells (block-based) ─────────────
  const autoRevealLosers = useCallback(() => {
    if (revealedRef.current || dealingRef.current || completed) return;
    const sc = scratchedRef.current;
    if (!sc) return;

    cells.forEach((cell, i) => {
      if (cell.isMatch) return; // skip winning cells
      const fc = formCells[i];
      if (!fc) return;
      const { x0, y0, x1, y1 } = cellBlockBounds(fc);
      for (let by = y0; by <= y1; by++) {
        for (let bx = x0; bx <= x1; bx++) {
          const idx = by * BLOCK_COLS + bx;
          if (!sc[idx]) { sc[idx] = 1; scratchedCountRef.current++; }
        }
      }
    });

    // Check if now complete
    let revealedCells = 0;
    cells.forEach((cell, i) => {
      const fc = formCells[i];
      if (!fc) return;
      if (!cell.isMatch) {
        revealedCells++; // all non-match cells were just cleared
      } else {
        if (cellBlockCoverage(fc) >= WIN_CELL_THRESHOLD) revealedCells++;
      }
    });
    if (revealedCells / formCells.length >= CARD_COMPLETE_AT) {
      revealedRef.current = true;
      setCompleted(true);
      cancelAnimationFrame(animRef.current);
      onComplete(scratchStart.current ? (Date.now() - scratchStart.current) / 1000 : null);
    }
  }, [cells, formCells, completed, cellBlockCoverage, onComplete]);

  // ── Keyboard: spacebar ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        autoRevealLosers();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [autoRevealLosers]);

  const hdBg   = `linear-gradient(135deg, ${palette.hdr[0]}, ${palette.hdr[1]}, ${palette.hdr[2]})`;
  const cardBg = `linear-gradient(170deg, ${palette.bg[0]}, ${palette.bg[1]})`;

  // ── Lucky number rendering ────────────────────────────────────────────────
  const renderLuckyNum = (n, i, extraClass = '', extraStyle = {}) => {
    const isMatching = completed && matchedNums.has(n);
    return (
      <div
        key={i}
        className={`lucky-num ${isMatching ? 'lucky-match' : ''} ${extraClass}`}
        style={{
          '--lucky-color': palette.numText,
          background: isMatching
            ? `radial-gradient(circle, ${palette.numBg} 0%, #0a1a00 100%)`
            : palette.numBg,
          color: isMatching ? '#00ff88' : palette.numText,
          borderColor: isMatching ? '#00ff88' : palette.border,
          ...extraStyle,
        }}
      >
        {String(n).padStart(2, '0')}
      </div>
    );
  };

  const renderLuckyNumbers = () => {
    if (luckyStyle === 'col-left' || luckyStyle === 'col-right') {
      return (
        <div className={`lucky-col lucky-${luckyStyle}`}>
          <div className="section-label" style={{ color: palette.accent }}>LUCKY</div>
          <div className="lucky-col-nums">
            {luckyNumbers.map((n, i) => renderLuckyNum(n, i))}
          </div>
        </div>
      );
    }
    if (luckyStyle === 'split') {
      return (
        <div className="lucky-split">
          <div className="lucky-split-side">
            {luckyNumbers.slice(0, 2).map((n, i) => renderLuckyNum(n, i))}
          </div>
          <div className="section-label" style={{ color: palette.accent }}>LUCKY #s</div>
          <div className="lucky-split-side">
            {luckyNumbers.slice(2).map((n, i) => renderLuckyNum(n, i + 2))}
          </div>
        </div>
      );
    }
    if (luckyStyle === 'scattered') {
      return (
        <div className="lucky-scattered">
          <div className="section-label" style={{ color: palette.accent }}>LUCKY NUMBERS</div>
          <div className="lucky-scattered-nums">
            {luckyNumbers.map((n, i) =>
              renderLuckyNum(n, i, 'lucky-scattered-item', {
                transform: `rotate(${(i % 3 - 1) * 6}deg)`,
              })
            )}
          </div>
        </div>
      );
    }
    if (luckyStyle === 'top-bottom') {
      return (
        <div className="lucky-topbottom">
          <div className="lucky-topbottom-row">
            {luckyNumbers.slice(0, 2).map((n, i) => renderLuckyNum(n, i))}
          </div>
          <div className="section-label" style={{ color: palette.accent }}>LUCKY NUMBERS</div>
          <div className="lucky-topbottom-row">
            {luckyNumbers.slice(2).map((n, i) => renderLuckyNum(n, i + 2))}
          </div>
        </div>
      );
    }
    // default: 'row'
    return (
      <div className="ticket-lucky-inner">
        <div className="section-label" style={{ color: palette.accent }}>LUCKY NUMBERS</div>
        <div className="lucky-row">
          {luckyNumbers.map((n, i) => renderLuckyNum(n, i))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`ticket ${isDealing ? 'dealing' : ''}`}
      style={{
        background: cardBg,
        borderColor: palette.border,
        '--tilt': `${tilt || 0}deg`,
        transform: isDealing ? undefined : `rotate(${tilt || 0}deg)`,
      }}
    >
      <Sparkles active={sparkles} />

      {/* ── Header ───────────────────────────────── */}
      <CardHeader theme={theme} />

      {/* ── Lucky Numbers ─────────────────────────── */}
      <div
        className={`ticket-lucky lucky-style-${luckyStyle}`}
        style={{ borderColor: `${palette.border}44` }}
      >
        {renderLuckyNumbers()}
      </div>

      {/* ── Scratch Zone ─────────────────────────── */}
      <div className="scratch-zone">
        <div
          className="card-art"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${lighten(palette.numBg, 15)} 0%, ${palette.numBg} 65%)`,
          }}
        >
          <div className="art-label" style={{ color: palette.accent }}>YOUR NUMBERS</div>
          <div className="art-cells">
            {cells.map((cell, i) => {
              const fc = formCells[i] || { x: 0, y: 0, w: 0.3, h: 0.3 };
              return (
                <div
                  key={i}
                  className={`art-cell ${cell.isMatch ? 'match' : ''} ${completed && cell.isMatch ? 'win-revealed' : ''}`}
                  style={{
                    left:   `${fc.x * 100}%`,
                    top:    `calc(18px + ${fc.y} * (100% - 18px))`,
                    width:  `${fc.w * 100}%`,
                    height: `calc(${fc.h} * (100% - 18px))`,
                    background: cell.isMatch
                      ? `linear-gradient(135deg, ${palette.numBg}, #0d2810)`
                      : palette.numBg,
                    borderColor: cell.isMatch ? '#00ff88' : `${palette.border}55`,
                    boxShadow:   cell.isMatch ? '0 0 14px rgba(0,255,136,0.4)' : 'none',
                  }}
                >
                  <span
                    className="art-num"
                    style={{ color: cell.isMatch ? '#00ff88' : palette.numText }}
                  >
                    {String(cell.number).padStart(2, '0')}
                  </span>
                  {cell.isMatch && cell.prize > 0 && (
                    <span className="art-prize">+{cell.prize.toLocaleString()}🪙</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Corner registration marks */}
        <div className="registration-marks" aria-hidden="true">
          <span className="reg-mark reg-tl" />
          <span className="reg-mark reg-tr" />
          <span className="reg-mark reg-bl" />
          <span className="reg-mark reg-br" />
        </div>

        {/* Scratch canvas */}
        {!completed && (
          <canvas
            ref={displayRef}
            className="scratch-canvas"
            width={CW}
            height={CH}
            onMouseDown={(e) => { pointerDown.current = true; lastPosRef.current = null; scratchAt(e.clientX, e.clientY); }}
            onTouchStart={(e) => { pointerDown.current = true; lastPosRef.current = null; scratchAt(e.touches[0].clientX, e.touches[0].clientY); }}
          />
        )}
      </div>

      {/* ── Footer ───────────────────────────────── */}
      <div className="ticket-footer" style={{ background: hdBg }}>
        <span className="ticket-tagline">{theme.tagline}</span>
      </div>
    </div>
  );
}
