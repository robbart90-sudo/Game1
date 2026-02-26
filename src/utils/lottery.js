export const PRIZE_TIERS = [
  { id: 'jackpot',    label: '🏆 JACKPOT',   amount: 1000, chance: 0.01,  color: '#FFD700' },
  { id: 'big',        label: '💎 BIG WIN',    amount: 500,  chance: 0.05,  color: '#C0C0FF' },
  { id: 'medium',     label: '⭐ NICE WIN',   amount: 100,  chance: 0.15,  color: '#90EE90' },
  { id: 'small',      label: '🎉 SMALL WIN',  amount: 20,   chance: 0.30,  color: '#ADD8E6' },
  { id: 'no_win',     label: '😔 NO WIN',     amount: 0,    chance: 0.49,  color: '#D3D3D3' },
];

export const CARD_COST = 10;
export const STARTING_BALANCE = 200;
export const SCRATCH_THRESHOLD = 0.6; // 60% scratched to reveal result

export function drawPrize() {
  const rand = Math.random();
  let cumulative = 0;
  for (const tier of PRIZE_TIERS) {
    cumulative += tier.chance;
    if (rand < cumulative) return tier;
  }
  return PRIZE_TIERS[PRIZE_TIERS.length - 1];
}

export function getSymbolsForPrize(prize) {
  const winSymbols = ['🍒', '🍋', '🎰', '💰', '🌟'];
  const loseSymbols = ['🍊', '🍇', '🃏', '🎲', '🌈'];

  const winning = winSymbols[Math.floor(Math.random() * winSymbols.length)];
  const losing1 = loseSymbols[Math.floor(Math.random() * loseSymbols.length)];
  let losing2 = loseSymbols[Math.floor(Math.random() * loseSymbols.length)];
  while (losing2 === losing1) {
    losing2 = loseSymbols[Math.floor(Math.random() * loseSymbols.length)];
  }

  if (prize.amount > 0) {
    // 3 matching symbols for a win
    return [winning, winning, winning];
  } else {
    // 3 non-matching symbols for a loss
    return [winning, losing1, losing2];
  }
}
