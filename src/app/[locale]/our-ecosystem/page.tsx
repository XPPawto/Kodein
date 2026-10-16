import React from 'react';
import { ScopeOfWork } from '@/components/home/ScopeOfWork';
import { StatisticsSection } from '@/components/home/StatisticsSection';
import { Locale } from '@/i18n';

export default function EcosystemPage({ params: { locale } }: { params: { locale: Locale } }) {
  const isId = locale === 'id';

  return (
    <div className="bg-brand-dark pt-32 text-white">
      <section className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20 py-16">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          {isId ? 'Layanan & Solusi Kodein' : 'Kodein Services & Solutions'}
        </span>
        <h1 className="mt-4 max-w-4xl text-fluid-h1 font-bold">
          {isId
            ? 'Ekosistem Layanan End-to-End: Dari Desain UI/UX, Pembuatan Website, hingga Cloud'
            : 'End-to-End Digital Engineering: From UI/UX & Web Development to AI & Cloud'}
        </h1>
      </section>
      <ScopeOfWork />
      <StatisticsSection />
    </div>
  );
}
