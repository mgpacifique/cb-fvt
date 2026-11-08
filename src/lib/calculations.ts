/**
 * Calculation Engine for Cross-Border Informal Food Flows & Price Volatility Tracker (CB-FVT)
 * Complies with SRS Release 1.0 & Non-Imputation Business Rules.
 */

/**
 * Calculates percentage price divergence between paired origin and destination markets.
 * Formula: ((P_dest - P_orig) / P_orig) * 100
 * A positive value represents a destination premium.
 */
export function calculateDivergence(
  originPrice: number | null,
  destinationPrice: number | null
): number | null {
  if (
    originPrice === null ||
    destinationPrice === null ||
    originPrice === 0 ||
    isNaN(originPrice) ||
    isNaN(destinationPrice)
  ) {
    return null; // Explicit null: never fabricate missing data
  }

  const divergence = ((destinationPrice - originPrice) / originPrice) * 100;
  return Number(divergence.toFixed(1));
}

/**
 * Normalizes local market prices in local currency per kg/tin/bag into USD per Metric Ton (MT).
 * 1 Metric Ton = 1,000 kg.
 * Formula: (localPricePerKg * 1000) / exchangeRateToUsd
 */
export function normalizeToUsdPerMetricTon(
  localPrice: number,
  unitMeasureKg: number,
  exchangeRateToUsd: number
): number {
  if (localPrice <= 0 || unitMeasureKg <= 0 || exchangeRateToUsd <= 0) return 0;
  const pricePerKg = localPrice / unitMeasureKg;
  const pricePerMetricTonLocal = pricePerKg * 1000;
  const usdPerMetricTon = pricePerMetricTonLocal / exchangeRateToUsd;
  return Math.round(usdPerMetricTon);
}

/**
 * Computes trailing moving average for a series of observations.
 * Does NOT interpolate missing observations; calculates over available values only.
 */
export function calculateRollingAverage(
  prices: (number | null)[],
  currentIndex: number,
  windowSize: number
): number | null {
  const windowSlice = prices
    .slice(Math.max(0, currentIndex - windowSize + 1), currentIndex + 1)
    .filter((p): p is number => p !== null && !isNaN(p));

  if (windowSlice.length === 0) return null;
  const sum = windowSlice.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / windowSlice.length);
}

/**
 * Calculates Coefficient of Variation (CV%): (Standard Deviation / Mean) * 100.
 * Used for the "Most Volatile Commodity" KPI.
 */
export function calculateCoefficientOfVariation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  if (mean === 0) return 0;

  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (values.length - 1);
  const stdDev = Math.sqrt(variance);

  return Number(((stdDev / mean) * 100).toFixed(1));
}

/**
 * Format helpers with high editorial precision
 */
export function formatDivergence(val: number | null): string {
  if (val === null) return '—';
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${val.toFixed(1)}%`;
}

export function formatUsd(val: number | null): string {
  if (val === null) return '—';
  return `$${val.toLocaleString()}`;
}

export function formatTonnage(val: number | null): string {
  if (val === null) return '—';
  return `${val.toLocaleString()} t`;
}

