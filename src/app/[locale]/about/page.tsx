import React from 'react';
import Image from 'next/image';
import { ABOUT_PAGE_DATA } from '@/content/siteData';
import { BLUR_DATA_URL } from '@/content/assets';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { JourneyTimeline } from '@/components/home/JourneyTimeline';
import { Locale } from '@/i18n';

export default function AboutPage({ params: { locale } }: { params: { locale: Locale } }) {
  const isId = locale === 'id';
  const isZh = locale === 'zh';

  return (
    <div className="bg-brand-dark pt-32 text-white">
      <section className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20 py-16 md:py-24 border-b border-white/10">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          {isId ? 'Tentang Kodein' : isZh ? '关于 Kodein' : 'About Kodein'}
        </span>
        <h1 className="mt-4 max-w-4xl text-fluid-h1 font-bold">
          {isId
            ? 'Merancang Website & Perangkat Lunak Berkelas Dunia untuk Pertumbuhan Bisnis Modern'
            : isZh
            ? '打造世界级网站与定制软件系统，赋能现代企业持续增长'
            : 'Engineering World-Class Websites & Custom Software for Modern Business Growth'}
        </h1>
      </section>

      <section className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20 py-20 grid grid-cols-1 gap-12 lg:grid-cols-2 border-b border-white/10">
        <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-8 md:p-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
            {isId ? 'Visi Kami' : isZh ? '企业愿景' : 'Our Vision'}
          </span>
          <p className="mt-4 text-xl md:text-2xl font-semibold leading-relaxed text-white">
            {ABOUT_PAGE_DATA.vision[locale]}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-8 md:p-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
            {isId ? 'Misi Engineering' : isZh ? '工程使命' : 'Engineering Mission'}
          </span>
          <ul className="mt-4 space-y-4 text-zinc-300">
            {ABOUT_PAGE_DATA.missions[locale].map((m, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-red" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-brand-light py-24 text-brand-dark">
        <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
          <SectionHeading
            eyebrow={isId ? 'Nilai Kerja' : isZh ? '核心价值观' : 'Core Values'}
            title={
              isId
                ? 'Prinsip Rekayasa & Kualitas Kodein'
                : isZh
                ? 'Kodein 工程与质量准则'
                : 'Kodein Engineering & Quality Principles'
            }
            lightMode
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_PAGE_DATA.values.map((val) => (
              <div
                key={val.code}
                className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-subtle"
              >
                <span className="text-sm font-extrabold text-brand-red">{val.code}</span>
                <h3 className="mt-3 text-lg font-bold">{val.title[locale]}</h3>
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{val.desc[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
        <SectionHeading
          eyebrow={isId ? 'Tim Kepemimpinan' : isZh ? '核心技术团队' : 'Leadership Team'}
          title={
            isId
              ? 'Para Arsitek & Pemimpin Produk Kodein'
              : isZh
              ? 'Kodein 首席架构师与产品负责人'
              : 'Kodein Principal Architects & Product Leaders'
          }
        />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_PAGE_DATA.leadership.map((exec) => (
            <div
              key={exec.name}
              className="overflow-hidden rounded-2xl border border-white/10 bg-brand-charcoal"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={exec.image}
                  alt={exec.name}
                  fill
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover grayscale"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white">{exec.name}</h3>
                <p className="mt-1 text-xs text-zinc-400">{exec.role[locale]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <JourneyTimeline />
    </div>
  );
}
