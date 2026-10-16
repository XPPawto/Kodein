import React from 'react';
import {
  ShieldCheck,
  Code2,
  FileCheck,
  Lock,
  Server,
  Activity,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Locale } from '@/i18n';

export default function GovernancePage({ params: { locale } }: { params: { locale: Locale } }) {
  const isId = locale === 'id';
  const isZh = locale === 'zh';

  const pillars = [
    {
      icon: Code2,
      badge: '01 / ENGINEERING QA',
      title: isId
        ? 'Standar Clean Code & QA Otomatis'
        : isZh
        ? '整洁代码与自动化质量测试'
        : 'Clean Code & Automated QA Standards',
      desc: isId
        ? 'Setiap fitur melewati code review berlapis, static analysis (TypeScript strict & linter), dan audit performa sebelum dirilis ke produksi.'
        : isZh
        ? '每项功能在发布到生产服务器之前，均经过多层代码审查、静态分析与性能审计。'
        : 'Every feature undergoes peer code review, strict static analysis, and performance auditing prior to production deployment.',
    },
    {
      icon: ShieldCheck,
      badge: '02 / OWASP ASVS L2',
      title: isId
        ? 'Keamanan Setara Enterprise (OWASP & WAF)'
        : isZh
        ? '企业级应用安全 (OWASP 与 WAF)'
        : 'Enterprise-Grade Security (OWASP & WAF)',
      desc: isId
        ? 'Dilengkapi Edge WAF aktif, proteksi CSRF/XSS/SQLi, Content-Security-Policy (CSP) ketat, HSTS Preload, dan Rate Limiting berlapis.'
        : isZh
        ? '配备主动边缘 WAF 防火墙、CSRF/XSS/SQLi 防护、严格 CSP 策略、HSTS 预加载与多层速率限制。'
        : 'Equipped with active Edge WAF, CSRF/XSS/SQLi protection, strict Content-Security-Policy (CSP), HSTS Preload, and multi-tier rate limiting.',
    },
    {
      icon: FileCheck,
      badge: '03 / NDA & IP ESCROW',
      title: isId
        ? 'Perlindungan NDA & Hak Kekayaan Intelektual'
        : isZh
        ? '严格的保密协议 (NDA) 与源码所有权'
        : 'Strict NDA & Full IP Ownership',
      desc: isId
        ? 'Kerahasiaan ide bisnis dan data perusahaan Anda dijamin melalui perjanjian hukum (NDA) serta serah terima kepemilikan source code penuh.'
        : isZh
        ? '通过具有法律效力的保密协议 (NDA) 与清晰的源码知识产权归属，全面保护您的商业机密。'
        : 'Your business ideas and proprietary data are protected under strict NDAs and full source code intellectual property handover.',
    },
  ];

  const securityControls = [
    {
      code: 'SEC-01',
      icon: ShieldCheck,
      name: isId
        ? 'Edge Web Application Firewall (WAF)'
        : isZh
        ? '边缘 Web 应用防火墙 (Edge WAF)'
        : 'Edge Web Application Firewall (WAF)',
      spec: isId
        ? 'Inspeksi otomatis pada setiap request untuk memblokir Path Traversal, SQL Injection, XSS Script Injection, dan pemindaian file sensitif (.env / .git).'
        : isZh
        ? '自动检测每个请求，实时拦截路径遍历、SQL 注入、XSS 脚本注入及敏感文件扫描。'
        : 'Real-time request inspection blocking Path Traversal, SQL Injection, XSS payloads, and sensitive dotfile probing.',
      status: 'ACTIVE • BLOCK MODE',
    },
    {
      code: 'SEC-02',
      icon: Lock,
      name: isId
        ? 'Zero-Trust Auth & HMAC-SHA256 Session'
        : isZh
        ? '零信任认证与 HMAC-SHA256 会话签名'
        : 'Zero-Trust Auth & HMAC-SHA256 Sessions',
      spec: isId
        ? 'Verifikasi password menggunakan algoritma Timing-Safe SHA-256 (anti timing-attack) dengan token sesi terenkripsi HttpOnly & SameSite=Strict.'
        : isZh
        ? '采用防时序攻击的 SHA-256 密码验证机制，配合 HttpOnly 与 SameSite=Strict 签名会话令牌。'
        : 'Timing-safe SHA-256 password verification paired with HMAC-SHA256 signed HttpOnly, SameSite=Strict session cookies.',
      status: 'ENFORCED • 8H TTL',
    },
    {
      code: 'SEC-03',
      icon: Activity,
      name: isId
        ? 'Multi-Tier Sliding Window Rate Limiter'
        : isZh
        ? '多层滑动窗口速率限制器'
        : 'Multi-Tier Sliding Window Rate Limiter',
      spec: isId
        ? 'Pembatasan otomatis per IP untuk mencegah serangan Brute-Force, DDoS lapisan aplikasi, dan spam formulir (dilengkapi header X-RateLimit-*).'
        : isZh
        ? '基于 IP 的多层滑动窗口限流机制，防止暴力破解、应用层 DDoS 与表单垃圾请求。'
        : 'Per-IP sliding window throttling across auth, mutation, and public form endpoints to prevent brute-force and layer-7 abuse.',
      status: 'ACTIVE • 4 TIERS',
    },
    {
      code: 'SEC-04',
      icon: Server,
      name: isId
        ? 'Hardened HTTP Headers (CSP, HSTS, COOP/CORP)'
        : isZh
        ? '加固型 HTTP 安全响应头 (CSP / HSTS)'
        : 'Hardened HTTP Security Headers (CSP & HSTS)',
      spec: isId
        ? 'Kebijakan Content-Security-Policy ketat, Strict-Transport-Security (2 tahun + preload), X-Frame-Options DENY (anti-clickjacking), dan Zero-Privilege Permissions-Policy.'
        : isZh
        ? '严格的 CSP 内容安全策略、HSTS 强制加密传输、防点击劫持 (DENY) 与零权限设备策略。'
        : 'Strict Content-Security-Policy, HSTS (2-year preload), X-Frame-Options DENY, Cross-Origin isolation, and zero-privilege Permissions-Policy.',
      status: 'GRADE A+ HEADERS',
    },
  ];

  return (
    <div className="bg-brand-dark pt-32 pb-24 text-white">
      <div className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          <ShieldCheck className="h-4 w-4" />
          <span>
            {isId
              ? 'Standar Kualitas & Keamanan Enterprise'
              : isZh
              ? '企业级工程质量与安全标准'
              : 'Enterprise Quality & Security Standards'}
          </span>
        </span>

        <h1 className="mt-4 max-w-4xl text-fluid-h1 font-bold">
          {isId
            ? 'Kualitas Engineering, Keamanan Setara Enterprise, dan Kepatuhan Standar Industri'
            : isZh
            ? '卓越的工程质量、企业级数据安全保障与行业合规标准'
            : 'Engineering Excellence, Enterprise-Grade Security, and Industry Compliance'}
        </h1>

        <p className="mt-4 max-w-3xl text-base md:text-lg text-zinc-400 leading-relaxed">
          {isId
            ? 'Kodein merancang setiap aplikasi dan infrastruktur klien menggunakan arsitektur pertahanan berlapis (Defense-in-Depth) agar bisnis Anda terlindungi dari ancaman siber modern.'
            : isZh
            ? 'Kodein 采用纵深防御 (Defense-in-Depth) 安全架构构建每一个客户应用与服务器基础设施，全方位抵御现代网络威胁。'
            : 'Kodein engineers every client application and server infrastructure using a Defense-in-Depth security architecture to safeguard your business against modern cyber threats.'}
        </p>

        {/* 3 Core Pillars */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-brand-charcoal p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-brand-red" />
                    <span className="font-mono text-[11px] font-bold tracking-widest text-zinc-500">
                      {p.badge}
                    </span>
                  </div>
                  <h2 className="mt-5 text-xl font-bold">{p.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise Security Architecture Matrix */}
        <div className="mt-20 rounded-3xl border border-white/15 bg-brand-charcoal/70 p-8 sm:p-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
                {isId
                  ? 'Arsitektur Pertahanan Berlapis (Defense-in-Depth)'
                  : isZh
                  ? '纵深防御安全矩阵 (Defense-in-Depth)'
                  : 'Defense-in-Depth Security Matrix'}
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                {isId
                  ? 'Spesifikasi Keamanan Sistem Kodein'
                  : isZh
                  ? 'Kodein 企业级系统安全技术规范'
                  : 'Kodein Enterprise Security Technical Controls'}
              </h2>
            </div>

            <a
              href="/api/security"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 font-mono text-xs text-zinc-300 transition hover:border-brand-red hover:text-white"
            >
              <Terminal className="h-3.5 w-3.5 text-brand-red" />
              <span>GET /api/security (Live Telemetry)</span>
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {securityControls.map((ctrl) => {
              const Icon = ctrl.icon;
              return (
                <div
                  key={ctrl.code}
                  className="rounded-2xl border border-white/10 bg-black/40 p-6 transition hover:border-white/25"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red/15 text-brand-red">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-zinc-400">
                        {ctrl.code}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] font-bold text-zinc-300">
                      <CheckCircle2 className="h-3 w-3 text-brand-red" />
                      {ctrl.status}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-white">{ctrl.name}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-400">
                    {ctrl.spec}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* VDP & WBS Portals */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-brand-red/40 bg-brand-charcoal p-8 flex flex-col justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
                VDP • RFC 9116 COMPLIANT
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
                WBS • ZERO-KNOWLEDGE ANONYMOUS CHANNEL
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
