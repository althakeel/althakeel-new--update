import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const normalizeUsername = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '');
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getPrimaryAdminEmail = () => normalizeEmail(process.env.NEXT_PUBLIC_PRIMARY_ADMIN_EMAIL || 'althakeel.com@gmail.com');

const readBearerToken = (request: Request): string | null => {
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) {
    return null;
  }

  const token = header.slice('Bearer '.length).trim();
  return token || null;
};

export async function POST(request: Request) {
  try {
    const token = readBearerToken(request);
    if (!token) {
      return NextResponse.json({ success: false, message: 'Missing authorization token.' }, { status: 401 });
    }

    const auth = adminAuth();
    const decodedToken = await auth.verifyIdToken(token);
    const requesterEmail = normalizeEmail(decodedToken.email || '');

    if (!requesterEmail || requesterEmail !== getPrimaryAdminEmail()) {
      return NextResponse.json({ success: false, message: 'Only the primary admin can provision credentials.' }, { status: 403 });
    }

    const body = await request.json();
    const email = normalizeEmail(String(body?.email || ''));
    const username = normalizeUsername(String(body?.username || ''));
    const password = String(body?.password || '').trim();

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, message: 'Valid email is required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    try {
      const existingUser = await auth.getUserByEmail(email);
      await auth.updateUser(existingUser.uid, {
        password,
        displayName: username || existingUser.displayName || undefined,
      });

      return NextResponse.json({
        success: true,
        mode: 'updated',
        uid: existingUser.uid,
      });
    } catch (error) {
      const errorCode = (error as { code?: string })?.code;
      if (errorCode !== 'auth/user-not-found') {
        throw error;
      }

      const createdUser = await auth.createUser({
        email,
        password,
        displayName: username || undefined,
      });

      return NextResponse.json({
        success: true,
        mode: 'created',
        uid: createdUser.uid,
      });
    }
  } catch (error) {
    console.error('Provision user credentials error:', error);
    const message = error instanceof Error ? error.message : 'Failed to provision credentials.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
