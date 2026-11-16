import { NextResponse } from 'next/server';
import { CORRIDORS } from '@/lib/data';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: Object.values(CORRIDORS),
    timestamp: new Date().toISOString(),
  });
}

