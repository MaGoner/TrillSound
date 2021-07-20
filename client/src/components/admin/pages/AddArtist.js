import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../../context/global state/GlobalState';
import { Header } from '../layouts/Header';
import marked from 'marked';

export const AddArtist = ({ editing, id }) => {
  const {
    uploadArtist,
    artists,
    updateArtist,
    loading,
    successMessage,
    errorMessage,
  } = useContext(GlobalContext);

  const artistToEdit = artists.filter((artist) => {
    return artist.name.toLowerCase() === id.toLowerCase(); // recall name was used as the id in server
  });

  const [currentLength, setCurrentLength] = useState(0);
  const [bioValue, setBioValue] = useState(editing ? artistToEdit[0].bio : '');
  const [artistName, setArtistName] = useState(
    editing ? artistToEdit[0].name : ''
  );
  const [thumbnail, setThumbnail] = useState(
    editing ? artistToEdit[0].thumbnail : ''
  );
  const [facebookLink, setFacebookLink] = useState(
    editing
      ? artistToEdit[0].facebookLink
        ? artistToEdit[0].facebookLink
        : ''
      : ''
  );
  const [twitterLink, setTwitterLink] = useState(
    editing
      ? artistToEdit[0].twitterLink
        ? artistToEdit[0].twitterLink
        : ''
      : ''
  );
  const [kingschatLink, setKingschatLink] = useState(
    editing
      ? artistToEdit[0].kingschatLink
        ? artistToEdit[0].kingschatLink
        : ''
      : ''
  );
  const [instagramLink, setInstagramLink] = useState(
    editing ? (artistToEdit[0].instaLink ? artistToEdit[0].instaLink : '') : ''
  );
  const [youtubeLink, setYoutubeLink] = useState(
    editing
      ? artistToEdit[0].youtubeLink
        ? artistToEdit[0].youtubeLink
        : ''
      : ''
  );

  const calculateWords = (e) => {
    const valuesInArray = e.target.value.split(' ');
    const newValuesInArray = valuesInArray.filter((valueInArray) => {
      return valueInArray;
    });
    setCurrentLength(newValuesInArray.length);
    if (currentLength > 100) {
      return;
    } else {
      setBioValue(e.target.value);
    }
  };

  const formatLineBrk = () => {
    const textarea = document.getElementById('intro');
    const caretPosition = getCaretPosition(textarea);

    const currentValueInArr = bioValue.split('');
    const length = currentValueInArr.length;
    currentValueInArr.splice(caretPosition, 0, '<br />');

    setBioValue(currentValueInArr.join(''));
    if (length === caretPosition) {
      textarea.focus();
    }
  };

  const formatLink = () => {
    const textarea = document.getElementById('intro');
    const caretPosition = getCaretPosition(textarea);

    const currentValueInArr = bioValue.split('');
    const length = currentValueInArr.length;
    currentValueInArr.splice(caretPosition, 0, '[text](#)');

    setBioValue(currentValueInArr.join(''));
    if (length === caretPosition) {
      textarea.focus();
    }
  };

  const formatStyle = () => {
    const textarea = document.getElementById('intro');
    const caretPosition = getCaretPosition(textarea);

    const currentValueInArr = bioValue.split('');
    const length = currentValueInArr.length;
    currentValueInArr.splice(caretPosition, 0, '**');

    setBioValue(currentValueInArr.join(''));
    if (length === caretPosition) {
      textarea.focus();
    }
  };

  const formatWeight = () => {
    const textarea = document.getElementById('intro');
    const caretPosition = getCaretPosition(textarea);

    const currentValueInArr = bioValue.split('');
    const length = currentValueInArr.length;
    currentValueInArr.splice(caretPosition, 0, '****');

    setBioValue(currentValueInArr.join(''));
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

  // upload artist to db
  const submitArtist = (e) => {
    e.preventDefault();

    const artist = {
      name: artistName,
      bio: bioValue,
      facebookLink,
      twitterLink,
      instagramLink,
      kingschatLink,
      youtubeLink,
      thumbnail,
    };

    editing ? updateArtist(artist) : uploadArtist(artist);
  };

  return (
    <div>
      <Header />
      <main className='admin-main l'>
        <h3 className='page-title artist-title' style={{ margin: '0 30px' }}>
          Add Artist Biography
        </h3>
        <form className='posting' onSubmit={submitArtist}>
          <label className='label-title'>
            Artist{' '}
            <i className='fas fa-info-circle'>
              <div className='info-content'>
                <p>Name of the Artist.</p>
              </div>
            </i>
          </label>
          <input
            type='text'
            value={artistName}
            name='img'
            placeholder='Enter artist'
            required
            onChange={(e) => setArtistName(e.target.value)}
          />
          <label className='label-title'>
            Image Link{' '}
            <i className='fas fa-info-circle'>
              <div className='info-content'>
                <p>The link to view the artist image.</p>
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
            Facebook Link{' '}
            <i className='fas fa-info-circle'>
              <div className='info-content'>
                <p>Link to this artist's Facebook handle.</p>
              </div>
            </i>
          </label>
          <input
            type='text'
            name='fb'
            placeholder='Enter image caption'
            value={facebookLink}
            onChange={(e) => setFacebookLink(e.target.value)}
          />
          <label className='label-title'>
            Twitter Link{' '}
            <i className='fas fa-info-circle'>
              <div className='info-content'>
                <p>Link to this artist's Twitter handle.</p>
              </div>
            </i>
          </label>
          <input
            type='text'
            name='tw'
            placeholder='Enter image caption'
            value={twitterLink}
            onChange={(e) => setTwitterLink(e.target.value)}
          />
          <label className='label-title'>
            Instagram Link{' '}
            <i className='fas fa-info-circle'>
              <div className='info-content'>
                <p>Link to this artist's Instagram handle.</p>
              </div>
            </i>
          </label>
          <input
            type='text'
            name='in'
            placeholder='Enter image caption'
            value={instagramLink}
            onChange={(e) => setInstagramLink(e.target.value)}
          />
          <label className='label-title'>
            KingsChat Link{' '}
            <i className='fas fa-info-circle'>
              <div className='info-content'>
                <p>Link to this artist's KingsChat handle.</p>
              </div>
            </i>
          </label>
          <input
            type='text'
            name='kc'
            placeholder='Enter image caption'
            value={kingschatLink}
            onChange={(e) => setKingschatLink(e.target.value)}
          />
          <label className='label-title'>
            Youtube Link{' '}
            <i className='fas fa-info-circle'>
              <div className='info-content'>
                <p>Link to this artist's Youtube handle.</p>
              </div>
            </i>
          </label>
          <input
            type='text'
            name='yt'
            placeholder='Enter image caption'
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />

          <div className='with-helpers'>
            <label className='label-title'>
              Artist Bio{' '}
              <i className='fas fa-info-circle'>
                <div className='info-content'>
                  <p>A short biography of the artist. Max: 100 words</p>
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
            id='intro'
            placeholder='Start typing'
            onChange={calculateWords}
            value={bioValue}
            required
          ></textarea>
          <p className='words'>{currentLength} Words</p>
          <label className='label-title'>
            Artist Bio Preview{' '}
            <i className='fas fa-info-circle'>
              <div className='info-content'>
                <p>
                  This is a live preview of the text you write for Artist Bio.
                </p>
              </div>
            </i>
          </label>
          <div className='markdown-preview'>
            <p
              dangerouslySetInnerHTML={{
                __html: marked(bioValue ? bioValue : 'Start typing'),
              }}
            ></p>
          </div>
          <input
            type='submit'
            value='Submit Biography'
            id='submit-bio'
            value={
              loading
                ? 'loading...'
                : editing
                ? 'Update Artist Bio'
                : 'Submit Artist Bio'
            }
          />
          <a className='close-form' href='artists'>
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
