const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  unit: {
    type: Schema.Types.ObjectId,
    ref: 'units',
    required: true
  },
  type: {
    type: String,
    required: true,
    default: "Other" // Other types: Exterior, Heating, Plumbing.
  },
  summary: {
    type: String,
    required: true
  },
  details: {
    type: String
  },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  status: {
    type: String,
    required: true,
    default: "New" // Other statuses, "In-Progress", "Completed"
  },
  date: {
    type: Date,
    default: Date.now
  }  
});

module.exports = Request = mongoose.model('request', RequestSchema);