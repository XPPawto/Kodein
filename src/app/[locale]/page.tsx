import React from 'react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { AboutIntro } from '@/components/home/AboutIntro';
import { ScopeOfWork } from '@/components/home/ScopeOfWork';
import { StatisticsSection } from '@/components/home/StatisticsSection';
import { ReportsSection } from '@/components/home/ReportsSection';
import { JourneyTimeline } from '@/components/home/JourneyTimeline';
import { LeadershipQuote } from '@/components/home/LeadershipQuote';

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <AboutIntro />
      <ScopeOfWork />
      <StatisticsSection />
      <ReportsSection />
      <JourneyTimeline />
      <LeadershipQuote />
    </>
  );
}
