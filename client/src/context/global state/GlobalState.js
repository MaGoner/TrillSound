import React, { createContext, useEffect, useReducer } from 'react';
import AppReducer from '../app reducers/AppReducer';
import {
  GET_SONGS,
  GET_ARTISTS,
  GET_ADMINS,
  ALPH_ORDER,
  TRENDING,
  PREV_PAGE,
  NEXT_PAGE,
  SET_LOADING,
  SET_PARENT_LOADING,
  GET_WORSHIP_SONGS,
  GET_TRENDING_WORSHIP,
  GET_RAP_SONGS,
  GET_PRAISE_SONGS,
  GET_TRENDING_RAP,
  GET_TRENDING_PRAISE,
  WORSHIP_ALPH_ORDER,
  PRAISE_ALPH_ORDER,
  RAP_ALPH_ORDER,
  SEARCH_QUERY,
  GET_LAST_MONTH,
  TRENDING_LAST_MONTH,
  SONG_TO_PREVIEW,
  ARTIST_TO_PREVIEW,
  SIGNED_IN_ADMIN,
  SET_ERROR_MESSAGE,
  SET_SUCCESS_MESSAGE,
  TRENDING_ARTIST,
  ARTIST_ALPH_ORDER,
} from '../app reducers/types';

const initialState = {
  songs: [],
  songTitles: [],
  trending: [],
  worshipSongs: [],
  praiseSongs: [],
  rapSongs: [],
  trendingWorshipSongs: [],
  trendingPraiseSongs: [],
  trendingRapSongs: [],
  fromLastMonth: [],
  trendingLastMonth: [],
  previewingSong: [],
  artistId: '',
  artists: [],
  loading: false,
  parentLoading: true,
  currentPaginationIndex: 0,
  newTotalPaginationIndex: 16,
  searchResults: [],
  searchQuery: '',
  previewingArtist: [],
  trendingArtists: [],
  artistTitles: [],
  admins: [],
  signedInAdmin: {},
  errorMessage: false,
  successMessage: false,
};

// create context
export const GlobalContext = createContext(initialState);

// create provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // actions
  const getSongs = async () => {
    setParentLoading(true);
    try {
      const penRes = await fetch('/api/songs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      penRes
        .json()
        .then((data) => {
          if (data.errorMsg) {
            setParentLoading(false);
            return setErrorMessage(data.errorMsg);
          }

          const songIndexes = [];
          data.songs.forEach((song, index) => {
            // generate image view link
            song.thumbnail = `https://drive.google.com/uc?export=view&id=${song.thumbnail}`;
            // generate song download link
            song.downloadLink = `https://drive.google.com/uc?export=download&id=${song.downloadLink}`;

            song.artist = `${song.artist
              .substr(0, 1)
              .toUpperCase()}${song.artist.substr(1)}`;

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
            songs.push(data.songs[sortSongIndex]);
          });

          dispatch({
            type: GET_SONGS,
            payload: songs,
          });
          setErrorMessage(false);
        })
        .catch((err) => {
          setParentLoading(false);
          return setErrorMessage(err.errorMsg);
        });
    } catch (err) {
      setErrorMessage(err);
    }
    setParentLoading(false);
  };

  const getArtists = async () => {
    setParentLoading(true);
    try {
      const penRes = await fetch('/api/bios', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      penRes
        .json()
        .then((data) => {
          if (data.errorMsg) {
            setParentLoading(false);
            return setErrorMessage(data.errorMsg);
          }

          const artistPageViews = [];
          data.artists.forEach((artist, index) => {
            // generate image view link
            artist.thumbnail = `https://drive.google.com/uc?export=view&id=${artist.thumbnail}`;
            artist.name = `${artist.name
              .substr(0, 1)
              .toUpperCase()}${artist.name.substr(1)}`;

            artistPageViews.push(`${artist.index}.${index}`); // trending
          });

          artistPageViews.sort((a, b) => {
            return b - a;
          });

          const sortArtistPageViews = artistPageViews.map((artistPageView) => {
            return +artistPageView.substr(artistPageView.indexOf('.') + 1);
          });

          const artists = [];
          sortArtistPageViews.forEach((sortArtistPageView) => {
            artists.push(data.artists[sortArtistPageView]);
          });

          dispatch({
            type: GET_ARTISTS,
            payload: artists,
          });
          setErrorMessage(false);
        })
        .catch((err) => {
          setParentLoading(false);
          return setErrorMessage(err.errorMsg);
        });
    } catch (err) {
      setErrorMessage(err);
    }
    setParentLoading(false);
  };

  const getAdmins = async () => {
    setParentLoading(true);
    try {
      const penRes = await fetch('/api/admins', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      penRes
        .json()
        .then((data) => {
          if (data.errorMsg) {
            setParentLoading(false);
            return setErrorMessage(data.errorMsg);
          }

          dispatch({
            type: GET_ADMINS,
            payload: data.admins,
          });
          setErrorMessage(false);
        })
        .catch((err) => {
          setParentLoading(false);
          return setErrorMessage(err.errorMsg);
        });
    } catch (err) {
      setErrorMessage(err);
    }
    setParentLoading(false);
  };

  // TODO: sort artists (alphabetically, popular [num of page views], recently uploaded)

  useEffect(() => {
    getSongs();
    getArtists();
    // eslint-disable-next-line
  }, []);

  const sortAlphabetically = () => {
    dispatch({
      type: ALPH_ORDER,
    });
  };

  const sortByTrending = () => {
    dispatch({
      type: TRENDING,
    });
  };

  const sortArtistAlphabetically = () => {
    dispatch({
      type: ARTIST_ALPH_ORDER,
    });
  };

  const sortArtistByTrending = () => {
    dispatch({
      type: TRENDING_ARTIST,
    });
  };

  // paginations
  const goToNextPage = (index) => {
    document.querySelector('html').scrollTop = 0;
    setLoading();
    // setTimeout(() => {
    dispatch({
      type: NEXT_PAGE,
      payload: index,
    });
    // }, 1000);
  };

  const goToPrevPage = (index) => {
    document.querySelector('html').scrollTop = 0;
    setLoading();
    // setTimeout(() => {
    dispatch({
      type: PREV_PAGE,
      payload: index,
    });
    // }, 1000);
  };

  const adminTag = localStorage.getItem('admin-tag');

  const updateStreams = async (id) => {
    setParentLoading(true);
    try {
      await fetch(`/api/streams/update/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'admin-tag': adminTag,
        },
      });
    } catch (err) {
      setErrorMessage(err);
    }
    setParentLoading(false);
  };

  const updateDownloads = async (id) => {
    setParentLoading(true);
    try {
      await fetch(`/api/downloads/update/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'admin-tag': adminTag,
        },
      });
    } catch (err) {
      setErrorMessage(err);
    }
    setParentLoading(false);
  };

  const updateArtistPageViews = async (id) => {
    setParentLoading(true);
    try {
      await fetch(`/api/artists/update/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'admin-tag': adminTag,
        },
      });
    } catch (err) {
      setErrorMessage(err);
    }
    setParentLoading(false);
  };

  const getWorshipSongs = () => {
    setLoading();
    dispatch({
      type: GET_WORSHIP_SONGS,
    });
  };

  const getTrendingWorshipSongs = () => {
    setLoading();
    dispatch({
      type: GET_TRENDING_WORSHIP,
    });
  };

  const worshipInAlphOrder = () => {
    setLoading();
    dispatch({
      type: WORSHIP_ALPH_ORDER,
    });
  };

  const getRapSongs = () => {
    setLoading();
    dispatch({
      type: GET_RAP_SONGS,
    });
  };

  const getTrendingRapSongs = () => {
    setLoading();
    dispatch({
      type: GET_TRENDING_RAP,
    });
  };

  const praiseInAlphOrder = () => {
    setLoading();
    dispatch({
      type: PRAISE_ALPH_ORDER,
    });
  };

  const getPraiseSongs = () => {
    setLoading();
    dispatch({
      type: GET_PRAISE_SONGS,
    });
  };

  const rapInAlphOrder = () => {
    setLoading();
    dispatch({
      type: RAP_ALPH_ORDER,
    });
  };

  const getTrendingPraiseSongs = () => {
    setLoading();
    dispatch({
      type: GET_TRENDING_PRAISE,
    });
  };

  // search for query
  const searchForQuery = (query, src) => {
    setLoading();
    dispatch({
      type: SEARCH_QUERY,
      payload: { query, src },
    });
  };

  // get all songs posted last month
  const getSongsFromLastMonth = (lastMonth) => {
    dispatch({
      type: GET_LAST_MONTH,
      payload: lastMonth,
    });
  };

  const getTrendingLastMonth = () => {
    dispatch({
      type: TRENDING_LAST_MONTH,
    });
  };

  // in loading song's info. the server will collect the id of the song and send the id to the client to filter the song
  const songToPreview = () => {
    // when the song is seen, the id of the song will be sent while the name of the artist will be used to find the id of the artist in the artist collection in the database
    setLoading();
    const id = 50;
    const artistId = 20;
    dispatch({
      type: SONG_TO_PREVIEW,
      payload: [id, artistId], // originally coming from the server
    });
  };

  const artistToPreview = () => {
    setLoading();
    const id = 20;
    dispatch({
      type: ARTIST_TO_PREVIEW,
      payload: id,
    });
  };

  const getDataFromCookie = (data) => {
    const allCookies = document.cookie.split(';');

    const cookie = allCookies.filter((cookie) => {
      return cookie.indexOf(data) !== -1;
    });

    return cookie.length >= 1 && cookie[0].trim().split('=')[1];
  };
  const adminToken = getDataFromCookie('_admin_token');

  const signIn = async (username, password) => {
    setLoading(true);
    const data = { username, password };
    try {
      const penRes = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return penRes
        .json()
        .then((data) => {
          if (data.errorMsg) {
            setLoading(false);
            return setErrorMessage(data.errorMsg);
          }

          // set admin token in cookie
          const date = new Date();
          date.setTime(date.getTime() + 24 * 60 * 60 * 1000); // expires in 24hrs
          document.cookie = `_admin_token=${
            data.token
          }; expires=${date.toUTCString()}`;

          // set admin tag in localstorage
          localStorage.setItem('admin-tag', JSON.stringify(true));
          getSignedInAdmin(data.token);
          setErrorMessage(false);
        })
        .catch((err) => {
          setLoading(false);
          return setErrorMessage(err.errorMsg);
        });
    } catch (err) {
      setErrorMessage(err);
    }
    setLoading(false);
  };

  // register a user
  const register = async (
    username,
    password,
    zone,
    socialHandle,
    adminAuth
  ) => {
    setLoading(true);
    const data = { username, password, zone, socialHandle, adminAuth };
    try {
      const penRes = await fetch('/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      penRes
        .json()
        .then((data) => {
          if (data.errorMsg) {
            setLoading(false);
            return setErrorMessage(data.errorMsg);
          }

          setSuccessMessage(data.msg);
          setErrorMessage(false);
        })
        .catch((err) => {
          setLoading(false);
          return setErrorMessage(err.errorMsg);
        });
    } catch (err) {
      setErrorMessage(err);
    }
    setLoading(false);
  };

  const getSignedInAdmin = async (token) => {
    setParentLoading(true);
    try {
      const penRes = await fetch('/api/admin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'admin-token': token,
        },
      });

      penRes
        .json()
        .then((data) => {
          if (data.errorMsg) {
            setParentLoading(false);
            return setErrorMessage(data.errorMsg);
          }

          dispatch({
            type: SIGNED_IN_ADMIN,
            payload: data.admin,
          });
          setErrorMessage(false);
        })
        .catch((err) => {
          setParentLoading(false);
          return setErrorMessage(err.errorMsg);
        });
    } catch (err) {
      setErrorMessage(err);
    }
    setParentLoading(false);
  };

  useEffect(() => {
    if (adminToken) getSignedInAdmin(adminToken);
    else setErrorMessage('Not authenticated');
    // eslint-disable-next-line
  }, []);

  const changePassword = async (oldPassword, newPassword) => {
    setLoading(true);
    try {
      const pendingResponse = await fetch(`/api/admin/change-password`, {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword }),
        headers: {
          'Content-Type': 'application/json',
          'admin-token': adminToken,
        },
      });

      pendingResponse.json().then((data) => {
        if (data.errorMsg) {
          setLoading(false);
          return setErrorMessage(data.errorMsg);
        }

        setSuccessMessage(data.msg);
        setErrorMessage(false);
      });
    } catch (err) {
      setErrorMessage(err);
    }
    setLoading(false);
  };

  const uploadSong = async (song) => {
    setLoading(true);
    try {
      const penRes = await fetch('/api/admin/songs/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-token': adminToken,
        },
        body: JSON.stringify(song),
      });

      penRes
        .json()
        .then((data) => {
          if (data.errorMsg) {
            setLoading(false);
            return setErrorMessage(data.errorMsg);
          }

          setSuccessMessage(data.msg);
          setErrorMessage(false);
        })
        .catch((err) => {
          setLoading(false);
          return setErrorMessage(err.errorMsg);
        });
    } catch (err) {
      setErrorMessage(err);
    }
    setLoading(false);
  };

  const updateSong = async (id, song) => {
    setLoading(true);
    try {
      const penRes = await fetch(`/api/admin/songs/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'admin-token': adminToken,
        },
        body: JSON.stringify(song),
      });

      penRes
        .json()
        .then((data) => {
          if (data.errorMsg) {
            setLoading(false);
            return setErrorMessage(data.errorMsg);
          }

          setSuccessMessage(data.msg);
          setErrorMessage(false);
        })
        .catch((err) => {
          setLoading(false);
          return setErrorMessage(err.errorMsg);
        });
    } catch (err) {
      setErrorMessage(err);
    }
    setLoading(false);
  };

  const deleteSong = async (id) => {
    setParentLoading(true);
    try {
      const penRes = await fetch(`/api/admin/songs/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'admin-token': adminToken,
        },
      });

      penRes
        .json()
        .then((data) => {
          if (data.errorMsg) {
            setParentLoading(false);
            return setErrorMessage(data.errorMsg);
          }

          // getSongs();
          setErrorMessage(false);
        })
        .catch((err) => {
          setParentLoading(false);
          return setErrorMessage(err.errorMsg);
        });
    } catch (err) {
      setErrorMessage(err);
    }
    setParentLoading(false);
  };

  const uploadArtist = async (artist) => {
    setLoading(true);
    try {
      const penRes = await fetch('/api/admin/bios/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-token': adminToken,
        },
        body: JSON.stringify(artist),
      });

      penRes
        .json()
        .then((data) => {
          if (data.errorMsg) {
            setLoading(false);
            return setErrorMessage(data.errorMsg);
          }

          setSuccessMessage(data.msg);
          setErrorMessage(false);
        })
        .catch((err) => {
          setLoading(false);
          return setErrorMessage(err.errorMsg);
        });
    } catch (err) {
      setErrorMessage(err);
    }
    setLoading(false);
  };

  const updateArtist = async (artist) => {
    setLoading(true);
    try {
      const penRes = await fetch(`/api/admin/bios/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'admin-token': adminToken,
        },
        body: JSON.stringify(artist),
      });

      penRes
        .json()
        .then((data) => {
          if (data.errorMsg) {
            setLoading(false);
            return setErrorMessage(data.errorMsg);
          }

          setSuccessMessage(data.msg);
          setErrorMessage(false);
        })
        .catch((err) => {
          setLoading(false);
          return setErrorMessage(err.errorMsg);
        });
    } catch (err) {
      setErrorMessage(err);
    }
    setLoading(false);
  };

  const deleteArtist = async (name) => {
    setParentLoading(true);
    try {
      const penRes = await fetch(`/api/admin/bios/delete/${name}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'admin-token': adminToken,
        },
      });

      penRes
        .json()
        .then((data) => {
          if (data.errorMsg) {
            setParentLoading(false);
            return setErrorMessage(data.errorMsg);
          }

          setErrorMessage(false);
        })
        .catch((err) => {
          setParentLoading(false);
          return setErrorMessage(err.errorMsg);
        });
    } catch (err) {
      setErrorMessage(err);
    }
    setParentLoading(false);
  };

  // global
  // set loading
  const setLoading = (bool) => {
    dispatch({
      type: SET_LOADING,
      payload: bool,
    });
  };
  const setParentLoading = (bool) => {
    dispatch({
      type: SET_PARENT_LOADING,
      payload: bool,
    });
  };
  const setErrorMessage = (err) => {
    dispatch({
      type: SET_ERROR_MESSAGE,
      payload: err,
    });
  };
  const setSuccessMessage = (msg) => {
    dispatch({
      type: SET_SUCCESS_MESSAGE,
      payload: msg,
    });
  };

  return (
    <GlobalContext.Provider
      value={{
        artists: state.artists,
        songs: state.songs,
        songTitles: state.songTitles,
        trending: state.trending,
        currentPaginationIndex: state.currentPaginationIndex,
        newTotalPaginationIndex: state.newTotalPaginationIndex,
        trendingWorshipSongs: state.trendingWorshipSongs,
        worshipSongs: state.worshipSongs,
        praiseSongs: state.praiseSongs,
        rapSongs: state.rapSongs,
        trendingPraiseSongs: state.trendingPraiseSongs,
        trendingRapSongs: state.trendingRapSongs,
        searchResults: state.searchResults,
        searchQuery: state.searchQuery,
        fromLastMonth: state.fromLastMonth,
        trendingLastMonth: state.trendingLastMonth,
        previewingSong: state.previewingSong,
        artistId: state.artistId,
        previewingArtist: state.previewingArtist,
        trendingArtists: state.trendingArtists,
        artistTitles: state.artistTitles,
        // admins
        admins: state.admins,
        signedInAdmin: state.signedInAdmin,
        // globals
        errorMessage: state.errorMessage,
        successMessage: state.successMessage,
        loading: state.loading,
        parentLoading: state.parentLoading,
        getAdmins,
        goToNextPage,
        goToPrevPage,
        sortByTrending,
        sortAlphabetically,
        updateDownloads,
        updateStreams,
        updateArtistPageViews,
        getTrendingWorshipSongs,
        getWorshipSongs,
        getPraiseSongs,
        getRapSongs,
        getTrendingPraiseSongs,
        getTrendingRapSongs,
        rapInAlphOrder,
        praiseInAlphOrder,
        worshipInAlphOrder,
        searchForQuery,
        getSongsFromLastMonth,
        getTrendingLastMonth,
        songToPreview,
        artistToPreview,
        sortArtistByTrending,
        sortArtistAlphabetically,
        // admins
        register,
        signIn,
        uploadSong,
        updateSong,
        deleteSong,
        uploadArtist,
        updateArtist,
        deleteArtist,
        changePassword,
        // globals
        setErrorMessage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
