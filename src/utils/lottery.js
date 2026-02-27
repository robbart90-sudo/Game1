export const STARTING_BALANCE = 200;
export const LUCKY_COUNT = 5;
export const NUMBER_MAX = 30;

// Prize tiers — multiplier applied to card price
const TIERS = [
  { id: 'jackpot', matches: 3, mult: 500, chance: 0.01  },
  { id: 'big',     matches: 2, mult: 150, chance: 0.04  },
  { id: 'medium',  matches: 1, mult: 30,  chance: 0.15  },
  { id: 'small',   matches: 1, mult: 8,   chance: 0.30  },
  { id: 'none',    matches: 0, mult: 0,   chance: 0.50  },
];

function drawTier(forceWin = false) {
  if (forceWin) {
    const r = Math.random();
    if (r < 0.01) return TIERS[0]; // jackpot
    if (r < 0.05) return TIERS[1]; // big
    if (r < 0.20) return TIERS[2]; // medium
    return TIERS[3];               // small
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
  const prizeEach = tier.matches > 0 ? Math.floor((theme.price * tier.mult) / tier.matches) : 0;
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
