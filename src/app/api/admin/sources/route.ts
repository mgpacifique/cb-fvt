import { NextResponse } from 'next/server';
import { DATA_SOURCES } from '@/lib/sourceMetadata';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    sources: Object.values(DATA_SOURCES),
    timestamp: new Date().toISOString(),
  });
}

