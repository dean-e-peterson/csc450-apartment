const express = require('express');
const router = express.Router();
const { check, validationResult, body } = require('express-validator');
const auth = require('../../middleware/auth');

const Application = require('../../models/Application');

// @route   /api/applications
// @desc    Create application
// @access  Private
router.post(
  '/',
  auth,
  [
    check('user', 'User is required').not().isEmpty(),
    check('references.*.name', 'Reference name is required').not().isEmpty(),
    check('references.*.phone', 'Reference phone is required').not().isEmpty(),
    check('references.*.email', 'Reference email must be a valid email address').isEmail(),
    check('references.*.relation', 'Reference relation is required').not().isEmpty(),
    check('backgroundPermission', 'Background permission must be true or false').isBoolean(),
    check('creditPermission', 'Credit permission must be true or false').isBoolean(),
  ],
  async (req, res) => {
    // Only allow a person to submit an application for themself.
    if (!(req.user.id === req.body.user)) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
    }

    // Apply validations.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });      
    }
    
    try {
      // Make sure user does not already have an application.
      const existing = await Application.findOne({ user: req.body.user });
      if (existing) {
        return res.status(400).json({ errors: [ { msg: 'Application for that user already exists' }] });
      }      

      const application = new Application(req.body);
      application.save();

      res.json(application);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;