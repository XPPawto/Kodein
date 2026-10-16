'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { KodeinMarkSvg } from '@/components/ui/BrandLogo';
import { Locale } from '@/i18n';

interface RouteDescriptor {
  code: string;
  label: Record<Locale, string>;
}

const ROUTE_CATALOG: Record<string, RouteDescriptor> = {
  '/': {
    code: 'SYS // 00',
    label: { id: 'Beranda Utama', en: 'Main Homepage', zh: '网站首页' },
  },
  '/about': {
    code: 'PRO // 01',
    label: { id: 'Tentang Kodein', en: 'About Kodein', zh: '关于 Kodein' },
  },
  '/our-ecosystem': {
    code: 'ECO // 02',
    label: { id: 'Ekosistem Layanan', en: 'Service Ecosystem', zh: '服务生态系统' },
  },
  '/dam': {
    code: 'UNIT // DAM',
    label: { id: 'Web & Aplikasi Mobile', en: 'Web & Mobile Apps', zh: '网站与移动应用' },
  },
  '/dim': {
    code: 'UNIT // DIM',
    label: { id: 'Sistem Kustom & AI', en: 'Custom Systems & AI', zh: '定制系统与 AI' },
  },
  '/ddmf': {
    code: 'UNIT // DDMF',
    label: { id: 'Server & Maintenance', en: 'Server & Maintenance', zh: '服务器与运维支持' },
  },
  '/media-center': {
    code: 'ARC // 03',
    label: { id: 'Catatan & Studi Kasus', en: 'Case Studies & Notes', zh: '项目案例与动态' },
  },
  '/investor-relations': {
    code: 'MOD // 04',
    label: { id: 'Model Kerja Sama', en: 'Engagement Models', zh: '合作模式' },
  },
  '/corporate-governance': {
    code: 'SEC // 05',
    label: { id: 'Standar & Keamanan', en: 'Security & Governance', zh: '安全标准与治理' },
  },
  '/help-center': {
    code: 'INQ // 06',
    label: { id: 'Diskusi Proyek', en: 'Project Inquiry', zh: '项目咨询' },
  },
  '/wbs': {
    code: 'GOV // WBS',
    label: { id: 'Whistleblowing System', en: 'Whistleblowing System', zh: '保密举报系统' },
  },
  '/vdp': {
    code: 'SEC // VDP',
    label: { id: 'Vulnerability Disclosure', en: 'Vulnerability Disclosure', zh: '漏洞披露计划' },
  },
  '/cms': {
    code: 'ADM // CMS',
    label: { id: 'CMS Studio', en: 'CMS Studio', zh: 'CMS 管理后台' },
  },
};

function stripLocalePrefix(rawPath: string): string {
  const cleaned = rawPath.replace(/^\/(id|en|zh)(?=\/|$)/, '');
  return cleaned === '' ? '/' : cleaned;
}

export function RouteTransition() {
  const pathname = usePathname();
  const locale = useLocale() as Locale;

  // Phase: 'idle' | 'entering' (shutter closing on click) | 'exiting' (shutter opening on route arrival)
  const [phase, setPhase] = useState<'idle' | 'entering' | 'exiting'>('idle');
  const [targetRoute, setTargetRoute] = useState<{
    path: string;
    code: string;
    title: string;
  }>({
    path: '/',
    code: 'SYS // 00',
    title: 'Kodein',
  });

  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPathnameRef = useRef<string>(pathname);

  const resolveRouteMeta = useCallback(
    (rawPath: string, fallbackText?: string) => {
      const normalized = stripLocalePrefix(rawPath);
      const exact = ROUTE_CATALOG[normalized];
      if (exact) {
        return {
          path: normalized,
          code: exact.code,
          title: exact.label[locale] || exact.label.id,
        };
      }
      if (normalized.startsWith('/media-center/')) {
        return {
          path: normalized,
          code: 'ARC // READ',
          title:
            fallbackText && fallbackText.length > 2 && fallbackText.length < 60
              ? fallbackText
              : locale === 'id'
                ? 'Membuka Studi Kasus'
                : locale === 'zh'
                  ? '正在打开案例文章'
                  : 'Opening Case Study',
        };
      }
      return {
        path: normalized,
        code: 'NAV // ROUTE',
        title:
          fallbackText && fallbackText.length > 1 && fallbackText.length < 50
            ? fallbackText
            : 'Kodein Studio',
      };
    },
    [locale]
  );

  // Animate numerical telemetry counter via direct DOM ref (zero React re-renders)
  const startCounterAnimation = useCallback((toComplete: boolean) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    let current = toComplete ? 78 : 0;
    const target = toComplete ? 100 : 86;
    const speed = toComplete ? 0.35 : 0.14;

    const step = () => {
      current += (target - current) * speed;
      if (Math.abs(target - current) < 0.6) {
        current = target;
      }
      const rounded = Math.round(current);
      if (counterRef.current) {
        counterRef.current.textContent = String(rounded).padStart(2, '0');
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${(current / 100).toFixed(3)})`;
      }
      if (current < target) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  const triggerExit = useCallback(() => {
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    const elapsed = performance.now() - startTimeRef.current;
    // Guarantee a crisp minimum visual beat (260ms) so fast cached routes still look intentional and smooth
    const remainingWait = Math.max(0, 260 - elapsed);

    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(() => {
      startCounterAnimation(true);
      setPhase('exiting');
      exitTimerRef.current = setTimeout(() => {
        setPhase('idle');
      }, 380);
    }, remainingWait);
  }, [startCounterAnimation]);

  // Listen to global internal link clicks in capture phase for 0ms instant response
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const rawHref = anchor.getAttribute('href');
      if (
        !rawHref ||
        rawHref.startsWith('#') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('javascript:')
      ) {
        return;
      }

      try {
        const url = new URL(anchor.href, window.location.origin);
        if (url.origin !== window.location.origin) return;

        // Ignore same-page clicks (or hash jumps on the same page)
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search
        ) {
          return;
        }

        const linkLabel = anchor.textContent?.trim();
        const meta = resolveRouteMeta(url.pathname, linkLabel);

        startTimeRef.current = performance.now();
        setTargetRoute(meta);
        setPhase('entering');
        startCounterAnimation(false);

        // Broadcast custom event so Header tabs can also highlight immediately
        window.dispatchEvent(
          new CustomEvent('kodein:route-start', { detail: { path: meta.path } })
        );

        // Safety fallback in case navigation is aborted or slow
        if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = setTimeout(() => {
          triggerExit();
        }, 2200);
      } catch {
        // Ignore malformed URLs
      }
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [resolveRouteMeta, startCounterAnimation, triggerExit]);

  // Detect when Next.js finishes switching pathname
  useEffect(() => {
    if (pathname !== lastPathnameRef.current) {
      lastPathnameRef.current = pathname;
      window.dispatchEvent(new CustomEvent('kodein:route-complete'));
      if (phase !== 'idle') {
        triggerExit();
      }
    }
  }, [pathname, phase, triggerExit]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  if (phase === 'idle') return null;

  const isEntering = phase === 'entering';

  return (
    <div
      aria-live="polite"
      aria-busy={isEntering}
      className="pointer-events-none fixed inset-0 z-[120] overflow-hidden"
    >
      {/* Top Laser Progress Rail */}
      <div className="absolute inset-x-0 top-0 z-30 h-[3px] bg-white/10">
        <div
          ref={barRef}
          className="h-full w-full origin-left bg-brand-red shadow-[0_0_16px_#EE2B10] will-change-transform"
          style={{ transform: 'scaleX(0.15)' }}
        />
      </div>

      {/* 5-Column Architectural Shutter Grid (GPU scaleY choreography) */}
      <div className="grid h-full w-full grid-cols-5">
        {[0, 1, 2, 3, 4].map((col) => (
          <div
            key={col}
            className="h-full border-r border-white/[0.06] bg-[#07070A] last:border-r-0 will-change-transform"
            style={{
              transformOrigin: isEntering ? 'bottom' : 'top',
              transform: isEntering ? 'scaleY(1)' : 'scaleY(0)',
              transition: `transform ${isEntering ? 240 : 320}ms cubic-bezier(0.22, 1, 0.36, 1) ${col * 22}ms`,
            }}
          />
        ))}
      </div>

      {/* Center Kinetic Telemetry Stamp */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
        style={{
          opacity: isEntering ? 1 : 0,
          transform: isEntering ? 'translate3d(0, 0px, 0)' : 'translate3d(0, -18px, 0)',
          transition: 'opacity 180ms ease, transform 240ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="w-full max-w-md border border-white/15 bg-[#0C0C10] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
          {/* Top Telemetry Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-400">
            <div className="flex items-center gap-2.5">
              <KodeinMarkSvg variant="gradient" className="h-4 w-4 animate-spin" />
              <span className="font-bold text-brand-red">{targetRoute.code}</span>
            </div>
            <span className="text-zinc-500">{targetRoute.path}</span>
          </div>

          {/* Destination Title & Live Numerical Counter */}
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
                {locale === 'id'
                  ? 'MEMBUKA HALAMAN'
                  : locale === 'zh'
                    ? '正在切换页面'
                    : 'ROUTING TO DESTINATION'}
              </span>
              <div className="mt-1 font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                {targetRoute.title}
              </div>
            </div>

            <div className="flex items-baseline font-mono text-3xl font-black tabular-nums tracking-tighter text-white sm:text-4xl">
              <span ref={counterRef}>12</span>
              <span className="ml-0.5 text-sm font-bold text-brand-red">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
