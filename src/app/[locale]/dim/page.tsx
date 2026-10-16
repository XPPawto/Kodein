import React from 'react';
import { ENTITY_DETAILS } from '@/content/siteData';
import { EntityLandingView } from '@/components/entities/EntityLandingView';
import { Locale } from '@/i18n';

export default function DimPage({ params: { locale } }: { params: { locale: Locale } }) {
  return <EntityLandingView data={ENTITY_DETAILS.dim} locale={locale} />;
}
