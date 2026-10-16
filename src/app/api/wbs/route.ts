import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sanitizeText } from '@/lib/utils';

const wbsServerSchema = z.object({
  reporterName: z.string().max(100).optional(),
  reporterEmail: z.string().email().optional().or(z.literal('')),
  category: z.enum(['fraud', 'bribery', 'conflict_of_interest', 'harassment', 'other']),
  incidentDate: z.string().min(1),
  description: z.string().min(30).max(3000),
  honeypot: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = wbsServerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    if (parsed.data.honeypot && parsed.data.honeypot.length > 0) {
      return NextResponse.json({ status: 'ok', referenceId: 'KODEIN-VDP-BOT' });
    }

    const referenceId = `KODEIN-SEC-${Date.now().toString(36).toUpperCase()}`;
    const sanitizedDescription = sanitizeText(parsed.data.description);
    void sanitizedDescription;

    return NextResponse.json({
      status: 'ok',
      referenceId,
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
