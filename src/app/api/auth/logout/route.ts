import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    status: 'success',
    message: 'Signed out successfully.',
  });

  response.cookies.set('cbfvt_role', '', { path: '/', maxAge: 0 });
  response.cookies.set('cbfvt_token', '', { path: '/', maxAge: 0 });

  return response;
}
