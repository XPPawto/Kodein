'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function BackToTop() {
  const t = useTranslations('common');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('backToTop')}
      className="fixed bottom-20 right-6 z-40 flex h-11 w-11 items-center justify-center border border-white/20 bg-brand-dark/90 text-white shadow-lg backdrop-blur-md transition hover:border-brand-red hover:bg-brand-red"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
