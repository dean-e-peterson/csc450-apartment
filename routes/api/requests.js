const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Request = require('../../models/Request');
const User = require('../../models/User');

// @route   POST /api/requests
// @desc    Create a request
// @access  Private
router.post(
  '/',
  auth,
  [
    check('unit', 'Unit is required').not().isEmpty(),
    check('type', 'Type is required').not().isEmpty(),
    check('summary', 'Summary is required').not().isEmpty(),
    check('status', 'Status is required').not().isEmpty(),
    check('date', 'Date must be a valid date').optional().isDate(),    
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check that user is staff or is creating a request for their own unit.
      const user = await User.findById(req.user.id);
      if (! (req.user.isStaff || user.unit.toString() === req.body.unit)) {
        return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
      }

      const newRequest = new Request(req.body);

      const request = await newRequest.save();

      res.json(request);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET /api/requests
// @desc    Get requests
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Check that user is staff or is only getting requests for their own unit.
    const user = await User.findById(req.user.id);
    if (! (req.user.isStaff || req.query.unit && req.query.unit === user.unit.toString())) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
    }
    
    // Allow filtering by unit.
    let findParams;
    if (req.query.unit) {
      findParams = { unit: req.query.unit };
    } else if (req.query.status) {
      findParams = {status: req.query.status}
    } else {
      findParams = {};
    }

    // Query database
    const requests = await Request.find(findParams).sort({ date: -1 }); // Date reverse sort.

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/requests/:id
// @desc    Get request by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Query database.
    const request = await Request.findById(req.params.id);

    // Make sure we found a request with that ID.
    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });      
    }

    // Check that user is staff or is requesting their own unit's request.
    const user = await User.findById(req.user.id);
    if (! (req.user.isStaff || user.unit.toString() === request.unit.toString())) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
    }

    // Return results.
    res.json(request);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Request not found' });
    }    
    res.status(500).send('Server error');
  }
});

// @route   PATCH /api/requests/:id
// @desc    Update request by ID
// @access  Private
router.patch(
  '/:id',
  auth,
  [
    check('date', 'Date must be a valid date').optional().isDate(),
  ],
  async (req, res) => {
    try {
      // Query database.
      const request = await Request.findById(req.params.id);

      // Make sure we found a request with that ID.
      if (!request) {
        return res.status(404).json({ msg: 'Request not found' });      
      }

      // Check that user is staff or is updating their own unit's request.
      const user = await User.findById(req.user.id);
      if (! (req.user.isStaff || user.unit.toString() === request.unit.toString())) {
        return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
      }

      request.unit = 'unit' in req.body ? req.body.unit : request.unit;
      request.type = 'type' in req.body ? req.body.type : request.type;
      request.summary = 'summary' in req.body ? req.body.summary : request.summary;
      request.details = 'details' in req.body ? req.body.details : request.details;
      request.comments = 'comments' in req.body ? req.body.comments : request.comments;
      request.status = 'status' in req.body ? req.body.status : request.status;
      request.date = 'date' in req.body ? req.body.date : request.date;

      // Save updated request in DB.
      await request.save();

      // Return results.
      res.json(request);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Request not found' });
      }    
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE /api/requests/:id
// @desc    Delete request by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Query database.
    const request = await Request.findById(req.params.id);

    // Make sure we found a request with that ID.
    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });      
    }

    // Check that user is staff or is deleting their own unit's request.
    const user = await User.findById(req.user.id);
    if (! (req.user.isStaff || user.unit.toString() === request.unit.toString())) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
    }

    await request.delete();

    res.json({ msg: 'Request removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Request not found' });
    }    
    res.status(500).send('Server error');
  }
});

module.exports = router;