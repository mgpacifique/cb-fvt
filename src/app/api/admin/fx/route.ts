import { NextResponse } from 'next/server';
import { FX_BASELINES } from '@/lib/sourceMetadata';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    baselines: FX_BASELINES,
    baselineEffectiveDate: '2026-07-01',
    note: 'Fixed illustrative FX baseline per USD. DR Congo reference market is denominated directly in USD in this fixture.',
    timestamp: new Date().toISOString(),
  });
}

