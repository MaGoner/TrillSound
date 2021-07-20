const express = require('express');
const db = require('../config/firebase');
const uuid = require('uuid');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const router = express.Router();

// route:  /api/admin/register
// desc:   register an admin
// access: public

router.post('/register', async (req, res) => {
  const { username, password, zone, socialHandle, adminAuth } = req.body;

  if (!username || !password || !zone) {
    return res.status(400).json({
      errorMsg: 'All fields are required',
    });
  }

  if (adminAuth !== config.get('admin_auth')) {
    return res.status(401).json({
      errorMsg: 'Unauthorized, you cannot create an admin account',
    });
  }

  try {
    // check if username exists
    const adminsRef = await db.collection('admins').doc(username).get();

    if (adminsRef.exists) {
      return res.status(400).json({
        errorMsg: 'Username already exists, pick another one.',
      });
    }

    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(password, salt, async (err, hashedPassword) => {
        if (err) throw err;
        await db.collection('admins').doc(username).set({
          id: uuid.v4(),
          zone,
          password: hashedPassword,
          username,
          socialHandle,
        });
      });
    });
    res.json({
      msg: 'Account created successfully',
    });
  } catch (err) {
    return res.status(500).json({
      errorMsg: 'Internal server error',
    });
  }
});

// route:  /api/admin/login
// desc:   admin login
// access: public

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      errorMsg: 'All fields are required',
    });
  }

  try {
    const userRef = await db.collection('admins').doc(username).get();

    if (!userRef.exists) {
      return res.status(400).json({
        errorMsg:
          "This user doesn't exist, check your username and try again. If you don't remember contact Elijah",
      });
    }

    bcrypt.compare(password, userRef.data().password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        return res.status(400).json({
          errorMsg: 'Password is incorrect. If forgotten contact Elijah.',
        });
      }

      jwt.sign(
        { username, id: userRef.data().id },
        config.get('jwt_secret'),
        { algorithm: 'HS256', expiresIn: 86400 },
        (err, token) => {
          if (err) throw err;
          res.json({
            msg: 'Log in successful',
            token,
          });
        }
      );
    });
  } catch (err) {
    return res.status(500).json({
      errorMsg: 'Internal server error',
    });
  }
});

// route:  /api/admin
// desc:   get the signed-in admin
// access: private

router.get('/', auth, async (req, res) => {
  const { username: userName } = req.admin;

  try {
    const adminsRef = await db.collection('admins').doc(userName).get();
    const { username, id, zone, socialHandle } = adminsRef.data();

    const songsUploaded = await getAdminSongs(username);
    if (songsUploaded.errorMsg) {
      return res.status(songsUploaded.status).json(songsUploaded.errorMsg);
    }

    const biosUploaded = await getAdminBios(username);
    if (biosUploaded.errorMsg) {
      return res.status(biosUploaded.status).json(biosUploaded.errorMsg);
    }

    res.json({
      admin: {
        username,
        id,
        zone,
        socialHandle,
        songsUploaded: songsUploaded.songs,
        artistsUploaded: biosUploaded.bios,
      },
    });
  } catch (err) {
    return res.status(500).json({
      errorMsg: 'Internal server error',
    });
  }
});

const getAdminSongs = async (username) => {
  try {
    const songsRef = await db
      .collection('songs')
      .where('admin', '==', username)
      .get();

    // if (songsRef.empty) {
    //   return {
    //     status: 404,
    //     errorMsg: 'You have not uploaded any song yet'
    //   }
    // }

    const allSongsByAdmin = [];
    songsRef.forEach((song) => {
      allSongsByAdmin.push(song.data());
    });

    return {
      songs: allSongsByAdmin,
    };
  } catch (err) {
    return {
      status: 500,
      errorMsg: 'Internal server error',
    };
  }
};

const getAdminBios = async (username) => {
  try {
    const biosRef = await db
      .collection('bios')
      .where('admin', '==', username)
      .get();

    // if (biosRef.empty) {
    //   return {
    //     status: 404,
    //     errorMsg: 'You have not uploaded any bio yet'
    //   }
    // }

    const allBiosByAdmin = [];
    biosRef.forEach((bio) => {
      allBiosByAdmin.push(bio.data());
    });

    return {
      bios: allBiosByAdmin,
    };
  } catch (err) {
    return {
      status: 500,
      errorMsg: 'Internal server error',
    };
  }
};

// route:  /api/admin/change-password
// desc:   change password of admin
// access: private

router.put('/change-password', auth, async (req, res) => {
  const { username } = req.admin;
  const { oldPassword, newPassword } = req.body;

  try {
    const adminsRef = await db.collection('admins').doc(username).get();

    bcrypt.compare(oldPassword, adminsRef.data().password, (err, isMatch) => {
      if (err) throw err;

      if (!isMatch) {
        return res.status(400).json({
          errorMsg:
            "Current password doesn't match. If forgotten contact Elijah.",
        });
      }

      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newPassword, salt, async (err, hashedPassword) => {
          if (err) throw err;
          await db.collection('admins').doc(username).update({
            password: hashedPassword,
          });
        });
      });

      res.json({
        msg:
          'Password changed successfully. Contact Elijah to inform him of the new password.',
      });
    });
  } catch (err) {
    return res.status(500).json({
      errorMsg: 'Internal server error',
    });
  }
});

router.use('/bios', require('./bios'));
router.use('/songs', require('./songs'));

module.exports = router;
