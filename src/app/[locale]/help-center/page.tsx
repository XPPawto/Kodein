'use client';

import React, { useState } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { FAQ_ITEMS } from '@/content/siteData';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n';

export default function HelpCenterPage() {
  const locale = useLocale() as Locale;
  const isId = locale === 'id';
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [sent, setSent] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      subject: String(formData.get('subject') || ''),
      message: String(formData.get('message') || ''),
    };
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) setSent(true);
  };

  return (
    <div className="bg-brand-dark pt-32 pb-24 text-white">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          {isId ? 'Konsultasi & Pusat Bantuan Kodein' : 'Kodein Project Consultation & FAQ'}
        </span>
        <h1 className="mt-4 text-fluid-h1 font-bold">
          {isId
            ? 'Pertanyaan Umum & Formulir Konsultasi Pembuatan Website / Software'
            : 'Frequently Asked Questions & Project Consultation Inquiry'}
        </h1>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-brand-charcoal overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between p-6 text-left font-bold text-white"
                  >
                    <span>{item.q[locale]}</span>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 text-brand-red transition-transform',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm leading-relaxed text-zinc-300">
                      {item.a[locale]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-8">
              <h2 className="text-xl font-bold">
                {isId ? 'Mulai Konsultasi Proyek' : 'Start a Project Consultation'}
              </h2>
              <p className="mt-2 text-xs text-zinc-400">
                {isId
                  ? 'Ceritakan kebutuhan website atau aplikasi yang ingin Anda bangun.'
                  : 'Tell us about the website or software application you want to build.'}
              </p>

              {sent ? (
                <div className="mt-6 flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <p className="text-sm">
                    {isId
                      ? 'Terima kasih! Tim Solution Architect Kodein akan segera menghubungi Anda.'
                      : 'Thank you! Kodein’s Solution Architect team will reach out shortly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="mt-6 space-y-4">
                  <input
                    name="name"
                    required
                    placeholder={isId ? 'Nama Anda & Perusahaan *' : 'Your Name & Company *'}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder={isId ? 'Alamat Email Bisnis *' : 'Work Email Address *'}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                  <input
                    name="subject"
                    required
                    placeholder={
                      isId
                        ? 'Jenis Proyek (Website / Web App / Mobile App / ERP) *'
                        : 'Project Type (Website / Web App / Mobile App / ERP) *'
                    }
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder={
                      isId
                        ? 'Jelaskan fitur utama, target waktu rilis, atau referensi yang diinginkan *'
                        : 'Describe key features, target timeline, or reference sites *'
                    }
                    className="w-full rounded-lg border border-white/15 bg-black/50 p-4 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-full bg-brand-red py-3.5 text-sm font-bold text-white hover:bg-brand-redHover transition"
                  >
                    {isId ? 'Kirim Permintaan Konsultasi' : 'Request Consultation'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
