import React, { useState, useContext, useEffect } from 'react';
import { SideBar } from '../SideBar';
import { GlobalContext } from '../../../../context/global state/GlobalState';
import { SortMenu } from '../SortMenu';
import { SearchResults } from '../SearchResults';
import { Helmet } from 'react-helmet-async';

export const RapBody = () => {
  const {
    rapSongs,
    updateStreams,
    updateDownloads,
    currentPaginationIndex,
    newTotalPaginationIndex,
    goToNextPage,
    goToPrevPage,
    getRapSongs,
    searchResults,
    searchQuery,
    songs,
  } = useContext(GlobalContext);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    songs && getRapSongs();
    // eslint-disable-next-line
  }, [songs]);

  // filter only 16 songs for the each page
  const newSongs = rapSongs.filter((song, index) => {
    return (
      index + 1 <= newTotalPaginationIndex && index + 1 > currentPaginationIndex
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
    if (newTotalPaginationIndex < rapSongs.length) {
      goToNextPage(newTotalPaginationIndex);
    } else {
      return;
    }
  };

  const toggleSongControl = (e, src) => {
    const audio = e.target.previousElementSibling;
    const icon = e.target;

    audio.src = src;

    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
      icon.classList.remove('fa-play');
      icon.classList.add('fa-spinner');
    } else {
      audio.pause();
      setIsPlaying(false);
      icon.classList.add('fa-play');
      icon.classList.remove('fa-pause');
      icon.classList.remove('fa-spinner');
      undoDisabledBtns();
    }
  };

  const disableOtherBtns = (id) => {
    const allIcons = document.querySelectorAll('.song-control');

    allIcons.forEach((icon) => {
      if (icon.id !== id) {
        icon.classList.add('disabled');
      }
    });
  };

  const undoDisabledBtns = () => {
    const allIcons = document.querySelectorAll('.song-control');

    allIcons.forEach((icon) => {
      icon.classList.remove('disabled');
    });
  };

  const songPlaying = (e) => {
    const icon = e.target.nextElementSibling;

    icon.classList.remove('fa-spinner');
    icon.classList.add('fa-pause');
    icon.classList.remove('fa-play');
    disableOtherBtns(e.target.id);
  };

  const songElements = newSongs.map((song, index) => {
    const { title, artist, id, thumbnail, downloadLink } = song;
    return (
      <li key={id} className='song-container'>
        <div className='post-thumbnail'>
          <img src={thumbnail} alt='ada img' className='img'></img>
        </div>
        <div className='song-title'>
          <h3>
            <a href={`/song?song_id=${id}&artist=${artist}`}>
              {title} - {artist}
            </a>
          </h3>
        </div>
        <div className='song-info'>
          <div
            className='play-song'
            onClick={() => {
              updateStreams(id);
            }}
          >
            <audio
              controls={false}
              title='Listen Online'
              onPlaying={songPlaying}
              id={id}
            >
              <source src={downloadLink} />
            </audio>
            <i
              className='fas fa-play song-control'
              id={id}
              onClick={(e) => toggleSongControl(e, downloadLink)}
            ></i>
          </div>
          <div className='download-song' onClick={() => updateDownloads(id)}>
            <a href={downloadLink} target='_blank' rel='noopener noreferrer'>
              <i className='fas fa-download'></i>
            </a>
          </div>
        </div>
      </li>
    );
  });

  return (
    <div className='main-container'>
      <Helmet>
        <title>Rap Songs - Newly Uploaded - TrillSound</title>
      </Helmet>
      <div className='left-side songs'>
        {searchResults.length >= 1 ? (
          <SearchResults
            searchResults={searchResults}
            searchQuery={searchQuery}
          />
        ) : (
          <>
            <h3 className='page-title'>Rap Songs - Newly Uploaded</h3>
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
            <ul className='songs-container'>{songElements}</ul>
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

      <SortMenu genre={'rap'} />
    </div>
  );
};
