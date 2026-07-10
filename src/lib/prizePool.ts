export interface PrizeTier {
  id: string;
  tier: string;
  amount: number;
  quantity: number;
  chance: number;
}

export const PRIZE_TIERS: PrizeTier[] = [
  { id: '0.10', tier: 'Sixth Prize', amount: 0.1, quantity: 100, chance: 50 },
  { id: '0.25', tier: 'Fifth Prize', amount: 0.25, quantity: 50, chance: 25 },
  { id: '0.50', tier: 'Fourth Prize', amount: 0.5, quantity: 30, chance: 15 },
  { id: '1.00', tier: 'Third Prize', amount: 1, quantity: 12, chance: 6 },
  { id: '2.00', tier: 'Second Prize', amount: 2, quantity: 6, chance: 3 },
  { id: '19.25', tier: 'First Prize', amount: 19.25, quantity: 2, chance: 1 },
];

export const PRIZE_POOL_TOTAL_SPOTS = PRIZE_TIERS.reduce((total, prize) => total + prize.quantity, 0);
export const PRIZE_POOL_TOTAL_AMOUNT = PRIZE_TIERS.reduce(
  (total, prize) => total + prize.amount * prize.quantity,
  0,
);

const NEW_USER_GUARANTEED_PRIZE_IDS = ['2.00', '2.00', '1.00'];

export const formatPrizeAmount = (amount: number) => `$${amount.toFixed(2)}`;

export const pickPrizeTier = (completedDraws: number, randomValue = Math.random()): PrizeTier => {
  const guaranteedPrizeId = NEW_USER_GUARANTEED_PRIZE_IDS[completedDraws];
  if (guaranteedPrizeId) {
    return PRIZE_TIERS.find((prize) => prize.id === guaranteedPrizeId) || PRIZE_TIERS[0];
  }

  const roll = randomValue * 100;
  let cumulativeChance = 0;

  for (const prize of PRIZE_TIERS) {
    cumulativeChance += prize.chance;
    if (roll < cumulativeChance) return prize;
  }

  return PRIZE_TIERS[0];
};