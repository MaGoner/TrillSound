import React, { useContext, useEffect } from 'react';
import { SideBar } from '../SideBar';
import { GlobalContext } from '../../../../context/global state/GlobalState';
import { SearchResults } from '../SearchResults';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { MobileHeader } from '../MobileHeader';
import { TopSlider } from '../TopSlider';
import { BottomSlider } from '../BottomSlider';
import { Helmet } from 'react-helmet-async';

export const ArtistAlphOrder = () => {
  const {
    artists,
    searchResults,
    searchQuery,
    currentPaginationIndex,
    newTotalPaginationIndex,
    goToNextPage,
    goToPrevPage,
    sortArtistAlphabetically,
    artistTitles,
  } = useContext(GlobalContext);

  useEffect(() => {
    artists && sortArtistAlphabetically();
    // eslint-disable-next-line
  }, [artists]);

  let sortArtistIndex;
  if (artistTitles.length >= 1) {
    artistTitles.sort();
    sortArtistIndex = artistTitles.map((artistTitle) => {
      return +artistTitle.substr(artistTitle.indexOf('.') + 1);
    });
  } else {
    sortArtistIndex = artists.map((x, index) => {
      return index;
    });
  }

  // filter out 16 artists for each page
  const newArtistsIndex = sortArtistIndex.filter((x, index) => {
    return (
      index + 1 <= newTotalPaginationIndex && index + 1 > currentPaginationIndex
    );
  });

  const artistElements = newArtistsIndex.map((artistIndex) => {
    const { thumbnail, id, name } = artists[artistIndex];
    return (
      <li key={id} className='song-container'>
        <div className='post-thumbnail'>
          <img src={thumbnail} alt={`${name} biography`} className='img'></img>
        </div>
        <div className='song-title'>
          <h3 style={{ fontWeight: '600' }}>
            <a href={`/artist/?artist-id=${id}`}>{name}</a>
          </h3>
        </div>
        <div className='song-info'>
          <div className='play-song'>
            <a href='/link'>
              <i className='fab fa-instagram' style={{ fontSize: '25px' }}></i>
            </a>
          </div>
          <div className='download-song'>
            <a href='/link'>
              <i className='fab fa-facebook' style={{ fontSize: '25px' }}></i>
            </a>
          </div>
        </div>
      </li>
    );
  });

  const prevPage = () => {
    if (currentPaginationIndex > 0) {
      goToPrevPage(currentPaginationIndex);
    } else {
      return;
    }
  };

  const nextPage = () => {
    if (newTotalPaginationIndex < artists.length) {
      goToNextPage(newTotalPaginationIndex);
    } else {
      return;
    }
  };

  return (
    <div>
      <Helmet>
        <title>Loveworld Artists in Alphabetical Order - TrillSound</title>
      </Helmet>
      <Header />
      <MobileHeader />
      <main>
        <TopSlider />
        <div className='main-container'>
          <div className='left-side songs'>
            {searchResults.length >= 1 ? (
              <SearchResults
                searchResults={searchResults}
                searchQuery={searchQuery}
                src='artists'
              />
            ) : (
              <>
                <h3 className='page-title'>All Artists - Alphabetical Order</h3>
                <div className='pagination top'>
                  <div className='pagination-s'>
                    <ul>
                      <li onClick={prevPage}>
                        <span className='prev-page'>❮ Previous</span>
                      </li>
                      <li onClick={nextPage}>
                        <span className='next-page'>Next ❯</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <ul className='songs-container'>{artistElements}</ul>
                <div className='pagination'>
                  <div className='pagination-s'>
                    <ul>
                      <li onClick={prevPage}>
                        <span className='prev-page'>❮ Previous</span>
                      </li>
                      <li onClick={nextPage}>
                        <span className='next-page'>Next ❯</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className='right-side sidebar-container'>
            <SideBar />
          </div>
        </div>
        <BottomSlider />
      </main>
      <div className='body-container mobile-only'></div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
