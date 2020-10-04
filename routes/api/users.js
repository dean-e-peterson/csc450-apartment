const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/', 
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
          id: user.id // ID from saving user to database.
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