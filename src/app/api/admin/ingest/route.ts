import { NextRequest, NextResponse } from 'next/server';
import { runEtlIngestion, getRunHistory } from '@/lib/etl/engine';
import { requireAdminAuth } from '@/lib/auth/serverAuth';

export async function GET(request: NextRequest) {
  // Guard admin run history
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  const history = getRunHistory();
  return NextResponse.json({
    status: 'success',
    runs: history,
    count: history.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  // Guard admin ingestion execution
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json().catch(() => ({}));
    const fileName = body.fileName || 'wfp_food_prices_uga.csv';
    const limit = body.limit || 500;

    const summary = runEtlIngestion(fileName, limit);

    return NextResponse.json({
      status: 'success',
      message: `ETL run ${summary.runId} completed`,
      run: summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
