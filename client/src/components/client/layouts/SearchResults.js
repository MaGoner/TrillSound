import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export const SearchResults = ({ searchResults, searchQuery, src }) => {
  useEffect(() => {
    document.querySelector('html').scrollTop = 0;
  }, []);

  const searchResultsElement = searchResults.map((searchResult, index) => {
    if (!searchResult) return;
    return (
      <li className='song-container' key={index}>
        <div className='post-thumbnail'>
          <img
            src={searchResult.thumbnail}
            alt={`${
              src === 'artists' ? searchResult.name : searchResult.title
            } img`}
            className='img'
          ></img>
        </div>
        <div className='song-title'>
          <h3>
            <br />
            <a
              href={
                src === 'artists'
                  ? `/artist/?artist-id=${searchResult.id}`
                  : `/song?song_id=${searchResult.id}&artist=${searchResult.artist}`
              }
            >
              {src === 'artists' ? searchResult.name : searchResult.title}
            </a>
          </h3>
          <br />
        </div>
      </li>
    );
  });

  return (
    <>
      <Helmet>
        <title>Search results for "{searchQuery}"</title>
      </Helmet>
      <h2 className='page-title'>Search results for "{searchQuery}"</h2>
      {searchResults[0] ? (
        <ul className='songs-container'>{searchResultsElement}</ul>
      ) : (
        <p
          style={{
            marginTop: '20px',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          Nothing found on this subject. You can try searching something else.
        </p>
      )}
    </>
  );
};
