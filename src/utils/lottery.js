// ── BALANCE CONSTANTS — edit these to tune economy without touching game logic ─
export const STARTING_BALANCE      = 150;
export const RISK_CARD_CHANCE      = 0.10; // probability a risk card appears in the picker
export const RISK_CARD_MIN_BALANCE = 15;   // minimum balance for a risk card to appear

// Win-chance and payout tiers by card price band.
// winChance: total probability of any win (including jackpot and big)
// minMult:   minimum prize = minMult × cost  (guaranteed on small wins)
// bigRange:  [min, max] prize multiplier for big wins
// bigChance: absolute probability of a big win on this price tier
export const PRICE_WIN_TIERS = [
  { maxCost: 3,        winChance: 0.350, minMult: 1.10, bigRange: [5,  8],  bigChance: 0.050 },
  { maxCost: 7,        winChance: 0.400, minMult: 1.10, bigRange: [6,  10], bigChance: 0.080 },
  { maxCost: 12,       winChance: 0.450, minMult: 1.15, bigRange: [8,  15], bigChance: 0.120 },
  { maxCost: 17,       winChance: 0.500, minMult: 1.20, bigRange: [10, 20], bigChance: 0.150 },
  { maxCost: Infinity, winChance: 0.550, minMult: 1.25, bigRange: [15, 25], bigChance: 0.180 },
];

export const JACKPOT_CHANCE = 0.005; // universal jackpot probability (all price tiers)
export const JACKPOT_MULT   = 100;   // jackpot pays 100× card cost
// ─────────────────────────────────────────────────────────────────────────────

export const LUCKY_COUNT = 5;
export const NUMBER_MAX = 30;

function getPriceTier(cost) {
  return PRICE_WIN_TIERS.find(t => cost <= t.maxCost);
}

function drawTier(cost, forceWin = false) {
  const pt = getPriceTier(cost);
  const r  = Math.random();

  if (forceWin) {
    // Forced win: 1% jackpot, proportional big/small split
    if (r < 0.01) return { id: 'jackpot', matches: 3, mult: JACKPOT_MULT };
    const bigFrac = pt.bigChance / pt.winChance;
    if (r < 0.01 + bigFrac * 0.99) {
      const mult = pt.bigRange[0] + Math.random() * (pt.bigRange[1] - pt.bigRange[0]);
      return { id: 'big', matches: 2, mult };
    }
    return { id: 'small', matches: 1, mult: pt.minMult };
  }

  // Normal draw — jackpot first, then big, then small, else none
  if (r < JACKPOT_CHANCE) return { id: 'jackpot', matches: 3, mult: JACKPOT_MULT };
  if (r < JACKPOT_CHANCE + pt.bigChance) {
    const mult = pt.bigRange[0] + Math.random() * (pt.bigRange[1] - pt.bigRange[0]);
    return { id: 'big', matches: 2, mult };
  }
  if (r < JACKPOT_CHANCE + pt.winChance) return { id: 'small', matches: 1, mult: pt.minMult };
  return { id: 'none', matches: 0, mult: 0 };
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
  const tier = drawTier(theme.price, forceWin);
  const luckyNumbers = pickUnique(1, NUMBER_MAX, LUCKY_COUNT);
  const luckySet = new Set(luckyNumbers);
  const cellCount = theme.formation ? theme.formation.cellCount : 9;

  // Use Math.ceil so prize is always ≥ minMult × cost — a winner never feels like a loss
  const totalMin  = tier.matches > 0 ? Math.ceil(theme.price * tier.mult) : 0;
  const prizeEach = tier.matches > 0 ? Math.max(1, Math.ceil(totalMin / tier.matches)) : 0;

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
