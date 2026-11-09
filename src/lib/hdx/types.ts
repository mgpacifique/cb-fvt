/**
 * Type definitions for Humanitarian Data Exchange (HDX) CKAN API v3
 * Based on OCHA HDX CKAN API Cookbook specifications.
 * Endpoint: https://data.humdata.org/api/3/action/
 */

export interface HdxResponse<T> {
  help: string;
  success: boolean;
  result: T;
  error?: {
    message: string;
    __type: string;
  };
}

export interface HdxResource {
  id: string;
  package_id: string;
  name: string;
  description?: string;
  format: string; // CSV, XLSX, JSON, etc.
  url: string;
  download_url?: string;
  created?: string;
  last_modified?: string;
  metadata_modified?: string;
  size?: number;
  mimetype?: string;
  hdx_rel_url?: string;
  datastore_active?: boolean;
}

export interface HdxGroup {
  id: string;
  name: string; // ISO3 lowercase e.g. "uga", "rwa", "ken", "tza"
  title: string; // "Uganda", "Rwanda", etc.
  display_name?: string;
}

export interface HdxOrganization {
  id: string;
  name: string; // e.g. "wfp", "fews-net", "ocha"
  title: string;
  description?: string;
  image_url?: string;
}

export interface HdxTag {
  id: string;
  name: string;
  display_name: string;
}

export interface HdxDataset {
  id: string;
  name: string; // dataset slug / stub e.g. "wfp-food-prices-for-uganda"
  title: string; // "Uganda - Food Prices"
  notes?: string;
  author?: string;
  maintainer?: string;
  dataset_date?: string;
  dataset_source?: string;
  subnational?: string | boolean;
  license_id?: string;
  license_title?: string;
  metadata_created?: string;
  metadata_modified?: string;
  organization?: HdxOrganization;
  groups?: HdxGroup[];
  tags?: HdxTag[];
  resources: HdxResource[];
  num_resources?: number;
}

export interface HdxPackageSearchResult {
  count: number;
  sort?: string;
  results: HdxDataset[];
}

export interface HdxSearchOptions {
  query?: string;
  fq?: string;
  groups?: string[]; // e.g. ['uga', 'rwa']
  organization?: string; // e.g. 'wfp', 'fews-net'
  format?: string; // e.g. 'CSV'
  rows?: number;
  start?: number;
  sort?: string; // e.g. 'metadata_modified desc'
}

export interface HdxPriceRecord {
  date: string;
  admin1: string;
  admin2: string;
  market: string;
  marketId: string;
  latitude: number;
  longitude: number;
  category: string;
  commodity: string;
  commodityId: string;
  unit: string;
  priceFlag: string;
  priceType: string;
  currency: string;
  price: number;
  usdPrice: number;
}

export interface HdxSyncResult {
  dataset: {
    id: string;
    name: string;
    title: string;
    lastModified: string | null;
  };
  resource: {
    id: string;
    name: string;
    format: string;
    downloadUrl: string;
  };
  summary: {
    totalRows: number;
    acceptedRows: number;
    rejectedDuplicates: number;
    rejectedNulls: number;
    heldUnmapped: number;
    fxPending: number;
  };
  observationsCount: number;
  quarantinedCount: number;
  savedToRawPath?: string;
}
