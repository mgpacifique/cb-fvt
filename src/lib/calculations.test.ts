import {
  calculateDivergence,
  normalizeToUsdPerMetricTon,
  calculateRollingAverage,
  calculateCoefficientOfVariation,
} from './calculations';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${msg}`);
  }
  console.log(`✓ PASS: ${msg}`);
}

console.log('--- Running Calculation Engine Unit Tests ---');

// Test 1: Divergence formula
const div1 = calculateDivergence(300, 354);
assert(div1 === 18.0, `Expected 300 to 354 to have 18.0% divergence, got ${div1}`);

// Test 2: Divergence with null (Non-imputation rule)
const divNull = calculateDivergence(300, null);
assert(divNull === null, `Expected null divergence for missing price, got ${divNull}`);

// Test 3: Normalization to USD per Metric Ton
// e.g. 1kg costs 3700 UGX, exchange rate is 3700 UGX/USD -> 1000 USD/MT
const norm = normalizeToUsdPerMetricTon(3700, 1, 3700);
assert(norm === 1000, `Expected 1000 USD/MT, got ${norm}`);

// Test 4: Rolling Average with missing observation
const series = [320, 325, null, 335];
const rollAvg = calculateRollingAverage(series, 3, 4);
// Expected average of available: (320 + 325 + 335) / 3 = 326.66 -> 327
assert(rollAvg === 327, `Expected rolling average to skip null and produce 327, got ${rollAvg}`);

// Test 5: Coefficient of Variation
const cv = calculateCoefficientOfVariation([100, 110, 90, 105, 95]);
assert(cv > 0 && cv < 15, `Expected CV around 7-10%, got ${cv}`);

console.log('All 5 Calculation Engine Unit Tests passed cleanly!');

