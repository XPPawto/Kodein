'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'kodein_cookie_consent_v1';

export function CookieBanner() {
  const t = useTranslations('common');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(false);
    }
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      // Ignore storage errors
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Consent"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-2xl border border-white/15 bg-brand-charcoal/95 p-5 backdrop-blur-lg shadow-2xl sm:flex sm:items-center sm:justify-between sm:gap-6"
    >
      <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">{t('cookieText')}</p>
      <button
        type="button"
        onClick={accept}
        className="mt-4 sm:mt-0 shrink-0 rounded-full bg-brand-red px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-redHover"
      >
        {t('cookieAccept')}
      </button>
    </div>
  );
}
