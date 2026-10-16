import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { HOME_CONTENT, STATISTICS_DATA } from '@/content/siteData';
import { ARTICLES } from '@/content/articles';
import { CmsDatabase } from '@/content/types';
import { getClientIp, isRequestAuthorized, verifyCsrfOrigin } from '@/lib/cmsAuth';
import { sanitizeText } from '@/lib/utils';
import {
  checkEnterpriseRateLimit,
  inspectPayloadForThreats,
  rateLimitErrorResponse,
  recordSecurityEvent,
  verifyEnterpriseCsrf,
} from '@/lib/enterpriseSecurity';

const DB_PATH = path.join(process.cwd(), 'data', 'cms.json');

function getSeedData(): CmsDatabase {
  return {
    address: DESIGN_TOKENS.brand.address,
    email: DESIGN_TOKENS.brand.email,
    phone: DESIGN_TOKENS.brand.phone,
    aboutStatement: HOME_CONTENT.aboutIntro.statement,
    aboutSupporting: HOME_CONTENT.aboutIntro.supporting,
    quoteHighlight: HOME_CONTENT.quoteSection.highlight,
    reportsAvailable: HOME_CONTENT.reportsSection.reportsAvailable,
    stats: STATISTICS_DATA,
    articles: ARTICLES,
  };
}

function readDb(): CmsDatabase {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const seed = getSeedData();
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf8');
      return seed;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw) as CmsDatabase;
  } catch {
    return getSeedData();
  }
}

function writeDb(data: CmsDatabase) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET(request: Request) {
  const rate = checkEnterpriseRateLimit(request, 'public_read', '/api/cms');
  if (!rate.allowed) {
    return rateLimitErrorResponse(rate);
  }

  const db = readDb();
  return NextResponse.json(db, {
    headers: {
      'Cache-Control': 'no-store',
      'X-RateLimit-Limit': String(rate.limit),
      'X-RateLimit-Remaining': String(rate.remaining),
    },
  });
}

export async function PUT(request: Request) {
  if (
    !verifyCsrfOrigin(request) ||
    !verifyEnterpriseCsrf(request, '/api/cms') ||
    !isRequestAuthorized()
  ) {
    return NextResponse.json({ error: 'Unauthorized CMS access' }, { status: 401 });
  }

  const rate = checkEnterpriseRateLimit(request, 'mutation', '/api/cms');
  if (!rate.allowed) {
    return rateLimitErrorResponse(rate);
  }

  try {
    const body = await request.json();
    const inspection = inspectPayloadForThreats(body, request, '/api/cms');
    if (!inspection.safe) {
      return NextResponse.json(
        { error: 'Payload blocked by Kodein Enterprise WAF', code: inspection.threat },
        { status: 403 }
      );
    }

    const current = readDb();

    const updated: CmsDatabase = {
      ...current,
      address: body.address ? sanitizeText(String(body.address)) : current.address,
      email: body.email ? sanitizeText(String(body.email)) : current.email,
      phone: body.phone ? sanitizeText(String(body.phone)) : current.phone,
      aboutStatement: body.aboutStatement
        ? {
            id: sanitizeText(String(body.aboutStatement.id || '')),
            en: sanitizeText(String(body.aboutStatement.en || '')),
            zh: sanitizeText(String(body.aboutStatement.zh || '')),
          }
        : current.aboutStatement,
      stats: Array.isArray(body.stats) ? body.stats : current.stats,
    };

    writeDb(updated);
    recordSecurityEvent(
      'CMS_MUTATION',
      'info',
      getClientIp(),
      '/api/cms',
      'Updated studio profile / statistics via authenticated CMS session'
    );
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update CMS data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (
    !verifyCsrfOrigin(request) ||
    !verifyEnterpriseCsrf(request, '/api/cms') ||
    !isRequestAuthorized()
  ) {
    return NextResponse.json({ error: 'Unauthorized CMS access' }, { status: 401 });
  }

  const rate = checkEnterpriseRateLimit(request, 'mutation', '/api/cms');
  if (!rate.allowed) {
    return rateLimitErrorResponse(rate);
  }

  try {
    const body = await request.json();
    const inspection = inspectPayloadForThreats(body, request, '/api/cms');
    if (!inspection.safe) {
      return NextResponse.json(
        { error: 'Payload blocked by Kodein Enterprise WAF', code: inspection.threat },
        { status: 403 }
      );
    }

    const current = readDb();

    if (body.action === 'reset') {
      const seed = getSeedData();
      writeDb(seed);
      recordSecurityEvent(
        'CMS_MUTATION',
        'warning',
        getClientIp(),
        '/api/cms',
        'Reset CMS database to factory defaults'
      );
      return NextResponse.json(seed);
    }

    if (body.article) {
      const art = body.article;
      const sanitizeArray = (arr: unknown) =>
        Array.isArray(arr) ? arr.map((item) => sanitizeText(String(item || ''))) : [];
      const cleanArticle = {
        ...art,
        title: {
          id: sanitizeText(String(art.title?.id || '')),
          en: sanitizeText(String(art.title?.en || '')),
          zh: sanitizeText(String(art.title?.zh || '')),
        },
        excerpt: {
          id: sanitizeText(String(art.excerpt?.id || '')),
          en: sanitizeText(String(art.excerpt?.en || '')),
          zh: sanitizeText(String(art.excerpt?.zh || '')),
        },
        content: {
          id: sanitizeArray(art.content?.id),
          en: sanitizeArray(art.content?.en),
          zh: sanitizeArray(art.content?.zh),
        },
      };
      const updatedArticles = [cleanArticle, ...current.articles];
      const updated = { ...current, articles: updatedArticles };
      writeDb(updated);
      recordSecurityEvent(
        'CMS_MUTATION',
        'info',
        getClientIp(),
        '/api/cms',
        `Published new article: "${cleanArticle.title.id.slice(0, 48)}"`
      );
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to save CMS item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (
    !verifyCsrfOrigin(request) ||
    !verifyEnterpriseCsrf(request, '/api/cms') ||
    !isRequestAuthorized()
  ) {
    return NextResponse.json({ error: 'Unauthorized CMS access' }, { status: 401 });
  }

  const rate = checkEnterpriseRateLimit(request, 'mutation', '/api/cms');
  if (!rate.allowed) {
    return rateLimitErrorResponse(rate);
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing article id' }, { status: 400 });
    }
    const current = readDb();
    const updated = {
      ...current,
      articles: current.articles.filter((a) => a.id !== id),
    };
    writeDb(updated);
    recordSecurityEvent(
      'CMS_MUTATION',
      'warning',
      getClientIp(),
      '/api/cms',
      `Deleted article id="${id}"`
    );
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
