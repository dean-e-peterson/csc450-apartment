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

// @route   POST api/requests/comment/:id
// @desc    Comment on a request
// @access  Private
router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Text is required').not().isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const request = await Request.findById(req.params.id);

      // Check that user is staff or is commenting on their own unit's request.
      if (! (req.user.isStaff || user.unit.toString() === request.unit.toString())) {
        return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
      }      

      const newComment = {
        text: req.body.text,
        name: user.firstName + ' ' + user.lastName,
        user: req.user.id
      };

      request.comments.push(newComment);

      await request.save();

      res.json(request.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PATCH api/requests/comment/:id/:comment_id
// @desc    Modify a comment on a request
// @access  Private
router.patch(
  '/comment/:id/:comment_id',
  auth,
  [
    check('text', 'Text is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Find request.
      const request = await Request.findById(req.params.id);

      // Pull out comment.
      const comment = request.comments.find(comment => comment.id === req.params.comment_id);

      // Make sure comment exists.
      if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist' });
      }

      // Only allow a user to modify their own comment unless they are staff.
      if (! (req.user.isStaff || comment.user.toString() === req.user.id)) {
        return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
      }
      
      // Modify comment.
      comment.text = req.body.text;

      // Save whole request.
      await request.save();

      // Return all comments.
      res.json(request.comments);      
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  } 
);

// @route   DELETE api/requests/comment/:id/:comment_id
// @desc    Delete a comment from a request
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    // Find request.
    const request = await Request.findById(req.params.id);

    // Pull out comment.
    const comment = request.comments.find(comment => comment.id === req.params.comment_id);

    // Make sure comment exists.
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Only allow a user to delete their own comment unless they are staff.
    if (! (req.user.isStaff || comment.user.toString() === req.user.id)) {
      return res.status(403).json({ errors: [{ msg: 'Not authorized'}] });
    }

    request.comments = request.comments.filter( ({ id }) => id !== req.params.comment_id );

    await request.save();

    res.json(request.comments);    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;