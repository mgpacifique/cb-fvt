import { NextRequest, NextResponse } from 'next/server';
import { FewsNetClient } from '@/lib/fewsnet/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { username, password, token, baseUrl } = body;

    const client = new FewsNetClient(baseUrl);
    const result = await client.testConnection({ username, password, token });

    return NextResponse.json({
      status: result.success ? 'success' : 'error',
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        success: false,
        authenticated: false,
        message: error.message || 'Unknown connection error',
        latencyMs: 0,
      },
      { status: 500 }
    );
  }
}
