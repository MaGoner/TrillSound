import React from 'react';
import { Footer } from '../../layouts/Footer';
import { BottomSlider } from '../../layouts/BottomSlider';
import { Header } from '../../layouts/Header';
import { MobileHeader } from '../../layouts/MobileHeader';
import { TopSlider } from '../../layouts/TopSlider';
import { RapBody } from '../../layouts/genres layout/Rap';

export const RapPage = () => {
  return (
    <div>
      <Header />
      <MobileHeader />
      <main>
        <TopSlider />
        <RapBody />
        <BottomSlider />
      </main>
      <div className='body-container mobile-only'></div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
