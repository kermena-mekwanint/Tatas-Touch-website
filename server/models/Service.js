const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure this path is correct

const Service = sequelize.define('Service', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  price: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  // Added Category: This is great for grouping services in your stats!
  category: { 
    type: DataTypes.STRING, 
    defaultValue: 'General' 
  } 
}, {
  // Automatically creates 'createdAt' and 'updatedAt'
  timestamps: true,
  tableName: 'services'
});

module.exports = Service;