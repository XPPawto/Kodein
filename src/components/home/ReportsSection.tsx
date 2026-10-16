'use client';

import React from 'react';
import Image from 'next/image';
import { Lock } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { HOME_CONTENT } from '@/content/siteData';
import { ASSETS, BLUR_DATA_URL } from '@/content/assets';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Locale } from '@/i18n';

export function ReportsSection() {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const content = HOME_CONTENT.reportsSection;

  return (
    <section className="relative overflow-hidden bg-brand-dark py-24 md:py-32 border-b border-white/10">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-2xl border border-white/15 bg-brand-charcoal shadow-card">
              <Image
                src={ASSETS.reports.cover}
                alt="Kodein Company Profile & Capabilities Deck"
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <BrandLogo variant="dark" size="sm" />
                  <span className="rounded bg-brand-red px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                    2026 EDITION
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    {content.eyebrow[locale]}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    Kodein Software & Web Capabilities Deck
                  </h3>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              <span className="h-2 w-2 rounded-full bg-brand-red" />
              <span>{content.eyebrow[locale]}</span>
            </div>

            <h2 className="text-fluid-h2 font-bold text-white">
              {content.headline[locale]}
            </h2>

            <p className="text-base md:text-lg leading-relaxed text-zinc-400 max-w-2xl">
              {content.subtext[locale]}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              {content.reportsAvailable ? (
                <Button href="/investor-relations" variant="primary">
                  {t('learnMore')}
                </Button>
              ) : (
                <>
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-zinc-300">
                    <Lock className="h-4 w-4 text-brand-red" />
                    <span>PDF {t('comingSoon')}</span>
                  </div>
                  <Button href="/help-center" variant="primary">
                    {locale === 'id' ? 'Minta Estimasi Proyek' : 'Request Project Estimate'}
                  </Button>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
