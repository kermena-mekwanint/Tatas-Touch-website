const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure this path is correct

const Booking = sequelize.define('Booking', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  phone: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  branch: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  // PostgreSQL specific array for multiple services
  services: { 
    type: DataTypes.ARRAY(DataTypes.STRING), 
    allowNull: false 
  },
  price: { 
    type: DataTypes.FLOAT, 
    defaultValue: 0 
  },
  date: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  time: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'Pending' 
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: ""
  }
}, {
  // Automatically creates and manages createdAt/updatedAt for your stats
  timestamps: true,
  tableName: 'bookings'
});

module.exports = Booking;