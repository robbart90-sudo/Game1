import { useRef, useEffect, useCallback } from 'react';
import './ScratchCell.css';

const RADIUS = 20;
const REVEAL_AT = 0.45;

function hexLighten(hex, amt) {
  try {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (n >> 16) + amt);
    const g = Math.min(255, ((n >> 8) & 0xff) + amt);
    const b = Math.min(255, (n & 0xff) + amt);
    return `rgb(${r},${g},${b})`;
  } catch { return hex; }
}

export default function ScratchCell({ cell, palette, index, onScratched }) {
  const canvasRef = useRef(null);
  const pointerDown = useRef(false);
  const done = useRef(cell.scratched);

  // Draw the scratch overlay
  useEffect(() => {
    if (cell.scratched) return;
    done.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width: w, height: h } = canvas;

    // Metallic gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0,   hexLighten(palette.scratch, 35));
    grad.addColorStop(0.4, hexLighten(palette.scratch, 55));
    grad.addColorStop(0.7, hexLighten(palette.scratch, 25));
    grad.addColorStop(1,   palette.scratch);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle noise
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for (let x = 0; x < w; x += 3) {
      for (let y = 0; y < h; y += 3) {
        if (Math.random() > 0.55) ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    // Horizontal sheen stripe
    const sheen = ctx.createLinearGradient(0, h * 0.35, 0, h * 0.55);
    sheen.addColorStop(0,   'rgba(255,255,255,0)');
    sheen.addColorStop(0.5, 'rgba(255,255,255,0.18)');
    sheen.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = 'bold 9px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ SCRATCH ✦', w / 2, h / 2);
  }, [cell.scratched, palette.scratch]);

  // Attach non-passive touchmove to allow preventDefault
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || cell.scratched) return;
    const handler = (e) => {
      if (!pointerDown.current || done.current) return;
      e.preventDefault();
      scratchAt(e.touches[0].clientX, e.touches[0].clientY);
    };
    canvas.addEventListener('touchmove', handler, { passive: false });
    return () => canvas.removeEventListener('touchmove', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.scratched]);

  const scratchAt = useCallback((clientX, clientY) => {
    if (done.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width  / rect.width;
    const sy = canvas.height / rect.height;
    const x  = (clientX - rect.left) * sx;
    const y  = (clientY - rect.top)  * sy;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Coverage check
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] < 128) cleared++;
    if (cleared / (canvas.width * canvas.height) >= REVEAL_AT) {
      done.current = true;
      onScratched(index);
    }
  }, [index, onScratched]);

  const onMouseDown  = (e) => { pointerDown.current = true;  scratchAt(e.clientX, e.clientY); };
  const onMouseMove  = (e) => { if (pointerDown.current) scratchAt(e.clientX, e.clientY); };
  const onMouseUp    = ()  => { pointerDown.current = false; };
  const onTouchStart = (e) => { pointerDown.current = true;  scratchAt(e.touches[0].clientX, e.touches[0].clientY); };
  const onTouchEnd   = ()  => { pointerDown.current = false; };

  const isWin = cell.isMatch;

  return (
    <div
      className={`sc-cell ${cell.scratched ? 'revealed' : ''} ${cell.scratched && isWin ? 'win' : ''}`}
      style={{
        background: palette.numBg,
        borderColor: cell.scratched && isWin ? '#00FF88' : `${palette.border}66`,
        boxShadow: cell.scratched && isWin ? `0 0 12px rgba(0,255,136,0.5)` : 'none',
      }}
    >
      <div className="sc-cell-content">
        <span className="sc-num" style={{ color: isWin ? '#00FF88' : palette.numText }}>{cell.number}</span>
        {isWin && cell.prize > 0 && (
          <span className="sc-prize">+{cell.prize.toLocaleString()}🪙</span>
        )}
      </div>

      {!cell.scratched && (
        <canvas
          ref={canvasRef}
          className="sc-canvas"
          width={92}
          height={64}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />
      )}
    </div>
  );
}
