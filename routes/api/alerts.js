const express = require('express');
const router = express.Router();
const { check, validationResult, body } = require('express-validator');
const auth = require('../../middleware/auth');

const Alert = require('../../models/Alert');

// @route   GET /api/alerts
// @desc    Get alerts
// @access  Private
router.get('/', auth, async (req, res) => {
  // Restrict normal users to only querying their own alerts.
  if (req.user.id !== req.query.user) {
    return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });      
  }

  // Allow filtering for a particular user.
  let findParams;
  if (req.query.user) {
    findParams = { user: req.query.user };
  } else {
    findParams = {};
  }

  try {
    // Query the database.
    const alerts = await Alert.find(findParams);

    // Return results.
    res.json(alerts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route   POST /api/alerts
// @desc    Create alert
// @access  Private
router.post(
  '/',
  auth,
  [
    check('text', 'Text is required').not().isEmpty(),
  ],
  async (req, res) => {
    if (!req.user.isStaff) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
    }

    // Apply validations.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });      
    }

    try {
      const alert = new Alert(req.body);
      alert.save();

      res.json(alert);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE /api/alerts/:id
// @desc    Delete alert
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ errors: [ { msg: 'Alert not found' }] });      
    }

    if (req.user.id !== alert.user.toString()) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });      
    }

    await alert.delete();

    res.end();
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Alert not found' });
    }    
    res.status(500).send('Server error');
  }
});

module.exports = router;