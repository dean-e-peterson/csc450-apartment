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
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        time: req.body.time,
        eventDate: req.body.eventDate
      });

      calEvent = await calEvent.save();

      res.json(calEvent);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/calendar
// @desc    GET all events
// @access  Private

router.get(
  "/",
  auth,

  async (req, res) => {
    // Staff only.
    if (!req.user.isStaff) {
      return res.status(403).json({ errors: [{ msg: "Not authorized" }] });
    }
    const calEvents = await Calendar.find().sort({ date: -1 }); // Date reverse sort.

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const events = await Calendar.find().sort({ date: -1 });
      res.json(events);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/calendar/:id
// @desc    GET event by ID
// @access  Private

router.get("/:id", auth, async (req, res) => {
  try {
    const calEvent = await Calendar.findById(req.params.id);

    if (!calEvent) {
      return res.status(404).json({ msg: "Event not found" });
    }

    res.json(calEvent);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/calendar/:id
// @desc    Delete a event
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const calEvent = await Calendar.findById(req.params.id);

    if (!calEvent) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // Only allow a user to delete if they're staff.
    if (!req.user.isStaff) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await calEvent.remove();

    res.json({ msg: "Event removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   PATCH api/calendar/:id
// @desc    Edit an event by ID
// @access  Private
router.patch(
  "/:id",
  auth,
  [check("text", "Text is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const calEvent = await Calendar.findById(req.params.id);

      if (!calEvent) {
        return res.status(404).json({ msg: "Event not found" });
      }

      user: req.body.user;
      title: req.body.title;
      description: req.body.description;
      address: req.body.address;
      time: req.body.time;
      eventDate: req.body.eventDate;

      await calEvent.save();

      res.json(calendar);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
module.exports = router;
