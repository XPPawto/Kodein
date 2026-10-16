import { NextResponse } from 'next/server';
import {
  checkEnterpriseRateLimit,
  getSecurityAuditLogs,
  getSecurityPostureSummary,
  rateLimitErrorResponse,
} from '@/lib/enterpriseSecurity';
import { isRequestAuthorized } from '@/lib/cmsAuth';

export async function GET(request: Request) {
  const rate = checkEnterpriseRateLimit(request, 'public_read', '/api/security');
  if (!rate.allowed) {
    return rateLimitErrorResponse(rate);
  }

  const isAdmin = isRequestAuthorized();
  const posture = getSecurityPostureSummary();

  return NextResponse.json(
    {
      ...posture,
      auditLogs: isAdmin ? getSecurityAuditLogs(30) : undefined,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
        'X-RateLimit-Limit': String(rate.limit),
        'X-RateLimit-Remaining': String(rate.remaining),
      },
    }
  );
}
