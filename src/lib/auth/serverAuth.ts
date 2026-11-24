import { NextRequest, NextResponse } from 'next/server';
import { UserStore, SafeUser } from './userStore';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'admin' | 'super_admin';
  organization: string;
  title: string;
}

/**
 * Validates request cookies and Authorization header for Admin privileges.
 * Returns null if valid admin session, or a 401/403 NextResponse if unauthorized.
 */
export function requireAdminAuth(request: NextRequest): NextResponse | null {
  // Check Authorization Bearer header
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  // Check cookies as fallback
  const cookieRole = request.cookies.get('cbfvt_role')?.value;
  const cookieToken = request.cookies.get('cbfvt_token')?.value;

  if (!token && cookieToken) {
    token = cookieToken;
  }

  // Check for admin token signature
  const isTokenAdmin =
    token &&
    (token.includes('admin') ||
      token.startsWith('cbfvt_tok_admin_') ||
      token.startsWith('cbfvt_admin_sess_'));
  const isRoleAdmin = cookieRole === 'admin' || cookieRole === 'super_admin';

  if (!isTokenAdmin && !isRoleAdmin) {
    return NextResponse.json(
      {
        status: 'error',
        code: 'UNAUTHORIZED_ACCESS',
        message:
          'Administrator credentials required. Access restricted for Standard Analyst role pursuant to SRS Access Control specifications.',
        requiredRole: 'admin',
      },
      { status: 403 }
    );
  }

  return null;
}
