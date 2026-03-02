const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  // Optional: Add an 'approved' field if you want to hide comments until you check them
  isApproved: {
    type: Boolean,
    default: true 
  }
});

module.exports = mongoose.model('Comment', CommentSchema);