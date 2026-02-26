import { useRef, useEffect, useState, useCallback } from 'react';
import './ScratchCard.css';

const SCRATCH_RADIUS = 28;

export default function ScratchCard({ prize, symbols, onRevealed, revealed }) {
  const canvasRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const revealedRef = useRef(false);

  // Draw the silver scratch-off overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Silver gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#b8b8b8');
    gradient.addColorStop(0.3, '#e8e8e8');
    gradient.addColorStop(0.6, '#c0c0c0');
    gradient.addColorStop(1, '#a0a0a0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texture pattern
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let i = 0; i < canvas.width; i += 4) {
      for (let j = 0; j < canvas.height; j += 4) {
        if (Math.random() > 0.5) ctx.fillRect(i, j, 2, 2);
      }
    }

    // "SCRATCH HERE" text
    ctx.fillStyle = 'rgba(80, 80, 80, 0.6)';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);
    revealedRef.current = false;
    setScratchedPercent(0);
  }, [prize]);

  const getPos = useCallback((e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const scratch = useCallback((e) => {
    if (!isScratching || revealedRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e, canvas);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, SCRATCH_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Calculate scratched %
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++;
    }
    const total = canvas.width * canvas.height;
    const pct = transparent / total;
    setScratchedPercent(pct);

    if (pct > 0.6 && !revealedRef.current) {
      revealedRef.current = true;
      // Clear entire canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onRevealed();
    }
  }, [isScratching, getPos, onRevealed]);

  return (
    <div className="scratch-card-wrapper">
      {/* Prize layer underneath */}
      <div
        className="prize-layer"
        style={{ backgroundColor: prize.color }}
      >
        <div className="symbols">
          {symbols.map((sym, i) => (
            <span key={i} className="symbol">{sym}</span>
          ))}
        </div>
        <div className="prize-label">{prize.label}</div>
        {prize.amount > 0 && (
          <div className="prize-amount">+{prize.amount} coins</div>
        )}
      </div>

      {/* Scratch overlay canvas */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          className="scratch-canvas"
          width={280}
          height={160}
          onMouseDown={(e) => { setIsScratching(true); scratch(e); }}
          onMouseMove={scratch}
          onMouseUp={() => setIsScratching(false)}
          onMouseLeave={() => setIsScratching(false)}
          onTouchStart={(e) => { setIsScratching(true); scratch(e); }}
          onTouchMove={scratch}
          onTouchEnd={() => setIsScratching(false)}
        />
      )}

      {!revealed && (
        <div className="scratch-progress">
          <div
            className="scratch-progress-bar"
            style={{ width: `${Math.min(scratchedPercent * 100 / 60 * 100, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
