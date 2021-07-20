import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../context/global state/GlobalState';
import { Alert } from '../layouts/Alert';
import { Header } from '../layouts/Header';
import { AddArtist } from './AddArtist';
import { Redirect } from 'react-router-dom';

export const ArtistBios = () => {
  const {
    signedInAdmin,
    parentLoading,
    deleteArtist,
    errorMessage,
  } = useContext(GlobalContext);

  const [time, setTime] = useState('');
  const [edit, setEdit] = useState(false);
  const [delId, setDelId] = useState(false);
  const [admin, setAdmin] = useState({});
  const [artistsUploaded, setArtistsUploaded] = useState([]);
  const [artistId, setArtistId] = useState(0); // change ids type to strings

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
  useEffect(() => {
    findTime();
  }, []);

  const editArtist = (e) => {
    setArtistId(e.target.parentElement.parentElement.id);

    setEdit(true);
  };

  const deleteThisArtist = (e) => {
    setDelId(e.target.parentElement.parentElement.id);
  };

  useEffect(() => {
    if (signedInAdmin.username) {
      setAdmin(signedInAdmin);
    }
  }, [signedInAdmin]);

  useEffect(() => {
    if (signedInAdmin.username) {
      const artistIndexes = [];
      signedInAdmin.artistsUploaded.forEach((artist, index) => {
        artistIndexes.push(`${artist.index}.${index}`);
      });

      artistIndexes.sort((a, b) => {
        return b - a; // ascending
      });

      const sortArtistIndexes = artistIndexes.map((artistIndex) => {
        return +artistIndex.substr(artistIndex.indexOf('.') + 1);
      });

      const artists = [];
      sortArtistIndexes.forEach((sortArtistIndex) => {
        artists.push(signedInAdmin.artistsUploaded[sortArtistIndex]);
      });
      setArtistsUploaded(artists);
    }
  }, [signedInAdmin]);

  const artistElements = artistsUploaded.map((artist) => {
    return (
      <li key={artist.id} id={artist.name}>
        <div className='with-date'>
          <p>Biography of {artist.name}</p>
          <p>{artist.createdAt}</p>
        </div>
        <div className='admin-actions'>
          <span className='edit' onClick={editArtist}>
            <i className='fas fa-pencil-alt'></i>
          </span>
          <span className='del' onClick={deleteThisArtist}>
            <i className='fas fa-trash'></i>
          </span>
        </div>
      </li>
    );
  });

  const toggleNavigation = () => {
    const navigation = document.querySelector('.post-type-nav > ul');
    const hamburger = document.querySelector('.post-type-hamburger');
    hamburger.classList.toggle('animate');
    navigation.classList.toggle('active');
  };

  const emptyElements = (
    <div className='empty'>
      <p className='post-title'>You have not posted any artist bios yet!</p>
      <a href='add-artist'>Get Started</a>
    </div>
  );

  return (
    <>
      {errorMessage && <Redirect push to='/admin' />}
      {parentLoading ? (
        <p>loading...</p>
      ) : (
        <>
          {edit ? (
            <AddArtist editing={true} id={artistId} />
          ) : (
            <div>
              <Header />
              <main className='admin-main'>
                <div className='greeting'>
                  <h3>
                    Good {time} {admin.username}
                  </h3>
                  <span>Feeling positive today!!..</span>
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
                        <a href='artists'>Artists</a>
                      </li>
                      <li>
                        <a href='songs'>Songs</a>
                      </li>
                    </ul>
                  </div>
                  <div className='post-type-songs'>
                    <h3 className='post-title'>
                      Artist Bios you have posted so far:
                    </h3>
                    <ul>
                      {artistsUploaded.length >= 1
                        ? artistElements
                        : emptyElements}
                    </ul>
                  </div>
                </div>
              </main>
              {delId && (
                <Alert
                  msg='Are you sure you want to delete this Artist Bio'
                  action={deleteArtist}
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
