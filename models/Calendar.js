const mongoose = require("mongoose");

const CalendarSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  eventDate: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Calendar = mongoose.model("calendar", CalendarSchema);
