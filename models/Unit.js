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
  },
  bathrooms: {
    type: Number,
  },
});

module.exports = Unit = mongoose.model('unit', UnitSchema);
