/**
 * Metadata specifications for CB-FVT East Africa Data Providers
 * Ingested from FEWS NET, HDX (Humanitarian Data Exchange), and WFP VAM.
 */

export interface SourceInfo {
  id: string;
  name: string;
  format: string;
  schedule: string;
  connection: 'connected' | 'planned';
  lastPublication: string | null;
  coverageCadence: string;
  geographicScope: string;
  license: string;
  notes: string;
}

export const DATA_SOURCES: Record<string, SourceInfo> = {
  demo: {
    id: 'demo',
    name: 'CB-FVT demo v1',
    format: 'Local fixture · CSV + JSON',
    schedule: 'Manual snapshot',
    connection: 'connected',
    lastPublication: '28 Sep 2026, 09:00 EAT',
    coverageCadence: 'Weekly observations · Fortnightly volume aggregation',
    geographicScope: 'Gatuna/Katuna, Rusumo, Busia, Malaba',
    license: 'Creative Commons Attribution (CC-BY 4.0)',
    notes: 'Reference benchmark dataset reflecting Release 1.0 SRS verification criteria.',
  },
  fewsnet: {
    id: 'fewsnet',
    name: 'FEWS NET East Africa (FDW API)',
    format: 'Live REST API · JSON (Swagger OpenAPI 3.0)',
    schedule: 'Automated Ingestion · Mon 06:00 EAT',
    connection: 'connected',
    lastPublication: 'Active · https://fdw.fews.net/api/schema/swagger-ui/',
    coverageCadence: 'Weekly cross-border market price facts & trade flow quantity',
    geographicScope: 'East Africa Cross-Border Trade Bulletin network (Uganda, Kenya, Rwanda, Tanzania, DRC, South Sudan)',
    license: 'US Government Public Domain / USAID Data Policy',
    notes: 'Primary source for informal headload, bicycle, and light truck agricultural tonnage with REST token authentication.',
  },
  hdx: {
    id: 'hdx',
    name: 'HDX / OCHA Data Exchange (CKAN API)',
    format: 'Live REST API · CKAN v3 (CSV & DataStore)',
    schedule: 'Automated / On-demand · CKAN REST package sync',
    connection: 'connected',
    lastPublication: 'Active · https://data.humdata.org/api/3/',
    coverageCadence: 'Weekly & monthly food prices and FEWS NET cross-border data',
    geographicScope: 'Uganda (uga), Rwanda (rwa), Kenya (ken), Tanzania (tza), DR Congo (cod)',
    license: 'Creative Commons Attribution Intergovernmental (CC-BY-IGO)',
    notes: 'Live programmatic connector querying package_search, package_show and automated CSV ingestion via OCHA CKAN engine.',
  },
  wfp: {
    id: 'wfp',
    name: 'WFP VAM via HDX Data Repository',
    format: 'Live CKAN REST Stream · CSV Harmonization',
    schedule: 'Synchronized via HDX · Mon 06:30 EAT',
    connection: 'connected',
    lastPublication: 'Active · wfp-food-prices-for-uganda & rwanda',
    coverageCadence: 'High-frequency wholesale/retail staple market price surveillance',
    geographicScope: 'East Africa wholesale & border hub markets (Gatuna, Katuna, Busia, Malaba)',
    license: 'WFP Terms of Service / CC-BY-IGO',
    notes: 'Primary benchmark for origin/destination market price spreads harmonized under SRS Non-Imputation Rule NFR 5.',
  },
};

export const FX_BASELINES = [
  { currency: 'UGX', pair: 'USD / UGX', baseline: '3,700', pegDate: '01 Jul 2026', country: 'Uganda' },
  { currency: 'RWF', pair: 'USD / RWF', baseline: '1,350', pegDate: '01 Jul 2026', country: 'Rwanda' },
  { currency: 'KES', pair: 'USD / KES', baseline: '129', pegDate: '01 Jul 2026', country: 'Kenya' },
  { currency: 'TZS', pair: 'USD / TZS', baseline: '2,600', pegDate: '01 Jul 2026', country: 'Tanzania' },
  { currency: 'CDF', pair: 'USD / CDF', baseline: '2,850', pegDate: '01 Jul 2026', country: 'DR Congo' },
];

