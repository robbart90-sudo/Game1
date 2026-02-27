import { useRef, useEffect, useCallback, useState } from 'react';
import Sparkles from './Sparkles';
import './ScratchCard.css';

const CW = 320;   // canvas internal width
const CH = 190;   // canvas internal height
const BRUSH_R = 30;
const REVEAL_AT = 0.85;
const CHECK_EVERY = 6; // pixel-check every N scratch events

// Lighten a #rrggbb hex by `amt`
function lighten(hex, amt) {
  try {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (n >> 16) + amt);
    const g = Math.min(255, ((n >> 8) & 0xff) + amt);
    const b = Math.min(255, (n & 0xff) + amt);
    return `rgb(${r},${g},${b})`;
  } catch { return hex; }
}

export default function ScratchCard({ cardData, onRevealed, revealed, soundScratch }) {
  const { theme, luckyNumbers, cells } = cardData;
  const { palette } = theme;

  const displayRef   = useRef(null);
  const maskRef      = useRef(null);   // off-DOM canvas used as mask
  const animRef      = useRef(null);
  const pointerDown  = useRef(false);
  const scratchCount = useRef(0);
  const scratchStart = useRef(null);
  const [sparkles, setSparkles] = useState(false);

  // ---------- initialise sparkles on mount ----------
  useEffect(() => {
    setSparkles(true);
    const t = setTimeout(() => setSparkles(false), 1200);
    return () => clearTimeout(t);
  }, [cardData]);

  // ---------- setup canvases ----------
  useEffect(() => {
    if (revealed) return;

    // Build (or reset) the off-DOM mask canvas
    if (!maskRef.current) maskRef.current = document.createElement('canvas');
    const mask = maskRef.current;
    mask.width  = CW;
    mask.height = CH;
    const mCtx = mask.getContext('2d');
    mCtx.clearRect(0, 0, CW, CH);
    mCtx.fillStyle = '#fff';
    mCtx.fillRect(0, 0, CW, CH);

    scratchCount.current = 0;
    scratchStart.current = null;

    // Animated render loop
    const render = (ts) => {
      const canvas = displayRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, CW, CH);

      // ── Metallic gradient base ──────────────────────
      const grad = ctx.createLinearGradient(0, 0, CW, CH);
      grad.addColorStop(0,    lighten(palette.scratch, 55));
      grad.addColorStop(0.2,  lighten(palette.scratch, 80));
      grad.addColorStop(0.45, lighten(palette.scratch, 40));
      grad.addColorStop(0.7,  lighten(palette.scratch, 70));
      grad.addColorStop(1,    lighten(palette.scratch, 30));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CW, CH);

      // ── Diagonal grain lines ──────────────────────
      ctx.strokeStyle = 'rgba(255,255,255,0.055)';
      ctx.lineWidth   = 1;
      for (let x = -CH; x < CW + CH; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + CH, CH);
        ctx.stroke();
      }

      // ── Moving shimmer stripe ─────────────────────
      const sp = ((ts * 0.00035) % 1.6 - 0.3) * CW;
      const shim = ctx.createLinearGradient(sp - 110, 0, sp + 110, 0);
      shim.addColorStop(0,    'rgba(255,255,255,0)');
      shim.addColorStop(0.25, 'rgba(255,255,255,0.07)');
      shim.addColorStop(0.5,  'rgba(255,255,255,0.26)');
      shim.addColorStop(0.75, 'rgba(255,255,255,0.07)');
      shim.addColorStop(1,    'rgba(255,255,255,0)');
      ctx.fillStyle = shim;
      ctx.fillRect(0, 0, CW, CH);

      // ── "Scratch to reveal" hint ──────────────────
      ctx.fillStyle   = 'rgba(0,0,0,0.22)';
      ctx.font        = `bold 13px Arial`;
      ctx.textAlign   = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦  SCRATCH TO REVEAL  ✦', CW / 2, CH / 2);

      // ── Apply mask (destination-in keeps only opaque pixels from mask) ──
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(mask, 0, 0);
      ctx.globalCompositeOperation = 'source-over';

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [cardData, revealed, palette.scratch]);

  // ---------- scratch logic ----------
  const scratchAt = useCallback((clientX, clientY) => {
    if (revealed) return;
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

    // Erase on mask with soft radial gradient
    const mCtx = mask.getContext('2d');
    mCtx.globalCompositeOperation = 'destination-out';
    const rg = mCtx.createRadialGradient(x, y, 0, x, y, BRUSH_R);
    rg.addColorStop(0,   'rgba(0,0,0,1)');
    rg.addColorStop(0.55,'rgba(0,0,0,0.9)');
    rg.addColorStop(1,   'rgba(0,0,0,0)');
    mCtx.fillStyle = rg;
    mCtx.fillRect(x - BRUSH_R, y - BRUSH_R, BRUSH_R * 2, BRUSH_R * 2);
    mCtx.globalCompositeOperation = 'source-over';

    scratchCount.current++;
    if (scratchCount.current % CHECK_EVERY === 0) {
      const data = mCtx.getImageData(0, 0, CW, CH).data;
      let cleared = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] < 64) cleared++;
      if (cleared / (CW * CH) >= REVEAL_AT) {
        cancelAnimationFrame(animRef.current);
        const scratchSecs = scratchStart.current
          ? (Date.now() - scratchStart.current) / 1000
          : null;
        onRevealed(scratchSecs);
      }
    }
  }, [revealed, onRevealed, soundScratch]);

  // Non-passive touchmove
  useEffect(() => {
    const canvas = displayRef.current;
    if (!canvas || revealed) return;
    const onTM = (e) => {
      if (!pointerDown.current) return;
      e.preventDefault();
      scratchAt(e.touches[0].clientX, e.touches[0].clientY);
    };
    canvas.addEventListener('touchmove', onTM, { passive: false });
    return () => canvas.removeEventListener('touchmove', onTM);
  }, [scratchAt, revealed]);

  const onMD  = (e) => { pointerDown.current = true;  scratchAt(e.clientX, e.clientY); };
  const onMM  = (e) => { if (pointerDown.current) scratchAt(e.clientX, e.clientY); };
  const onMU  = ()  => { pointerDown.current = false; };
  const onTS  = (e) => { pointerDown.current = true;  scratchAt(e.touches[0].clientX, e.touches[0].clientY); };
  const onTE  = ()  => { pointerDown.current = false; };

  const hdBg   = `linear-gradient(135deg, ${palette.hdr[0]}, ${palette.hdr[1]}, ${palette.hdr[2]})`;
  const cardBg = `linear-gradient(170deg, ${palette.bg[0]}, ${palette.bg[1]})`;

  return (
    <div
      className="ticket"
      style={{ background: cardBg, borderColor: palette.border }}
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

      {/* ── Lucky Numbers (always visible) ───────── */}
      <div className="ticket-lucky" style={{ borderColor: `${palette.border}44` }}>
        <div className="section-label" style={{ color: palette.accent }}>
          LUCKY NUMBERS
        </div>
        <div className="lucky-row">
          {luckyNumbers.map((n, i) => (
            <div
              key={i}
              className="lucky-num"
              style={{
                background: palette.numBg,
                color: palette.numText,
                borderColor: palette.border,
              }}
            >
              {String(n).padStart(2, '0')}
            </div>
          ))}
        </div>
      </div>

      {/* ── Scratch Zone ─────────────────────────── */}
      <div className="scratch-zone">

        {/* Art layer: Your Numbers grid (always present, hidden by canvas) */}
        <div
          className="card-art"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${lighten(palette.numBg, 15)} 0%, ${palette.numBg} 65%)`,
          }}
        >
          <div className="art-label" style={{ color: palette.accent }}>
            YOUR NUMBERS
          </div>
          <div className="art-grid">
            {cells.map((cell, i) => (
              <div
                key={i}
                className={`art-cell ${cell.isMatch ? 'match' : ''}`}
                style={{
                  background: cell.isMatch
                    ? `linear-gradient(135deg, ${palette.numBg}, #0d2810)`
                    : palette.numBg,
                  borderColor: cell.isMatch ? '#00ff88' : `${palette.border}55`,
                  boxShadow: cell.isMatch ? '0 0 14px rgba(0,255,136,0.4)' : 'none',
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
            ))}
          </div>
        </div>

        {/* Scratch canvas overlay */}
        {!revealed && (
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

      {/* ── Footer tagline ───────────────────────── */}
      <div className="ticket-footer" style={{ background: hdBg }}>
        <span className="ticket-tagline">{theme.tagline}</span>
      </div>
    </div>
  );
}
