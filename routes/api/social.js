const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Social = require("../../models/Social");

// @route POST api/social
// @desc Create or update social links
// @access Public
router.post(
  "/",
  auth,

  async (req, res) => {
    // Staff only.
    if (!req.user.isStaff) {
      return res.status(403).json({ errors: [{ msg: "Not authorized" }] });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { youtube, facebook, twitter } = req.body;

    //Build social object
    const socialFields = {};
    socialFields.user = req.user.id;
    socialFields.social = {};
    if (youtube) socialFields.social.youtube = youtube;
    if (twitter) socialFields.social.twitter = twitter;
    if (facebook) socialFields.social.facebook = facebook;

    try {
      let social = await Social.findOne({ user: req.user.id });

      if (social) {
        // Update
        social = await Social.findOneAndUpdate(
          { user: req.user.id },
          { $set: socialFields },
          { new: true }
        );

        return res.json(social);
      }

      // Create
      social = new Social(socialFields);

      await social.save();
      res.json(social);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET /api/social/:id
// @desc    Get social fields
// @access  Private
<<<<<<< HEAD
router.get('/:id', async (req, res) => {
=======
router.get("/:id", auth, async (req, res) => {
>>>>>>> 3d7ccf0fa9033aa7faffe00cafb3404cdef727dd
  try {
    const social = await Social.findById(req.params.id);
    if (!social) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Social fields not found" }] });
    }

    // Return social fields.
    res.json(social);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
