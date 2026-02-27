// src/utils/illustrations.jsx
// Self-contained SVG illustration scenes for all 120 lottery ticket themes.
// Each IllTXXX component renders a unique vintage-carnival scene.
// Shared helpers are defined inline at the top.
//
// Consumers:
//   import { getIllustration } from './illustrations';
//   const layerFn = getIllustration(theme.id);  // returns (props)=>ReactNode or null

// ── Shared SVG primitive helpers ───────────────────────────────────────────────

/** Returns SVG polygon points string for a 5-pointed star. */
function star5(cx, cy, r, r2) {
  r2 = r2 || r * 0.42;
  return Array.from({ length: 10 }, (_, i) => {
    const a = (i * 36 - 90) * Math.PI / 180;
    const d = i % 2 === 0 ? r : r2;
    return `${(cx + d * Math.cos(a)).toFixed(1)},${(cy + d * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

/** Winking star with cartoon face. */
function WinkingStar({ cx, cy, r = 14, fill = '#FFD700', stroke = '#B8860B' }) {
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
    </g>
  );
}

/** Coin with cartoon face. */
function FacedCoin({ cx, cy, r = 18, fill = '#FFD700', rim = '#B8860B' }) {
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
    </g>
  );
}

/** Treasure chest slightly ajar. */
function TreasureChest({ x, y, w = 44, h = 30 }) {
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
      <circle cx={x + w * 0.50} cy={y + lh * 0.44} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
      <circle cx={x + w * 0.68} cy={y + lh * 0.64} r={4} fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
      <circle cx={x + w * 0.33} cy={y + lh * 0.68} r={4.5} fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
    </g>
  );
}

/** Carnival bunting pennants. */
function Bunting({ x1, y1, x2, y2, n = 8, colors = ['#FF4444','#FFD700','#4488FF','#44DD44','#FF88FF'] }) {
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
function Burst({ cx, cy, r1 = 16, r2 = 28, pts = 12, fill = '#FFD700', opacity = 0.65 }) {
  const points = Array.from({ length: pts * 2 }, (_, i) => {
    const a = (i * 180 / pts - 90) * Math.PI / 180;
    const d = i % 2 === 0 ? r2 : r1;
    return `${(cx + d * Math.cos(a)).toFixed(1)},${(cy + d * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return <polygon points={points} fill={fill} opacity={opacity} />;
}

/** Coin stack (side view). */
function CoinStack({ x, y, count = 4, r = 12, fill = '#FFD700', rim = '#B8860B' }) {
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

// ─── t001: Gold Rush ───────────────────────────────────────────────────────────
export function IllT001({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t001" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#8B6000"/>
          <stop offset="100%" stopColor="#3A2000"/>
        </radialGradient>
        <linearGradient id="lg-t001" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FFFACD"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <filter id="f-t001" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="1" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t001)"/>
      <Burst cx={176} cy={56} r1={30} r2={60} pts={16} fill="#FFD700" opacity="0.18"/>
      <g filter="url(#f-t001)">
        <TreasureChest x={132} y={42} w={88} h={52}/>
        <CoinStack x={54} y={88} count={5} r={11} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={298} y={88} count={5} r={11} fill="#FFD700" rim="#B8860B"/>
        {[60,100,140,212,252,292].map((x,i)=>(
          <circle key={i} cx={x} cy={22+(i%3)*8} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>
        ))}
        <FacedCoin cx={176} cy={36} r={16} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={13} fill="#FFD700" stroke="#B8860B"/>
      <WinkingStar cx={320} cy={22} r={13} fill="#FFD700" stroke="#B8860B"/>
      <text x="176" y="105" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="17"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t001)" opacity="0.58" letterSpacing="1.5">GOLD RUSH</text>
    </svg>
  );
}

// ─── t002: Lucky Clover ────────────────────────────────────────────────────────
export function IllT002({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t002" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#225522"/>
          <stop offset="100%" stopColor="#0A1A0A"/>
        </radialGradient>
        <linearGradient id="lg-t002" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#88FF88"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#88FF88"/>
        </linearGradient>
        <filter id="f-t002" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="2" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t002)"/>
      <g filter="url(#f-t002)">
        {[0,90,180,270].map((a,i)=>(
          <circle key={i} cx={176+26*Math.cos(a*Math.PI/180)} cy={52+26*Math.sin(a*Math.PI/180)} r={22} fill="#44AA44" opacity="0.85"/>
        ))}
        <rect x="173" y="52" width="6" height="36" rx="3" fill="#336633"/>
        <FacedCoin cx={176} cy={52} r={14} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={54} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={298} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        {[80,130,222,272].map((x,i)=>(
          <circle key={i} cx={x} cy={24} r={6} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>
        ))}
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#44FF44" stroke="#228822"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#44FF44" stroke="#228822"/>
      <text x="176" y="105" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="16"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t002)" opacity="0.58" letterSpacing="1.5">LUCKY CLOVER</text>
    </svg>
  );
}

// ─── t003: Big Blue ────────────────────────────────────────────────────────────
export function IllT003({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t003" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1155AA"/>
          <stop offset="100%" stopColor="#040E22"/>
        </radialGradient>
        <linearGradient id="lg-t003" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#66AAFF"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#66AAFF"/>
        </linearGradient>
        <filter id="f-t003" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="3" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t003)"/>
      <Burst cx={176} cy={20} r1={14} r2={28} pts={12} fill="#4488FF" opacity="0.35"/>
      <g filter="url(#f-t003)">
        <circle cx="176" cy="54" r="34" fill="#1A3A88" stroke="#4488FF" strokeWidth="2"/>
        <circle cx="176" cy="54" r="24" fill="#112266" stroke="#3366CC" strokeWidth="1"/>
        <FacedCoin cx={176} cy={54} r={14} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={54} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={298} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        {[70,110,242,282].map((x,i)=>(
          <circle key={i} cx={x} cy={20+(i%2)*14} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>
        ))}
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#4488FF" stroke="#1144AA"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#4488FF" stroke="#1144AA"/>
      <text x="176" y="105" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="17"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t003)" opacity="0.58" letterSpacing="1.5">BIG BLUE</text>
    </svg>
  );
}

// ─── t004: Red Hot ────────────────────────────────────────────────────────────
export function IllT004({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t004" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#CC1100"/>
          <stop offset="100%" stopColor="#440000"/>
        </radialGradient>
        <linearGradient id="lg-t004" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6644"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#FF6644"/>
        </linearGradient>
        <filter id="f-t004" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="4" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t004)"/>
      <g filter="url(#f-t004)">
        {/* Flame shapes */}
        {[-40,-20,0,20,40].map((dx,i)=>(
          <path key={i} d={`M${176+dx},90 Q${176+dx-12},60 ${176+dx},30 Q${176+dx+12},60 ${176+dx+20},90`}
            fill={i%2===0?"#FF4400":"#FF8800"} opacity="0.6"/>
        ))}
        <FacedCoin cx={176} cy={52} r={16} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={54} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={298} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={132} y={70} w={88} h={32}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF4444" stroke="#880000"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF4444" stroke="#880000"/>
      <text x="176" y="105" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="17"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t004)" opacity="0.58" letterSpacing="1.5">RED HOT</text>
    </svg>
  );
}

// ─── t005: Purple Reign ────────────────────────────────────────────────────────
export function IllT005({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t005" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#660099"/>
          <stop offset="100%" stopColor="#1A0033"/>
        </radialGradient>
        <linearGradient id="lg-t005" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#CC88FF"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#CC88FF"/>
        </linearGradient>
        <filter id="f-t005" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="5" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t005)"/>
      <Burst cx={176} cy={54} r1={20} r2={40} pts={14} fill="#8800CC" opacity="0.3"/>
      <g filter="url(#f-t005)">
        {/* Crown */}
        <polygon points="136,68 146,36 162,54 176,28 190,54 206,36 216,68" fill="#8800CC" stroke="#CC44FF" strokeWidth="1.5"/>
        <rect x="132" y="66" width="88" height="12" rx="2" fill="#6600AA" stroke="#CC44FF" strokeWidth="1"/>
        {[162,176,190].map((x,i)=>(
          <circle key={i} cx={x} cy={i===1?28:36} r={5} fill={['#FF4444','#FFD700','#4488FF'][i]}/>
        ))}
        <FacedCoin cx={176} cy={54} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={54} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={298} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#CC88FF" stroke="#660099"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#CC88FF" stroke="#660099"/>
      <text x="176" y="105" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="16"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t005)" opacity="0.58" letterSpacing="1.5">PURPLE REIGN</text>
    </svg>
  );
}

// ─── t006: Silver Screen ──────────────────────────────────────────────────────
export function IllT006({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t006" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#555566"/>
          <stop offset="100%" stopColor="#1A1A22"/>
        </radialGradient>
        <linearGradient id="lg-t006" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#AAAACC"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#AAAACC"/>
        </linearGradient>
        <filter id="f-t006" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="6" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t006)"/>
      <g filter="url(#f-t006)">
        {/* Film strip */}
        <rect x="60" y="28" width="232" height="56" fill="#333344" stroke="#555566" strokeWidth="1.5"/>
        {[72,96,120,144,168,192,216,240,264].map((x,i)=>(
          <rect key={i} x={x} y="22" width="14" height="8" rx="1" fill="#555566"/>
        ))}
        {[72,96,120,144,168,192,216,240,264].map((x,i)=>(
          <rect key={i} x={x} y="82" width="14" height="8" rx="1" fill="#555566"/>
        ))}
        {/* Star on film */}
        <polygon points={star5(176,56,22)} fill="#CCCCDD" stroke="#AAAACC" strokeWidth="1"/>
        <FacedCoin cx={176} cy={56} r={12} fill="#CCCCDD" rim="#AAAACC"/>
        <CoinStack x={24} y={88} count={4} r={9} fill="#BBBBCC" rim="#888899"/>
        <CoinStack x={328} y={88} count={4} r={9} fill="#BBBBCC" rim="#888899"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#CCCCDD" stroke="#555566"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#CCCCDD" stroke="#555566"/>
      <text x="176" y="105" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t006)" opacity="0.58" letterSpacing="1.5">SILVER SCREEN</text>
    </svg>
  );
}

// ─── t007: Orange Crush ───────────────────────────────────────────────────────
export function IllT007({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t007" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#CC5500"/>
          <stop offset="100%" stopColor="#441500"/>
        </radialGradient>
        <linearGradient id="lg-t007" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF8800"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#FF8800"/>
        </linearGradient>
        <filter id="f-t007" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="7" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t007)"/>
      <Bunting x1={0} y1={14} x2={352} y2={14} n={10} colors={['#FF8800','#FFD700','#FF4400','#FFD700','#FF8800']}/>
      <g filter="url(#f-t007)">
        <circle cx="176" cy="52" r="30" fill="#FF6600" stroke="#FF8800" strokeWidth="2"/>
        <circle cx="176" cy="52" r="22" fill="#FF4400" stroke="#FF6600" strokeWidth="1"/>
        <FacedCoin cx={176} cy={52} r={13} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={54} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={298} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
        {[76,118,234,276].map((x,i)=>(
          <circle key={i} cx={x} cy={34} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>
        ))}
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF8800" stroke="#CC5500"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF8800" stroke="#CC5500"/>
      <text x="176" y="105" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="16"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t007)" opacity="0.58" letterSpacing="1.5">ORANGE CRUSH</text>
    </svg>
  );
}

// ─── t008: Pink Flamingo ──────────────────────────────────────────────────────
export function IllT008({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t008" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#CC3388"/>
          <stop offset="100%" stopColor="#44001A"/>
        </radialGradient>
        <linearGradient id="lg-t008" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF88CC"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#FF88CC"/>
        </linearGradient>
        <filter id="f-t008" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="8" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t008)"/>
      <g filter="url(#f-t008)">
        {/* Flamingo silhouette */}
        <ellipse cx="176" cy="62" rx="18" ry="24" fill="#FF6699"/>
        <circle cx="176" cy="36" r="12" fill="#FF6699"/>
        <path d="M176,46 Q168,62 160,68" stroke="#FF6699" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <path d="M176,46 Q184,62 192,58" stroke="#FF6699" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <line x1="170" y1="86" x2="168" y2="104" stroke="#FF4488" strokeWidth="3" strokeLinecap="round"/>
        <line x1="180" y1="86" x2="184" y2="104" stroke="#FF4488" strokeWidth="3" strokeLinecap="round"/>
        <polygon points="176,28 182,34 188,30 184,36" fill="#FF8800"/>
        <FacedCoin cx={220} cy={60} r={12} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={54} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={298} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        {[80,110,242,272].map((x,i)=>(
          <circle key={i} cx={x} cy={24} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>
        ))}
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF88CC" stroke="#CC3388"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF88CC" stroke="#CC3388"/>
      <text x="176" y="105" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t008)" opacity="0.58" letterSpacing="1.5">PINK FLAMINGO</text>
    </svg>
  );
}

// ─── t009: Teal Deal ─────────────────────────────────────────────────────────
export function IllT009({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t009" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#007777"/>
          <stop offset="100%" stopColor="#001A1A"/>
        </radialGradient>
        <linearGradient id="lg-t009" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#44DDDD"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#44DDDD"/>
        </linearGradient>
        <filter id="f-t009" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="9" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t009)"/>
      <Burst cx={176} cy={54} r1={22} r2={44} pts={14} fill="#009999" opacity="0.3"/>
      <g filter="url(#f-t009)">
        {/* Wave pattern */}
        {[0,1,2].map(i=>(
          <path key={i} d={`M0,${44+i*14} Q88,${36+i*14} 176,${44+i*14} Q264,${52+i*14} 352,${44+i*14}`}
            stroke="#00AAAA" strokeWidth="2" fill="none" opacity={0.5-i*0.1}/>
        ))}
        <FacedCoin cx={176} cy={54} r={16} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={86} y={68} w={60} h={34}/>
        <CoinStack x={28} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={324} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#44DDDD" stroke="#007777"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#44DDDD" stroke="#007777"/>
      <text x="176" y="105" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="17"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t009)" opacity="0.58" letterSpacing="1.5">TEAL DEAL</text>
    </svg>
  );
}

// ─── t010: Rainbow Riot ───────────────────────────────────────────────────────
export function IllT010({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t010" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#220055"/>
          <stop offset="100%" stopColor="#080015"/>
        </radialGradient>
        <linearGradient id="lg-t010" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF4444"/>
          <stop offset="25%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#44FF44"/>
          <stop offset="75%" stopColor="#4488FF"/>
          <stop offset="100%" stopColor="#FF44FF"/>
        </linearGradient>
        <filter id="f-t010" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="10" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t010)"/>
      <g filter="url(#f-t010)">
        {['#FF4444','#FF8800','#FFD700','#44DD44','#4488FF','#8844FF'].map((c,i)=>(
          <path key={i} d={`M${30-i*6},112 Q176,${-8+i*16} ${322+i*6},112`}
            stroke={c} strokeWidth="4" fill="none" opacity="0.6"/>
        ))}
        <FacedCoin cx={176} cy={60} r={16} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={54} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={298} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
        <Burst cx={176} cy={22} r1={10} r2={20} pts={10} fill="#FFD700" opacity="0.5"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFD700" stroke="#220055"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFD700" stroke="#220055"/>
      <text x="176" y="105" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="16"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t010)" opacity="0.58" letterSpacing="1.5">RAINBOW RIOT</text>
    </svg>
  );
}

// ─── t011: Crimson Tide ───────────────────────────────────────────────────────
export function IllT011({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t011" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#AA0022"/>
          <stop offset="100%" stopColor="#330006"/>
        </radialGradient>
        <linearGradient id="lg-t011" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF4466"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#FF4466"/>
        </linearGradient>
        <filter id="f-t011" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="11" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t011)"/>
      <g filter="url(#f-t011)">
        {[0,1,2,3].map(i=>(
          <path key={i} d={`M0,${56+i*10} Q88,${44+i*10} 176,${56+i*10} Q264,${68+i*10} 352,${56+i*10}`}
            stroke="#CC1133" strokeWidth="3" fill="none" opacity={0.6-i*0.1}/>
        ))}
        <FacedCoin cx={176} cy={52} r={16} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={106} y={66} w={60} h={34}/>
        <CoinStack x={36} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={316} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF4466" stroke="#AA0022"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF4466" stroke="#AA0022"/>
      <text x="176" y="105" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="16"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t011)" opacity="0.58" letterSpacing="1.5">CRIMSON TIDE</text>
    </svg>
  );
}

// ─── t012: Olive Branch ───────────────────────────────────────────────────────
export function IllT012({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t012" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#556633"/>
          <stop offset="100%" stopColor="#1A2210"/>
        </radialGradient>
        <linearGradient id="lg-t012" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#AABB66"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#AABB66"/>
        </linearGradient>
        <filter id="f-t012" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="12" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t012)"/>
      <g filter="url(#f-t012)">
        {/* Olive branch */}
        <path d="M60,90 Q120,40 176,56 Q232,72 292,30" stroke="#6B7700" strokeWidth="3" fill="none"/>
        {[80,110,140,170,200,230,260].map((x,i)=>(
          <ellipse key={i} cx={x} cy={60+(i%3-1)*16} rx={12} ry={7} fill="#778833" opacity="0.8"
            transform={`rotate(${i%2===0?20:-20},${x},${60+(i%3-1)*16})`}/>
        ))}
        {/* Olives = coins */}
        {[95,155,215,265].map((x,i)=>(
          <circle key={i} cx={x} cy={50+(i%2)*10} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>
        ))}
        <FacedCoin cx={176} cy={56} r={14} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={36} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={316} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#AABB66" stroke="#556633"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#AABB66" stroke="#556633"/>
      <text x="176" y="105" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="16"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t012)" opacity="0.58" letterSpacing="1.5">OLIVE BRANCH</text>
    </svg>
  );
}

// ─── t013: Midnight Navy ─────────────────────────────────────────────────────
export function IllT013({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t013" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#112244"/>
          <stop offset="100%" stopColor="#040810"/>
        </radialGradient>
        <linearGradient id="lg-t013" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4466AA"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#4466AA"/>
        </linearGradient>
        <filter id="f-t013" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="13" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t013)"/>
      {Array.from({length:20},(_,i)=>(
        <circle key={i} cx={(i*53)%352} cy={(i*27)%80} r={i%4===0?1.5:0.7} fill="white" opacity="0.5"/>
      ))}
      <g filter="url(#f-t013)">
        {/* Anchor */}
        <circle cx="176" cy="36" r="10" fill="none" stroke="#4466AA" strokeWidth="3"/>
        <line x1="176" y1="46" x2="176" y2="78" stroke="#4466AA" strokeWidth="3" strokeLinecap="round"/>
        <line x1="155" y1="78" x2="197" y2="78" stroke="#4466AA" strokeWidth="3" strokeLinecap="round"/>
        <path d="M155,78 Q155,68 162,68" stroke="#4466AA" strokeWidth="2.5" fill="none"/>
        <path d="M197,78 Q197,68 190,68" stroke="#4466AA" strokeWidth="2.5" fill="none"/>
        <line x1="165" y1="36" x2="187" y2="36" stroke="#4466AA" strokeWidth="2"/>
        <FacedCoin cx={176} cy={36} r={8} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={54} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={298} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={130} y={68} w={92} h={32}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#4466AA" stroke="#112244"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#4466AA" stroke="#112244"/>
      <text x="176" y="105" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t013)" opacity="0.58" letterSpacing="1.5">MIDNIGHT NAVY</text>
    </svg>
  );
}

// ─── t014: Maroon Moon ────────────────────────────────────────────────────────
export function IllT014({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t014" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#662233"/>
          <stop offset="100%" stopColor="#1A0008"/>
        </radialGradient>
        <linearGradient id="lg-t014" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#CC6688"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#CC6688"/>
        </linearGradient>
        <filter id="f-t014" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="14" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t014)"/>
      {/* Moon */}
      <circle cx="290" cy="24" r="18" fill="#FFEECC" opacity="0.7"/>
      <circle cx="298" cy="18" r="14" fill="#1A0008" opacity="0.9"/>
      <g filter="url(#f-t014)">
        {Array.from({length:16},(_,i)=>(
          <circle key={i} cx={(i*44)%352} cy={(i*23)%90} r={i%3===0?1.2:0.7} fill="white" opacity="0.4"/>
        ))}
        <FacedCoin cx={176} cy={52} r={18} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={92} y={62} w={64} h={38}/>
        <CoinStack x={36} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={316} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        {[70,110,242,282].map((x,i)=>(
          <circle key={i} cx={x} cy={26+(i%2)*14} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>
        ))}
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#CC6688" stroke="#662233"/>
      <text x="176" y="105" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="16"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t014)" opacity="0.58" letterSpacing="1.5">MAROON MOON</text>
    </svg>
  );
}

// ─── t015: Copper Crown ──────────────────────────────────────────────────────
export function IllT015({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t015" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#7A4422"/>
          <stop offset="100%" stopColor="#2A1008"/>
        </radialGradient>
        <linearGradient id="lg-t015" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#CC8855"/>
          <stop offset="50%" stopColor="#FFDDAA"/>
          <stop offset="100%" stopColor="#CC8855"/>
        </linearGradient>
        <filter id="f-t015" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="15" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t015)"/>
      <g filter="url(#f-t015)">
        {/* Ornate copper crown */}
        <polygon points="120,72 140,32 160,52 176,24 192,52 212,32 232,72" fill="#AA6633" stroke="#CC8855" strokeWidth="2"/>
        <rect x="116" y="70" width="120" height="14" rx="2" fill="#884422" stroke="#CC8855" strokeWidth="1.5"/>
        {[160,176,192].map((x,i)=>(
          <circle key={i} cx={x} cy={i===1?24:32} r={6} fill={['#CC8855','#FFD700','#CC6633'][i]}/>
        ))}
        <FacedCoin cx={176} cy={54} r={11} fill="#CC8855" rim="#884422"/>
        <CoinStack x={54} y={88} count={4} r={10} fill="#CC8855" rim="#884422"/>
        <CoinStack x={298} y={88} count={4} r={10} fill="#CC8855" rim="#884422"/>
        <TreasureChest x={114} y={68} w={60} h={34}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#CC8855" stroke="#7A4422"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#CC8855" stroke="#7A4422"/>
      <text x="176" y="105" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t015)" opacity="0.58" letterSpacing="1.5">COPPER CROWN</text>
    </svg>
  );
}

// ─── t016: Fortune Wheel ─────────────────────────────────────────────────────
export function IllT016({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t016" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#882200"/>
          <stop offset="100%" stopColor="#280800"/>
        </radialGradient>
        <linearGradient id="lg-t016" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <filter id="f-t016" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="16" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t016)"/>
      <g filter="url(#f-t016)">
        {/* Spinning wheel */}
        <circle cx="176" cy="56" r="42" fill="#3A1000" stroke="#AA4400" strokeWidth="2"/>
        {Array.from({length:8},(_,i)=>{
          const a=i*45*Math.PI/180;
          return <line key={i} x1="176" y1="56" x2={176+40*Math.cos(a)} y2={56+40*Math.sin(a)} stroke="#AA4400" strokeWidth="2"/>;
        })}
        {Array.from({length:8},(_,i)=>{
          const a=(i*45+22.5)*Math.PI/180;
          const c=['#FF4444','#FFD700','#44AA44','#4488FF','#FF8800','#FF44FF','#44DDDD','#FFFFFF'][i];
          return <ellipse key={i} cx={176+28*Math.cos(a)} cy={56+28*Math.sin(a)} rx="10" ry="6"
            fill={c} opacity="0.8" transform={`rotate(${i*45+22.5},${176+28*Math.cos(a)},${56+28*Math.sin(a)})`}/>;
        })}
        <circle cx="176" cy="56" r="8" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5"/>
        {/* Pointer */}
        <polygon points="176,10 182,22 170,22" fill="#FFD700"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFD700" stroke="#882200"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFD700" stroke="#882200"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t016)" opacity="0.58" letterSpacing="1.5">FORTUNE WHEEL</text>
    </svg>
  );
}

// ─── t017: High Roller ────────────────────────────────────────────────────────
export function IllT017({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t017" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#1A1A2E"/>
          <stop offset="100%" stopColor="#060608"/>
        </radialGradient>
        <linearGradient id="lg-t017" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FFFACD"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <filter id="f-t017" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="17" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t017)"/>
      <g filter="url(#f-t017)">
        {/* Dice */}
        {[[108,30,44],[200,36,38]].map(([x,y,s],i)=>(
          <g key={i}>
            <rect x={x} y={y} width={s} height={s} rx="6" fill={i===0?"#EEEEEE":"#222244"} stroke={i===0?"#AAAAAA":"#4444AA"} strokeWidth="1.5"/>
            {i===0 ?
              [[x+8,y+8],[x+28,y+8],[x+8,y+28],[x+28,y+28],[x+18,y+18]].slice(0,5).map(([dx,dy],j)=>(
                <circle key={j} cx={dx} cy={dy} r={3} fill="#222222"/>
              )) :
              [[x+8,y+8],[x+22,y+22],[x+8,y+22],[x+22,y+8]].map(([dx,dy],j)=>(
                <circle key={j} cx={dx} cy={dy} r={3} fill="white"/>
              ))
            }
          </g>
        ))}
        <FacedCoin cx={176} cy={76} r={14} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFD700" stroke="#1A1A2E"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFD700" stroke="#1A1A2E"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="16"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t017)" opacity="0.58" letterSpacing="1.5">HIGH ROLLER</text>
    </svg>
  );
}

// ─── t018: Cash Cascade ───────────────────────────────────────────────────────
export function IllT018({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t018" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#004422"/>
          <stop offset="100%" stopColor="#000E08"/>
        </radialGradient>
        <linearGradient id="lg-t018" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#44FF88"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#44FF88"/>
        </linearGradient>
        <filter id="f-t018" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="18" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t018)"/>
      <g filter="url(#f-t018)">
        {/* Waterfall of coins */}
        {Array.from({length:14},(_,i)=>(
          <circle key={i} cx={130+(i%5)*20} cy={10+i*8} r={6} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>
        ))}
        {/* Dollar bills */}
        {[[60,50],[290,50],[60,72],[290,72]].map(([x,y],i)=>(
          <rect key={i} x={x-20} y={y-8} width="40" height="16" rx="2" fill="#226633" stroke="#44AA55" strokeWidth="1"/>
        ))}
        <FacedCoin cx={176} cy={70} r={16} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={36} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={316} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#44FF88" stroke="#004422"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#44FF88" stroke="#004422"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t018)" opacity="0.58" letterSpacing="1.5">CASH CASCADE</text>
    </svg>
  );
}

// ─── t019: Mystic Mill ────────────────────────────────────────────────────────
export function IllT019({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t019" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#2A1A44"/>
          <stop offset="100%" stopColor="#0A0818"/>
        </radialGradient>
        <linearGradient id="lg-t019" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#AA88FF"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#AA88FF"/>
        </linearGradient>
        <filter id="f-t019" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="19" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t019)"/>
      <g filter="url(#f-t019)">
        {/* Windmill */}
        <rect x="172" y="34" width="8" height="70" fill="#443366"/>
        {[0,90,180,270].map((a,i)=>(
          <ellipse key={i} cx={176+30*Math.cos(a*Math.PI/180)} cy={40+30*Math.sin(a*Math.PI/180)}
            rx="28" ry="8" fill="#553377" stroke="#8866AA" strokeWidth="1"
            transform={`rotate(${a},${176+30*Math.cos(a*Math.PI/180)},${40+30*Math.sin(a*Math.PI/180)})`}/>
        ))}
        <circle cx="176" cy="40" r="8" fill="#8844CC" stroke="#AA66FF" strokeWidth="1.5"/>
        {/* Magic sparkles = coins */}
        {Array.from({length:8},(_,i)=>{
          const a=i*45*Math.PI/180;
          return <circle key={i} cx={176+48*Math.cos(a)} cy={40+48*Math.sin(a)} r={4} fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" opacity="0.8"/>;
        })}
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={126} y={76} w={100} h={28}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#AA88FF" stroke="#2A1A44"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#AA88FF" stroke="#2A1A44"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="16"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t019)" opacity="0.58" letterSpacing="1.5">MYSTIC MILL</text>
    </svg>
  );
}

// ─── t020: Harvest Moon ───────────────────────────────────────────────────────
export function IllT020({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t020" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#AA5500"/>
          <stop offset="100%" stopColor="#330D00"/>
        </radialGradient>
        <linearGradient id="lg-t020" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFAA44"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#FFAA44"/>
        </linearGradient>
        <filter id="f-t020" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="20" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t020)"/>
      <circle cx="176" cy="28" r="22" fill="#FFAA44" opacity="0.8"/>
      <Burst cx={176} cy={28} r1={22} r2={34} pts={10} fill="#FFAA44" opacity="0.3"/>
      <g filter="url(#f-t020)">
        {/* Wheat stalks */}
        {[50,82,114,238,270,302].map((x,i)=>(
          <g key={i}>
            <line x1={x} y1="112" x2={x} y2="50" stroke="#AA7722" strokeWidth="2.5"/>
            <ellipse cx={x} cy={46} rx={6} ry={16} fill="#CC9933" opacity="0.8" transform={`rotate(${i%2===0?-10:10},${x},46)`}/>
          </g>
        ))}
        {/* Cornucopia */}
        <path d="M136,88 Q176,60 220,88" stroke="#7A4400" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M136,88 Q144,72 152,80" stroke="#7A4400" strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Harvest coins */}
        {[170,186,200,214].map((x,i)=>(
          <circle key={i} cx={x} cy={72+(i%2)*8} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>
        ))}
        <FacedCoin cx={160} cy={78} r={9} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={204} y={74} w={50} h={28}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFAA44" stroke="#AA5500"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFAA44" stroke="#AA5500"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t020)" opacity="0.58" letterSpacing="1.5">HARVEST MOON</text>
    </svg>
  );
}

// ─── t021-t025: Batch ─────────────────────────────────────────────────────────
export function IllT021({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t021" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#AA4400"/>
          <stop offset="100%" stopColor="#330E00"/>
        </radialGradient>
        <linearGradient id="lg-t021" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FFFACD"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <filter id="f-t021" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="21" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t021)"/>
      <Bunting x1={0} y1={14} x2={352} y2={14} n={10} colors={['#FFD700','#FF4400','#FFFFFF','#FF8800','#FFD700']}/>
      <g filter="url(#f-t021)">
        <FacedCoin cx={176} cy={56} r={22} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={54} y={88} count={5} r={11} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={298} y={88} count={5} r={11} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={120} y={72} w={112} h={30}/>
        {[80,120,232,272].map((x,i)=>(
          <circle key={i} cx={x} cy={32} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>
        ))}
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFD700" stroke="#AA4400"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFD700" stroke="#AA4400"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t021)" opacity="0.58" letterSpacing="1.5">BLAZIN BUCKS</text>
    </svg>
  );
}

export function IllT022({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t022" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#005555"/>
          <stop offset="100%" stopColor="#001A1A"/>
        </radialGradient>
        <linearGradient id="lg-t022" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#44FFDD"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#44FFDD"/>
        </linearGradient>
        <filter id="f-t022" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="22" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t022)"/>
      <g filter="url(#f-t022)">
        {/* Compass rose */}
        {[0,45,90,135,180,225,270,315].map((a,i)=>(
          <polygon key={i} points={`176,56 ${176+8*Math.cos((a-15)*Math.PI/180)},${56+8*Math.sin((a-15)*Math.PI/180)} ${176+32*Math.cos(a*Math.PI/180)},${56+32*Math.sin(a*Math.PI/180)} ${176+8*Math.cos((a+15)*Math.PI/180)},${56+8*Math.sin((a+15)*Math.PI/180)}`}
            fill={i%2===0?"#44FFDD":"#007777"} opacity="0.8"/>
        ))}
        <circle cx="176" cy="56" r="8" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5"/>
        <FacedCoin cx={176} cy={56} r={6} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={36} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={316} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={108} y={72} w={136} h={28}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#44FFDD" stroke="#005555"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#44FFDD" stroke="#005555"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t022)" opacity="0.58" letterSpacing="1.5">TRUE NORTH</text>
    </svg>
  );
}

export function IllT023({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t023" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#661100"/>
          <stop offset="100%" stopColor="#1A0400"/>
        </radialGradient>
        <linearGradient id="lg-t023" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF8844"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#FF8844"/>
        </linearGradient>
        <filter id="f-t023" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="23" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t023)"/>
      <g filter="url(#f-t023)">
        {/* Phoenix bird */}
        <path d="M176,80 Q160,50 140,30 Q160,40 176,56 Q192,40 212,30 Q192,50 176,80" fill="#FF4400" opacity="0.8"/>
        <path d="M176,60 Q156,36 130,20 Q152,34 168,52 Q176,44 184,52 Q200,34 222,20 Q196,36 176,60" fill="#FF8800" opacity="0.6"/>
        <circle cx="176" cy="30" r="8" fill="#FFD700" stroke="#FF4400" strokeWidth="1"/>
        {/* Flame coins */}
        {[[140,62],[158,48],[194,48],[212,62]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={5} fill="#FFD700" stroke="#FF4400" strokeWidth="0.8" opacity="0.85"/>
        ))}
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={128} y={74} w={100} h={28}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF8844" stroke="#661100"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF8844" stroke="#661100"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t023)" opacity="0.58" letterSpacing="1.5">PHOENIX FIRE</text>
    </svg>
  );
}

export function IllT024({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t024" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#334400"/>
          <stop offset="100%" stopColor="#0E1200"/>
        </radialGradient>
        <linearGradient id="lg-t024" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#AACC44"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#AACC44"/>
        </linearGradient>
        <filter id="f-t024" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="24" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t024)"/>
      <g filter="url(#f-t024)">
        {/* Bamboo shoots */}
        {[60,100,140,212,252,292].map((x,i)=>(
          <g key={i}>
            <rect x={x-5} y={20} width="10" height="72" rx="4" fill={i%2===0?"#557722":"#669933"}/>
            {[40,60,80].map(y=>(
              <line key={y} x1={x-5} y1={y} x2={x+5} y2={y} stroke="#334400" strokeWidth="1"/>
            ))}
          </g>
        ))}
        <FacedCoin cx={176} cy={56} r={16} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        {[168,184,168,184].map((x,i)=>(
          <circle key={i} cx={x} cy={28+(i*8)} r={4} fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" opacity="0.8"/>
        ))}
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#AACC44" stroke="#334400"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#AACC44" stroke="#334400"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t024)" opacity="0.58" letterSpacing="1.5">BAMBOO GOLD</text>
    </svg>
  );
}

export function IllT025({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t025" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#3344AA"/>
          <stop offset="100%" stopColor="#0A1033"/>
        </radialGradient>
        <linearGradient id="lg-t025" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6688FF"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#6688FF"/>
        </linearGradient>
        <filter id="f-t025" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="25" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t025)"/>
      {Array.from({length:18},(_,i)=>(
        <circle key={i} cx={(i*47)%352} cy={(i*31)%90} r={i%4===0?1.5:0.7} fill="white" opacity="0.5"/>
      ))}
      <g filter="url(#f-t025)">
        {/* Constellation lines */}
        <polygon points="176,22 140,52 156,88 196,88 212,52" fill="none" stroke="#3344AA" strokeWidth="1" opacity="0.6"/>
        {[176,140,156,196,212].map((x,i)=>{
          const y=[22,52,88,88,52][i];
          return <circle key={i} cx={x} cy={y} r={4} fill="#6688FF" stroke="#AABBFF" strokeWidth="1"/>;
        })}
        <FacedCoin cx={176} cy={56} r={14} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={108} y={72} w={136} h={28}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#6688FF" stroke="#3344AA"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#6688FF" stroke="#3344AA"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t025)" opacity="0.58" letterSpacing="1.5">STAR MAP</text>
    </svg>
  );
}

// ─── t026-t040: Medium batch ──────────────────────────────────────────────────

export function IllT026({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t026" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#884400"/><stop offset="100%" stopColor="#281200"/></radialGradient>
        <linearGradient id="lg-t026" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFCC44"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFCC44"/></linearGradient>
        <filter id="f-t026" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="26" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t026)"/>
      <g filter="url(#f-t026)">
        <circle cx="176" cy="50" r="32" fill="#AA5500" stroke="#FFD700" strokeWidth="2"/>
        <text x="176" y="58" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontSize="28" fontWeight="900" fill="#FFD700" opacity="0.9">$</text>
        <CoinStack x={44} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={120} y={72} w={112} h={28}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFCC44" stroke="#884400"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFCC44" stroke="#884400"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t026)" opacity="0.58" letterSpacing="1.5">DOLLAR DAZE</text>
    </svg>
  );
}

export function IllT027({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t027" cx="50%" cy="50%" r="70%"><stop offset="0%" stopColor="#003388"/><stop offset="100%" stopColor="#000A22"/></radialGradient>
        <linearGradient id="lg-t027" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#88CCFF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#88CCFF"/></linearGradient>
        <filter id="f-t027" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="27" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t027)"/>
      <g filter="url(#f-t027)">
        <Burst cx={176} cy={50} r1={18} r2={36} pts={12} fill="#0044AA" opacity="0.4"/>
        <FacedCoin cx={176} cy={50} r={20} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={44} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
        {[70,110,242,282].map((x,i)=>(<circle key={i} cx={x} cy={28+(i%2)*16} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>))}
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#88CCFF" stroke="#003388"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#88CCFF" stroke="#003388"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t027)" opacity="0.58" letterSpacing="1.5">DEEP BLUE WIN</text>
    </svg>
  );
}

export function IllT028({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t028" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#CC3300"/><stop offset="100%" stopColor="#440800"/></radialGradient>
        <linearGradient id="lg-t028" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF9966"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FF9966"/></linearGradient>
        <filter id="f-t028" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="28" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t028)"/>
      <Bunting x1={0} y1={14} x2={352} y2={14} n={10} colors={['#FF4400','#FFD700','#FF8800','#FFD700','#FF4400']}/>
      <g filter="url(#f-t028)">
        <TreasureChest x={108} y={34} w={136} h={60}/>
        <CoinStack x={44} y={88} count={5} r={11} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={5} r={11} fill="#FFD700" rim="#B8860B"/>
        <FacedCoin cx={176} cy={50} r={16} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF9966" stroke="#CC3300"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF9966" stroke="#CC3300"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t028)" opacity="0.58" letterSpacing="1.5">TREASURE HUNT</text>
    </svg>
  );
}

export function IllT029({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t029" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#226644"/><stop offset="100%" stopColor="#081A10"/></radialGradient>
        <linearGradient id="lg-t029" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#55FF88"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#55FF88"/></linearGradient>
        <filter id="f-t029" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="29" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t029)"/>
      <g filter="url(#f-t029)">
        {/* Frog with coin */}
        <ellipse cx="176" cy="60" rx="24" ry="18" fill="#44AA44"/>
        <circle cx="176" cy="42" r="16" fill="#44AA44"/>
        <circle cx="168" cy="38" r="6" fill="#88FF88"/>
        <circle cx="184" cy="38" r="6" fill="#88FF88"/>
        <circle cx="168" cy="37" r="3" fill="#222222"/>
        <circle cx="184" cy="37" r="3" fill="#222222"/>
        <path d="M168,50 Q176,56 184,50" stroke="#226633" strokeWidth="2" fill="none"/>
        <FacedCoin cx={200} cy={52} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={44} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        {[70,100,252,282].map((x,i)=>(<circle key={i} cx={x} cy={26+(i%2)*10} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>))}
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#55FF88" stroke="#226644"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#55FF88" stroke="#226644"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t029)" opacity="0.58" letterSpacing="1.5">FROG FORTUNE</text>
    </svg>
  );
}

export function IllT030({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t030" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#550088"/><stop offset="100%" stopColor="#150020"/></radialGradient>
        <linearGradient id="lg-t030" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#CC66FF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#CC66FF"/></linearGradient>
        <filter id="f-t030" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="30" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t030)"/>
      <g filter="url(#f-t030)">
        <Burst cx={176} cy={50} r1={14} r2={32} pts={14} fill="#8800CC" opacity="0.35"/>
        {Array.from({length:8},(_,i)=>{
          const a=i*45*Math.PI/180;
          return <WinkingStar key={i} cx={176+38*Math.cos(a)} cy={50+38*Math.sin(a)} r={8} fill="#CC66FF" stroke="#550088"/>;
        })}
        <FacedCoin cx={176} cy={50} r={14} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={44} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#CC66FF" stroke="#550088"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#CC66FF" stroke="#550088"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t030)" opacity="0.58" letterSpacing="1.5">STAR CLUSTER</text>
    </svg>
  );
}

// ─── t031-t040: Next batch ────────────────────────────────────────────────────

export function IllT031({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t031" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#005500"/><stop offset="100%" stopColor="#001500"/></radialGradient>
        <linearGradient id="lg-t031" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#66FF66"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#66FF66"/></linearGradient>
        <filter id="f-t031" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="31" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t031)"/>
      <g filter="url(#f-t031)">
        {/* Money tree */}
        <rect x="172" y="50" width="8" height="62" rx="3" fill="#552200"/>
        {[[-32,28],[0,16],[32,28],[-48,44],[48,44],[-20,52],[20,52]].map(([dx,dy],i)=>(
          <circle key={i} cx={176+dx} cy={dy} r={14} fill={i%2===0?"#33AA33":"#44BB44"} stroke="#226622" strokeWidth="0.8"/>
        ))}
        {[[-32,28],[0,16],[32,28],[-48,44],[48,44],[-20,52],[20,52]].map(([dx,dy],i)=>(
          <circle key={i} cx={176+dx+4} cy={dy+4} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" opacity="0.85"/>
        ))}
        <CoinStack x={44} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#66FF66" stroke="#005500"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#66FF66" stroke="#005500"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t031)" opacity="0.58" letterSpacing="1.5">MONEY TREE</text>
    </svg>
  );
}

export function IllT032({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t032" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#223388"/><stop offset="100%" stopColor="#080E2A"/></radialGradient>
        <linearGradient id="lg-t032" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#5599FF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#5599FF"/></linearGradient>
        <filter id="f-t032" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="32" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t032)"/>
      <g filter="url(#f-t032)">
        {/* Ship wheel */}
        <circle cx="176" cy="52" r="32" fill="none" stroke="#5599FF" strokeWidth="2"/>
        <circle cx="176" cy="52" r="10" fill="#223388" stroke="#5599FF" strokeWidth="2"/>
        {[0,45,90,135,180,225,270,315].map((a,i)=>(
          <line key={i} x1="176" y1="52" x2={176+30*Math.cos(a*Math.PI/180)} y2={52+30*Math.sin(a*Math.PI/180)} stroke="#5599FF" strokeWidth="2.5"/>
        ))}
        {[0,45,90,135,180,225,270,315].map((a,i)=>(
          <circle key={i} cx={176+32*Math.cos(a*Math.PI/180)} cy={52+32*Math.sin(a*Math.PI/180)} r={4} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8"/>
        ))}
        <FacedCoin cx={176} cy={52} r={8} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={44} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#5599FF" stroke="#223388"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#5599FF" stroke="#223388"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t032)" opacity="0.58" letterSpacing="1.5">SHIP WHEEL</text>
    </svg>
  );
}

export function IllT033({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t033" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#882244"/><stop offset="100%" stopColor="#220810"/></radialGradient>
        <linearGradient id="lg-t033" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF6699"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FF6699"/></linearGradient>
        <filter id="f-t033" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="33" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t033)"/>
      <g filter="url(#f-t033)">
        {/* Rose with coins */}
        <path d="M176,88 Q176,40 176,24" stroke="#336633" strokeWidth="3" fill="none"/>
        {/* Petals */}
        {[0,60,120,180,240,300].map((a,i)=>(
          <ellipse key={i} cx={176+16*Math.cos(a*Math.PI/180)} cy={24+16*Math.sin(a*Math.PI/180)} rx="12" ry="7"
            fill="#FF4488" opacity="0.85" transform={`rotate(${a},${176+16*Math.cos(a*Math.PI/180)},${24+16*Math.sin(a*Math.PI/180)})`}/>
        ))}
        <circle cx="176" cy="24" r="8" fill="#FF2266"/>
        <FacedCoin cx={176} cy={24} r={6} fill="#FFD700" rim="#B8860B"/>
        {/* Falling petals = coins */}
        {[[130,50],[150,62],[200,54],[220,66]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>
        ))}
        <CoinStack x={44} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={114} y={74} w={124} h={26}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF6699" stroke="#882244"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF6699" stroke="#882244"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t033)" opacity="0.58" letterSpacing="1.5">ROSE GOLD</text>
    </svg>
  );
}

export function IllT034({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t034" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#AA6600"/><stop offset="100%" stopColor="#331A00"/></radialGradient>
        <linearGradient id="lg-t034" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFD700"/><stop offset="50%" stopColor="#FFFACD"/><stop offset="100%" stopColor="#FFD700"/></linearGradient>
        <filter id="f-t034" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="34" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t034)"/>
      <Bunting x1={0} y1={14} x2={352} y2={14} n={10} colors={['#FFD700','#AA6600','#FFCC44','#AA6600','#FFD700']}/>
      <g filter="url(#f-t034)">
        {/* Honey pot */}
        <ellipse cx="176" cy="80" rx="36" ry="22" fill="#CC8800"/>
        <rect x="140" y="48" width="72" height="34" rx="4" fill="#AA6600" stroke="#CC8800" strokeWidth="1.5"/>
        <ellipse cx="176" cy="48" rx="36" ry="10" fill="#CC9900"/>
        <text x="176" y="72" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontSize="12" fontWeight="bold" fill="#FFD700">HONEY</text>
        {/* Bees = coins */}
        {[[80,30],[100,44],[260,36],[290,50]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={6} fill="#FFD700" stroke="#AA6600" strokeWidth="0.8" opacity="0.85"/>
        ))}
        <CoinStack x={38} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFD700" stroke="#AA6600"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFD700" stroke="#AA6600"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t034)" opacity="0.58" letterSpacing="1.5">HONEY POT</text>
    </svg>
  );
}

export function IllT035({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t035" cx="50%" cy="30%" r="70%"><stop offset="0%" stopColor="#0033AA"/><stop offset="100%" stopColor="#000A33"/></radialGradient>
        <linearGradient id="lg-t035" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#66AAFF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#66AAFF"/></linearGradient>
        <filter id="f-t035" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="35" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t035)"/>
      <g filter="url(#f-t035)">
        {/* Hot air balloon */}
        <ellipse cx="176" cy="44" rx="36" ry="44" fill="#CC2200" stroke="#FF4400" strokeWidth="1.5"/>
        {[0,60,120,180,240,300].map((a,i)=>(
          <path key={i} d={`M176,44 L${176+36*Math.cos(a*Math.PI/180)},${44+44*Math.sin(a*Math.PI/180)}`}
            stroke="#FF8800" strokeWidth="1" opacity="0.5"/>
        ))}
        {/* Basket */}
        <rect x="160" y="84" width="32" height="16" rx="3" fill="#8B5000" stroke="#5A3000" strokeWidth="1.5"/>
        <line x1="160" y1="84" x2="176" y2="88" stroke="#4A2800" strokeWidth="1.5"/>
        <line x1="192" y1="84" x2="176" y2="88" stroke="#4A2800" strokeWidth="1.5"/>
        {/* Coin basket */}
        <FacedCoin cx={176} cy={90} r={6} fill="#FFD700" rim="#B8860B"/>
        {/* Floating coins */}
        {[[80,30],[100,50],[252,36],[278,54]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>
        ))}
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#66AAFF" stroke="#0033AA"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#66AAFF" stroke="#0033AA"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t035)" opacity="0.58" letterSpacing="1.5">UP UP AND AWAY</text>
    </svg>
  );
}

export function IllT036({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t036" cx="50%" cy="50%" r="70%"><stop offset="0%" stopColor="#7A2200"/><stop offset="100%" stopColor="#220800"/></radialGradient>
        <linearGradient id="lg-t036" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF8844"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FF8844"/></linearGradient>
        <filter id="f-t036" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="36" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t036)"/>
      <g filter="url(#f-t036)">
        {/* Horseshoe */}
        <path d="M148,84 Q148,24 176,24 Q204,24 204,84" stroke="#AA5500" strokeWidth="16" fill="none" strokeLinecap="round"/>
        <path d="M148,84 Q148,24 176,24 Q204,24 204,84" stroke="#CC7722" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <FacedCoin cx={176} cy={54} r={14} fill="#FFD700" rim="#B8860B"/>
        {/* Lucky clover inside shoe */}
        {[0,90,180,270].map((a,i)=>(
          <circle key={i} cx={176+10*Math.cos(a*Math.PI/180)} cy={54+10*Math.sin(a*Math.PI/180)} r={6} fill="#44AA44" opacity="0.7"/>
        ))}
        <CoinStack x={44} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={114} y={74} w={124} h={26}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF8844" stroke="#7A2200"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF8844" stroke="#7A2200"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t036)" opacity="0.58" letterSpacing="1.5">HORSESHOE</text>
    </svg>
  );
}

export function IllT037({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t037" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#003366"/><stop offset="100%" stopColor="#000C1A"/></radialGradient>
        <linearGradient id="lg-t037" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#4488FF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#4488FF"/></linearGradient>
        <filter id="f-t037" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="37" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t037)"/>
      {Array.from({length:12},(_,i)=>(<circle key={i} cx={(i*57)%352} cy={(i*31)%80} r={i%3===0?1.5:0.7} fill="white" opacity="0.5"/>))}
      <g filter="url(#f-t037)">
        {/* Submarine periscope view */}
        <circle cx="176" cy="54" r="34" fill="#002244" stroke="#004488" strokeWidth="2"/>
        <circle cx="176" cy="54" r="26" fill="#001122" stroke="#003366" strokeWidth="1"/>
        {/* Crosshair */}
        <line x1="142" y1="54" x2="210" y2="54" stroke="#4488FF" strokeWidth="1" opacity="0.7"/>
        <line x1="176" y1="20" x2="176" y2="88" stroke="#4488FF" strokeWidth="1" opacity="0.7"/>
        {/* Target = coin */}
        <FacedCoin cx={176} cy={54} r={12} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#4488FF" stroke="#003366"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#4488FF" stroke="#003366"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t037)" opacity="0.58" letterSpacing="1.5">DEEP DIVE</text>
    </svg>
  );
}

export function IllT038({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t038" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#660011"/><stop offset="100%" stopColor="#1A0005"/></radialGradient>
        <linearGradient id="lg-t038" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF4488"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FF4488"/></linearGradient>
        <filter id="f-t038" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="38" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t038)"/>
      <g filter="url(#f-t038)">
        {/* Love heart */}
        <path d="M176,80 Q130,50 130,30 Q130,14 148,14 Q162,14 176,28 Q190,14 204,14 Q222,14 222,30 Q222,50 176,80 Z"
          fill="#CC0033" stroke="#FF4488" strokeWidth="1.5"/>
        <path d="M176,72 Q145,52 145,34 Q145,24 154,24 Q163,24 176,36 Q189,24 198,24 Q207,24 207,34 Q207,52 176,72 Z"
          fill="#EE1144" opacity="0.6"/>
        <FacedCoin cx={176} cy={44} r={10} fill="#FFD700" rim="#B8860B"/>
        {/* Coin confetti */}
        {[[80,30],[100,50],[250,32],[270,52],[60,72],[290,70]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>
        ))}
        <CoinStack x={44} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF4488" stroke="#660011"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF4488" stroke="#660011"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t038)" opacity="0.58" letterSpacing="1.5">LOVE WINS</text>
    </svg>
  );
}

export function IllT039({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t039" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#224411"/><stop offset="100%" stopColor="#081205"/></radialGradient>
        <linearGradient id="lg-t039" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#88DD44"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#88DD44"/></linearGradient>
        <filter id="f-t039" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="39" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t039)"/>
      <g filter="url(#f-t039)">
        {/* Snake wrapped around coin pile */}
        <path d="M80,90 Q100,50 120,60 Q140,70 150,40 Q160,20 176,26 Q192,32 200,52 Q210,72 230,62 Q250,52 260,72 Q270,92 290,88"
          stroke="#558833" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <circle cx="90" cy="88" r="8" fill="#558833"/>
        <circle cx="88" cy="86" r="2" fill="#FF4400"/>
        <circle cx="92" cy="86" r="2" fill="#FF4400"/>
        <FacedCoin cx={176} cy={26} r={10} fill="#FFD700" rim="#B8860B"/>
        {[140,160,192,212].map((x,i)=>(
          <circle key={i} cx={x} cy={50+(i%2)*20} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>
        ))}
        <CoinStack x={44} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#88DD44" stroke="#224411"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#88DD44" stroke="#224411"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t039)" opacity="0.58" letterSpacing="1.5">SERPENT GOLD</text>
    </svg>
  );
}

export function IllT040({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t040" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#770077"/><stop offset="100%" stopColor="#1A001A"/></radialGradient>
        <linearGradient id="lg-t040" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF88FF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FF88FF"/></linearGradient>
        <filter id="f-t040" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="40" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t040)"/>
      <g filter="url(#f-t040)">
        {/* Crystal ball */}
        <circle cx="176" cy="52" r="32" fill="#330033" stroke="#AA44AA" strokeWidth="2"/>
        <circle cx="176" cy="52" r="28" fill="rgba(100,0,100,0.4)"/>
        {/* Swirling mist with coins */}
        <path d="M152,42 Q164,58 180,46 Q196,34 208,50" stroke="#CC44CC" strokeWidth="2" fill="none" opacity="0.6"/>
        <path d="M148,58 Q162,44 176,58 Q190,72 206,58" stroke="#AA44AA" strokeWidth="1.5" fill="none" opacity="0.5"/>
        {/* Glowing coin in ball */}
        <FacedCoin cx={176} cy={52} r={10} fill="#FFD700" rim="#B8860B"/>
        {/* Stand */}
        <polygon points="148,84 204,84 196,96 156,96" fill="#550055" stroke="#770077" strokeWidth="1"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF88FF" stroke="#770077"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF88FF" stroke="#770077"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t040)" opacity="0.58" letterSpacing="1.5">CRYSTAL BALL</text>
    </svg>
  );
}

// ─── t041-t060: Batch ─────────────────────────────────────────────────────────

export function IllT041({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t041" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#AA3300"/><stop offset="100%" stopColor="#2A0800"/></radialGradient>
        <linearGradient id="lg-t041" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF7744"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FF7744"/></linearGradient>
        <filter id="f-t041" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="41" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t041)"/>
      <Bunting x1={0} y1={14} x2={352} y2={14} n={10} colors={['#FF4400','#FFD700','#FF8800','#FF4444','#FFD700']}/>
      <g filter="url(#f-t041)">
        <FacedCoin cx={140} cy={54} r={18} fill="#FFD700" rim="#B8860B"/>
        <FacedCoin cx={212} cy={54} r={18} fill="#FFD700" rim="#B8860B"/>
        <FacedCoin cx={176} cy={42} r={14} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={44} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF7744" stroke="#AA3300"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF7744" stroke="#AA3300"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t041)" opacity="0.58" letterSpacing="1.5">TRIPLE COINS</text>
    </svg>
  );
}

export function IllT042({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t042" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#004422"/><stop offset="100%" stopColor="#001209"/></radialGradient>
        <linearGradient id="lg-t042" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#44FF88"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#44FF88"/></linearGradient>
        <filter id="f-t042" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="42" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t042)"/>
      <g filter="url(#f-t042)">
        {/* Cactus */}
        <rect x="170" y="26" width="12" height="64" rx="5" fill="#337722"/>
        <rect x="144" y="44" width="28" height="12" rx="5" fill="#337722"/>
        <rect x="180" y="36" width="28" height="12" rx="5" fill="#337722"/>
        {/* Coin flowers on cactus */}
        {[[144,42],[172,22],[208,36],[144,54],[208,46]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={6} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>
        ))}
        <CoinStack x={44} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={112} y={74} w={128} h={28}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#44FF88" stroke="#004422"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#44FF88" stroke="#004422"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t042)" opacity="0.58" letterSpacing="1.5">DESERT BLOOM</text>
    </svg>
  );
}

export function IllT043({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t043" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#221144"/><stop offset="100%" stopColor="#080616"/></radialGradient>
        <linearGradient id="lg-t043" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#9966FF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#9966FF"/></linearGradient>
        <filter id="f-t043" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="43" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t043)"/>
      <g filter="url(#f-t043)">
        {/* Hourglass */}
        <polygon points="140,14 212,14 176,54 212,94 140,94 176,54" fill="#330066" stroke="#9966FF" strokeWidth="1.5"/>
        {/* Sand = coins */}
        {[0,1,2,3,4].map(i=>(
          <circle key={i} cx={176+(i-2)*6} cy={70+(i%2)*8} r={4} fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" opacity="0.8"/>
        ))}
        <FacedCoin cx={176} cy={36} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={44} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#9966FF" stroke="#221144"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#9966FF" stroke="#221144"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t043)" opacity="0.58" letterSpacing="1.5">GOLDEN HOUR</text>
    </svg>
  );
}

export function IllT044({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t044" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#664400"/><stop offset="100%" stopColor="#1A1000"/></radialGradient>
        <linearGradient id="lg-t044" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFCC44"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFCC44"/></linearGradient>
        <filter id="f-t044" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="44" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t044)"/>
      <g filter="url(#f-t044)">
        {/* Lanterns */}
        {[[80,40],[176,28],[272,40]].map(([x,y],i)=>(
          <g key={i}>
            <ellipse cx={x} cy={y+10} rx={16} ry={22} fill="#CC4400" stroke="#FF6600" strokeWidth="1.5"/>
            <line x1={x} y1={y-12} x2={x} y2={y} stroke="#884400" strokeWidth="2"/>
            <FacedCoin cx={x} cy={y+10} r={8} fill="#FFD700" rim="#B8860B"/>
          </g>
        ))}
        {/* Golden coins */}
        {[40,100,252,312].map((x,i)=>(
          <circle key={i} cx={x} cy={70} r={6} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>
        ))}
        <CoinStack x={44} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={4} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFCC44" stroke="#664400"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFCC44" stroke="#664400"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t044)" opacity="0.58" letterSpacing="1.5">LANTERN FEST</text>
    </svg>
  );
}

export function IllT045({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t045" cx="50%" cy="50%" r="70%"><stop offset="0%" stopColor="#334466"/><stop offset="100%" stopColor="#0E1522"/></radialGradient>
        <linearGradient id="lg-t045" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#88AAFF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#88AAFF"/></linearGradient>
        <filter id="f-t045" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="45" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t045)"/>
      <g filter="url(#f-t045)">
        {/* Snowflake */}
        {[0,30,60,90,120,150].map((a,i)=>(
          <g key={i}>
            <line x1="176" y1="54" x2={176+34*Math.cos(a*Math.PI/180)} y2={54+34*Math.sin(a*Math.PI/180)} stroke="#88AAFF" strokeWidth="2"/>
            <line x1="176" y1="54" x2={176-34*Math.cos(a*Math.PI/180)} y2={54-34*Math.sin(a*Math.PI/180)} stroke="#88AAFF" strokeWidth="2"/>
          </g>
        ))}
        <circle cx="176" cy="54" r="8" fill="#AADDFF" stroke="#88AAFF" strokeWidth="1.5"/>
        {Array.from({length:6},(_,i)=>{
          const a=i*60*Math.PI/180;
          return <circle key={i} cx={176+22*Math.cos(a)} cy={54+22*Math.sin(a)} r={4} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8"/>;
        })}
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={110} y={74} w={132} h={28}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#88AAFF" stroke="#334466"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#88AAFF" stroke="#334466"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t045)" opacity="0.58" letterSpacing="1.5">SNOWFLAKE $$$</text>
    </svg>
  );
}

export function IllT046({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t046" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#AA4422"/><stop offset="100%" stopColor="#2A1008"/></radialGradient>
        <linearGradient id="lg-t046" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFAA66"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFAA66"/></linearGradient>
        <filter id="f-t046" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="46" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t046)"/>
      <g filter="url(#f-t046)">
        {/* Owl on coin pile */}
        <ellipse cx="176" cy="60" rx="20" ry="26" fill="#884422"/>
        <circle cx="176" cy="38" r="16" fill="#AA5533"/>
        <circle cx="168" cy="34" r="8" fill="#FFCC44" stroke="#AA7700" strokeWidth="1"/>
        <circle cx="184" cy="34" r="8" fill="#FFCC44" stroke="#AA7700" strokeWidth="1"/>
        <circle cx="168" cy="34" r="4" fill="#222222"/>
        <circle cx="184" cy="34" r="4" fill="#222222"/>
        <polygon points="176,42 172,48 180,48" fill="#FF8800"/>
        {/* Wings */}
        <path d="M156,50 Q140,62 148,76" stroke="#884422" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <path d="M196,50 Q212,62 204,76" stroke="#884422" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <FacedCoin cx={176} cy={88} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={3} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={3} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFAA66" stroke="#AA4422"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFAA66" stroke="#AA4422"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t046)" opacity="0.58" letterSpacing="1.5">WISE OWL WIN</text>
    </svg>
  );
}

export function IllT047({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t047" cx="50%" cy="30%" r="70%"><stop offset="0%" stopColor="#0055AA"/><stop offset="100%" stopColor="#001533"/></radialGradient>
        <linearGradient id="lg-t047" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#44AAFF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#44AAFF"/></linearGradient>
        <filter id="f-t047" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="47" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t047)"/>
      <g filter="url(#f-t047)">
        {/* Dolphin */}
        <path d="M80,60 Q140,20 220,50 Q260,66 300,40" stroke="#44AAFF" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M80,60 Q100,72 120,64" stroke="#44AAFF" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <circle cx="290" cy="44" r="6" fill="#44AAFF"/>
        <circle cx="288" cy="42" r="2" fill="#222222"/>
        {/* Coins as bubbles */}
        {[[200,38],[220,28],[240,40],[260,30]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>
        ))}
        {/* Waves */}
        <path d="M0,78 Q88,68 176,78 Q264,88 352,78" stroke="#0066CC" strokeWidth="2" fill="none" opacity="0.6"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#44AAFF" stroke="#0055AA"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#44AAFF" stroke="#0055AA"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t047)" opacity="0.58" letterSpacing="1.5">DOLPHIN DIVE</text>
    </svg>
  );
}

export function IllT048({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t048" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#772200"/><stop offset="100%" stopColor="#1A0800"/></radialGradient>
        <linearGradient id="lg-t048" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF9944"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FF9944"/></linearGradient>
        <filter id="f-t048" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="48" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t048)"/>
      <g filter="url(#f-t048)">
        {/* Fox */}
        <ellipse cx="176" cy="62" rx="26" ry="20" fill="#CC5500"/>
        <circle cx="176" cy="42" r="16" fill="#CC5500"/>
        {/* Ears */}
        <polygon points="162,28 154,10 170,24" fill="#CC5500"/>
        <polygon points="190,28 198,10 182,24" fill="#CC5500"/>
        <polygon points="163,27 157,14 169,24" fill="#FFAAAA"/>
        <polygon points="189,27 195,14 183,24" fill="#FFAAAA"/>
        {/* Face */}
        <ellipse cx="176" cy="44" rx="8" ry="6" fill="#FFCCAA"/>
        <circle cx="170" cy="40" r="2.5" fill="#222222"/>
        <circle cx="182" cy="40" r="2.5" fill="#222222"/>
        <polygon points="176,44 173,48 179,48" fill="#222222"/>
        {/* Bushy tail */}
        <path d="M202,62 Q240,50 246,72 Q240,84 202,76" fill="#CC5500" stroke="#AA3300" strokeWidth="1"/>
        <ellipse cx="236" cy="74" rx="14" ry="8" fill="white"/>
        {/* Coin the fox holds */}
        <FacedCoin cx={140} cy={62} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={44} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF9944" stroke="#772200"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF9944" stroke="#772200"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t048)" opacity="0.58" letterSpacing="1.5">FOX FORTUNE</text>
    </svg>
  );
}

export function IllT049({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t049" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#553311"/><stop offset="100%" stopColor="#150D04"/></radialGradient>
        <linearGradient id="lg-t049" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#CC9944"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#CC9944"/></linearGradient>
        <filter id="f-t049" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="49" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t049)"/>
      <g filter="url(#f-t049)">
        {/* Pyramid */}
        <polygon points="176,14 74,92 278,92" fill="#AA7733" stroke="#CC9944" strokeWidth="1.5"/>
        <polygon points="176,14 176,92 278,92" fill="#886622" opacity="0.6"/>
        {/* Eye of providence */}
        <polygon points="176,30 162,50 190,50" fill="#CC9944" opacity="0.6"/>
        <ellipse cx="176" cy="44" rx="6" ry="9" fill="#FFD700" stroke="#AA7700" strokeWidth="1"/>
        <circle cx="176" cy="44" r="3" fill="#3A2200"/>
        {/* Blocks as coins */}
        {[[108,92],[140,92],[212,92],[244,92]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>
        ))}
        <CoinStack x={30} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={322} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#CC9944" stroke="#553311"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#CC9944" stroke="#553311"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t049)" opacity="0.58" letterSpacing="1.5">PYRAMID PRIZE</text>
    </svg>
  );
}

export function IllT050({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t050" cx="50%" cy="50%" r="70%"><stop offset="0%" stopColor="#770022"/><stop offset="100%" stopColor="#1A0008"/></radialGradient>
        <linearGradient id="lg-t050" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF8888"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FF8888"/></linearGradient>
        <filter id="f-t050" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="50" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t050)"/>
      <g filter="url(#f-t050)">
        {/* Playing cards */}
        {[[-30,-10],[0,0],[30,-10]].map(([dx,dy],i)=>(
          <g key={i} transform={`rotate(${(i-1)*12},${176+dx},${52+dy})`}>
            <rect x={176+dx-16} y={52+dy-22} width="32" height="44" rx="3" fill="white" stroke="#DDDDDD" strokeWidth="1"/>
            <text x={176+dx} y={52+dy-8} textAnchor="middle" fontFamily="Arial" fontSize="14" fontWeight="bold" fill={i%2===0?"#CC0022":"#111111"}>{['A','K','Q'][i]}</text>
            <text x={176+dx} y={52+dy+18} textAnchor="middle" fontFamily="Arial" fontSize="12" fill={i%2===0?"#CC0022":"#111111"}>{['♥','♠','♦'][i]}</text>
          </g>
        ))}
        <CoinStack x={38} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF8888" stroke="#770022"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF8888" stroke="#770022"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t050)" opacity="0.58" letterSpacing="1.5">ROYAL FLUSH</text>
    </svg>
  );
}

// ─── t051-t070: Next batch ────────────────────────────────────────────────────

export function IllT051({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t051" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#CC7700"/><stop offset="100%" stopColor="#3A1F00"/></radialGradient>
        <linearGradient id="lg-t051" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFD700"/><stop offset="50%" stopColor="#FFFACD"/><stop offset="100%" stopColor="#FFD700"/></linearGradient>
        <filter id="f-t051" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="51" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t051)"/>
      <Bunting x1={0} y1={14} x2={352} y2={14} n={10} colors={['#FFD700','#CC7700','#FFCC44','#CC7700','#FFD700']}/>
      <g filter="url(#f-t051)">
        <Burst cx={176} cy={52} r1={20} r2={44} pts={16} fill="#FFD700" opacity="0.25"/>
        <FacedCoin cx={176} cy={52} r={22} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={44} y={88} count={5} r={11} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={5} r={11} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFD700" stroke="#CC7700"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFD700" stroke="#CC7700"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t051)" opacity="0.58" letterSpacing="1.5">GOLD FEVER</text>
    </svg>
  );
}

export function IllT052({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t052" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#226600"/><stop offset="100%" stopColor="#091A00"/></radialGradient>
        <linearGradient id="lg-t052" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#77FF44"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#77FF44"/></linearGradient>
        <filter id="f-t052" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="52" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t052)"/>
      <g filter="url(#f-t052)">
        {/* Turtle */}
        <ellipse cx="176" cy="62" rx="34" ry="24" fill="#336622" stroke="#44AA33" strokeWidth="1.5"/>
        {/* Shell pattern */}
        {[-1,0,1].map(dx=>[-1,0,1].map(dy=>(
          <ellipse key={`${dx}${dy}`} cx={176+dx*16} cy={62+dy*12} rx="8" ry="6" fill="none" stroke="#44AA33" strokeWidth="0.8" opacity="0.6"/>
        )))}
        {/* Head */}
        <circle cx="210" cy="56" r="12" fill="#44AA33"/>
        <circle cx="216" cy="52" r="3" fill="#222222"/>
        <path d="M208,62 Q213,66 218,62" stroke="#226622" strokeWidth="1.5" fill="none"/>
        {/* Legs */}
        <ellipse cx="154" cy="50" rx="12" ry="6" fill="#44AA33" transform="rotate(-20,154,50)"/>
        <ellipse cx="154" cy="76" rx="12" ry="6" fill="#44AA33" transform="rotate(20,154,76)"/>
        <ellipse cx="200" cy="78" rx="10" ry="6" fill="#44AA33" transform="rotate(10,200,78)"/>
        {/* Coin on shell */}
        <FacedCoin cx={176} cy={54} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={3} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={3} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#77FF44" stroke="#226600"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#77FF44" stroke="#226600"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t052)" opacity="0.58" letterSpacing="1.5">LUCKY TURTLE</text>
    </svg>
  );
}

export function IllT053({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t053" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#660055"/><stop offset="100%" stopColor="#1A0015"/></radialGradient>
        <linearGradient id="lg-t053" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF66CC"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FF66CC"/></linearGradient>
        <filter id="f-t053" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="53" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t053)"/>
      <g filter="url(#f-t053)">
        {/* Unicorn */}
        <ellipse cx="176" cy="64" rx="40" ry="22" fill="#DDAAFF"/>
        <circle cx="220" cy="48" r="16" fill="#DDAAFF"/>
        {/* Horn */}
        <polygon points="220,32 215,14 225,14" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
        {/* Mane */}
        {[-1,0,1,2].map(i=>(
          <ellipse key={i} cx={220+i*6} cy={36} rx="4" ry="12" fill={['#FF66CC','#CC44FF','#66AAFF','#44FFAA'][i+1]} opacity="0.8"
            transform={`rotate(${i*10},${220+i*6},36)`}/>
        ))}
        <circle cx="226" cy="46" r="3" fill="#222222"/>
        {/* Legs */}
        {[145,160,175,190].map((x,i)=>(
          <rect key={i} x={x-4} y={82} width="8" height="22" rx="3" fill="#CCAAEE"/>
        ))}
        {/* Rainbow trail */}
        {['#FF4444','#FF8800','#FFD700','#44DD44','#4488FF','#AA44FF'].map((c,i)=>(
          <path key={i} d={`M136,76 Q100,${60+i*8} 80,${70+i*8}`} stroke={c} strokeWidth="2" fill="none" opacity="0.6"/>
        ))}
        <FacedCoin cx={136} cy={62} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF66CC" stroke="#660055"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t053)" opacity="0.58" letterSpacing="1.5">UNICORN GOLD</text>
    </svg>
  );
}

export function IllT054({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t054" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#443300"/><stop offset="100%" stopColor="#110D00"/></radialGradient>
        <linearGradient id="lg-t054" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFDD44"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFDD44"/></linearGradient>
        <filter id="f-t054" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="54" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t054)"/>
      <g filter="url(#f-t054)">
        {/* Sunflowers */}
        {[[90,56],[176,44],[262,56]].map(([x,y],i)=>(
          <g key={i}>
            <rect x={x-3} y={y+14} width="6" height="44" rx="2" fill="#447722"/>
            {[0,40,80,120,160,200,240,280,320].map((a,j)=>(
              <ellipse key={j} cx={x+14*Math.cos(a*Math.PI/180)} cy={y+14*Math.sin(a*Math.PI/180)} rx="10" ry="5"
                fill="#FFD700" stroke="#AA8800" strokeWidth="0.5" opacity="0.9"
                transform={`rotate(${a},${x+14*Math.cos(a*Math.PI/180)},${y+14*Math.sin(a*Math.PI/180)})`}/>
            ))}
            <circle cx={x} cy={y} r="12" fill="#3A2200"/>
            <FacedCoin cx={x} cy={y} r={8} fill="#CC8800" rim="#3A2200"/>
          </g>
        ))}
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFDD44" stroke="#443300"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFDD44" stroke="#443300"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t054)" opacity="0.58" letterSpacing="1.5">SUNFLOWER $$$</text>
    </svg>
  );
}

export function IllT055({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t055" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#331133"/><stop offset="100%" stopColor="#0D050D"/></radialGradient>
        <linearGradient id="lg-t055" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#BB66BB"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#BB66BB"/></linearGradient>
        <filter id="f-t055" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="55" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t055)"/>
      <g filter="url(#f-t055)">
        {/* Cat silhouette */}
        <ellipse cx="176" cy="66" rx="28" ry="22" fill="#553355"/>
        <circle cx="176" cy="44" r="18" fill="#553355"/>
        {/* Ears */}
        <polygon points="162,28 155,12 170,26" fill="#553355"/>
        <polygon points="190,28 197,12 182,26" fill="#553355"/>
        <polygon points="163,27 158,15 169,25" fill="#FF88BB" opacity="0.6"/>
        <polygon points="189,27 194,15 183,25" fill="#FF88BB" opacity="0.6"/>
        {/* Face */}
        <circle cx="168" cy="42" r="4" fill="#BB44BB"/>
        <circle cx="184" cy="42" r="4" fill="#BB44BB"/>
        <circle cx="168" cy="41" r="2" fill="#222222"/>
        <circle cx="184" cy="41" r="2" fill="#222222"/>
        <path d="M172,50 Q176,54 180,50" stroke="#553355" strokeWidth="1.5" fill="none"/>
        {/* Whiskers */}
        {[[-1,1],[1,1],[-1,-1],[1,-1]].map(([dx,dy],i)=>(
          <line key={i} x1={176+dx*8} y1={50+dy*2} x2={176+dx*28} y2={50+dy*4} stroke="#886688" strokeWidth="0.8"/>
        ))}
        {/* Gold collar */}
        <ellipse cx="176" cy="56" rx="18" ry="5" fill="none" stroke="#FFD700" strokeWidth="2.5"/>
        <FacedCoin cx={176} cy={56} r={5} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#BB66BB" stroke="#331133"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#BB66BB" stroke="#331133"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t055)" opacity="0.58" letterSpacing="1.5">CAT'S MEOW</text>
    </svg>
  );
}

export function IllT056({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t056" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#445500"/><stop offset="100%" stopColor="#111500"/></radialGradient>
        <linearGradient id="lg-t056" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#99CC44"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#99CC44"/></linearGradient>
        <filter id="f-t056" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="56" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t056)"/>
      <g filter="url(#f-t056)">
        {/* Snail with coin shell */}
        <ellipse cx="200" cy="68" rx="30" ry="18" fill="#667733"/>
        <circle cx="200" cy="54" r="20" fill="none" stroke="#99AA44" strokeWidth="3"/>
        <circle cx="200" cy="54" r="14" fill="none" stroke="#778833" strokeWidth="2"/>
        <circle cx="200" cy="54" r="8" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
        {/* Head */}
        <circle cx="162" cy="64" r="12" fill="#667733"/>
        {/* Eyestalks */}
        <line x1="156" y1="64" x2="148" y2="52" stroke="#667733" strokeWidth="3"/>
        <line x1="168" y1="60" x2="170" y2="48" stroke="#667733" strokeWidth="3"/>
        <circle cx="148" cy="50" r="3" fill="#222222"/>
        <circle cx="170" cy="46" r="3" fill="#222222"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        {[70,100,252,280].map((x,i)=>(
          <circle key={i} cx={x} cy={24+(i%2)*10} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>
        ))}
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#99CC44" stroke="#445500"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#99CC44" stroke="#445500"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t056)" opacity="0.58" letterSpacing="1.5">SLOW BUT RICH</text>
    </svg>
  );
}

export function IllT057({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t057" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#004488"/><stop offset="100%" stopColor="#001122"/></radialGradient>
        <linearGradient id="lg-t057" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#44BBFF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#44BBFF"/></linearGradient>
        <filter id="f-t057" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="57" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t057)"/>
      <g filter="url(#f-t057)">
        {/* Whale */}
        <ellipse cx="176" cy="62" rx="80" ry="30" fill="#1A5588"/>
        {/* Tail */}
        <path d="M256,62 Q290,44 298,32 Q284,50 298,62 Q284,74 298,86 Q290,80 256,62" fill="#1A5588"/>
        {/* Underbelly */}
        <ellipse cx="164" cy="70" rx="56" ry="14" fill="#AADDFF" opacity="0.5"/>
        {/* Eye */}
        <circle cx="108" cy="56" r="5" fill="white"/>
        <circle cx="108" cy="56" r="2.5" fill="#222222"/>
        {/* Spout = coins */}
        {[[96,36],[102,24],[110,16],[120,26]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>
        ))}
        {/* Waves */}
        <path d="M0,88 Q44,80 88,88 Q132,96 176,88 Q220,80 264,88 Q308,96 352,88" stroke="#0066CC" strokeWidth="2" fill="none" opacity="0.6"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#44BBFF" stroke="#004488"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#44BBFF" stroke="#004488"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t057)" opacity="0.58" letterSpacing="1.5">WHALE WATCH</text>
    </svg>
  );
}

export function IllT058({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t058" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#993300"/><stop offset="100%" stopColor="#2A0E00"/></radialGradient>
        <linearGradient id="lg-t058" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFAA44"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFAA44"/></linearGradient>
        <filter id="f-t058" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="58" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t058)"/>
      <g filter="url(#f-t058)">
        {/* Tiger */}
        <ellipse cx="176" cy="62" rx="32" ry="24" fill="#CC6600"/>
        <circle cx="176" cy="38" r="20" fill="#CC6600"/>
        {/* Stripes */}
        {[[-14,34],[0,28],[14,34],[-18,42],[18,42]].map(([dx,dy],i)=>(
          <ellipse key={i} cx={176+dx} cy={dy} rx="4" ry="10" fill="#333300" opacity="0.7" transform={`rotate(${dx*2},${176+dx},${dy})`}/>
        ))}
        {/* Face */}
        <ellipse cx="176" cy="44" rx="10" ry="8" fill="#FFCCAA"/>
        <circle cx="168" cy="38" r="4" fill="#222222"/>
        <circle cx="184" cy="38" r="4" fill="#222222"/>
        <circle cx="168" cy="37" r="1.5" fill="#FFAA00"/>
        <circle cx="184" cy="37" r="1.5" fill="#FFAA00"/>
        <polygon points="176,44 173,48 179,48" fill="#333300"/>
        {/* Ears */}
        <polygon points="160,22 152,8 168,20" fill="#CC6600"/>
        <polygon points="192,22 200,8 184,20" fill="#CC6600"/>
        <FacedCoin cx={218} cy={58} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFAA44" stroke="#993300"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFAA44" stroke="#993300"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t058)" opacity="0.58" letterSpacing="1.5">TIGER GOLD</text>
    </svg>
  );
}

export function IllT059({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t059" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#002244"/><stop offset="100%" stopColor="#000A15"/></radialGradient>
        <linearGradient id="lg-t059" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3388FF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#3388FF"/></linearGradient>
        <filter id="f-t059" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="59" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t059)"/>
      {Array.from({length:15},(_,i)=>(<circle key={i} cx={(i*47)%352} cy={(i*33)%80} r={i%4===0?1.5:0.7} fill="white" opacity="0.5"/>))}
      <g filter="url(#f-t059)">
        {/* Submarine */}
        <ellipse cx="176" cy="56" rx="60" ry="22" fill="#1A3A5A" stroke="#2255AA" strokeWidth="2"/>
        {/* Conning tower */}
        <rect x="162" y="30" width="28" height="28" rx="3" fill="#1A3A5A" stroke="#2255AA" strokeWidth="1.5"/>
        {/* Periscope */}
        <rect x="174" y="10" width="4" height="22" fill="#2255AA"/>
        <rect x="172" y="10" width="8" height="4" fill="#2255AA"/>
        {/* Portholes = coins */}
        {[120,156,196,232].map((x,i)=>(
          <circle key={i} cx={x} cy={56} r={7} fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
        ))}
        {/* Bubbles */}
        {[120,140,160,200,220,240].map((x,i)=>(
          <circle key={i} cx={x} cy={30+(i%3)*8} r={3} fill="#AADDFF" opacity="0.6"/>
        ))}
        <FacedCoin cx={176} cy={56} r={5} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#3388FF" stroke="#002244"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#3388FF" stroke="#002244"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t059)" opacity="0.58" letterSpacing="1.5">SUB TREASURE</text>
    </svg>
  );
}

export function IllT060({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t060" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#884422"/><stop offset="100%" stopColor="#221005"/></radialGradient>
        <linearGradient id="lg-t060" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFBB66"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFBB66"/></linearGradient>
        <filter id="f-t060" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="60" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t060)"/>
      <Bunting x1={0} y1={14} x2={352} y2={14} n={10} colors={['#FF8844','#FFD700','#FF4422','#FFD700','#FF8844']}/>
      <g filter="url(#f-t060)">
        {/* Eagle silhouette */}
        <ellipse cx="176" cy="52" rx="20" ry="14" fill="#5A3300"/>
        <circle cx="176" cy="36" r="12" fill="#DDDDDD"/>
        {/* Wings spread */}
        <path d="M156,48 Q110,30 70,44" stroke="#5A3300" strokeWidth="14" fill="none" strokeLinecap="round"/>
        <path d="M196,48 Q242,30 282,44" stroke="#5A3300" strokeWidth="14" fill="none" strokeLinecap="round"/>
        {/* Wing tips = feather coins */}
        {[[72,44],[84,40],[282,44],[270,40]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>
        ))}
        {/* Beak */}
        <polygon points="183,38 192,42 183,44" fill="#FF8800"/>
        {/* Talon coins */}
        <FacedCoin cx={162} cy={68} r={9} fill="#FFD700" rim="#B8860B"/>
        <FacedCoin cx={190} cy={68} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFBB66" stroke="#884422"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFBB66" stroke="#884422"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t060)" opacity="0.58" letterSpacing="1.5">EAGLE STRIKE</text>
    </svg>
  );
}

// ─── t061-t084: Next batch ────────────────────────────────────────────────────

export function IllT061({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t061" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#553300"/><stop offset="100%" stopColor="#150D00"/></radialGradient>
        <linearGradient id="lg-t061" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#CC9933"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#CC9933"/></linearGradient>
        <filter id="f-t061" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="61" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t061)"/>
      <g filter="url(#f-t061)">
        {/* Coffee cup with coins */}
        <ellipse cx="176" cy="76" rx="28" ry="18" fill="#5A3300"/>
        <rect x="148" y="50" width="56" height="28" rx="3" fill="#3A1F00" stroke="#5A3300" strokeWidth="1.5"/>
        <ellipse cx="176" cy="50" rx="28" ry="8" fill="#5A3300"/>
        {/* Coffee steam = coin wisps */}
        {[160,176,192].map((x,i)=>(
          <path key={i} d={`M${x},46 Q${x+6},36 ${x},26 Q${x-6},16 ${x},8`} stroke="#CC9933" strokeWidth="1.5" fill="none" opacity="0.5"/>
        ))}
        {/* Coins as coffee beans */}
        {[[158,60],[176,56],[194,60],[162,68],[190,68]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={4} fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" opacity="0.8"/>
        ))}
        <TreasureChest x={86} y={72} w={64} h={28}/>
        <TreasureChest x={202} y={72} w={64} h={28}/>
        <CoinStack x={38} y={88} count={3} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={3} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#CC9933" stroke="#553300"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#CC9933" stroke="#553300"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t061)" opacity="0.58" letterSpacing="1.5">COFFEE CASH</text>
    </svg>
  );
}

export function IllT062({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t062" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#006633"/><stop offset="100%" stopColor="#001A0D"/></radialGradient>
        <linearGradient id="lg-t062" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#44FF88"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#44FF88"/></linearGradient>
        <filter id="f-t062" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="62" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t062)"/>
      <g filter="url(#f-t062)">
        {/* Golf course */}
        <ellipse cx="240" cy="86" rx="50" ry="12" fill="#228844" opacity="0.6"/>
        {/* Flag */}
        <line x1="240" y1="86" x2="240" y2="50" stroke="#888888" strokeWidth="2"/>
        <polygon points="240,50 240,62 256,56" fill="#FF4444"/>
        {/* Golf ball = coin */}
        <FacedCoin cx={140} cy={82} r={10} fill="#FFD700" rim="#B8860B"/>
        {/* Club */}
        <line x1="100" y1="40" x2="150" y2="80" stroke="#5A3300" strokeWidth="3" strokeLinecap="round"/>
        <ellipse cx="152" cy="82" rx="10" ry="5" fill="#4A2800" transform="rotate(-30,152,82)"/>
        {/* Flying coins */}
        {[[180,50],[200,40],[220,52],[180,66]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>
        ))}
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#44FF88" stroke="#006633"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#44FF88" stroke="#006633"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t062)" opacity="0.58" letterSpacing="1.5">HOLE IN ONE</text>
    </svg>
  );
}

export function IllT063({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t063" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#220044"/><stop offset="100%" stopColor="#080010"/></radialGradient>
        <linearGradient id="lg-t063" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#9944FF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#9944FF"/></linearGradient>
        <filter id="f-t063" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="63" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t063)"/>
      <g filter="url(#f-t063)">
        {/* Telescope */}
        <rect x="154" y="50" width="80" height="16" rx="6" fill="#443366" stroke="#6644AA" strokeWidth="1.5" transform="rotate(-20,176,56)"/>
        <rect x="148" y="52" width="16" height="12" rx="4" fill="#553377" transform="rotate(-20,176,56)"/>
        {/* Stars/planets seen through telescope */}
        {Array.from({length:12},(_,i)=>(<circle key={i} cx={(i*44)%352} cy={(i*21)%80} r={i%3===0?1.5:0.7} fill="white" opacity="0.5"/>))}
        {/* Target planet = coin */}
        <FacedCoin cx={290} cy={30} r={12} fill="#FFD700" rim="#B8860B"/>
        {/* Tripod */}
        <line x1="176" y1="66" x2="148" y2="90" stroke="#553377" strokeWidth="2"/>
        <line x1="176" y1="66" x2="204" y2="90" stroke="#553377" strokeWidth="2"/>
        <line x1="176" y1="66" x2="176" y2="90" stroke="#553377" strokeWidth="2"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#9944FF" stroke="#220044"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#9944FF" stroke="#220044"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t063)" opacity="0.58" letterSpacing="1.5">STAR GAZER</text>
    </svg>
  );
}

export function IllT064({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t064" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#881100"/><stop offset="100%" stopColor="#220500"/></radialGradient>
        <linearGradient id="lg-t064" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF8855"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FF8855"/></linearGradient>
        <filter id="f-t064" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="64" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t064)"/>
      <g filter="url(#f-t064)">
        {/* Volcano */}
        <polygon points="60,112 176,10 292,112" fill="#6B2200" stroke="#884400" strokeWidth="1"/>
        <polygon points="144,112 176,10 208,112" fill="#3A1000"/>
        {/* Lava eruption coins */}
        {[[160,30],[176,14],[192,30],[148,50],[204,46],[136,64],[218,60]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={5} fill="#FF8800" stroke="#FF4400" strokeWidth="0.8" opacity="0.85"/>
        ))}
        <circle cx="176" cy="10" r="10" fill="#FF4400" opacity="0.8"/>
        <FacedCoin cx={176} cy={10} r={7} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={108} y={72} w={136} h={28}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF8855" stroke="#881100"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF8855" stroke="#881100"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t064)" opacity="0.58" letterSpacing="1.5">LAVA LOOT</text>
    </svg>
  );
}

export function IllT065({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t065" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#003355"/><stop offset="100%" stopColor="#000E1A"/></radialGradient>
        <linearGradient id="lg-t065" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#4499FF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#4499FF"/></linearGradient>
        <filter id="f-t065" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="65" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t065)"/>
      <g filter="url(#f-t065)">
        {/* Lighthouse */}
        <rect x="166" y="26" width="20" height="64" fill="#445566" stroke="#667788" strokeWidth="1.5"/>
        <polygon points="160,26 192,26 176,10" fill="#556677"/>
        {/* Light beam */}
        <path d="M176,18 L80,80" stroke="#FFDD00" strokeWidth="2" opacity="0.3"/>
        <path d="M176,18 L272,72" stroke="#FFDD00" strokeWidth="2" opacity="0.3"/>
        <circle cx="176" cy="22" r="8" fill="#FFDD00" opacity="0.8"/>
        {/* Horizontal stripes */}
        {[36,52,68,74].map((y,i)=>(
          <rect key={i} x="166" y={y} width="20" height="6" fill={i%2===0?"#CC2222":"#FFFFFF"} opacity="0.6"/>
        ))}
        {/* Coins on rocks */}
        {[[60,78],[84,86],[100,76],[252,80],[272,74],[296,82]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>
        ))}
        <TreasureChest x={108} y={78} w={136} h={24}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#4499FF" stroke="#003355"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#4499FF" stroke="#003355"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t065)" opacity="0.58" letterSpacing="1.5">LIGHTHOUSE WIN</text>
    </svg>
  );
}

export function IllT066({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t066" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#664422"/><stop offset="100%" stopColor="#1A1008"/></radialGradient>
        <linearGradient id="lg-t066" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFCC88"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFCC88"/></linearGradient>
        <filter id="f-t066" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="66" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t066)"/>
      <Bunting x1={0} y1={14} x2={352} y2={14} n={10} colors={['#FFCC88','#884422','#FFD700','#884422','#FFCC88']}/>
      <g filter="url(#f-t066)">
        {/* Camel silhouette */}
        <ellipse cx="176" cy="64" rx="44" ry="22" fill="#AA7733"/>
        {/* Humps */}
        <ellipse cx="158" cy="44" rx="18" ry="16" fill="#AA7733"/>
        <ellipse cx="194" cy="40" rx="18" ry="20" fill="#AA7733"/>
        {/* Head and neck */}
        <rect x="218" y="44" width="10" height="28" rx="4" fill="#AA7733"/>
        <circle cx="223" cy="40" r="10" fill="#AA7733"/>
        <circle cx="226" cy="38" r="2" fill="#222222"/>
        {/* Coins on saddle */}
        {[[156,34],[176,28],[196,24]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={6} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>
        ))}
        {/* Legs */}
        {[138,152,190,204].map((x,i)=>(
          <rect key={i} x={x-4} y={82} width="8" height="22" rx="3" fill="#996633"/>
        ))}
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFCC88" stroke="#664422"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFCC88" stroke="#664422"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t066)" opacity="0.58" letterSpacing="1.5">DESERT GOLD</text>
    </svg>
  );
}

export function IllT067({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t067" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#222288"/><stop offset="100%" stopColor="#080820"/></radialGradient>
        <linearGradient id="lg-t067" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6666FF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#6666FF"/></linearGradient>
        <filter id="f-t067" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="67" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t067)"/>
      {Array.from({length:20},(_,i)=>(<circle key={i} cx={(i*43)%352} cy={(i*27)%80} r={i%4===0?1.5:0.7} fill="white" opacity="0.5"/>))}
      <g filter="url(#f-t067)">
        {/* Rocketship */}
        <polygon points="176,6 162,52 190,52" fill="#6666FF" stroke="#AAAAFF" strokeWidth="1.5"/>
        <rect x="162" y="48" width="28" height="28" rx="4" fill="#4444CC" stroke="#6666FF" strokeWidth="1"/>
        {/* Window = coin */}
        <FacedCoin cx={176} cy={60} r={9} fill="#FFD700" rim="#B8860B"/>
        {/* Fins */}
        <polygon points="162,72 148,88 162,78" fill="#4444CC"/>
        <polygon points="190,72 204,88 190,78" fill="#4444CC"/>
        {/* Exhaust flame */}
        <ellipse cx="176" cy="80" rx="10" ry="8" fill="#FF8800" opacity="0.8"/>
        <ellipse cx="176" cy="86" rx="6" ry="6" fill="#FFD700" opacity="0.7"/>
        {/* Coin trail */}
        {[[150,30],[134,44],[120,60],[110,76]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={4} fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" opacity="0.7"/>
        ))}
        <CoinStack x={292} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#6666FF" stroke="#222288"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#6666FF" stroke="#222288"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t067)" opacity="0.58" letterSpacing="1.5">ROCKET RICH</text>
    </svg>
  );
}

export function IllT068({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t068" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#440022"/><stop offset="100%" stopColor="#100008"/></radialGradient>
        <linearGradient id="lg-t068" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF6688"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FF6688"/></linearGradient>
        <filter id="f-t068" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="68" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t068)"/>
      <g filter="url(#f-t068)">
        {/* Butterfly */}
        {/* Left wings */}
        <ellipse cx="154" cy="40" rx="30" ry="24" fill="#CC2244" opacity="0.8"/>
        <ellipse cx="148" cy="66" rx="20" ry="16" fill="#AA1133" opacity="0.7"/>
        {/* Right wings */}
        <ellipse cx="198" cy="40" rx="30" ry="24" fill="#CC2244" opacity="0.8"/>
        <ellipse cx="204" cy="66" rx="20" ry="16" fill="#AA1133" opacity="0.7"/>
        {/* Wing patterns = coins */}
        {[[148,36],[162,44],[190,36],[204,44],[144,66],[208,66]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" opacity="0.85"/>
        ))}
        {/* Body */}
        <line x1="176" y1="26" x2="176" y2="78" stroke="#222222" strokeWidth="4" strokeLinecap="round"/>
        {/* Antennae */}
        <path d="M176,26 Q164,14 158,8" stroke="#222222" strokeWidth="1.5" fill="none"/>
        <path d="M176,26 Q188,14 194,8" stroke="#222222" strokeWidth="1.5" fill="none"/>
        <circle cx="158" cy="8" r="2.5" fill="#FFD700"/>
        <circle cx="194" cy="8" r="2.5" fill="#FFD700"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF6688" stroke="#440022"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF6688" stroke="#440022"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t068)" opacity="0.58" letterSpacing="1.5">BUTTERFLY WIN</text>
    </svg>
  );
}

export function IllT069({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t069" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#444400"/><stop offset="100%" stopColor="#111100"/></radialGradient>
        <linearGradient id="lg-t069" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFDD00"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFDD00"/></linearGradient>
        <filter id="f-t069" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="69" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t069)"/>
      <g filter="url(#f-t069)">
        {/* Bee */}
        <ellipse cx="176" cy="52" rx="22" ry="16" fill="#FFDD00"/>
        {/* Stripes */}
        {[0,1,2].map(i=>(
          <rect key={i} x={157+i*10} y={38} width="8" height="28" rx="2" fill="#222200" opacity="0.6"/>
        ))}
        {/* Wings */}
        <ellipse cx="162" cy="40" rx="18" ry="10" fill="#AADDFF" opacity="0.5"/>
        <ellipse cx="190" cy="40" rx="18" ry="10" fill="#AADDFF" opacity="0.5"/>
        {/* Head */}
        <circle cx="198" cy="50" r="10" fill="#FFDD00"/>
        <circle cx="200" cy="48" r="3" fill="#222200"/>
        <polygon points="206,50 214,52 206,54" fill="#FF8800"/>
        {/* Stinger */}
        <polygon points="154,52 144,48 144,56" fill="#222200"/>
        {/* Honeycomb = coin pattern */}
        {[[70,40],[88,50],[106,40],[70,60],[88,70],[106,60],[260,40],[278,50],[296,40],[260,60],[278,70],[296,60]].map(([x,y],i)=>(
          <polygon key={i} points={`${x},${y-8} ${x+7},${y-4} ${x+7},${y+4} ${x},${y+8} ${x-7},${y+4} ${x-7},${y-4}`}
            fill="#CC8800" stroke="#FFD700" strokeWidth="0.5" opacity="0.7"/>
        ))}
        <FacedCoin cx={176} cy={52} r={8} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFDD00" stroke="#444400"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFDD00" stroke="#444400"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t069)" opacity="0.58" letterSpacing="1.5">BEE RICH</text>
    </svg>
  );
}

export function IllT070({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t070" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#005533"/><stop offset="100%" stopColor="#001510"/></radialGradient>
        <linearGradient id="lg-t070" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#44FFAA"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#44FFAA"/></linearGradient>
        <filter id="f-t070" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="70" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t070)"/>
      <g filter="url(#f-t070)">
        {/* Crocodile */}
        <ellipse cx="176" cy="68" rx="70" ry="16" fill="#337722"/>
        {/* Head */}
        <ellipse cx="256" cy="62" rx="30" ry="14" fill="#337722"/>
        <ellipse cx="280" cy="62" rx="14" ry="6" fill="#447733"/>
        {/* Teeth */}
        {[262,272,282,292].map((x,i)=>(
          <polygon key={i} points={`${x},56 ${x+4},56 ${x+2},64`} fill="white" opacity="0.9"/>
        ))}
        {/* Eye */}
        <circle cx="256" cy="54" r="5" fill="#88CC00"/>
        <circle cx="256" cy="54" r="2.5" fill="#222200"/>
        {/* Coins on back */}
        {[130,152,174,196,218].map((x,i)=>(
          <circle key={i} cx={x} cy={56} r={6} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>
        ))}
        {/* Tail */}
        <path d="M106,68 Q80,72 60,64" stroke="#337722" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#44FFAA" stroke="#005533"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#44FFAA" stroke="#005533"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t070)" opacity="0.58" letterSpacing="1.5">CROC POT GOLD</text>
    </svg>
  );
}

export function IllT071({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t071" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#332200"/><stop offset="100%" stopColor="#0D0900"/></radialGradient>
        <linearGradient id="lg-t071" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#CC9944"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#CC9944"/></linearGradient>
        <filter id="f-t071" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="71" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t071)"/>
      <g filter="url(#f-t071)">
        {/* Treasure map with X */}
        <rect x="90" y="22" width="172" height="72" rx="4" fill="#DEB887" stroke="#B8860B" strokeWidth="2"/>
        <rect x="96" y="28" width="160" height="60" rx="2" fill="#D2A679" stroke="#AA7700" strokeWidth="0.5"/>
        {/* Map features */}
        <path d="M110,50 Q140,30 176,48 Q210,66 240,44" stroke="#8B6000" strokeWidth="1.5" fill="none"/>
        <path d="M96,76 L252,76" stroke="#8B6000" strokeWidth="0.5" opacity="0.5"/>
        <path d="M96,66 L252,66" stroke="#8B6000" strokeWidth="0.5" opacity="0.5"/>
        {/* X marks the spot */}
        <line x1="164" y1="48" x2="188" y2="72" stroke="#CC2200" strokeWidth="3" strokeLinecap="round"/>
        <line x1="188" y1="48" x2="164" y2="72" stroke="#CC2200" strokeWidth="3" strokeLinecap="round"/>
        <FacedCoin cx={176} cy={60} r={8} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#CC9944" stroke="#332200"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#CC9944" stroke="#332200"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t071)" opacity="0.58" letterSpacing="1.5">X MARKS SPOT</text>
    </svg>
  );
}

export function IllT072({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t072" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#003311"/><stop offset="100%" stopColor="#000D05"/></radialGradient>
        <linearGradient id="lg-t072" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#55FF66"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#55FF66"/></linearGradient>
        <filter id="f-t072" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="72" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t072)"/>
      <g filter="url(#f-t072)">
        {/* Alligator snap = coin mouth */}
        <path d="M80,60 Q120,44 176,52 Q232,60 272,44" stroke="#3A8833" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M80,68 Q120,80 176,70 Q232,60 272,74" stroke="#3A8833" strokeWidth="10" fill="none" strokeLinecap="round"/>
        {/* Teeth */}
        {[100,120,140,160,180,200,220,240,260].map((x,i)=>(
          <polygon key={i} points={`${x-4},52 ${x+4},52 ${x},62`} fill="white" opacity="0.85"/>
        ))}
        {/* Eye */}
        <circle cx="90" cy="56" r="6" fill="#AABB00"/>
        <circle cx="90" cy="56" r="3" fill="#222200"/>
        {/* Gold coin caught in jaws */}
        <FacedCoin cx={176} cy={62} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#55FF66" stroke="#003311"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#55FF66" stroke="#003311"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t072)" opacity="0.58" letterSpacing="1.5">SNAP JACKPOT</text>
    </svg>
  );
}

export function IllT073({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t073" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#550088"/><stop offset="100%" stopColor="#150022"/></radialGradient>
        <linearGradient id="lg-t073" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#CC66FF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#CC66FF"/></linearGradient>
        <filter id="f-t073" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="73" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t073)"/>
      <g filter="url(#f-t073)">
        {/* Fairy with wand */}
        <circle cx="176" cy="36" r="10" fill="#FFDDAA"/>
        <ellipse cx="176" cy="54" rx="10" ry="16" fill="#CC66FF"/>
        {/* Wings */}
        <ellipse cx="158" cy="46" rx="18" ry="12" fill="#DDAAFF" opacity="0.6"/>
        <ellipse cx="194" cy="46" rx="18" ry="12" fill="#DDAAFF" opacity="0.6"/>
        {/* Wand */}
        <line x1="176" y1="54" x2="220" y2="30" stroke="#8844CC" strokeWidth="2.5" strokeLinecap="round"/>
        <Burst cx={222} cy={28} r1={6} r2={12} pts={8} fill="#FFD700" opacity="0.9"/>
        {/* Magic coins */}
        {[[230,40],[244,52],[252,36],[238,62],[220,66],[210,50]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={4} fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" opacity="0.85"/>
        ))}
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <TreasureChest x={92} y={74} w={80} h={26}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#CC66FF" stroke="#550088"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#CC66FF" stroke="#550088"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t073)" opacity="0.58" letterSpacing="1.5">FAIRY GOLD</text>
    </svg>
  );
}

export function IllT074({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t074" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#773300"/><stop offset="100%" stopColor="#1A0C00"/></radialGradient>
        <linearGradient id="lg-t074" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFAA55"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFAA55"/></linearGradient>
        <filter id="f-t074" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="74" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t074)"/>
      <g filter="url(#f-t074)">
        {/* Bear with honey pot */}
        <ellipse cx="176" cy="66" rx="28" ry="24" fill="#8B5500"/>
        <circle cx="176" cy="42" r="20" fill="#8B5500"/>
        <circle cx="163" cy="28" r="8" fill="#8B5500"/>
        <circle cx="189" cy="28" r="8" fill="#8B5500"/>
        <circle cx="163" cy="28" r="5" fill="#6B3A00"/>
        <circle cx="189" cy="28" r="5" fill="#6B3A00"/>
        <ellipse cx="176" cy="46" rx="10" ry="8" fill="#CC8844"/>
        <circle cx="168" cy="40" r="4" fill="#222222"/>
        <circle cx="184" cy="40" r="4" fill="#222222"/>
        <circle cx="168" cy="39" r="1.5" fill="#FF4400"/>
        <circle cx="184" cy="39" r="1.5" fill="#FF4400"/>
        <ellipse cx="176" cy="48" rx="6" ry="3" fill="#222222"/>
        {/* Arms holding honey pot */}
        <path d="M148,62 Q130,72 140,84" stroke="#8B5500" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M204,62 Q222,72 212,84" stroke="#8B5500" strokeWidth="10" fill="none" strokeLinecap="round"/>
        {/* Honey pot */}
        <ellipse cx="176" cy="90" rx="20" ry="12" fill="#CC8800"/>
        <rect x="156" y="76" width="40" height="16" rx="3" fill="#AA6600"/>
        <text x="176" y="88" textAnchor="middle" fontFamily="Arial" fontSize="9" fontWeight="bold" fill="#FFD700">$$$</text>
        <CoinStack x={38} y={88} count={3} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={3} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFAA55" stroke="#773300"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFAA55" stroke="#773300"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t074)" opacity="0.58" letterSpacing="1.5">BEAR BUCKS</text>
    </svg>
  );
}

export function IllT075({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t075" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#005544"/><stop offset="100%" stopColor="#001512"/></radialGradient>
        <linearGradient id="lg-t075" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#44FFCC"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#44FFCC"/></linearGradient>
        <filter id="f-t075" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="75" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t075)"/>
      <g filter="url(#f-t075)">
        {/* Seahorse */}
        <path d="M190,24 Q214,24 214,44 Q214,64 200,72 Q186,80 186,96" stroke="#44AAAA" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <circle cx="190" cy="22" r="12" fill="#44AAAA"/>
        <circle cx="196" cy="18" r="3" fill="#222222"/>
        <polygon points="196,22 204,18 202,26" fill="#FF8800"/>
        {/* Fin */}
        <path d="M208,36 Q224,28 220,44 Q216,52 208,48" fill="#55BBAA" opacity="0.7"/>
        {/* Spines = coins */}
        {[30,44,56,68,82,96].map((y,i)=>(
          <circle key={i} cx={i%2===0?200:196} cy={y} r={4} fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" opacity="0.85"/>
        ))}
        {/* Ocean floor coins */}
        {[60,90,120,232,260,290].map((x,i)=>(
          <circle key={i} cx={x} cy={88+(i%2)*6} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>
        ))}
        <TreasureChest x={134} y={72} w={80} h={28}/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#44FFCC" stroke="#005544"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#44FFCC" stroke="#005544"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t075)" opacity="0.58" letterSpacing="1.5">SEA HORSE WIN</text>
    </svg>
  );
}

export function IllT076({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t076" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#330055"/><stop offset="100%" stopColor="#0D0015"/></radialGradient>
        <linearGradient id="lg-t076" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#AA55FF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#AA55FF"/></linearGradient>
        <filter id="f-t076" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="76" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t076)"/>
      <g filter="url(#f-t076)">
        {/* Octopus with coins in tentacles */}
        <circle cx="176" cy="46" r="22" fill="#884488"/>
        <circle cx="164" cy="40" r="4" fill="#DDAADD"/>
        <circle cx="188" cy="40" r="4" fill="#DDAADD"/>
        <circle cx="164" cy="40" r="2" fill="#222222"/>
        <circle cx="188" cy="40" r="2" fill="#222222"/>
        {/* 8 tentacles, each ending in a coin */}
        {[0,45,90,135,180,225,270,315].map((a,i)=>{
          const r=36;
          const x=176+r*Math.cos(a*Math.PI/180);
          const y=46+r*Math.sin(a*Math.PI/180);
          return (
            <g key={i}>
              <path d={`M${176+14*Math.cos(a*Math.PI/180)},${46+14*Math.sin(a*Math.PI/180)} Q${176+28*Math.cos(a*Math.PI/180)},${46+28*Math.sin(a*Math.PI/180)} ${x},${y}`}
                stroke="#884488" strokeWidth="6" fill="none" strokeLinecap="round"/>
              <circle cx={x} cy={y} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8"/>
            </g>
          );
        })}
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#AA55FF" stroke="#330055"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#AA55FF" stroke="#330055"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t076)" opacity="0.58" letterSpacing="1.5">OCTO JACKPOT</text>
    </svg>
  );
}

export function IllT077({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t077" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#AA5500"/><stop offset="100%" stopColor="#2A1500"/></radialGradient>
        <linearGradient id="lg-t077" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFCC44"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFCC44"/></linearGradient>
        <filter id="f-t077" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="77" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t077)"/>
      <Bunting x1={0} y1={14} x2={352} y2={14} n={10} colors={['#FFCC44','#AA5500','#FF8800','#AA5500','#FFCC44']}/>
      <g filter="url(#f-t077)">
        {/* Squirrel with acorn coins */}
        <ellipse cx="176" cy="62" rx="22" ry="20" fill="#996633"/>
        <circle cx="176" cy="40" r="16" fill="#996633"/>
        <circle cx="165" cy="30" r="7" fill="#996633"/>
        <circle cx="187" cy="30" r="7" fill="#996633"/>
        {/* Bushy tail */}
        <path d="M198,62 Q230,40 240,62 Q238,80 220,82 Q202,80 198,62" fill="#CC8844"/>
        <circle cx="168" cy="38" r="3" fill="#222222"/>
        <circle cx="184" cy="38" r="3" fill="#222222"/>
        {/* Acorn = coin */}
        {[[140,56],[158,46],[194,46],[212,56]].map(([x,y],i)=>(
          <g key={i}>
            <ellipse cx={x} cy={y} rx="7" ry="5" fill="#8B5500"/>
            <ellipse cx={x} cy={y+4} rx="5" ry="7" fill="#FFD700" stroke="#B8860B" strokeWidth="0.8"/>
          </g>
        ))}
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFCC44" stroke="#AA5500"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFCC44" stroke="#AA5500"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t077)" opacity="0.58" letterSpacing="1.5">NUT CASE RICH</text>
    </svg>
  );
}

export function IllT078({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t078" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#002255"/><stop offset="100%" stopColor="#000918"/></radialGradient>
        <linearGradient id="lg-t078" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#5588FF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#5588FF"/></linearGradient>
        <filter id="f-t078" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="78" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t078)"/>
      {Array.from({length:20},(_,i)=>(<circle key={i} cx={(i*47)%352} cy={(i*29)%80} r={i%4===0?1.5:0.7} fill="white" opacity="0.5"/>))}
      <g filter="url(#f-t078)">
        {/* UFO */}
        <ellipse cx="176" cy="44" rx="52" ry="14" fill="#1A3A6A" stroke="#2255AA" strokeWidth="2"/>
        <ellipse cx="176" cy="36" rx="28" ry="16" fill="#0A2A4A" stroke="#3366CC" strokeWidth="1.5"/>
        {/* UFO lights */}
        {[130,152,174,196,218].map((x,i)=>(
          <circle key={i} cx={x} cy={46} r={4} fill={['#FF4444','#FFD700','#44FFAA','#4488FF','#FF4444'][i]} opacity="0.9"/>
        ))}
        {/* Tractor beam */}
        <polygon points="156,58 196,58 210,96 142,96" fill="#44AAFF" opacity="0.15"/>
        {/* Coins being abducted */}
        {[[158,70],[170,78],[182,66],[194,74]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>
        ))}
        <TreasureChest x={148} y={82} w={56} h={22}/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#5588FF" stroke="#002255"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#5588FF" stroke="#002255"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t078)" opacity="0.58" letterSpacing="1.5">UFO WINDFALL</text>
    </svg>
  );
}

export function IllT079({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t079" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#004400"/><stop offset="100%" stopColor="#001200"/></radialGradient>
        <linearGradient id="lg-t079" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#66FF44"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#66FF44"/></linearGradient>
        <filter id="f-t079" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="79" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t079)"/>
      <g filter="url(#f-t079)">
        {/* Chameleon */}
        <path d="M80,56 Q120,40 176,50 Q230,60 270,44" stroke="#447733" strokeWidth="14" fill="none" strokeLinecap="round"/>
        {/* Eye stalk */}
        <path d="M270,44 Q282,34 278,28" stroke="#447733" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <circle cx="278" cy="26" r="6" fill="#88BB44"/>
        <circle cx="278" cy="26" r="3" fill="#222222"/>
        {/* Curly tail */}
        <path d="M80,56 Q62,70 68,80 Q74,90 88,86 Q100,82 98,72" stroke="#447733" strokeWidth="10" fill="none" strokeLinecap="round"/>
        {/* Color spots = coins */}
        {[[120,46],[150,44],[180,50],[210,48],[240,44]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={6} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>
        ))}
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#66FF44" stroke="#004400"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#66FF44" stroke="#004400"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t079)" opacity="0.58" letterSpacing="1.5">COLOR CASH</text>
    </svg>
  );
}

export function IllT080({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t080" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#660000"/><stop offset="100%" stopColor="#1A0000"/></radialGradient>
        <linearGradient id="lg-t080" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF4444"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FF4444"/></linearGradient>
        <filter id="f-t080" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="80" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t080)"/>
      <g filter="url(#f-t080)">
        {/* Bull with gold horns */}
        <ellipse cx="176" cy="62" rx="34" ry="24" fill="#5A3300"/>
        <circle cx="176" cy="38" r="20" fill="#5A3300"/>
        {/* Horns = gold */}
        <path d="M156,26 Q140,8 148,20" stroke="#FFD700" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M196,26 Q212,8 204,20" stroke="#FFD700" strokeWidth="6" fill="none" strokeLinecap="round"/>
        {/* Face */}
        <ellipse cx="176" cy="44" rx="12" ry="10" fill="#7A4A20"/>
        <circle cx="170" cy="40" r="3.5" fill="#222222"/>
        <circle cx="182" cy="40" r="3.5" fill="#222222"/>
        <ellipse cx="170" cy="48" rx="3" ry="2" fill="#3A1F00"/>
        <ellipse cx="182" cy="48" rx="3" ry="2" fill="#3A1F00"/>
        {/* Ring with coin */}
        <circle cx="176" cy="50" r="5" fill="none" stroke="#FFD700" strokeWidth="2"/>
        <FacedCoin cx={218} cy={60} r={11} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF4444" stroke="#660000"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF4444" stroke="#660000"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t080)" opacity="0.58" letterSpacing="1.5">BULL MARKET</text>
    </svg>
  );
}

export function IllT081({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t081" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#002244"/><stop offset="100%" stopColor="#000810"/></radialGradient>
        <linearGradient id="lg-t081" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF4444"/><stop offset="25%" stopColor="#FFFFFF"/><stop offset="50%" stopColor="#4488FF"/><stop offset="100%" stopColor="#FFFFFF"/></linearGradient>
        <filter id="f-t081" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="81" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t081)"/>
      {/* Stars */}
      {Array.from({length:20},(_,i)=>(<circle key={i} cx={(i*47)%352} cy={(i*31)%80} r={i%4===0?1.5:0.7} fill="white" opacity="0.5"/>))}
      <g filter="url(#f-t081)">
        {/* Fireworks */}
        {[[90,30],[176,18],[262,30]].map(([x,y],i)=>(
          <Burst key={i} cx={x} cy={y} r1={8} r2={18} pts={12} fill={['#FF4444','#FFFFFF','#4488FF'][i]} opacity="0.65"/>
        ))}
        {/* Coins in explosion */}
        {Array.from({length:10},(_,i)=>{
          const a=i*36*Math.PI/180;
          return <circle key={i} cx={176+30*Math.cos(a)} cy={18+30*Math.sin(a)} r={4} fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" opacity="0.85"/>;
        })}
        <TreasureChest x={108} y={68} w={136} h={30}/>
        <CoinStack x={38} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFD700" stroke="#002244"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFD700" stroke="#002244"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t081)" opacity="0.58" letterSpacing="1.5">4TH OF JULY</text>
    </svg>
  );
}

export function IllT082({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t082" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#550000"/><stop offset="100%" stopColor="#150000"/></radialGradient>
        <linearGradient id="lg-t082" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF8888"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FF8888"/></linearGradient>
        <filter id="f-t082" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="82" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t082)"/>
      <g filter="url(#f-t082)">
        {/* Giant coin spinning */}
        <FacedCoin cx={176} cy={52} r={32} fill="#FFD700" rim="#B8860B"/>
        {/* Spin reflection */}
        <ellipse cx="176" cy="20" rx="32" ry="4" fill="#FFD700" opacity="0.15"/>
        <CoinStack x={44} y={88} count={6} r={11} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={6} r={11} fill="#FFD700" rim="#B8860B"/>
        {[80,116,236,272].map((x,i)=>(
          <circle key={i} cx={x} cy={32+(i%2)*16} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.8"/>
        ))}
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FF8888" stroke="#550000"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FF8888" stroke="#550000"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t082)" opacity="0.58" letterSpacing="1.5">LUCKY PENNY</text>
    </svg>
  );
}

export function IllT083({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t083" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#004455"/><stop offset="100%" stopColor="#001218"/></radialGradient>
        <linearGradient id="lg-t083" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#44DDFF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#44DDFF"/></linearGradient>
        <filter id="f-t083" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="83" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t083)"/>
      <g filter="url(#f-t083)">
        {/* Jellyfish */}
        <ellipse cx="176" cy="40" rx="34" ry="24" fill="#44AAAA" opacity="0.7"/>
        <ellipse cx="176" cy="40" rx="26" ry="18" fill="#55BBBB" opacity="0.5"/>
        {/* Tentacles */}
        {[148,158,168,176,184,194,204].map((x,i)=>(
          <path key={i} d={`M${x},62 Q${x+(i%3-1)*10},80 ${x+(i%2-0.5)*8},100`}
            stroke="#44AAAA" strokeWidth="2" fill="none" opacity="0.6"/>
        ))}
        {/* Coins floating in bell */}
        {[[-12,-8],[0,-14],[12,-8],[0,0],[-8,6],[8,6]].map(([dx,dy],i)=>(
          <circle key={i} cx={176+dx} cy={40+dy} r={4} fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" opacity="0.8"/>
        ))}
        {/* Other jellyfish */}
        <ellipse cx="60" cy="50" rx="18" ry="13" fill="#44AAAA" opacity="0.5"/>
        <ellipse cx="292" cy="46" rx="18" ry="13" fill="#44AAAA" opacity="0.5"/>
        <CoinStack x={38} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#44DDFF" stroke="#004455"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#44DDFF" stroke="#004455"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t083)" opacity="0.58" letterSpacing="1.5">JELLY JACKPOT</text>
    </svg>
  );
}

export function IllT084({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t084" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#AA3377"/><stop offset="100%" stopColor="#330012"/></radialGradient>
        <linearGradient id="lg-t084" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFAACC"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFAACC"/></linearGradient>
        <filter id="f-t084" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="84" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t084)"/>
      <g filter="url(#f-t084)">
        {/* Cherry blossom tree */}
        <rect x="170" y="40" width="12" height="72" rx="3" fill="#553311"/>
        {[[-36,28],[0,16],[36,28],[-48,44],[48,44],[-20,46],[20,46]].map(([dx,dy],i)=>(
          <circle key={i} cx={176+dx} cy={dy} r={11} fill="#FFAACC" stroke="#FF66AA" strokeWidth="1" opacity="0.85"/>
        ))}
        {[60,96,134,218,256,294].map((x,i)=>(
          <g key={i}>
            <circle cx={x} cy={28+(i%4)*14} r={5} fill="#FFD700" stroke="#AA8800" strokeWidth="0.8" opacity="0.75"/>
          </g>
        ))}
        {/* Bird */}
        <g transform="translate(290,40)">
          <ellipse rx="12" ry="7" fill="#4488AA"/>
          <circle cx="12" cy="-4" r="7" fill="#4488AA"/>
          <polygon points="20,-5 30,-5 20,-3" fill="#FF8800"/>
          <circle cx="26" cy="-5" r="3" fill="#FFD700"/>
        </g>
        <TreasureChest x={10} y={68} w={40} h={26}/>
        <CoinStack x={54} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={298} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={314} cy={28} r={12} fill="#FFAACC" stroke="#FF44AA"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t084)" opacity="0.58" letterSpacing="1.5">SPRING FLING</text>
    </svg>
  );
}

// ─── t085-t105: Final batches ─────────────────────────────────────────────────

export function IllT085({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t085" cx="50%" cy="50%" r="70%"><stop offset="0%" stopColor="#2255AA"/><stop offset="100%" stopColor="#112244"/></radialGradient>
        <linearGradient id="lg-t085" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#AAD4FF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#AAD4FF"/></linearGradient>
        <filter id="f-t085" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="85" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t085)"/>
      <g filter="url(#f-t085)">
        <circle cx="176" cy="50" r="36" fill="#334466" stroke="#6688CC" strokeWidth="2"/>
        <circle cx="176" cy="50" r="30" fill="#223355" stroke="#5577BB" strokeWidth="1"/>
        <line x1="176" y1="50" x2="176" y2="25" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="176" y1="50" x2="196" y2="55" stroke="#FF6633" strokeWidth="2" strokeLinecap="round"/>
        {Array.from({length:12},(_,i)=>{const a=(i*30-90)*Math.PI/180;return <circle key={i} cx={176+26*Math.cos(a)} cy={50+26*Math.sin(a)} r="1.5" fill="#5577BB"/>;})}
        <rect x="120" y="74" width="62" height="28" rx="2" fill="#EEDDCC" stroke="#AA9966" strokeWidth="1"/>
        {[0,1,2,3,4].map(i=>(<ellipse key={i} cx={128+i*11} cy={88} rx="4" ry="3" fill="#FFD700" stroke="#AA8800" strokeWidth="0.8"/>))}
        <FacedCoin cx={194} cy={82} r={8} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={38} y={88} count={3} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={314} y={88} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={320} cy={22} r={11} fill="#FFD700" stroke="#B8860B"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t085)" opacity="0.58" letterSpacing="1.5">OVERTIME</text>
    </svg>
  );
}

export function IllT086({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t086" cx="50%" cy="30%" r="70%"><stop offset="0%" stopColor="#CC2200"/><stop offset="100%" stopColor="#660000"/></radialGradient>
        <linearGradient id="lg-t086" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFD700"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFD700"/></linearGradient>
        <filter id="f-t086" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="86" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t086)"/>
      <g filter="url(#f-t086)">
        <rect x="100" y="20" width="152" height="70" rx="6" fill="#3A0000" stroke="#FF4444" strokeWidth="2"/>
        <rect x="108" y="28" width="40" height="54" rx="3" fill="#220000" stroke="#CC2200" strokeWidth="1"/>
        <rect x="156" y="28" width="40" height="54" rx="3" fill="#220000" stroke="#CC2200" strokeWidth="1"/>
        <rect x="204" y="28" width="40" height="54" rx="3" fill="#220000" stroke="#CC2200" strokeWidth="1"/>
        <text x="128" y="60" textAnchor="middle" fontFamily="Arial" fontSize="20" fill="#FFD700">7</text>
        <text x="176" y="60" textAnchor="middle" fontFamily="Arial" fontSize="20" fill="#FFD700">7</text>
        <text x="224" y="60" textAnchor="middle" fontFamily="Arial" fontSize="20" fill="#FFD700">7</text>
        {[120,160,200,240].map((x,i)=>(<circle key={i} cx={x} cy={18} r="4" fill={i%2===0?"#FFD700":"#FF4444"} stroke="#880000" strokeWidth="0.5"/>))}
        <CoinStack x={44} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={5} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={12} fill="#FFD700" stroke="#B8860B"/>
      <WinkingStar cx={320} cy={22} r={12} fill="#FFD700" stroke="#B8860B"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t086)" opacity="0.58" letterSpacing="1.5">JAMBOREE</text>
    </svg>
  );
}

export function IllT087({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t087" cx="50%" cy="50%" r="70%"><stop offset="0%" stopColor="#336633"/><stop offset="100%" stopColor="#112211"/></radialGradient>
        <linearGradient id="lg-t087" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFD700"/><stop offset="50%" stopColor="#AAFFAA"/><stop offset="100%" stopColor="#FFD700"/></linearGradient>
        <filter id="f-t087" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="87" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t087)"/>
      {['#FF4444','#FF8800','#FFD700','#44DD44','#4488FF','#8844FF'].map((c,i)=>(<path key={i} d={`M${44-i*6},112 Q176,${-10+i*14} ${308+i*6},112`} stroke={c} strokeWidth="3" fill="none" opacity="0.5"/>))}
      <g filter="url(#f-t087)">
        <circle cx="176" cy="38" r="14" fill="#228822"/>
        <rect x="164" y="16" width="24" height="20" rx="2" fill="#115511"/>
        <rect x="160" y="34" width="32" height="5" rx="1" fill="#115511"/>
        <rect x="166" y="20" width="20" height="4" fill="#FFD700" opacity="0.7"/>
        <circle cx="170" cy="40" r="2" fill="#115511"/>
        <circle cx="182" cy="40" r="2" fill="#115511"/>
        <path d="M170,46 Q176,51 182,46" stroke="#115511" strokeWidth="1.5" fill="none"/>
        {[0,90,180,270].map((a,i)=>(<circle key={i} cx={176+8*Math.cos(a*Math.PI/180)} cy={72+8*Math.sin(a*Math.PI/180)} r="7" fill="#44AA44" opacity="0.9"/>))}
        <rect x="174" y="72" width="4" height="16" rx="2" fill="#228822"/>
        <ellipse cx="80" cy="90" rx="22" ry="14" fill="#3A1F00"/>
        <ellipse cx="80" cy="80" rx="22" ry="8" fill="#4A2800"/>
        {[64,74,84,94].map((x,i)=>(<circle key={i} cx={x} cy={74} r="5" fill="#FFD700" stroke="#B8860B" strokeWidth="0.8"/>))}
        <TreasureChest x={258} y={68} w={40} h={28}/>
      </g>
      <WinkingStar cx={44} cy={22} r={11} fill="#44DD44" stroke="#228822"/>
      <WinkingStar cx={308} cy={22} r={11} fill="#44DD44" stroke="#228822"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t087)" opacity="0.58" letterSpacing="1.5">LEPRECHAUN</text>
    </svg>
  );
}

export function IllT088({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t088" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#220044"/><stop offset="100%" stopColor="#060010"/></radialGradient>
        <linearGradient id="lg-t088" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#AA44FF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#AA44FF"/></linearGradient>
        <filter id="f-t088" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="88" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t088)"/>
      {Array.from({length:20},(_,i)=>(<circle key={i} cx={(i*37)%352} cy={(i*23)%112} r={i%4===0?1.5:0.8} fill="white" opacity="0.7"/>))}
      <g filter="url(#f-t088)">
        <circle cx="176" cy="55" r="30" fill="#330055" stroke="#6600AA" strokeWidth="1.5"/>
        <ellipse cx="176" cy="55" rx="48" ry="10" fill="none" stroke="#8844FF" strokeWidth="2" opacity="0.7"/>
        <ellipse cx="176" cy="55" rx="44" ry="8" fill="none" stroke="#6622CC" strokeWidth="1" opacity="0.5"/>
        <ellipse cx="176" cy="45" rx="20" ry="8" fill="#440066" opacity="0.6"/>
        {[[50,30],[100,15],[250,20],[300,35],[60,80],[310,75]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>))}
        <FacedCoin cx={176} cy={55} r={12} fill="#FFD700" rim="#B8860B"/>
      </g>
      <Burst cx={176} cy={8} r1={8} r2={16} pts={8} fill="#AA44FF" opacity="0.45"/>
      <WinkingStar cx={32} cy={22} r={10} fill="#AA44FF" stroke="#6600AA"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t088)" opacity="0.58" letterSpacing="1.5">COSMIC</text>
    </svg>
  );
}

export function IllT089({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t089" cx="50%" cy="50%" r="70%"><stop offset="0%" stopColor="#334455"/><stop offset="100%" stopColor="#111222"/></radialGradient>
        <linearGradient id="lg-t089" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#88CCFF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#88CCFF"/></linearGradient>
        <filter id="f-t089" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="89" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t089)"/>
      <g filter="url(#f-t089)">
        <polygon points="176,18 210,50 176,88 142,50" fill="#AADDFF" stroke="#66AAFF" strokeWidth="1.5"/>
        <polygon points="176,18 210,50 176,50" fill="#DDEEFF" opacity="0.8"/>
        <polygon points="176,50 210,50 176,88" fill="#88AACC" opacity="0.7"/>
        <polygon points="176,18 142,50 176,50" fill="#CCDDEE" opacity="0.6"/>
        <line x1="176" y1="18" x2="176" y2="88" stroke="white" strokeWidth="0.5" opacity="0.5"/>
        <line x1="142" y1="50" x2="210" y2="50" stroke="white" strokeWidth="0.5" opacity="0.5"/>
        {[[80,30],[272,30],[80,80],[272,80]].map(([x,y],i)=>(<polygon key={i} points={`${x},${y-12} ${x+10},${y} ${x},${y+12} ${x-10},${y}`} fill="#AADDFF" stroke="#66AAFF" strokeWidth="1" opacity="0.7"/>))}
        <CoinStack x={44} y={88} count={3} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={308} y={88} count={3} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={320} cy={22} r={11} fill="#88CCFF" stroke="#336699"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t089)" opacity="0.58" letterSpacing="1.5">DIAMOND</text>
    </svg>
  );
}

export function IllT090({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t090" cx="50%" cy="60%" r="70%"><stop offset="0%" stopColor="#CC8822"/><stop offset="100%" stopColor="#663311"/></radialGradient>
        <linearGradient id="lg-t090" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFE066"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFE066"/></linearGradient>
        <filter id="f-t090" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="90" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t090)"/>
      <circle cx="290" cy="26" r="18" fill="#FFCC00" opacity="0.8"/>
      <Burst cx={290} cy={26} r1={18} r2={28} pts={10} fill="#FFCC00" opacity="0.4"/>
      <g filter="url(#f-t090)">
        <rect x="0" y="86" width="352" height="26" fill="#885522" opacity="0.8"/>
        <rect x="168" y="34" width="8" height="52" fill="#553311"/>
        <ellipse cx="172" cy="30" rx="38" ry="16" fill="#336622" opacity="0.9"/>
        <ellipse cx="148" cy="38" rx="22" ry="10" fill="#447733"/>
        <ellipse cx="196" cy="38" rx="22" ry="10" fill="#447733"/>
        {[150,162,174,186,198].map((x,i)=>(<circle key={i} cx={x} cy={52+(i%3)*6} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.9"/>))}
        <rect x="66" y="44" width="8" height="48" fill="#CC8833" opacity="0.9"/>
        <rect x="60" y="14" width="8" height="44" fill="#CC8833" opacity="0.9"/>
        <ellipse cx="64" cy="14" rx="10" ry="8" fill="#CC8833" opacity="0.9"/>
        <TreasureChest x={240} y={70} w={44} h={28}/>
        <FacedCoin cx={298} cy={56} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={11} fill="#FFE066" stroke="#996633"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t090)" opacity="0.58" letterSpacing="1.5">SAFARI</text>
    </svg>
  );
}

export function IllT091({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t091" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#1A3355"/><stop offset="100%" stopColor="#060E1A"/></radialGradient>
        <linearGradient id="lg-t091" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFD700"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFD700"/></linearGradient>
        <filter id="f-t091" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="91" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t091)"/>
      {[0,1,2].map(i=>(<path key={i} d={`M0,${80+i*8} Q44,${72+i*8} 88,${80+i*8} Q132,${88+i*8} 176,${80+i*8} Q220,${72+i*8} 264,${80+i*8} Q308,${88+i*8} 352,${80+i*8}`} stroke="#2255AA" strokeWidth="1.5" fill="none" opacity="0.5"/>))}
      <g filter="url(#f-t091)">
        <polygon points="108,88 244,88 228,60 124,60" fill="#4A2800" stroke="#3A1F00" strokeWidth="1.5"/>
        <rect x="172" y="20" width="4" height="42" fill="#3A1F00"/>
        <polygon points="176,22 176,58 224,50" fill="#EEDDCC" stroke="#AA9966" strokeWidth="1"/>
        <rect x="130" y="24" width="30" height="20" fill="#1A1A1A"/>
        <circle cx="145" cy="30" r="5" fill="white"/>
        <line x1="140" y1="36" x2="150" y2="36" stroke="white" strokeWidth="1.5"/>
        <TreasureChest x={130} y={56} w={36} h={22}/>
        {[[100,70],[90,60],[84,72],[290,65],[300,72],[310,60]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r={4} fill="#FFD700" stroke="#B8860B" strokeWidth="0.7" opacity="0.85"/>))}
        <FacedCoin cx={280} cy={78} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={20} r={11} fill="#FFD700" stroke="#B8860B"/>
      <WinkingStar cx={322} cy={20} r={11} fill="#FFD700" stroke="#B8860B"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t091)" opacity="0.58" letterSpacing="1.5">PLUNDER</text>
    </svg>
  );
}

export function IllT092({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t092" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#DD8833"/><stop offset="100%" stopColor="#663300"/></radialGradient>
        <linearGradient id="lg-t092" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFD700"/><stop offset="50%" stopColor="#FFEECC"/><stop offset="100%" stopColor="#FFD700"/></linearGradient>
        <filter id="f-t092" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="92" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t092)"/>
      <rect x="0" y="84" width="352" height="28" fill="#AA6622" opacity="0.8"/>
      {[40,310].map((x,i)=>(<g key={i}><rect x={x-4} y={50} width="8" height="40" fill="#336633"/><rect x={x-14} y={58} width="10" height="6" fill="#336633"/><rect x={x+4} y={62} width="10" height="6" fill="#336633"/></g>))}
      <g filter="url(#f-t092)">
        <rect x="120" y="20" width="112" height="68" fill="#8B5500" stroke="#5A3300" strokeWidth="2"/>
        <rect x="130" y="16" width="92" height="10" rx="2" fill="#AA7700"/>
        <rect x="136" y="28" width="80" height="18" fill="#CC9933" stroke="#AA7700" strokeWidth="1"/>
        <text x="176" y="41" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="#3A1F00">LUCKY SALOON</text>
        <rect x="132" y="50" width="24" height="20" rx="2" fill="#FFDDAA" stroke="#AA7700" strokeWidth="1"/>
        <rect x="196" y="50" width="24" height="20" rx="2" fill="#FFDDAA" stroke="#AA7700" strokeWidth="1"/>
        <rect x="162" y="56" width="28" height="32" rx="2" fill="#6B3A00"/>
        <CoinStack x={82} y={86} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={270} y={86} count={4} r={9} fill="#FFD700" rim="#B8860B"/>
        <FacedCoin cx={176} cy={80} r={10} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={11} fill="#FFD700" stroke="#AA6600"/>
      <WinkingStar cx={320} cy={22} r={11} fill="#FFD700" stroke="#AA6600"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t092)" opacity="0.58" letterSpacing="1.5">BONANZA</text>
    </svg>
  );
}

export function IllT093({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t093" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#FF88BB"/><stop offset="100%" stopColor="#AA2266"/></radialGradient>
        <linearGradient id="lg-t093" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFD700"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FFD700"/></linearGradient>
        <filter id="f-t093" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="93" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t093)"/>
      <g filter="url(#f-t093)">
        <circle cx="176" cy="44" r="28" fill="#FF4488" stroke="#CC1155" strokeWidth="2"/>
        {[0,1,2,3].map(i=>(<path key={i} d={`M176,44 Q${176+24*Math.cos(i*90*Math.PI/180)},${44+24*Math.sin(i*90*Math.PI/180)} ${176+16*Math.cos((i*90+45)*Math.PI/180)},${44+16*Math.sin((i*90+45)*Math.PI/180)}`} stroke="white" strokeWidth="4" fill="none" opacity="0.5"/>))}
        <rect x="172" y="68" width="8" height="34" rx="3" fill="#AAAAAA"/>
        {[[50,60],[302,60]].map(([x,y],i)=>(<g key={i}><path d={`M${x},${y+20} L${x},${y} Q${x},${y-15} ${x+15*(-1+2*i)},${y-15}`} stroke="#FF4444" strokeWidth="6" fill="none" strokeLinecap="round"/><path d={`M${x},${y+20} L${x},${y} Q${x},${y-15} ${x+15*(-1+2*i)},${y-15}`} stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="6,6"/></g>))}
        {[[100,25],[130,15],[220,20],[250,28],[80,72],[270,72]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r={6} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>))}
        <FacedCoin cx={176} cy={100} r={8} fill="#FFD700" rim="#B8860B"/>
      </g>
      <WinkingStar cx={32} cy={22} r={11} fill="#FFDDEE" stroke="#FF4488"/>
      <WinkingStar cx={320} cy={22} r={11} fill="#FFDDEE" stroke="#FF4488"/>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="13" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t093)" opacity="0.58" letterSpacing="1.5">CANDY CASH</text>
    </svg>
  );
}

export function IllT094({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t094" cx="50%" cy="50%" r="70%"><stop offset="0%" stopColor="#110033"/><stop offset="100%" stopColor="#030008"/></radialGradient>
        <linearGradient id="lg-t094" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF44FF"/><stop offset="50%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#FF44FF"/></linearGradient>
        <filter id="f-t094" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="94" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t094)"/>
      <g filter="url(#f-t094)">
        <rect x="90" y="18" width="172" height="60" rx="6" fill="none" stroke="#FF00FF" strokeWidth="2" opacity="0.7"/>
        <rect x="96" y="24" width="160" height="48" rx="4" fill="none" stroke="#00FFFF" strokeWidth="1.5" opacity="0.5"/>
        <text x="176" y="60" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontSize="40" fontWeight="900" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8">$</text>
        <rect x="0" y="84" width="352" height="28" fill="#110033" opacity="0.6"/>
        {[90,130,176,220,262].map((x,i)=>(<line key={i} x1={x} y1="84" x2={x} y2="112" stroke={['#FF00FF','#00FFFF','#FFD700','#FF4400','#44FF44'][i]} strokeWidth="2" opacity="0.3"/>))}
        {[[50,78],[100,72],[252,72],[302,78]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r={5} fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" opacity="0.85"/>))}
        <FacedCoin cx={176} cy={90} r={9} fill="#FFD700" rim="#B8860B"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t094)" opacity="0.58" letterSpacing="1.5">NEON NIGHTS</text>
    </svg>
  );
}

export function IllT095({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t095" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#6B2D8B"/>
          <stop offset="55%" stopColor="#9B1B6B"/>
          <stop offset="100%" stopColor="#3A0A2E"/>
        </radialGradient>
        <linearGradient id="lg-t095" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF69B4"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#FF69B4"/>
        </linearGradient>
        <filter id="f-t095" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="95" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t095)"/>
      <g filter="url(#f-t095)">
        <Burst cx={60} cy={56} r1={18} r2={32} pts={14} fill="#FF69B4" opacity={0.55}/>
        <Burst cx={292} cy={56} r1={18} r2={32} pts={14} fill="#FFD700" opacity={0.55}/>
        {[0,1,2,3,4].map(i=>(
          <circle key={i} cx={80+i*40} cy={35} r={6} fill={['#FF69B4','#FFD700','#FF4488','#FFD700','#FF69B4'][i]} opacity={0.8}/>
        ))}
        <TreasureChest x={140} y={30} w={72} h={48}/>
        <WinkingStar cx={50} cy={28} r={13} fill="#FFD700" stroke="#B8860B"/>
        <WinkingStar cx={302} cy={28} r={13} fill="#FF69B4" stroke="#9B1B6B"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t095)" opacity="0.58" letterSpacing="1.5">MARDI GRAS MILLIONS</text>
    </svg>
  );
}

export function IllT096({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-t096" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#001F3F"/>
          <stop offset="50%" stopColor="#0A3D6B"/>
          <stop offset="100%" stopColor="#001F3F"/>
        </linearGradient>
        <linearGradient id="lg-t096" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4FC3F7"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#4FC3F7"/>
        </linearGradient>
        <filter id="f-t096" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="96" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t096)"/>
      <g filter="url(#f-t096)">
        {[0,1,2,3,4,5,6,7].map(i=>(
          <circle key={i} cx={30+i*42} cy={25} r={3} fill="#4FC3F7" opacity={0.6+(i%3)*0.1}/>
        ))}
        <ellipse cx={176} cy={56} rx={55} ry={30} fill="none" stroke="#4FC3F7" strokeWidth="1.5" opacity={0.5}/>
        <ellipse cx={176} cy={56} rx={35} ry={18} fill="none" stroke="#87CEEB" strokeWidth="1" opacity={0.4}/>
        <FacedCoin cx={176} cy={56} r={22} fill="#4FC3F7" rim="#001F3F"/>
        <WinkingStar cx={50} cy={56} r={14} fill="#4FC3F7" stroke="#001F3F"/>
        <WinkingStar cx={302} cy={56} r={14} fill="#4FC3F7" stroke="#001F3F"/>
        <CoinStack x={95} y={85} count={3} r={10} fill="#4FC3F7" rim="#001F3F"/>
        <CoinStack x={257} y={85} count={3} r={10} fill="#4FC3F7" rim="#001F3F"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t096)" opacity="0.58" letterSpacing="1.5">BLUE MOON BONANZA</text>
    </svg>
  );
}

export function IllT097({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t097" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#8B0000"/>
          <stop offset="55%" stopColor="#5C0A0A"/>
          <stop offset="100%" stopColor="#1A0000"/>
        </radialGradient>
        <linearGradient id="lg-t097" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FF4444"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <filter id="f-t097" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="97" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t097)"/>
      <g filter="url(#f-t097)">
        <Burst cx={176} cy={56} r1={28} r2={50} pts={16} fill="#8B0000" opacity={0.4}/>
        {[30,80,130,176,222,272,322].map((x,i)=>(
          <polygon key={i} points={`${x},15 ${x-6},30 ${x+6},30`} fill="#FF4444" opacity={0.7}/>
        ))}
        <TreasureChest x={132} y={28} w={88} h={55}/>
        <WinkingStar cx={40} cy={56} r={16} fill="#FFD700" stroke="#8B0000"/>
        <WinkingStar cx={312} cy={56} r={16} fill="#FFD700" stroke="#8B0000"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t097)" opacity="0.58" letterSpacing="1.5">SCARLET FORTUNE</text>
    </svg>
  );
}

export function IllT098({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-t098" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A4A1A"/>
          <stop offset="50%" stopColor="#2D7A2D"/>
          <stop offset="100%" stopColor="#0D2A0D"/>
        </linearGradient>
        <linearGradient id="lg-t098" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#90EE90"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#90EE90"/>
        </linearGradient>
        <filter id="f-t098" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="98" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t098)"/>
      <g filter="url(#f-t098)">
        {[0,1,2,3,4].map(i=>(
          <ellipse key={i} cx={40+i*68} cy={70} rx={12} ry={20} fill="#2D7A2D" stroke="#90EE90" strokeWidth="1" opacity={0.7}/>
        ))}
        <CoinStack x={110} y={82} count={5} r={14} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={176} y={78} count={6} r={14} fill="#FFD700" rim="#B8860B"/>
        <CoinStack x={242} y={82} count={5} r={14} fill="#FFD700" rim="#B8860B"/>
        <WinkingStar cx={50} cy={30} r={15} fill="#90EE90" stroke="#1A4A1A"/>
        <WinkingStar cx={302} cy={30} r={15} fill="#90EE90" stroke="#1A4A1A"/>
        <Bunting x1={20} y1={18} x2={332} y2={18} n={10} colors={['#90EE90','#FFD700','#2D7A2D','#FFFACD','#4CAF50']}/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t098)" opacity="0.58" letterSpacing="1.5">LUCKY CLOVER CASH</text>
    </svg>
  );
}

export function IllT099({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t099" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#FF8C00"/>
          <stop offset="55%" stopColor="#CC5500"/>
          <stop offset="100%" stopColor="#6B2800"/>
        </radialGradient>
        <linearGradient id="lg-t099" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FFF8DC"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <filter id="f-t099" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="99" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t099)"/>
      <g filter="url(#f-t099)">
        <Burst cx={176} cy={56} r1={22} r2={42} pts={18} fill="#FF8C00" opacity={0.45}/>
        {[20,60,100,140,176,212,252,292,332].map((x,i)=>(
          <rect key={i} x={x-4} y={10} width={8} height={i%2===0?25:18} rx={2} fill="#FFD700" opacity={0.6}/>
        ))}
        <FacedCoin cx={120} cy={58} r={24} fill="#FF8C00" rim="#6B2800"/>
        <FacedCoin cx={176} cy={55} r={28} fill="#FFD700" rim="#B8860B"/>
        <FacedCoin cx={232} cy={58} r={24} fill="#FF8C00" rim="#6B2800"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t099)" opacity="0.58" letterSpacing="1.5">HARVEST JACKPOT</text>
    </svg>
  );
}

export function IllT100({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t100" cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="40%" stopColor="#DAA520"/>
          <stop offset="100%" stopColor="#8B6000"/>
        </radialGradient>
        <linearGradient id="lg-t100" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFF8DC"/>
          <stop offset="30%" stopColor="#FFD700"/>
          <stop offset="70%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#FFF8DC"/>
        </linearGradient>
        <filter id="f-t100" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="100" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t100)"/>
      <g filter="url(#f-t100)">
        <text x="176" y="52" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="44" fill="#8B6000" opacity={0.18} letterSpacing="2">100</text>
        <Burst cx={80} cy={40} r1={14} r2={26} pts={12} fill="#FFF8DC" opacity={0.6}/>
        <Burst cx={272} cy={40} r1={14} r2={26} pts={12} fill="#FFF8DC" opacity={0.6}/>
        <TreasureChest x={132} y={28} w={88} h={55}/>
        <WinkingStar cx={50} cy={30} r={14} fill="#FFF8DC" stroke="#8B6000"/>
        <WinkingStar cx={302} cy={30} r={14} fill="#FFF8DC" stroke="#8B6000"/>
        <WinkingStar cx={50} cy={80} r={11} fill="#DAA520" stroke="#8B6000"/>
        <WinkingStar cx={302} cy={80} r={11} fill="#DAA520" stroke="#8B6000"/>
        <Bunting x1={20} y1={14} x2={332} y2={14} n={11} colors={['#FFF8DC','#DAA520','#8B6000','#FFD700','#FFF8DC']}/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="16" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t100)" opacity="0.62" letterSpacing="2">CENTURY GOLD</text>
    </svg>
  );
}

export function IllT101({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t101" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#4A0080"/>
          <stop offset="55%" stopColor="#2D0050"/>
          <stop offset="100%" stopColor="#0A0020"/>
        </radialGradient>
        <linearGradient id="lg-t101" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DA70D6"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#DA70D6"/>
        </linearGradient>
        <filter id="f-t101" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="101" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t101)"/>
      <g filter="url(#f-t101)">
        {[0,1,2,3,4,5,6].map(i=>(
          <circle key={i} cx={25+i*50} cy={30+Math.sin(i)*15} r={4+(i%3)} fill={['#DA70D6','#FFD700','#9B30FF'][i%3]} opacity={0.7}/>
        ))}
        <ellipse cx={176} cy={55} rx={60} ry={32} fill="none" stroke="#DA70D6" strokeWidth="2" opacity={0.4}/>
        <FacedCoin cx={176} cy={55} r={26} fill="#9B30FF" rim="#4A0080"/>
        <Burst cx={50} cy={55} r1={14} r2={26} pts={10} fill="#DA70D6" opacity={0.55}/>
        <Burst cx={302} cy={55} r1={14} r2={26} pts={10} fill="#FFD700" opacity={0.55}/>
        <CoinStack x={100} y={85} count={3} r={10} fill="#DA70D6" rim="#4A0080"/>
        <CoinStack x={252} y={85} count={3} r={10} fill="#DA70D6" rim="#4A0080"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t101)" opacity="0.58" letterSpacing="1.5">MYSTIC MILLIONS</text>
    </svg>
  );
}

export function IllT102({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-t102" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5C4A00"/>
          <stop offset="50%" stopColor="#8B7000"/>
          <stop offset="100%" stopColor="#3A2E00"/>
        </linearGradient>
        <linearGradient id="lg-t102" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FFF8DC"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <filter id="f-t102" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="102" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t102)"/>
      <g filter="url(#f-t102)">
        <Bunting x1={20} y1={16} x2={332} y2={16} n={12} colors={['#FFD700','#8B7000','#FFF8DC','#DAA520','#FFD700']}/>
        <CoinStack x={80} y={85} count={4} r={13} fill="#FFD700" rim="#5C4A00"/>
        <TreasureChest x={130} y={30} w={92} h={54}/>
        <CoinStack x={272} y={85} count={4} r={13} fill="#FFD700" rim="#5C4A00"/>
        <WinkingStar cx={40} cy={56} r={15} fill="#FFD700" stroke="#5C4A00"/>
        <WinkingStar cx={312} cy={56} r={15} fill="#FFD700" stroke="#5C4A00"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t102)" opacity="0.58" letterSpacing="1.5">GILDED VAULT</text>
    </svg>
  );
}

export function IllT103({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t103" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#FF6600"/>
          <stop offset="55%" stopColor="#CC3300"/>
          <stop offset="100%" stopColor="#660000"/>
        </radialGradient>
        <linearGradient id="lg-t103" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FF6600"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <filter id="f-t103" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="103" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t103)"/>
      <g filter="url(#f-t103)">
        <Burst cx={176} cy={56} r1={25} r2={48} pts={20} fill="#FF6600" opacity={0.4}/>
        {[40,100,176,252,312].map((x,i)=>(
          <WinkingStar key={i} cx={x} cy={i%2===0?30:70} r={i===2?20:13} fill="#FFD700" stroke="#CC3300"/>
        ))}
        <FacedCoin cx={176} cy={55} r={26} fill="#FF6600" rim="#660000"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t103)" opacity="0.58" letterSpacing="1.5">FIREBALL FRENZY</text>
    </svg>
  );
}

export function IllT104({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-t104" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00264D"/>
          <stop offset="50%" stopColor="#003D7A"/>
          <stop offset="100%" stopColor="#001F3F"/>
        </linearGradient>
        <linearGradient id="lg-t104" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#87CEEB"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#87CEEB"/>
        </linearGradient>
        <filter id="f-t104" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="104" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t104)"/>
      <g filter="url(#f-t104)">
        {[0,1,2,3,4,5,6,7,8,9].map(i=>(
          <circle key={i} cx={20+i*34} cy={20+Math.cos(i*0.8)*12} r={2+(i%3)} fill="#87CEEB" opacity={0.5+(i%4)*0.1}/>
        ))}
        <ellipse cx={176} cy={60} rx={70} ry={30} fill="#003D7A" stroke="#87CEEB" strokeWidth="1.5" opacity={0.6}/>
        <FacedCoin cx={110} cy={58} r={20} fill="#87CEEB" rim="#001F3F"/>
        <FacedCoin cx={176} cy={56} r={24} fill="#FFD700" rim="#8B6000"/>
        <FacedCoin cx={242} cy={58} r={20} fill="#87CEEB" rim="#001F3F"/>
        <Burst cx={40} cy={25} r1={10} r2={20} pts={10} fill="#87CEEB" opacity={0.5}/>
        <Burst cx={312} cy={25} r1={10} r2={20} pts={10} fill="#87CEEB" opacity={0.5}/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t104)" opacity="0.58" letterSpacing="1.5">DEEP SEA DOLLARS</text>
    </svg>
  );
}

export function IllT105({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t105" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#3D1C8A"/>
          <stop offset="55%" stopColor="#280E6B"/>
          <stop offset="100%" stopColor="#0F0030"/>
        </radialGradient>
        <linearGradient id="lg-t105" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#E0B0FF"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <filter id="f-t105" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="105" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t105)"/>
      <g filter="url(#f-t105)">
        {[0,1,2,3,4,5,6,7,8,9,10].map(i=>(
          <circle key={i} cx={15+i*32} cy={12+Math.sin(i*1.1)*8} r={1.5+(i%3)*0.5} fill="#E0B0FF" opacity={0.6}/>
        ))}
        <Burst cx={176} cy={55} r1={24} r2={46} pts={14} fill="#3D1C8A" opacity={0.5}/>
        <TreasureChest x={132} y={28} w={88} h={52}/>
        <WinkingStar cx={50} cy={28} r={14} fill="#E0B0FF" stroke="#3D1C8A"/>
        <WinkingStar cx={302} cy={28} r={14} fill="#FFD700" stroke="#3D1C8A"/>
        <CoinStack x={60} y={88} count={3} r={10} fill="#E0B0FF" rim="#3D1C8A"/>
        <CoinStack x={292} y={88} count={3} r={10} fill="#FFD700" rim="#3D1C8A"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t105)" opacity="0.58" letterSpacing="1.5">COSMIC VAULT</text>
    </svg>
  );
}

export function IllT106({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-t106" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A2800"/>
          <stop offset="50%" stopColor="#7A4A00"/>
          <stop offset="100%" stopColor="#2A1400"/>
        </linearGradient>
        <linearGradient id="lg-t106" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FFA500"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <filter id="f-t106" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="106" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t106)"/>
      <g filter="url(#f-t106)">
        <Bunting x1={20} y1={18} x2={332} y2={18} n={11} colors={['#FFD700','#FFA500','#4A2800','#DAA520','#FFD700']}/>
        {[60,136,176,216,292].map((x,i)=>(
          <Burst key={i} cx={x} cy={i%2===0?50:65} r1={10} r2={i===2?25:18} pts={10} fill="#FFD700" opacity={0.45}/>
        ))}
        <FacedCoin cx={176} cy={56} r={26} fill="#FFA500" rim="#4A2800"/>
        <WinkingStar cx={50} cy={56} r={15} fill="#FFD700" stroke="#4A2800"/>
        <WinkingStar cx={302} cy={56} r={15} fill="#FFD700" stroke="#4A2800"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t106)" opacity="0.58" letterSpacing="1.5">AMBER JACKPOT</text>
    </svg>
  );
}

export function IllT107({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t107" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#006060"/>
          <stop offset="55%" stopColor="#003A3A"/>
          <stop offset="100%" stopColor="#001818"/>
        </radialGradient>
        <linearGradient id="lg-t107" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#40E0D0"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#40E0D0"/>
        </linearGradient>
        <filter id="f-t107" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="107" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t107)"/>
      <g filter="url(#f-t107)">
        {[0,1,2,3,4,5,6,7,8].map(i=>(
          <rect key={i} x={20+i*36} y={5} width={12} height={20+i%3*8} rx={2} fill="#40E0D0" opacity={0.5}/>
        ))}
        <ellipse cx={176} cy={62} rx={68} ry={28} fill="none" stroke="#40E0D0" strokeWidth="2" opacity={0.4}/>
        <TreasureChest x={130} y={30} w={92} h={54}/>
        <WinkingStar cx={50} cy={55} r={14} fill="#40E0D0" stroke="#003A3A"/>
        <WinkingStar cx={302} cy={55} r={14} fill="#40E0D0" stroke="#003A3A"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t107)" opacity="0.58" letterSpacing="1.5">TURQUOISE TREASURE</text>
    </svg>
  );
}

export function IllT108({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-t108" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2A0040"/>
          <stop offset="50%" stopColor="#480080"/>
          <stop offset="100%" stopColor="#1A0028"/>
        </linearGradient>
        <linearGradient id="lg-t108" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EE82EE"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#EE82EE"/>
        </linearGradient>
        <filter id="f-t108" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="108" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t108)"/>
      <g filter="url(#f-t108)">
        <Burst cx={176} cy={56} r1={26} r2={50} pts={16} fill="#480080" opacity={0.45}/>
        {[30,80,130,176,222,272,322].map((x,i)=>(
          <circle key={i} cx={x} cy={i%2===0?22:88} r={5-(i%3)} fill="#EE82EE" opacity={0.65}/>
        ))}
        <FacedCoin cx={120} cy={56} r={22} fill="#EE82EE" rim="#2A0040"/>
        <FacedCoin cx={176} cy={54} r={26} fill="#FFD700" rim="#8B6000"/>
        <FacedCoin cx={232} cy={56} r={22} fill="#EE82EE" rim="#2A0040"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t108)" opacity="0.58" letterSpacing="1.5">VIOLET VORTEX</text>
    </svg>
  );
}

export function IllT109({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t109" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#1A3A00"/>
          <stop offset="55%" stopColor="#0D2000"/>
          <stop offset="100%" stopColor="#050D00"/>
        </radialGradient>
        <linearGradient id="lg-t109" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7CFC00"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#7CFC00"/>
        </linearGradient>
        <filter id="f-t109" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="109" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t109)"/>
      <g filter="url(#f-t109)">
        {[0,1,2,3,4,5,6,7,8,9].map(i=>(
          <rect key={i} x={15+i*34} y={0} width={2} height={20+Math.sin(i)*10} fill="#7CFC00" opacity={0.4}/>
        ))}
        <CoinStack x={80} y={85} count={5} r={13} fill="#7CFC00" rim="#1A3A00"/>
        <TreasureChest x={128} y={28} w={96} h={56}/>
        <CoinStack x={272} y={85} count={5} r={13} fill="#7CFC00" rim="#1A3A00"/>
        <Burst cx={40} cy={28} r1={12} r2={22} pts={12} fill="#7CFC00" opacity={0.5}/>
        <Burst cx={312} cy={28} r1={12} r2={22} pts={12} fill="#7CFC00" opacity={0.5}/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t109)" opacity="0.58" letterSpacing="1.5">MATRIX MONEY</text>
    </svg>
  );
}

export function IllT110({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-t110" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B0000"/>
          <stop offset="35%" stopColor="#FFFFFF"/>
          <stop offset="65%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#00008B"/>
        </linearGradient>
        <linearGradient id="lg-t110" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF4444"/>
          <stop offset="50%" stopColor="#4444FF"/>
          <stop offset="100%" stopColor="#FF4444"/>
        </linearGradient>
        <filter id="f-t110" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="110" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t110)"/>
      <g filter="url(#f-t110)">
        {[0,1,2,3,4,5].map(i=>(
          <polygon key={i} points={`${20+i*54},8 ${30+i*54},8 ${25+i*54},18`} fill={i%2===0?'#FF4444':'#4444FF'} opacity={0.7}/>
        ))}
        <Burst cx={176} cy={55} r1={20} r2={38} pts={12} fill="#FF4444" opacity={0.3}/>
        <FacedCoin cx={176} cy={55} r={26} fill="#FFD700" rim="#8B6000"/>
        <WinkingStar cx={50} cy={30} r={14} fill="#FF4444" stroke="#8B0000"/>
        <WinkingStar cx={302} cy={30} r={14} fill="#4444FF" stroke="#00008B"/>
        <WinkingStar cx={50} cy={80} r={12} fill="#4444FF" stroke="#00008B"/>
        <WinkingStar cx={302} cy={80} r={12} fill="#FF4444" stroke="#8B0000"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t110)" opacity="0.58" letterSpacing="1.5">PATRIOT PRIZE</text>
    </svg>
  );
}

export function IllT111({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t111" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#604020"/>
          <stop offset="55%" stopColor="#402810"/>
          <stop offset="100%" stopColor="#1A0E00"/>
        </radialGradient>
        <linearGradient id="lg-t111" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DEB887"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#DEB887"/>
        </linearGradient>
        <filter id="f-t111" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="111" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t111)"/>
      <g filter="url(#f-t111)">
        <Bunting x1={20} y1={16} x2={332} y2={16} n={12} colors={['#DEB887','#FFD700','#604020','#F5DEB3','#DEB887']}/>
        <TreasureChest x={80} y={35} w={70} h={44}/>
        <TreasureChest x={202} y={35} w={70} h={44}/>
        <CoinStack x={176} y={82} count={4} r={12} fill="#FFD700" rim="#604020"/>
        <WinkingStar cx={40} cy={56} r={14} fill="#DEB887" stroke="#604020"/>
        <WinkingStar cx={312} cy={56} r={14} fill="#DEB887" stroke="#604020"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t111)" opacity="0.58" letterSpacing="1.5">BUCCANEER BOUNTY</text>
    </svg>
  );
}

export function IllT112({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-t112" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#003020"/>
          <stop offset="50%" stopColor="#005A3A"/>
          <stop offset="100%" stopColor="#001A10"/>
        </linearGradient>
        <linearGradient id="lg-t112" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00FF88"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#00FF88"/>
        </linearGradient>
        <filter id="f-t112" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="112" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t112)"/>
      <g filter="url(#f-t112)">
        {[0,1,2,3,4,5,6,7].map(i=>(
          <circle key={i} cx={20+i*44} cy={i%2===0?18:94} r={4} fill="#00FF88" opacity={0.55}/>
        ))}
        <ellipse cx={176} cy={56} rx={62} ry={30} fill="none" stroke="#00FF88" strokeWidth="2" opacity={0.4}/>
        <FacedCoin cx={120} cy={56} r={20} fill="#00FF88" rim="#003020"/>
        <FacedCoin cx={176} cy={54} r={24} fill="#FFD700" rim="#8B6000"/>
        <FacedCoin cx={232} cy={56} r={20} fill="#00FF88" rim="#003020"/>
        <Burst cx={50} cy={28} r1={10} r2={20} pts={10} fill="#00FF88" opacity={0.5}/>
        <Burst cx={302} cy={28} r1={10} r2={20} pts={10} fill="#00FF88" opacity={0.5}/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t112)" opacity="0.58" letterSpacing="1.5">EMERALD EMPIRE</text>
    </svg>
  );
}

export function IllT113({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t113" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#FF3300"/>
          <stop offset="55%" stopColor="#CC2200"/>
          <stop offset="100%" stopColor="#660000"/>
        </radialGradient>
        <linearGradient id="lg-t113" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FF6600"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <filter id="f-t113" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="113" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t113)"/>
      <g filter="url(#f-t113)">
        <Burst cx={176} cy={56} r1={30} r2={55} pts={22} fill="#FF3300" opacity={0.35}/>
        {[0,1,2,3,4].map(i=>(
          <WinkingStar key={i} cx={35+i*70} cy={30+Math.cos(i*1.2)*20} r={12+(i===2?6:0)} fill="#FFD700" stroke="#CC2200"/>
        ))}
        <FacedCoin cx={176} cy={56} r={26} fill="#FF3300" rim="#660000"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="14" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t113)" opacity="0.58" letterSpacing="1.5">DRAGON FIRE RICHES</text>
    </svg>
  );
}

export function IllT114({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-t114" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1C1C5E"/>
          <stop offset="50%" stopColor="#2D2D8F"/>
          <stop offset="100%" stopColor="#0A0A2E"/>
        </linearGradient>
        <linearGradient id="lg-t114" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C0C0FF"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#C0C0FF"/>
        </linearGradient>
        <filter id="f-t114" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="114" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t114)"/>
      <g filter="url(#f-t114)">
        {[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>(
          <circle key={i} cx={10+i*30} cy={8+Math.sin(i*0.7)*6} r={1+(i%4)*0.5} fill="#C0C0FF" opacity={0.5}/>
        ))}
        <ellipse cx={176} cy={56} rx={65} ry={30} fill="none" stroke="#C0C0FF" strokeWidth="1.5" opacity={0.4}/>
        <TreasureChest x={130} y={30} w={92} h={54}/>
        <Burst cx={50} cy={56} r1={12} r2={24} pts={12} fill="#C0C0FF" opacity={0.5}/>
        <Burst cx={302} cy={56} r1={12} r2={24} pts={12} fill="#FFD700" opacity={0.5}/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t114)" opacity="0.58" letterSpacing="1.5">MIDNIGHT MILLIONS</text>
    </svg>
  );
}

export function IllT115({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t115" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#FF1493"/>
          <stop offset="55%" stopColor="#CC0066"/>
          <stop offset="100%" stopColor="#660033"/>
        </radialGradient>
        <linearGradient id="lg-t115" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FF69B4"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <filter id="f-t115" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="115" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t115)"/>
      <g filter="url(#f-t115)">
        {[0,1,2,3,4,5,6].map(i=>(
          <ellipse key={i} cx={25+i*50} cy={i%2===0?25:85} rx={8} ry={5} fill="#FFD700" opacity={0.6}/>
        ))}
        <Burst cx={176} cy={56} r1={22} r2={44} pts={16} fill="#FF1493" opacity={0.4}/>
        <FacedCoin cx={110} cy={56} r={22} fill="#FF69B4" rim="#660033"/>
        <FacedCoin cx={176} cy={54} r={26} fill="#FFD700" rim="#8B6000"/>
        <FacedCoin cx={242} cy={56} r={22} fill="#FF69B4" rim="#660033"/>
        <WinkingStar cx={50} cy={30} r={13} fill="#FFD700" stroke="#660033"/>
        <WinkingStar cx={302} cy={30} r={13} fill="#FFD700" stroke="#660033"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t115)" opacity="0.58" letterSpacing="1.5">SWEET HEART GOLD</text>
    </svg>
  );
}

export function IllT116({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-t116" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A1A00"/>
          <stop offset="50%" stopColor="#3A3A00"/>
          <stop offset="100%" stopColor="#0A0A00"/>
        </linearGradient>
        <linearGradient id="lg-t116" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFF44"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#FFFF44"/>
        </linearGradient>
        <filter id="f-t116" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="116" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t116)"/>
      <g filter="url(#f-t116)">
        {[0,1,2,3,4,5,6,7,8,9,10].map(i=>(
          <circle key={i} cx={10+i*32} cy={10+Math.cos(i*0.9)*8} r={2} fill="#FFFF44" opacity={0.55}/>
        ))}
        <Burst cx={50} cy={56} r1={16} r2={30} pts={14} fill="#FFFF44" opacity={0.5}/>
        <TreasureChest x={120} y={28} w={112} h={60}/>
        <Burst cx={302} cy={56} r1={16} r2={30} pts={14} fill="#FFFF44" opacity={0.5}/>
        <CoinStack x={60} y={88} count={3} r={10} fill="#FFFF44" rim="#1A1A00"/>
        <CoinStack x={292} y={88} count={3} r={10} fill="#FFFF44" rim="#1A1A00"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t116)" opacity="0.58" letterSpacing="1.5">LIGHTNING LOOT</text>
    </svg>
  );
}

export function IllT117({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t117" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#3C1414"/>
          <stop offset="55%" stopColor="#5C2020"/>
          <stop offset="100%" stopColor="#1A0A0A"/>
        </radialGradient>
        <linearGradient id="lg-t117" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#CD853F"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#CD853F"/>
        </linearGradient>
        <filter id="f-t117" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="117" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t117)"/>
      <g filter="url(#f-t117)">
        <Bunting x1={20} y1={18} x2={332} y2={18} n={10} colors={['#CD853F','#FFD700','#3C1414','#D2691E','#CD853F']}/>
        {[60,110,176,242,292].map((x,i)=>(
          <Burst key={i} cx={x} cy={60} r1={10+(i===2?8:0)} r2={20+(i===2?14:0)} pts={12} fill="#CD853F" opacity={0.45}/>
        ))}
        <FacedCoin cx={176} cy={56} r={26} fill="#CD853F" rim="#3C1414"/>
        <WinkingStar cx={50} cy={55} r={14} fill="#CD853F" stroke="#3C1414"/>
        <WinkingStar cx={302} cy={55} r={14} fill="#FFD700" stroke="#3C1414"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t117)" opacity="0.58" letterSpacing="1.5">COPPER CANYON CASH</text>
    </svg>
  );
}

export function IllT118({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-t118" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#002040"/>
          <stop offset="50%" stopColor="#003A70"/>
          <stop offset="100%" stopColor="#001020"/>
        </linearGradient>
        <linearGradient id="lg-t118" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7EB8FF"/>
          <stop offset="50%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#7EB8FF"/>
        </linearGradient>
        <filter id="f-t118" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="118" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t118)"/>
      <g filter="url(#f-t118)">
        {[0,1,2,3,4,5,6,7,8,9].map(i=>(
          <circle key={i} cx={15+i*36} cy={15+Math.sin(i*0.8)*8} r={1.5+(i%3)*0.7} fill="#7EB8FF" opacity={0.55}/>
        ))}
        <ellipse cx={176} cy={58} rx={70} ry={30} fill="none" stroke="#7EB8FF" strokeWidth="1.5" opacity={0.4}/>
        <TreasureChest x={130} y={30} w={92} h={54}/>
        <WinkingStar cx={50} cy={28} r={14} fill="#7EB8FF" stroke="#002040"/>
        <WinkingStar cx={302} cy={28} r={14} fill="#7EB8FF" stroke="#002040"/>
        <CoinStack x={55} y={88} count={3} r={10} fill="#7EB8FF" rim="#002040"/>
        <CoinStack x={297} y={88} count={3} r={10} fill="#7EB8FF" rim="#002040"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t118)" opacity="0.58" letterSpacing="1.5">ARCTIC WINDFALL</text>
    </svg>
  );
}

export function IllT119({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg-t119" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#8B4513"/>
          <stop offset="55%" stopColor="#6B3410"/>
          <stop offset="100%" stopColor="#2A1408"/>
        </radialGradient>
        <linearGradient id="lg-t119" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FFA500"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <filter id="f-t119" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="119" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t119)"/>
      <g filter="url(#f-t119)">
        <Burst cx={176} cy={56} r1={24} r2={45} pts={16} fill="#8B4513" opacity={0.4}/>
        {[0,1,2,3,4].map(i=>(
          <rect key={i} x={30+i*60} y={25} width={30} height={50} rx={3} fill="rgba(255,200,100,0.08)" stroke="#FFD700" strokeWidth="0.8" opacity={0.5}/>
        ))}
        <FacedCoin cx={120} cy={56} r={22} fill="#FFA500" rim="#8B4513"/>
        <FacedCoin cx={176} cy={54} r={26} fill="#FFD700" rim="#8B6000"/>
        <FacedCoin cx={232} cy={56} r={22} fill="#FFA500" rim="#8B4513"/>
        <WinkingStar cx={50} cy={28} r={13} fill="#FFD700" stroke="#8B4513"/>
        <WinkingStar cx={302} cy={28} r={13} fill="#FFD700" stroke="#8B4513"/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t119)" opacity="0.58" letterSpacing="1.5">FRONTIER FORTUNE</text>
    </svg>
  );
}

export function IllT120({ palette }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-t120" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B"/>
          <stop offset="35%" stopColor="#FFD93D"/>
          <stop offset="65%" stopColor="#6BCB77"/>
          <stop offset="100%" stopColor="#4D96FF"/>
        </linearGradient>
        <linearGradient id="lg-t120" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="25%" stopColor="#FFD700"/>
          <stop offset="75%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#FFFFFF"/>
        </linearGradient>
        <filter id="f-t120" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.055" numOctaves="2" seed="120" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="352" height="112" fill="url(#bg-t120)"/>
      <g filter="url(#f-t120)">
        <Bunting x1={20} y1={16} x2={332} y2={16} n={14} colors={['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#DA70D6']}/>
        <WinkingStar cx={50} cy={56} r={16} fill="#FFD93D" stroke="#8B6000"/>
        <TreasureChest x={120} y={26} w={112} h={62}/>
        <WinkingStar cx={302} cy={56} r={16} fill="#6BCB77" stroke="#1A4A1A"/>
        <CoinStack x={60} y={88} count={4} r={11} fill="#FFD700" rim="#8B6000"/>
        <CoinStack x={292} y={88} count={4} r={11} fill="#FFD700" rim="#8B6000"/>
        <Burst cx={176} cy={10} r1={6} r2={14} pts={12} fill="#FFFFFF" opacity={0.5}/>
      </g>
      <text x="176" y="109" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke" fill="url(#lg-t120)" opacity="0.62" letterSpacing="1.5">RETIREMENT YOLO</text>
    </svg>
  );
}

// ── Lookup map ────────────────────────────────────────────────────────────────

export const ILLUSTRATIONS = {
  t001: IllT001, t002: IllT002, t003: IllT003, t004: IllT004, t005: IllT005,
  t006: IllT006, t007: IllT007, t008: IllT008, t009: IllT009, t010: IllT010,
  t011: IllT011, t012: IllT012, t013: IllT013, t014: IllT014, t015: IllT015,
  t016: IllT016, t017: IllT017, t018: IllT018, t019: IllT019, t020: IllT020,
  t021: IllT021, t022: IllT022, t023: IllT023, t024: IllT024, t025: IllT025,
  t026: IllT026, t027: IllT027, t028: IllT028, t029: IllT029, t030: IllT030,
  t031: IllT031, t032: IllT032, t033: IllT033, t034: IllT034, t035: IllT035,
  t036: IllT036, t037: IllT037, t038: IllT038, t039: IllT039, t040: IllT040,
  t041: IllT041, t042: IllT042, t043: IllT043, t044: IllT044, t045: IllT045,
  t046: IllT046, t047: IllT047, t048: IllT048, t049: IllT049, t050: IllT050,
  t051: IllT051, t052: IllT052, t053: IllT053, t054: IllT054, t055: IllT055,
  t056: IllT056, t057: IllT057, t058: IllT058, t059: IllT059, t060: IllT060,
  t061: IllT061, t062: IllT062, t063: IllT063, t064: IllT064, t065: IllT065,
  t066: IllT066, t067: IllT067, t068: IllT068, t069: IllT069, t070: IllT070,
  t071: IllT071, t072: IllT072, t073: IllT073, t074: IllT074, t075: IllT075,
  t076: IllT076, t077: IllT077, t078: IllT078, t079: IllT079, t080: IllT080,
  t081: IllT081, t082: IllT082, t083: IllT083, t084: IllT084, t085: IllT085,
  t086: IllT086, t087: IllT087, t088: IllT088, t089: IllT089, t090: IllT090,
  t091: IllT091, t092: IllT092, t093: IllT093, t094: IllT094, t095: IllT095,
  t096: IllT096, t097: IllT097, t098: IllT098, t099: IllT099, t100: IllT100,
  t101: IllT101, t102: IllT102, t103: IllT103, t104: IllT104, t105: IllT105,
  t106: IllT106, t107: IllT107, t108: IllT108, t109: IllT109, t110: IllT110,
  t111: IllT111, t112: IllT112, t113: IllT113, t114: IllT114, t115: IllT115,
  t116: IllT116, t117: IllT117, t118: IllT118, t119: IllT119, t120: IllT120,
};

/**
 * Returns a render prop function for the given themeId, or null if not found.
 *
 * Usage in CardHeader (auto-resolved — no import needed by callers):
 *   const layer = getIllustration(theme.id);
 *   layer && layer({ width, height, palette })
 *
 * @param {string} themeId  e.g. 't001'
 * @returns {function|null}
 */
export function getIllustration(themeId) {
  const Cmp = ILLUSTRATIONS[themeId];
  if (!Cmp) return null;
  return (props) => <Cmp {...props} />;
}
