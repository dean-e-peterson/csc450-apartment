const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');

const User = require('../../models/User');

// @route   GET api/users
// @desc    Get multiple (all) users
// @access  Private
router.get('/', auth, async (req, res) => {
  // Restrict to staff.
  if (!req.user.isStaff) {
    return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
  }

  try {
    // ### If we need to bring in unit number, this worked...
    //const users = await User.find().select('-password').populate('unit', ['number']);
    const users = await User.find().select('-password');

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users
// @desc    Add user (for staff use, see auth.js for registering as a normal user)
// @access  Private
router.post(
  '/',
  auth,
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password at least 8 characters long').isLength({ min: 8 }),
    check('isStaff', 'isStaff must be a boolean').optional().isBoolean(),
  ],
  async (req, res) => {
    // Staff only.
    if (!req.user.isStaff)
    {
      return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
    }

    // Apply validations.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });      
    }

    try {
      // Make sure user doesn't already exist.
      let user = await User.findOne( { email: req.body.email });
      if (user) {
        return res.status(400).json({ errors: [ { msg: 'User with that email already exists' }] });
      }
    
      // Hash password.
      user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        unitId: req.body.unitId,
        isStaff: req.body.isStaff,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);

      // Save user.
      await user.save();

      res.end();
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
  // Only allow a user to query themselves unless they are staff.
  if (! (req.user.isStaff || req.user.id === req.params.id)) {
    return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
  }

  try {
    // Find user in database.
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'User not found' }] });
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
router.patch(
  '/:id',
  auth,
  [
    // Optional means the field is optional, but if present, validate it.
    check('email', 'Please include a valid email').optional().isEmail(),
    check('password', 'Please enter a password at least 8 characters long').optional().isLength({ min: 8 }),
    check('isStaff', 'isStaff must be a boolean').optional().isBoolean(),    
  ],  
  async (req, res) => {
    // Only allow a user to modify their own info, unless they're staff.
    if (! (req.user.isStaff || req.user.id === req.params.id)) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });      
    }
    // Also, only staff can modify isStaff and unitId fields.
    if (!req.user.isStaff && 'isStaff' in req.body) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
    }
    if (!req.user.isStaff && 'unitId' in req.body) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
    }    

    // Check validation results.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Handle duplicate email by rejecting request.
      if (req.body.email) {
        const userWithSameEmail = await User.findOne({ email: req.body.email });
        if (userWithSameEmail) {
          return res.status(400).json({ errors: [{ msg: 'Another user has that email' }] });
        }
      }

      // The following simplification might have worked if not for the need to
      // encrypt the password, but might have allowed modifying other fields,
      // including isStaff.
      //const query = await User.findByIdAndUpdate(req.params.id, req.body);

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      }

      // Replace only fields included in the request body.
      user.firstName = 'firstName' in req.body ? req.body.firstName : user.firstName;
      user.lastName = 'lastName' in req.body ? req.body.lastName : user.lastName;
      user.email = 'email' in req.body ? req.body.email : user.email;
      user.isStaff = 'isStaff' in req.body ? req.body.isStaff : user.isStaff;

      // Always update date.
      user.date = Date.now();

      // Encrypt password.
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
  }
);

// @route   DELETE api/users/:id
// @desc    Delete user by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  // Only allow a user to delete themselves, unless they are staff.
  if (! (req.user.isStaff || req.user.id === req.params.id)) {
    return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
  }

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