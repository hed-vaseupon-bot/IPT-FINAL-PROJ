const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number
  },
  category: {
    type: String
  },
  imageUrl: {
    type: String
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Menu', menuSchema);