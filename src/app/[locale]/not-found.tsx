'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/navigation';
import { Locale } from '@/i18n';

export default function LocaleNotFound() {
  const locale = useLocale() as Locale;
  const isId = locale === 'id';
  const isZh = locale === 'zh';

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">404</span>
      <h1 className="mt-4 text-3xl md:text-5xl font-bold text-white">
        {isId
          ? 'Halaman Tidak Ditemukan'
          : isZh
          ? '未找到页面 (Page Not Found)'
          : 'Page Not Found'}
      </h1>
      <Link
        href="/"
        className="mt-8 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white hover:bg-brand-redHover transition"
      >
        {isId
          ? 'Kembali ke Beranda Kodein'
          : isZh
          ? '返回 Kodein 首页'
          : 'Back to Kodein Home'}
      </Link>
    </div>
  );
}
