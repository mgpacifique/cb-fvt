/**
 * FEWS NET Data Warehouse (FDW) API Type Definitions
 * Based on OpenAPI / Swagger Schema: https://fdw.fews.net/api/schema/swagger-ui/
 */

export interface FdwAuthRequest {
  username?: string;
  password?: string;
  token?: string;
}

export interface FdwAuthResponse {
  token: string;
}

export interface FdwMarketPriceFact {
  id: number;
  market: {
    id: number;
    name: string;
    country: {
      code: string;
      name: string;
    };
    latitude?: number;
    longitude?: number;
  };
  commodity: {
    id: number;
    name: string;
    category?: string;
  };
  period_date: string; // YYYY-MM-DD
  price_type: 'Wholesale' | 'Retail' | 'Farmgate';
  unit: {
    id: number;
    name: string; // e.g. "Kilogram", "Metric Ton"
  };
  currency: {
    id: number;
    code: string; // e.g. "UGX", "RWF", "KES", "USD"
  };
  value: number; // Raw local price
  value_usd?: number; // Normalized USD equivalent
  status?: string;
  data_source?: string;
}

export interface FdwTradeFlowFact {
  id: number;
  product: {
    id: number;
    name: string;
  };
  origin_country: {
    code: string;
    name: string;
  };
  destination_country: {
    code: string;
    name: string;
  };
  port?: {
    id: number;
    name: string; // e.g. "Gatuna / Katuna", "Busia", "Malaba", "Rusumo"
    latitude?: number;
    longitude?: number;
  };
  period_date: string; // YYYY-MM-DD
  quantity: number; // In metric tons
  value_usd?: number;
}

export interface FdwSyncOptions {
  corridorId?: string;
  commodityId?: string;
  startDate?: string;
  endDate?: string;
  countryCodes?: string[];
  rowLimit?: number;
}

export interface FdwSyncResult {
  runId: string;
  timestamp: string;
  status: 'COMPLETED' | 'FAILED' | 'PARTIAL';
  source: string;
  totalFetched: number;
  acceptedRows: number;
  quarantinedCount: number;
  priceObservationsCount: number;
  volumeRecordsCount: number;
  logs: Array<{ time: string; level: 'INFO' | 'WARN' | 'ERROR'; message: string }>;
  sampleObservations?: any[];
}
