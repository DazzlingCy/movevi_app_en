import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getWeightPlanRewardAmount,
  getWeightPlanRewardCents,
  WEIGHT_PLAN_TOTAL_REWARD_AMOUNT,
  WEIGHT_PLAN_TOTAL_REWARD_CENTS
} from '../lib/weightPlan';

test('30-day check-in rewards total exactly $5.00', () => {
  const total = Array.from({ length: 30 }, (_, index) => getWeightPlanRewardCents(index + 1))
    .reduce((sum, amount) => sum + amount, 0);

  assert.equal(total, WEIGHT_PLAN_TOTAL_REWARD_CENTS);
  assert.equal(WEIGHT_PLAN_TOTAL_REWARD_AMOUNT, '$5.00');
});

test('daily rewards use US currency formatting and reject out-of-range days', () => {
  assert.equal(getWeightPlanRewardAmount(1), '$0.25');
  assert.equal(getWeightPlanRewardAmount(2), '$0.14');
  assert.equal(getWeightPlanRewardAmount(30), '$0.40');
  assert.equal(getWeightPlanRewardAmount(31), '$0.00');
});
