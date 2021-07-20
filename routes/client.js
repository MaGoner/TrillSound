const express = require('express');
const db = require('../config/firebase');
const { firestore } = require('firebase-admin');
const router = express.Router();

// route:  /api/songs
// desc:   get all songs
// access: public

router.get('/songs', async (req, res) => {
  try {
    const songsRef = await db.collection('songs').get();

    const allSongs = [];
    songsRef.forEach((song) => {
      allSongs.push(song.data());
    });
    res.json({
      songs: allSongs,
    });
  } catch (err) {
    res.status(500).json({
      errorMsg: 'There has been an internal server error',
    });
  }
});

// route:  /api/bios
// desc:   get all bios
// access: public

router.get('/bios', async (req, res) => {
  try {
    const biosRef = await db.collection('bios').get();

    const allBios = [];
    biosRef.forEach((bio) => {
      allBios.push(bio.data());
    });
    res.json({
      artists: allBios,
    });
  } catch (err) {
    res.status(500).json({
      errorMsg: 'There has been an internal server error',
    });
  }
});

// route:  /api/admins
// desc:   get all admins
// access: public

router.get('/admins', async (req, res) => {
  try {
    const adminsRef = await db.collection('admins').get();

    const allAdmins = [];
    adminsRef.forEach((admin) => {
      allAdmins.push(admin.data());
    });
    res.json({
      admins: allAdmins,
    });
  } catch (err) {
    res.status(500).json({
      errorMsg: 'There has been an internal server error',
    });
  }
});

// route:  /api/streams/update/:id
// desc:   update no of streams
// access: public except admins
router.get('/streams/update/:id', async (req, res) => {
  const { id } = req.params;

  // check the admin tag
  const adminTag = req.header('admin-tag');
  if (adminTag === 'true') {
    return res.status(403).json({
      errorMsg: "Admin streams don't count",
    });
  }

  try {
    await db
      .collection('songs')
      .doc(id)
      .update({
        numOfStreams: firestore.FieldValue.increment(1),
      });

    res.json({
      msg: 'done',
    });
  } catch (err) {
    res.status(500).json({
      errorMsg: 'There has been an internal server error',
    });
  }
});

// route:  /api/downloads/update/:id
// desc:   update no of downloads
// access: public except admins
router.get('/downloads/update/:id', async (req, res) => {
  const { id } = req.params;

  // check the admin tag
  const adminTag = req.header('admin-tag');
  if (adminTag === 'true') {
    return res.status(403).json({
      errorMsg: "Admin downloads don't count",
    });
  }

  try {
    await db
      .collection('songs')
      .doc(id)
      .update({
        numOfDownloads: firestore.FieldValue.increment(1),
      });

    res.json({
      msg: 'done',
    });
  } catch (err) {
    res.status(500).json({
      errorMsg: 'There has been an internal server error',
    });
  }
});

// route:  /api/artists/update/:id
// desc:   update no of artist's page views
// access: public except admins
router.get('/artists/update/:id', async (req, res) => {
  const { id } = req.params;

  // check the admin tag
  const adminTag = req.header('admin-tag');
  if (adminTag === 'true') {
    return res.status(403).json({
      errorMsg: "Admin views don't count",
    });
  }

  try {
    await db
      .collection('bios')
      .doc(`${id.toLowerCase()}`)
      .update({
        numOfPageViews: firestore.FieldValue.increment(1),
      });

    res.json({
      msg: 'done',
    });
  } catch (err) {
    res.status(500).json({
      errorMsg: 'There has been an internal server error',
    });
  }
});

module.exports = router;
