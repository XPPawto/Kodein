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
  const isZh = locale === 'zh';
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      subject: String(formData.get('subject') || ''),
      message: String(formData.get('message') || ''),
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setErrorMsg(
          isId
            ? 'Pastikan seluruh kolom diisi dengan lengkap (pesan minimal 10 karakter).'
            : isZh
            ? '请确保完整填写所有必填项（详细描述至少 10 个字符）。'
            : 'Please ensure all fields are filled out properly (message min. 10 characters).'
        );
      }
    } catch {
      setErrorMsg(
        isId
          ? 'Gagal mengirim pesan. Silakan coba lagi.'
          : isZh
          ? '发送失败，请稍后重试。'
          : 'Failed to send message. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-dark pt-32 pb-24 text-white">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          {isId
            ? 'Konsultasi & Pusat Bantuan Kodein'
            : isZh
            ? 'Kodein 项目咨询与常见问题'
            : 'Kodein Project Consultation & FAQ'}
        </span>
        <h1 className="mt-4 text-fluid-h1 font-bold">
          {isId
            ? 'Pertanyaan Umum & Formulir Konsultasi Pembuatan Website / Software'
            : isZh
            ? '常见问题解答与网站 / 定制软件开发项目咨询'
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
                        'h-5 w-5 text-brand-red transition-transform shrink-0 ml-4',
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
                {isId
                  ? 'Mulai Konsultasi Proyek'
                  : isZh
                  ? '开启项目开发咨询'
                  : 'Start a Project Consultation'}
              </h2>
              <p className="mt-2 text-xs text-zinc-400">
                {isId
                  ? 'Ceritakan kebutuhan website atau aplikasi yang ingin Anda bangun.'
                  : isZh
                  ? '告诉我们您想要建设的网站或定制软件系统需求。'
                  : 'Tell us about the website or software application you want to build.'}
              </p>

              {sent ? (
                <div className="mt-6 flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <p className="text-sm">
                    {isId
                      ? 'Terima kasih! Tim Solution Architect Kodein akan segera menghubungi Anda.'
                      : isZh
                      ? '感谢您的咨询！Kodein 解决方案架构师团队将尽快与您联系。'
                      : 'Thank you! Kodein’s Solution Architect team will reach out shortly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="mt-6 space-y-4">
                  <input
                    name="name"
                    required
                    minLength={2}
                    placeholder={
                      isId
                        ? 'Nama Anda & Perusahaan *'
                        : isZh
                        ? '您的姓名与公司名称 *'
                        : 'Your Name & Company *'
                    }
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder={
                      isId
                        ? 'Alamat Email Bisnis *'
                        : isZh
                        ? '商务联系邮箱 *'
                        : 'Work Email Address *'
                    }
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                  <input
                    name="subject"
                    required
                    minLength={3}
                    placeholder={
                      isId
                        ? 'Jenis Proyek (Website / Web App / Mobile App / ERP) *'
                        : isZh
                        ? '项目类型（企业官网 / Web 系统 / 移动 App / ERP）*'
                        : 'Project Type (Website / Web App / Mobile App / ERP) *'
                    }
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                  <textarea
                    name="message"
                    required
                    minLength={10}
                    rows={4}
                    placeholder={
                      isId
                        ? 'Jelaskan fitur utama, target waktu rilis, atau referensi yang diinginkan *'
                        : isZh
                        ? '请描述核心功能需求、预期上线时间或参考网站（至少 10 个字符）*'
                        : 'Describe key features, target timeline, or reference sites *'
                    }
                    className="w-full rounded-lg border border-white/15 bg-black/50 p-4 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                  {errorMsg && <p className="text-xs text-brand-coral">{errorMsg}</p>}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-brand-red py-3.5 text-sm font-bold text-white hover:bg-brand-redHover transition disabled:opacity-50"
                  >
                    {submitting
                      ? isId
                        ? 'Mengirim...'
                        : isZh
                        ? '正在发送...'
                        : 'Sending...'
                      : isId
                      ? 'Kirim Permintaan Konsultasi'
                      : isZh
                      ? '提交项目咨询申请'
                      : 'Request Consultation'}
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
