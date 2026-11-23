import { NextRequest, NextResponse } from 'next/server';
import { UserStore } from '@/lib/auth/userStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Email, verification code, and new password are required.',
        },
        { status: 400 }
      );
    }

    if (newPassword.trim().length < 6) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'New password must be at least 6 characters long.',
        },
        { status: 400 }
      );
    }

    const result = UserStore.confirmPasswordReset(email.trim(), code.trim(), newPassword.trim());

    return NextResponse.json({
      status: 'success',
      message: result.message,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to reset password.' },
      { status: 400 }
    );
  }
}
