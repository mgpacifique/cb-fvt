import { NextRequest, NextResponse } from 'next/server';
import { UserStore, toSafeUser } from '@/lib/auth/userStore';

export async function GET(request: NextRequest) {
  const cookieRole = request.cookies.get('cbfvt_role')?.value;
  const cookieToken = request.cookies.get('cbfvt_token')?.value;

  if (!cookieRole || !cookieToken) {
    return NextResponse.json({
      authenticated: false,
      role: 'observer',
      isAdmin: false,
      user: null,
    });
  }

  const isAdmin = cookieRole === 'admin' || cookieRole === 'super_admin';

  if (!isAdmin) {
    return NextResponse.json({
      authenticated: false,
      role: 'observer',
      isAdmin: false,
      user: null,
    });
  }

  // Find the primary or active admin from UserStore
  const users = UserStore.listUsers();
  const activeAdmin = users.find((u) => u.isActive) || null;

  if (!activeAdmin) {
    return NextResponse.json({
      authenticated: false,
      role: 'observer',
      isAdmin: false,
      user: null,
    });
  }

  return NextResponse.json({
    authenticated: true,
    role: activeAdmin.role,
    isAdmin: true,
    user: {
      ...activeAdmin,
      shortName: activeAdmin.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase(),
      sessionToken: cookieToken,
    },
  });
}
