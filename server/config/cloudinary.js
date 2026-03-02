const cloudinary = require('cloudinary').v2;
const path = require('path');
const dotenv = require('dotenv');

// 1. Resolve path to .env file
dotenv.config(); 
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// 2. Debugging Block (Shows in Render Logs)
console.log("--- Cloudinary Config Debug ---");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME || "❌ NOT FOUND");
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "✅ LOADED" : "❌ NOT FOUND");
console.log("-------------------------------");

// 3. Warning instead of Fatal Error to prevent build crash
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
  console.warn("WARNING: Cloudinary credentials missing in Environment Variables!");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

module.exports = cloudinary;