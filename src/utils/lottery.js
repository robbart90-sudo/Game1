// ── BALANCE CONSTANTS — edit these to tune economy without touching game logic ─
export const STARTING_BALANCE      = 50;
export const RISK_CARD_CHANCE      = 0.10; // probability a risk card appears in the picker
export const RISK_CARD_MIN_BALANCE = 15;   // minimum balance for a risk card to appear
// ─────────────────────────────────────────────────────────────────────────────

export const LUCKY_COUNT = 5;
export const NUMBER_MAX = 30;

// Prize tiers — mult is prize-to-cost ratio; prizeEach = floor(price * mult / matches)
// Target: ~50% of cards lose; ~43% small wins (70% return); ~6.5% big wins (250% return); ~0.5% jackpot
const TIERS = [
  { id: 'jackpot', matches: 3, mult: 100,  chance: 0.005 }, // ~0.5% of cards — huge payout
  { id: 'big',     matches: 2, mult: 2.5,  chance: 0.065 }, // ~6.5% of cards — lifeline (250% return)
  { id: 'small',   matches: 1, mult: 0.70, chance: 0.430 }, // ~43% of cards — slight loss (70% return)
  { id: 'none',    matches: 0, mult: 0,    chance: 0.500 }, // ~50% of cards — no win
];

function drawTier(forceWin = false) {
  if (forceWin) {
    const r = Math.random();
    if (r < 0.01) return TIERS[0]; // jackpot
    if (r < 0.15) return TIERS[1]; // big
    return TIERS[2];               // small
  }
  const r = Math.random();
  let cum = 0;
  for (const t of TIERS) {
    cum += t.chance;
    if (r < cum) return t;
  }
  return TIERS[TIERS.length - 1];
}

function pickUnique(min, max, count) {
  const set = new Set();
  while (set.size < count) set.add(Math.floor(Math.random() * (max - min + 1)) + min);
  return [...set];
}

function pickNonLucky(luckySet) {
  let n;
  do { n = Math.floor(Math.random() * NUMBER_MAX) + 1; } while (luckySet.has(n));
  return n;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateCard(theme, forceWin = false) {
  const tier = drawTier(forceWin);
  const luckyNumbers = pickUnique(1, NUMBER_MAX, LUCKY_COUNT);
  const luckySet = new Set(luckyNumbers);
  const prizeEach = tier.matches > 0 ? Math.max(1, Math.floor((theme.price * tier.mult) / tier.matches)) : 0;
  const cellCount = theme.formation ? theme.formation.cellCount : 9;

  const cells = [];

  // Plant winning cells using actual lucky numbers
  for (let i = 0; i < tier.matches; i++) {
    cells.push({ number: luckyNumbers[i], prize: prizeEach, isMatch: true, scratched: false });
  }

  // Fill remaining cells with non-lucky numbers
  for (let i = tier.matches; i < cellCount; i++) {
    cells.push({ number: pickNonLucky(luckySet), prize: 0, isMatch: false, scratched: false });
  }

  return {
    theme,
    tier,
    luckyNumbers,
    cells: shuffle(cells),
    totalPrize: prizeEach * tier.matches,
  };
}
