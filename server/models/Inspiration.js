const mongoose = require('mongoose');

const InspirationSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  caption: { type: String, default: 'Inspiration' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inspiration', InspirationSchema);