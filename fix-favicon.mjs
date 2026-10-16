import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
fs.mkdirSync(publicDir, { recursive: true });

// 1. Hapus favicon.svg agar tidak meng-override favicon.ico di browser
const svgFaviconPath = path.join(publicDir, 'favicon.svg');
if (fs.existsSync(svgFaviconPath)) {
  fs.unlinkSync(svgFaviconPath);
  console.log('✓ Removed public/favicon.svg');
}

// 2. Gunakan file favicon_2.ico / favicon.ico jika sudah ditaruh di folder,
//    atau buat binary favicon.ico (32x32 anti-aliased) yang identik dengan gambar favicon_2.ico
const targetIcoPath = path.join(publicDir, 'favicon.ico');
const userCandidates = [
  path.join(rootDir, 'favicon_2.ico'),
  path.join(rootDir, 'favicon.ico'),
  path.join(publicDir, 'favicon_2.ico'),
];

let copiedFromUser = false;
for (const candidate of userCandidates) {
  if (fs.existsSync(candidate)) {
    fs.copyFileSync(candidate, targetIcoPath);
    console.log(`✓ Copied ${path.basename(candidate)} -> public/favicon.ico`);
    copiedFromUser = true;
    break;
  }
}

if (!copiedFromUser && !fs.existsSync(targetIcoPath)) {
  // Buat binary .ICO 32x32 32-bit BGRA dengan 4x4 supersampling anti-aliasing sesuai favicon_2.ico
  const size = 32;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: 1 = ICO
  header.writeUInt16LE(1, 4); // Image count: 1

  const pixelDataSize = size * size * 4;
  const maskDataSize = (size * size) / 8;
  const bmpSize = 40 + pixelDataSize + maskDataSize;

  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(size, 0);
  dirEntry.writeUInt8(size, 1);
  dirEntry.writeUInt8(0, 2);
  dirEntry.writeUInt8(0, 3);
  dirEntry.writeUInt16LE(1, 4); // Color planes
  dirEntry.writeUInt16LE(32, 6); // Bits per pixel
  dirEntry.writeUInt32LE(bmpSize, 8);
  dirEntry.writeUInt32LE(22, 12); // Offset (6 + 16)

  const bih = Buffer.alloc(40);
  bih.writeUInt32LE(40, 0);
  bih.writeInt32LE(size, 4);
  bih.writeInt32LE(size * 2, 8); // Height * 2 (XOR + AND mask)
  bih.writeUInt16LE(1, 12);
  bih.writeUInt16LE(32, 14);
  bih.writeUInt32LE(0, 16);
  bih.writeUInt32LE(pixelDataSize + maskDataSize, 20);

  // Fungsi jarak kapsul (rounded segment) untuk 6 bilah Kodein
  function distToSegment(px, py, ax, ay, bx, by) {
    const vx = bx - ax;
    const vy = by - ay;
    const wx = px - ax;
    const wy = py - ay;
    const c1 = vx * wx + vy * wy;
    if (c1 <= 0) return Math.hypot(px - ax, py - ay);
    const c2 = vx * vx + vy * vy;
    if (c2 <= c1) return Math.hypot(px - bx, py - by);
    const b = c1 / c2;
    return Math.hypot(px - (ax + b * vx), py - (ay + b * vy));
  }

  function isInsidePinwheel(nx, ny) {
    // nx, ny dalam koordinat [-1, 1]
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const rx = nx * cos - ny * sin;
      const ry = nx * sin + ny * cos;
      // Posisi kapsul sesuai proporsi penuh favicon_2.ico
      const d = distToSegment(rx, ry, -0.34, -0.18, -0.38, -0.74);
      if (d <= 0.175) return true;
    }
    return false;
  }

  const pixels = Buffer.alloc(pixelDataSize);
  const subSamples = 4;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let hits = 0;
      for (let sy = 0; sy < subSamples; sy++) {
        for (let sx = 0; sx < subSamples; sx++) {
          const px = ((x + (sx + 0.5) / subSamples) / size) * 2 - 1;
          const py = ((y + (sy + 0.5) / subSamples) / size) * 2 - 1;
          if (isInsidePinwheel(px, py)) hits++;
        }
      }
      const alpha = Math.round((hits / (subSamples * subSamples)) * 255);
      // BMP disimpan terbalik secara vertikal (bottom-up)
      const bmpRow = size - 1 - y;
      const idx = (bmpRow * size + x) * 4;
      pixels[idx + 0] = 0x10; // Blue (#EE2B10)
      pixels[idx + 1] = 0x2b; // Green
      pixels[idx + 2] = 0xee; // Red
      pixels[idx + 3] = alpha; // Alpha
    }
  }

  const mask = Buffer.alloc(maskDataSize, 0);
  const icoBuffer = Buffer.concat([header, dirEntry, bih, pixels, mask]);
  fs.writeFileSync(targetIcoPath, icoBuffer);
  console.log('✓ Generated public/favicon.ico matching favicon_2.ico');
}

// 3. Perbarui src/app/[locale]/layout.tsx agar hanya menggunakan /favicon.ico
const layoutPath = path.join(rootDir, 'src/app/[locale]/layout.tsx');
const updatedLayout = `import React from 'react';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { BackToTop } from '@/components/layout/BackToTop';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { Locale } from '@/i18n';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const isId = locale === 'id';
  const title = isId
    ? \`\${DESIGN_TOKENS.brand.name} — Jasa Pembuatan Website & Software Engineering\`
    : \`\${DESIGN_TOKENS.brand.name} — Web Development & Custom Software Engineering\`;
  const description = isId
    ? 'Kodein adalah perusahaan pembuatan website, pengembangan software kustom, aplikasi mobile, AI, dan cloud infrastructure berkinerja tinggi.'
    : 'Kodein is a premier web development, custom software engineering, mobile app, AI, and cloud infrastructure company.';

  return {
    metadataBase: new URL(DESIGN_TOKENS.brand.domain),
    title: {
      default: title,
      template: \`%s | \${DESIGN_TOKENS.brand.name}\`,
    },
    description,
    icons: {
      icon: '/favicon.ico?v=2',
      shortcut: '/favicon.ico?v=2',
      apple: '/favicon.ico?v=2',
    },
    alternates: {
      canonical: \`/\${locale}\`,
      languages: {
        id: '/id',
        en: '/en',
      },
    },
    openGraph: {
      title,
      description,
      url: \`\${DESIGN_TOKENS.brand.domain}/\${locale}\`,
      siteName: DESIGN_TOKENS.brand.name,
      locale: isId ? 'id_ID' : 'en_US',
      type: 'website',
      images: [{ url: '/assets/brand/kodein-profile-dark.svg', width: 640, height: 640 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const messages = await getMessages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: DESIGN_TOKENS.brand.name,
    legalName: DESIGN_TOKENS.brand.legalName,
    url: DESIGN_TOKENS.brand.domain,
    logo: \`\${DESIGN_TOKENS.brand.domain}/assets/brand/kodein-logo-horizontal.svg\`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: DESIGN_TOKENS.brand.address,
      addressCountry: 'ID',
    },
  };

  return (
    <html lang={locale} className={jakarta.variable}>
      <body className="min-h-screen flex flex-col bg-brand-dark font-sans text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieBanner />
          <BackToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
`;

fs.writeFileSync(layoutPath, updatedLayout, 'utf8');
console.log('✓ Updated src/app/[locale]/layout.tsx to use /favicon.ico exclusively');
console.log('\n✅ Selesai! Silakan hard-refresh browser Anda (Ctrl + Shift + R).');