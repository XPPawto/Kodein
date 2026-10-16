import React from 'react';
import Image from 'next/image';
import { EntityDetailData } from '@/content/types';
import { BLUR_DATA_URL } from '@/content/assets';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { KodeinMarkSvg } from '@/components/ui/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Locale } from '@/i18n';

export function EntityLandingView({
  data,
  locale,
}: {
  data: EntityDetailData;
  locale: Locale;
}) {
  return (
    <div className="bg-brand-dark text-white">
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden border-b border-white/10">
        <Image
          src={data.heroImage}
          alt={data.name[locale]}
          fill
          priority
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-black/60" />

        <div className="relative z-10 mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
          <span className="inline-flex items-center gap-2 rounded-md bg-brand-red px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            <KodeinMarkSvg variant="white" className="h-4 w-4" />
            <span>{data.code}</span>
          </span>
          <h1 className="mt-5 text-fluid-h1 font-bold text-white">{data.name[locale]}</h1>
          <p className="mt-5 max-w-3xl text-lg md:text-xl text-zinc-300 leading-relaxed">
            {data.tagline[locale]}
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-brand-charcoal">
        <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20 py-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {data.highlights.map((h, i) => (
            <div key={i} className="border-l-2 border-brand-red pl-5">
              <div className="text-3xl md:text-4xl font-extrabold text-white">{h.metric}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {h.label[locale]}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-white/10">
        <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-bold text-white">
              {locale === 'id' ? 'Ikhtisar Layanan' : 'Service Overview'}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-5 text-base md:text-lg leading-relaxed text-zinc-300">
            {data.overview[locale].map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-brand-black">
        <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
          <SectionHeading
            eyebrow={data.code}
            title={locale === 'id' ? 'Spesialisasi & Solusi Utama' : 'Core Capabilities & Solutions'}
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {data.focusAreas.map((area, idx) => (
              <Reveal
                key={idx}
                delay={idx * 0.08}
                className="rounded-2xl border border-white/10 bg-brand-charcoal p-8"
              >
                <span className="text-xs font-bold text-brand-red">0{idx + 1}</span>
                <h3 className="mt-3 text-xl font-bold text-white">{area.title[locale]}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {area.description[locale]}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-4">
            <Button href="/help-center" variant="primary">
              {locale === 'id' ? 'Konsultasikan Proyek Anda' : 'Consult Your Project'}
            </Button>
            <Button href="/media-center" variant="outline">
              {locale === 'id' ? 'Lihat Studi Kasus & Berita' : 'Explore Case Studies & News'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
