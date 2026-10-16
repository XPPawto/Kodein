import fs from 'fs';
import path from 'path';

const files = {
  // 1. Tambahkan variabel environment keamanan di .env.example
  '.env.example': `NEXT_PUBLIC_SITE_URL=[https://www.kodein.id](https://www.kodein.id)
CMS_ADMIN_PASSWORD=Kodein#OganIlir2026!
CMS_SESSION_SECRET=ganti_dengan_64_karakter_acak_rahasia_produksi_kodein_2026
SMTP_HOST=smtp.kodein.id
SMTP_PORT=587
SMTP_USER=halo@kodein.id
SMTP_PASS=replace_with_secret
`,

  // 2. Blokir bot & mesin pencari agar tidak mengindeks halaman /cms dan /api
  'public/robots.txt': `User-agent: *
Allow: /
Disallow: /api/
Disallow: /id/cms
Disallow: /en/cms
Disallow: /zh/cms

Sitemap: [https://www.kodein.id/sitemap.xml](https://www.kodein.id/sitemap.xml)
`,

  // 3. Hapus /cms dari sitemap publik
  'src/app/sitemap.ts': `import { MetadataRoute } from 'next';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { ARTICLES } from '@/content/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = DESIGN_TOKENS.brand.domain;
  const routes = [
    '',
    '/about',
    '/our-ecosystem',
    '/dam',
    '/dim',
    '/ddmf',
    '/corporate-governance',
    '/wbs',
    '/vdp',
    '/media-center',
    '/investor-relations',
    '/help-center',
  ];

  const staticEntries = routes.flatMap((route) =>
    (['id', 'en', 'zh'] as const).map((locale) => ({
      url: \`\${base}/\${locale}\${route}\`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
    }))
  );

  const articleEntries = ARTICLES.flatMap((article) =>
    (['id', 'en', 'zh'] as const).map((locale) => {
      const folder = article.category === 'press-release' ? 'press-releases' : 'announcement';
      return {
        url: \`\${base}/\${locale}/media-center/\${folder}/\${article.slug}\`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    })
  );

  return [...staticEntries, ...articleEntries];
}
`,

  // 4. Modul Keamanan Server-Side (HMAC Token, Timing-Safe Password Check, Rate Limiter, CSRF Check)
  'src/lib/cmsAuth.ts': `import crypto from 'crypto';
import { cookies, headers } from 'next/headers';

export const CMS_COOKIE_NAME = 'kodein_cms_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 Jam

// Penyimpanan Rate Limit di memori server (Maks 5 percobaan gagal per 15 menit)
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 1000 * 60 * 15;

function getSecret(): string {
  return process.env.CMS_SESSION_SECRET || 'kodein-default-hmac-secret-key-2026-indralaya';
}

function getAdminPassword(): string {
  return process.env.CMS_ADMIN_PASSWORD || 'Kodein#OganIlir2026!';
}

export function getClientIp(): string {
  const hdrs = headers();
  const forwarded = hdrs.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return hdrs.get('x-real-ip') || '127.0.0.1';
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record && record.lockUntil > now) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((record.lockUntil - now) / 1000),
    };
  }

  if (record && record.lockUntil <= now && record.count >= MAX_ATTEMPTS) {
    loginAttempts.delete(ip);
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lockUntil: 0 };
  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockUntil = now + LOCK_TIME_MS;
  }
  loginAttempts.set(ip, record);
}

export function clearFailedAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

export function verifyPasswordTimingSafe(input: string): boolean {
  const expected = getAdminPassword();
  const inputHash = crypto.createHash('sha256').update(input).digest();
  const expectedHash = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(inputHash, expectedHash);
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = \`\${expiresAt}.\${nonce}\`;
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex');
  return \`\${payload}.\${signature}\`;
}

export function verifySessionToken(token?: string): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [expiresAtStr, nonce, signature] = parts;
  const expiresAt = Number(expiresAtStr);
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  const payload = \`\${expiresAtStr}.\${nonce}\`;
  const expectedSig = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex');

  const sigBuf = Buffer.from(signature, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (sigBuf.length !== expectedBuf.length) return false;

  return crypto.timingSafeEqual(sigBuf, expectedBuf);
}

export function isRequestAuthorized(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get(CMS_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function verifyCsrfOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return true;
  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}
`,

  // 5. Endpoint API Login, Verifikasi Sesi, dan Logout (/api/cms/auth)
  'src/app/api/cms/auth/route.ts': `import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  CMS_COOKIE_NAME,
  checkRateLimit,
  clearFailedAttempts,
  createSessionToken,
  getClientIp,
  isRequestAuthorized,
  recordFailedAttempt,
  verifyCsrfOrigin,
  verifyPasswordTimingSafe,
} from '@/lib/cmsAuth';

export async function GET() {
  const authorized = isRequestAuthorized();
  return NextResponse.json(
    { authenticated: authorized },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(request: Request) {
  if (!verifyCsrfOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const ip = getClientIp();
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: \`Terlalu banyak percobaan gagal. Coba lagi dalam \${rate.retryAfterSec} detik.\`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!verifyPasswordTimingSafe(password)) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: 'Password admin tidak valid.' },
        { status: 401 }
      );
    }

    clearFailedAttempts(ip);
    const token = createSessionToken();

    cookies().set({
      name: CMS_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export async function DELETE() {
  cookies().delete(CMS_COOKIE_NAME);
  return NextResponse.json({ authenticated: false });
}
`,

  // 6. Proteksi Penuh Endpoint /api/cms (Wajib Cookie Sesi Valid + Sanitasi Input + Anti-CSRF)
  'src/app/api/cms/route.ts': `import { NextResponse } from 'next/server';
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
`,

  // 7. Sembunyikan seluruh link CMS dari Header + tambahkan shortcut rahasia Ctrl + Shift + K
  'src/components/layout/Header.tsx': `'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, usePathname, useRouter } from '@/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn } from '@/lib/utils';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeMega, setActiveMega] = useState<'about' | 'governance' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Pintasan keyboard rahasia khusus Admin: Tekan Ctrl + Shift + K untuk membuka /cms
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        router.push('/cms');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 80);
      if (currentY > 180 && currentY > lastScrollY && !mobileOpen) {
        setHidden(true);
        setActiveMega(null);
      } else {
        setHidden(false);
      }
      lastScrollY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMega(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const entityLinks = [
    { label: t('mainSite'), href: '/' },
    { label: t('dam'), href: '/dam' },
    { label: t('dim'), href: '/dim' },
    { label: t('ddmf'), href: '/ddmf' },
  ];

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-brand-red focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t('skipToContent')}
      </a>

      <header
        onMouseLeave={() => setActiveMega(null)}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-institutional',
          hidden ? '-translate-y-full' : 'translate-y-0',
          scrolled || activeMega
            ? 'bg-brand-dark/95 backdrop-blur-md border-b border-white/10 shadow-lg'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
        )}
      >
        <div className="hidden lg:block border-b border-white/10">
          <div className="mx-auto flex max-w-container items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-20 py-2 text-xs text-zinc-300">
            <div className="flex items-center divide-x divide-white/15">
              {entityLinks.map((ent) => {
                const isActive = pathname === ent.href;
                return (
                  <Link && 'font-semibold 'px-3 )} className="{cn(" first:pl-0 hover:text-white', href="{ent.href}" isActive key="{ent.href}" text-brand-coral' transition>
                    {ent.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-5">
              <Link className="hover:text-white transition" href="/media-center">
                {t('media')}
              </Link>
              <Link className="hover:text-white transition" href="/help-center">
                {t('help')}
              </Link>
              <LanguageSwitcher/>
            </div>
          </div>
        </div>

        <div className="mx-auto flex h-20 max-w-container items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-20">
          <Link aria-label="Kodein Home" href="/">
            <BrandLogo variant="dark"/>
          </Link>

          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-8">
            <button
              type="button"
              onMouseEnter={() => setActiveMega('about')}
              onClick={() => setActiveMega(activeMega === 'about' ? null : 'about')}
              aria-expanded={activeMega === 'about'}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white py-2"
            >
              <span>{t('about')}</span>
              <ChevronDown && 'about' 'h-4 'rotate-180 )} activeMega="==" className="{cn(" duration-200', text-brand-red' transition-transform w-4/>
            </button>

            <Link href="/our-ecosystem" onMouseEnter="{()"> setActiveMega(null)}
              className={cn(
                'text-sm font-medium transition py-2',
                pathname === '/our-ecosystem' ? 'text-brand-red' : 'text-white/90 hover:text-white'
              )}
            >
              {t('ecosystem')}
            </Link>

            <button
              type="button"
              onMouseEnter={() => setActiveMega('governance')}
              onClick={() => setActiveMega(activeMega === 'governance' ? null : 'governance')}
              aria-expanded={activeMega === 'governance'}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white py-2"
            >
              <span>{t('governance')}</span>
              <ChevronDown && 'governance' 'h-4 'rotate-180 )} activeMega="==" className="{cn(" duration-200', text-brand-red' transition-transform w-4/>
            </button>

            <Link href="/media-center" onMouseEnter="{()"> setActiveMega(null)}
              className={cn(
                'text-sm font-medium transition py-2',
                pathname.startsWith('/media-center')
                  ? 'text-brand-red'
                  : 'text-white/90 hover:text-white'
              )}
            >
              {t('media')}
            </Link>

            <Link href="/investor-relations" onMouseEnter="{()"> setActiveMega(null)}
              className={cn(
                'text-sm font-medium transition py-2',
                pathname === '/investor-relations'
                  ? 'text-brand-red'
                  : 'text-white/90 hover:text-white'
              )}
            >
              {t('investor')}
            </Link>
          </nav>

          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSwitcher/>
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              aria-expanded={mobileOpen}
              className="rounded-lg border border-white/15 p-2 text-white hover:bg-white/10"
            >
              {mobileOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {activeMega && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:block border-t border-white/10 bg-brand-charcoal/95 backdrop-blur-xl"
            >
              <div className="mx-auto grid max-w-container grid-cols-12 gap-8 px-6 sm:px-10 lg:px-16 xl:px-20 py-10">
                <div className="col-span-4 flex flex-col justify-between border-r border-white/10 pr-8">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
                      {activeMega === 'about' ? t('about') : t('governance')}
                    </span>
                    <h3 className="mt-2 text-2xl font-bold text-white">
                      {activeMega === 'about' ? t('aboutDesc') : t('governanceDesc')}
                    </h3>
                  </div>
                  <Link '/about' '/corporate-governance'} 'about' : ? className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:underline" href="{activeMega">
                    <span>{t('learnMore')}</span>
                    <ArrowUpRight className="h-4 w-4"/>
                  </Link>
                </div>

                <div
                  className={cn(
                    'col-span-8 grid gap-4',
                    activeMega === 'about' ? 'grid-cols-2' : 'grid-cols-3'
                  )}
                >
                  {activeMega === 'about' ? (
                    <>
                      <MegaMenuLink desc="{t('aboutDesc')}" href="/about" title="{t('about')}"/>
                      <MegaMenuLink desc="Web & Mobile Apps, Custom Software, Cloud" href="/our-ecosystem" title="{t('ecosystem')}"/>
                    </>
                  ) : (
                    <>
                      <MegaMenuLink desc="{t('governanceDesc')}" href="/corporate-governance" title="{t('governance')}"/>
                      <MegaMenuLink desc="{t('wbsDesc')}" href="/wbs" title="{t('wbs')}"/>
                      <MegaMenuLink desc="{t('vdpDesc')}" href="/vdp" title="{t('vdp')}"/>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-brand-dark pt-24 px-6 pb-10 overflow-y-auto lg:hidden flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="space-y-3 border-b border-white/10 pb-6">
                <Link className="block text-xl font-bold text-white hover:text-brand-red" href="/about">
                  {t('about')}
                </Link>
                <Link className="block text-xl font-bold text-white hover:text-brand-red" href="/our-ecosystem">
                  {t('ecosystem')}
                </Link>
                <Link className="block text-xl font-bold text-white hover:text-brand-red" href="/corporate-governance">
                  {t('governance')}
                </Link>
                <Link className="block pl-4 text-base font-medium text-zinc-400 hover:text-white" href="/wbs">
                  — {t('wbs')}
                </Link>
                <Link className="block pl-4 text-base font-medium text-zinc-400 hover:text-white" href="/vdp">
                  — {t('vdp')}
                </Link>
                <Link className="block text-xl font-bold text-white hover:text-brand-red" href="/media-center">
                  {t('media')}
                </Link>
                <Link className="block text-xl font-bold text-white hover:text-brand-red" href="/investor-relations">
                  {t('investor')}
                </Link>
                <Link className="block text-xl font-bold text-white hover:text-brand-red" href="/help-center">
                  {t('help')}
                </Link>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {t('ecosystem')}
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2.5">
                  {entityLinks.map((ent) => (
                    <Link className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white" href="{ent.href}" key="{ent.href}">
                      <span>{ent.label}</span>
                      <ArrowUpRight className="h-4 w-4 text-brand-red"/>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MegaMenuLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-brand-red/60 hover:bg-white/[0.06]" href="{href}">
      <div className="flex items-center justify-between">
        <span className="font-bold text-white group-hover:text-brand-red transition">{title}</span>
        <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-brand-red transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-zinc-400">{desc}</p>
    </Link>
  );
}
`,

  // 8. Sembunyikan link CMS dari Footer
  'src/components/layout/Footer.tsx': `'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Instagram, Linkedin, ArrowUpRight, MapPin } from 'lucide-react';
import { Link } from '@/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { useCmsData } from '@/lib/cmsClient';

export function Footer() {
  const t = useTranslations('footer');
  const navT = useTranslations('nav');
  const { data } = useCmsData();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black border-t border-white/10 text-white">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-5">
            <Link aria-label="Kodein Home" href="/">
              <BrandLogo size="lg" variant="dark"/>
            </Link>
            <div className="flex items-start gap-2.5 max-w-md text-sm leading-relaxed text-zinc-400">
              <MapPin className="h-4 w-4 text-brand-red shrink-0 mt-1"/>
              <span>{data.address}</span>
            </div>
            <p className="text-xs text-zinc-500">
              {data.email} • {data.phone}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={DESIGN_TOKENS.brand.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-brand-red hover:bg-brand-red"
              >
                <Instagram className="h-4 w-4"/>
              </a>
              <a
                href={DESIGN_TOKENS.brand.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-brand-red hover:bg-brand-red"
              >
                <Linkedin className="h-4 w-4"/>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                {t('mainSites')}
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm">
                <li>
                  <Link className="text-zinc-300 hover:text-brand-red transition" href="/dam">
                    {navT('dam')}
                  </Link>
                </li>
                <li>
                  <Link className="text-zinc-300 hover:text-brand-red transition" href="/dim">
                    {navT('dim')}
                  </Link>
                </li>
                <li>
                  <Link className="text-zinc-300 hover:text-brand-red transition" href="/ddmf">
                    {navT('ddmf')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                {t('mediaCenter')}
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm">
                <li>
                  <Link className="text-zinc-300 hover:text-brand-red transition" href="/media-center">
                    {t('pressReleases')}
                  </Link>
                </li>
                <li>
                  <Link className="text-zinc-300 hover:text-brand-red transition" href="/about">
                    {navT('about')}
                  </Link>
                </li>
                <li>
                  <Link className="text-zinc-300 hover:text-brand-red transition" href="/our-ecosystem">
                    {navT('ecosystem')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                {t('otherLinks')}
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm">
                <li>
                  <Link className="text-zinc-300 hover:text-brand-red transition" href="/investor-relations">
                    {t('investorRelations')}
                  </Link>
                </li>
                <li>
                  <Link className="text-zinc-300 hover:text-brand-red transition" href="/wbs">
                    {t('wbs')}
                  </Link>
                </li>
                <li>
                  <Link className="inline-flex items-center gap-1 text-zinc-300 hover:text-brand-red transition" href="/vdp">
                    <span>{t('vdp')}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0"/>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {currentYear} {DESIGN_TOKENS.brand.name}. {t('rights')}
          </p>
          <div className="flex items-center gap-6">
            <Link className="hover:text-zinc-300 transition" href="/corporate-governance">
              {navT('governance')}
            </Link>
            <Link className="hover:text-zinc-300 transition" href="/vdp">
              VDP
            </Link>
            <Link className="hover:text-zinc-300 transition" href="/help-center">
              {navT('help')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
`,

  // 9. Sembunyikan tombol CMS dari MediaCenterClient
  'src/components/media/MediaCenterClient.tsx': `'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Search, ArrowUpRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { BLUR_DATA_URL } from '@/content/assets';
import { cn, formatDate } from '@/lib/utils';
import { useCmsData } from '@/lib/cmsClient';
import { Locale } from '@/i18n';
import { ArticleCategory } from '@/content/types';

export function MediaCenterClient() {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const { data } = useCmsData();

  const [filter, setFilter] = useState<'all' | ArticleCategory>('all');
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = useMemo(() => {
    return data.articles.filter((art) => {
      const matchesCategory = filter === 'all' || art.category === filter;
      const matchesQuery =
        art.title[locale].toLowerCase().includes(query.toLowerCase()) ||
        art.excerpt[locale].toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [data.articles, filter, query, locale]);

  const items = filtered.slice(0, visibleCount);

  return (
    <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20 py-16">
      <div className="sticky top-20 z-30 flex flex-col gap-4 rounded-2xl border border-white/10 bg-brand-charcoal/95 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2" role="tablist">
          {(
            [
              { id: 'all', label: t('all') },
              { id: 'press-release', label: t('pressRelease') },
              { id: 'announcement', label: t('announcement') },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => {
                setFilter(tab.id);
                setVisibleCount(6);
              }}
              className={cn(
                'rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition',
                filter === tab.id
                  ? 'bg-brand-red text-white'
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"/>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="w-full rounded-full border border-white/15 bg-black/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-brand-red focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((art) => {
          const href =
            art.category === 'press-release'
              ? \`/media-center/press-releases/\${art.slug}\`
              : \`/media-center/announcement/\${art.slug}\`;

          return (
            <Link className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-charcoal transition hover:border-brand-red/60" href="{href}" key="{art.id}">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image alt="{art.title[locale]}" blurDataURL="{BLUR_DATA_URL}" className="object-cover transition-transform duration-500 group-hover:scale-105" fill placeholder="blur" sizes="(max-width: 768px) 100vw, 33vw" src="{art.image}"/>
                <span className="absolute left-4 top-4 rounded-full bg-brand-red px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  {art.category === 'press-release' ? t('pressRelease') : t('announcement')}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <time className="text-xs font-medium text-zinc-400">
                    {formatDate(art.date, locale)}
                  </time>
                  <h2 className="mt-2 text-lg font-bold text-white group-hover:text-brand-red transition line-clamp-2">
                    {art.title[locale]}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-400 line-clamp-3">
                    {art.excerpt[locale]}
                  </p>
                </div>

                <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-red">
                  <span>{t('readArticle')}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {visibleCount < filtered.length && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-brand-red hover:bg-brand-red"
          >
            {locale === 'id' ? 'Muat Lebih Banyak' : locale === 'zh' ? '加载更多' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
`,

  // 10. Halaman CMS (/cms) dengan Autentikasi Server-Side, Proteksi Brute-Force, Tanpa Bocoran Password di UI
  'src/app/[locale]/cms/page.tsx': `'use client';

import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  FilePlus2,
  BarChart3,
  Settings,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { useCmsData } from '@/lib/cmsClient';
import { ASSETS } from '@/content/assets';
import { Article, ArticleCategory } from '@/content/types';
import { Locale } from '@/i18n';

export default function CmsPage() {
  const locale = useLocale() as Locale;
  const { data, refresh } = useCmsData();

  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'articles' | 'stats' | 'general'>('articles');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form tambah artikel
  const [category, setCategory] = useState<ArticleCategory>('press-release');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState<string>(ASSETS.hero.slide1);
  const [titleId, setTitleId] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleZh, setTitleZh] = useState('');
  const [excerptId, setExcerptId] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [excerptZh, setExcerptZh] = useState('');
  const [bodyId, setBodyId] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [bodyZh, setBodyZh] = useState('');

  // State profil & lokasi
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [statementId, setStatementId] = useState('');
  const [statementEn, setStatementEn] = useState('');
  const [statementZh, setStatementZh] = useState('');

  useEffect(() => {
    const verifyExistingSession = async () => {
      try {
        const res = await fetch('/api/cms/auth', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated) {
            setAuthenticated(true);
          }
        }
      } finally {
        setCheckingSession(false);
      }
    };
    verifyExistingSession();
  }, []);

  useEffect(() => {
    if (authenticated) {
      setAddress(data.address);
      setEmail(data.email);
      setPhone(data.phone);
      setStatementId(data.aboutStatement.id);
      setStatementEn(data.aboutStatement.en);
      setStatementZh(data.aboutStatement.zh);
    }
  }, [authenticated, data]);

  const showNotice = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/cms/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const json = await res.json();

      if (res.ok && json.authenticated) {
        setAuthenticated(true);
        setPasswordInput('');
      } else {
        setAuthError(json.error || 'Autentikasi gagal.');
      }
    } catch {
      setAuthError('Gagal menghubungi server autentikasi.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/cms/auth', { method: 'DELETE' });
    setAuthenticated(false);
    setPasswordInput('');
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleId.trim()) return;
    setSaving(true);

    const slug =
      titleId
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now().toString(36);

    const newArticle: Article = {
      id: \`art-\${Date.now()}\`,
      slug,
      category,
      date,
      image: image || ASSETS.hero.slide1,
      title: {
        id: titleId,
        en: titleEn || titleId,
        zh: titleZh || titleEn || titleId,
      },
      excerpt: {
        id: excerptId || titleId,
        en: excerptEn || excerptId || titleId,
        zh: excerptZh || excerptEn || excerptId || titleId,
      },
      content: {
        id: bodyId ? bodyId.split('\\n').filter(Boolean) : [excerptId || titleId],
        en: bodyEn
          ? bodyEn.split('\\n').filter(Boolean)
          : [excerptEn || excerptId || titleId],
        zh: bodyZh
          ? bodyZh.split('\\n').filter(Boolean)
          : [excerptZh || excerptId || titleId],
      },
    };

    const res = await fetch('/api/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article: newArticle }),
    });

    setSaving(false);
    if (res.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (res.ok) {
      setTitleId('');
      setTitleEn('');
      setTitleZh('');
      setExcerptId('');
      setExcerptEn('');
      setExcerptZh('');
      setBodyId('');
      setBodyEn('');
      setBodyZh('');
      await refresh();
      showNotice('Artikel baru berhasil diterbitkan!');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    const res = await fetch(\`/api/cms?id=\${encodeURIComponent(id)}\`, {
      method: 'DELETE',
    });
    if (res.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (res.ok) {
      await refresh();
      showNotice('Artikel berhasil dihapus.');
    }
  };

  const handleStatChange = async (statId: string, newValue: number) => {
    const updatedStats = data.stats.map((s) =>
      s.id === statId ? { ...s, value: newValue } : s
    );
    const res = await fetch('/api/cms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stats: updatedStats }),
    });
    if (res.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (res.ok) {
      await refresh();
      showNotice('Angka statistik berhasil diperbarui!');
    }
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/cms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: address || data.address,
        email: email || data.email,
        phone: phone || data.phone,
        aboutStatement: {
          id: statementId || data.aboutStatement.id,
          en: statementEn || data.aboutStatement.en,
          zh: statementZh || data.aboutStatement.zh,
        },
      }),
    });
    setSaving(false);
    if (res.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (res.ok) {
      await refresh();
      showNotice('Profil & teks utama Kodein berhasil disimpan!');
    }
  };

  const handleResetDefault = async () => {
    const res = await fetch('/api/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset' }),
    });
    if (res.ok) {
      await refresh();
      showNotice('Seluruh data dikembalikan ke pengaturan awal.');
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center text-zinc-400 text-sm">
        Memverifikasi sesi keamanan...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-brand-dark pt-36 pb-24 px-6 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-brand-charcoal p-8 text-white shadow-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red">
            <ShieldCheck className="h-4 w-4"/>
            <span>Restricted Internal Portal</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold">Autentikasi Admin Kodein</h1>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            Halaman ini tersembunyi dari publik dan dilindungi enkripsi sesi server-side serta pembatas percobaan login (Brute-Force Protection).
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Password Administrator
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Masukkan password admin..."
                className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 rounded-lg border border-brand-red/40 bg-brand-red/10 px-3.5 py-2.5 text-xs text-brand-coral">
                <AlertTriangle className="h-4 w-4 shrink-0"/>
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded-full bg-brand-red py-3.5 text-sm font-bold text-white hover:bg-brand-redHover transition disabled:opacity-50"
            >
              {loggingIn ? 'Memverifikasi...' : 'Masuk ke CMS Studio'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark pt-32 pb-24 text-white">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <ShieldCheck className="h-4 w-4"/>
              <span>Sesi Terenkripsi Aktif (HttpOnly + Anti-CSRF)</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold">CMS Studio Kodein (ID / EN / ZH)</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Kelola artikel studi kasus, angka statistik, dan informasi kontak Kodein secara langsung.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleResetDefault}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:border-brand-red hover:text-white transition"
            >
              <RotateCcw className="h-3.5 w-3.5"/>
              <span>Reset Default</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-redHover transition"
            >
              <LogOut className="h-3.5 w-3.5"/>
              <span>Kunci & Keluar</span>
            </button>
          </div>
        </div>

        {toast && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-5 py-3.5 text-sm text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400"/>
            <span>{toast}</span>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('articles')}
            className={\`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition \${
              activeTab === 'articles'
                ? 'bg-brand-red text-white'
                : 'bg-brand-charcoal text-zinc-400 hover:text-white'
            }\`}
          >
            <FilePlus2 className="h-4 w-4"/>
            <span>Artikel & Studi Kasus ({data.articles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={\`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition \${
              activeTab === 'stats'
                ? 'bg-brand-red text-white'
                : 'bg-brand-charcoal text-zinc-400 hover:text-white'
            }\`}
          >
            <BarChart3 className="h-4 w-4"/>
            <span>Angka Statistik ({data.stats.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={\`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition \${
              activeTab === 'general'
                ? 'bg-brand-red text-white'
                : 'bg-brand-charcoal text-zinc-400 hover:text-white'
            }\`}
          >
            <Settings className="h-4 w-4"/>
            <span>Teks Utama & Lokasi</span>
          </button>
        </div>

        {activeTab === 'articles' && (
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <form
              onSubmit={handleAddArticle}
              className="lg:col-span-5 space-y-4 rounded-2xl border border-white/10 bg-brand-charcoal p-6"
            >
              <h2 className="text-lg font-bold">Tambah Artikel / Portofolio Baru</h2>
              <p className="text-xs text-zinc-400">
                Jika bahasa Inggris/Mandarin dikosongkan, sistem otomatis memakai teks bahasa Indonesia.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                  >
                    <option value="press-release">Studi Kasus (Press Release)</option>
                    <option value="announcement">Kabar Kodein (Announcement)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400">
                  URL Gambar Sampul (Unsplash)
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-brand-coral">
                  Judul Bahasa Indonesia *
                </label>
                <input
                  required
                  value={titleId}
                  onChange={(e) => setTitleId(e.target.value)}
                  placeholder="Contoh: Peluncuran Website E-Commerce Batik Ogan Ilir"
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400">
                    Judul English (Opsional)
                  </label>
                  <input
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="English Title..."
                    className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400">
                    Judul Mandarin 中文 (Opsional)
                  </label>
                  <input
                    value={titleZh}
                    onChange={(e) => setTitleZh(e.target.value)}
                    placeholder="中文标题..."
                    className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400">
                  Ringkasan Singkat (ID)
                </label>
                <input
                  value={excerptId}
                  onChange={(e) => setExcerptId(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat..."
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400">
                  Isi Artikel Lengkap (ID — Pisahkan paragraf dengan Enter)
                </label>
                <textarea
                  rows={4}
                  value={bodyId}
                  onChange={(e) => setBodyId(e.target.value)}
                  placeholder="Tulis isi artikel atau cerita studi kasus di sini..."
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 p-3 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-brand-red py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-redHover transition"
              >
                {saving ? 'Menyimpan...' : 'Terbitkan Artikel'}
              </button>
            </form>

            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-lg font-bold">
                Daftar Artikel Aktif (5 Teratas Tampil di Hero Beranda)
              </h2>
              {data.articles.map((art, index) => (
                <div
                  key={art.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-brand-charcoal p-5"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                      {index < 5 && (
                        <span className="rounded bg-brand-red px-2 py-0.5 text-white">
                          Hero Slide #{index + 1}
                        </span>
                      )}
                      <span className="text-zinc-400">{art.date}</span>
                    </div>
                    <h3 className="mt-2 font-bold text-white">{art.title[locale]}</h3>
                    <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                      {art.excerpt[locale]}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteArticle(art.id)}
                    aria-label="Hapus artikel"
                    className="shrink-0 rounded-lg border border-white/10 p-2 text-zinc-400 hover:border-brand-red hover:text-brand-red transition"
                  >
                    <Trash2 className="h-4 w-4"/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.stats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-2xl border border-white/10 bg-brand-charcoal p-6 space-y-4"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-brand-red">
                  {stat.label[locale]}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-zinc-400">{stat.prefix || ''}</span>
                  <input
                    type="number"
                    defaultValue={stat.value}
                    onBlur={(e) => handleStatChange(stat.id, Number(e.target.value))}
                    className="w-32 rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xl font-extrabold text-white focus:border-brand-red focus:outline-none"
                  />
                  <span className="text-sm text-zinc-400">{stat.suffix || ''}</span>
                </div>
                <p className="text-xs text-zinc-400">{stat.description[locale]}</p>
                <p className="text-[11px] text-zinc-500">
                  *Ubah angka lalu klik di luar kotak untuk menyimpan otomatis.
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'general' && (
          <form
            onSubmit={handleSaveGeneral}
            className="mt-10 max-w-3xl space-y-6 rounded-2xl border border-white/10 bg-brand-charcoal p-8"
          >
            <h2 className="text-xl font-bold">Pengaturan Lokasi & Teks Utama Kodein</h2>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-300">
                Alamat Studio Kodein
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-300">
                  Email Kontak
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-300">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-coral">
                Pernyataan Utama Tentang Kodein (Bahasa Indonesia)
              </label>
              <textarea
                rows={3}
                value={statementId}
                onChange={(e) => setStatementId(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 p-4 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-300">
                Main Statement (English)
              </label>
              <textarea
                rows={3}
                value={statementEn}
                onChange={(e) => setStatementEn(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 p-4 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-300">
                核心介绍 (中文 Mandarin)
              </label>
              <textarea
                rows={3}
                value={statementZh}
                onChange={(e) => setStatementZh(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 p-4 text-sm text-white"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-8 py-3.5 text-sm font-bold text-white hover:bg-brand-redHover transition"
            >
              <Save className="h-4 w-4"/>
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
`,
};

console.log('🔒 Menyembunyikan CMS dari publik & mengaktifkan proteksi keamanan Server-Side...');

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`  ✓ Secured ${relativePath}`);
}

console.log('\n✅ Selesai! Ringkasan Keamanan CMS:');
console.log('  1. Seluruh tombol/link CMS telah dihapus dari Header, Footer, Media Center, dan Sitemap.');
console.log('  2. Cara membuka CMS (Hanya untuk Admin):');
console.log('     • Tekan pintasan keyboard: Ctrl + Shift + K di halaman mana saja, ATAU');
console.log('     • Ketik langsung di URL: http://localhost:3000/id/cms');
console.log('  3. Password Default Server-Side: Kodein#OganIlir2026!');
console.log('     (Dapat Anda ubah kapan saja lewat variabel CMS_ADMIN_PASSWORD di file .env.local)');