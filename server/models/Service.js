const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  // Added Category: This is great for grouping services in your stats!
  category: { 
    type: String, 
    default: 'General' 
  } 
});

module.exports = mongoose.model('Service', serviceSchema);