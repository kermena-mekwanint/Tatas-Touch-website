const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure this path is correct

const Inspiration = sequelize.define('Inspiration', {
  imageUrl: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  publicId: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  caption: { 
    type: DataTypes.STRING, 
    defaultValue: 'Inspiration' 
  }
}, {
  // Automatically creates 'createdAt' and 'updatedAt' columns
  timestamps: true,
  tableName: 'inspirations'
});

module.exports = Inspiration;