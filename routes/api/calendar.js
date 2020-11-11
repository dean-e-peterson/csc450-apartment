const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");

// @route   POST api/calendar
// @desc    Create a post
// @access  Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],

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

      const newEvent = new Event({
        text: req.body.text
      });

      const calEvent = await calEvent.save();

      res.json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
module.exports = router;
// // @route   POST api/calendar
// // @desc    Add events
// // @access  Public
// router.post(
//   "/renamed",
//   [
//     check("Time", "Time is required").not().isEmpty(),
//     check("Location", "Location is required").not().isEmpty()
//   ],

//   (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     console.log(req.body);
//     res.send("Calendar route");
//   }
// );
