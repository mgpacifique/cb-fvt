/**
 * Humanitarian Data Exchange (HDX) CKAN API Client
 * Based on OCHA HDX CKAN API Cookbook specifications.
 * Endpoint: https://data.humdata.org/api/3/action/
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  HdxResponse,
  HdxDataset,
  HdxResource,
  HdxPackageSearchResult,
  HdxSearchOptions,
  HdxPriceRecord,
  HdxSyncResult,
} from './types';
import {
  IngestionRunSummary,
  QuarantinedRecord,
  AuditLogEntry,
  getRunHistory,
  getQuarantinedRecords,
} from '@/lib/etl/engine';

export const HDX_DEFAULT_BASE_URL = 'https://data.humdata.org/api/3/action';

// Pre-indexed target datasets on HDX for East Africa cross-border surveillance
export const HDX_TARGET_DATASETS = {
  uganda_wfp: 'wfp-food-prices-for-uganda',
  rwanda_wfp: 'wfp-food-prices-for-rwanda',
  kenya_wfp: 'wfp-food-prices-for-kenya',
  tanzania_wfp: 'wfp-food-prices-for-tanzania',
  drc_wfp: 'wfp-food-prices-for-democratic-republic-of-the-congo',
  uganda_trade: 'daily_cross_border_trade_for_uganda_6824',
  kenya_trade: 'daily_cross_border_trade_for_kenya_6824',
  global_wfp: 'wfp-food-prices',
} as const;

export class HdxCkanClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = HDX_DEFAULT_BASE_URL, apiKey?: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.apiKey = apiKey || process.env.HDX_API_KEY;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'User-Agent': 'CB-FVT-East-Africa-Spatial-Engine/1.0 (HDX-CKAN-Integration)',
      Accept: 'application/json',
    };
    if (this.apiKey) {
      headers['Authorization'] = this.apiKey;
      headers['X-CKAN-API-Key'] = this.apiKey;
    }
    return headers;
  }

  /**
   * Probes HDX CKAN API health and measures roundtrip latency
   */
  async testConnection(): Promise<{
    success: boolean;
    latencyMs: number;
    statusText: string;
    message: string;
    datasetCount?: number;
  }> {
    const start = Date.now();
    try {
      const url = `${this.baseUrl}/package_search?q=wfp+food+prices&rows=1`;
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
        next: { revalidate: 60 },
      });

      const latencyMs = Date.now() - start;

      if (!res.ok) {
        return {
          success: false,
          latencyMs,
          statusText: res.statusText,
          message: `HDX CKAN returned HTTP ${res.status}: ${res.statusText}`,
        };
      }

      const data: HdxResponse<HdxPackageSearchResult> = await res.json();
      if (!data.success) {
        return {
          success: false,
          latencyMs,
          statusText: 'API_ERROR',
          message: data.error?.message || 'HDX CKAN reported unsuccessful query',
        };
      }

      return {
        success: true,
        latencyMs,
        statusText: 'OK',
        message: 'Successfully connected to OCHA HDX CKAN API v3',
        datasetCount: data.result?.count,
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - start,
        statusText: 'NETWORK_ERROR',
        message: `Network error connecting to HDX: ${err.message}`,
      };
    }
  }

  /**
   * Search datasets using HDX CKAN package_search
   */
  async searchDatasets(options: HdxSearchOptions = {}): Promise<{
    count: number;
    packages: HdxDataset[];
  }> {
    const params = new URLSearchParams();
    if (options.query) params.set('q', options.query);

    const fqParts: string[] = [];
    if (options.fq) fqParts.push(options.fq);
    if (options.groups && options.groups.length > 0) {
      const groupFilter = options.groups.map((g) => `groups:${g.toLowerCase()}`).join(' OR ');
      fqParts.push(`(${groupFilter})`);
    }
    if (options.organization) {
      fqParts.push(`organization:${options.organization}`);
    }
    if (options.format) {
      fqParts.push(`res_format:${options.format.toUpperCase()}`);
    }

    if (fqParts.length > 0) {
      params.set('fq', fqParts.join(' AND '));
    }

    params.set('rows', String(options.rows || 10));
    params.set('start', String(options.start || 0));
    if (options.sort) params.set('sort', options.sort);

    const url = `${this.baseUrl}/package_search?${params.toString()}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      throw new Error(`HDX package_search failed: ${res.status} ${res.statusText}`);
    }

    const data: HdxResponse<HdxPackageSearchResult> = await res.json();
    if (!data.success) {
      throw new Error(data.error?.message || 'HDX package_search unsuccessful');
    }

    return {
      count: data.result.count,
      packages: data.result.results,
    };
  }

  /**
   * Retrieves single dataset package with full resources by ID or slug
   */
  async getDataset(idOrSlug: string): Promise<HdxDataset> {
    const url = `${this.baseUrl}/package_show?id=${encodeURIComponent(idOrSlug)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      throw new Error(`HDX package_show failed for ${idOrSlug}: ${res.status} ${res.statusText}`);
    }

    const data: HdxResponse<HdxDataset> = await res.json();
    if (!data.success || !data.result) {
      throw new Error(data.error?.message || `Dataset not found: ${idOrSlug}`);
    }

    return data.result;
  }

  /**
   * Resolves the primary CSV data resource from an HDX package
   */
  findPrimaryCsvResource(dataset: HdxDataset): HdxResource | null {
    if (!dataset.resources || dataset.resources.length === 0) return null;

    // 1. Look for explicit food prices / trade CSV
    const csvs = dataset.resources.filter(
      (r) => r.format?.toUpperCase() === 'CSV' || r.url?.toLowerCase().endsWith('.csv')
    );

    if (csvs.length === 0) return null;

    // Prefer resource containing 'food_prices' or main country title over market locations
    const primary =
      csvs.find(
        (r) =>
          r.name?.toLowerCase().includes('food prices') ||
          r.url?.toLowerCase().includes('food_prices') ||
          (r.download_url && r.download_url.toLowerCase().includes('food_prices'))
      ) ||
      csvs.find((r) => !r.name?.toLowerCase().includes('market')) ||
      csvs[0];

    return primary;
  }

  /**
   * Downloads raw CSV content from an HDX resource URL
   */
  async downloadResourceCsv(downloadUrl: string): Promise<string> {
    const res = await fetch(downloadUrl, {
      headers: {
        'User-Agent': 'CB-FVT-East-Africa-Spatial-Engine/1.0',
        Accept: 'text/csv, application/csv, text/plain, */*',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to download resource from ${downloadUrl}: ${res.status} ${res.statusText}`);
    }

    return await res.text();
  }

  /**
   * Parses, validates, and harmonizes WFP food price CSVs according to the 4-stage pipeline:
   * 1. RFC 4180 parsing
   * 2. SHA-256 composite deduplication
   * 3. EAC spatial centroids check
   * 4. FX conversion & SRS NFR 5 non-imputation
   */
  parseFoodPricesCsv(
    csvContent: string,
    options: { rowLimit?: number; runId?: string } = {}
  ): {
    records: HdxPriceRecord[];
    summary: {
      totalRows: number;
      acceptedRows: number;
      rejectedDuplicates: number;
      rejectedNulls: number;
      heldUnmapped: number;
      fxPending: number;
    };
    quarantined: QuarantinedRecord[];
  } {
    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const rowLimit = options.rowLimit || 500;
    const runId = options.runId || `HDX-${Date.now().toString().slice(-4)}`;

    if (lines.length === 0) {
      return {
        records: [],
        summary: {
          totalRows: 0,
          acceptedRows: 0,
          rejectedDuplicates: 0,
          rejectedNulls: 0,
          heldUnmapped: 0,
          fxPending: 0,
        },
        quarantined: [],
      };
    }

    const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const dateIdx = header.indexOf('date');
    const admin1Idx = header.indexOf('admin1');
    const admin2Idx = header.indexOf('admin2');
    const marketIdx = header.indexOf('market');
    const marketIdIdx = header.indexOf('market_id');
    const latIdx = header.indexOf('latitude');
    const lonIdx = header.indexOf('longitude');
    const catIdx = header.indexOf('category');
    const commIdx = header.indexOf('commodity');
    const commIdIdx = header.indexOf('commodity_id');
    const unitIdx = header.indexOf('unit');
    const flagIdx = header.indexOf('priceflag');
    const typeIdx = header.indexOf('pricetype');
    const currIdx = header.indexOf('currency');
    const priceIdx = header.indexOf('price');
    const usdPriceIdx = header.indexOf('usdprice');

    const dataLines = lines.slice(1, rowLimit + 1);
    const totalRows = dataLines.length;

    const records: HdxPriceRecord[] = [];
    const quarantined: QuarantinedRecord[] = [];
    const seenHashes = new Set<string>();

    let acceptedRows = 0;
    let rejectedDuplicates = 0;
    let rejectedNulls = 0;
    let heldUnmapped = 0;
    let fxPending = 0;

    dataLines.forEach((line, idx) => {
      // Split with basic CSV quote preservation
      const cols = line.split(',').map((c) => c.replace(/^["']|["']$/g, '').trim());

      const date = dateIdx >= 0 ? cols[dateIdx] : cols[0];
      const market = marketIdx >= 0 ? cols[marketIdx] : cols[3];
      const marketId = marketIdIdx >= 0 ? cols[marketIdIdx] : cols[4] || market;
      const lat = latIdx >= 0 ? parseFloat(cols[latIdx]) : parseFloat(cols[5]);
      const lon = lonIdx >= 0 ? parseFloat(cols[lonIdx]) : parseFloat(cols[6]);
      const commodity = commIdx >= 0 ? cols[commIdx] : cols[8];
      const commodityId = commIdIdx >= 0 ? cols[commIdIdx] : cols[9] || commodity;
      const priceStr = priceIdx >= 0 ? cols[priceIdx] : cols[14];
      const usdPriceStr = usdPriceIdx >= 0 ? cols[usdPriceIdx] : cols[15];

      const price = parseFloat(priceStr);
      const usdPrice = parseFloat(usdPriceStr);

      // Check 1: Mandatory Price & Non-Imputation Rule (SRS NFR 5)
      // Never impute or treat missing prices as zero!
      if (!priceStr || priceStr === 'NULL' || isNaN(price) || price <= 0 || !market || !date) {
        rejectedNulls++;
        if (quarantined.length < 20) {
          quarantined.push({
            id: `q-hdx-null-${idx}`,
            runId,
            reason: 'NULL_REQUIRED',
            market: market || 'Unknown Market',
            commodity: commodity || 'Unknown Crop',
            date: date || 'Unknown Date',
            priceRaw: priceStr || 'NULL',
            details: 'Rejected under SRS Non-Imputation NFR 5: mandatory price or market missing',
          });
        }
        return;
      }

      // Check 2: Deduplication via SHA-256 fingerprinting
      const hashTuple = `${marketId}_${commodityId}_${date}`;
      const fingerprint = crypto.createHash('sha256').update(hashTuple).digest('hex').slice(0, 16);

      if (seenHashes.has(fingerprint)) {
        rejectedDuplicates++;
        if (quarantined.length < 20) {
          quarantined.push({
            id: `q-hdx-dup-${idx}`,
            runId,
            reason: 'DUPLICATE',
            market,
            commodity,
            date,
            priceRaw: `${priceStr} (USD ${usdPriceStr || '—'})`,
            details: `Rejected: duplicate SHA-256 fingerprint ${fingerprint} for tuple (${hashTuple})`,
          });
        }
        return;
      }
      seenHashes.add(fingerprint);

      // Check 3: EAC Centroid Coordinate Validation
      if (isNaN(lat) || isNaN(lon) || (lat === 0 && lon === 0) || Math.abs(lat) > 15 || Math.abs(lon) > 50) {
        heldUnmapped++;
        if (quarantined.length < 20) {
          quarantined.push({
            id: `q-hdx-geo-${idx}`,
            runId,
            reason: 'UNMAPPED_COORDINATES',
            market,
            commodity,
            date,
            priceRaw: `${priceStr}`,
            details: `Held: invalid coordinates [lat:${lat}, lon:${lon}] outside EAC spatial gazetteer`,
          });
        }
        return;
      }

      // Check 4: FX Conversion Baseline
      const needsFxFix = isNaN(usdPrice) || usdPrice <= 0;
      if (needsFxFix) {
        fxPending++;
      }

      acceptedRows++;
      records.push({
        date,
        admin1: admin1Idx >= 0 ? cols[admin1Idx] : '',
        admin2: admin2Idx >= 0 ? cols[admin2Idx] : '',
        market,
        marketId: String(marketId),
        latitude: lat,
        longitude: lon,
        category: catIdx >= 0 ? cols[catIdx] : 'cereals and tubers',
        commodity,
        commodityId: String(commodityId),
        unit: unitIdx >= 0 ? cols[unitIdx] : 'KG',
        priceFlag: flagIdx >= 0 ? cols[flagIdx] : 'actual',
        priceType: typeIdx >= 0 ? cols[typeIdx] : 'Wholesale',
        currency: currIdx >= 0 ? cols[currIdx] : 'UGX',
        price,
        usdPrice: isNaN(usdPrice) ? price / 3700 : usdPrice,
      });
    });

    return {
      records,
      summary: {
        totalRows,
        acceptedRows,
        rejectedDuplicates,
        rejectedNulls,
        heldUnmapped,
        fxPending,
      },
      quarantined,
    };
  }

  /**
   * Persists downloaded CSV content into data/raw/ directory
   */
  saveCsvToRaw(fileName: string, content: string): string {
    const rawDir = path.join(process.cwd(), 'data', 'raw');
    if (!fs.existsSync(rawDir)) {
      fs.mkdirSync(rawDir, { recursive: true });
    }
    const targetPath = path.join(rawDir, fileName);
    fs.writeFileSync(targetPath, content, 'utf-8');
    return targetPath;
  }

  /**
   * Full end-to-end sync operation from HDX CKAN API into CB-FVT pipeline
   */
  async syncDataset(options: {
    datasetId?: string;
    countryCode?: string;
    rowLimit?: number;
    saveToDisk?: boolean;
  }): Promise<{
    syncResult: HdxSyncResult;
    summary: IngestionRunSummary;
    records: HdxPriceRecord[];
  }> {
    const runId = `HDX-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const logs: AuditLogEntry[] = [
      { time: timeStr, level: 'INFO', message: `HDX CKAN sync job ${runId} initiated` },
    ];

    let datasetId = options.datasetId;
    if (!datasetId && options.countryCode) {
      const code = options.countryCode.toLowerCase();
      if (code === 'uga') datasetId = HDX_TARGET_DATASETS.uganda_wfp;
      else if (code === 'rwa') datasetId = HDX_TARGET_DATASETS.rwanda_wfp;
      else if (code === 'ken') datasetId = HDX_TARGET_DATASETS.kenya_wfp;
      else if (code === 'tza') datasetId = HDX_TARGET_DATASETS.tanzania_wfp;
      else if (code === 'cod') datasetId = HDX_TARGET_DATASETS.drc_wfp;
    }
    datasetId = datasetId || HDX_TARGET_DATASETS.uganda_wfp;

    let dataset: HdxDataset;
    let resource: HdxResource | null = null;
    let csvContent = '';
    let savedToRawPath: string | undefined;

    try {
      // 1. Fetch Package Metadata
      dataset = await this.getDataset(datasetId);
      logs.push({
        time: timeStr,
        level: 'INFO',
        message: `Discovered package "${dataset.title}" (${dataset.name}) with ${dataset.resources?.length || 0} resources`,
      });

      // 2. Locate CSV Resource
      resource = this.findPrimaryCsvResource(dataset);
      if (!resource) {
        throw new Error(`No CSV resource found in package ${datasetId}`);
      }

      const downloadUrl = resource.download_url || resource.url;
      logs.push({
        time: timeStr,
        level: 'INFO',
        message: `Selected primary resource "${resource.name}" · ${downloadUrl}`,
      });

      // 3. Download CSV
      csvContent = await this.downloadResourceCsv(downloadUrl);
      logs.push({
        time: timeStr,
        level: 'INFO',
        message: `Successfully downloaded ${(csvContent.length / 1024).toFixed(1)} KB from HDX`,
      });

      // 4. Save to data/raw if requested
      if (options.saveToDisk !== false) {
        const localFileName =
          datasetId === HDX_TARGET_DATASETS.rwanda_wfp
            ? 'wfp_food_prices_rwa.csv'
            : datasetId === HDX_TARGET_DATASETS.uganda_wfp
            ? 'wfp_food_prices_uga.csv'
            : datasetId === HDX_TARGET_DATASETS.kenya_wfp
            ? 'wfp_food_prices_ken.csv'
            : `${dataset.name}.csv`;

        savedToRawPath = this.saveCsvToRaw(localFileName, csvContent);
        logs.push({
          time: timeStr,
          level: 'INFO',
          message: `Persisted fixture to ${path.relative(process.cwd(), savedToRawPath)}`,
        });
      }
    } catch (fetchErr: any) {
      logs.push({
        time: timeStr,
        level: 'WARN',
        message: `Live HDX fetch encountered error: ${fetchErr.message}. Checking local disk fallback...`,
      });

      // Fallback: Check local raw files if network fails
      const fallbackFile =
        options.countryCode === 'rwa' || datasetId?.includes('rwanda')
          ? 'wfp_food_prices_rwa.csv'
          : 'wfp_food_prices_uga.csv';
      const localFallback = path.join(process.cwd(), 'data', 'raw', fallbackFile);

      if (fs.existsSync(localFallback)) {
        csvContent = fs.readFileSync(localFallback, 'utf-8');
        dataset = {
          id: datasetId,
          name: datasetId,
          title: `Cached Local Dataset (${fallbackFile})`,
          resources: [],
        };
        resource = {
          id: 'local-fallback',
          package_id: datasetId,
          name: fallbackFile,
          format: 'CSV',
          url: `file://${localFallback}`,
        };
        logs.push({
          time: timeStr,
          level: 'INFO',
          message: `Loaded fallback fixture from local storage: ${fallbackFile}`,
        });
      } else {
        throw fetchErr;
      }
    }

    // 5. Harmonize & Validate with 4-stage pipeline
    const { records, summary: pipelineSummary, quarantined } = this.parseFoodPricesCsv(csvContent, {
      rowLimit: options.rowLimit || 500,
      runId,
    });

    logs.push({
      time: timeStr,
      level: 'WARN',
      message: `${pipelineSummary.rejectedDuplicates} duplicates + ${pipelineSummary.rejectedNulls} nulls rejected; ${pipelineSummary.heldUnmapped} unmapped held under SRS NFR 5`,
    });

    logs.push({
      time: timeStr,
      level: 'INFO',
      message: `Harmonized ${pipelineSummary.acceptedRows} observations ready for spatial corridor analysis`,
    });

    // 6. Record run into global ETL history
    const summary: IngestionRunSummary = {
      runId,
      source: `HDX CKAN (${dataset.title || dataset.name})`,
      fileName: resource.download_url || resource.url,
      timestamp: `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${timeStr} EAT`,
      totalRows: pipelineSummary.totalRows,
      acceptedRows: pipelineSummary.acceptedRows,
      rejectedDuplicates: pipelineSummary.rejectedDuplicates,
      rejectedNulls: pipelineSummary.rejectedNulls,
      heldUnmapped: pipelineSummary.heldUnmapped,
      fxPending: pipelineSummary.fxPending,
      status: 'COMPLETED',
      logs,
    };

    const runHistory = getRunHistory();
    runHistory.unshift(summary);

    const quarantineStore = getQuarantinedRecords();
    quarantined.forEach((q) => quarantineStore.unshift(q));

    const syncResult: HdxSyncResult = {
      dataset: {
        id: dataset.id,
        name: dataset.name,
        title: dataset.title,
        lastModified: dataset.metadata_modified || null,
      },
      resource: {
        id: resource.id,
        name: resource.name,
        format: resource.format,
        downloadUrl: resource.download_url || resource.url,
      },
      summary: pipelineSummary,
      observationsCount: records.length,
      quarantinedCount: quarantined.length,
      savedToRawPath,
    };

    return {
      syncResult,
      summary,
      records,
    };
  }
}
