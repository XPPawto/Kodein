import React from 'react';
import { Link } from '@/navigation';

export default function LocaleNotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">404</span>
      <h1 className="mt-4 text-3xl md:text-5xl font-bold text-white">
        Halaman Tidak Ditemukan
      </h1>
      <Link
        href="/"
        className="mt-8 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white"
      >
        Kembali ke Beranda Kodein
      </Link>
    </div>
  );
}
