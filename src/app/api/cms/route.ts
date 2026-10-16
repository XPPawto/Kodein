import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { HOME_CONTENT, STATISTICS_DATA } from '@/content/siteData';
import { ARTICLES } from '@/content/articles';
import { CmsDatabase } from '@/content/types';
import { isRequestAuthorized, verifyCsrfOrigin } from '@/lib/cmsAuth';
import { sanitizeText } from '@/lib/utils';

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

export async function GET() {
  const db = readDb();
  return NextResponse.json(db, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function PUT(request: Request) {
  if (!verifyCsrfOrigin(request) || !isRequestAuthorized()) {
    return NextResponse.json({ error: 'Unauthorized CMS access' }, { status: 401 });
  }

  try {
    const body = await request.json();
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
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update CMS data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!verifyCsrfOrigin(request) || !isRequestAuthorized()) {
    return NextResponse.json({ error: 'Unauthorized CMS access' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const current = readDb();

    if (body.action === 'reset') {
      const seed = getSeedData();
      writeDb(seed);
      return NextResponse.json(seed);
    }

    if (body.article) {
      const art = body.article;
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
      };
      const updatedArticles = [cleanArticle, ...current.articles];
      const updated = { ...current, articles: updatedArticles };
      writeDb(updated);
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to save CMS item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!verifyCsrfOrigin(request) || !isRequestAuthorized()) {
    return NextResponse.json({ error: 'Unauthorized CMS access' }, { status: 401 });
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
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
