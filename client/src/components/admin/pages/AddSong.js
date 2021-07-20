import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../../context/global state/GlobalState';
import { Header } from '../layouts/Header';
import marked from 'marked';

export const AddSong = ({ editing, id }) => {
  const {
    uploadSong,
    songs,
    updateSong,
    errorMessage,
    successMessage,
    loading,
  } = useContext(GlobalContext);

  const songToEdit = songs.filter((song) => {
    return song.id === id;
  });

  const [currentLength, setCurrentLength] = useState(0);
  const [songIntroValue, setSongIntroValue] = useState(
    editing ? songToEdit[0].description : ''
  );
  const [artistName, setArtistName] = useState(
    editing ? songToEdit[0].artist : ''
  );
  const [thumbnail, setThumbnail] = useState(
    editing ? songToEdit[0].thumbnail : ''
  );
  const [songTitle, setSongTitle] = useState(
    editing ? songToEdit[0].title : ''
  );
  const [downloadLink, setDownloadLink] = useState(
    editing ? songToEdit[0].downloadLink : ''
  );
  const [genre, setGenre] = useState(editing ? songToEdit[0].genre : 'praise');

  const calculateWords = (e) => {
    const valuesInArray = e.target.value.split(' ');
    const newValuesInArray = valuesInArray.filter((valueInArray) => {
      return valueInArray;
    });
    setCurrentLength(newValuesInArray.length);
    if (currentLength > 100) {
      return;
    } else {
      setSongIntroValue(e.target.value);
    }
  };

  const formatLineBrk = () => {
    const textarea = document.getElementById('intro');
    const caretPosition = getCaretPosition(textarea);

    const currentValueInArr = songIntroValue.split('');
    const length = currentValueInArr.length;
    currentValueInArr.splice(caretPosition, 0, '<br />');

    setSongIntroValue(currentValueInArr.join(''));
    if (length === caretPosition) {
      textarea.focus();
    }
  };

  const formatLink = () => {
    const textarea = document.getElementById('intro');
    const caretPosition = getCaretPosition(textarea);

    const currentValueInArr = songIntroValue.split('');
    const length = currentValueInArr.length;
    currentValueInArr.splice(caretPosition, 0, '[text](#)');

    setSongIntroValue(currentValueInArr.join(''));
    if (length === caretPosition) {
      textarea.focus();
    }
  };

  const formatStyle = () => {
    const textarea = document.getElementById('intro');
    const caretPosition = getCaretPosition(textarea);

    const currentValueInArr = songIntroValue.split('');
    const length = currentValueInArr.length;
    currentValueInArr.splice(caretPosition, 0, '**');

    setSongIntroValue(currentValueInArr.join(''));
    if (length === caretPosition) {
      textarea.focus();
    }
  };

  const formatWeight = () => {
    const textarea = document.getElementById('intro');
    const caretPosition = getCaretPosition(textarea);

    const currentValueInArr = songIntroValue.split('');
    const length = currentValueInArr.length;
    currentValueInArr.splice(caretPosition, 0, '****');

    setSongIntroValue(currentValueInArr.join(''));
    if (length === caretPosition) {
      textarea.focus();
    }
  };

  const getCaretPosition = (field) => {
    let caretPosition = 0;
    if (document.selection) {
      field.focus();
      const selectionRange = document.selection.createRange();
      selectionRange.moveStart('character', field.value.length);
      caretPosition = selectionRange.text.length;
    } else if (
      field.selectionStart ||
      typeof field.selectionStart === 'number'
    ) {
      caretPosition =
        field.selectionDirection === 'backward'
          ? field.selectionStart
          : field.selectionEnd;
    }
    return caretPosition;
  };
  // upload song to database
  const submitSong = (e) => {
    e.preventDefault();

    const song = {
      title: songTitle,
      description: songIntroValue,
      artist: artistName,
      downloadLink,
      thumbnail,
      genre,
    };

    editing ? updateSong(id, song) : uploadSong(song);
  };
  return (
    <div>
      <Header />
      <main className='admin-main l'>
        <h3 className='page-title artist-title' style={{ margin: '0 30px' }}>
          {editing ? 'Edit Song' : 'Add Song'}
        </h3>
        <form className='posting' onSubmit={submitSong}>
          <label className='label-title'>
            Genre{' '}
            <i className='fas fa-info-circle'>
              <div className='info-content'>
                <p>Select the genre of the song.</p>
              </div>
            </i>
          </label>
          <select
            defaultValue={genre}
            name='genre'
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value='praise'>Praise</option>
            <option value='worship'>Worship</option>
            <option value='rap'>Rap</option>
          </select>
          <label className='label-title'>
            Song Title{' '}
            <i className='fas fa-info-circle'>
              <div className='info-content'>
                <p>Only title of the song and featured artist(s).</p>
              </div>
            </i>
          </label>
          <input
            type='text'
            name='title'
            placeholder='Enter song title'
            required
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
          />
          <label className='label-title'>
            Artist{' '}
            <i className='fas fa-info-circle'>
              <div className='info-content'>
                <p>Only the artist of the song (not featured artist(s)).</p>
              </div>
            </i>
          </label>
          <input
            type='text'
            value={artistName}
            name='artist'
            placeholder='Enter artist'
            required
            onChange={(e) => setArtistName(e.target.value)}
          />
          <label className='label-title'>
            Image Link{' '}
            <i className='fas fa-info-circle'>
              <div className='info-content'>
                <p>The link to view the song image.</p>
              </div>
            </i>
          </label>
          <input
            type='text'
            name='img'
            placeholder='Enter image link'
            required
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
          />
          <label className='label-title'>
            Audio Link{' '}
            <i className='fas fa-info-circle'>
              <div className='info-content'>
                <p>The link to download this song.</p>
              </div>
            </i>
          </label>
          <input
            type='text'
            name='img'
            placeholder='Enter audio link'
            required
            value={downloadLink}
            onChange={(e) => setDownloadLink(e.target.value)}
          />
          <div className='with-helpers'>
            <label className='label-title'>
              Song Intro (Markdown Editor){' '}
              <i className='fas fa-info-circle'>
                <div className='info-content'>
                  <p>
                    Introduce the song with some texts in Markdown. Max: 100
                    words
                  </p>
                </div>
              </i>
            </label>
            <div className='helpers'>
              <p className='format-btn' onClick={formatLineBrk}>
                Line Break
              </p>
              <p className='format-btn' onClick={formatLink}>
                Link
              </p>
              <p className='format-btn' onClick={formatWeight}>
                Bold
              </p>
              <p className='format-btn' onClick={formatStyle}>
                Italics
              </p>
            </div>
          </div>
          <textarea
            name='intro'
            placeholder='Start typing'
            id='intro'
            onChange={calculateWords}
            value={songIntroValue}
            required
          ></textarea>
          <p className='words'>{currentLength} Words</p>
          <label className='label-title'>
            Song Intro Preview{' '}
            <i className='fas fa-info-circle'>
              <div className='info-content'>
                <p>
                  This is a live preview of the text you write for song intro.
                </p>
              </div>
            </i>
          </label>
          <div className='markdown-preview'>
            <p
              dangerouslySetInnerHTML={{
                __html: marked(
                  songIntroValue ? songIntroValue : 'Start typing'
                ),
              }}
            ></p>
          </div>
          <input
            type='submit'
            value={
              loading ? 'loading...' : editing ? 'Update Song' : 'Submit Song'
            }
            id='submit-song'
          />
          <a className='close-form' href='songs'>
            Cancel
          </a>
          {errorMessage && (
            <p className='page-title admin artist-title error'>
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className='page-title admin artist-title success'>
              {successMessage}
            </p>
          )}
        </form>
      </main>
    </div>
  );
};
