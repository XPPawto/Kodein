'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Link } from '@/navigation';
import { HOME_CONTENT, SCOPE_ENTITIES } from '@/content/siteData';
import { BLUR_DATA_URL } from '@/content/assets';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { KodeinMarkSvg } from '@/components/ui/BrandLogo';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n';

export function ScopeOfWork() {
  const locale = useLocale() as Locale;
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section className="bg-brand-black py-24 md:py-36">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <Reveal>
          <SectionHeading
            eyebrow={`03 / 07 — ${HOME_CONTENT.scopeSection.eyebrow[locale]}`}
            title={HOME_CONTENT.scopeSection.headline[locale]}
            description={
              locale === 'id'
                ? 'Arahkan kursor atau klik salah satu dari 3 fokus layanan di bawah untuk melihat detail paket pengerjaan, teknologi, dan alur kerja.'
                : locale === 'zh'
                ? '悬停或点击下方三大核心服务板块，查看详细交付标准、技术栈与开发流程。'
                : 'Hover or click any of the 3 core service divisions below to inspect deliverables, tech stack, and workflow.'
            }
          />
        </Reveal>

        <div className="mt-14 flex flex-col gap-5 lg:h-[520px] lg:flex-row">
          {SCOPE_ENTITIES.map((entity, idx) => {
            const isExpanded = activeIndex === idx;
            return (
              <Link
                key={entity.id}
                href={entity.href}
                onMouseEnter={() => setActiveIndex(idx)}
                onFocus={() => setActiveIndex(idx)}
                className={cn(
                  'group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-7 transition-all duration-500 ease-institutional',
                  isExpanded ? 'lg:flex-[1.7]' : 'lg:flex-1'
                )}
              >
                <Image
                  src={entity.image}
                  alt={entity.title[locale]}
                  fill
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-institutional group-hover:scale-105"
                />

                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20 transition-opacity duration-300 group-hover:opacity-90"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-bold tracking-widest text-white backdrop-blur-sm">
                      <KodeinMarkSvg variant="gradient" className="h-4 w-4" />
                      <span>{entity.code}</span>
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>

                  <div className="mt-auto pt-12">
                    <h3 className="text-2xl font-bold text-white">{entity.title[locale]}</h3>
                    <p
                      className={cn(
                        'mt-3 text-sm leading-relaxed text-zinc-300 transition-all duration-300',
                        isExpanded ? 'opacity-100' : 'lg:line-clamp-2 lg:opacity-80'
                      )}
                    >
                      {entity.shortDesc[locale]}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
