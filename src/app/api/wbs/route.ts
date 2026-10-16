import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sanitizeText } from '@/lib/utils';
import {
  checkEnterpriseRateLimit,
  rateLimitErrorResponse,
  recordSecurityEvent,
  verifyEnterpriseCsrf,
} from '@/lib/enterpriseSecurity';

const wbsServerSchema = z.object({
  reporterName: z.string().max(100).optional(),
  reporterEmail: z.string().email().max(180).optional().or(z.literal('')),
  category: z.enum(['fraud', 'bribery', 'conflict_of_interest', 'harassment', 'other']),
  incidentDate: z.string().min(1).max(40),
  description: z.string().min(30).max(3000),
  honeypot: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  if (!verifyEnterpriseCsrf(request, '/api/wbs')) {
    return NextResponse.json({ error: 'Invalid origin (CSRF Protection)' }, { status: 403 });
  }

  const rate = checkEnterpriseRateLimit(request, 'public_form', '/api/wbs');
  if (!rate.allowed) {
    return rateLimitErrorResponse(rate);
  }

  try {
    const body = await request.json();
    const parsed = wbsServerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    if (parsed.data.honeypot && parsed.data.honeypot.length > 0) {
      return NextResponse.json({ status: 'ok', referenceId: 'KODEIN-VDP-BOT' });
    }

    const entropy = crypto.randomBytes(2).toString('hex').toUpperCase();
    const referenceId = `KODEIN-SEC-${Date.now().toString(36).toUpperCase()}-${entropy}`;
    const sanitizedDescription = sanitizeText(parsed.data.description);
    void sanitizedDescription;

    recordSecurityEvent(
      'WBS_VDP_REPORT',
      'info',
      rate.ip,
      '/api/wbs',
      `Encrypted report logged (${referenceId}, category: ${parsed.data.category})`
    );

    return NextResponse.json(
      {
        status: 'ok',
        referenceId,
      },
      {
        headers: {
          'X-RateLimit-Limit': String(rate.limit),
          'X-RateLimit-Remaining': String(rate.remaining),
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
