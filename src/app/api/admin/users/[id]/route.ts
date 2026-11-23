import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/serverAuth';
import { UserStore, toSafeUser } from '@/lib/auth/userStore';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  const user = UserStore.findById(params.id);
  if (!user) {
    return NextResponse.json(
      { status: 'error', message: 'Administrator not found.' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: 'success',
    user: toSafeUser(user),
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json().catch(() => ({}));
    const updated = UserStore.updateUser(params.id, body);

    return NextResponse.json({
      status: 'success',
      message: 'Administrator updated successfully.',
      user: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to update administrator.' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const result = UserStore.deleteUser(params.id);
    return NextResponse.json({
      status: 'success',
      message: result.message,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to delete administrator.' },
      { status: 400 }
    );
  }
}
