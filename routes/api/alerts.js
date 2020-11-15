const express = require('express');
const router = express.Router();
const { check, validationResult, body } = require('express-validator');
const auth = require('../../middleware/auth');

const Alert = require('../../models/Alert');

// @route   GET /api/alerts
// @desc    Get alerts
// @access  Private


// @route   POST /api/alerts
// @desc    Create alert
// @access  Private
router.post(
  '/',
  auth,
  [
    check('type', 'Type is required').not().isEmpty(),
  ],
  async (req, res) => {
    if (!req.user.isStaff) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
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


module.exports = router;