const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Location = require('../../models/Location');

// @route   GET api/locations
// @desc    Get all locations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const locations = await Location
      .find()
      .collation({locale: 'en'}) // Make sort case-insensitive.
      .sort({homePageOrder: 1});

    res.json(locations);    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/locations
// @desc    Create new location
// @access  Private
router.post(
  '/',
  auth,
  [
    check('homePageOrder', 'Home page order must be a number').isNumeric(),
    check('abbreviation', 'Abbreviation is required').not().isEmpty(),
    check('address1', 'Address line 1 is required').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
    check('state', 'State is required').not().isEmpty(),            
    check('postalCode', 'Postal code is required').not().isEmpty(),
  ],
  async (req, res) => {
    // Staff only.
    if (!req.user.isStaff) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized' }] });
    }

    // Apply validations.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const location = new Location({
        homePageOrder: req.body.homePageOrder,
        abbreviation: req.body.abbreviation,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        description: req.body.description,
      });

      await location.save();

      res.json(location);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;