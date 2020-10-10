const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");

// @route   POST api/bulletin
// @desc    Add events
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("location", "Location is required")
      .not()
      .isEmpty()
  ],

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    res.send("Calendar route");
  }
);

module.exports = router;
