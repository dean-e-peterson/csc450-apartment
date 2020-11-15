const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlertSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  forStaff: {
    type: Boolean,
    default: false,
  },
  type: { // AppAccepted, AppRejected, MaintComplete, etc.?
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Alert = mongoose.model('alert', AlertSchema);
