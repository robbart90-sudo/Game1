import { useRef, useEffect, useCallback, useState } from 'react';
import Sparkles from './Sparkles';
import './ScratchCard.css';

const CW = 320;
const CH = 190;
const BASE_BRUSH_R       = 35;   // 22 × 1.6 ≈ 35 — 60% increase
const WIN_CELL_THRESHOLD  = 0.50; // winning cells: must scratch 50%
const LOSS_CELL_THRESHOLD = 0.05; // losing cells: 5% is enough
const CARD_COMPLETE_AT    = 0.95;
const CHECK_EVERY         = 5;

function lighten(hex, amt) {
  try {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (n >> 16) + amt);
    const g = Math.min(255, ((n >> 8) & 0xff) + amt);
    const b = Math.min(255, (n & 0xff) + amt);
    return `rgb(${r},${g},${b})`;
  } catch { return hex; }
}

function cellPixelBox(cell) {
  return {
    px: Math.floor(cell.x * CW),
    py: Math.floor(cell.y * CH),
    pw: Math.ceil(cell.w * CW),
    ph: Math.ceil(cell.h * CH),
  };
}

function cellCoverage(mCtx, cell) {
  const { px, py, pw, ph } = cellPixelBox(cell);
  if (pw <= 0 || ph <= 0) return 0;
  const data = mCtx.getImageData(px, py, pw, ph).data;
  let cleared = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 64) cleared++;
  }
  return cleared / (pw * ph);
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

  const displayRef   = useRef(null);
  const maskRef      = useRef(null);
  const animRef      = useRef(null);
  const pointerDown  = useRef(false);
  const scratchCount = useRef(0);
  const scratchStart = useRef(null);
  const revealedRef  = useRef(false);
  const particlesRef   = useRef([]);
  const lastScratchRef = useRef(null); // tracks last brush pos for edge glow
  const dealingRef     = useRef(true);

  const [sparkles,   setSparkles]   = useState(false);
  const [isDealing,  setIsDealing]  = useState(true);
  const [completed,  setCompleted]  = useState(false); // triggers match-flash on lucky nums

  // ---------- sparkles + deal animation ----------
  useEffect(() => {
    setSparkles(true);
    setIsDealing(true);
    setCompleted(false);
    dealingRef.current  = true;
    revealedRef.current = false;
    particlesRef.current = [];
    const t1 = setTimeout(() => setSparkles(false), 1200);
    const t2 = setTimeout(() => { setIsDealing(false); dealingRef.current = false; }, 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [cardData]);

  // ---------- canvas render loop ----------
  useEffect(() => {
    if (!maskRef.current) maskRef.current = document.createElement('canvas');
    const mask = maskRef.current;
    mask.width  = CW;
    mask.height = CH;
    const mCtx = mask.getContext('2d');
    mCtx.clearRect(0, 0, CW, CH);
    mCtx.fillStyle = '#fff';
    mCtx.fillRect(0, 0, CW, CH);

    scratchCount.current   = 0;
    scratchStart.current   = null;
    revealedRef.current    = false;
    particlesRef.current   = [];
    lastScratchRef.current = null;

    let hue = 0;

    const render = (ts) => {
      const canvas = displayRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, CW, CH);

      // Layer 1: Warm cream card-stock base (shows through metallic as warm tint)
      ctx.fillStyle = 'rgba(255,252,235,0.22)';
      ctx.fillRect(0, 0, CW, CH);

      // Layer 2: Metallic base
      const grad = ctx.createLinearGradient(0, 0, CW, CH);
      grad.addColorStop(0,    lighten(palette.scratch, 60));
      grad.addColorStop(0.2,  lighten(palette.scratch, 90));
      grad.addColorStop(0.45, lighten(palette.scratch, 45));
      grad.addColorStop(0.7,  lighten(palette.scratch, 80));
      grad.addColorStop(1,    lighten(palette.scratch, 35));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CW, CH);

      // Layer 3a: Iridescent HSL cycling layer — vivid, cartoonishly shiny
      hue = (hue + 0.6) % 360;
      const iriGrad = ctx.createLinearGradient(0, 0, CW, CH);
      iriGrad.addColorStop(0,    `hsla(${hue},       95%, 65%, 0.13)`);
      iriGrad.addColorStop(0.25, `hsla(${hue + 60},  95%, 65%, 0.19)`);
      iriGrad.addColorStop(0.5,  `hsla(${hue + 140}, 95%, 65%, 0.14)`);
      iriGrad.addColorStop(0.75, `hsla(${hue + 220}, 95%, 65%, 0.20)`);
      iriGrad.addColorStop(1,    `hsla(${hue + 300}, 95%, 65%, 0.13)`);
      ctx.fillStyle = iriGrad;
      ctx.fillRect(0, 0, CW, CH);

      // Layer 3b: Specular highlight — moves OPPOSITE direction to main shimmer
      const sp2 = (1.6 - (ts * 0.00035) % 1.6) * CW;
      const spec = ctx.createLinearGradient(sp2 - 80, 0, sp2 + 80, 0);
      spec.addColorStop(0,    'rgba(255,255,255,0)');
      spec.addColorStop(0.35, 'rgba(255,255,255,0.06)');
      spec.addColorStop(0.5,  'rgba(255,255,255,0.18)');
      spec.addColorStop(0.65, 'rgba(255,255,255,0.06)');
      spec.addColorStop(1,    'rgba(255,255,255,0)');
      ctx.fillStyle = spec;
      ctx.fillRect(0, 0, CW, CH);

      // Diagonal grain
      ctx.strokeStyle = 'rgba(255,255,255,0.055)';
      ctx.lineWidth   = 1;
      for (let x = -CH; x < CW + CH; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + CH, CH);
        ctx.stroke();
      }

      // Moving shimmer stripe
      const sp = ((ts * 0.00035) % 1.6 - 0.3) * CW;
      const shim = ctx.createLinearGradient(sp - 110, 0, sp + 110, 0);
      shim.addColorStop(0,    'rgba(255,255,255,0)');
      shim.addColorStop(0.25, 'rgba(255,255,255,0.07)');
      shim.addColorStop(0.5,  'rgba(255,255,255,0.28)');
      shim.addColorStop(0.75, 'rgba(255,255,255,0.07)');
      shim.addColorStop(1,    'rgba(255,255,255,0)');
      ctx.fillStyle = shim;
      ctx.fillRect(0, 0, CW, CH);

      // Hint text
      ctx.fillStyle    = 'rgba(0,0,0,0.25)';
      ctx.font         = 'bold 12px Arial';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦  SCRATCH TO REVEAL  ✦', CW / 2, CH / 2);

      // Silver debris particles
      const now = Date.now();
      particlesRef.current = particlesRef.current.filter(p => now - p.born < 700);
      for (const p of particlesRef.current) {
        const age = (now - p.born) / 700;
        ctx.globalAlpha = (1 - age) * 0.8;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.ellipse(
          p.x + p.vx * age * 18,
          p.y + p.vy * age * 18,
          p.size, p.size * 0.5, p.angle, 0, Math.PI * 2
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Apply mask
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(maskRef.current, 0, 0);
      ctx.globalCompositeOperation = 'source-over';

      // Scratch-edge glow: bright ring at boundary of last brush stroke
      if (lastScratchRef.current) {
        const { ex, ey } = lastScratchRef.current;
        ctx.globalCompositeOperation = 'source-atop';
        const eg = ctx.createRadialGradient(ex, ey, BASE_BRUSH_R * 0.7, ex, ey, BASE_BRUSH_R * 1.8);
        eg.addColorStop(0,   'rgba(255,255,255,0)');
        eg.addColorStop(0.7, 'rgba(255,255,255,0.28)');
        eg.addColorStop(1,   'rgba(255,255,255,0)');
        ctx.fillStyle = eg;
        ctx.fillRect(ex - BASE_BRUSH_R * 2, ey - BASE_BRUSH_R * 2, BASE_BRUSH_R * 4, BASE_BRUSH_R * 4);
        ctx.globalCompositeOperation = 'source-over';
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [cardData, palette.scratch]);

  // ---------- spray brush ----------
  const scratchAt = useCallback((clientX, clientY) => {
    if (revealedRef.current || dealingRef.current) return;
    const canvas = displayRef.current;
    const mask   = maskRef.current;
    if (!canvas || !mask) return;

    if (!scratchStart.current) scratchStart.current = Date.now();
    soundScratch?.();

    const rect = canvas.getBoundingClientRect();
    const sx = CW / rect.width;
    const sy = CH / rect.height;
    const x  = (clientX - rect.left) * sx;
    const y  = (clientY - rect.top)  * sy;

    lastScratchRef.current = { ex: x, ey: y };

    const mCtx = mask.getContext('2d');
    mCtx.globalCompositeOperation = 'destination-out';
    const BR = brushRadius;
    for (let i = 0; i < 8; i++) {
      const angle  = Math.random() * Math.PI * 2;
      const radius = Math.random() * BR;
      const sx2    = x + Math.cos(angle) * radius * 0.5;
      const sy2    = y + Math.sin(angle) * radius * 0.5;
      const r      = BR * (0.4 + Math.random() * 0.6);
      const rg = mCtx.createRadialGradient(sx2, sy2, 0, sx2, sy2, r);
      rg.addColorStop(0,   'rgba(0,0,0,1)');
      rg.addColorStop(0.5, 'rgba(0,0,0,0.85)');
      rg.addColorStop(1,   'rgba(0,0,0,0)');
      mCtx.fillStyle = rg;
      mCtx.fillRect(sx2 - r, sy2 - r, r * 2, r * 2);
    }
    mCtx.globalCompositeOperation = 'source-over';

    // Silver debris particles
    const silverColors = ['#e8e8e8','#c0c0c0','#d4d4d4','#f0f0f0','#aaaaaa'];
    for (let i = 0; i < 4 + Math.floor(Math.random() * 5); i++) {
      particlesRef.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 1 + Math.random() * 2.5,
        angle: Math.random() * Math.PI,
        color: silverColors[Math.floor(Math.random() * silverColors.length)],
        born: Date.now(),
      });
    }

    // Per-cell coverage check with different thresholds for win/loss cells
    scratchCount.current++;
    if (scratchCount.current % CHECK_EVERY === 0 && formCells.length > 0) {
      let revealedCells = 0;
      cells.forEach((cell, i) => {
        const fc = formCells[i];
        if (!fc) return;
        const threshold = cell.isMatch ? WIN_CELL_THRESHOLD : LOSS_CELL_THRESHOLD;
        if (cellCoverage(mCtx, fc) >= threshold) revealedCells++;
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
    }
  }, [cells, formCells, onComplete, soundScratch, brushRadius]);

  // Non-passive touchmove
  useEffect(() => {
    const canvas = displayRef.current;
    if (!canvas) return;
    const onTM = (e) => {
      if (!pointerDown.current) return;
      e.preventDefault();
      scratchAt(e.touches[0].clientX, e.touches[0].clientY);
    };
    canvas.addEventListener('touchmove', onTM, { passive: false });
    return () => canvas.removeEventListener('touchmove', onTM);
  }, [scratchAt]);

  // Spacebar: instantly reveal all LOSING cells, winning cells still need manual scratch
  const autoRevealLosers = useCallback(() => {
    if (revealedRef.current || dealingRef.current || completed) return;
    const mask = maskRef.current;
    if (!mask) return;
    const mCtx = mask.getContext('2d');

    mCtx.globalCompositeOperation = 'destination-out';
    cells.forEach((cell, i) => {
      if (cell.isMatch) return; // skip winning cells
      const fc = formCells[i];
      if (!fc) return;
      // Fill entire cell region with transparency
      mCtx.fillStyle = 'rgba(0,0,0,1)';
      mCtx.fillRect(fc.x * CW, fc.y * CH, fc.w * CW, fc.h * CH);
    });
    mCtx.globalCompositeOperation = 'source-over';

    // Check completion
    let revealedCount = 0;
    cells.forEach((cell, i) => {
      const fc = formCells[i];
      if (!fc) return;
      if (!cell.isMatch) {
        revealedCount++; // auto-revealed above
      } else {
        if (cellCoverage(mCtx, fc) >= WIN_CELL_THRESHOLD) revealedCount++;
      }
    });
    if (revealedCount / formCells.length >= CARD_COMPLETE_AT) {
      revealedRef.current = true;
      setCompleted(true);
      cancelAnimationFrame(animRef.current);
      onComplete(scratchStart.current ? (Date.now() - scratchStart.current) / 1000 : null);
    }
  }, [cells, formCells, completed, onComplete]);

  // Keyboard: spacebar triggers auto-reveal of losing cells
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

  const onMD = (e) => { pointerDown.current = true;  scratchAt(e.clientX, e.clientY); };
  const onMM = (e) => { if (pointerDown.current) scratchAt(e.clientX, e.clientY); };
  const onMU = ()  => { pointerDown.current = false; };
  const onTS = (e) => { pointerDown.current = true;  scratchAt(e.touches[0].clientX, e.touches[0].clientY); };
  const onTE = ()  => { pointerDown.current = false; };

  const hdBg   = `linear-gradient(135deg, ${palette.hdr[0]}, ${palette.hdr[1]}, ${palette.hdr[2]})`;
  const cardBg = `linear-gradient(170deg, ${palette.bg[0]}, ${palette.bg[1]})`;

  // ── Lucky number rendering ───────────────────────────────────────────────
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
      <div className="ticket-header" style={{ background: hdBg }}>
        <div className="ticket-price-badge">{theme.price}🪙</div>
        <div className="ticket-title-block">
          <span className="ticket-emoji">{theme.emoji}</span>
          <span className="ticket-name">{theme.name}</span>
        </div>
        <div className="ticket-top-prize">TOP PRIZE: {theme.topPrize}</div>
      </div>

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
                    top:    `calc(18px + ${fc.y * 100}%)`,
                    width:  `${fc.w * 100}%`,
                    height: `${fc.h * 85}%`,
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
            onMouseDown={onMD}
            onMouseMove={onMM}
            onMouseUp={onMU}
            onMouseLeave={onMU}
            onTouchStart={onTS}
            onTouchEnd={onTE}
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
