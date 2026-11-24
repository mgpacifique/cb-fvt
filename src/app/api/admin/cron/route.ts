import { NextRequest, NextResponse } from 'next/server';
import { getCronState, updateCronSettings, executeCronSync } from '@/lib/scheduler/cronService';

export async function GET() {
  const state = getCronState();
  return NextResponse.json({
    status: 'success',
    cron: state,
    hasCronSecret: !!process.env.CRON_SECRET,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, enabled, scheduleCron } = body;

    if (action === 'trigger_now') {
      const result = await executeCronSync('Admin Manual Trigger');
      return NextResponse.json({
        status: 'success',
        message: 'Cron extraction executed immediately',
        execution: result.record,
        cron: getCronState(),
      });
    }

    if (action === 'update_settings') {
      const updated = updateCronSettings(enabled, scheduleCron);
      return NextResponse.json({
        status: 'success',
        message: 'Cron configuration updated',
        cron: updated,
      });
    }

    return NextResponse.json(
      { status: 'error', message: 'Unknown action specified. Use "trigger_now" or "update_settings".' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
