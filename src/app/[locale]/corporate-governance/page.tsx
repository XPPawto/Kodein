import React from 'react';
import { ShieldCheck, Code2, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Locale } from '@/i18n';

export default function GovernancePage({ params: { locale } }: { params: { locale: Locale } }) {
  const isId = locale === 'id';
  const isZh = locale === 'zh';

  const pillars = [
    {
      icon: Code2,
      title: isId
        ? 'Standar Clean Code & QA Otomatis'
        : isZh
        ? '整洁代码与自动化质量测试'
        : 'Clean Code & Automated QA Standards',
      desc: isId
        ? 'Setiap fitur melewati code review berlapis, automated testing, dan audit performa sebelum dirilis ke server produksi.'
        : isZh
        ? '每项功能在发布到生产服务器之前，均经过多层代码审查、自动化测试与性能审计。'
        : 'Every feature undergoes peer code review, automated testing, and performance auditing prior to production deployment.',
    },
    {
      icon: ShieldCheck,
      title: isId
        ? 'Keamanan Aplikasi (OWASP & Enkripsi)'
        : isZh
        ? '应用安全标准 (OWASP 与加密)'
        : 'Application Security (OWASP & Encryption)',
      desc: isId
        ? 'Mengadopsi standar keamanan OWASP Top 10 untuk mencegah celah keamanan pada website dan sistem perangkat lunak klien.'
        : isZh
        ? '采用 OWASP Top 10 安全规范，全面防范客户网站与软件系统中的潜在安全漏洞。'
        : 'Adopting OWASP Top 10 security practices to safeguard client websites and software applications against vulnerabilities.',
    },
    {
      icon: FileCheck,
      title: isId
        ? 'Perlindungan NDA & Hak Kekayaan Intelektual'
        : isZh
        ? '严格的保密协议 (NDA) 与源码所有权'
        : 'Strict NDA & Full IP Ownership',
      desc: isId
        ? 'Kerahasiaan ide bisnis dan data perusahaan Anda dijamin melalui perjanjian hukum (NDA) serta kepemilikan source code yang jelas.'
        : isZh
        ? '通过具有法律效力的保密协议 (NDA) 与清晰的源码知识产权归属，全面保护您的商业机密。'
        : 'Your business ideas and proprietary data are protected under strict NDAs and clear source code intellectual property ownership.',
    },
  ];

  return (
    <div className="bg-brand-dark pt-32 pb-24 text-white">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          {isId
            ? 'Standar Kualitas & Keamanan'
            : isZh
            ? '工程质量与安全标准'
            : 'Quality & Security Standards'}
        </span>
        <h1 className="mt-4 max-w-4xl text-fluid-h1 font-bold">
          {isId
            ? 'Kualitas Engineering, Keamanan Data, dan Kepatuhan Standar Industri'
            : isZh
            ? '卓越的工程质量、数据安全保障与行业合规标准'
            : 'Engineering Excellence, Data Security, and Industry-Grade Compliance'}
        </h1>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-brand-charcoal p-8"
              >
                <Icon className="h-8 w-8 text-brand-red" />
                <h2 className="mt-5 text-xl font-bold">{p.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{p.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-brand-red/40 bg-brand-charcoal p-8 flex flex-col justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
                VDP
              </span>
              <h2 className="mt-2 text-2xl font-bold">
                Vulnerability Disclosure Program (VDP)
              </h2>
              <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                {isId
                  ? 'Program pengungkapan kerentanan teknis bagi peneliti keamanan siber untuk melaporkan bug keamanan pada infrastruktur dan sistem Kodein secara bertanggung jawab.'
                  : isZh
                  ? '面向安全研究人员的负责任漏洞披露计划，用于提交 Kodein 系统与基础设施中的潜在技术安全漏洞。'
                  : 'Responsible disclosure program for security researchers to report technical vulnerabilities across Kodein systems.'}
              </p>
            </div>
            <div>
              <Button href="/vdp" variant="primary">
                {isId ? 'Buka Halaman VDP' : isZh ? '进入 VDP 漏洞提交页面' : 'Open VDP Portal'}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-brand-charcoal p-8 flex flex-col justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                WBS
              </span>
              <h2 className="mt-2 text-2xl font-bold">Whistleblowing System (WBS)</h2>
              <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                {isId
                  ? 'Saluran pelaporan rahasia bagi klien, mitra, maupun tim internal untuk melaporkan pelanggaran etika kerja, privasi data (NDA), atau kecurangan.'
                  : isZh
                  ? '面向客户、合作伙伴及内部员工的保密举报通道，用于匿名反馈违反职业道德或保密协议的行为。'
                  : 'Confidential reporting channel for clients, partners, and staff to report ethical breaches or NDA violations.'}
              </p>
            </div>
            <div>
              <Button href="/wbs" variant="outline">
                {isId ? 'Buka Halaman WBS' : isZh ? '进入 WBS 举报通道' : 'Open WBS Portal'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
