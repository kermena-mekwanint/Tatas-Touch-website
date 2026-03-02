const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure this path points to your DB config

const Admin = sequelize.define('Admin', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: 'admin'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  securityQuestion: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "What's Your Website Name"
  },
  securityAnswer: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Tatas Touch"
  }
}, {
  // This ensures the table name is 'Admins' in your PostgreSQL DB
  tableName: 'admins',
  timestamps: true
});

module.exports = Admin;