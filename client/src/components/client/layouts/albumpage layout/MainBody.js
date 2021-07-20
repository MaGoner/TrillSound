import React from 'react';
import { SideBar } from '../SideBar';

export const MainBody = () => {
  const album = {
    title: 'Song 1',
    year: 2019,
    thumbnail: 'ads-1.jpeg',
    artist: 'Testimony Jaga',
  };

  const songs = [
    { title: 'Jesus', artist: 'Testimony Jaga', thumbnail: 'ads-1.jpeg' },
    { title: 'Jesus', artist: 'Testimony Jaga', thumbnail: 'ads-2.jpg' },
    { title: 'Jesus', artist: 'Testimony Jaga', thumbnail: 'ads-3.jpg' },
    { title: 'Jesus', artist: 'Testimony Jaga', thumbnail: 'ada.jpg' },
    { title: 'Jesus', artist: 'Testimony Jaga', thumbnail: 'cso.jpg' },
    { title: 'Jesus', artist: 'Testimony Jaga', thumbnail: 'avatar.png' },
    { title: 'Jesus', artist: 'Testimony Jaga', thumbnail: 'ads-1.jpeg' },
    { title: 'Jesus', artist: 'Testimony Jaga', thumbnail: 'avatar2.JPG' },
    { title: 'Jesus', artist: 'Testimony Jaga', thumbnail: 'ads-1.jpeg' },
    { title: 'Jesus', artist: 'Testimony Jaga', thumbnail: 'avatar3.JPG' },
  ];
  const songLists = songs.map((song, index) => {
    const { title, thumbnail, artist } = song;
    return (
      <li key={index}>
        <a href='/s'>
          <div
            className='art-img'
            style={{
              backgroundImage: `url(${require(`../../../../imgs/${thumbnail}`)})`,
            }}
          ></div>
          <h3 className='page-title' style={{ color: 'black' }}>
            {title}({index + 1}) - {artist}
          </h3>
        </a>
      </li>
    );
  });

  return (
    <div className='main-container'>
      <div className='left-side artist-profile'>
        <div className='song-header'>
          <h3
            className='page-title'
            style={{ textAlign: 'left', color: 'black' }}
          >
            {album.title} Album by
            <a href='/artist'> {album.artist}</a>
          </h3>
          <p>
            <span>September 16, 2021 | </span>
            <a href='/author'>Elijah_Trillionz</a>
          </p>
        </div>
        <div className='song-body'>
          <div className='song-img'>
            <img src={require('../../../../imgs/ads-2.jpg')} alt='song-img' />
            <span>IMG: Jesus - Testimony Jaga</span>
          </div>
          <div className='artist-tags' style={{ textAlign: 'center' }}>
            <span
              className='page-title artist-title'
              style={{ fontSize: '20px' }}
            >
              Tags:
            </span>
            <span className='text-blue'>
              <a href='/tag'>#artist</a>
            </span>
            {/*<!--leads to allstar page-->*/}
            <span className='text-blue'>
              <a href='/tag'>#albums</a>
            </span>
            {/*<!-- leads to album page -->*/}
            <span className='text-blue'>
              <a href='/tag'>#protostar</a>
            </span>
            {/*<!-- leads to protostar page-->*/}
            <span className='text-blue'>
              <a href='/tag'>#BLW</a>
            </span>
            {/*<!--leads to trending page -->*/}
          </div>
        </div>
        <div className='related-songs'>
          <h3 className='page-title artist-title'>Songs on this album</h3>
          <div className='art-card'>
            <ul>{songLists}</ul>
          </div>
        </div>
      </div>
      <div className='right-side sidebar-container'>
        <SideBar />
      </div>
    </div>
  );
};
