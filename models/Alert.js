const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlertSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  toStaff: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Alert = mongoose.model('alert', AlertSchema);
