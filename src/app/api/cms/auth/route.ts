import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  CMS_COOKIE_NAME,
  checkRateLimit,
  clearFailedAttempts,
  createSessionToken,
  getClientIp,
  isRequestAuthorized,
  recordFailedAttempt,
  verifyCsrfOrigin,
  verifyPasswordTimingSafe,
} from '@/lib/cmsAuth';

export async function GET() {
  const authorized = isRequestAuthorized();
  return NextResponse.json(
    { authenticated: authorized },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(request: Request) {
  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const ip = getClientIp();
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${rate.retryAfterSec} detik.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!verifyPasswordTimingSafe(password)) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: 'Password admin tidak valid.' },
        { status: 401 }
      );
    }

    clearFailedAttempts(ip);
    const token = createSessionToken();

    cookies().set({
      name: CMS_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export async function DELETE() {
  cookies().delete(CMS_COOKIE_NAME);
  return NextResponse.json({ authenticated: false });
}
