import React from 'react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { SectionNavigator } from '@/components/home/SectionNavigator';
import { AboutIntro } from '@/components/home/AboutIntro';
import { ScopeOfWork } from '@/components/home/ScopeOfWork';
import { StatisticsSection } from '@/components/home/StatisticsSection';
import { ReportsSection } from '@/components/home/ReportsSection';
import { JourneyTimeline } from '@/components/home/JourneyTimeline';
import { LeadershipQuote } from '@/components/home/LeadershipQuote';

export default function HomePage() {
  return (
    <>
      <SectionNavigator />
      <div id="section-hero">
        <HeroCarousel />
      </div>
      <div id="section-about" className="scroll-mt-20">
        <AboutIntro />
      </div>
      <div id="section-services" className="scroll-mt-20">
        <ScopeOfWork />
      </div>
      <div id="section-stats" className="scroll-mt-20">
        <StatisticsSection />
      </div>
      <div id="section-deck" className="scroll-mt-20">
        <ReportsSection />
      </div>
      <div id="section-journey" className="scroll-mt-20">
        <JourneyTimeline />
      </div>
      <div id="section-vision" className="scroll-mt-20">
        <LeadershipQuote />
      </div>
    </>
  );
}
