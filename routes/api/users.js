const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');

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

// @route   GET api/users/:id
// @desc    Get any user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Find user in database.
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(400).json({ errors: [ { msg: 'User not found' }] });
    }
    
    // Return user.
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PATCH api/users/:id
// @desc    Modify a user by ID
// @access  Private
router.patch('/:id', auth, async (req, res) => {
  try {
    // The following simplification might have worked if not for the need to
    // encrypt the password, but might have allowed modifying other fields.
    //const query = await User.findByIdAndUpdate(req.params.id, req.body);
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ errors: [ { msg: 'User not found' }] });
    }

    // Replace only fields included in the request body.
    user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
    user.lastName = req.body.lastName ? req.body.lastName : user.lastName;
    user.email = req.body.email ? req.body.email : user.email;

    // Always update date.
    user.date = Date.now();

    // Encrypt password if it is changing.
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // Save modified user.
    user.save();
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
})

// @route   DELETE api/users/:id
// @desc    Delete user by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find and remove user.
    const query = await User.findByIdAndDelete(req.params.id);
    if (!query) {
      return res.status(400).json({ errors: [ { msg: 'User not found' }] });
    }
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



module.exports = router;