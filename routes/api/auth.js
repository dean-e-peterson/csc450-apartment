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
      // Make sure user exists.
      let user = await User.findOne({ email: req.body.email });
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
          id: user.id, // ID from user in database.
          isStaff: user.isStaff,
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

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register', 
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password at least 8 characters long').isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Make sure user doesn't already exist.
      let user = await User.findOne( { email: req.body.email });
      if (user) {
        return res.status(400).json({ errors: [ { msg: 'User already exists' }] });
      }
    
      // Hash password.
      user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);

      // Save user.
      await user.save();

      // Return jsonwebtoken.
      const payload = {
        user: {
          id: user.id, // ID from saving user to database.
          isStaff: user.isStaff,          
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