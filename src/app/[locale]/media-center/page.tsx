import React from 'react';
import { MediaCenterClient } from '@/components/media/MediaCenterClient';
import { Locale } from '@/i18n';

export default function MediaCenterPage({ params: { locale } }: { params: { locale: Locale } }) {
  const isId = locale === 'id';
  const isZh = locale === 'zh';

  return (
    <div className="bg-brand-dark pt-32 pb-20 text-white">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20 pt-8">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          {isZh ? 'Kodein 案例与技术动态' : 'Kodein Insights & News'}
        </span>
        <h1 className="mt-3 text-fluid-h1 font-bold">
          {isId
            ? 'Rilis Produk, Studi Kasus & Berita Teknologi'
            : isZh
            ? '产品发布、客户成功案例与技术动态'
            : 'Product Releases, Case Studies & Tech Announcements'}
        </h1>
      </div>
      <MediaCenterClient />
    </div>
  );
}
