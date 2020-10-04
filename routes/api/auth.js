const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Auth get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/', 
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Make sure user doesn't already exist.
      let user = await User.findOne( { email: req.body.email });
      if (!user) {
        return res.status(400).json({ errors: [ { msg: 'Invalid credentials' }] });
      }
     
      // Compare password (hashes).
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [ { msg: 'Invalid credentials' }] });
      }

      // Return jsonwebtoken.
      const payload = {
        user: {
          id: user.id // ID from user in database.
        }
      }

      jwt.sign(
        payload, 
        config.get('jwtSecret'),
        { expiresIn: config.get('jwtExpires') },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


module.exports = router;