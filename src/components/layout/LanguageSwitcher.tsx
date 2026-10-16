'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from '@/navigation';
import { Locale } from '@/i18n';
import { cn } from '@/lib/utils';

const LANGUAGE_LABELS: Record<Locale, string> = {
  id: 'Indonesia (ID)',
  en: 'English (EN)',
  zh: '中文 (ZH)',
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = (nextLocale: Locale) => {
    setOpen(false);
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Select Language"
        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold uppercase text-white transition hover:border-white/30"
      >
        <FlagIcon code={locale} />
        <span>{locale.toUpperCase()}</span>
        <ChevronDown className="h-3 w-3 opacity-75" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-40 rounded-lg border border-white/15 bg-brand-charcoal p-1 shadow-xl z-50"
        >
          {(['id', 'en', 'zh'] as Locale[]).map((item) => (
            <button
              key={item}
              type="button"
              role="menuitem"
              onClick={() => switchLocale(item)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs font-medium transition',
                locale === item
                  ? 'bg-brand-red text-white'
                  : 'text-zinc-300 hover:bg-white/10 hover:text-white'
              )}
            >
              <FlagIcon code={item} />
              <span>{LANGUAGE_LABELS[item]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FlagIcon({ code }: { code: Locale }) {
  if (code === 'id') {
    return (
      <svg className="h-3.5 w-3.5 rounded-full overflow-hidden shrink-0" viewBox="0 0 24 24">
        <rect width="24" height="12" fill="#E70011" />
        <rect y="12" width="24" height="12" fill="#FFFFFF" />
      </svg>
    );
  }
  if (code === 'zh') {
    return (
      <svg className="h-3.5 w-3.5 rounded-full overflow-hidden shrink-0" viewBox="0 0 24 24">
        <rect width="24" height="24" fill="#DE2910" />
        <circle cx="7" cy="7" r="3" fill="#FFDE00" />
        <circle cx="12" cy="4" r="1" fill="#FFDE00" />
        <circle cx="14" cy="6.5" r="1" fill="#FFDE00" />
        <circle cx="14" cy="9.5" r="1" fill="#FFDE00" />
        <circle cx="12" cy="12" r="1" fill="#FFDE00" />
      </svg>
    );
  }
  return (
    <svg className="h-3.5 w-3.5 rounded-full overflow-hidden shrink-0" viewBox="0 0 24 24">
      <rect width="24" height="24" fill="#012169" />
      <path d="M0 0L24 24M24 0L0 24" stroke="#FFF" strokeWidth="4" />
      <path d="M12 0V24M0 12H24" stroke="#FFF" strokeWidth="6" />
      <path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="3.5" />
    </svg>
  );
}
