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
  { maxCost:    3, winChance: 0.350, minMult: 1.10, bigRange: [5,  8],  bigChance: 0.050 },
  { maxCost:    7, winChance: 0.400, minMult: 1.10, bigRange: [6,  10], bigChance: 0.080 },
  { maxCost:   12, winChance: 0.450, minMult: 1.15, bigRange: [8,  15], bigChance: 0.120 },
  { maxCost:   17, winChance: 0.500, minMult: 1.20, bigRange: [10, 20], bigChance: 0.150 },
  { maxCost:   20, winChance: 0.550, minMult: 1.25, bigRange: [15, 25], bigChance: 0.180 },
  // ── High-stakes tiers ─────────────────────────────────────────────────
  { maxCost:   30, winChance: 0.530, minMult: 1.15, bigRange: [12, 22], bigChance: 0.180 }, // $30 bridge
  { maxCost:   50, winChance: 0.550, minMult: 1.20, bigRange: [10, 20], bigChance: 0.200 }, // $50
  { maxCost:  100, winChance: 0.580, minMult: 1.25, bigRange: [15, 25], bigChance: 0.220 }, // $100
  { maxCost:  200, winChance: 0.600, minMult: 1.30, bigRange: [20, 30], bigChance: 0.250 }, // $200
  { maxCost: 1000, winChance: 0.630, minMult: 1.35, bigRange: [25, 40], bigChance: 0.280 }, // $1 000
  { maxCost: Infinity, winChance: 0.650, minMult: 1.40, bigRange: [30, 50], bigChance: 0.300 }, // $2 000
];

// Pressure win-chance adjustment indexed by pressure level (0 = none … 4 = critical).
// Applied to the small-win boundary; big-win and jackpot probabilities are unchanged.
// Level 0: no change  1: −3% (low)  2: ±0% (medium/neutral)  3: +5% (high)  4: +10% (critical)
export const PRESSURE_WIN_ADJ = [0, -0.03, 0, 0.05, 0.10];

export const JACKPOT_CHANCE = 0.005; // universal jackpot probability (all price tiers)
export const JACKPOT_MULT   = 100;   // jackpot pays 100× card cost
export const MAX_ITEM_PURCHASES = 3; // per-session purchase cap per shop item (car is exempt)
export const LUCKY_NUMBER_APPEARANCE_CHANCE = 0.08; // probability session lucky number is planted as a winner on any given card
export const LUCKY_WIN_SMALL_CHANCE          = 0.40; // when lucky number planted: small win
export const LUCKY_WIN_MEDIUM_CHANCE         = 0.30; // medium win (1.5–3× cost)
export const LUCKY_WIN_BIG_CHANCE            = 0.20; // big win (existing bigRange)
export const LUCKY_WIN_JACKPOT_CHANCE        = 0.10; // jackpot (100× cost)
// Guaranteed winners per Flow State round (index = round-1; last entry repeats for all later rounds)
export const FLOW_STATE_WIN_SCHEDULE = [6, 6, 5, 4, 3, 2, 1];
// High-stakes tier unlock thresholds — permanent, based on lifetime earnings (not current balance)
export const HIGH_STAKES_UNLOCK_THRESHOLDS = [
  { price:   50, lifetime:   500 },
  { price:  100, lifetime:  1000 },
  { price:  200, lifetime:  5000 },
  { price: 1000, lifetime: 10000 },
  { price: 2000, lifetime: 20000 },
];
// When a high-stakes tier unlocks, retire normal cards up to this price (cumulative)
export const HIGH_STAKES_RETIRE_SCHEDULE = [
  { unlockPrice:   50, retireUpTo:  2 },  // $50 unlocks → retire $1–2 cards
  { unlockPrice:  100, retireUpTo:  4 },  // $100 unlocks → retire $3–4 cards
  { unlockPrice:  200, retireUpTo:  7 },  // $200 unlocks → retire $5–7 cards
  { unlockPrice: 1000, retireUpTo: 12 },  // $1k unlocks  → retire $8–12 cards
  { unlockPrice: 2000, retireUpTo: 17 },  // $2k unlocks  → retire $13–17 cards
];
// ─────────────────────────────────────────────────────────────────────────────

export const LUCKY_COUNT = 5;
export const NUMBER_MAX = 99;

function getPriceTier(cost) {
  return PRICE_WIN_TIERS.find(t => cost <= t.maxCost);
}

function drawTier(cost, forceWin = false, pressureAdj = 0) {
  const pt = getPriceTier(cost);
  const r  = Math.random();

  // Clamp adjusted win chance so it stays in [bigChance, 0.95]
  const winChance = Math.min(0.95, Math.max(pt.bigChance, pt.winChance + pressureAdj));

  if (forceWin) {
    // Forced win: 1% jackpot, proportional big/small split
    if (r < 0.01) return { id: 'jackpot', matches: 3, mult: JACKPOT_MULT };
    const bigFrac = pt.bigChance / winChance;
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
  if (r < JACKPOT_CHANCE + winChance) return { id: 'small', matches: 1, mult: pt.minMult };
  return { id: 'none', matches: 0, mult: 0 };
}

// Guaranteed win tier used when the session lucky number is planted on the card.
// Distribution: 40% small | 30% medium (1.5–3×) | 20% big (bigRange) | 10% jackpot
function drawLuckyTier(cost) {
  const pt = getPriceTier(cost);
  const r  = Math.random();
  if (r < LUCKY_WIN_JACKPOT_CHANCE) {
    return { id: 'jackpot', matches: 3, mult: JACKPOT_MULT };
  }
  if (r < LUCKY_WIN_JACKPOT_CHANCE + LUCKY_WIN_BIG_CHANCE) {
    const mult = pt.bigRange[0] + Math.random() * (pt.bigRange[1] - pt.bigRange[0]);
    return { id: 'big', matches: 2, mult };
  }
  if (r < LUCKY_WIN_JACKPOT_CHANCE + LUCKY_WIN_BIG_CHANCE + LUCKY_WIN_MEDIUM_CHANCE) {
    const mult = 1.5 + Math.random() * 1.5; // 150%–300% of cost
    return { id: 'big', matches: 2, mult };
  }
  // 40% small win
  return { id: 'small', matches: 1, mult: pt.minMult };
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

export function generateCard(theme, forceWin = false, pressureAdj = 0, sessionLuckyNum = null) {
  // ── Lucky number appearance ────────────────────────────────────────────────
  // 8% chance (non-forced cards only) to plant the session lucky number as a
  // winning cell at luckyNumbers[0]. When NOT planted, the lucky number must not
  // appear anywhere on the card — not in luckyNumbers, not in non-match cells.
  const luckyHit = !forceWin && sessionLuckyNum != null
    && Math.random() < LUCKY_NUMBER_APPEARANCE_CHANCE;

  // ── Build luckyNumbers array ───────────────────────────────────────────────
  let luckyNumbers;
  if (luckyHit) {
    // sessionLuckyNum at index 0; remaining LUCKY_COUNT-1 are distinct, ≠ it
    const rest = new Set();
    while (rest.size < LUCKY_COUNT - 1) {
      const n = Math.floor(Math.random() * NUMBER_MAX) + 1;
      if (n !== sessionLuckyNum) rest.add(n);
    }
    luckyNumbers = [sessionLuckyNum, ...rest];
  } else {
    // Normal draw — sessionLuckyNum excluded from the pool
    const exclude = sessionLuckyNum != null ? new Set([sessionLuckyNum]) : new Set();
    const set = new Set();
    while (set.size < LUCKY_COUNT) {
      const n = Math.floor(Math.random() * NUMBER_MAX) + 1;
      if (!exclude.has(n)) set.add(n);
    }
    luckyNumbers = [...set];
  }

  // ── Win tier ──────────────────────────────────────────────────────────────
  const tier = luckyHit
    ? drawLuckyTier(theme.price)
    : drawTier(theme.price, forceWin, pressureAdj);

  // ── Build cells ───────────────────────────────────────────────────────────
  const luckySet  = new Set(luckyNumbers);
  const cellCount = theme.formation ? theme.formation.cellCount : 9;

  // Use Math.ceil so prize is always ≥ minMult × cost — a winner never feels like a loss
  const totalMin  = tier.matches > 0 ? Math.ceil(theme.price * tier.mult) : 0;
  const prizeEach = tier.matches > 0 ? Math.max(1, Math.ceil(totalMin / tier.matches)) : 0;

  const cells = [];

  // Winning cells — first tier.matches entries from luckyNumbers
  for (let i = 0; i < tier.matches; i++) {
    cells.push({ number: luckyNumbers[i], prize: prizeEach, isMatch: true, scratched: false });
  }

  // Non-match cells — exclude luckySet; also exclude sessionLuckyNum when not planted
  // so it can never appear as a non-winning decoy on this card
  const nonMatchExclude = luckyHit
    ? luckySet
    : new Set([...luckySet, ...(sessionLuckyNum != null ? [sessionLuckyNum] : [])]);
  for (let i = tier.matches; i < cellCount; i++) {
    let n;
    do { n = Math.floor(Math.random() * NUMBER_MAX) + 1; } while (nonMatchExclude.has(n));
    cells.push({ number: n, prize: 0, isMatch: false, scratched: false });
  }

  return {
    theme,
    tier,
    luckyNumbers,
    cells: shuffle(cells),
    totalPrize: prizeEach * tier.matches,
    sessionLuckyIsMatch: luckyHit,
  };
}
