import React, { useState, useContext } from 'react';
import { SideNav } from './SideNav';
import { GlobalContext } from '../../../context/global state/GlobalState';
import { useLocation } from 'react-router-dom';

export const MobileHeader = () => {
  const { searchForQuery } = useContext(GlobalContext);
  const location = useLocation();

  const [searchValue, setSearchValue] = useState('');

  // toggle search bar
  const toggleSearchBar = () => {
    document.querySelector('.search-input.mobile').classList.toggle('display');
    document.getElementById('search-mob').focus();
  };

  const searchQuery = (e) => {
    e.preventDefault();

    if (
      location.pathname === '/artists' ||
      location.pathname === '/artists/alph' ||
      location.pathname === '/artists/new-uploads'
    ) {
      searchForQuery(searchValue, 'artist');
    } else {
      searchForQuery(searchValue, 'other');
    }
  };

  // toggle hamburger
  const toggleHamburger = () => {
    document.querySelector('.hamburger').classList.toggle('animate');
    document.querySelector('.sidenav-container').classList.toggle('open');
    const bodyContainer = document.querySelector('.body-container');
    if (
      document.querySelector('.sidenav-container').classList.contains('open')
    ) {
      bodyContainer.classList.add('active');
      bodyContainer.addEventListener('click', () => {
        bodyContainer.classList.remove('active');
        document.querySelector('.sidenav-container').classList.remove('open');
        document.querySelector('.hamburger').classList.remove('animate');
      });
    } else {
      bodyContainer.classList.remove('active');
    }
  };
  return (
    <header className='mobile-only'>
      <div className='mobile-header-container'>
        <div className='search'>
          <i className='fas fa-search' onClick={toggleSearchBar}></i>
          <div className='search-input mobile'>
            <form onSubmit={searchQuery}>
              <input
                type='search'
                name='search'
                placeholder='Search and click enter'
                id='search-mob'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>
          </div>
        </div>
        <h1 className='title'>TrillSound.com♬</h1>
        <div className='hamburger' onClick={toggleHamburger}>
          <div>
            <div className='line'></div>
            <div className='line'></div>
            <div className='line'></div>
          </div>
        </div>
      </div>
      <nav>
        <SideNav />
      </nav>
    </header>
  );
};
