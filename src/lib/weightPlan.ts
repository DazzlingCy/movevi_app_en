export interface WeightPlanRewardRecord {
  day: number;
  amount: string;
  openedAt: string;
}

export const WEIGHT_PLAN_TOTAL_REWARD_CENTS = 500;
export const WEIGHT_PLAN_TOTAL_REWARD_AMOUNT = '$5.00';

const STANDARD_REWARD_CENTS = 14;
const MILESTONE_REWARD_CENTS: Record<number, number> = {
  1: 25,
  7: 25,
  15: 30,
  21: 30,
  30: 40
};

export const getWeightPlanRewardCents = (day: number) => {
  const normalizedDay = Math.trunc(day);
  if (normalizedDay < 1 || normalizedDay > 30) return 0;
  return MILESTONE_REWARD_CENTS[normalizedDay] ?? STANDARD_REWARD_CENTS;
};

export const getWeightPlanRewardAmount = (day: number) =>
  `$${(getWeightPlanRewardCents(day) / 100).toFixed(2)}`;
