const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure this path is correct

const Comment = sequelize.define('Comment', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // Optional: 'approved' field to hide comments until checked
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true 
  }
}, {
  // Automatically creates 'createdAt' (replacing your 'date' field) and 'updatedAt'
  timestamps: true,
  tableName: 'comments'
});

module.exports = Comment;