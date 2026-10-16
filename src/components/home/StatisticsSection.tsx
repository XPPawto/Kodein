'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';
import { useLocale } from 'next-intl';
import { HOME_CONTENT } from '@/content/siteData';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CountUp } from '@/components/ui/CountUp';
import { KodeinSculpture3D } from '@/components/home/KodeinSculpture3D';
import { useCmsData } from '@/lib/cmsClient';
import { cn, formatStatSuffix } from '@/lib/utils';
import { Locale } from '@/i18n';

export function StatisticsSection() {
  const locale = useLocale() as Locale;
  const { data } = useCmsData();

  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollVal, setScrollVal] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.001,
  });

  const totalStats = Math.max(1, data.stats.length);

  useMotionValueEvent(smoothProgress, 'change', (v) => {
    const clamped = Math.max(0, Math.min(1, v));
    setScrollVal(clamped);
    const idx = Math.min(totalStats - 1, Math.floor(clamped * totalStats));
    setActiveIndex(idx);
  });

  const scrollToStep = (idx: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const scrollableDistance = trackRef.current.offsetHeight - window.innerHeight;
    const targetProgress = (idx + 0.5) / totalStats;
    window.scrollTo({
      top: absoluteTop + scrollableDistance * targetProgress,
      behavior: 'smooth',
    });
  };

  const activeStat = data.stats[activeIndex] || data.stats[0];
  const activeAngle = String(activeIndex * 60).padStart(3, '0');

  return (
    <section
      ref={trackRef}
      className="relative h-[320vh] bg-brand-light text-brand-dark"
    >
      {/* Sticky Full-Screen Viewport (Fits both Mobile 100dvh and Desktop 100vh without clipping) */}
      <div className="sticky top-0 flex h-[100dvh] w-full flex-col justify-between lg:justify-center overflow-hidden py-5 sm:py-8 lg:py-10">
        <div className="mx-auto flex h-full w-full max-w-container flex-col justify-between lg:justify-center px-5 sm:px-10 lg:px-16 xl:px-20">
          {/* Top Header Row */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end justify-between shrink-0">
            <div className="hidden sm:block">
              <SectionHeading
                eyebrow={`04 / 07 — ${HOME_CONTENT.statsSection.eyebrow[locale]}`}
                title={HOME_CONTENT.statsSection.headline[locale]}
                lightMode
              />
            </div>

            {/* Compact Header for Mobile so 3D + Cards fit comfortably inside 100dvh */}
            <div className="sm:hidden">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                <span>{`04 / 07 — ${HOME_CONTENT.statsSection.eyebrow[locale]}`}</span>
              </div>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-brand-dark">
                {HOME_CONTENT.statsSection.headline[locale]}
              </h2>
            </div>

            {/* Minimal Swiss-Style Scroll Progress Line & Angle Readout */}
            <div className="flex items-center justify-between sm:justify-end gap-4 pb-1">
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest text-zinc-500">
                <span className="text-brand-red">0{activeIndex + 1}</span>
                <span>/ 0{totalStats}</span>
                <span className="text-zinc-300">•</span>
                <span>{activeAngle}°</span>
              </div>
              <div className="h-[2px] w-28 sm:w-36 overflow-hidden bg-zinc-300">
                <motion.div
                  className="h-full bg-brand-red"
                  style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
                />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="mt-2 lg:mt-8 grid grid-cols-1 items-center gap-4 lg:gap-8 lg:grid-cols-12 flex-1 lg:flex-initial min-h-0">
            {/* Left (Desktop) / Top-Center (Mobile): Real WebGL 3D Kinetic Sculpture + Chronograph Base */}
            <div className="relative flex flex-col justify-between h-[230px] sm:h-[300px] lg:h-[500px] lg:col-span-5">
              {/* 3D WebGL Canvas */}
              <div className="relative flex-1 w-full min-h-0">
                <KodeinSculpture3D progress={scrollVal} activeIndex={activeIndex} />
              </div>

              {/* Minimal Swiss Chronograph Telemetry Footer under the 3D Sculpture */}
              {activeStat && (
                <div className="hidden lg:flex items-center justify-between border-t border-zinc-300/80 pt-3.5 text-xs">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      AXIS {activeAngle}°
                    </span>
                    <span className="text-lg font-extrabold text-brand-red">
                      {activeStat.prefix || ''}
                      {activeStat.value}
                      {formatStatSuffix(activeStat.suffix, locale)}
                    </span>
                    <span className="font-semibold text-brand-dark truncate max-w-[180px]">
                      {activeStat.label[locale]}
                    </span>
                  </div>

                  {/* Interactive 6-Blade Step Selector Dots */}
                  <div className="flex items-center gap-1.5">
                    {data.stats.map((st, idx) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => scrollToStep(idx)}
                        aria-label={`Select metric ${idx + 1}`}
                        className={cn(
                          'h-2 transition-all duration-300 rounded-full',
                          idx === activeIndex
                            ? 'w-6 bg-brand-red'
                            : 'w-2 bg-zinc-300 hover:bg-zinc-400'
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ==================== MOBILE VIEW (< lg): Active Stat Card + 6-Cell Selector Matrix ==================== */}
            <div className="flex flex-col gap-2.5 lg:hidden shrink-0">
              {activeStat && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStat.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-1 w-12 bg-brand-red" />
                      <span className="font-mono text-[10px] font-bold tracking-widest text-zinc-400">
                        0{activeIndex + 1} / 0{totalStats} • {activeAngle}°
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-baseline gap-3">
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-dark">
                        {activeStat.prefix || ''}
                        {activeStat.value}
                        {formatStatSuffix(activeStat.suffix, locale)}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-brand-red">
                        {activeStat.label[locale]}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-600 line-clamp-2">
                      {activeStat.description[locale]}
                    </p>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* 6-Cell Quick Matrix Strip on Mobile */}
              <div className="grid grid-cols-6 border-t border-l border-zinc-200 bg-white">
                {data.stats.map((st, idx) => {
                  const isCurrent = idx === activeIndex;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => scrollToStep(idx)}
                      className={cn(
                        'border-r border-b border-zinc-200 py-2 px-1 text-center transition-colors',
                        isCurrent
                          ? 'bg-brand-red text-white'
                          : 'bg-zinc-50 text-brand-dark hover:bg-white'
                      )}
                    >
                      <div className="font-mono text-[9px] opacity-75">0{idx + 1}</div>
                      <div className="mt-0.5 text-[11px] font-extrabold tracking-tight truncate">
                        {st.prefix || ''}
                        {st.value}
                        {formatStatSuffix(st.suffix, locale)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ==================== DESKTOP VIEW (>= lg): Full 6-Cell Swiss-Grid Table ==================== */}
            <div className="hidden lg:grid lg:col-span-7 grid-cols-2 border-t border-l border-zinc-200">
              {data.stats.map((stat, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={stat.id}
                    onClick={() => scrollToStep(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        scrollToStep(idx);
                      }
                    }}
                    className={cn(
                      'group relative cursor-pointer border-r border-b border-zinc-200 p-6 xl:p-7 transition-all duration-300 text-left',
                      isActive ? 'bg-white shadow-sm' : 'bg-zinc-50/70 hover:bg-white'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          'h-1 bg-brand-red transition-all duration-500',
                          isActive
                            ? 'w-16 opacity-100'
                            : 'w-8 opacity-35 group-hover:w-12 group-hover:opacity-100'
                        )}
                      />
                      <span
                        className={cn(
                          'font-mono text-[10px] font-bold tracking-widest transition-colors',
                          isActive ? 'text-brand-red' : 'text-zinc-400'
                        )}
                      >
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="mt-4 text-3xl xl:text-[42px] font-extrabold tracking-tight text-brand-dark leading-none">
                      <CountUp
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        locale={locale}
                      />
                    </div>
                    <h3
                      className={cn(
                        'mt-3 text-base xl:text-lg font-bold transition-colors duration-300',
                        isActive ? 'text-brand-red' : 'text-brand-dark'
                      )}
                    >
                      {stat.label[locale]}
                    </h3>
                    <p className="mt-1.5 text-xs xl:text-sm leading-relaxed text-zinc-600">
                      {stat.description[locale]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
