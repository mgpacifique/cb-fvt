import { NextRequest, NextResponse } from 'next/server';
import { HdxCkanClient } from '@/lib/hdx/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const datasetId: string | undefined = body.datasetId;
    const countryCode: string | undefined = body.countryCode;
    const rowLimit: number = body.limit || 500;
    const saveToDisk: boolean = body.saveToDisk !== false;
    const apiKey: string | undefined = body.apiKey || process.env.HDX_API_KEY;

    const client = new HdxCkanClient(undefined, apiKey);

    const { syncResult, summary, records } = await client.syncDataset({
      datasetId,
      countryCode,
      rowLimit,
      saveToDisk,
    });

    return NextResponse.json({
      status: 'success',
      run: summary,
      syncResult,
      observationsCount: records.length,
      sampleRecords: records.slice(0, 5),
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
