export type CorridorId = 'gatuna-katuna' | 'rusumo' | 'busia' | 'malaba';
export type CommodityId = 'maize' | 'beans' | 'rice' | 'sorghum';

export interface PolicyEvent {
  id: string;
  code: string; // e.g. "P1"
  date: string;
  corridorId: CorridorId;
  title: string;
  category: 'Customs' | 'SPS' | 'Tariff' | 'Border Restriction';
  description: string;
  observedImpact: string;
  divergenceDelta: string;
  sourceProvenance: string;
  reviewDate: string;
}

export interface PriceObservation {
  id: string;
  date: string; // YYYY-MM-DD
  displayDate: string; // e.g. "28 Sep 2026"
  corridorId: CorridorId;
  commodityId: CommodityId;
  originPriceUsdPerMt: number | null;
  destPriceUsdPerMt: number | null;
  divergencePct: number | null;
  rolling30UsdPerMt: number | null;
  rolling90UsdPerMt: number | null;
  volumeTons: number | null;
  status: 'available' | 'missed';
  policyEvent?: PolicyEvent;
}

export interface VolumeRecord {
  period: string; // e.g. "Jul A", "Jul B", "Aug A", "Aug B", "Sep A", "Sep B"
  displayRange: string;
  maize: number;
  beans: number;
  rice: number;
  sorghum: number;
  total: number;
}

export interface CorridorMetadata {
  id: CorridorId;
  name: string;
  crossBorderRoute: string;
  originMarket: string;
  originCountry: string;
  originCountryCode: string;
  originPriceUsd: number;
  destMarket: string;
  destCountry: string;
  destCountryCode: string;
  destPriceUsd: number;
  currentDivergencePct: number;
  dataCompleteness: 'Complete' | 'Partial data';
  distanceKm: number;
  frictionNote: string;
  seriesCount: {
    total: number;
    available: number;
  };
}

export interface KpiSummary {
  maxDivergencePct: number;
  maxDivergenceCorridor: string;
  maxDivergenceCommodity: string;
  mostVolatileCommodity: string;
  volatilityCvPct: number;
  volatilityContext: string;
  totalMonitoredCorridors: number;
  completeSeriesCount: number;
  partialSeriesCount: number;
  asOfTimestamp: string;
}

