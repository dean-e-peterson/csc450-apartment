const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  bedrooms: {
    type: Number
  }
});

module.exports = Unit = mongoose.model('unit', UnitSchema);
