'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Locale } from '@/i18n';

const wbsSchema = z.object({
  reporterName: z.string().max(100).optional(),
  reporterEmail: z.string().email().optional().or(z.literal('')),
  category: z.enum(['fraud', 'bribery', 'conflict_of_interest', 'harassment', 'other']),
  incidentDate: z.string().min(1, 'Required'),
  description: z.string().min(30, 'Minimum 30 characters required').max(3000),
  honeypot: z.string().max(0).optional(),
});

type WbsFormValues = z.infer<typeof wbsSchema>;

export default function WbsPage() {
  const locale = useLocale() as Locale;
  const isId = locale === 'id';
  const isZh = locale === 'zh';
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WbsFormValues>({
    resolver: zodResolver(wbsSchema),
    defaultValues: { category: 'other', honeypot: '' },
  });

  const onSubmit = async (values: WbsFormValues) => {
    const res = await fetch('/api/wbs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      const data = await res.json();
      setSubmittedRef(data.referenceId);
      reset();
    }
  };

  return (
    <div className="bg-brand-dark pt-32 pb-24 text-white">
      <div className="mx-auto max-w-3xl px-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red">
          <ShieldAlert className="h-4 w-4" />
          <span>
            {isZh ? 'Kodein 安全与职业道德举报系统 (WBS)' : 'Kodein Security & Ethics Reporting'}
          </span>
        </div>

        <h1 className="mt-4 text-fluid-h1 font-bold">
          {isId
            ? 'Pelaporan Keamanan (Bug Bounty) & Etika'
            : isZh
            ? '加密安全漏洞与违规举报通道'
            : 'Encrypted Security & Ethics Reporting'}
        </h1>
        <p className="mt-4 text-zinc-400">
          {isId
            ? 'Identitas pelapor dilindungi sepenuhnya oleh Kodein. Gunakan formulir ini untuk melaporkan kerentanan teknis (VDP) atau pelanggaran etika.'
            : isZh
            ? 'Kodein 严格保护举报人身份信息。请使用此表单匿名反馈违反保密协议 (NDA)、职业道德或安全漏洞的行为。'
            : 'Reporter identity is strictly protected by Kodein. Use this form to report technical vulnerabilities (VDP) or ethical violations.'}
        </p>

        {submittedRef ? (
          <div className="mt-10 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-8">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            <h2 className="mt-4 text-xl font-bold">
              {isId
                ? 'Laporan Berhasil Diterima'
                : isZh
                ? '举报已成功提交'
                : 'Report Successfully Submitted'}
            </h2>
            <p className="mt-2 text-sm text-zinc-300">
              {isId
                ? 'Nomor Tiket Referensi Anda:'
                : isZh
                ? '您的举报跟踪编号：'
                : 'Your Reference Ticket ID:'}{' '}
              <strong className="font-mono text-white">{submittedRef}</strong>
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-10 space-y-6 rounded-2xl border border-white/10 bg-brand-charcoal p-8"
            noValidate
          >
            <input type="text" className="hidden" tabIndex={-1} {...register('honeypot')} />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {isId
                    ? 'Nama / Alias (Opsional)'
                    : isZh
                    ? '姓名 / 昵称（选填）'
                    : 'Name / Handle (Optional)'}
                </label>
                <input
                  type="text"
                  {...register('reporterName')}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {isId
                    ? 'Email (Opsional)'
                    : isZh
                    ? '联系邮箱（选填）'
                    : 'Email (Optional)'}
                </label>
                <input
                  type="email"
                  {...register('reporterEmail')}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {isId
                    ? 'Kategori Laporan *'
                    : isZh
                    ? '举报类别 *'
                    : 'Report Category *'}
                </label>
                <select
                  {...register('category')}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                >
                  <option value="other">
                    {isId
                      ? 'Celah Keamanan / Bug Bounty (VDP)'
                      : isZh
                      ? '技术安全漏洞 (VDP)'
                      : 'Security Vulnerability / Bug Bounty (VDP)'}
                  </option>
                  <option value="fraud">
                    {isId
                      ? 'Pelanggaran NDA / Privasi Data'
                      : isZh
                      ? '违反保密协议 (NDA) / 数据泄密'
                      : 'NDA Breach / Data Privacy Violation'}
                  </option>
                  <option value="conflict_of_interest">
                    {isId
                      ? 'Benturan Kepentingan'
                      : isZh
                      ? '利益冲突'
                      : 'Conflict of Interest'}
                  </option>
                  <option value="bribery">
                    {isId
                      ? 'Gratifikasi / Suap'
                      : isZh
                      ? '贿赂与不当利益'
                      : 'Bribery / Kickbacks'}
                  </option>
                  <option value="harassment">
                    {isId
                      ? 'Pelanggaran Etika Kerja'
                      : isZh
                      ? '违反职业道德准则'
                      : 'Workplace Ethics Violation'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {isId
                    ? 'Tanggal Temuan *'
                    : isZh
                    ? '发生 / 发现日期 *'
                    : 'Discovery Date *'}
                </label>
                <input
                  type="date"
                  {...register('incidentDate')}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                />
                {errors.incidentDate && (
                  <p className="mt-1 text-xs text-brand-red">{errors.incidentDate.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                {isId
                  ? 'Rincian Teknis / Kronologi Lengkap *'
                  : isZh
                  ? '详细经过与技术说明 *'
                  : 'Technical Details / Description *'}
              </label>
              <textarea
                rows={5}
                {...register('description')}
                placeholder={
                  isId
                    ? 'Jelaskan langkah reproduksi bug, URL terkait, atau kronologi kejadian (minimal 30 karakter)...'
                    : isZh
                    ? '请详细说明事件经过、相关 URL 或漏洞复现步骤（至少 30 个字符）...'
                    : 'Describe steps to reproduce, affected URLs, or incident chronology (min. 30 chars)...'
                }
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 p-4 text-sm text-white focus:border-brand-red focus:outline-none"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-brand-red">{errors.description.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-brand-red py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-redHover disabled:opacity-50"
            >
              {isSubmitting
                ? isId
                  ? 'Mengenkripsi & Mengirim...'
                  : isZh
                  ? '正在加密提交...'
                  : 'Encrypting & Submitting...'
                : isId
                ? 'Kirim Laporan Terenkripsi'
                : isZh
                ? '提交加密举报'
                : 'Submit Encrypted Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
