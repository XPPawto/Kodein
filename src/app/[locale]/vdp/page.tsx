'use client';

import React, { useState } from 'react';
import { ShieldCheck, Bug, Lock, Terminal, CheckCircle2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Locale } from '@/i18n';

export default function VdpPage() {
  const locale = useLocale() as Locale;
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const copy = {
    id: {
      eyebrow: 'Vulnerability Disclosure Program (VDP)',
      title: 'Program Pengungkapan Kerentanan Keamanan Kodein',
      subtitle:
        'Kodein berkomitmen menjaga keamanan setiap baris kode, website, dan infrastruktur server yang kami bangun. Kami mengundang peneliti keamanan siber (security researchers) untuk melaporkan temuan celah keamanan secara bertanggung jawab.',
      safeHarborTitle: 'Jaminan Safe Harbor',
      safeHarborDesc:
        'Kami tidak akan menempuh jalur hukum terhadap peneliti yang melakukan pengujian dengan iktikad baik, tidak merusak layanan (DoS), dan tidak mengakses atau menyebarkan data milik klien Kodein.',
      scopeTitle: 'Cakupan Sistem (In-Scope)',
      scopeDesc:
        'Seluruh domain resmi *.kodein.id, API publik Kodein, serta repositori open-source resmi milik studio Kodein.',
      slaTitle: 'Respons & Penanganan Cepat',
      slaDesc:
        'Tim engineer kami di Indralaya Utara memverifikasi setiap laporan kritis dalam waktu maksimal 1x24 jam dan memberikan apresiasi di Hall of Fame keamanan Kodein.',
      formTitle: 'Kirim Laporan Kerentanan Teknis (PoC)',
      researcherName: 'Nama / Handle Peneliti (Opsional)',
      researcherEmail: 'Email untuk Konfirmasi Temuan *',
      targetAsset: 'URL / Domain / Endpoint Terdampak *',
      severity: 'Tingkat Keparahan (Severity) *',
      pocLabel: 'Langkah Reproduksi (Steps to Reproduce) & Dampak Teknis *',
      pocPlaceholder:
        'Tuliskan payload, langkah reproduksi secara berurutan, dan dampak kerentanan (minimal 30 karakter)...',
      submitBtn: 'Kirim Laporan VDP Terenkripsi',
      submittingBtn: 'Mengirim Laporan...',
      successTitle: 'Laporan VDP Berhasil Diterima',
      successTicket: 'Nomor Tiket VDP Anda:',
    },
    en: {
      eyebrow: 'Vulnerability Disclosure Program (VDP)',
      title: 'Kodein Security Vulnerability Disclosure Program',
      subtitle:
        'Kodein is committed to securing every line of code, website, and server infrastructure we engineer. We welcome independent security researchers to report potential vulnerabilities through responsible disclosure.',
      safeHarborTitle: 'Safe Harbor Guarantee',
      safeHarborDesc:
        'We will not pursue legal action against researchers who test in good faith, avoid service disruption (DoS), and do not exfiltrate or modify client data.',
      scopeTitle: 'In-Scope Assets',
      scopeDesc:
        'All official *.kodein.id domains, public Kodein APIs, and official open-source repositories maintained by Kodein.',
      slaTitle: 'Rapid Triage & Resolution',
      slaDesc:
        'Our engineering team acknowledges critical reports within 24 hours and credits valid findings on the Kodein Security Hall of Fame.',
      formTitle: 'Submit a Technical Vulnerability Report (PoC)',
      researcherName: 'Researcher Name / Handle (Optional)',
      researcherEmail: 'Contact Email for Triage Updates *',
      targetAsset: 'Affected URL / Domain / Endpoint *',
      severity: 'Estimated Severity (CVSS) *',
      pocLabel: 'Steps to Reproduce & Technical Impact *',
      pocPlaceholder:
        'Provide clear reproduction steps, proof-of-concept (PoC), and security impact (min. 30 chars)...',
      submitBtn: 'Submit Encrypted VDP Report',
      submittingBtn: 'Encrypting & Sending...',
      successTitle: 'VDP Report Received',
      successTicket: 'Your VDP Ticket Reference:',
    },
    zh: {
      eyebrow: '漏洞披露计划 (VDP)',
      title: 'Kodein 安全漏洞负责任披露计划',
      subtitle:
        'Kodein 致力于保障我们开发的每一行代码、网站与服务器基础设施的安全。我们欢迎安全研究人员与白帽黑客通过负责任的方式向我们报告潜在的技术安全漏洞。',
      safeHarborTitle: '安全港保障 (Safe Harbor)',
      safeHarborDesc:
        '对于出于善意进行测试、未造成服务中断 (DoS) 且未窃取或篡改客户数据的安全研究人员，我们承诺绝不采取法律行动。',
      scopeTitle: '测试范围 (In-Scope)',
      scopeDesc:
        '所有 *.kodein.id 官方域名、Kodein 公共 API 接口以及 Kodein 官方维护的开源代码库。',
      slaTitle: '快速响应与修复',
      slaDesc:
        '我们的工程团队会在 24 小时内确认严重漏洞报告，并将有效报告者列入 Kodein 安全致谢榜。',
      formTitle: '提交技术安全漏洞报告 (PoC)',
      researcherName: '研究人员姓名 / 昵称（选填）',
      researcherEmail: '用于接收修复进度的联系邮箱 *',
      targetAsset: '受影响的 URL / 域名 / 接口地址 *',
      severity: '漏洞严重程度 (Severity) *',
      pocLabel: '复现步骤 (Steps to Reproduce) 与技术影响 *',
      pocPlaceholder: '请详细描述漏洞复现步骤、PoC 验证代码及潜在安全影响（至少 30 个字符）...',
      submitBtn: '提交加密 VDP 漏洞报告',
      submittingBtn: '正在加密提交...',
      successTitle: 'VDP 漏洞报告已成功接收',
      successTicket: '您的漏洞跟踪编号：',
    },
  }[locale];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const target = String(formData.get('targetAsset') || '');
    const sev = String(formData.get('severity') || 'high');
    const poc = String(formData.get('poc') || '');

    const payload = {
      reporterName: String(formData.get('researcherName') || ''),
      reporterEmail: String(formData.get('researcherEmail') || ''),
      category: 'other',
      incidentDate: new Date().toISOString().split('T')[0],
      description: `[VDP-${sev.toUpperCase()}] Target: ${target} | PoC: ${poc}`,
      honeypot: '',
    };

    const res = await fetch('/api/wbs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);
    if (res.ok) {
      const data = await res.json();
      setTicketId(data.referenceId.replace('KODEIN-SEC-', 'KODEIN-VDP-'));
    }
  };

  return (
    <div className="bg-brand-dark pt-32 pb-24 text-white">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          <Bug className="h-4 w-4" />
          <span>{copy.eyebrow}</span>
        </div>

        <h1 className="mt-4 max-w-4xl text-fluid-h1 font-bold">{copy.title}</h1>
        <p className="mt-4 max-w-3xl text-base md:text-lg text-zinc-400 leading-relaxed">
          {copy.subtitle}
        </p>

        {/* 3 Pillars of Kodein VDP */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-7">
            <ShieldCheck className="h-7 w-7 text-brand-red" />
            <h2 className="mt-4 text-lg font-bold">{copy.safeHarborTitle}</h2>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{copy.safeHarborDesc}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-7">
            <Terminal className="h-7 w-7 text-brand-red" />
            <h2 className="mt-4 text-lg font-bold">{copy.scopeTitle}</h2>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{copy.scopeDesc}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-7">
            <Lock className="h-7 w-7 text-brand-red" />
            <h2 className="mt-4 text-lg font-bold">{copy.slaTitle}</h2>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{copy.slaDesc}</p>
          </div>
        </div>

        {/* VDP Submission Form */}
        <div className="mt-16 max-w-3xl">
          {ticketId ? (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-8">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              <h2 className="mt-4 text-xl font-bold">{copy.successTitle}</h2>
              <p className="mt-2 text-sm text-zinc-300">
                {copy.successTicket}{' '}
                <strong className="font-mono text-white">{ticketId}</strong>
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-2xl border border-white/10 bg-brand-charcoal p-8"
            >
              <h2 className="text-xl font-bold">{copy.formTitle}</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {copy.researcherName}
                  </label>
                  <input
                    name="researcherName"
                    type="text"
                    placeholder="e.g. @sec_hunter"
                    className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {copy.researcherEmail}
                  </label>
                  <input
                    name="researcherEmail"
                    type="email"
                    required
                    placeholder="researcher@domain.com"
                    className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {copy.targetAsset}
                  </label>
                  <input
                    name="targetAsset"
                    type="text"
                    required
                    placeholder="https://api.kodein.id/v1/..."
                    className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {copy.severity}
                  </label>
                  <select
                    name="severity"
                    className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  >
                    <option value="critical">Critical (CVSS 9.0 - 10.0)</option>
                    <option value="high">High (CVSS 7.0 - 8.9)</option>
                    <option value="medium">Medium (CVSS 4.0 - 6.9)</option>
                    <option value="low">Low / Informational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {copy.pocLabel}
                </label>
                <textarea
                  name="poc"
                  required
                  minLength={30}
                  rows={5}
                  placeholder={copy.pocPlaceholder}
                  className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 p-4 font-mono text-xs text-white focus:border-brand-red focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-brand-red py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-redHover disabled:opacity-50"
              >
                {submitting ? copy.submittingBtn : copy.submitBtn}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
