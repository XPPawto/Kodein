import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sanitizeText } from '@/lib/utils';

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(3000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
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

    return NextResponse.json({ status: 'ok', timestamp: cleanPayload.receivedAt });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
