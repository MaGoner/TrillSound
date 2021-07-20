const express = require('express');
const db = require('../config/firebase');
const auth = require('../middlewares/auth');
const uuid = require('uuid');
const { firestore } = require('firebase-admin');
const router = express.Router();

// route:  /api/admin/songs/new
// desc:   add song
// access: private
router.post('/new', auth, async (req, res) => {
  const { username } = req.admin;
  let { title, description, artist, downloadLink, genre, thumbnail } = req.body;

  if (
    !description ||
    !title ||
    !thumbnail ||
    !downloadLink ||
    !artist ||
    !genre
  ) {
    return res.status(400).json({
      errorMsg: 'All fields are required',
    });
  }

  downloadLink = destructureLinkForId(downloadLink);
  thumbnail = destructureLinkForId(thumbnail);

  try {
    const songsRef = await db
      .collection('songs')
      .where('downloadLink', '==', downloadLink)
      .get();
    // since we are making use of the same storage for songs, each song should have a unique link
    if (!songsRef.empty) {
      return res.status(400).json({
        errorMsg:
          "This song already exists. You can update it with the edit icon on the song in your dashboard. If you can't find this song in your dashboard, then another admin created it.",
      });
    }

    const songsDoc = await db.collection('songs').get();
    let currentIndex = songsDoc.docs.length + 1;

    const date = new Date();
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const id = uuid.v4();
    await db
      .collection('songs')
      .doc(id)
      .set({
        admin: username,
        artist: artist.toLowerCase(),
        description,
        genre,
        downloadLink,
        title,
        thumbnail,
        id,
        createdAt: `${
          months[date.getMonth()]
        } ${date.getDate()}, ${date.getFullYear()}`,
        numOfStreams: 0,
        numOfDownloads: 0,
        index: currentIndex,
      });

    // update the artist's song if he/she has a profile already created
    const fieldback = await updateArtistBio(artist.toLowerCase(), id);

    if (fieldback.msg) {
      await db.collection('songs').doc(id).update({
        attributed: true,
      });
    } else if (fieldback.errorMsg) {
      await db.collection('songs').doc(id).update({
        attributed: false,
      });
    }

    // attribute all unattributed songs
    generallyAttributeSongs();

    res.json({
      msg: 'Song added successfully',
    });
  } catch (err) {
    return res.status(500).json({
      errorMsg: 'Internal server error',
    });
  }
});

// route:  /api/admin/songs/update/:id
// desc:   update song
// access: private
router.put('/update/:id', auth, async (req, res) => {
  let { title, description, artist, downloadLink, genre, thumbnail } = req.body;
  const { id } = req.params;

  if (
    !description ||
    !title ||
    !thumbnail ||
    !downloadLink ||
    !artist ||
    !genre ||
    !id
  ) {
    return res.status(400).json({
      errorMsg: 'All fields are required',
    });
  }

  downloadLink = destructureLinkForId(downloadLink);
  thumbnail = destructureLinkForId(thumbnail);

  try {
    const songsRef = await db.collection('songs').doc(id).get();
    if (!songsRef.exists) {
      return res.status(400).json({
        errorMsg:
          'This song does not exist. It may have been deleted in the database. Contact Elijah if this error persists..',
      });
    }

    await db.collection('songs').doc(id).update({
      artist: artist.toLowerCase(),
      genre,
      downloadLink,
      title,
      thumbnail,
      description,
    });

    // update the artist's song if he/she has a profile already created
    const fieldback = await updateArtistBio(artist.toLowerCase(), id);

    if (fieldback.msg) {
      await db.collection('songs').doc(id).update({
        attributed: true,
      });
    } else if (fieldback.errorMsg) {
      await db.collection('songs').doc(id).update({
        attributed: false,
      });
    }

    // attribute all unattributed songs
    generallyAttributeSongs();

    res.json({
      msg: 'Song updated successfully',
    });
  } catch (err) {
    return res.status(500).json({
      errorMsg: 'Internal server error',
    });
  }
});

// route:  /api/admin/songs/delete/:id
// desc:   delete song
// access: private
router.delete('/delete/:id', auth, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      errorMsg: 'No identifier provided',
    });
  }

  try {
    const songsRef = await db.collection('songs').doc(id).get();
    if (!songsRef.exists) {
      return res.status(400).json({
        errorMsg:
          'This song does not exist. It may have been deleted in the database. Contact Elijah if this error persists..',
      });
    }
    // remove song id from artist's song list
    const artistRef = db.collection('bios').doc(songsRef.data().artist);
    const artistDoc = await artistRef.get();
    if (artistDoc.exists) {
      await artistRef.update({
        songs: firestore.FieldValue.arrayRemove(id),
      });
    }

    await db.collection('songs').doc(id).delete();

    res.json({
      msg: 'Song deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({
      errorMsg: 'Internal server error',
    });
  }
});

const destructureLinkForId = (link) => {
  const queries = link.split('wp-content/uploads');
  return queries[1];
};

const updateArtistBio = async (artistId, songId) => {
  // recall artist's name is artistId in db
  try {
    const artistRef = db.collection('bios').doc(artistId);
    const artistDoc = await artistRef.get();
    if (!artistDoc.exists) {
      return {
        errorMsg: 'No artist to attribute',
      };
    }

    await artistRef.update({
      songs: firestore.FieldValue.arrayUnion(songId),
    });

    return {
      msg: 'done',
    };
  } catch (err) {
    return {
      errorMsg: 'Internal Server error',
    };
  }
};

const generallyAttributeSongs = async () => {
  try {
    const songsRef = await db
      .collection('songs')
      .where('attributed', '==', false)
      .get();
    if (songsRef.empty) {
      return;
    }

    songsRef.forEach(async (song) => {
      const { artist } = song.data();

      const artistRef = db.collection('bios').doc(artist);
      const artistDoc = await artistRef.get();
      if (artistDoc.exists && artist === artistDoc.data().name) {
        await artistRef.update({
          songs: firestore.FieldValue.arrayUnion(song.data().id),
        });

        await db.collection('songs').doc(song.data().id).update({
          attributed: true,
        });
      }
    });
  } catch (err) {
    return;
  }
};

module.exports = router;
