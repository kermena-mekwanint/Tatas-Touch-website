const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use the DATABASE_URL from your .env or Render Environment Variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ ERROR: DATABASE_URL is not defined in your environment variables!");
  process.exit(1);
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false, // Set to console.log if you want to see the SQL queries in your terminal
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // This is REQUIRED for Render PostgreSQL connections
    }
  }
});

// Test the connection immediately
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection to TatasTouchDB has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize;