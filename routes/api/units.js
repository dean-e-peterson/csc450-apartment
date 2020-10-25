const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Unit = require('../../models/Unit');
const User = require('../../models/User');

// @route   GET /api/units/vacancies
// @desc    Get vacant units
// @access  Public
router.get('/vacancies', async (req, res) => {
  try {
    const units = await Unit.aggregate([
      { // Bring in users with that unit as a tenants array.
        "$lookup": {
          "from": "users",
          "localField": "_id",
          "foreignField": "unit",
          "as": "tenants",
        }
      },
      { // Match only unit records with tenants array length 0.
        "$match": {
          "tenants": { "$size" : 0 }
        }
      },
      { // Get rid of the empty tenants array from the result.
        "$unset": "tenants"
      },
    ]);

    res.json(units);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route   GET /api/units
// @desc    Get all units
// @access  Private
router.get('/', auth, async (req, res) => {
  // Staff only.
  if (!req.user.isStaff) {
    return res.status(403).json({ errors: [{ msg: 'Not authorized' }] });
  }

  try {
    const units = await Unit
      .find()
      .collation({ locale: 'en' }) // Make sort case-insensitive.
      .sort({location: 1, number: 1});

    // ### If you want tenants from users to come back as a subobject.
    // // Lean gives you a plain javascript object you can modify.
    // const units = await Unit.find().lean();
    // for (const unit of units) {
    //   let users = await User.find({ unit: unit }).select('-password');
    //   unit['tenants'] = users;
    // }

    // ### Another way to include tenants with one db trip.
    // const units = await Unit.aggregate([
    //   {
    //     "$lookup": {
    //       "from": "users",
    //       "localField": "_id",
    //       "foreignField": "unit",
    //       "as": "tenants",
    //     }
    //   },
    //   {
    //     "$unset": "tenants.password"
    //   }
    // ]);

    res.json(units);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/units
// @desc    Create unit
// @access  Private
router.post(
  '/',
  auth,
  [
    check('location', 'Apartment complex is required').not().isEmpty(),
    check('number', 'Unit number is required').not().isEmpty(),
    check('bedrooms', 'Bedrooms must be a number').isNumeric(),
    check('bathrooms', 'Bathrooms must be a number').isNumeric(),
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
      // Make sure unit doesn't already exist.
      const existingUnit = await Unit.findOne({ number: req.body.number });
      if (existingUnit) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Another unit has that number' }] });
      }

      // Save unit.
      const unit = new Unit({
        location: req.body.location,
        number: req.body.number,
        bedrooms: req.body.bedrooms,
        bathrooms: req.body.bathrooms
      });
      await unit.save();

      res.end();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET /api/units/:id
// @desc    Get one unit
// @access  Private
router.get('/:id', auth, async (req, res) => {
  // TODO: Change to allow tenant to get their own unit?
  // Staff only.
  if (!req.user.isStaff) {
    return res.status(403).json({ errors: [{ msg: 'Not authorized' }] });
  }

  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(400).json({ errors: [{ msg: 'Unit not found' }] });
    }

    // Return unit.
    res.json(unit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PATCH /api/units/:id
// @desc    Modify a unit by ID
// @access  Private
router.patch(
  '/:id',
  auth,
  [check('bedrooms', 'Bedrooms must be a number').optional().isNumeric()],
  async (req, res) => {
    // Staff only.
    if (!req.user.isStaff) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized' }] });
    }

    // Check validation results.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check for duplicate unit.
      if (req.body.number) {
        const existingUnit = await Unit.findOne({ number: req.body.number });
        if (existingUnit) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Another unit has that number' }] });
        }
      }

      // Update unit.
      const query = await Unit.findByIdAndUpdate(req.params.id, req.body);
      if (!query) {
        return res.status(400).json({ errors: [{ msg: 'Unit not found' }] });
      }

      res.end();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE /api/units/:id
// @desc    Delete unit by id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  // Staff only.
  if (!req.user.isStaff) {
    return res.status(403).json({ errors: [{ msg: 'Not authorized' }] });
  }

  try {
    // Remove unit from any Users it appears on.
    const users = await User.find({ unit: req.params.id });
    for (const user of users) {
      user.unit = null;
      await user.save();
    }

    // Find and remove unit.
    const query = await Unit.findByIdAndDelete(req.params.id);
    if (!query) {
      return res.status(400).json({ errors: [{ msg: 'Unit not found' }] });
    }

    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
