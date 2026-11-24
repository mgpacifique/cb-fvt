import { NextRequest, NextResponse } from 'next/server';
import { UserStore, toSafeUser } from '@/lib/auth/userStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, username, password } = body;

    const identifier = (email || username || '').trim();
    const providedPass = (password || '').trim();

    if (!identifier || !providedPass) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Both username/email and password are required.',
        },
        { status: 400 }
      );
    }

    // Look up administrator dynamically in UserStore
    const user = UserStore.findByIdentifier(identifier);

    if (!user) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid administrator credentials. Access to Data Operations Console denied.',
        },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'This administrator account has been deactivated. Contact the Super Administrator.',
        },
        { status: 403 }
      );
    }

    const isMatch = UserStore.verifyPassword(user, providedPass);
    if (!isMatch) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid administrator credentials. Access to Data Operations Console denied.',
        },
        { status: 401 }
      );
    }

    // Successful Admin Authentication
    UserStore.recordLogin(user.id);
    const timestamp = Date.now();
    const sessionToken = `cbfvt_admin_sess_${timestamp}_${Math.random().toString(36).substring(2, 10)}`;

    const safeUser = toSafeUser(user);

    const response = NextResponse.json({
      status: 'success',
      message: 'Administrator session authenticated successfully.',
      user: {
        ...safeUser,
        shortName: safeUser.name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
        sessionToken,
        apiKey: 'cbfvt_key_live_admin_sec_2026_root',
      },
      role: safeUser.role,
      token: sessionToken,
    });

    // Set cookies for secure SSR & route protection
    response.cookies.set('cbfvt_role', safeUser.role, {
      path: '/',
      maxAge: 604800,
      sameSite: 'lax',
      httpOnly: false,
    });
    response.cookies.set('cbfvt_token', sessionToken, {
      path: '/',
      maxAge: 604800,
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;
  } catch (error: any) {
    console.error('[Auth API] Login exception:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Internal authentication error.',
      },
      { status: 500 }
    );
  }
}
