'use client';

import Stack from '@mui/material/Stack';

import { BackToTop } from 'src/components/animate/back-to-top';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { HomeHeroBottles } from '../home-hero-bottles';
import { HomeFAQs } from '../home-faqs';
import { HomeZoneUI } from '../home-zone-ui';
import { HomeMinimal } from '../home-minimal';
import { HomePricing } from '../home-pricing';
import { HomeForDesigner } from '../home-for-designer';
import { HomeTestimonials } from '../home-testimonials';
import { HomeIntegrations } from '../home-integrations';
import { HomeAdvertisement } from '../home-advertisement';
import { HomeHugePackElements } from '../home-hugepack-elements';
import { HomeHighlightFeatures } from '../home-highlight-features';

// ----------------------------------------------------------------------

export function HomeViewBottles() {
  const pageProgress = useScrollProgress();

  return (
    <>
      <ScrollProgress
        variant="lineart"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />

      <BackToTop />

      <HomeHeroBottles />

      <Stack sx={{ position: 'relative', bgcolor: 'background.default' }}>
        <HomeHighlightFeatures />

        <HomeMinimal />

{/*
        <HomeHugePackElements />
*/}

{/*
        <HomeForDesigner />
*/}


{/*
        <HomeIntegrations />
*/}

{/*
        <HomePricing />
*/}

        <HomeTestimonials />

        <HomeFAQs />

{/*
        <HomeZoneUI />
*/}

{/*
        <HomeAdvertisement />
*/}
      </Stack>
    </>
  );
}
