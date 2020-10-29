const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  references: [
    {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      relation: {
        type: String,
        required: true,
      },
    }
  ],
  backgroundPermission: {
    type: Boolean,
    required: true,
  },
  creditPermission: {
    type: Boolean,
    required: true,
  },
});

module.exports = Application = mongoose.model('application', ApplicationSchema);