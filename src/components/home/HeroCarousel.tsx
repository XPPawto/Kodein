'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { BLUR_DATA_URL } from '@/content/assets';
import { Button } from '@/components/ui/Button';
import { cn, formatDate } from '@/lib/utils';
import { useCmsData } from '@/lib/cmsClient';
import { Locale } from '@/i18n';

export function HeroCarousel() {
  const locale = useLocale() as Locale;
  const t = useTranslations('common');
  const { data } = useCmsData();
  const slides = data.articles.slice(0, 5);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 }, [
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((idx: number) => emblaApi && emblaApi.scrollTo(idx), [emblaApi]);

  return (
    <section
      aria-label="Featured News Carousel"
      className="relative h-screen min-h-[680px] max-h-[1080px] w-full overflow-hidden bg-brand-black"
    >
      <div ref={emblaRef} className="h-full w-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide, idx) => {
            const isSelected = idx === selectedIndex;
            const detailHref =
              slide.category === 'press-release'
                ? `/media-center/press-releases/${slide.slug}`
                : `/media-center/announcement/${slide.slug}`;

            return (
              <div key={slide.id} className="relative h-full min-w-0 flex-[0_0_100%] overflow-hidden">
                <div
                  className={cn(
                    'absolute inset-0 transition-transform duration-[7000ms] ease-out',
                    isSelected ? 'scale-105' : 'scale-100'
                  )}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title[locale]}
                    fill
                    priority={idx === 0}
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-black/40"
                  aria-hidden="true"
                />

                <div className="relative z-10 mx-auto flex h-full max-w-container flex-col justify-end px-6 sm:px-10 lg:px-16 xl:px-20 pb-28 md:pb-32">
                  <motion.div
                    key={`${slide.id}-${isSelected}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-6xl"
                  >
                    <div className="inline-flex items-center gap-3 text-xs sm:text-sm font-semibold uppercase tracking-widest text-zinc-300">
                      <span className="rounded-full bg-brand-red px-3.5 py-1 text-[11px] font-bold text-white">
                        {slide.category === 'press-release'
                          ? t('pressRelease')
                          : t('announcement')}
                      </span>
                      <span className="text-white/40">•</span>
                      <time dateTime={slide.date}>{formatDate(slide.date, locale)}</time>
                    </div>

                    <h1 className="mt-5 text-fluid-hero font-bold text-white">
                      {slide.title[locale]}
                    </h1>

                    <div className="mt-8">
                      <Button href={detailHref} variant="primary">
                        {t('learnMore')}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-20 mx-auto flex max-w-container items-center justify-between gap-8 px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid flex-1 max-w-4xl grid-cols-5 gap-3" role="tablist">
          {slides.map((slide, idx) => {
            const active = idx === selectedIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => scrollTo(idx)}
                className="group py-2 focus:outline-none"
              >
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/25">
                  <div
                    className={cn(
                      'h-full bg-brand-red transition-all duration-500',
                      active ? 'w-full' : 'w-0 group-hover:w-1/3'
                    )}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:border-brand-red hover:bg-brand-red"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition hover:border-brand-red hover:bg-brand-red"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
