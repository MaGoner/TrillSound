import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import { GlobalContext } from '../../../context/global state/GlobalState';
import { Alert } from '../layouts/Alert';
import { Header } from '../layouts/Header';
import { AddSong } from './AddSong';

export const Dashboard = () => {
  const { signedInAdmin, deleteSong, parentLoading, errorMessage } = useContext(
    GlobalContext
  );

  const [time, setTime] = useState('');
  const [edit, setEdit] = useState(false);
  const [delId, setDelId] = useState(false);
  const [admin, setAdmin] = useState({});
  const [songsUploaded, setSongsUploaded] = useState([]);
  const [songId, setSongId] = useState(0); // change ids type to strings

  const findTime = () => {
    const currentTime = new Date().getHours();
    if (currentTime >= 0 && currentTime <= 11) {
      setTime('morning');
    } else if (currentTime >= 12 && currentTime <= 16) {
      setTime('afternoon');
    } else {
      setTime('evening');
    }
  };
  useEffect(findTime, []);

  const editSong = (e) => {
    setSongId(e.target.parentElement.parentElement.id);
    setEdit(true);
  };

  const deleteThisSong = (e) => {
    setDelId(e.target.parentElement.parentElement.id);
  };

  useEffect(() => {
    if (signedInAdmin.username) {
      setAdmin(signedInAdmin);
    }
  }, [signedInAdmin]);

  useEffect(() => {
    if (signedInAdmin.username) {
      const songIndexes = [];
      signedInAdmin.songsUploaded.forEach((song, index) => {
        songIndexes.push(`${song.index}.${index}`);
      });

      songIndexes.sort((a, b) => {
        return b - a; // ascending
      });

      const sortSongIndexes = songIndexes.map((songIndex) => {
        return +songIndex.substr(songIndex.indexOf('.') + 1);
      });

      const songs = [];
      sortSongIndexes.forEach((sortSongIndex) => {
        songs.push(signedInAdmin.songsUploaded[sortSongIndex]);
      });
      setSongsUploaded(songs);
    }
  }, [signedInAdmin]);

  const songElements = songsUploaded.map((song) => {
    return (
      <li key={song.id} id={song.id}>
        <div className='with-date'>
          <p>
            {song.title} by {song.artist}
          </p>
          <p>{song.createdAt}</p>
        </div>
        <div className='admin-actions'>
          <span className='edit' onClick={editSong} title='edit song'>
            <i className='fas fa-pencil-alt'></i>
          </span>
          <span className='del' title='delete song' onClick={deleteThisSong}>
            <i className='fas fa-trash'></i>
          </span>
        </div>
      </li>
    );
  });

  const emptyElements = (
    <div className='empty'>
      <p className='post-title'>You have not posted any songs yet!</p>
      <a href='add-song'>Get Started</a>
    </div>
  );

  const toggleNavigation = () => {
    const navigation = document.querySelector('.post-type-nav > ul');
    const hamburger = document.querySelector('.post-type-hamburger');
    hamburger.classList.toggle('animate');
    navigation.classList.toggle('active');
  };

  return (
    <>
      {errorMessage && <Redirect push to='/admin' />}
      {parentLoading ? (
        <p>loading...</p>
      ) : (
        <>
          {edit ? (
            <AddSong editing={true} id={songId} />
          ) : (
            <div>
              <Header />
              <main className='admin-main'>
                <div className='greeting'>
                  <h3>
                    Good {time} {admin.username}
                  </h3>
                  <span>We've got a great day ahead of us!!..</span>
                </div>
                <div className='posts-container'>
                  <div className='post-type-nav'>
                    <div
                      className='post-type-hamburger'
                      onClick={toggleNavigation}
                    >
                      <div>
                        <div className='line'></div>
                        <div className='line'></div>
                        <div className='line'></div>
                      </div>
                    </div>
                    <ul>
                      <li className='active'>
                        {/* eslint-disable-next-line */}
                        <a>Posts On</a>
                      </li>
                      <li>
                        <a href='songs'>Songs</a>
                      </li>
                      <li>
                        <a href='artists'>Artists</a>
                      </li>
                    </ul>
                  </div>
                  <div className='post-type-songs'>
                    <h3 className='post-title'>
                      Songs you have posted so far:
                    </h3>
                    <ul>
                      {songsUploaded.length >= 1 ? songElements : emptyElements}
                    </ul>
                  </div>
                </div>
              </main>
              {delId && (
                <Alert
                  msg='Are you sure you want to delete this song'
                  action={deleteSong}
                  id={delId}
                />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};
