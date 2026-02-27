// ── Scene template components ────────────────────────────────────────────────
// Each template renders a complete SVG illustration from a compact config.
// Props common to all: id, bg1, bg2, mid1, mid2, fg1, fg2, acc,
//   charm ('coin'|'star'|'chest'), cx, cy, text, lg1, lg2, seed
// Templates add their own structural/thematic elements on top.

import { WinkingStar, FacedCoin, TreasureChest, Bunting, Burst, CoinStack } from './illustrations-helpers';

function Filter({ id, seed }) {
  return (
    <filter id={`f-${id}`} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.042 0.055" numOctaves="2" seed={seed} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  );
}

function Logo({ id, text, lg1, lg2 }) {
  return (
    <>
      <defs>
        <linearGradient id={`lg-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lg1} />
          <stop offset="100%" stopColor={lg2} />
        </linearGradient>
      </defs>
      <text x="176" y="101" textAnchor="middle"
        fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="17"
        stroke="rgba(0,0,0,0.60)" strokeWidth="5" paintOrder="stroke"
        fill={`url(#lg-${id})`} opacity="0.58" letterSpacing="1.5">
        {text}
      </text>
    </>
  );
}

function Charm({ charm, cx, cy, fg1, acc }) {
  if (charm === 'coin')  return <FacedCoin cx={cx} cy={cy} r={14} fill={fg1} rim={acc} />;
  if (charm === 'star')  return <WinkingStar cx={cx} cy={cy} r={13} fill={fg1} stroke={acc} />;
  if (charm === 'chest') return <TreasureChest x={cx - 22} y={cy - 15} w={44} h={30} />;
  return null;
}

// ── 1. Vault — Finance / Money ───────────────────────────────────────────────
export function TplVault({ id, bg1, bg2, mid1, mid2, fg1, fg2, acc, charm, cx, cy, text, lg1, lg2, seed }) {
  const spoke = (a) => {
    const r = 30, rad = (a - 90) * Math.PI / 180;
    return { x2: (172 + r * Math.cos(rad)).toFixed(1), y2: (50 + r * Math.sin(rad)).toFixed(1) };
  };
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="55%" r="72%">
          <stop offset="0%" stopColor={mid1} /><stop offset="100%" stopColor={bg1} />
        </radialGradient>
        <Filter id={id} seed={seed} />
      </defs>
      <rect width="352" height="112" fill={`url(#bg-${id})`} />
      {/* Scattered bills */}
      <g opacity="0.18" fill={mid2}>
        <rect x="18"  y="8"  width="52" height="22" rx="3" transform="rotate(-9,44,19)" />
        <rect x="278" y="12" width="52" height="22" rx="3" transform="rotate(11,304,23)" />
        <rect x="145" y="4"  width="44" height="18" rx="3" transform="rotate(4,167,13)" />
      </g>
      {/* Vault door */}
      <g filter={`url(#f-${id})`}>
        <circle cx="172" cy="50" r="38" fill={bg2} stroke={mid2} strokeWidth="3.5" opacity="0.88" />
        <circle cx="172" cy="50" r="29" fill="none" stroke={mid1} strokeWidth="2" opacity="0.7" />
        <circle cx="172" cy="50" r="10" fill={mid2} />
        {[0,60,120,180,240,300].map(a => { const s = spoke(a); return (
          <line key={a} x1="172" y1="50" x2={s.x2} y2={s.y2} stroke={mid1} strokeWidth="2" />
        );})}
        {/* Coin stacks */}
        <CoinStack x={108} y={82} count={3} r={11} fill={fg1} rim={acc} />
        <CoinStack x={236} y={82} count={4} r={11} fill={fg2} rim={acc} />
      </g>
      {/* Animated: coins drifting upward out of the vault */}
      <circle className="ill-coin-float" cx="138" cy="38" r="5" fill={fg1} stroke={acc} strokeWidth="1" opacity="0.72" />
      <circle className="ill-coin-float" cx="172" cy="30" r="4" fill={fg2} stroke={acc} strokeWidth="1" opacity="0.68" />
      <circle className="ill-coin-float" cx="208" cy="36" r="5" fill={fg1} stroke={acc} strokeWidth="1" opacity="0.72" />
      <Charm charm={charm} cx={cx} cy={cy} fg1={fg1} acc={acc} />
      <Logo id={id} text={text} lg1={lg1} lg2={lg2} />
    </svg>
  );
}

// ── 2. Fair — Food / Carnival ─────────────────────────────────────────────────
export function TplFair({ id, bg1, bg2, mid1, mid2, fg1, fg2, acc, charm, cx, cy, text, lg1, lg2, seed }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`bg-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={bg2} /><stop offset="100%" stopColor={bg1} />
        </linearGradient>
        <Filter id={id} seed={seed} />
      </defs>
      <rect width="352" height="112" fill={`url(#bg-${id})`} />
      {/* Carnival tent stripes */}
      <g opacity="0.12">
        {[0,1,2,3,4,5,6].map(i => (
          <rect key={i} x={i * 52} y="0" width="26" height="112" fill={mid2} />
        ))}
      </g>
      {/* Bunting */}
      <Bunting x1={10} y1={14} x2={342} y2={14} n={9}
        colors={[mid1, fg1, mid2, acc, fg2]} />
      {/* Booth frame */}
      <g filter={`url(#f-${id})`}>
        <rect x="116" y="22" width="120" height="70" rx="6"
          fill={bg2} stroke={mid2} strokeWidth="2.5" opacity="0.72" />
        <rect x="116" y="22" width="120" height="20" rx="5"
          fill={mid1} opacity="0.85" />
        {/* Prize food shape (large oval/circle midground) */}
        <ellipse cx="176" cy="64" rx="40" ry="28" fill={fg1} opacity="0.88" />
        <ellipse cx="176" cy="64" rx="32" ry="20" fill={fg2} opacity="0.60" />
        {/* Highlight */}
        <ellipse cx="162" cy="52" rx="12" ry="7" fill="rgba(255,255,255,0.35)" transform="rotate(-20,162,52)" />
      </g>
      {/* Animated: steam puffs rising from the food element */}
      <ellipse className="ill-puff" cx="157" cy="54" rx="8" ry="5" fill="rgba(255,255,255,0.55)" />
      <ellipse className="ill-puff" cx="176" cy="48" rx="10" ry="6" fill="rgba(255,255,255,0.45)" />
      <ellipse className="ill-puff" cx="196" cy="54" rx="7"  ry="4" fill="rgba(255,255,255,0.50)" />
      <Charm charm={charm} cx={cx} cy={cy} fg1={fg1} acc={acc} />
      <Burst cx={280} cy={28} r1={8} r2={16} pts={10} fill={acc} opacity={0.55} />
      <Logo id={id} text={text} lg1={lg1} lg2={lg2} />
    </svg>
  );
}

// ── 3. Stage — Pop Culture ────────────────────────────────────────────────────
export function TplStage({ id, bg1, bg2, mid1, mid2, fg1, fg2, acc, charm, cx, cy, text, lg1, lg2, seed }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor={mid1} /><stop offset="100%" stopColor={bg1} />
        </radialGradient>
        <radialGradient id={`spot-${id}`} cx="50%" cy="100%" r="80%">
          <stop offset="0%" stopColor={acc} stopOpacity="0.55" />
          <stop offset="100%" stopColor={acc} stopOpacity="0" />
        </radialGradient>
        <Filter id={id} seed={seed} />
      </defs>
      <rect width="352" height="112" fill={`url(#bg-${id})`} />
      {/* Stage curtains */}
      <path d="M0,0 C30,20 20,70 10,112 L0,112Z" fill={mid2} opacity="0.82" />
      <path d="M352,0 C322,20 332,70 342,112 L352,112Z" fill={mid2} opacity="0.82" />
      {/* Spotlight cone */}
      <ellipse cx="176" cy="112" rx="110" ry="30" fill={`url(#spot-${id})`} />
      {/* Central spotlight element */}
      <g filter={`url(#f-${id})`}>
        <circle cx="176" cy="55" r="36" fill={bg2} opacity="0.80" stroke={acc} strokeWidth="2" />
        <circle cx="176" cy="55" r="26" fill={fg1} opacity="0.65" />
        {/* Star detail */}
        <polygon points={
          Array.from({length:10},(_,i)=>{const a=(i*36-90)*Math.PI/180,d=i%2?11:22;
            return `${(176+d*Math.cos(a)).toFixed(1)},${(55+d*Math.sin(a)).toFixed(1)}`;}).join(' ')
        } fill={acc} opacity="0.80" />
        {/* Bill rain */}
        {[-55,-28,0,28,55].map(dx => (
          <rect key={dx} x={172+dx} y={75} width={14} height={6} rx="2"
            fill={fg2} opacity="0.60" transform={`rotate(${dx*0.8},176,78)`} />
        ))}
      </g>
      {/* Animated: stage sparkles twinkling in the spotlight */}
      <circle className="ill-twinkle" cx="60"  cy="28" r="3.5" fill={acc} />
      <circle className="ill-twinkle" cx="292" cy="30" r="3.0" fill={acc} />
      <circle className="ill-twinkle" cx="88"  cy="58" r="2.5" fill={fg2} />
      <Charm charm={charm} cx={cx} cy={cy} fg1={fg1} acc={acc} />
      <Logo id={id} text={text} lg1={lg1} lg2={lg2} />
    </svg>
  );
}

// ── 4. Arena — Sports ─────────────────────────────────────────────────────────
export function TplArena({ id, bg1, bg2, mid1, mid2, fg1, fg2, acc, charm, cx, cy, text, lg1, lg2, seed }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`bg-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={bg1} /><stop offset="100%" stopColor={bg2} />
        </linearGradient>
        <Filter id={id} seed={seed} />
      </defs>
      <rect width="352" height="112" fill={`url(#bg-${id})`} />
      {/* Stadium light beams */}
      <g opacity="0.14">
        <polygon points="20,0 40,0 120,112 0,112"  fill={mid1} />
        <polygon points="310,0 332,0 352,112 232,112" fill={mid1} />
      </g>
      {/* Playing surface */}
      <ellipse cx="176" cy="90" rx="155" ry="32" fill={mid2} opacity="0.55" />
      <ellipse cx="176" cy="90" rx="100" ry="20" fill="none" stroke={mid1} strokeWidth="1.5" opacity="0.5" />
      {/* Central arena element */}
      <g filter={`url(#f-${id})`}>
        <circle cx="176" cy="52" r="30" fill={bg2} stroke={acc} strokeWidth="2.5" opacity="0.88" />
        <circle cx="176" cy="52" r="20" fill={fg1} opacity="0.78" />
        {/* Motion lines */}
        {[-40,-20,0,20,40].map((dx,i) => (
          <line key={i} x1={176+dx} y1="22" x2={176+dx*1.4} y2="82"
            stroke={acc} strokeWidth="1" opacity="0.35" />
        ))}
        <CoinStack x={80}  y={90} count={3} r={10} fill={fg1} rim={acc} />
        <CoinStack x={272} y={90} count={3} r={10} fill={fg2} rim={acc} />
      </g>
      {/* Animated: camera flash bursts from the stands */}
      <circle className="ill-flash" cx="42"  cy="24" r="11" fill="rgba(255,255,255,0.72)" />
      <circle className="ill-flash" cx="310" cy="24" r="11" fill="rgba(255,255,255,0.72)" />
      <Charm charm={charm} cx={cx} cy={cy} fg1={fg1} acc={acc} />
      <Burst cx={300} cy={22} r1={7} r2={14} pts={10} fill={acc} opacity={0.50} />
      <Logo id={id} text={text} lg1={lg1} lg2={lg2} />
    </svg>
  );
}

// ── 5. Capitol — Political / Historical ──────────────────────────────────────
export function TplCapitol({ id, bg1, bg2, mid1, mid2, fg1, fg2, acc, charm, cx, cy, text, lg1, lg2, seed }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`bg-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={bg2} /><stop offset="100%" stopColor={bg1} />
        </linearGradient>
        <Filter id={id} seed={seed} />
      </defs>
      <rect width="352" height="112" fill={`url(#bg-${id})`} />
      {/* Stars in sky */}
      {[30,75,130,200,270,320].map((x, i) => (
        <WinkingStar key={i} cx={x} cy={10 + (i % 3) * 8} r={4} fill={acc} stroke={mid1} />
      ))}
      {/* Building */}
      <g filter={`url(#f-${id})`}>
        <rect x="116" y="50" width="120" height="62" fill={mid2} opacity="0.82" />
        {/* Columns */}
        {[126,146,166,186,206,226].map(x => (
          <rect key={x} x={x} y="42" width="8" height="70" rx="2" fill={mid1} opacity="0.75" />
        ))}
        {/* Pediment */}
        <polygon points="106,52 176,18 246,52" fill={mid2} stroke={mid1} strokeWidth="1.5" />
        {/* Dome */}
        <ellipse cx="176" cy="28" rx="24" ry="14" fill={bg2} stroke={acc} strokeWidth="1.5" />
        {/* Coin rain */}
        {[-50,-25,0,25,50].map(dx => (
          <circle key={dx} cx={176+dx} cy={70+Math.abs(dx)*0.3} r={5}
            fill={fg1} stroke={acc} strokeWidth="1" opacity="0.75" />
        ))}
      </g>
      {/* Animated: clouds drifting slowly past the dome */}
      <ellipse className="ill-cloud" cx="58"  cy="34" rx="28" ry="9"  fill="rgba(255,255,255,0.28)" />
      <ellipse className="ill-cloud" cx="294" cy="42" rx="22" ry="7"  fill="rgba(255,255,255,0.20)" />
      {/* Animated: clouds drifting past the capitol dome */}
      <ellipse className="ill-cloud" cx="55"  cy="36" rx="26" ry="9"  fill="rgba(255,255,255,0.26)" />
      <ellipse className="ill-cloud" cx="298" cy="42" rx="22" ry="7"  fill="rgba(255,255,255,0.20)" />
      <Charm charm={charm} cx={cx} cy={cy} fg1={fg1} acc={acc} />
      <Logo id={id} text={text} lg1={lg1} lg2={lg2} />
    </svg>
  );
}

// ── 6. Nature — Wilderness / Adventure ───────────────────────────────────────
export function TplNature({ id, bg1, bg2, mid1, mid2, fg1, fg2, acc, charm, cx, cy, text, lg1, lg2, seed }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`bg-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={bg2} /><stop offset="100%" stopColor={bg1} />
        </linearGradient>
        <Filter id={id} seed={seed} />
      </defs>
      <rect width="352" height="112" fill={`url(#bg-${id})`} />
      {/* Sun / moon */}
      <circle cx="290" cy="22" r="18" fill={acc} opacity="0.80" />
      <circle cx="298" cy="16" r="14" fill={bg2} opacity="0.88" />
      {/* Terrain silhouette */}
      <path d="M0,80 Q50,40 100,65 Q150,30 200,55 Q250,20 300,48 Q330,35 352,55 L352,112 L0,112Z"
        fill={mid2} opacity="0.78" />
      <path d="M0,95 Q80,75 160,88 Q240,70 352,85 L352,112 L0,112Z"
        fill={mid1} opacity="0.65" />
      {/* Adventure element */}
      <g filter={`url(#f-${id})`}>
        <circle cx="176" cy="58" r="22" fill={fg1} opacity="0.82" stroke={acc} strokeWidth="2" />
        <circle cx="176" cy="58" r="14" fill={fg2} opacity="0.65" />
        <CoinStack x={100} y={88} count={3} r={10} fill={fg1} rim={acc} />
        <CoinStack x={250} y={88} count={3} r={10} fill={acc} rim={fg2} />
      </g>
      <WinkingStar cx={50} cy={22} r={9} fill={acc} stroke={mid1} />
      {/* Animated: stars twinkling in the wilderness sky */}
      <circle className="ill-twinkle" cx="100" cy="16" r="2.5" fill={acc} />
      <circle className="ill-twinkle" cx="182" cy="12" r="2.0" fill={fg2} />
      <circle className="ill-twinkle" cx="262" cy="18" r="2.5" fill={acc} />
      <Charm charm={charm} cx={cx} cy={cy} fg1={fg1} acc={acc} />
      <Logo id={id} text={text} lg1={lg1} lg2={lg2} />
    </svg>
  );
}

// ── 7. Festive — Holidays / Celebrations ─────────────────────────────────────
export function TplFestive({ id, bg1, bg2, mid1, mid2, fg1, fg2, acc, charm, cx, cy, text, lg1, lg2, seed }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor={mid1} /><stop offset="100%" stopColor={bg1} />
        </radialGradient>
        <Filter id={id} seed={seed} />
      </defs>
      <rect width="352" height="112" fill={`url(#bg-${id})`} />
      <Bunting x1={8} y1={10} x2={344} y2={10} n={10}
        colors={[mid2, fg1, acc, fg2, mid1]} />
      {/* Burst / firework */}
      <Burst cx={176} cy={50} r1={18} r2={38} pts={14} fill={acc} opacity={0.55} />
      {/* Central holiday element */}
      <g filter={`url(#f-${id})`}>
        <circle cx="176" cy="50" r="28" fill={bg2} stroke={acc} strokeWidth="2.5" opacity="0.88" />
        <circle cx="176" cy="50" r="18" fill={fg1} opacity="0.72" />
        {/* Coin scatter */}
        {[-36,-18,0,18,36].map(dx => (
          <circle key={dx} cx={176+dx} cy={82+Math.sin(dx*0.08)*5} r={6}
            fill={dx%2===0?fg1:fg2} stroke={acc} strokeWidth="1" opacity="0.80" />
        ))}
        <Burst cx={60}  cy={26} r1={5} r2={11} pts={8} fill={mid2} opacity={0.60} />
        <Burst cx={292} cy={26} r1={5} r2={11} pts={8} fill={fg2}  opacity={0.60} />
      </g>
      {/* Animated: confetti falling from the celebration burst */}
      <rect className="ill-fall" x="58"  y="8"  width="5" height="6" rx="1" fill={mid2} />
      <rect className="ill-fall" x="118" y="4"  width="4" height="5" rx="1" fill={fg1}  />
      <rect className="ill-fall" x="234" y="6"  width="5" height="6" rx="1" fill={acc}  />
      <rect className="ill-fall" x="290" y="10" width="4" height="5" rx="1" fill={fg2}  />
      <Charm charm={charm} cx={cx} cy={cy} fg1={fg1} acc={acc} />
      <Logo id={id} text={text} lg1={lg1} lg2={lg2} />
    </svg>
  );
}

// ── 8. Desk — Jobs / Careers ─────────────────────────────────────────────────
export function TplDesk({ id, bg1, bg2, mid1, mid2, fg1, fg2, acc, charm, cx, cy, text, lg1, lg2, seed }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`bg-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={bg1} /><stop offset="100%" stopColor={bg2} />
        </linearGradient>
        <Filter id={id} seed={seed} />
      </defs>
      <rect width="352" height="112" fill={`url(#bg-${id})`} />
      {/* Window blinds / office grid */}
      <g opacity="0.12">
        {[0,1,2,3,4,5,6,7].map(i => (
          <rect key={i} x="0" y={i * 15} width="352" height="7" fill={mid1} />
        ))}
      </g>
      {/* Desk surface */}
      <rect x="0" y="78" width="352" height="34" fill={mid2} opacity="0.70" />
      {/* Work element */}
      <g filter={`url(#f-${id})`}>
        <rect x="126" y="30" width="100" height="62" rx="5"
          fill={bg2} stroke={mid1} strokeWidth="2" opacity="0.82" />
        <rect x="136" y="40" width="80" height="42" rx="3" fill={mid1} opacity="0.40" />
        {/* Coin piles on desk */}
        <CoinStack x={86}  y={90} count={4} r={11} fill={fg1} rim={acc} />
        <CoinStack x={266} y={90} count={3} r={11} fill={fg2} rim={acc} />
        {/* Floating coins above work element */}
        {[-30,0,30].map(dx => (
          <circle key={dx} cx={176+dx} cy={22} r={7}
            fill={fg1} stroke={acc} strokeWidth="1.2" opacity="0.78" />
        ))}
      </g>
      {/* Animated: a document floating above the desk */}
      <g className="ill-doc-float">
        <rect x="50" y="20" width="28" height="36" rx="2"
          fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.32)" strokeWidth="1" />
        <line x1="56" y1="30" x2="72" y2="30" stroke="rgba(255,255,255,0.42)" strokeWidth="1.2" />
        <line x1="56" y1="36" x2="72" y2="36" stroke="rgba(255,255,255,0.32)" strokeWidth="1"   />
        <line x1="56" y1="42" x2="68" y2="42" stroke="rgba(255,255,255,0.28)" strokeWidth="1"   />
      </g>
      <Charm charm={charm} cx={cx} cy={cy} fg1={fg1} acc={acc} />
      <WinkingStar cx={310} cy={24} r={10} fill={acc} stroke={mid1} />
      <Logo id={id} text={text} lg1={lg1} lg2={lg2} />
    </svg>
  );
}

// ── 9. Animal — Character Portrait ───────────────────────────────────────────
export function TplAnimal({ id, bg1, bg2, mid1, mid2, fg1, fg2, acc, charm, cx, cy, text, lg1, lg2, seed }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="60%" r="75%">
          <stop offset="0%" stopColor={mid2} /><stop offset="100%" stopColor={bg1} />
        </radialGradient>
        <Filter id={id} seed={seed} />
      </defs>
      <rect width="352" height="112" fill={`url(#bg-${id})`} />
      {/* Habitat ground */}
      <ellipse cx="176" cy="105" rx="175" ry="22" fill={mid2} opacity="0.55" />
      {/* Animal body (simplified silhouette) */}
      <g filter={`url(#f-${id})`}>
        {/* Body */}
        <ellipse cx="176" cy="64" rx="42" ry="30" fill={fg1} stroke={acc} strokeWidth="2" opacity="0.88" />
        {/* Head */}
        <circle cx="176" cy="34" r="24" fill={fg1} stroke={acc} strokeWidth="2" opacity="0.90" />
        {/* Ears */}
        <circle cx="158" cy="16" r="10" fill={fg2} opacity="0.85" />
        <circle cx="194" cy="16" r="10" fill={fg2} opacity="0.85" />
        <circle cx="158" cy="16" r={6}  fill={acc} opacity="0.55" />
        <circle cx="194" cy="16" r={6}  fill={acc} opacity="0.55" />
        {/* Eyes */}
        <circle cx="168" cy="32" r={4} fill={bg1} />
        <circle cx="184" cy="32" r={4} fill={bg1} />
        <circle cx="169" cy="32" r={2} fill="#222" />
        <circle cx="185" cy="32" r={2} fill="#222" />
        {/* Coins around character */}
        <CoinStack x={100} y={85} count={3} r={10} fill={acc} rim={fg2} />
        <CoinStack x={250} y={85} count={3} r={10} fill={bg2} rim={acc} />
      </g>
      {/* Animated: bubbles rising around the character */}
      <circle className="ill-bubble" cx="128" cy="72" r="5" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.42)" strokeWidth="1" />
      <circle className="ill-bubble" cx="176" cy="76" r="4" fill="rgba(255,255,255,0.24)" stroke="rgba(255,255,255,0.38)" strokeWidth="1" />
      <circle className="ill-bubble" cx="224" cy="70" r="6" fill="rgba(255,255,255,0.26)" stroke="rgba(255,255,255,0.40)" strokeWidth="1" />
      <Charm charm={charm} cx={cx} cy={cy} fg1={fg2} acc={acc} />
      <Logo id={id} text={text} lg1={lg1} lg2={lg2} />
    </svg>
  );
}

// ── 10. Absurd — Random / Surreal ─────────────────────────────────────────────
export function TplAbsurd({ id, bg1, bg2, mid1, mid2, fg1, fg2, acc, charm, cx, cy, text, lg1, lg2, seed }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 352 112" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`bg-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={bg1} /><stop offset="50%" stopColor={mid1} />
          <stop offset="100%" stopColor={bg2} />
        </linearGradient>
        <Filter id={id} seed={seed} />
      </defs>
      <rect width="352" height="112" fill={`url(#bg-${id})`} />
      {/* Chaotic background dots */}
      {[20,60,100,150,200,250,290,330].map((x, i) => (
        <circle key={i} cx={x} cy={10 + (i % 4) * 12} r={4 + (i % 3) * 2}
          fill={[acc, fg1, fg2, mid2][i % 4]} opacity="0.35" />
      ))}
      {/* Central absurd element */}
      <g filter={`url(#f-${id})`}>
        <Burst cx={176} cy={52} r1={22} r2={44} pts={16} fill={acc} opacity={0.55} />
        <circle cx="176" cy="52" r="28" fill={bg2} stroke={acc} strokeWidth="2.5" opacity="0.85" />
        <circle cx="176" cy="52" r="18" fill={fg1} opacity="0.72" />
        {/* Scattered coin chaos */}
        {[-50,-30,-10,10,30,50].map((dx,i) => (
          <circle key={i} cx={176+dx} cy={82+Math.sin(i)*8} r={6+i%3}
            fill={[fg1,fg2,acc,mid2][i%4]} stroke="rgba(0,0,0,0.2)" strokeWidth="1" opacity="0.85" />
        ))}
      </g>
      <Bunting x1={10} y1={12} x2={342} y2={12} n={8}
        colors={[mid2, fg1, acc, fg2, bg2]} />
      {/* Animated: a spinning starburst in the corner for chaos energy */}
      <g className="ill-spin">
        <Burst cx={52} cy={55} r1={6} r2={14} pts={8} fill={acc} opacity={0.72} />
      </g>
      <Charm charm={charm} cx={cx} cy={cy} fg1={fg1} acc={acc} />
      <WinkingStar cx={52} cy={26} r={10} fill={acc} stroke={mid1} />
      <Logo id={id} text={text} lg1={lg1} lg2={lg2} />
    </svg>
  );
}
