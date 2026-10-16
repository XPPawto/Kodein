'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useLocale } from 'next-intl';
import { HOME_CONTENT, TIMELINE_MILESTONES } from '@/content/siteData';
import { BLUR_DATA_URL } from '@/content/assets';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { KodeinMarkSvg } from '@/components/ui/BrandLogo';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n';

export function JourneyTimeline() {
  const locale = useLocale() as Locale;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 65%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-brand-black py-24 md:py-36"
    >
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <Reveal>
          <SectionHeading
            eyebrow={HOME_CONTENT.journeySection.eyebrow[locale]}
            title={HOME_CONTENT.journeySection.headline[locale]}
            align="center"
          />
        </Reveal>

        <div className="relative mt-20">
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-48 -translate-x-1/2 lg:block"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 200 1400"
              fill="none"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <path
                d="M100 0 C180 220, 20 450, 100 700 C180 950, 20 1180, 100 1400"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="3"
                strokeDasharray="8 8"
              />
              <motion.path
                d="M100 0 C180 220, 20 450, 100 700 C180 950, 20 1180, 100 1400"
                stroke="#EE2B10"
                strokeWidth="4"
                style={{ pathLength: smoothProgress }}
              />
            </svg>
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 left-4 w-1 bg-white/10 lg:hidden"
            aria-hidden="true"
          >
            <motion.div
              className="w-full origin-top bg-brand-red h-full"
              style={{ scaleY: smoothProgress }}
            />
          </div>

          <div className="space-y-16 lg:space-y-24">
            {TIMELINE_MILESTONES.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={item.id}
                  className={cn(
                    'relative flex flex-col pl-12 lg:pl-0 lg:items-center lg:justify-between',
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  )}
                >
                  <div
                    className="absolute left-4 top-8 lg:left-1/2 lg:top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border-2 border-brand-red bg-brand-charcoal shadow-lg"
                    aria-hidden="true"
                  >
                    <KodeinMarkSvg variant="gradient" className="h-6 w-6" />
                  </div>

                  <Reveal className="w-full lg:w-[44%]">
                    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-brand-charcoal p-6 sm:p-8 transition hover:border-brand-red/60">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <div className="shrink-0 rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-center sm:w-28">
                          <span className="block text-xs font-bold uppercase tracking-widest text-brand-red">
                            {item.month[locale]} {item.day}
                          </span>
                          <span className="mt-1 block text-2xl font-extrabold text-white">
                            {item.year}
                          </span>
                        </div>

                        <div className="relative h-32 w-full sm:w-40 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={item.image}
                            alt={item.title[locale]}
                            fill
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                            sizes="200px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>

                      <h3 className="mt-6 text-xl font-bold text-white">
                        {item.title[locale]}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        {item.description[locale]}
                      </p>
                    </div>
                  </Reveal>

                  <div className="hidden lg:block lg:w-[44%]" />
                </div>
              );
            })}
          </div>

          <div className="mt-16 flex justify-start pl-4 lg:justify-center lg:pl-0">
            <div className="inline-flex items-center gap-3 rounded-full border border-brand-red bg-brand-red/15 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
              <KodeinMarkSvg variant="gradient" className="h-4 w-4 animate-spin" />
              <span>{HOME_CONTENT.journeySection.launchLabel[locale]}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
