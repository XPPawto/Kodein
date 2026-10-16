'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import { useLocale } from 'next-intl';
import { HOME_CONTENT, TIMELINE_MILESTONES } from '@/content/siteData';
import { BLUR_DATA_URL } from '@/content/assets';
import { KodeinMarkSvg } from '@/components/ui/BrandLogo';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n';

interface ChapterMeta {
  code: string;
  dateNumeric: string;
  phase: Record<Locale, string>;
  scope: Record<Locale, string>;
  deliverable: Record<Locale, string>;
}

const CHAPTER_META: Record<string, ChapterMeta> = {
  m1: {
    code: 'ARC-01',
    dateNumeric: '24.02.2025',
    phase: {
      id: 'Fondasi Studio',
      en: 'Studio Foundation',
      zh: '工作室奠基',
    },
    scope: {
      id: 'Indralaya Utara, Ogan Ilir',
      en: 'Indralaya Utara, Ogan Ilir',
      zh: '南苏门答腊 · 北印德拉拉亚',
    },
    deliverable: {
      id: 'Standarisasi arsitektur web modern untuk bisnis & instansi lokal',
      en: 'Modern web architecture standardization for local enterprises',
      zh: '确立本地企业与机构现代 Web 架构交付标准',
    },
  },
  m2: {
    code: 'ARC-02',
    dateNumeric: '15.05.2025',
    phase: {
      id: 'Sistem Informasi',
      en: 'Information Systems',
      zh: '信息管理系统',
    },
    scope: {
      id: 'Sumatera Selatan',
      en: 'South Sumatra',
      zh: '南苏门答腊省',
    },
    deliverable: {
      id: 'Platform inventaris, portal pendidikan, dan dashboard operasional',
      en: 'Inventory platforms, academic portals & operational dashboards',
      zh: '库存管理平台、教育门户与实时运营数据看板',
    },
  },
  m3: {
    code: 'ARC-03',
    dateNumeric: '28.08.2025',
    phase: {
      id: 'Ekosistem Mobile',
      en: 'Mobile & Fintech',
      zh: '移动与支付生态',
    },
    scope: {
      id: 'Android · iOS · QRIS',
      en: 'Android · iOS · QRIS',
      zh: 'Android · iOS · 聚合支付',
    },
    deliverable: {
      id: 'Aplikasi mobile ritel dengan pembayaran QRIS & Virtual Account otomatis',
      en: 'Retail mobile apps with automated QRIS & Virtual Account checkout',
      zh: '支持 QRIS 与虚拟账户自动结算的零售移动应用',
    },
  },
  m4: {
    code: 'ARC-04',
    dateNumeric: '12.12.2025',
    phase: {
      id: 'CMS & Otomasi AI',
      en: 'CMS & AI Automation',
      zh: 'CMS 与 AI 自动化',
    },
    scope: {
      id: 'Cloud & AI Workflow',
      en: 'Cloud & AI Workflow',
      zh: '云架构与智能工作流',
    },
    deliverable: {
      id: 'CMS mandiri untuk tim non-teknis & integrasi asisten pelanggan AI',
      en: 'Self-service CMS for non-technical teams & AI support integration',
      zh: '面向非技术团队的自主 CMS 与全天候 AI 客服集成',
    },
  },
  m5: {
    code: 'ARC-05',
    dateNumeric: '16.10.2026',
    phase: {
      id: 'Skala Lintas Provinsi',
      en: 'Cross-Province Scale',
      zh: '跨省与国际化交付',
    },
    scope: {
      id: 'Ogan Ilir · Palembang · Jakarta · Global',
      en: 'Ogan Ilir · Palembang · Jakarta · Global',
      zh: '奥干伊利尔 · 巨港 · 雅加达 · 海外',
    },
    deliverable: {
      id: 'Rekayasa perangkat lunak berstandar global dari Ogan Ilir',
      en: 'Global-standard software engineering delivered from Ogan Ilir',
      zh: '立足奥干伊利尔，为印尼全国及海外输出高标准软件工程',
    },
  },
};

export function JourneyTimeline() {
  const locale = useLocale() as Locale;
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glareRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const count = TIMELINE_MILESTONES.length;
  const [activeIdx, setActiveIdx] = useState(0);

  // Store continuous scroll & pointer values in refs to avoid React re-renders (zero frame drops)
  const floatIdxRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rafIdRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
    restDelta: 0.0005,
  });

  // Direct GPU DOM updater — zero React re-renders, no CSS transition conflicts
  const applyCardTransforms = useCallback(() => {
    const currentFloat = floatIdxRef.current;
    const px = pointerRef.current.x;
    const py = pointerRef.current.y;

    for (let i = 0; i < count; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      const rel = i - currentFloat; // 0 = active, < 0 = past, > 0 = upcoming in stack

      let tx = 0;
      let ty = 0;
      let tz = 0;
      let rx = 0;
      let ry = 0;
      let rz = 0;
      let opacity = 1;

      if (rel < 0) {
        // Past card: swings left/up and forward in 3D space as you scroll past it
        const p = Math.min(1.6, -rel);
        tx = -p * 220;
        ty = -p * 70;
        tz = p * 140;
        rx = p * 12;
        ry = -10 - p * 26;
        rz = -p * 5;
        opacity = Math.max(0, 1 - p * 1.25);
      } else {
        // Active card (rel = 0) & Upcoming 3D stack (rel > 0)
        const d = Math.min(4, rel);
        // Subtle interpolation between active focal angle and recessed 3D rack
        const activeWeight = Math.max(0, 1 - d);
        tx = d * 42;
        ty = -d * 22;
        tz = -d * 115;
        rx = 3 * (1 - activeWeight) + d * 2.5 + py * -7 * activeWeight;
        ry = -9 + -d * 3.5 + px * 9 * activeWeight;
        rz = d * 1.2;
        opacity = Math.max(0.15, 1 - d * 0.23);
      }

      el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = String(50 - Math.round(Math.abs(rel) * 10));
      el.style.pointerEvents = Math.abs(rel) < 0.45 ? 'auto' : 'none';

      const glareEl = glareRefs.current[i];
      if (glareEl) {
        const gx = 50 + px * 35;
        const gy = 40 + py * 35;
        glareEl.style.opacity = Math.abs(rel) < 0.5 ? '1' : '0';
        glareEl.style.background = `linear-gradient(${(125 + px * 25).toFixed(0)}deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) ${gy.toFixed(0)}%, transparent ${Math.min(95, gx + 30).toFixed(0)}%)`;
      }
    }
  }, [count]);

  useEffect(() => {
    applyCardTransforms();
    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [applyCardTransforms]);

  useMotionValueEvent(smoothProgress, 'change', (v) => {
    const clamped = Math.max(0, Math.min(1, v));
    if (progressFillRef.current) {
      progressFillRef.current.style.transform = `scaleX(${clamped.toFixed(4)})`;
    }

    const normalized = Math.max(0, Math.min(1, (clamped - 0.05) / 0.88));
    const continuous = normalized * (count - 1);
    floatIdxRef.current = continuous;

    const nextIdx = Math.min(count - 1, Math.max(0, Math.round(continuous)));
    setActiveIdx((prev) => (prev !== nextIdx ? nextIdx : prev));

    applyCardTransforms();
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    pointerRef.current.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerRef.current.targetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    if (rafIdRef.current === null) {
      const tick = () => {
        const p = pointerRef.current;
        p.x += (p.targetX - p.x) * 0.18;
        p.y += (p.targetY - p.y) * 0.18;
        applyCardTransforms();
        if (Math.abs(p.targetX - p.x) > 0.005 || Math.abs(p.targetY - p.y) > 0.005) {
          rafIdRef.current = requestAnimationFrame(tick);
        } else {
          rafIdRef.current = null;
        }
      };
      rafIdRef.current = requestAnimationFrame(tick);
    }
  };

  const handlePointerLeave = () => {
    pointerRef.current.targetX = 0;
    pointerRef.current.targetY = 0;
    if (rafIdRef.current === null) {
      const tick = () => {
        const p = pointerRef.current;
        p.x += (0 - p.x) * 0.16;
        p.y += (0 - p.y) * 0.16;
        applyCardTransforms();
        if (Math.abs(p.x) > 0.005 || Math.abs(p.y) > 0.005) {
          rafIdRef.current = requestAnimationFrame(tick);
        } else {
          p.x = 0;
          p.y = 0;
          applyCardTransforms();
          rafIdRef.current = null;
        }
      };
      rafIdRef.current = requestAnimationFrame(tick);
    }
  };

  const scrollToMilestone = (idx: number) => {
    if (!containerRef.current) return;
    const clampedIdx = Math.max(0, Math.min(count - 1, idx));
    const rect = containerRef.current.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
    const targetProgress = 0.05 + (clampedIdx / Math.max(1, count - 1)) * 0.88;
    window.scrollTo({
      top: sectionTop + targetProgress * scrollableDistance,
      behavior: 'smooth',
    });
  };

  const activeItem = TIMELINE_MILESTONES[activeIdx] ?? TIMELINE_MILESTONES[0];
  const activeMeta = CHAPTER_META[activeItem.id] ?? CHAPTER_META.m1;

  return (
    <section
      ref={containerRef}
      aria-label={HOME_CONTENT.journeySection.eyebrow[locale]}
      className="relative h-[340vh] bg-[#060608] text-white selection:bg-brand-red selection:text-white"
    >
      <div className="sticky top-0 flex h-[100dvh] w-full flex-col justify-between overflow-hidden border-y border-white/10">
        {/* Architectural Hairline Grid & Monumental Year Watermark */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="mx-auto grid h-full max-w-container grid-cols-4 border-x border-white/[0.05] lg:grid-cols-12">
            <div className="border-r border-white/[0.04] lg:col-span-5" />
            <div className="border-r border-white/[0.04] lg:col-span-4" />
            <div className="lg:col-span-3" />
          </div>
          {/* Giant Background Year Typography */}
          <div className=" select-none absolute -bottom-10 left-4 font-display text-[26vw] font-black leading-none tracking-tighter text-white/[0.025] lg:left-10 lg:text-[21vw]">
            {activeItem.year}
          </div>
        </div>

        {/* TOP SWISS HEADER BAR */}
        <div className="relative z-20 border-b border-white/10 bg-[#060608]">
          <div className="mx-auto flex max-w-container items-center justify-between px-6 py-4 sm:px-10 lg:px-16 xl:px-20">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-brand-red">
                06 / 07
              </span>
              <span className="h-3 w-px bg-white/20" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                {HOME_CONTENT.journeySection.eyebrow[locale]}
              </span>
            </div>

            <div className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 md:block">
              {HOME_CONTENT.journeySection.headline[locale]}
            </div>

            <div className="font-mono text-xs tabular-nums tracking-[0.2em] text-zinc-400">
              <span className="font-bold text-white">0{activeIdx + 1}</span>
              <span className="mx-1.5 text-zinc-600">/</span>
              <span>0{count}</span>
            </div>
          </div>
        </div>

        {/* MAIN STAGE: Editorial Narrative (Left) + Pure 3D Monolith Plate Stack (Right) */}
        <div className="relative z-10 mx-auto grid w-full max-w-container flex-1 grid-cols-1 items-center gap-6 px-6 py-4 sm:px-10 lg:grid-cols-12 lg:gap-12 lg:px-16 xl:px-20">
          {/* LEFT COLUMN: Clean Swiss Editorial Story */}
          <div className="flex flex-col justify-center lg:col-span-5">
            {/* Chapter & Date Line */}
            <div className="flex items-center gap-3 font-mono text-xs tracking-[0.2em]">
              <span className="font-bold text-brand-red">{activeMeta.dateNumeric}</span>
              <span className="h-px w-6 bg-white/20" />
              <span className="uppercase text-zinc-400">{activeMeta.phase[locale]}</span>
            </div>

            {/* Large Editorial Milestone Headline */}
            <h2 className="mt-3 font-display text-2xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl lg:mt-5 lg:text-[2.65rem]">
              {activeItem.title[locale]}
            </h2>

            {/* Story Body Copy */}
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-zinc-400 sm:text-base sm:leading-relaxed lg:mt-5">
              {activeItem.description[locale]}
            </p>

            {/* Architectural Specification Table (No pills, no icon clutter) */}
            <div className="mt-5 grid grid-cols-2 border-t border-white/10 pt-4 lg:mt-8 lg:pt-6">
              <div className="border-r border-white/10 pr-4">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  {locale === 'id' ? 'WILAYAH / CAKUPAN' : locale === 'zh' ? '业务范围' : 'OPERATIONAL SCOPE'}
                </span>
                <span className="mt-1 block text-xs font-semibold text-zinc-200 sm:text-sm">
                  {activeMeta.scope[locale]}
                </span>
              </div>
              <div className="pl-4">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  {locale === 'id' ? 'TONGGAK PENCAPAIAN' : locale === 'zh' ? '核心交付' : 'KEY DELIVERABLE'}
                </span>
                <span className="mt-1 block line-clamp-2 text-xs font-medium text-zinc-300 sm:text-sm">
                  {activeMeta.deliverable[locale]}
                </span>
              </div>
            </div>

            {/* Minimal Prev / Next Stepper */}
            <div className="mt-5 hidden items-center gap-6 lg:mt-8 lg:flex">
              <div className="flex items-center border border-white/15">
                <button
                  type="button"
                  onClick={() => scrollToMilestone(activeIdx - 1)}
                  disabled={activeIdx === 0}
                  className="px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-25"
                >
                  Prev
                </button>
                <div className="h-4 w-px bg-white/15" />
                <button
                  type="button"
                  onClick={() => scrollToMilestone(activeIdx + 1)}
                  disabled={activeIdx === count - 1}
                  className="px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-25"
                >
                  Next
                </button>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                {HOME_CONTENT.journeySection.launchLabel[locale]}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Pure 3D Architectural Folio Cards (GPU-driven, 0 React re-renders on scroll) */}
          <div
            ref={stageRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="relative flex h-[230px] w-full items-center justify-center sm:h-[340px] lg:col-span-7 lg:h-[460px]"
            style={{
              perspective: '1400px',
              perspectiveOrigin: '45% 50%',
            }}
          >
            <div
              className="relative h-full w-full max-w-[540px] lg: mr-8"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {TIMELINE_MILESTONES.map((item, idx) => {
                const meta = CHAPTER_META[item.id] ?? CHAPTER_META.m1;
                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    className=" absolute inset-0 m-auto flex h-[215px] w-full flex-col justify-between border border-white/20 bg-[#111115] p-3 shadow-[0_28px_60px_rgba(0,0,0,0.85)] will-change-[transform,opacity] sm:h-[320px] sm:p-5 lg:h-[410px]"
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {/* 3D Physical Plate Edge Thickness (Right & Bottom Extrusion Rim) */}
                    <div
                      className="pointer-events-none absolute -right-1.5 top-1.5 h-full w-1.5 bg-zinc-800"
                      style={{ transform: 'rotateY(90deg) translateZ(0px)' }}
                      aria-hidden="true"
                    />
                    <div
                      className="pointer-events-none absolute -bottom-1.5 left-1.5 h-1.5 w-full bg-zinc-900"
                      style={{ transform: 'rotateX(-90deg) translateZ(0px)' }}
                      aria-hidden="true"
                    />

                    {/* Specular Anodized Sheen Overlay */}
                    <div
                      ref={(el) => {
                        glareRefs.current[idx] = el;
                      }}
                      className="pointer-events-none absolute inset-0 z-20 opacity-0"
                      aria-hidden="true"
                    />

                    {/* Top Archival Plate Bar */}
                    <div
                      className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400"
                      style={{ transform: 'translateZ(18px)' }}
                    >
                      <div className="flex items-center gap-2">
                        <KodeinMarkSvg variant="gradient" className="h-3.5 w-3.5" />
                        <span className="font-bold text-white">{meta.code}</span>
                        <span className="text-zinc-600">{'//'}</span>
                        <span>{item.year}</span>
                      </div>
                      <span className="font-bold text-brand-red">
                        {item.day} {item.month[locale]} {item.year}
                      </span>
                    </div>

                    {/* Central Recessed 3D Image Window */}
                    <div
                      className="relative my-2.5 flex-1 overflow-hidden border border-white/10 bg-black"
                      style={{ transform: 'translateZ(28px)' }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title[locale]}
                        fill
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                        sizes="(max-width: 768px) 90vw, 540px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                      {/* Minimalist Corner Index Stamp */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between">
                        <div>
                          <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-brand-red">
                            {meta.phase[locale]}
                          </span>
                          <span className="mt-0.5 block font-mono text-xs font-bold tracking-wide text-white">
                            {meta.scope[locale]}
                          </span>
                        </div>
                        <span className="font-display text-2xl font-black leading-none tracking-tighter text-white/90 sm:text-3xl">
                          0{idx + 1}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Archival Plate Caption */}
                    <div
                      className="relative z-10 flex items-center justify-between pt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500"
                      style={{ transform: 'translateZ(18px)' }}
                    >
                      <span className="truncate pr-4 text-zinc-300">{item.title[locale]}</span>
                      <span className="shrink-0 text-zinc-500">KODEIN® FOLIO</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM CHRONOLOGICAL RULER (Clean Braun / Leica style timeline track) */}
        <div className="relative z-20 border-t border-white/10 bg-[#060608]">
          {/* GPU-Accelerated Progress Line */}
          <div className="relative h-[2px] w-full bg-white/[0.07]">
            <div
              ref={progressFillRef}
              className="h-full w-full origin-left bg-brand-red will-change-transform"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>

          <div className="mx-auto grid max-w-container grid-cols-5 divide-x divide-white/10 px-6 sm:px-10 lg:px-16 xl:px-20">
            {TIMELINE_MILESTONES.map((item, idx) => {
              const isCurrent = idx === activeIdx;
              const isPassed = idx < activeIdx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToMilestone(idx)}
                  className={cn(
                    'group relative flex flex-col items-start py-3 pl-3 pr-2 text-left transition-colors sm:py-4 sm:pl-4',
                    isCurrent ? 'bg-white/[0.03]' : 'hover:bg-white/[0.015]'
                  )}
                >
                  {/* Active top tick marker */}
                  <span
                    className={cn(
                      'absolute left-0 top-0 h-full w-[2px] transition-colors',
                      isCurrent ? 'bg-brand-red' : 'bg-transparent'
                    )}
                  />
                  <div className="flex w-full items-center justify-between font-mono text-[10px] tracking-[0.18em]">
                    <span
                      className={cn(
                        'font-bold',
                        isCurrent ? 'text-brand-red' : isPassed ? 'text-zinc-400' : 'text-zinc-600'
                      )}
                    >
                      0{idx + 1}
                    </span>
                    <span
                      className={cn(
                        'hidden text-[10px] sm:inline',
                        isCurrent ? 'text-zinc-300' : 'text-zinc-600'
                      )}
                    >
                      {item.year}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'mt-0.5 font-mono text-[11px] font-bold tracking-tight sm:text-xs',
                      isCurrent ? 'text-white' : isPassed ? 'text-zinc-300' : 'text-zinc-500'
                    )}
                  >
                    {item.day} {item.month[locale]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
