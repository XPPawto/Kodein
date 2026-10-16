import { CmsDatabase } from '@/content/types';

function escapePdfText(input: string): string {
  // Replace non-ASCII characters with safe ASCII equivalents for standard PDF Type1 Helvetica font
  const ascii = input
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2022/g, '*')
    .replace(/\u2265/g, '>=')
    .replace(/[^\x20-\x7E]/g, '');
  return ascii.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function wrapLines(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function generateCapabilitiesDeckPdf(
  cms: CmsDatabase,
  locale: 'id' | 'en' | 'zh' = 'id'
): Buffer {
  const isEn = locale === 'en' || locale === 'zh';

  // Page 1 Content Stream (Cover & Executive Overview)
  const p1: string[] = [];
  // Dark background
  p1.push('0.055 0.055 0.067 rg');
  p1.push('0 0 595 842 re f');

  // Top Red Banner Bar
  p1.push('0.933 0.169 0.063 rg');
  p1.push('0 826 595 16 re f');

  // Left Accent Line
  p1.push('0.933 0.169 0.063 rg');
  p1.push('48 560 4 195 re f');

  // Badge Box
  p1.push('0.933 0.169 0.063 rg');
  p1.push('64 732 155 22 re f');
  p1.push('BT /F2 9 Tf 1 1 1 rg 74 740 Td (2026 EDITION  |  OFFICIAL DECK) Tj ET');

  // Main Cover Title
  p1.push('BT /F2 30 Tf 1 1 1 rg 64 685 Td (KODEIN) Tj ET');
  p1.push(
    `BT /F2 22 Tf 1 1 1 rg 64 654 Td (${escapePdfText(
      isEn
        ? 'Software House & Web Engineering Studio'
        : 'Studio Pembuatan Website, Aplikasi & Sistem Kustom'
    )}) Tj ET`
  );
  p1.push(
    `BT /F1 12 Tf 0.75 0.75 0.78 rg 64 628 Td (${escapePdfText(
      isEn
        ? 'Company Profile, Technical Capabilities, Security Architecture & Engagement Guide'
        : 'Profil Studio, Kapabilitas Teknis, Standar Keamanan Enterprise & Panduan Kerja Sama'
    )}) Tj ET`
  );

  // Executive Summary Card
  p1.push('0.11 0.11 0.13 rg');
  p1.push('48 415 499 130 re f');
  p1.push('0.933 0.169 0.063 RG 1 w');
  p1.push('48 415 499 130 re S');

  p1.push(
    `BT /F2 11 Tf 0.933 0.169 0.063 rg 68 520 Td (${escapePdfText(
      isEn ? '01  |  EXECUTIVE SUMMARY' : '01  |  RINGKASAN EKSEKUTIF STUDIO KODEIN'
    )}) Tj ET`
  );

  const statementText = isEn ? cms.aboutStatement.en : cms.aboutStatement.id;
  const suppText = isEn ? cms.aboutSupporting.en : cms.aboutSupporting.id;
  const summaryLines = [
    ...wrapLines(statementText, 78),
    ...wrapLines(suppText, 78),
  ].slice(0, 6);

  summaryLines.forEach((line, i) => {
    p1.push(
      `BT /F1 10.5 Tf 0.92 0.92 0.94 rg 68 ${496 - i * 15} Td (${escapePdfText(line)}) Tj ET`
    );
  });

  // Key Highlights Grid on Page 1 (6 Stats from CMS)
  p1.push(
    `BT /F2 11 Tf 0.933 0.169 0.063 rg 48 380 Td (${escapePdfText(
      isEn
        ? '02  |  VERIFIED STUDIO TRACK RECORD & PRODUCTION METRICS'
        : '02  |  REKAM JEJAK & ANGKA CAPAIAN PRODUKSI KODEIN'
    )}) Tj ET`
  );

  cms.stats.slice(0, 6).forEach((st, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 48 + col * 256;
    const y = 295 - row * 78;

    p1.push('0.10 0.10 0.12 rg');
    p1.push(`${x} ${y} 242 66 re f`);
    p1.push('0.22 0.22 0.25 RG 0.75 w');
    p1.push(`${x} ${y} 242 66 re S`);

    const rawSuffix = st.suffix || '';
    const localizedSuffix =
      isEn && rawSuffix.trim().toLowerCase() === 'hari' ? ' Days' : rawSuffix;
    const valStr = `${st.prefix || ''}${st.value}${localizedSuffix}`;
    const labelStr = isEn ? st.label.en : st.label.id;
    const descLines = wrapLines(isEn ? st.description.en : st.description.id, 42);

    p1.push(`BT /F2 16 Tf 0.933 0.169 0.063 rg ${x + 14} ${y + 43} Td (${escapePdfText(valStr)}) Tj ET`);
    p1.push(`BT /F2 9.5 Tf 1 1 1 rg ${x + 88} ${y + 45} Td (${escapePdfText(labelStr.slice(0, 26))}) Tj ET`);
    if (descLines[0]) {
      p1.push(
        `BT /F1 8.5 Tf 0.72 0.72 0.76 rg ${x + 14} ${y + 24} Td (${escapePdfText(descLines[0])}) Tj ET`
      );
    }
    if (descLines[1]) {
      p1.push(
        `BT /F1 8.5 Tf 0.72 0.72 0.76 rg ${x + 14} ${y + 12} Td (${escapePdfText(descLines[1])}) Tj ET`
      );
    }
  });

  // Footer Page 1
  p1.push('0.22 0.22 0.25 RG 0.75 w 48 68 499 0 re S');
  p1.push(
    `BT /F2 9 Tf 1 1 1 rg 48 48 Td (${escapePdfText(
      `KODEIN STUDIO  |  ${cms.email}  |  ${cms.phone}`
    )}) Tj ET`
  );
  p1.push(
    `BT /F1 8.5 Tf 0.65 0.65 0.70 rg 48 34 Td (${escapePdfText(cms.address)}) Tj ET`
  );
  p1.push('BT /F2 9 Tf 0.933 0.169 0.063 rg 505 48 Td (PAGE 01 / 02) Tj ET');

  // Page 2 Content Stream (3 Service Divisions, Enterprise Security & Engagement Models)
  const p2: string[] = [];
  p2.push('0.055 0.055 0.067 rg');
  p2.push('0 0 595 842 re f');
  p2.push('0.933 0.169 0.063 rg');
  p2.push('0 826 595 16 re f');

  p2.push(
    `BT /F2 16 Tf 1 1 1 rg 48 785 Td (${escapePdfText(
      isEn
        ? '03  |  CORE ENGINEERING SERVICES & TECH STACK'
        : '03  |  TIGA PILAR LAYANAN UTAMA & TEKNOLOGI KODEIN'
    )}) Tj ET`
  );

  const pillars = isEn
    ? [
        {
          code: 'UNIT 01  |  WEB & MOBILE APPS',
          title: 'Websites, SaaS Platforms & Mobile Applications (iOS / Android)',
          stack: 'Tech Stack: Next.js, React, TypeScript, Tailwind CSS, Flutter, React Native, Node.js',
          desc: 'High-conversion corporate websites, e-commerce platforms, custom SaaS web portals, and cross-platform Android & iOS mobile apps engineered for speed and SEO.',
        },
        {
          code: 'UNIT 02  |  CUSTOM SYSTEMS & AI',
          title: 'Enterprise Operations Software (ERP / CRM), API & AI Automation',
          stack: 'Tech Stack: PostgreSQL, Python, Go, REST/GraphQL API, LLM/RAG AI Agents, Docker',
          desc: 'Tailored internal dashboards, inventory/HR/finance workflow automation, payment gateway & banking API integrations, and intelligent AI assistants.',
        },
        {
          code: 'UNIT 03  |  CLOUD & DEVSECOPS',
          title: 'Cloud Server Architecture, Hardening & Managed SLA Maintenance',
          stack: 'Tech Stack: AWS, Google Cloud, Linux VPS, Nginx, CI/CD Pipelines, Automated Backups',
          desc: 'Zero-downtime deployment, server hardening, daily encrypted backups, 24/7 uptime monitoring, and continuous security patching under guaranteed SLA.',
        },
      ]
    : [
        {
          code: 'UNIT 01  |  WEB & APLIKASI MOBILE',
          title: 'Pembuatan Website Perusahaan, Web App (SaaS) & Aplikasi Android/iOS',
          stack: 'Teknologi: Next.js, React, TypeScript, Tailwind CSS, Flutter, React Native, Node.js',
          desc: 'Website profil korporat cepat & SEO-friendly, platform e-commerce, portal web kustom, hingga aplikasi mobile Android & iOS dengan UI/UX modern.',
        },
        {
          code: 'UNIT 02  |  SISTEM KUSTOM & AI',
          title: 'Sistem Operasional Internal (ERP / CRM), Integrasi API & Otomasi AI',
          stack: 'Teknologi: PostgreSQL, Python, Go, REST/GraphQL API, Integrasi AI/LLM, Docker',
          desc: 'Sistem manajemen operasional kustom, dashboard analitik eksekutif, integrasi payment gateway/pengiriman, serta asisten cerdas berbasis AI.',
        },
        {
          code: 'UNIT 03  |  SERVER, CLOUD & MAINTENANCE',
          title: 'Manajemen Server Cloud, Keamanan Infrastruktur & Perawatan Rutin (SLA)',
          stack: 'Teknologi: AWS, Google Cloud, Linux VPS, Nginx, CI/CD Otomatis, Daily Backup',
          desc: 'Setup arsitektur server cloud stabil, optimasi kecepatan database, backup terenkripsi harian, pemantauan uptime 24/7, dan garansi perbaikan bug.',
        },
      ];

  pillars.forEach((pil, i) => {
    const y = 668 - i * 102;
    p2.push('0.10 0.10 0.12 rg');
    p2.push(`48 ${y} 499 90 re f`);
    p2.push('0.22 0.22 0.25 RG 0.75 w');
    p2.push(`48 ${y} 499 90 re S`);
    p2.push('0.933 0.169 0.063 rg');
    p2.push(`48 ${y} 4 90 re f`);

    p2.push(`BT /F2 8.5 Tf 0.933 0.169 0.063 rg 64 ${y + 72} Td (${escapePdfText(pil.code)}) Tj ET`);
    p2.push(`BT /F2 11.5 Tf 1 1 1 rg 64 ${y + 55} Td (${escapePdfText(pil.title)}) Tj ET`);
    p2.push(`BT /F2 8.5 Tf 0.80 0.80 0.85 rg 64 ${y + 40} Td (${escapePdfText(pil.stack)}) Tj ET`);

    const dLines = wrapLines(pil.desc, 82).slice(0, 2);
    dLines.forEach((dl, di) => {
      p2.push(
        `BT /F1 9 Tf 0.70 0.70 0.75 rg 64 ${y + 23 - di * 12} Td (${escapePdfText(dl)}) Tj ET`
      );
    });
  });

  // Section 04: Enterprise Security & Governance
  p2.push(
    `BT /F2 14 Tf 1 1 1 rg 48 430 Td (${escapePdfText(
      isEn
        ? '04  |  ENTERPRISE SECURITY STANDARDS (OWASP ASVS L2)'
        : '04  |  STANDAR KEAMANAN ENTERPRISE & JAMINAN HUKUM (NDA)'
    )}) Tj ET`
  );

  p2.push('0.10 0.10 0.12 rg 48 318 499 98 re f');
  p2.push('0.933 0.169 0.063 RG 0.75 w 48 318 499 98 re S');

  const secBullets = isEn
    ? [
        '* Active Edge WAF & OWASP Top 10 Protection (SQLi, XSS, CSRF, Path Traversal defense).',
        '* Strict HTTP Security Headers (CSP, HSTS 2-Year Preload, X-Frame-Options DENY, Zero-Privilege).',
        '* Zero-Trust Authentication (Timing-Safe SHA-256 + HMAC-SHA256 Signed HttpOnly Sessions).',
        '* Strict Non-Disclosure Agreement (NDA) & 100% Client Source Code IP Ownership Handover.',
      ]
    : [
        '* Proteksi Edge WAF Aktif & Standar OWASP ASVS L2 (Anti SQL Injection, XSS, CSRF, Path Traversal).',
        '* Hardened Security Headers (CSP Ketat, HSTS Preload, Anti-Clickjacking, Rate-Limiter Berlapis).',
        '* Autentikasi Zero-Trust (Timing-Safe SHA-256 + Token Sesi HMAC-SHA256 HttpOnly & SameSite=Strict).',
        '* Jaminan Kerahasiaan Data (NDA Resmi) & Serah Terima 100% Hak Kepemilikan Source Code.',
      ];

  secBullets.forEach((b, idx) => {
    p2.push(
      `BT /F1 9.5 Tf 0.88 0.88 0.92 rg 64 ${394 - idx * 19} Td (${escapePdfText(b)}) Tj ET`
    );
  });

  // Section 05: Engagement Models & Next Steps
  p2.push(
    `BT /F2 14 Tf 1 1 1 rg 48 286 Td (${escapePdfText(
      isEn
        ? '05  |  ENGAGEMENT MODELS & HOW TO START A PROJECT'
        : '05  |  MODEL KERJA SAMA & CARA MEMULAI PROYEK'
    )}) Tj ET`
  );

  const models = isEn
    ? [
        '1. FIXED-PRICE PROJECT: Ideal for websites, company profiles, or MVPs with clear specifications and milestone-based payments.',
        '2. DEDICATED ENGINEERING SQUAD: Monthly dedicated developers/designers integrated directly into your product roadmap.',
        '3. MANAGED SLA RETAINER: Ongoing server maintenance, security patching, daily backups, and priority bug fixes.',
      ]
    : [
        '1. FIXED-PRICE PROJECT: Cocok untuk pembuatan website, aplikasi, atau MVP dengan spesifikasi & jadwal rilis yang terukur.',
        '2. DEDICATED ENGINEERING SQUAD: Tim developer khusus bulanan yang fokus mengembangkan sistem bisnis Anda secara berkelanjutan.',
        '3. MANAGED SLA RETAINER: Paket perawatan rutin server, pembaruan keamanan, backup harian, dan dukungan teknis prioritas.',
      ];

  models.forEach((m, idx) => {
    p2.push(
      `BT /F1 9.5 Tf 0.82 0.82 0.86 rg 48 ${262 - idx * 18} Td (${escapePdfText(m)}) Tj ET`
    );
  });

  // Call to Action Box
  p2.push('0.933 0.169 0.063 rg 48 112 499 78 re f');
  p2.push(
    `BT /F2 13 Tf 1 1 1 rg 66 164 Td (${escapePdfText(
      isEn
        ? 'READY TO BUILD YOUR NEXT DIGITAL PRODUCT WITH KODEIN?'
        : 'SIAP MEMBANGUN WEBSITE ATAU SISTEM BERSAMA TIM KODEIN?'
    )}) Tj ET`
  );
  p2.push(
    `BT /F1 10 Tf 1 1 1 rg 66 144 Td (${escapePdfText(
      `Email: ${cms.email}   |   WhatsApp / Phone: ${cms.phone}`
    )}) Tj ET`
  );
  p2.push(
    `BT /F1 9.5 Tf 1 1 1 rg 66 126 Td (${escapePdfText(
      `Studio: ${cms.address}`
    )}) Tj ET`
  );

  // Footer Page 2
  p2.push('0.22 0.22 0.25 RG 0.75 w 48 68 499 0 re S');
  p2.push(
    `BT /F2 9 Tf 1 1 1 rg 48 48 Td (${escapePdfText(
      `KODEIN SOFTWARE & WEB CAPABILITIES DECK (2026 EDITION)`
    )}) Tj ET`
  );
  p2.push(
    `BT /F1 8.5 Tf 0.65 0.65 0.70 rg 48 34 Td (${escapePdfText(
      'Generated dynamically by Kodein Enterprise Document Engine  |  https://kodein.id'
    )}) Tj ET`
  );
  p2.push('BT /F2 9 Tf 0.933 0.169 0.063 rg 505 48 Td (PAGE 02 / 02) Tj ET');

  const stream1 = p1.join('\n');
  const stream2 = p2.join('\n');

  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R 5 0 R] /Count 2 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 7 0 R /F2 8 0 R >> >> /Contents 4 0 R >>\nendobj\n',
    `4 0 obj\n<< /Length ${Buffer.byteLength(stream1, 'utf8')} >>\nstream\n${stream1}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 7 0 R /F2 8 0 R >> >> /Contents 6 0 R >>\nendobj\n',
    `6 0 obj\n<< /Length ${Buffer.byteLength(stream2, 'utf8')} >>\nstream\n${stream2}\nendstream\nendobj\n`,
    '7 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '8 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];

  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += obj;
  }

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, 'utf8');
}
