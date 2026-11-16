import { NextRequest, NextResponse } from 'next/server';
import { executeCronSync, getCronState } from '@/lib/scheduler/cronService';

/**
 * Public/Authorized Vercel Serverless Cron Handler
 * Configured in vercel.json: { "path": "/api/cron/fewsnet-sync", "schedule": "0 3 * * 1" }
 * Cadence: Every Monday at 06:00 EAT (03:00 UTC)
 */
export async function GET(request: NextRequest) {
  return handleCronExecution(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleCronExecution(request, 'POST');
}

async function handleCronExecution(request: NextRequest, method: string) {
  try {
    const cronState = getCronState();

    // 1. Verify cron is enabled
    if (!cronState.enabled) {
      return NextResponse.json({
        status: 'skipped',
        message: 'Automated weekly ingestion is currently paused by administrator.',
        nextExecution: cronState.nextExecution,
      });
    }

    // 2. Optional Security Verification (CRON_SECRET)
    const expectedSecret = process.env.CRON_SECRET;
    if (expectedSecret) {
      const authHeader = request.headers.get('authorization');
      const xCronSecret = request.headers.get('x-cron-secret');
      const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

      if (bearerToken !== expectedSecret && xCronSecret !== expectedSecret) {
        return NextResponse.json(
          { status: 'unauthorized', message: 'Invalid or missing CRON_SECRET token' },
          { status: 401 }
        );
      }
    }

    // 3. Execute Automated Ingestion Pipeline
    const result = await executeCronSync(`Vercel Serverless Cron (${method})`);

    return NextResponse.json({
      status: 'success',
      message: 'Weekly FEWS NET FDW extraction completed successfully',
      execution: result.record,
      nextScheduledRun: getCronState().nextExecution,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: `Cron execution failed: ${error.message}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
