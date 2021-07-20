import React, { useState, useEffect } from 'react';

export const SideNav = () => {
  // eslint-disable-next-line
  const [isAds, setIsAds] = useState(true);

  useEffect(() => {
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach((accordion) => {
      accordion.addEventListener('click', (e) => {
        e.target.parentElement.nextElementSibling.classList.toggle('open');
        e.target.lastChild.classList.toggle('rotate');
        e.target.classList.toggle('active');
      });
    });
  }, []);
  return (
    <div className='sidenav-container'>
      <a href='/ads'>
        <div className='ads'>
          {!isAds && <p>Advertise here</p>}
          {isAds && <img src={require('../../../imgs/logo.png')} alt='ads' />}
        </div>
      </a>
      <ul>
        <li className='contains-accordion'>
          <div className='accordion'>
            <p>
              Home
              <i className='fas fa-chevron-right'></i>
            </p>
          </div>
          <div className='accordion-content'>
            <ul>
              <li>
                <a href='/'>Trending</a>
              </li>
              <li>
                <a href='/alph'>Alphabetical Order</a>
              </li>
              <li>
                <a href='/new-uploads'>Recently Uploaded</a>
              </li>
            </ul>
          </div>
        </li>
        <li className='contains-accordion'>
          <div className='accordion'>
            <p>
              Artists
              <i className='fas fa-chevron-right'></i>
            </p>
          </div>
          <div className='accordion-content'>
            <ul>
              <li>
                <a href='/artists/'>Trending</a>
              </li>
              <li>
                <a href='/artists/alph'>Alphabetical Order</a>
              </li>
              <li>
                <a href='/artists/new-uploads'>Recently Uploaded</a>
              </li>
            </ul>
          </div>
        </li>
        <li className='contains-accordion'>
          <div className='accordion'>
            <p>
              Genres
              <i className='fas fa-chevron-right'></i>
            </p>
          </div>
          <div className='accordion-content'>
            <ul>
              <li>
                <a href='/genre/worship'>Worship</a>
              </li>
              <li>
                <a href='/genre/praise'>Praise</a>
              </li>
              <li>
                <a href='/genre/rap'>Rap</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};
