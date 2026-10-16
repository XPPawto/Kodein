import React from 'react';
import { Mail, Phone, Handshake } from 'lucide-react';
import { ReportsSection } from '@/components/home/ReportsSection';
import { DESIGN_TOKENS } from '@/lib/tokens';
import { Locale } from '@/i18n';

export default function InvestorRelationsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const isId = locale === 'id';
  const isZh = locale === 'zh';

  return (
    <div className="bg-brand-dark pt-32 text-white">
      <section className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20 py-16">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          {isId
            ? 'Kemitraan & Klien Kodein'
            : isZh
            ? 'Kodein 合作模式与战略伙伴'
            : 'Kodein Client & Strategic Partnerships'}
        </span>
        <h1 className="mt-4 max-w-4xl text-fluid-h1 font-bold">
          {isId
            ? 'Kolaborasi Pengembangan Produk Digital & Kemitraan Teknologi Jangka Panjang'
            : isZh
            ? '数字化产品联合开发与长期技术合作伙伴关系'
            : 'Digital Product Development & Long-Term Technology Partnerships'}
        </h1>
      </section>

      <ReportsSection />

      <section className="mx-auto max-w-container px-6 sm:px-10 lg:px-16 xl:px-20 py-20 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-8">
          <Handshake className="h-7 w-7 text-brand-red" />
          <h2 className="mt-4 text-2xl font-bold">
            {isId
              ? 'Model Kerja Sama Fleksibel'
              : isZh
              ? '灵活的项目合作与交付模式'
              : 'Flexible Engagement Models'}
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            {isId
              ? 'Kami menyediakan skema Fixed-Price Project untuk pembuatan website/aplikasi dengan ruang lingkup jelas, maupun Dedicated Engineering Team (Retainer) untuk pengembangan berkelanjutan.'
              : isZh
              ? '我们提供针对需求明确的固定总价项目制（Fixed-Price Project），以及支持业务持续迭代的专属研发团队包月制（Dedicated Engineering Retainer）。'
              : 'We offer Fixed-Price Project engagements for well-defined website/software builds, as well as Dedicated Engineering Teams (Retainer) for continuous product evolution.'}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-brand-charcoal p-8">
          <h2 className="text-2xl font-bold">
            {isId
              ? 'Kontak Kemitraan & Bisnis'
              : isZh
              ? '商务与合作伙伴联系通道'
              : 'Partnership & Business Contact'}
          </h2>
          <div className="mt-6 space-y-3 text-sm text-zinc-300">
            <p className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-brand-red" />
              <span>{DESIGN_TOKENS.brand.irEmail}</span>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-brand-red" />
              <span>{DESIGN_TOKENS.brand.phone}</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
