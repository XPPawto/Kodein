import fs from 'fs';
import path from 'path';

const headerPath = path.join(process.cwd(), 'src/components/layout/Header.tsx');

const cleanHeaderCode = `'use client';

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
                  <Link
                    key={ent.href}
                    href={ent.href}
                    className={cn(
                      'px-3 first:pl-0 transition hover:text-white',
                      isActive && 'font-semibold text-brand-coral'
                    )}
                  >
                    {ent.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-5">
              <Link href="/media-center" className="hover:text-white transition">
                {t('media')}
              </Link>
              <Link href="/help-center" className="hover:text-white transition">
                {t('help')}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="mx-auto flex h-20 max-w-container items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-20">
          <Link href="/" aria-label="Kodein Home">
            <BrandLogo variant="dark" />
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
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  activeMega === 'about' && 'rotate-180 text-brand-red'
                )}
              />
            </button>

            <Link
              href="/our-ecosystem"
              onMouseEnter={() => setActiveMega(null)}
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
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  activeMega === 'governance' && 'rotate-180 text-brand-red'
                )}
              />
            </button>

            <Link
              href="/media-center"
              onMouseEnter={() => setActiveMega(null)}
              className={cn(
                'text-sm font-medium transition py-2',
                pathname.startsWith('/media-center')
                  ? 'text-brand-red'
                  : 'text-white/90 hover:text-white'
              )}
            >
              {t('media')}
            </Link>

            <Link
              href="/investor-relations"
              onMouseEnter={() => setActiveMega(null)}
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
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              aria-expanded={mobileOpen}
              className="rounded-lg border border-white/15 p-2 text-white hover:bg-white/10"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                  <Link
                    href={activeMega === 'about' ? '/about' : '/corporate-governance'}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:underline"
                  >
                    <span>{t('learnMore')}</span>
                    <ArrowUpRight className="h-4 w-4" />
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
                      <MegaMenuLink href="/about" title={t('about')} desc={t('aboutDesc')} />
                      <MegaMenuLink
                        href="/our-ecosystem"
                        title={t('ecosystem')}
                        desc="Web & Mobile Apps, Custom Software, Cloud"
                      />
                    </>
                  ) : (
                    <>
                      <MegaMenuLink
                        href="/corporate-governance"
                        title={t('governance')}
                        desc={t('governanceDesc')}
                      />
                      <MegaMenuLink href="/wbs" title={t('wbs')} desc={t('wbsDesc')} />
                      <MegaMenuLink href="/vdp" title={t('vdp')} desc={t('vdpDesc')} />
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
                <Link href="/about" className="block text-xl font-bold text-white hover:text-brand-red">
                  {t('about')}
                </Link>
                <Link href="/our-ecosystem" className="block text-xl font-bold text-white hover:text-brand-red">
                  {t('ecosystem')}
                </Link>
                <Link href="/corporate-governance" className="block text-xl font-bold text-white hover:text-brand-red">
                  {t('governance')}
                </Link>
                <Link href="/wbs" className="block pl-4 text-base font-medium text-zinc-400 hover:text-white">
                  — {t('wbs')}
                </Link>
                <Link href="/vdp" className="block pl-4 text-base font-medium text-zinc-400 hover:text-white">
                  — {t('vdp')}
                </Link>
                <Link href="/media-center" className="block text-xl font-bold text-white hover:text-brand-red">
                  {t('media')}
                </Link>
                <Link href="/investor-relations" className="block text-xl font-bold text-white hover:text-brand-red">
                  {t('investor')}
                </Link>
                <Link href="/help-center" className="block text-xl font-bold text-white hover:text-brand-red">
                  {t('help')}
                </Link>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {t('ecosystem')}
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2.5">
                  {entityLinks.map((ent) => (
                    <Link
                      key={ent.href}
                      href={ent.href}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white"
                    >
                      <span>{ent.label}</span>
                      <ArrowUpRight className="h-4 w-4 text-brand-red" />
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
    <Link
      href={href}
      className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-brand-red/60 hover:bg-white/[0.06]"
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-white group-hover:text-brand-red transition">{title}</span>
        <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-brand-red transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-zinc-400">{desc}</p>
    </Link>
  );
}
`;

fs.writeFileSync(headerPath, cleanHeaderCode, 'utf8');
console.log('✅ Successfully fixed Header.tsx syntax error!');