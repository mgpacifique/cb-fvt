import { NextRequest, NextResponse } from 'next/server';
import { getQuarantinedRecords } from '@/lib/etl/engine';
import { requireAdminAuth } from '@/lib/auth/serverAuth';

export async function GET(request: NextRequest) {
  // Guard admin quarantine audit log
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  const records = getQuarantinedRecords();
  return NextResponse.json({
    status: 'success',
    totalQuarantined: records.length,
    records,
    summary: {
      duplicates: records.filter((r) => r.reason === 'DUPLICATE').length,
      nulls: records.filter((r) => r.reason === 'NULL_REQUIRED').length,
      unmapped: records.filter((r) => r.reason === 'UNMAPPED_COORDINATES').length,
      fxPending: records.filter((r) => r.reason === 'FX_PENDING').length,
    },
    ruleCitation: 'SRS Non-Imputation Rule NFR 5: Missing observations stay missing on charts; rejected rows are never silently converted to zero.',
    timestamp: new Date().toISOString(),
  });
}
