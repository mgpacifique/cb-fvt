import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/serverAuth';
import { UserStore } from '@/lib/auth/userStore';

export async function GET(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const users = UserStore.listUsers();
    return NextResponse.json({
      status: 'success',
      data: users,
      total: users.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to list administrators.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, username, password, role, organization, title } = body;

    if (!name || !email || !username || !password) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Name, email, username, and password are required to create an administrator.',
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Password must be at least 6 characters.',
        },
        { status: 400 }
      );
    }

    const newUser = UserStore.createUser({
      name,
      email,
      username,
      password,
      role: role === 'super_admin' ? 'super_admin' : 'admin',
      organization,
      title,
    });

    return NextResponse.json({
      status: 'success',
      message: `Administrator ${newUser.name} created successfully.`,
      user: newUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to create administrator.' },
      { status: 400 }
    );
  }
}
