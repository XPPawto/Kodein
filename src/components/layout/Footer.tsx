'use client';

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
