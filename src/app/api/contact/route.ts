import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sanitizeText } from '@/lib/utils';
import {
  checkEnterpriseRateLimit,
  inspectPayloadForThreats,
  rateLimitErrorResponse,
  recordSecurityEvent,
  verifyEnterpriseCsrf,
} from '@/lib/enterpriseSecurity';

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(3000),
});

export async function POST(request: Request) {
  if (!verifyEnterpriseCsrf(request, '/api/contact')) {
    return NextResponse.json({ error: 'Invalid origin (CSRF Protection)' }, { status: 403 });
  }

  const rate = checkEnterpriseRateLimit(request, 'public_form', '/api/contact');
  if (!rate.allowed) {
    return rateLimitErrorResponse(rate);
  }

  try {
    const body = await request.json();

    const inspection = inspectPayloadForThreats(body, request, '/api/contact');
    if (!inspection.safe) {
      return NextResponse.json(
        { error: 'Payload blocked by Kodein Enterprise WAF', code: inspection.threat },
        { status: 403 }
      );
    }

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input parameters', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const cleanPayload = {
      name: sanitizeText(parsed.data.name),
      email: parsed.data.email,
      subject: sanitizeText(parsed.data.subject),
      message: sanitizeText(parsed.data.message),
      receivedAt: new Date().toISOString(),
    };

    recordSecurityEvent(
      'CONTACT_SUBMISSION',
      'info',
      rate.ip,
      '/api/contact',
      `Project inquiry received: "${cleanPayload.subject.slice(0, 48)}"`
    );

    return NextResponse.json(
      { status: 'ok', timestamp: cleanPayload.receivedAt },
      {
        headers: {
          'X-RateLimit-Limit': String(rate.limit),
          'X-RateLimit-Remaining': String(rate.remaining),
        },
      }
    );
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
