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
import { recordSecurityEvent, verifyEnterpriseCsrf } from '@/lib/enterpriseSecurity';

export async function GET() {
  const authorized = isRequestAuthorized();
  return NextResponse.json(
    { authenticated: authorized },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(request: Request) {
  if (!verifyCsrfOrigin(request) || !verifyEnterpriseCsrf(request, '/api/cms/auth')) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const ip = getClientIp();
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    recordSecurityEvent(
      'RATE_LIMIT_BLOCKED',
      'critical',
      ip,
      '/api/cms/auth',
      `CMS login lockout active (${rate.retryAfterSec}s remaining)`
    );
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
      recordSecurityEvent(
        'AUTH_FAILED',
        'warning',
        ip,
        '/api/cms/auth',
        'Failed administrator password attempt'
      );
      return NextResponse.json(
        { error: 'Password admin tidak valid.' },
        { status: 401 }
      );
    }

    clearFailedAttempts(ip);
    const token = createSessionToken();

    recordSecurityEvent(
      'AUTH_SUCCESS',
      'info',
      ip,
      '/api/cms/auth',
      'Administrator session authenticated via HMAC-SHA256'
    );

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
