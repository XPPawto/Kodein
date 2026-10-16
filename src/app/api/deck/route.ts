import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { HOME_CONTENT, STATISTICS_DATA } from '@/content/siteData';
import { ARTICLES } from '@/content/articles';
import { CmsDatabase } from '@/content/types';
import { generateCapabilitiesDeckPdf } from '@/lib/pdfGenerator';
import { checkEnterpriseRateLimit, rateLimitErrorResponse } from '@/lib/enterpriseSecurity';

const DB_PATH = path.join(process.cwd(), 'data', 'cms.json');

function readCmsData(): CmsDatabase {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) as CmsDatabase;
    }
  } catch {
    // Fallback to seed data
  }
  return {
    address: DESIGN_TOKENS.brand.address,
    email: DESIGN_TOKENS.brand.email,
    phone: DESIGN_TOKENS.brand.phone,
    aboutStatement: HOME_CONTENT.aboutIntro.statement,
    aboutSupporting: HOME_CONTENT.aboutIntro.supporting,
    quoteHighlight: HOME_CONTENT.quoteSection.highlight,
    reportsAvailable: true,
    stats: STATISTICS_DATA,
    articles: ARTICLES,
  };
}

export async function GET(request: Request) {
  const rate = checkEnterpriseRateLimit(request, 'public_read', '/api/deck');
  if (!rate.allowed) {
    return rateLimitErrorResponse(rate);
  }

  const { searchParams } = new URL(request.url);
  const rawLocale = searchParams.get('locale') || 'id';
  const locale = (['id', 'en', 'zh'].includes(rawLocale) ? rawLocale : 'id') as
    | 'id'
    | 'en'
    | 'zh';
  const mode = searchParams.get('mode') === 'preview' ? 'inline' : 'attachment';

  const cmsData = readCmsData();
  const pdfBuffer = generateCapabilitiesDeckPdf(cmsData, locale);

  const filename =
    locale === 'en'
      ? 'Kodein-Capabilities-Deck-2026-EN.pdf'
      : 'Kodein-Capabilities-Deck-2026-ID.pdf';

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${mode}; filename="${filename}"`,
      'Content-Length': String(pdfBuffer.byteLength),
      'Cache-Control': 'no-store',
    },
  });
}
