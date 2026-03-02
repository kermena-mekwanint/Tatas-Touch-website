const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    default: 'admin' 
  },
  password: { 
    type: String, 
    required: true 
  },
  // ADD THESE TWO FIELDS BELOW:
  securityQuestion: { 
    type: String, 
    default: "" 
  },
  securityAnswer: { 
    type: String, 
    default: "" 
  }
  
});

module.exports = mongoose.model('Admin', AdminSchema);