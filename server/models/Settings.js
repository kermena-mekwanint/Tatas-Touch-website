const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure this path is correct

const Settings = sequelize.define('Settings', {
  // An array of strings for branches
  branches: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ["Bole Japan"]
  },
  // An array of strings for the services
  services: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ["Nail Service", "Eyelash Extension", "Pedicure"]
  },
  // An array of strings for the contact phone numbers
  phones: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ["+251-974-67-67-57"]
  }
}, {
  // Automatically creates 'createdAt' and 'updatedAt'
  timestamps: true,
  tableName: 'settings'
});

module.exports = Settings;