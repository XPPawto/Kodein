import React from 'react';
import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col items-center justify-center bg-brand-dark px-6 text-center text-white">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">404</span>
        <h1 className="mt-3 text-4xl font-bold">Halaman Tidak Ditemukan / Page Not Found</h1>
        <p className="mt-3 max-w-md text-sm text-zinc-400">
          Maaf, halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          href="/id"
          className="mt-8 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white"
        >
          Kembali ke Beranda Kodein
        </Link>
      </body>
    </html>
  );
}
