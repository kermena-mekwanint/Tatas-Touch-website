const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  // If you decide not to use email later, change required to false
  email: { 
    type: String, 
    required: false 
  },
  branch: { 
    type: String, 
    required: true 
  },
  // Array of strings to store multiple selected services (e.g., ["Wash", "Braids"])
  services: { 
    type: [String], 
    required: true 
  },
  // Tracks how much the customer paid for the statistics dashboard
  price: { 
    type: Number, 
    default: 0 
  },
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  // Allows the Admin to track "Completed" vs "Pending" for the goal bar
  status: { 
    type: String, 
    default: 'Pending' 
  },
  // Optional: Stores a URL if the user uploads a nail design they want
  image: {
    type: String,
    default: ""
  },
  // Vital for the "This Month" filter in your Admin statistics
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Booking', BookingSchema);