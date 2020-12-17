const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  toStaff: {
    type: Boolean,
    default: true,
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

module.exports = Notification = mongoose.model(
  'notification',
  NotificationSchema
);
