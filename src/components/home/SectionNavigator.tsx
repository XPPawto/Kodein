'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n';

const CHAPTERS = [
  {
    id: 'section-hero',
    num: '01',
    label: { id: 'Sorotan', en: 'Highlights', zh: '精选' },
  },
  {
    id: 'section-about',
    num: '02',
    label: { id: 'Profil', en: 'About', zh: '简介' },
  },
  {
    id: 'section-services',
    num: '03',
    label: { id: 'Layanan', en: 'Services', zh: '服务' },
  },
  {
    id: 'section-stats',
    num: '04',
    label: { id: 'Angka', en: 'Metrics', zh: '数据' },
  },
  {
    id: 'section-deck',
    num: '05',
    label: { id: 'Dokumen', en: 'Deck', zh: '手册' },
  },
  {
    id: 'section-journey',
    num: '06',
    label: { id: 'Perjalanan', en: 'Journey', zh: '历程' },
  },
  {
    id: 'section-vision',
    num: '07',
    label: { id: 'Prinsip', en: 'Vision', zh: '理念' },
  },
];

export function SectionNavigator() {
  const locale = useLocale() as Locale;
  const [activeId, setActiveId] = useState<string>('section-hero');

  useEffect(() => {
    const handleScroll = () => {
      const viewportMiddle = window.innerHeight * 0.38;
      let current = CHAPTERS[0].id;

      for (const ch of CHAPTERS) {
        const el = document.getElementById(ch.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportMiddle) {
            current = ch.id;
          }
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside
      aria-label="Page Section Navigator"
      className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 lg:flex flex-col gap-0.5 rounded-xl border border-white/10 bg-brand-charcoal/80 p-1.5 backdrop-blur-md shadow-xl"
    >
      {CHAPTERS.map((ch) => {
        const isActive = activeId === ch.id;
        return (
          <button
            key={ch.id}
            type="button"
            onClick={() => scrollTo(ch.id)}
            className={cn(
              'group flex items-center gap-1.5 rounded-md px-2 py-1 text-left transition-all duration-200',
              isActive
                ? 'bg-brand-red text-white shadow-sm'
                : 'text-zinc-400 hover:bg-white/10 hover:text-white'
            )}
          >
            <span
              className={cn(
                'font-mono text-[9px] font-bold',
                isActive ? 'text-white' : 'text-brand-red'
              )}
            >
              {ch.num}
            </span>
            <span className="text-[10px] font-medium whitespace-nowrap">
              {ch.label[locale]}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
