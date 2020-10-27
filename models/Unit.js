const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'location',    
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
