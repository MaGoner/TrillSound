import React from 'react';
import { Footer } from '../layouts/Footer';
import { Header } from '../layouts/Header';
import { MobileHeader } from '../layouts/MobileHeader';
import { MainBody } from '../layouts/songpage layout/MainBody';
import { TopSlider } from '../layouts/TopSlider';
import { BottomSlider } from '../layouts/BottomSlider';

export const SongPage = () => {
  return (
    <div>
      <Header />
      <MobileHeader />
      <main>
        <TopSlider />
        <MainBody />
        <BottomSlider />
      </main>
      <div className='body-container mobile-only'></div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
