const express = require('express');
const db = require('../config/firebase');
const auth = require('../middlewares/auth');
const uuid = require('uuid');
const { firestore } = require('firebase-admin');
const router = express.Router();

// ALERT! name is used as the identifier

// route:  /api/admin/bios/new
// desc:   add bio
// access: private
router.post('/new', auth, async (req, res) => {
  const { username } = req.admin;
  const {
    name,
    bio,
    facebookLink,
    twitterLink,
    instagramLink,
    kingschatLink,
    youtubeLink,
  } = req.body;

  let thumbnail = req.body.thumbnail;

  if (!name || !bio || !thumbnail) {
    return res.status(400).json({
      errorMsg: 'Missing required fields (bio, name, thumbnail)',
    });
  }

  thumbnail = destructureLinkForId(thumbnail);

  try {
    const nameAsId = name.toLowerCase();
    const biosRef = await db.collection('bios').doc(nameAsId).get();
    if (biosRef.exists) {
      return res.status(400).json({
        errorMsg:
          "This artist's biography already exists. You can update it with the edit icon on the biography in your dashboard. If you can't find this biography in your dashboard, then another admin created it.",
      });
    }

    const biosDoc = await db.collection('bios').get();
    let currentIndex = biosDoc.docs.length + 1;

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
    await db
      .collection('bios')
      .doc(nameAsId)
      .set({
        admin: username,
        kingschatLink: kingschatLink ? kingschatLink : null,
        facebookLink: facebookLink ? facebookLink : null,
        twitterLink: twitterLink ? twitterLink : null,
        youtubeLink: youtubeLink ? youtubeLink : null,
        instagramLink: instagramLink ? instagramLink : null,
        bio,
        name: name.toLowerCase(),
        thumbnail,
        id: uuid.v4(),
        songs: [],
        index: currentIndex,
        numOfPageViews: 0,
        createdAt: `${
          months[date.getMonth()]
        } ${date.getDate()}, ${date.getFullYear()}`,
      });

    await generallyAttributeSongs(nameAsId);
    res.json({
      msg: 'Bio created successfully',
    });
  } catch (err) {
    return res.status(500).json({
      errorMsg: 'Internal server error',
    });
  }
});

// route:  /api/admin/bios/update
// desc:   update bio
// access: private
router.put('/update', auth, async (req, res) => {
  const {
    name,
    bio,
    facebookLink,
    twitterLink,
    instagramLink,
    kingschatLink,
    youtubeLink,
  } = req.body;

  let thumbnail = req.body.thumbnail;

  if (!name || !bio || !thumbnail) {
    return res.status(400).json({
      errorMsg: 'Missing required (bio, name, thumbnail) fields',
    });
  }

  thumbnail = destructureLinkForId(thumbnail);

  try {
    const nameAsId = name.toLowerCase();
    const biosRef = await db.collection('bios').doc(nameAsId).get();
    if (!biosRef.exists) {
      return res.status(400).json({
        errorMsg:
          "This artist's biography does not exist. It may have been deleted in the database. Contact Elijah if this error persists..",
      });
    }

    await db
      .collection('bios')
      .doc(nameAsId)
      .update({
        kingschatLink: kingschatLink ? kingschatLink : null,
        facebookLink: facebookLink ? facebookLink : null,
        twitterLink: twitterLink ? twitterLink : null,
        youtubeLink: youtubeLink ? youtubeLink : null,
        instagramLink: instagramLink ? instagramLink : null,
        bio,
        name,
        thumbnail,
      });

    await generallyAttributeSongs(nameAsId);
    res.json({
      msg: 'Bio updated successfully',
    });
  } catch (err) {
    return res.status(500).json({
      errorMsg: 'Internal server error',
    });
  }
});

const destructureLinkForId = (link) => {
  if (link.indexOf('export') !== -1) {
    const queries = link.split('=');
    return queries[queries.length - 1]; // last element
  }

  const params = link.split('/');
  return params[params.indexOf('d') + 1];
};

const generallyAttributeSongs = async (artistNameInBio) => {
  try {
    const songsRef = await db
      .collection('songs')
      .where('attributed', '==', false)
      .get();
    if (songsRef.empty) {
      return;
    }

    songsRef.forEach(async (song) => {
      const { artist: artistNameInSong } = song.data();

      if (artistNameInSong === artistNameInBio) {
        await db
          .collection('bios')
          .doc(artistNameInBio)
          .update({
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

// route:  /api/admin/bios/delete/:name
// desc:   delete bio
// access: private
router.delete('/delete/:name', auth, async (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).json({
      errorMsg: 'No identifier provided',
    });
  }

  try {
    const nameAsId = name.toLowerCase();
    const biosRef = await db.collection('bios').doc(nameAsId).get();
    if (!biosRef.exists) {
      return res.status(400).json({
        errorMsg:
          "This artist's biography does not exist. It may have been deleted in the database. Contact Elijah if this error persists..",
      });
    }

    // unattribute songs from this artist
    await unattributeSongs(biosRef);

    await db.collection('bios').doc(nameAsId).delete();

    res.json({
      msg: 'Bio deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({
      errorMsg: 'Internal server error',
    });
  }
});

const unattributeSongs = async (biosRef) => {
  try {
    biosRef.data().songs.forEach(async (artistSongId) => {
      await db.collection('songs').doc(artistSongId).update({
        attributed: false,
      });
    });
  } catch (err) {
    return;
  }
};

module.exports = router;
