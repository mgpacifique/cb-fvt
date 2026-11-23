import { NextRequest, NextResponse } from 'next/server';
import { UserStore } from '@/lib/auth/userStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { status: 'error', message: 'Email address is required.' },
        { status: 400 }
      );
    }

    const result = UserStore.requestPasswordReset(email.trim());

    return NextResponse.json({
      status: 'success',
      message: `Password reset verification code generated. Valid for ${result.expiryMinutes} minutes.`,
      // Return code in response for self-service verification
      resetCode: result.resetCode,
      expiryMinutes: result.expiryMinutes,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to process password reset request.' },
      { status: 400 }
    );
  }
}
