const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");
const Calendar = require("../../models/Calendar");

// @route   POST api/calendar
// @desc    Create event
// @access  Private
router.post(
  "/",
  [auth, [check("description", "Description is required").not().isEmpty()]],

  async (req, res) => {
    // Staff only.
    if (!req.user.isStaff) {
      return res.status(403).json({ errors: [{ msg: "Not authorized" }] });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      let calEvent = new Calendar({
        user: req.body.user,
        address: req.body.address,
        time: req.body.time,
        eventDate: req.body.eventDate,
        description: req.body.description
      });

      calEvent = await calEvent.save();

      res.json(calEvent);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
