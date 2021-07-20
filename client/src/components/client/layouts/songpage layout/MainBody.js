import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../../context/global state/GlobalState';
import { SideBar } from '../SideBar';
import { SearchResults } from '../SearchResults';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import marked from 'marked';

export const MainBody = () => {
  const {
    artists,
    songs,
    rapSongs,
    praiseSongs,
    trendingRapSongs,
    trendingPraiseSongs,
    trendingWorshipSongs,
    worshipSongs,
    getWorshipSongs,
    getPraiseSongs,
    getRapSongs,
    getTrendingWorshipSongs,
    getTrendingPraiseSongs,
    getTrendingRapSongs,
    searchResults,
    searchQuery,
    admins,
    parentLoading,
    getAdmins,
    updateDownloads,
    updateStreams,
  } = useContext(GlobalContext);
  const [genreTrendingSongs, setGenreTrendingSongs] = useState([]);
  const [genreTypeSongs, setGenreTypeSongs] = useState([]);
  const [genreType, setGenreType] = useState('');
  const [song, setSong] = useState({});
  const [songsFromArtist, setSongsFromArtist] = useState([]);
  const [admin, setAdmin] = useState({});
  const [artistId, setArtistId] = useState('');

  useEffect(() => {
    getAdmins();
    // eslint-disable-next-line
  }, []);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const songId = useQuery().get('song_id');
  const artistNameAsId = useQuery().get('artist');

  useEffect(() => {
    if (!parentLoading && songId) {
      const song = songs.filter((song) => {
        return song.id === songId;
      })[0];
      setSong(song);
    }
  }, [songs, songId, parentLoading]);

  useEffect(() => {
    if (
      !parentLoading &&
      artists.length >= 1 &&
      songs.length >= 1 &&
      song &&
      artistNameAsId
    ) {
      const theArtist = artists.filter((artist) => {
        return artist.name.toLowerCase() === artistNameAsId.toLowerCase();
      });
      theArtist.length >= 1 && setArtistId(theArtist[0].id);
      const songsFromArtist = songs.filter((theSong, index) => {
        let artistSongs;
        if (theArtist.length >= 1) {
          theArtist[0].songs.forEach((songId) => {
            if (theSong.id === songId && song.id !== songId && index + 1 <= 8) {
              artistSongs = theSong.id;
            }
          });
        }
        return artistSongs;
      });

      setSongsFromArtist(songsFromArtist);
    }
    // eslint-disable-next-line
  }, [songs, artistNameAsId, artists, song]);

  const artistSongLists = songsFromArtist.map((value) => {
    const { title, thumbnail, id, artist } = value;
    return (
      <li key={id}>
        <a href={`/song?song_id=${id}&artist=${artist}`}>
          <div className='post-thumbnail'>
            <img src={thumbnail} alt={`${title} img`} className='art-img'></img>
          </div>
          <h3 className='page-title art' style={{ color: 'black' }}>
            {title}
          </h3>
        </a>
      </li>
    );
  });

  useEffect(() => {
    if (song) {
      if (song.genre === 'rap') {
        getRapSongs();
        setGenreType('rap');
      } else if (song.genre === 'praise') {
        getPraiseSongs();
        setGenreType('praise');
      } else if (song.genre === 'worship') {
        getWorshipSongs();
        setGenreType('worship');
      }
    }
    // eslint-disable-next-line
  }, [song]);

  useEffect(() => {
    if (genreType) {
      if (genreType === 'rap' && rapSongs.length >= 1) {
        getTrendingRapSongs();
        setGenreTypeSongs(rapSongs);
      } else if (genreType === 'praise' && praiseSongs.length >= 1) {
        getTrendingPraiseSongs();
        setGenreTypeSongs(praiseSongs);
      } else if (genreType === 'worship' && worshipSongs.length >= 1) {
        getTrendingWorshipSongs();
        setGenreTypeSongs(worshipSongs);
      }
    }
    // eslint-disable-next-line
  }, [genreType]);

  useEffect(() => {
    if (genreTypeSongs.length >= 1) {
      if (genreType === 'rap' && trendingRapSongs.length >= 1) {
        setGenreTrendingSongs(trendingRapSongs);
      } else if (genreType === 'praise' && trendingPraiseSongs.length >= 1) {
        setGenreTrendingSongs(trendingPraiseSongs);
      } else if (genreType === 'worship' && trendingWorshipSongs.length >= 1) {
        setGenreTrendingSongs(trendingWorshipSongs);
      }
    }
    // eslint-disable-next-line
  }, [genreTypeSongs]);

  genreTrendingSongs.length >= 1 && genreTrendingSongs.sort((a, b) => b - a);

  const genreIndexes = genreTrendingSongs.map((genreTrendingSong) => {
    return +genreTrendingSong.substr(genreTrendingSong.indexOf('.') + 1);
  });

  const newGenreIndexes = genreIndexes.filter((genreIndex, index) => {
    return index + 1 <= 10;
  });

  const songLists = newGenreIndexes.map((relatedSong) => {
    const { title, thumbnail, artist, id } = genreTypeSongs[relatedSong];

    // eslint-disable-next-line
    if (id === song.id) return;

    return (
      <li key={id}>
        <a href={`/song?song_id=${id}&artist=${artist}`}>
          <div className='post-thumbnail'>
            <img src={thumbnail} alt={`${title} img`} className='art-img'></img>
          </div>
          <h3 className='page-title art' style={{ color: 'black' }}>
            {title}- {artist}
          </h3>
        </a>
      </li>
    );
  });

  // find out the admin that made the post
  useEffect(() => {
    if (song && admins.length >= 1) {
      const admin = admins.filter((admin) => {
        return admin.username.toLowerCase() === song.admin.toLowerCase();
      })[0];
      setAdmin(admin);
    }
  }, [song, admins]);

  const emptyElementForArtist = (
    <div className='empty-list'>
      <p>No other songs from this artist on our playlist</p>
    </div>
  );

  const emptyElementForSongs = (
    <div className='empty-list'>
      <p>No related songs</p>
    </div>
  );

  return (
    <div className='main-container'>
      {song && (
        <>
          <Helmet>
            <title>
              Download MP3: {`${song.title} by ${song.artist}`} - TrillSound
            </title>
          </Helmet>
          <div className='left-side artist-profile'>
            {searchResults.length >= 1 ? (
              <SearchResults
                searchResults={searchResults}
                searchQuery={searchQuery}
              />
            ) : (
              <>
                <div className='song-header'>
                  <h3
                    className='page-title'
                    style={{ textAlign: 'left', color: 'black' }}
                  >
                    Download Mp3: {song.title} by{' '}
                    <a href={`/artist/?artist-id=${artistId}`}>{song.artist}</a>
                  </h3>
                  <p>
                    <span>{song.createdAt} | </span>
                    <i
                      className='fas fa-user'
                      style={{ color: '#444', fontSize: '10px' }}
                    ></i>{' '}
                    {admin && (
                      <a href={admin.socialHandle} target='_black'>
                        {admin.username}
                      </a>
                    )}
                  </p>
                </div>
                <div className='song-body'>
                  <div className='song-img'>
                    <img src={song.thumbnail} alt={song.title} />
                    <div className='song-writeup'>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: marked(
                            song.description ? song.description : '*loading...*'
                          ),
                        }}
                      ></p>
                    </div>
                  </div>

                  <div className='song-action'>
                    <div
                      className='play'
                      onClick={() => updateStreams(song.id)}
                    >
                      <audio controls={true} title='Listen Online'>
                        <source src={song.downloadLink} />
                      </audio>
                    </div>
                    <div
                      className='download'
                      onClick={() => updateDownloads(song.id)}
                    >
                      <a href={song.downloadLink} title='Download mp3'>
                        Download Here
                      </a>
                    </div>
                  </div>
                  <div className='telegram-section'>
                    <h3 className='page-title'>
                      Want updates of songs like this?
                    </h3>
                    <p>
                      Join our <b>Telegram Channel</b> for free.
                    </p>
                    <a
                      href='https://t.me/joinchat/CWf6e_UWnjQzN2Y0'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Join Now
                      <i className='fab fa-telegram'></i>
                    </a>
                  </div>
                  <div className='artist-tags'>
                    <span
                      className='page-title artist-title'
                      style={{ fontSize: '20px' }}
                    >
                      Tags:
                    </span>
                    <span className='text-blue'>
                      <a href='/artists'>#artist</a>
                    </span>
                    {/*<!--leads to allstar page-->*/}
                    <span className='text-blue'>
                      <a href={`/artist/?artist-id=${artistId}`}>
                        #{song.artist && song.artist.match(/\S+/g)}
                      </a>
                    </span>
                    {/*<!-- leads to album page -->*/}
                    <span className='text-blue'>
                      <a href={`/genre/${genreType}`}>#{genreType}</a>
                    </span>
                    {/*<!-- leads to protostar page-->*/}
                    <span className='text-blue'>
                      <a href='/'>#BLW</a>
                    </span>
                    {/*<!--leads to trending page -->*/}
                  </div>
                </div>
                <div className='artist-songs'>
                  <h3 className='page-title artist-title'>
                    more from this artist
                  </h3>
                  <div className='art-card'>
                    {songsFromArtist.length >= 1 ? (
                      <ul>{artistSongLists}</ul>
                    ) : (
                      emptyElementForArtist
                    )}
                  </div>
                </div>
                <div className='related-songs'>
                  <h3 className='page-title artist-title'>Related songs</h3>
                  <div className='art-card'>
                    {newGenreIndexes.length >= 1 ? (
                      <ul>{songLists}</ul>
                    ) : (
                      emptyElementForSongs
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className='right-side sidebar-container'>
            <SideBar />
          </div>
        </>
      )}
    </div>
  );
};
