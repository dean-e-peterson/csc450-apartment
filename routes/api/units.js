const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Unit = require('../../models/Unit');
const User = require('../../models/User');

// @route   GET /api/units
// @desc    Get all units
// @access  Private
router.get('/', auth, async (req, res) => {
  // Staff only.
  if (!req.user.isStaff) {
    return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
  }

  try {
    const units = await Unit.find();

    res.json(units);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
})

// @route   POST /api/units
// @desc    Create unit
// @access  Private
router.post(
  '/',
  auth,
  [
    check('number', 'Unit number is required').not().isEmpty(),
    check('bedrooms', 'Bedrooms must be a number').isNumeric(),
  ],
  async (req, res) => {
    // Staff only.
    if (!req.user.isStaff) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
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
        return res.status(400).json({ errors: [{ msg: 'Another unit has that number' }] });
      }

      // Save unit.
      const unit = new Unit({
        number: req.body.number,
        bedrooms: req.body.bedrooms,
      });
      unit.save();

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
    return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
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
  [
    check('bedrooms', 'Bedrooms must be a number').optional().isNumeric(),
  ],
  async (req, res) => {
    // Staff only.
    if (!req.user.isStaff) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
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
          return res.status(400).json({ errors: [{ msg: 'Another unit has that number' }] });
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
    return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
  }

  try {
    // Find and remove unit.
    const query = await Unit.findByIdAndDelete(req.params.id);
    if (!query) {
      return res.status(400).json({ errors: [ { msg: 'Unit not found' }] });
    }
    
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

