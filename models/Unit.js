const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
  },
  description: {
    type: String,
  },
});

module.exports = Unit = mongoose.model('unit', UnitSchema);
