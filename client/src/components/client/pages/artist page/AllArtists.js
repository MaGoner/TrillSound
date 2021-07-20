import React from 'react';
import { MainBody } from '../../layouts/allartist layout/MainBody';
import { BottomSlider } from '../../layouts/BottomSlider';
import { TopSlider } from '../../layouts/TopSlider';
import { Header } from '../../layouts/Header';
import { MobileHeader } from '../../layouts/MobileHeader';
import { Footer } from '../../layouts/Footer';

export const AllArtists = () => {
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
