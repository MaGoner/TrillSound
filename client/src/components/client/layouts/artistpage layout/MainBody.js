import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../../context/global state/GlobalState';
import { SideBar } from '../SideBar';
import { SearchResults } from '../SearchResults';
import { useLocation } from 'react-router-dom';
import marked from 'marked';
import { Helmet } from 'react-helmet-async';

export const MainBody = () => {
  const {
    songs,
    artists,
    trending,
    sortByTrending,
    parentLoading,
    trendingArtists,
    searchQuery,
    searchResults,
    sortArtistByTrending,

    updateArtistPageViews,
  } = useContext(GlobalContext);
  const [trendingSongsFromArtist, setTrendingSongsFromArtist] = useState([]);
  const [songsFromArtist, setSongsFromArtist] = useState([]);
  const [previewingArtist, setPreviewingArtist] = useState({});
  const [trendingArtistIndex, setTrendingArtistIndex] = useState([]);

  useEffect(() => {
    songs && sortByTrending();
    // eslint-disable-next-line
  }, [songs]);

  useEffect(() => {
    artists && sortArtistByTrending();
    // eslint-disable-next-line
  }, [artists]);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const artistId = useQuery().get('artist-id');

  useEffect(() => {
    if (
      !parentLoading &&
      artists.length >= 1 &&
      songs.length >= 1 &&
      trending.length >= 1 &&
      artistId
    ) {
      const theArtist = artists.filter((artist) => {
        return artist.id === artistId;
      });
      const trendingSongs = getTrendingSongs(trending);
      const trendingSongsFromArtist = trendingSongs.filter((trendingSong) => {
        let artistSongs;
        if (theArtist.length >= 1) {
          theArtist[0].songs.forEach((songId) => {
            if (trendingSong.id === songId) {
              artistSongs = trendingSong.id;
            }
          });
        }
        return artistSongs;
      });

      const songsFromArtist =
        theArtist.length >= 1 && getSongsFromArtist(theArtist[0]);
      setSongsFromArtist(songsFromArtist);
      setPreviewingArtist(theArtist[0]);
      setTrendingSongsFromArtist(trendingSongsFromArtist);
    } else {
      setPreviewingArtist(undefined);
    }
    // eslint-disable-next-line
  }, [songs, artistId, artists, trending, parentLoading]);

  useEffect(() => {
    if (artists.length >= 1 && artistId) {
      const theArtist = artists.filter((artist) => {
        return artist.id === artistId;
      })[0];
      theArtist && updateArtistPageViews(theArtist.name);
    }
    // eslint-disable-next-line
  }, [artists, artistId]);

  const getTrendingSongs = (trendingLogs) => {
    trendingLogs.sort((a, b) => b - a);
    const trendingIndexes = trendingLogs.map((song) => {
      return +song.substr(song.indexOf('.') + 1);
    });

    const trendingSongs = trendingIndexes.map((index) => {
      return songs[index];
    });

    return trendingSongs;
  };

  const limitedTrendingSongs = trendingSongsFromArtist.filter((x, index) => {
    return index + 1 <= 4;
  });

  const getSongsFromArtist = (artist) => {
    const songsFromArtist = songs.filter((theSong) => {
      let artistSongs;
      artist.songs.forEach((songId) => {
        if (theSong.id === songId) {
          artistSongs = theSong.id;
        }
      });
      return artistSongs;
    });

    return songsFromArtist;
  };

  const trendingLists = limitedTrendingSongs.map((trending) => {
    const { thumbnail, id, title, artist } = trending;
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

  const songLists = songsFromArtist.map((song) => {
    const { title, thumbnail, id, artist } = song;
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

  // // sorting related artists
  useEffect(() => {
    if (trendingArtists.length >= 1) {
      trendingArtists.sort((a, b) => b - a);
      const trendingArtistIndex = trendingArtists.map((trendingArtist) => {
        return +trendingArtist.substr(trendingArtist.indexOf('.') + 1);
      });
      setTrendingArtistIndex(trendingArtistIndex);
    }
  }, [trendingArtists]);

  const trendingArtistsElement = trendingArtistIndex.map(
    (trendingIndex, index) => {
      const { id, name, thumbnail } = artists[trendingIndex];

      // eslint-disable-next-line
      if (index > 2) return;
      // eslint-disable-next-line
      if (id === artistId) return;
      return (
        <li key={id} className='artist-img-container'>
          <a href={`/artist/?artist-id=${id}`}>
            <div>
              <img src={thumbnail} alt={name} />
              <h3>{name}</h3>
              <p>See more about {name}</p>
            </div>
          </a>
        </li>
      );
    }
  );

  return (
    <div className='main-container'>
      {previewingArtist ? (
        <>
          <Helmet>
            <title>
              Biography of {`${previewingArtist.name}`} - TrillSound
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
                <div className='bio-container'>
                  <div>
                    <div className='artist-img-container'>
                      <img
                        src={previewingArtist.thumbnail}
                        alt={`${previewingArtist.name} img`}
                      />
                      <h3>{previewingArtist.name}</h3>
                      <p>Biography of BLW Star {previewingArtist.name}</p>
                    </div>
                  </div>
                  <div className='about-container'>
                    <h3 className='page-title artist-title'>
                      About {previewingArtist.name}
                    </h3>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: marked(
                          previewingArtist.bio
                            ? previewingArtist.bio
                            : '*loading...*'
                        ),
                      }}
                    ></p>
                  </div>
                </div>
                <div className='artist-albums'>
                  <h3 className='page-title artist-title'>
                    Popular Songs of {previewingArtist.name}
                  </h3>
                  <div className='art-card'>
                    <ul>{trendingLists}</ul>
                  </div>
                </div>
                <div className='artist-songs'>
                  <h3 className='page-title artist-title'>
                    latest songs of {previewingArtist.name}
                  </h3>
                  <div className='art-card'>
                    <ul>{songLists}</ul>
                  </div>
                </div>
                <div className='artist-social'>
                  <h3 className='page-title artist-title half'>
                    contact {previewingArtist.name} on:
                  </h3>
                  <p>
                    {previewingArtist.facebookLink && (
                      <b>
                        <a href={previewingArtist.facebookLink}>Facebook</a>
                      </b>
                    )}
                    {previewingArtist.kingschatLink && (
                      <b>
                        <a href={previewingArtist.kingschatLink}>KingsChat</a>
                      </b>
                    )}
                    {previewingArtist.twitterLink && (
                      <b>
                        <a href={previewingArtist.twitterLink}>Twitter</a>
                      </b>
                    )}
                    {previewingArtist.instaLink && (
                      <b>
                        <a href={previewingArtist.instaLink}>Instagram</a>
                      </b>
                    )}
                    {previewingArtist.youtubeLink && (
                      <b>
                        <a href={previewingArtist.youtubeLink}>YouTube</a>
                      </b>
                    )}
                  </p>
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
                    <a href='/alph#alph-order'>#songs</a>
                  </span>
                  {/*<!-- leads to protostar page-->*/}
                  <span className='text-blue'>
                    <a href='/'>#BLW</a>
                  </span>
                  {/*<!--leads to trending page -->*/}
                </div>
                <div className='related-artists'>
                  <h3 className='page-title'>
                    <a href='/artists'>
                      Trending Artists
                      <i
                        className='far fa-bookmark'
                        style={{ marginLeft: '10px' }}
                      />
                    </a>
                  </h3>
                  <div>
                    <ul className='artist-lists'>{trendingArtistsElement}</ul>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className='right-side sidebar-container'>
            <SideBar />
          </div>
        </>
      ) : (
        <>
          <Helmet>
            <title>404 Artist Not Found - TrillSound</title>
          </Helmet>
          <div className='left-side artist-profile'>
            {searchResults.length >= 1 ? (
              <SearchResults
                searchResults={searchResults}
                searchQuery={searchQuery}
              />
            ) : (
              <>
                {parentLoading ? (
                  <p>loading...</p>
                ) : (
                  <>
                    <div className='page-title'>
                      This artist was not found in our database
                    </div>
                    <div className='related-artists'>
                      <h3 className='page-title'>
                        <a href='/artists'>
                          Trending Artists
                          <i
                            className='far fa-bookmark'
                            style={{ marginLeft: '10px' }}
                          />
                        </a>
                      </h3>
                      <div>
                        <ul className='artist-lists'>
                          {trendingArtistsElement}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
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
