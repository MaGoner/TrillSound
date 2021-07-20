import React from 'react';
import { BottomSlider } from '../layouts/BottomSlider';
import { Footer } from '../layouts/Footer';
import { Header } from '../layouts/Header';
import { MainBody } from '../layouts/homepage layouts/MainBody';
import { MobileHeader } from '../layouts/MobileHeader';
import { TopSlider } from '../layouts/TopSlider';

export const HomePage = () => {
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
