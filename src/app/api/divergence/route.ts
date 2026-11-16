import { NextRequest, NextResponse } from 'next/server';
import { getObservations, CORRIDORS, COMMODITIES } from '@/lib/data';
import { CorridorId, CommodityId } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const corridor = (searchParams.get('corridor') || 'gatuna-katuna') as CorridorId;
  const commodity = (searchParams.get('commodity') || 'maize') as CommodityId;

  if (!CORRIDORS[corridor]) {
    return NextResponse.json(
      { error: `Invalid corridor '${corridor}'. Available: ${Object.keys(CORRIDORS).join(', ')}` },
      { status: 400 }
    );
  }

  if (!COMMODITIES[commodity]) {
    return NextResponse.json(
      { error: `Invalid commodity '${commodity}'. Available: ${Object.keys(COMMODITIES).join(', ')}` },
      { status: 400 }
    );
  }

  const observations = getObservations(corridor, commodity);

  return NextResponse.json({
    status: 'success',
    corridor: CORRIDORS[corridor],
    commodity: COMMODITIES[commodity],
    observations,
    summary: {
      count: observations.length,
      availableCount: observations.filter((o) => o.status === 'available').length,
      missedCount: observations.filter((o) => o.status === 'missed').length,
    },
    attribution: 'Source: FEWS NET/WFP via CB-FVT',
    timestamp: new Date().toISOString(),
  });
}

