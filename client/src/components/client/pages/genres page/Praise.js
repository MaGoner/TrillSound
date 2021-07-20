import React from 'react';
import { PraiseBody } from '../../layouts/genres layout/Praise';
import { Footer } from '../../layouts/Footer';
import { BottomSlider } from '../../layouts/BottomSlider';
import { Header } from '../../layouts/Header';
import { MobileHeader } from '../../layouts/MobileHeader';
import { TopSlider } from '../../layouts/TopSlider';

export const PraisePage = () => {
  return (
    <div>
      <Header />
      <MobileHeader />
      <main>
        <TopSlider />
        <PraiseBody />
        <BottomSlider />
      </main>
      <div className='body-container mobile-only'></div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
