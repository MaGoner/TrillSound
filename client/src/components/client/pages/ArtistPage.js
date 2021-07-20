import React from 'react';
import { MainBody } from '../layouts/artistpage layout/MainBody';
import { BottomSlider } from '../layouts/BottomSlider';
import { Footer } from '../layouts/Footer';
import { Header } from '../layouts/Header';
import { MobileHeader } from '../layouts/MobileHeader';
import { TopSlider } from '../layouts/TopSlider';

export const ArtistPage = () => {
  return (
    // to load artists in this page, only load their data and replace in each components here. in other words, no need for individual pages for individual artists
    <div>
      <Header />
      <MobileHeader />
      <main>
        <TopSlider />
        <MainBody />
        <BottomSlider />
      </main>
      <div className='body-container mobile-only'></div>
      <Footer />
    </div>
  );
};
