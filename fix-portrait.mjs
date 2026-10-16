import fs from 'fs';
import path from 'path';

const compPath = path.join(process.cwd(), 'src/components/home/LeadershipQuote.tsx');

const updatedCode = `'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocale } from 'next-intl';
import { HOME_CONTENT } from '@/content/siteData';
import { ASSETS, BLUR_DATA_URL } from '@/content/assets';
import { Reveal } from '@/components/ui/Reveal';
import { Locale } from '@/i18n';

export function LeadershipQuote() {
  const locale = useLocale() as Locale;
  const quote = HOME_CONTENT.quoteSection;
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const skylineY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [15, -15]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-brand-charcoal pt-24 pb-0 md:pt-32 border-t border-white/10"
    >
      <motion.div
        style={{ y: skylineY }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 opacity-15"
      >
        <svg viewBox="0 0 1440 320" fill="none" className="w-full h-auto">
          <path
            fill="#FFFFFF"
            d="M0 320V220H60V160H110V220H150V110H220V240H260V140H330V80H390V210H430V130H510V230H560V60H630V200H690V120H760V190H820V40H890V180H950V110H1030V220H1080V90H1160V200H1220V140H1300V230H1360V170H1440V320H0Z"
          />
        </svg>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7 pb-20 md:pb-28">
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-medium leading-snug text-white">
              <span>{quote.beforeHighlight[locale]}</span>
              <strong className="font-extrabold text-brand-red">
                {quote.highlight[locale]}
              </strong>
              <span>{quote.afterHighlight[locale]}</span>
            </blockquote>

            <div className="mt-8 border-l-4 border-brand-red pl-4">
              <p className="text-base font-bold text-white">{quote.author[locale]}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-zinc-400">
                {quote.occasion[locale]}
              </p>
            </div>
          </Reveal>

          <motion.div
            style={{ y: portraitY }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative h-[380px] w-[300px] sm:h-[440px] sm:w-[360px] overflow-hidden rounded-t-3xl border-x border-t border-white/15 bg-gradient-to-b from-white/5 to-black shadow-2xl">
              <Image
                src={ASSETS.leadership.portrait}
                alt={quote.author[locale]}
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="(max-width: 1024px) 300px, 360px"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-transparent opacity-40" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync(compPath, updatedCode, 'utf8');
console.log('✅ Berhasil mengubah foto potret dari hitam-putih menjadi warna natural!');