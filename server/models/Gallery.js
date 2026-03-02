const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure this path is correct

const Gallery = sequelize.define('Gallery', {
  imageUrl: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  publicId: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }, // Required for Cloudinary deletion
  caption: { 
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  // Automatically creates 'createdAt' and 'updatedAt'
  timestamps: true,
  tableName: 'gallery'
});

module.exports = Gallery;