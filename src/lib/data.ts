import {
  CorridorId,
  CommodityId,
  CorridorMetadata,
  PriceObservation,
  VolumeRecord,
  KpiSummary,
  PolicyEvent,
} from './types';
import { calculateDivergence, calculateRollingAverage } from './calculations';

export const CORRIDORS: Record<CorridorId, CorridorMetadata> = {
  'gatuna-katuna': {
    id: 'gatuna-katuna',
    name: 'Gatuna / Katuna',
    crossBorderRoute: 'Rwanda – Uganda',
    originMarket: 'Kabale',
    originCountry: 'Uganda',
    originCountryCode: 'UGA',
    originPriceUsd: 300,
    destMarket: 'Musanze',
    destCountry: 'Rwanda',
    destCountryCode: 'RWA',
    destPriceUsd: 354,
    currentDivergencePct: 18.0,
    dataCompleteness: 'Partial data',
    distanceKm: 82,
    frictionNote:
      'Fuel, transit time and clearance delays can affect the spread. Single Customs Territory fast-track operational.',
    seriesCount: { total: 13, available: 12 },
  },
  rusumo: {
    id: 'rusumo',
    name: 'Rusumo',
    crossBorderRoute: 'Rwanda – Tanzania',
    originMarket: 'Ngara',
    originCountry: 'Tanzania',
    originCountryCode: 'TZA',
    originPriceUsd: 290,
    destMarket: 'Kirehe',
    destCountry: 'Rwanda',
    destCountryCode: 'RWA',
    destPriceUsd: 335,
    currentDivergencePct: 15.5,
    dataCompleteness: 'Complete',
    distanceKm: 95,
    frictionNote:
      'Weight bridge calibration checks and river crossing queuing can create seasonal friction.',
    seriesCount: { total: 13, available: 13 },
  },
  busia: {
    id: 'busia',
    name: 'Busia',
    crossBorderRoute: 'Kenya – Uganda',
    originMarket: 'Tororo',
    originCountry: 'Uganda',
    originCountryCode: 'UGA',
    originPriceUsd: 285,
    destMarket: 'Busia (KE)',
    destCountry: 'Kenya',
    destCountryCode: 'KEN',
    destPriceUsd: 330,
    currentDivergencePct: 15.8,
    dataCompleteness: 'Complete',
    distanceKm: 34,
    frictionNote:
      'High density informal bicycle/headload crossing with minimal formal road freight transit friction.',
    seriesCount: { total: 13, available: 13 },
  },
  malaba: {
    id: 'malaba',
    name: 'Malaba',
    crossBorderRoute: 'Kenya – Uganda',
    originMarket: 'Tororo',
    originCountry: 'Uganda',
    originCountryCode: 'UGA',
    originPriceUsd: 285,
    destMarket: 'Eldoret',
    destCountry: 'Kenya',
    destCountryCode: 'KEN',
    destPriceUsd: 338,
    currentDivergencePct: 18.6,
    dataCompleteness: 'Complete',
    distanceKm: 120,
    frictionNote:
      'Heavy rail/road container bottleneck and Northern Corridor customs bond compliance checks.',
    seriesCount: { total: 13, available: 13 },
  },
};

export const COMMODITIES: Record<CommodityId, { name: string; unit: string; description: string }> = {
  maize: {
    name: 'Maize',
    unit: 'USD / metric ton',
    description: 'Dry white maize grain, primary regional food security staple.',
  },
  beans: {
    name: 'Beans',
    unit: 'USD / metric ton',
    description: 'Mixed and red kidney beans, high protein commercial dietary staple.',
  },
  rice: {
    name: 'Rice',
    unit: 'USD / metric ton',
    description: 'Milled aromatic white rice, cross-border commercial staple.',
  },
  sorghum: {
    name: 'Sorghum',
    unit: 'USD / metric ton',
    description: 'Drought-tolerant grain used for household porridge and brewing.',
  },
};

export const REGIONAL_COUNTRY_PRICES = {
  COD: { name: 'DR Congo', price: 390, status: 'High Deficit' },
  RWA: { name: 'Rwanda', price: 354, status: 'Destination' },
  UGA: { name: 'Uganda', price: 300, status: 'Surplus Origin' },
  KEN: { name: 'Kenya', price: 330, status: 'Net Importer' },
  TZA: { name: 'Tanzania', price: 290, status: 'Surplus Basin' },
};

export const POLICY_EVENTS: PolicyEvent[] = [
  {
    id: 'pol-1',
    code: 'P1',
    date: '2026-08-12',
    corridorId: 'gatuna-katuna',
    title: 'Clearance Pilot',
    category: 'Customs',
    description:
      'Single Customs Territory (SCT) fast-track inspection and digital manifest pilot initiated at Gatuna-Katuna one-stop border post.',
    observedImpact:
      'Truck clearance turnaround shortened from 14 hours to 3.5 hours; initial destination inventory drawdowns stabilized spread.',
    divergenceDelta: '-1.1% post-clearance spread reduction within 14 days',
    sourceProvenance:
      'CB-FVT scenario register / DEMO-P1 · Authored 24 Sep 2026 · Review due 11 Sep 2026',
    reviewDate: '2026-09-11',
  },
  {
    id: 'pol-2',
    code: 'P2',
    date: '2026-07-22',
    corridorId: 'busia',
    title: 'SPS Maize Moisture Enforcement',
    category: 'SPS',
    description:
      'Sanitary and Phytosanitary (SPS) aflatoxin and 13.5% moisture content screening strictly mandated at Busia border.',
    observedImpact:
      'Diverted informal grain flows to feeder footpaths; slight temporary origin price discounting in Tororo.',
    divergenceDelta: '+2.4% temporary divergence widening',
    sourceProvenance:
      'EAC Trade Policy Observatory · Notification EAC/SPS/2026/04',
    reviewDate: '2026-08-30',
  },
];

// Raw baseline prices for Gatuna / Katuna (Maize)
const RAW_GATUNA_MAIZE: {
  date: string;
  displayDate: string;
  origin: number;
  dest: number | null;
  volume: number;
  policy?: PolicyEvent;
}[] = [
  { date: '2026-07-06', displayDate: '06 Jul 2026', origin: 280, dest: 320, volume: 170 },
  { date: '2026-07-13', displayDate: '13 Jul 2026', origin: 282, dest: 325, volume: 180 },
  { date: '2026-07-20', displayDate: '20 Jul 2026', origin: 285, dest: 330, volume: 200 },
  { date: '2026-07-27', displayDate: '27 Jul 2026', origin: 288, dest: 335, volume: 220 },
  { date: '2026-08-03', displayDate: '03 Aug 2026', origin: 290, dest: 342, volume: 190 },
  {
    date: '2026-08-10',
    displayDate: '10 Aug 2026',
    origin: 292,
    dest: 348,
    volume: 180,
    policy: POLICY_EVENTS[0], // P1 on 12 Aug
  },
  {
    date: '2026-08-17',
    displayDate: '17 Aug 2026',
    origin: 295,
    dest: null, // Explicit Missed Data
    volume: 170,
  },
  { date: '2026-08-24', displayDate: '24 Aug 2026', origin: 296, dest: 355, volume: 170 },
  { date: '2026-08-31', displayDate: '31 Aug 2026', origin: 297, dest: 356, volume: 210 },
  { date: '2026-09-07', displayDate: '07 Sep 2026', origin: 298, dest: 354, volume: 230 },
  { date: '2026-09-14', displayDate: '14 Sep 2026', origin: 300, dest: 357, volume: 230 },
  { date: '2026-09-21', displayDate: '21 Sep 2026', origin: 302, dest: 360, volume: 260 },
  { date: '2026-09-28', displayDate: '28 Sep 2026', origin: 300, dest: 354, volume: 240 },
];

/**
 * Generate full enriched observation array with rolling means
 */
export function getObservations(
  corridorId: CorridorId = 'gatuna-katuna',
  commodityId: CommodityId = 'maize'
): PriceObservation[] {
  // Commodity multiplier adjustments for realistic multi-crop simulation
  const commodityMultiplier =
    commodityId === 'beans'
      ? 1.45
      : commodityId === 'rice'
      ? 1.85
      : commodityId === 'sorghum'
      ? 0.92
      : 1.0;

  const corridorFactor =
    corridorId === 'rusumo'
      ? 0.96
      : corridorId === 'busia'
      ? 0.94
      : corridorId === 'malaba'
      ? 0.95
      : 1.0;

  const originPrices = RAW_GATUNA_MAIZE.map((row) =>
    Math.round(row.origin * commodityMultiplier * corridorFactor)
  );

  const destPrices = RAW_GATUNA_MAIZE.map((row) => {
    // Keep missing observation for Gatuna on 17 Aug
    if (corridorId === 'gatuna-katuna' && row.dest === null) {
      return null;
    }
    const baseDest = row.dest ?? Math.round(row.origin * 1.18);
    return Math.round(baseDest * commodityMultiplier * corridorFactor);
  });

  return RAW_GATUNA_MAIZE.map((row, index) => {
    const origin = originPrices[index];
    const dest = destPrices[index];
    const divergence = calculateDivergence(origin, dest);
    const rolling30 = calculateRollingAverage(destPrices, index, 4); // 4-week (~30-day) window
    const rolling90 = calculateRollingAverage(destPrices, index, 12); // 12-week (~90-day) window
    const status = dest === null ? 'missed' : 'available';

    return {
      id: `${corridorId}-${commodityId}-${row.date}`,
      date: row.date,
      displayDate: row.displayDate,
      corridorId,
      commodityId,
      originPriceUsdPerMt: origin,
      destPriceUsdPerMt: dest,
      divergencePct: divergence,
      rolling30UsdPerMt: rolling30,
      rolling90UsdPerMt: rolling90,
      volumeTons: row.volume,
      status,
      policyEvent: row.policy,
    };
  });
}

export const BIWEEKLY_VOLUMES: VolumeRecord[] = [
  { period: 'Jul A', displayRange: '01 Jul – 15 Jul', maize: 250, beans: 110, rice: 80, sorghum: 60, total: 500 },
  { period: 'Jul B', displayRange: '16 Jul – 31 Jul', maize: 230, beans: 130, rice: 90, sorghum: 50, total: 500 },
  { period: 'Aug A', displayRange: '01 Aug – 15 Aug', maize: 210, beans: 120, rice: 80, sorghum: 50, total: 460 },
  { period: 'Aug B', displayRange: '16 Aug – 31 Aug', maize: 180, beans: 110, rice: 80, sorghum: 50, total: 420 },
  { period: 'Sep A', displayRange: '01 Sep – 15 Sep', maize: 240, beans: 100, rice: 80, sorghum: 60, total: 480 },
  { period: 'Sep B', displayRange: '16 Sep – 30 Sep', maize: 240, beans: 100, rice: 80, sorghum: 60, total: 480 },
];

export const KPI_BENCHMARKS: KpiSummary = {
  maxDivergencePct: 18.0,
  maxDivergenceCorridor: 'Gatuna / Katuna',
  maxDivergenceCommodity: 'Maize',
  mostVolatileCommodity: 'Beans',
  volatilityCvPct: 12.4,
  volatilityContext: '90-day prices · all corridors',
  totalMonitoredCorridors: 4,
  completeSeriesCount: 3,
  partialSeriesCount: 1,
  asOfTimestamp: '28 Sep 2026, 09:00 EAT',
};

