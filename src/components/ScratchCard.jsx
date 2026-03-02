import { useRef, useEffect, useCallback, useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import Sparkles    from './Sparkles';
import CardHeader  from './CardHeader';
import './ScratchCard.css';

// ── ESP Glow — standalone canvas function ─────────────────────────────────────
// Draws Mack's supernatural lucky-number luminescence at (cx, cy) on ctx.
// intensity: 0.0 (invisible) → 1.0 (full glow). timestamp: performance.now() value.
// Built for reuse in the peyote sequence where all probabilities become visible.
export function drawESPGlow(ctx, cx, cy, intensity, timestamp) {
  if (intensity <= 0) return;
  const t = (timestamp || 0) * 0.001; // ms → seconds

  // Irregular pulse rhythm — layered sines with incommensurate frequencies
  // so it never settles into a perfect repeating cycle (feels alive, not mechanical)
  const raw =
      0.52 + 0.26 * Math.sin(t * 2.13)
           + 0.13 * Math.sin(t * 5.87 + 1.41)
           + 0.09 * Math.sin(t * 0.71 + 2.93);
  const p = Math.max(0, Math.min(1, raw)) * intensity;
  if (p < 0.01) return;

  const r = 20 * (1 + p * 0.4); // breathing radius

  ctx.save();

  // Outer diffuse aura — cool electric blue
  const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.6);
  aura.addColorStop(0,    `rgba(135, 200, 255, ${0.55 * p})`);
  aura.addColorStop(0.28, `rgba(85,  155, 255, ${0.38 * p})`);
  aura.addColorStop(0.65, `rgba(40,  100, 255, ${0.16 * p})`);
  aura.addColorStop(1,    'rgba(0, 55, 200, 0)');

  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 2.6, 0, Math.PI * 2);
  ctx.fill();

  // Inner core — bright white-blue emanating from within
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.7);
  core.addColorStop(0,   `rgba(215, 238, 255, ${0.80 * p})`);
  core.addColorStop(0.4, `rgba(145, 195, 255, ${0.50 * p})`);
  core.addColorStop(1,   'rgba(80, 140, 255, 0)');

  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
}

const CW = 320;
const CH = 190;

// Pixels reserved at the top of the canvas for the art-label area.
// Must stay in sync with the CSS formula: top: calc(18px + fc.y * (100% - 18px))
// and height: calc(fc.h * (100% - 18px))
const ART_LABEL_H = 18;

// ── Block grid constants ──────────────────────────────────────────────────
const BLOCK_COLS = 40;
const BLOCK_ROWS = 25;
const BLOCK_W    = CW / BLOCK_COLS;   // 8px
const BLOCK_H    = CH / BLOCK_ROWS;   // 7.6px
const TOTAL_BLOCKS = BLOCK_COLS * BLOCK_ROWS; // 1000

// ── Group formation cells into horizontal row bands ───────────────────────────
// Groups by fractional y-coordinate (the formation's own row structure) so that
// block-boundary quantization never accidentally merges adjacent formation rows.
// Cells with the same fc.y (within a small tolerance) belong to the same band.
function groupIntoRows(formCells, formationId) {
  if (!formCells || !formCells.length) return [];
  const usableH = CH - ART_LABEL_H;

  // Step 1 — bucket cells by their fractional y position
  const Y_TOL  = 0.001;
  const yBands = [];
  for (const fc of formCells) {
    let band = yBands.find(b => Math.abs(b.fy - fc.y) < Y_TOL);
    if (!band) { band = { fy: fc.y, cells: [] }; yBands.push(band); }
    band.cells.push(fc);
  }
  yBands.sort((a, b) => a.fy - b.fy);

  // Step 2 — map each band to block-row extents
  const rows = yBands.map(band => {
    const by0s = band.cells.map(fc => Math.floor((ART_LABEL_H + fc.y          * usableH) / BLOCK_H));
    const by1s = band.cells.map(fc => Math.ceil( (ART_LABEL_H + (fc.y + fc.h) * usableH) / BLOCK_H) - 1);
    return {
      by0: Math.max(0,              Math.min(...by0s)),
      by1: Math.min(BLOCK_ROWS - 1, Math.max(...by1s)),
    };
  });

  // Dev-only log: confirm formation → cell → row → button consistency
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `[rows] formation=${formationId ?? '?'}  cells=${formCells.length}  ` +
      `rows=${rows.length}  buttons=${rows.length}`,
      rows.map(r => `[${r.by0}–${r.by1}]`).join(' '),
    );
  }

  return rows;
}

// Coin-edge cursor — generated once at module load, applied on the scratch surface.
// A small horizontal silver oval (24×12px) mimicking a coin dragged across a card.
const coinCursor = (() => {
  if (typeof document === 'undefined') return 'crosshair';
  const c = document.createElement('canvas');
  c.width = 24; c.height = 12;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 12);
  grad.addColorStop(0,   '#D4D4D4');
  grad.addColorStop(0.4, '#F2F2F2');
  grad.addColorStop(1,   '#9A9A9A');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(12, 6, 11, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Specular highlight along top arc
  ctx.strokeStyle = 'rgba(255,255,255,0.58)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.ellipse(12, 5, 8.5, 2.8, 0, 0, Math.PI);
  ctx.stroke();
  return `url(${c.toDataURL()}) 12 6, crosshair`;
})();

// Base brush radius (px) — at rest the brush is a circle of this size.
const BASE_BRUSH_R = 22;
// Speed (px/pointer-event in canvas coords) at which the capsule reaches full stretch.
const MAX_SPEED    = 5;

const CHECK_EVERY = 3; // how often to run the hotspot completion check

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

// 20×20 px hotspot centered on a formCell, returned as block-grid indices.
// The player only needs to scratch through this central target zone.
function hotspotBlocks(fc) {
  const usableH = CH - ART_LABEL_H;
  const cx = (fc.x + fc.w * 0.5) * CW;
  const cy = ART_LABEL_H + (fc.y + fc.h * 0.5) * usableH;
  return {
    x0: Math.max(0,              Math.floor((cx - 10) / BLOCK_W)),
    y0: Math.max(0,              Math.floor((cy - 10) / BLOCK_H)),
    x1: Math.min(BLOCK_COLS - 1, Math.floor((cx + 10) / BLOCK_W)),
    y1: Math.min(BLOCK_ROWS - 1, Math.floor((cy + 10) / BLOCK_H)),
  };
}

const ScratchCard = forwardRef(function ScratchCard({ cardData, onComplete, soundScratch, flowLevel = 0, brushBoost = 1, hotDogTrigger = 0, sessionLuckyNumber = null, debugRows = 0, scratchToolUnlocked = false, onFirstToolUse }, ref) {
  const { theme, luckyNumbers, cells } = cardData;
  const { palette, formation, tilt } = theme;
  const formCells  = formation ? formation.cells : [];
  const luckyStyle = formation ? formation.luckyStyle : 'row';

  // Brush radius scales with flow level (+20% at ≥75) and Fries boost (×brushBoost)
  const brushRadius = (flowLevel >= 75 ? BASE_BRUSH_R * 1.2 : BASE_BRUSH_R) * brushBoost;

  // Which lucky numbers are actual matches (for post-reveal flash)
  const matchedNums = new Set(cells.filter(c => c.isMatch).map(c => c.number));

  const displayRef     = useRef(null);
  const blockCanvasRef = useRef(null);  // pre-rendered foil block texture
  const scratchedRef   = useRef(null);  // Uint8Array[TOTAL_BLOCKS] — binary scratched state
  const scratchedCountRef = useRef(0);
  const lastPosRef     = useRef(null);  // { bxF, byF, cx, cy } — last pointer position
  const velRef         = useRef({ nx: 1, ny: 0 }); // smoothed velocity unit-vector
  const speedRef       = useRef(0);                // smoothed speed (px/event, canvas coords)
  const animRef        = useRef(null);
  const pointerDown    = useRef(false);
  const scratchCount   = useRef(0);
  const scratchStart   = useRef(null);
  const revealedRef    = useRef(false);
  const particlesRef   = useRef([]);
  const dealingRef     = useRef(true);

  const espFadeRef      = useRef(false); // true once card completes w/ non-match lucky num
  const debugRowsRef    = useRef(debugRows); // kept in a ref so rAF loop always sees current value
  debugRowsRef.current  = debugRows;

  const [sparkles,  setSparkles]  = useState(false);
  const [isDealing, setIsDealing] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [usedRows,  setUsedRows]  = useState(new Set());
  const firstFiredRef = useRef(false);
  const rows = useMemo(() => groupIntoRows(formCells, formation?.id), [formCells, formation]);

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
    speedRef.current        = 0;
    scratchCount.current    = 0;
    scratchStart.current    = null;
    scratchedCountRef.current = 0;

    espFadeRef.current = false;
    setUsedRows(new Set());
    firstFiredRef.current = false;
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
    // Uses same canvas coordinates as the coverage detection.
    const usableH = CH - ART_LABEL_H;
    for (const fc of formCells) {
      const cx = fc.x * CW;
      const cy = ART_LABEL_H + fc.y * usableH;
      const cw = fc.w * CW;
      const ch = fc.h * usableH;

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

  // ── Hotspot check: fire onComplete when every cell's centre has been scratched ─
  // Each formCell has a 20×20 px hotspot at its centre. A hotspot is cleared
  // as soon as any block within it is scratched — the player just needs one
  // stroke through the middle of each number, not broad coverage.
  const checkCoverage = useCallback(() => {
    if (revealedRef.current || formCells.length === 0) return;
    const sc = scratchedRef.current;
    const allCleared = formCells.every(fc => {
      const { x0, y0, x1, y1 } = hotspotBlocks(fc);
      for (let by = y0; by <= y1; by++)
        for (let bx = x0; bx <= x1; bx++)
          if (sc[by * BLOCK_COLS + bx]) return true;
      return false;
    });
    if (allCleared) {
      revealedRef.current = true;
      setCompleted(true);
      cancelAnimationFrame(animRef.current);
      onComplete(scratchStart.current ? (Date.now() - scratchStart.current) / 1000 : null);
    }
  }, [formCells, onComplete]);

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

      // ── 1b. ESP glow — faint luminescence visible THROUGH the foil ───────
      // Drawn before erase so it bleeds into the metallic surface.
      // Color exists nowhere else in this game — cool electric blue-white.
      if (sessionLuckyNumber !== null) {
        const usableH = CH - ART_LABEL_H;
        cells.forEach((cell, i) => {
          if (cell.number !== sessionLuckyNumber) return;
          const fc = formCells[i];
          if (!fc) return;
          const cx = (fc.x + fc.w * 0.5) * CW;
          const cy = ART_LABEL_H + (fc.y + fc.h * 0.5) * usableH;
          // Pre-reveal: very faint so foil still reads as opaque
          drawESPGlow(ctx, cx, cy, 0.22, ts);

          // Spawn upward-drifting ESP particles (heat shimmer / static)
          if (Math.random() < 0.014) {
            particlesRef.current.push({
              x:     cx + (Math.random() - 0.5) * 10,
              y:     cy + (Math.random() - 0.5) * 4,
              vx:    (Math.random() - 0.5) * 0.6,
              vy:    -(0.9 + Math.random() * 1.4), // upward
              size:  0.5 + Math.random() * 1.1,
              angle: Math.random() * Math.PI,
              color: `rgba(${140 + Math.floor(Math.random() * 60)},${185 + Math.floor(Math.random() * 55)},255,1)`,
              born:  Date.now(),
              isEsp: true,
            });
          }
        });
      }

      // ── 2. Erase scratched blocks (destination-out, clipped per cell) ───────
      // Each cell gets its own clipping rect so erasure never bleeds into
      // neighbouring cells. Jagged edge jitter (BLOCK_JITTER) is clipped at
      // the cell boundary — the foil between cells is never erased.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,1)';
      const usableH2 = CH - ART_LABEL_H;
      for (const fc of formCells) {
        const cellX = fc.x * CW;
        const cellY = ART_LABEL_H + fc.y * usableH2;
        const cellW = fc.w * CW;
        const cellH = fc.h * usableH2;
        // Block range that overlaps this cell
        const bx0 = Math.max(0,              Math.floor(cellX / BLOCK_W));
        const by0 = Math.max(0,              Math.floor(cellY / BLOCK_H));
        const bx1 = Math.min(BLOCK_COLS - 1, Math.ceil((cellX + cellW) / BLOCK_W));
        const by1 = Math.min(BLOCK_ROWS - 1, Math.ceil((cellY + cellH) / BLOCK_H));
        ctx.save();
        ctx.beginPath();
        ctx.rect(cellX, cellY, cellW, cellH);
        ctx.clip();
        for (let by = by0; by <= by1; by++) {
          for (let bx = bx0; bx <= bx1; bx++) {
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
        ctx.restore();
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

      // ── 5. Debris + ESP particles ────────────────────────────────────────
      const now = Date.now();
      particlesRef.current = particlesRef.current.filter(p =>
        p.isEsp ? (now - p.born < 1100) : (now - p.born < 600)
      );
      for (const p of particlesRef.current) {
        const life = p.isEsp ? 1100 : 600;
        const age  = (now - p.born) / life;
        const dist = p.isEsp ? 18 : 14;
        ctx.globalAlpha = (1 - age) * (p.isEsp ? 0.55 : 0.75);
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.ellipse(
          p.x + p.vx * age * dist,
          p.y + p.vy * age * dist,
          p.size, p.size * 0.5, p.angle, 0, Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ── DEBUG: horizontal row-boundary lines ──────────────────────────────
      // One blue line per inter-row boundary — should sit between scratch rows.
      // ScratchToolOverlay places buttons at the midpoint of each equal slice
      // of the canvas height (CH / debugRows per slice), so boundaries are at
      // y = i * CH / debugRows for i = 1 … debugRows-1.
      const dbgRows = debugRowsRef.current;
      if (dbgRows > 1) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = 'rgba(0, 120, 255, 0.85)';
        ctx.lineWidth = 1;
        for (let i = 1; i < dbgRows; i++) {
          const y = Math.round(i * CH / dbgRows) + 0.5; // +0.5 → crisp 1px line
          ctx.beginPath();
          ctx.moveTo(0,  y);
          ctx.lineTo(CW, y);
          ctx.stroke();
        }
      }
      // ── END DEBUG ─────────────────────────────────────────────────────────

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

    // ── Velocity: direction + smoothed speed ──────────────────────────────
    // Direction is blended into a smoothed unit vector (snappy but stable).
    // Speed is an EMA so the oval doesn't snap back to a circle instantly.
    if (lastPosRef.current) {
      const { cx: lcx, cy: lcy } = lastPosRef.current;
      const dvx      = cx - lcx;
      const dvy      = cy - lcy;
      const rawSpeed = Math.sqrt(dvx * dvx + dvy * dvy);
      speedRef.current = speedRef.current * 0.35 + rawSpeed * 0.65;
      if (rawSpeed > 0.5) {
        const alpha = 0.65; // higher = snappier direction tracking
        const rawNx = dvx / rawSpeed;
        const rawNy = dvy / rawSpeed;
        const bx    = alpha * rawNx + (1 - alpha) * velRef.current.nx;
        const by_   = alpha * rawNy + (1 - alpha) * velRef.current.ny;
        const blen  = Math.sqrt(bx * bx + by_ * by_) || 1;
        velRef.current = { nx: bx / blen, ny: by_ / blen };
      }
    }
    const { nx: nvx, ny: nvy } = velRef.current;

    // ── Coin-shaped capsule brush ─────────────────────────────────────────
    // Shape: stadium / pill — two semicircular caps joined by a straight band.
    //   coinR = radius of the rounded caps (coin half-width)
    //   coinH = half-length of the straight centre section
    // At rest (t=0): coinH=0 → pure circle (coin lying flat).
    // Moving (t→1): coinH grows while coinR shrinks → long pill, flat sides,
    //               curved ends — exactly like a coin dragged across a scratcher.
    const t     = Math.min(speedRef.current / MAX_SPEED, 1);
    const coinR = 9 - 3 * t;                         // 9px → 6px (coin edge)
    const coinH = brushRadius * 1.1 * t;             // 0px → ~24px
    const coinR2 = coinR * coinR;
    // Trail offset: shift the capsule centre back so the front cap sits at the
    // pointer, like a coin whose leading edge is under your finger.
    // At rest (coinH=0) this is zero, so the resting circle stays centred.
    const offX = nvx * coinH;
    const offY = nvy * coinH;

    // ── Stamp one oriented capsule at canvas position (scx, scy) ──────────
    const stampAt = (scx, scy) => {
      const halfExtent = coinR + coinH; // max reach along motion axis
      const bx0 = Math.max(0,              Math.floor((scx - halfExtent) / BLOCK_W));
      const by0 = Math.max(0,              Math.floor((scy - halfExtent) / BLOCK_H));
      const bx1 = Math.min(BLOCK_COLS - 1, Math.ceil( (scx + halfExtent) / BLOCK_W));
      const by1 = Math.min(BLOCK_ROWS - 1, Math.ceil( (scy + halfExtent) / BLOCK_H));

      for (let by = by0; by <= by1; by++) {
        for (let bx = bx0; bx <= bx1; bx++) {
          // Jitter block centre for organic, ragged edges
          const j  = BLOCK_JITTER[by * BLOCK_COLS + bx];
          const px = (bx + 0.5) * BLOCK_W - scx + j.dx * 1.2;
          const py = (by + 0.5) * BLOCK_H - scy + j.dy * 1.2;

          // Rotate into motion-aligned frame
          const along = px *  nvx + py * nvy;
          const perp  = px * -nvy + py * nvx;

          // Capsule test: clamp along to the straight section, then check radius
          const ca = Math.max(-coinH, Math.min(coinH, along));
          const da = along - ca;
          if (da * da + perp * perp <= coinR2) {
            scratchBlock(bx, by);
          }
        }
      }
    };

    // ── Interpolate stamps along the stroke ───────────────────────────────
    // Step = coinR × 0.55 — snug enough in the narrow axis to leave no gaps.
    if (lastPosRef.current) {
      const { cx: lcx, cy: lcy } = lastPosRef.current;
      const dist     = Math.sqrt((cx - lcx) ** 2 + (cy - lcy) ** 2);
      const stepSize = Math.max(coinR * 0.55, 2);
      const steps    = Math.max(1, Math.ceil(dist / stepSize));
      for (let s = 1; s <= steps; s++) {
        const ix = lcx + (cx - lcx) * (s / steps);
        const iy = lcy + (cy - lcy) * (s / steps);
        stampAt(ix - offX, iy - offY);
      }
    } else {
      stampAt(cx - offX, cy - offY);
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
    const onUp    = ()  => { pointerDown.current = false; lastPosRef.current = null; speedRef.current = 0; };
    const onTMove = (e) => {
      if (!pointerDown.current) return;
      e.preventDefault();
      scratchAt(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTEnd  = () => { pointerDown.current = false; lastPosRef.current = null; speedRef.current = 0; };

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

  // ── Spacebar: instantly clear hotspots of all LOSING cells ───────────────
  const autoRevealLosers = useCallback(() => {
    if (revealedRef.current || dealingRef.current || completed) return;
    const sc = scratchedRef.current;
    if (!sc) return;

    cells.forEach((cell, i) => {
      if (cell.isMatch) return; // winning cells must be scratched manually
      const fc = formCells[i];
      if (!fc) return;
      const { x0, y0, x1, y1 } = hotspotBlocks(fc);
      for (let by = y0; by <= y1; by++)
        for (let bx = x0; bx <= x1; bx++) {
          const idx = by * BLOCK_COLS + bx;
          if (!sc[idx]) { sc[idx] = 1; scratchedCountRef.current++; }
        }
    });

    checkCoverage();
  }, [cells, formCells, completed, checkCoverage]);

  // ── Hot Dog: auto-scratch every hotspot spread over ~1 second ────────────
  const autoRevealAll = useCallback(() => {
    if (revealedRef.current || dealingRef.current || completed) return;
    const sc = scratchedRef.current;
    if (!sc) return;
    const stepMs = Math.max(80, Math.floor(1000 / (formCells.length || 1)));
    formCells.forEach((fc, i) => {
      setTimeout(() => {
        const { x0, y0, x1, y1 } = hotspotBlocks(fc);
        for (let by = y0; by <= y1; by++)
          for (let bx = x0; bx <= x1; bx++) {
            const idx = by * BLOCK_COLS + bx;
            if (!sc[idx]) { sc[idx] = 1; scratchedCountRef.current++; }
          }
        checkCoverage();
      }, i * stepMs);
    });
  }, [formCells, completed, checkCoverage]);

  useEffect(() => {
    if (hotDogTrigger > 0) autoRevealAll();
  }, [hotDogTrigger, autoRevealAll]);

  // ── Row sweep: left-to-right wipe with organic timing, jagged edge, debris ─
  // Used by both the arrow buttons and the Space keyboard shortcut.
  // No secondary reveal path — cells are uncovered solely by the wipe passing over.
  const scratchRowBlocks = useCallback((by0, by1, durationMs = 400) => {
    if (revealedRef.current || dealingRef.current) return;
    if (!scratchStart.current) scratchStart.current = Date.now();
    const startTime = performance.now();

    // Per-row leading edge: lets each row's wipe front be slightly ahead or behind,
    // producing the jagged coin-drag look at the visible boundary.
    const rowLeading = new Array(BLOCK_ROWS).fill(-1);

    // Pre-compute 1–2 stutter windows (brief coin-catching hesitations mid-wipe).
    // Defined in absolute ms from start so the pause is frame-rate independent.
    const stutters = [];
    let prevEnd = durationMs * 0.15;
    const numStutters = Math.random() < 0.55 ? 2 : 1;
    for (let i = 0; i < numStutters; i++) {
      const tStart = prevEnd + durationMs * (0.12 + Math.random() * 0.28);
      if (tStart >= durationMs * 0.88) break;
      const tEnd = tStart + 22 + Math.random() * 28; // 22–50 ms pause
      stutters.push({ tStart, tEnd });
      prevEnd = tEnd + durationMs * 0.08;
    }

    // Unique per-wipe phase so jagged pattern is never repeated
    const wipePhase = Math.random() * Math.PI * 2;

    const step = (now) => {
      if (revealedRef.current) return;
      const elapsed = now - startTime;
      const rawT    = Math.min(elapsed / durationMs, 1);

      // Freeze wipe position during a stutter window
      for (const s of stutters) {
        if (elapsed >= s.tStart && elapsed <= s.tEnd) {
          if (rawT < 1) { requestAnimationFrame(step); return; }
        }
      }

      // Ease-in (power > 1): starts ~15% slower, builds to natural pace
      const easedT   = rawT < 1 ? Math.pow(rawT, 1.25) : 1;
      const nominalBx = easedT >= 1 ? BLOCK_COLS : Math.floor(easedT * BLOCK_COLS);

      let anyNew = false;
      for (let by = by0; by <= by1; by++) {
        // Jagged edge: two overlapping sine waves — one static (row-based),
        // one time-evolving (shifts as the wipe moves) — total ±1.6 blocks ≈ ±13 px
        const jag = Math.round(
          Math.sin(by * 1.7 + wipePhase + easedT * Math.PI * 2.5) * 1.0 +
          Math.sin(by * 3.1 + wipePhase * 1.6)                    * 0.6,
        );
        // targetBx never retreats: already-scratched blocks stay visible
        const targetBx = Math.max(rowLeading[by], Math.min(BLOCK_COLS - 1, nominalBx + jag));

        for (let bx = rowLeading[by] + 1; bx <= targetBx; bx++) {
          scratchBlock(bx, by);
        }
        if (targetBx > rowLeading[by]) {
          anyNew = true;
          // Sparse debris particle at the leading edge (latex-fleck effect)
          if (Math.random() < 0.07) {
            particlesRef.current.push({
              x:     targetBx * BLOCK_W + (Math.random() - 0.5) * BLOCK_W,
              y:     by * BLOCK_H + BLOCK_H * 0.5 + (Math.random() - 0.4) * BLOCK_H,
              vx:    (Math.random() - 0.5) * 1.4,
              vy:    0.6 + Math.random() * 1.2,   // drifts downward
              size:  0.5 + Math.random() * 1.0,
              angle: Math.random() * Math.PI,
              color: SILVER_COLORS[Math.floor(Math.random() * SILVER_COLORS.length)],
              born:  Date.now(),
            });
          }
          rowLeading[by] = targetBx;
        }
      }

      if (anyNew) {
        soundScratch?.();
        checkCoverage();
      }

      if (rawT < 1) {
        requestAnimationFrame(step);
      } else {
        // Final pass: guarantee every block in the row is scratched
        // (compensates for stutter time and jag offsets at the right edge)
        for (let by = by0; by <= by1; by++) {
          for (let bx = rowLeading[by] + 1; bx < BLOCK_COLS; bx++) scratchBlock(bx, by);
        }
        checkCoverage();
      }
    };

    requestAnimationFrame(step);
  }, [scratchBlock, checkCoverage, soundScratch]);

  const handleRowClick = useCallback((rowIdx, row) => {
    if (!firstFiredRef.current) {
      firstFiredRef.current = true;
      onFirstToolUse?.();
    }
    setUsedRows(prev => new Set([...prev, rowIdx]));
    scratchRowBlocks(row.by0, row.by1, 400);
  }, [onFirstToolUse, scratchRowBlocks]);

  useImperativeHandle(ref, () => ({
    scratchRowBlocks,
    // Scratch the topmost un-scratched row — used by the Space keyboard shortcut.
    scratchNextRow: () => {
      for (let i = 0; i < rows.length; i++) {
        if (!usedRows.has(i)) { handleRowClick(i, rows[i]); return; }
      }
    },
  }), [scratchRowBlocks, rows, usedRows, handleRowClick]);

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
          // CSS variables drive the ring system and glow in the stylesheet
          '--lucky-color':  isMatching ? '#FFD200'      : palette.numText,
          '--lucky-border': isMatching ? '#FFD200'      : palette.border,
          '--lucky-numBg':  palette.numBg,
          // Inner metallic gradient: lit from top-left, dark at base
          background: isMatching
            ? 'radial-gradient(circle at 38% 30%, #FFD200 0%, #B87A00 45%, #2A1400 100%)'
            : `radial-gradient(circle at 38% 30%, ${lighten(palette.numBg, 52)} 0%, ${palette.numBg} 60%)`,
          color: isMatching ? '#2A1400' : palette.numText,
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
        style={{
          // CSS variables for the ring system, divider lines, and panel border
          '--lucky-accent': palette.accent,
          '--lucky-border': palette.border,
          '--lucky-numBg':  palette.numBg,
          // Panel: numBg base + header-colour radial glow at the top edge
          background: `radial-gradient(ellipse at 50% -10%, ${palette.hdr[1]}38 0%, transparent 60%), ${palette.numBg}`,
          borderColor: palette.border,
        }}
      >
        {renderLuckyNumbers()}
      </div>

      {/* ── Scratch Zone ─────────────────────────── */}
      <div className="scratch-zone">

        {/* Row auto-scratch buttons — flex column where each segment's flex-grow
            equals its block-row span, so heights match the canvas rows exactly
            without relying on percentage resolution of abs-positioned children. */}
        {scratchToolUnlocked && !completed && rows.length > 0 && (
          <div className="row-btn-col">
            {(() => {
              const items = [];
              // Top gap: label area (blocks 0 → rows[0].by0 - 1)
              if (rows[0].by0 > 0) {
                items.push(<div key="g-top" className="row-btn-gap" style={{ flex: `${rows[0].by0} 0 0` }} />);
              }
              rows.forEach((row, i) => {
                const span = row.by1 - row.by0 + 1;
                if (usedRows.has(i)) {
                  items.push(<div key={i} className="row-btn-spacer" style={{ flex: `${span} 0 0` }} />);
                } else {
                  items.push(
                    <button
                      key={i}
                      className="row-scratch-btn"
                      style={{ flex: `${span} 0 0` }}
                      onClick={() => handleRowClick(i, row)}
                      aria-label={`Auto-scratch row ${i + 1}`}
                    >▶</button>
                  );
                }
                // Gap between this row and the next (or bottom gap after last row)
                const nextBy0 = i < rows.length - 1 ? rows[i + 1].by0 : BLOCK_ROWS;
                const gap = nextBy0 - row.by1 - 1;
                if (gap > 0) {
                  items.push(<div key={`g${i}`} className="row-btn-gap" style={{ flex: `${gap} 0 0` }} />);
                }
              });
              return items;
            })()}
          </div>
        )}

        {/* Canvas area — contains art cells + foil canvas, aspect-ratio drives height */}
        <div className="scratch-canvas-area" style={{ cursor: coinCursor }}>
        <div
          className="card-art"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${lighten(palette.numBg, 15)} 0%, ${palette.numBg} 65%)`,
          }}
        >
          <div className="art-cells">
            {cells.map((cell, i) => {
              const fc = formCells[i] || { x: 0, y: 0, w: 0.3, h: 0.3 };
              const isESP      = sessionLuckyNumber !== null && cell.number === sessionLuckyNumber;
              const isESPMatch = isESP && cell.isMatch;
              const isESPMiss  = isESP && !cell.isMatch;
              return (
                <div
                  key={i}
                  className={[
                    'art-cell',
                    completed && cell.isMatch    ? 'match win-revealed' : '',
                    isESP && !completed          ? 'esp-cell'           : '',
                    isESPMatch && completed       ? 'esp-match'          : '',
                    isESPMiss  && completed       ? 'esp-fade'           : '',
                  ].filter(Boolean).join(' ')}
                  style={{
                    left:   `${fc.x * 100}%`,
                    top:    `calc(18px + ${fc.y} * (100% - 18px))`,
                    width:  `${fc.w * 100}%`,
                    height: `calc(${fc.h} * (100% - 18px))`,
                    background: completed && cell.isMatch
                      ? `linear-gradient(135deg, ${palette.numBg}, #251800)`
                      : palette.numBg,
                    borderColor: completed && cell.isMatch ? '#FFD200' : `${palette.border}55`,
                    boxShadow:   completed && cell.isMatch ? '0 0 14px rgba(255,210,0,0.5)' : 'none',
                  }}
                >
                  <span
                    className="art-num"
                    style={{ color: completed && cell.isMatch ? '#FFD200' : palette.numText }}
                  >
                    {String(cell.number).padStart(2, '0')}
                  </span>
                  {completed && cell.isMatch && cell.prize > 0 && (
                    <span className="art-prize">+{cell.prize.toLocaleString()}<span className="coin">🪙</span></span>
                  )}
                  {cell.isMatch && completed && (
                    <span
                      className="art-coin"
                      style={{ animationDelay: `${i * 0.09}s` }}
                      aria-hidden="true"
                    >🪙</span>
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
        </div>{/* /.scratch-canvas-area */}
      </div>

      {/* ── Footer ───────────────────────────────── */}
      <div className="ticket-footer" style={{ background: hdBg }}>
        <span className="ticket-tagline">{theme.tagline}</span>
      </div>
    </div>
  );
});

export default ScratchCard;
