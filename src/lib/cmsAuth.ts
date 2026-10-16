import crypto from 'crypto';
import { cookies, headers } from 'next/headers';

export const CMS_COOKIE_NAME = 'kodein_cms_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 Jam

// Penyimpanan Rate Limit di memori server (Maks 5 percobaan gagal per 15 menit)
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 1000 * 60 * 15;

function getSecret(): string {
  return process.env.CMS_SESSION_SECRET || 'kodein-default-hmac-secret-key-2026-indralaya';
}

function getAdminPassword(): string {
  return process.env.CMS_ADMIN_PASSWORD || 'Kodein#OganIlir2026!';
}

export function getClientIp(): string {
  const hdrs = headers();
  const forwarded = hdrs.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return hdrs.get('x-real-ip') || '127.0.0.1';
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record && record.lockUntil > now) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((record.lockUntil - now) / 1000),
    };
  }

  if (record && record.lockUntil <= now && record.count >= MAX_ATTEMPTS) {
    loginAttempts.delete(ip);
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lockUntil: 0 };
  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockUntil = now + LOCK_TIME_MS;
  }
  loginAttempts.set(ip, record);
}

export function clearFailedAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

export function verifyPasswordTimingSafe(input: string): boolean {
  const expected = getAdminPassword();
  const inputHash = crypto.createHash('sha256').update(input).digest();
  const expectedHash = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(inputHash, expectedHash);
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `${expiresAt}.${nonce}`;
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token?: string): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [expiresAtStr, nonce, signature] = parts;
  const expiresAt = Number(expiresAtStr);
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  const payload = `${expiresAtStr}.${nonce}`;
  const expectedSig = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex');

  const sigBuf = Buffer.from(signature, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (sigBuf.length !== expectedBuf.length) return false;

  return crypto.timingSafeEqual(sigBuf, expectedBuf);
}

export function isRequestAuthorized(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get(CMS_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function verifyCsrfOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return true;
  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}
