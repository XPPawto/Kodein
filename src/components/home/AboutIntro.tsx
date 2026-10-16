'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { HOME_CONTENT } from '@/content/siteData';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { KodeinMarkSvg } from '@/components/ui/BrandLogo';
import { useCmsData } from '@/lib/cmsClient';
import { Locale } from '@/i18n';

export function AboutIntro() {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const { data } = useCmsData();
  const content = HOME_CONTENT.aboutIntro;

  const statementText = data.aboutStatement[locale] || content.statement[locale];
  const supportingText = data.aboutSupporting[locale] || content.supporting[locale];
  const brandName = DESIGN_TOKENS.brand.name;
  const parts = statementText.split(brandName);

  return (
    <section className="relative overflow-hidden bg-brand-dark py-24 md:py-36 border-b border-white/10">
      <KodeinMarkSvg
        variant="red"
        className="pointer-events-none absolute -right-28 -top-28 h-[420px] w-[420px] opacity-[0.04]"
      />

      <div className="relative z-10 mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <Reveal>
          <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
            <span className="h-2 w-2 rounded-full bg-brand-red" />
            <span>{content.eyebrow[locale]}</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-5xl text-fluid-statement font-medium text-white">
            {parts.length > 1 ? (
              <>
                {parts[0]}
                <strong className="font-extrabold text-brand-red">{brandName}</strong>
                {parts[1]}
              </>
            ) : (
              statementText
            )}
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal delay={0.2} className="lg:col-span-8">
            <p className="text-base md:text-lg leading-relaxed text-zinc-400">
              {supportingText}
            </p>
          </Reveal>
          <Reveal delay={0.3} className="lg:col-span-4 lg:flex lg:justify-end">
            <Button href="/about" variant="outline">
              {t('learnMore')}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
