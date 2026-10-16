import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

const BLOCKED_PATH_PATTERNS = [
  /\/\.env/i,
  /\/\.git/i,
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/phpmyadmin/i,
  /\/etc\/passwd/i,
  /(\.\.\/|\.\.\\|%2e%2e)/i,
];

const BLOCKED_QUERY_PATTERNS = [
  /<\s*script\b/i,
  /\bunion\s+(all\s+)?select\b/i,
  /javascript\s*:/i,
  /(%00|\x00)/,
];

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Forbidden — Blocked by Kodein Enterprise Edge WAF',
          code: 'WAF_PATH_BLOCKED',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'X-Kodein-WAF': 'BLOCKED-PATH-PROBE',
            'Cache-Control': 'no-store',
          },
        }
      );
    }
  }

  if (search) {
    const decodedSearch = decodeURIComponent(search.replace(/\+/g, ' '));
    for (const pattern of BLOCKED_QUERY_PATTERNS) {
      if (pattern.test(decodedSearch)) {
        return new NextResponse(
          JSON.stringify({
            error: 'Forbidden — Malicious Query Blocked by Kodein Enterprise Edge WAF',
            code: 'WAF_QUERY_BLOCKED',
          }),
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
              'X-Kodein-WAF': 'BLOCKED-QUERY-PROBE',
              'Cache-Control': 'no-store',
            },
          }
        );
      }
    }
  }

  const response = intlMiddleware(request);
  response.headers.set('X-Kodein-WAF', 'ACTIVE-OWASP-ASVS-L2');
  response.headers.set(
    'X-Request-ID',
    `kdn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  );
  return response;
}

export const config = {
  matcher: ['/', '/(id|en|zh)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
