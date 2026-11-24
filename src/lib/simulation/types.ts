/**
 * Type definitions for Policy Shock Simulator & Counterfactual "What-If" Analysis
 * Complies with SRS Release 1.0 & SRS Non-Imputation Business Rule (NFR 5).
 */

import { CorridorId, CommodityId, PriceObservation, CorridorMetadata } from '@/lib/types';

export interface PolicyShockParameters {
  borderWaitHours: number; // e.g. 0 to 72 hours (baseline ~24h at Gatuna/Katuna)
  ntbFrictionFeeUsd: number; // $0 to $50/MT (SPS inspection, offloading, testing)
  fuelSurchargePct: number; // -30% to +50% (freight logistics modulation)
  tariffRatePct: number; // 0% to 30% (customs duties, levies)
  exportQuotaPct: number; // 0% to 100% (100% = open border, 0% = full embargo)
}

export interface PolicyPreset {
  id: string;
  title: string;
  badge: string;
  category: 'facilitation' | 'friction' | 'macro' | 'disruption';
  description: string;
  impactSummary: string;
  parameters: PolicyShockParameters;
}

export interface CounterfactualObservation extends PriceObservation {
  simulatedDestPriceUsdPerMt: number | null;
  simulatedDivergencePct: number | null;
  divergenceDeltaPct: number | null;
  simulatedVolumeTons: number | null;
  volumeDeltaPct: number | null;
}

export interface SimulationSummary {
  corridorId: CorridorId;
  commodityId: CommodityId;
  corridorName: string;
  commodityName: string;
  originMarket: string;
  destMarket: string;
  distanceKm: number;
  baselineDivergence: number;
  simulatedDivergence: number;
  divergenceDelta: number; // simulated - baseline
  baselineDestPrice: number;
  simulatedDestPrice: number;
  priceDeltaUsd: number;
  consumerWelfarePerMt: number; // positive = consumer savings, negative = cost increase
  baselineVolume: number;
  projectedVolume: number;
  volumeDeltaPct: number;
  sensitivityFactors: {
    transitTimeCostUsd: number;
    ntbCostUsd: number;
    fuelCostUsd: number;
    tariffCostUsd: number;
    quotaScarcityCostUsd: number;
  };
  narrative: string;
  counterfactualSeries: CounterfactualObservation[];
}
