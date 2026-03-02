const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  // An array of strings for branches
  branches: {
    type: [String],
    default: ["Bole Japan"]
  },
  // A string for the services (we can expand this later)
  services: {
    type: [String],
    default: ["Nail Service", "Eyelash Extension", "Pedicure"]
  },
  // A string for the contact phone number
  phones: {
    type: [String],
    default: "+251-974-67-67-57"
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);