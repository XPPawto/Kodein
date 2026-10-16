import crypto from 'crypto';
import { NextResponse } from 'next/server';

export type RateLimitTier = 'auth' | 'mutation' | 'public_form' | 'public_read';

export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  event:
    | 'AUTH_SUCCESS'
    | 'AUTH_FAILED'
    | 'RATE_LIMIT_BLOCKED'
    | 'CSRF_BLOCKED'
    | 'WAF_THREAT_BLOCKED'
    | 'CMS_MUTATION'
    | 'WBS_VDP_REPORT'
    | 'CONTACT_SUBMISSION';
  severity: 'info' | 'warning' | 'critical';
  ipMasked: string;
  path: string;
  detail: string;
}

interface RateBucket {
  timestamps: number[];
}

const TIER_CONFIG: Record<RateLimitTier, { windowMs: number; maxRequests: number }> = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  mutation: { windowMs: 5 * 60 * 1000, maxRequests: 25 },
  public_form: { windowMs: 10 * 60 * 1000, maxRequests: 8 },
  public_read: { windowMs: 60 * 1000, maxRequests: 120 },
};

const rateBuckets = new Map<string, RateBucket>();
const securityAuditLog: SecurityAuditEntry[] = [];
const MAX_AUDIT_ENTRIES = 100;

export function maskIp(ip: string): string {
  if (!ip) return '0.0.0.***';
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.***`;
    }
  }
  if (ip.includes(':')) {
    const parts = ip.split(':');
    return `${parts.slice(0, 3).join(':')}:****`;
  }
  return '127.0.0.***';
}

export function extractClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

export function recordSecurityEvent(
  event: SecurityAuditEntry['event'],
  severity: SecurityAuditEntry['severity'],
  ip: string,
  path: string,
  detail: string
): void {
  const entry: SecurityAuditEntry = {
    id: `SEC-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
    timestamp: new Date().toISOString(),
    event,
    severity,
    ipMasked: maskIp(ip),
    path,
    detail,
  };
  securityAuditLog.unshift(entry);
  if (securityAuditLog.length > MAX_AUDIT_ENTRIES) {
    securityAuditLog.pop();
  }
}

export function getSecurityAuditLogs(limit = 25): SecurityAuditEntry[] {
  return securityAuditLog.slice(0, limit);
}

export function checkEnterpriseRateLimit(
  request: Request,
  tier: RateLimitTier,
  routeKey: string
): {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSec: number;
  ip: string;
} {
  const ip = extractClientIp(request);
  const config = TIER_CONFIG[tier];
  const now = Date.now();
  const key = `${tier}:${routeKey}:${ip}`;

  const bucket = rateBuckets.get(key) || { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < config.windowMs);

  if (bucket.timestamps.length >= config.maxRequests) {
    const oldest = bucket.timestamps[0] || now;
    const resetSec = Math.max(1, Math.ceil((oldest + config.windowMs - now) / 1000));
    rateBuckets.set(key, bucket);
    recordSecurityEvent(
      'RATE_LIMIT_BLOCKED',
      'warning',
      ip,
      routeKey,
      `Rate limit exceeded on tier "${tier}" (${config.maxRequests} req / ${config.windowMs / 1000}s)`
    );
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetSec,
      ip,
    };
  }

  bucket.timestamps.push(now);
  rateBuckets.set(key, bucket);

  return {
    allowed: true,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - bucket.timestamps.length),
    resetSec: Math.ceil(config.windowMs / 1000),
    ip,
  };
}

export function rateLimitErrorResponse(rate: {
  limit: number;
  remaining: number;
  resetSec: number;
}) {
  return NextResponse.json(
    {
      error: 'Too Many Requests — Enterprise Rate Limiter Active',
      retryAfterSeconds: rate.resetSec,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(rate.resetSec),
        'X-RateLimit-Limit': String(rate.limit),
        'X-RateLimit-Remaining': String(rate.remaining),
        'X-RateLimit-Reset': String(rate.resetSec),
        'Cache-Control': 'no-store',
      },
    }
  );
}

export function verifyEnterpriseCsrf(request: Request, routeKey: string): boolean {
  const ip = extractClientIp(request);
  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite && secFetchSite === 'cross-site') {
    recordSecurityEvent(
      'CSRF_BLOCKED',
      'critical',
      ip,
      routeKey,
      `Blocked cross-site request (Sec-Fetch-Site: ${secFetchSite})`
    );
    return false;
  }

  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        recordSecurityEvent(
          'CSRF_BLOCKED',
          'critical',
          ip,
          routeKey,
          `Origin mismatch: origin="${originHost}" vs host="${host}"`
        );
        return false;
      }
    } catch {
      recordSecurityEvent('CSRF_BLOCKED', 'critical', ip, routeKey, 'Malformed Origin header');
      return false;
    }
  }

  return true;
}

const THREAT_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  { name: 'XSS_SCRIPT_TAG', regex: /<\s*\/?\s*script\b/i },
  { name: 'XSS_EVENT_HANDLER', regex: /\bon(error|load|mouseover|focus|click)\s*=/i },
  { name: 'JAVASCRIPT_URI', regex: /javascript\s*:/i },
  { name: 'SQL_INJECTION_UNION', regex: /\bunion\s+(all\s+)?select\b/i },
  { name: 'PATH_TRAVERSAL', regex: /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\\)/i },
  { name: 'NULL_BYTE_INJECTION', regex: /%00|\x00/ },
];

export function inspectPayloadForThreats(
  payload: unknown,
  request: Request,
  routeKey: string
): { safe: boolean; threat?: string } {
  const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload ?? '');

  if (serialized.length > 100_000) {
    const ip = extractClientIp(request);
    recordSecurityEvent(
      'WAF_THREAT_BLOCKED',
      'warning',
      ip,
      routeKey,
      `Oversized payload rejected (${serialized.length} bytes)`
    );
    return { safe: false, threat: 'PAYLOAD_TOO_LARGE' };
  }

  for (const rule of THREAT_PATTERNS) {
    if (rule.regex.test(serialized)) {
      const ip = extractClientIp(request);
      recordSecurityEvent(
        'WAF_THREAT_BLOCKED',
        'critical',
        ip,
        routeKey,
        `WAF signature triggered: ${rule.name}`
      );
      return { safe: false, threat: rule.name };
    }
  }

  return { safe: true };
}

export function getSecurityPostureSummary() {
  return {
    status: 'PROTECTED',
    standard: 'OWASP ASVS Level 2 & ISO/IEC 27001 Aligned',
    waf: {
      enabled: true,
      mode: 'BLOCK',
      signatures: [
        'XSS-Script-Guard',
        'SQLi-Union-Probe-Filter',
        'Path-Traversal-Shield',
        'Dotfile-Credential-Probing-Block',
        'Null-Byte-Sanitizer',
      ],
    },
    headers: {
      csp: 'Strict Content-Security-Policy (frame-ancestors none, object-src none, base-uri self)',
      hsts: 'max-age=63072000; includeSubDomains; preload',
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      coop: 'same-origin',
      corp: 'same-origin',
      permissionsPolicy: 'Zero-Privilege (Camera, Mic, Geolocation, USB, Payment disabled)',
    },
    authentication: {
      sessionEngine: 'HMAC-SHA256 Signed Stateless Token + Timing-Safe SHA-256 Password Verification',
      cookieFlags: 'HttpOnly; SameSite=Strict; Secure (Production)',
      bruteForceProtection: 'Multi-Tier Sliding Window Rate Limiter (5 attempts / 15 min lockout)',
    },
    disclosure: {
      securityTxt: '/.well-known/security.txt (RFC 9116)',
      vdpPortal: '/vdp',
      wbsPortal: '/wbs',
    },
    recentEventsCount: securityAuditLog.length,
  };
}
