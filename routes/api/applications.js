const express = require('express');
const router = express.Router();
const { check, validationResult, body } = require('express-validator');
const auth = require('../../middleware/auth');

const Application = require('../../models/Application');

// @route   GET /api/applications
// @desc    Get all applications
// @access  Private
router.get('/', auth, async (req, res) => {
  // Restrict to staff.
  if (!req.user.isStaff) {
    return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
  }
  
  try {
    const applications = await Application.find();

    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/applications
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
    // Only allow a person to submit an application for themself unless they are staff.
    if (! (req.user.isStaff || req.user.id === req.body.user)) {
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

// @route   GET /api/applications/user/:id
// @desc    Get application by USER's ID
// @access  Private
router.get('/user/:id', auth, async (req, res) => {
  // Only allow a user to query themselves unless they are staff.
  if (! (req.user.isStaff || req.user.id === req.params.id)) {
    return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
  }
  
  try {
    const application = await Application.findOne({ user: req.params.id });
    if (!application) {
      return res.status(404).json({ errors: [{ msg: 'Application not found' }] });
    }

    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PATCH /api/applications/:id
// @desc    Update existing application by application's ID
// @access  Private
// TODO: ### Test changing references and see how it behaves.
router.patch(
  '/:id',
  auth,
  [
    check('references.*.email', 'Reference email must be a valid email address').optional().isEmail(),
    check('backgroundPermission', 'Background permission must be true or false').optional().isBoolean(),
    check('creditPermission', 'Credit permission must be true or false').optional().isBoolean(),
  ],
  async (req, res) => {
    // Check validation results.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const application = await Application.findById(req.params.id);

      if (!application) {
        return res.status(400).json({ errors: [{ msg: 'Application not found' }] });
      }

      // Only allow a user to modify their own info, unless they're staff.
      // Note: Checking this is deferred until here because we need to query
      // the application before seeing if its user matches.
      if (! (req.user.isStaff || req.user.id === application.user.toString())) {
        return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
      }

      const query = await application.updateOne(req.body);

      res.end();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE /api/applications/:id
// @desc    Delete existing application by application's ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(400).json({ errors: [{ msg: 'Application not found' }] });
    }

    // Only allow a user to delete their own info, unless they're staff.
    // Note: Checking this is deferred until here because we need to query
    // the application before seeing if its user matches.
    if (! (req.user.isStaff || req.user.id === application.user.toString())) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
    }

    await application.delete();

    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;