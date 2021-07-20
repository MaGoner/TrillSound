import {
  ALPH_ORDER,
  TRENDING,
  SET_LOADING,
  NEXT_PAGE,
  PREV_PAGE,
  GET_TRENDING_WORSHIP,
  GET_WORSHIP_SONGS,
  GET_PRAISE_SONGS,
  GET_RAP_SONGS,
  GET_TRENDING_PRAISE,
  GET_TRENDING_RAP,
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
  GET_SONGS,
  GET_ARTISTS,
  GET_ADMINS,
  SET_PARENT_LOADING,
  ARTIST_ALPH_ORDER,
  TRENDING_ARTIST,
} from './types';

const AppReducer = (state, action) => {
  switch (action.type) {
    case GET_SONGS:
      return {
        ...state,
        songs: action.payload,
      };
    case GET_ARTISTS:
      return {
        ...state,
        artists: action.payload,
      };
    case GET_ADMINS:
      return {
        ...state,
        admins: action.payload,
      };
    case ALPH_ORDER:
      return {
        ...state,
        songTitles: state.songs.map((song, index) => {
          return `${song.title}.${index}`;
        }),
      };
    case TRENDING:
      return {
        ...state,
        trending: state.songs.map((song, index) => {
          return `${song.numOfDownloads + song.numOfStreams}.${index}`;
        }),
      };
    case ARTIST_ALPH_ORDER:
      return {
        ...state,
        artistTitles: state.artists.map((artist, index) => {
          return `${artist.name}.${index}`;
        }),
      };
    case TRENDING_ARTIST:
      return {
        ...state,
        trendingArtists: state.artists.map((artist, index) => {
          return `${artist.numOfPageViews}.${index}`;
        }),
      };
    case NEXT_PAGE:
      return {
        ...state,
        currentPaginationIndex: action.payload,
        newTotalPaginationIndex: action.payload + 16,
      };
    case PREV_PAGE:
      return {
        ...state,
        currentPaginationIndex: action.payload - 16,
        newTotalPaginationIndex: action.payload,
      };
    case GET_WORSHIP_SONGS:
      return {
        ...state,
        worshipSongs: state.songs.filter((song) => {
          return song.genre === 'worship';
        }),
      };
    case GET_TRENDING_WORSHIP:
      return {
        ...state,
        trendingWorshipSongs: state.worshipSongs.map((worshipSong, index) => {
          return `${
            worshipSong.numOfDownloads + worshipSong.numOfStreams
          }.${index}`;
        }),
      };
    case WORSHIP_ALPH_ORDER:
      return {
        ...state,
        songTitles: state.worshipSongs.map((worshipSong, index) => {
          return `${worshipSong.title}.${index}`;
        }),
      };
    case GET_PRAISE_SONGS:
      return {
        ...state,
        praiseSongs: state.songs.filter((song) => {
          return song.genre === 'praise';
        }),
      };
    case GET_TRENDING_PRAISE:
      return {
        ...state,
        trendingPraiseSongs: state.praiseSongs.map((praiseSong, index) => {
          return `${
            praiseSong.numOfDownloads + praiseSong.numOfStreams
          }.${index}`;
        }),
      };
    case PRAISE_ALPH_ORDER:
      return {
        ...state,
        songTitles: state.praiseSongs.map((praiseSong, index) => {
          return `${praiseSong.title}.${index}`;
        }),
      };
    case GET_RAP_SONGS:
      return {
        ...state,
        rapSongs: state.songs.filter((song) => {
          return song.genre === 'rap';
        }),
      };
    case GET_TRENDING_RAP:
      return {
        ...state,
        trendingRapSongs: state.rapSongs.map((rapSong, index) => {
          return `${rapSong.numOfDownloads + rapSong.numOfStreams}.${index}`;
        }),
      };
    case RAP_ALPH_ORDER:
      return {
        ...state,
        songTitles: state.rapSongs.map((rapSong, index) => {
          return `${rapSong.title}.${index}`;
        }),
      };
    case SEARCH_QUERY:
      return {
        ...state,
        searchResults:
          action.payload.src === 'artist'
            ? checkForQueryInArtists(action.payload.query, state.artists)
            : checkForQueryInSongs(action.payload.query, state.songs),
        searchQuery: action.payload.query,
      };
    case GET_LAST_MONTH:
      return {
        ...state,
        fromLastMonth: state.songs.filter((song) => {
          return !song.createdAt.indexOf(action.payload);
        }),
      };
    case TRENDING_LAST_MONTH:
      return {
        ...state,
        trendingLastMonth: state.fromLastMonth.map((song, index) => {
          return `${song.numOfDownloads + song.numOfStreams}.${index}`;
        }),
      };
    case SONG_TO_PREVIEW:
      return {
        ...state,
        previewingSong: state.songs.filter((song) => {
          return song.id === action.payload[0];
        }),
        artistId: action.payload[1],
      };
    case ARTIST_TO_PREVIEW:
      return {
        ...state,
        previewingArtist: state.artists.filter((artist) => {
          return artist.id === action.payload;
        }),
      };
    // admins

    case SIGNED_IN_ADMIN:
      return {
        ...state,
        signedInAdmin: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_PARENT_LOADING:
      return {
        ...state,
        parentLoading: action.payload,
      };
    case SET_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.payload,
      };
    case SET_SUCCESS_MESSAGE:
      return {
        ...state,
        successMessage: action.payload,
      };
    default:
      return state;
  }
};

const checkForQueryInSongs = (query, songs) => {
  const relatedSongsCheckOne = songs.filter((song) => {
    return song.title.toLowerCase() === query.toLowerCase();
  });

  if (relatedSongsCheckOne.length >= 1) {
    return relatedSongsCheckOne;
  }

  const songTitles = songs.map((song) => {
    return song.title.toLowerCase();
  });

  const relatedSongTitles = songTitles.filter((songTitle) => {
    return songTitle.indexOf(query.toLowerCase()) !== -1;
  });

  const relatedSongsCheckTwo = [];

  for (let i = 0; i < songs.length; i++) {
    for (let j = 0; j < relatedSongTitles.length; j++) {
      if (relatedSongTitles[j] === songs[i].title.toLowerCase()) {
        relatedSongsCheckTwo.push(songs[i]);
      }
    }
  }

  if (relatedSongsCheckTwo.length >= 1) {
    return relatedSongsCheckTwo;
  }

  return [null];
};

const checkForQueryInArtists = (query, artists) => {
  const relatedArtistsCheckOne = artists.filter((artist) => {
    return artist.name.toLowerCase() === query.toLowerCase();
  });

  if (relatedArtistsCheckOne.length >= 1) {
    return relatedArtistsCheckOne;
  }

  const artistNames = artists.map((artist) => {
    return artist.name.toLowerCase();
  });

  const relatedArtistNames = artistNames.filter((artistName) => {
    return artistName.indexOf(query.toLowerCase()) !== -1;
  });

  const relatedArtistsCheckTwo = [];

  for (let i = 0; i < artists.length; i++) {
    for (let j = 0; j < relatedArtistNames.length; j++) {
      if (relatedArtistNames[j] === artists[i].name.toLowerCase()) {
        relatedArtistsCheckTwo.push(artists[i]);
      }
    }
  }

  if (relatedArtistsCheckTwo.length >= 1) {
    return relatedArtistsCheckTwo;
  }

  return [null];
};

export default AppReducer;
