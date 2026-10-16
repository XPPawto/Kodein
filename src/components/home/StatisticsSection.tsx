'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { HOME_CONTENT } from '@/content/siteData';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CountUp } from '@/components/ui/CountUp';
import { Reveal } from '@/components/ui/Reveal';
import { useCmsData } from '@/lib/cmsClient';
import { Locale } from '@/i18n';

export function StatisticsSection() {
  const locale = useLocale() as Locale;
  const { data } = useCmsData();

  return (
    <section className="bg-brand-light py-24 md:py-36 text-brand-dark">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <Reveal>
          <SectionHeading
            eyebrow={HOME_CONTENT.statsSection.eyebrow[locale]}
            title={HOME_CONTENT.statsSection.headline[locale]}
            lightMode
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-zinc-200">
          {data.stats.map((stat, idx) => (
            <Reveal
              key={stat.id}
              delay={idx * 0.06}
              className="group relative border-r border-b border-zinc-200 bg-white p-8 md:p-10 transition-colors duration-300 hover:bg-zinc-50"
            >
              <div className="h-1 w-10 bg-brand-red transition-all duration-300 group-hover:w-16" />
              <div className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-dark">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  locale={locale}
                />
              </div>
              <h3 className="mt-4 text-lg font-bold text-brand-red">
                {stat.label[locale]}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {stat.description[locale]}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
