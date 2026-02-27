// ── Shared SVG primitive components ─────────────────────────────────────────

/** Returns SVG polygon points string for a 5-pointed star. */
export function star5(cx, cy, r, r2) {
  r2 = r2 || r * 0.42;
  return Array.from({ length: 10 }, (_, i) => {
    const a = (i * 36 - 90) * Math.PI / 180;
    const d = i % 2 === 0 ? r : r2;
    return `${(cx + d * Math.cos(a)).toFixed(1)},${(cy + d * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

/** Winking star with cartoon face. */
export function WinkingStar({ cx, cy, r = 14, fill = '#FFD700', stroke = '#B8860B' }) {
  return (
    <g>
      <polygon points={star5(cx, cy, r)} fill={fill} stroke={stroke} strokeWidth="1.2" />
      <circle cx={cx - r * 0.22} cy={cy - r * 0.05} r={r * 0.09} fill="#333" />
      <path
        d={`M${cx + r * 0.08},${cy - r * 0.12} Q${cx + r * 0.32},${cy + r * 0.06} ${cx + r * 0.52},${cy - r * 0.12}`}
        stroke="#333" strokeWidth={r * 0.07} fill="none" strokeLinecap="round"
      />
      <ellipse cx={cx - r * 0.38} cy={cy + r * 0.24} rx={r * 0.17} ry={r * 0.10} fill="#FF9999" opacity="0.65" />
      <ellipse cx={cx + r * 0.38} cy={cy + r * 0.24} rx={r * 0.17} ry={r * 0.10} fill="#FF9999" opacity="0.65" />
      <ellipse cx={cx - r * 0.18} cy={cy - r * 0.52} rx={r * 0.20} ry={r * 0.08}
        fill="rgba(255,255,255,0.58)" transform={`rotate(-22,${cx},${cy})`} />
    </g>
  );
}

/** Coin with cartoon face. */
export function FacedCoin({ cx, cy, r = 18, fill = '#FFD700', rim = '#B8860B' }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={rim} strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r * 0.79} fill="none" stroke={rim} strokeWidth="0.8" opacity="0.5" />
      <circle cx={cx - r * 0.25} cy={cy - r * 0.08} r={r * 0.09} fill="#5C3A00" />
      <circle cx={cx + r * 0.25} cy={cy - r * 0.08} r={r * 0.09} fill="#5C3A00" />
      <path
        d={`M${cx - r * 0.28},${cy + r * 0.18} Q${cx},${cy + r * 0.40} ${cx + r * 0.28},${cy + r * 0.18}`}
        stroke="#5C3A00" strokeWidth={r * 0.08} fill="none" strokeLinecap="round"
      />
      <ellipse cx={cx - r * 0.20} cy={cy - r * 0.42} rx={r * 0.22} ry={r * 0.09}
        fill="rgba(255,255,255,0.55)" transform={`rotate(-25,${cx},${cy})`} />
    </g>
  );
}

/** Treasure chest slightly ajar. */
export function TreasureChest({ x, y, w = 44, h = 30 }) {
  const lh = h * 0.40;
  return (
    <g>
      <rect x={x} y={y + lh * 0.55} width={w} height={h - lh * 0.55}
        rx="3" fill="#6B3A00" stroke="#3A1F00" strokeWidth="1.5" />
      <rect x={x} y={y + lh * 0.55 + 5} width={w} height={4} fill="#3A1F00" opacity="0.7" />
      <rect x={x + w * 0.38} y={y + lh * 0.55} width={w * 0.24} height={h - lh * 0.55}
        fill="#3A1F00" opacity="0.4" />
      <g transform={`rotate(-28,${x},${y + lh * 0.55})`}>
        <rect x={x} y={y} width={w} height={lh} rx="4" fill="#8B5000" stroke="#3A1F00" strokeWidth="1.5" />
      </g>
      <ellipse cx={x + w / 2} cy={y + lh * 0.52} rx={w * 0.30} ry={lh * 0.32}
        fill="#FFD700" opacity="0.40" />
      <circle cx={x + w * 0.50} cy={y + lh * 0.44} r={5}   fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
      <circle cx={x + w * 0.68} cy={y + lh * 0.64} r={4}   fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
      <circle cx={x + w * 0.33} cy={y + lh * 0.68} r={4.5} fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
    </g>
  );
}

/** Carnival bunting pennants between two points. */
export function Bunting({ x1, y1, x2, y2, n = 8, colors = ['#FF4444','#FFD700','#4488FF','#44DD44','#FF88FF'] }) {
  const flags = Array.from({ length: n }, (_, i) => {
    const t = i / Math.max(n - 1, 1);
    const cx = x1 + (x2 - x1) * t;
    const cy = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * 6;
    const c = colors[i % colors.length];
    return (
      <polygon key={i}
        points={`${cx - 7},${cy} ${cx + 7},${cy} ${cx},${cy + 14}`}
        fill={c} stroke="rgba(0,0,0,0.22)" strokeWidth="0.5"
      />
    );
  });
  return (
    <g>
      <path d={`M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + 6} ${x2},${y2}`}
        stroke="rgba(255,255,255,0.45)" strokeWidth="1" fill="none" />
      {flags}
    </g>
  );
}

/** Decorative starburst. */
export function Burst({ cx, cy, r1 = 16, r2 = 28, pts = 12, fill = '#FFD700', opacity = 0.65 }) {
  const points = Array.from({ length: pts * 2 }, (_, i) => {
    const a = (i * 180 / pts - 90) * Math.PI / 180;
    const d = i % 2 === 0 ? r2 : r1;
    return `${(cx + d * Math.cos(a)).toFixed(1)},${(cy + d * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return <polygon points={points} fill={fill} opacity={opacity} />;
}

/** Coin stack (side view). */
export function CoinStack({ x, y, count = 4, r = 12, fill = '#FFD700', rim = '#B8860B' }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <g key={i}>
          <ellipse cx={x} cy={y - i * 5} rx={r} ry={r * 0.28} fill={rim} />
          <rect x={x - r} y={y - i * 5 - 4} width={r * 2} height={5} fill={fill} />
          <ellipse cx={x} cy={y - i * 5 - 4} rx={r} ry={r * 0.28} fill={fill} stroke={rim} strokeWidth="0.8" />
        </g>
      ))}
    </g>
  );
}
