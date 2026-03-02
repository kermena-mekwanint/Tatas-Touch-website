const cloudinary = require('cloudinary').v2;
const path = require('path');
const dotenv = require('dotenv');

// 1. Manually resolve the path to the .env file in the server folder
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// 2. Immediate Debugging Block
console.log("--- Cloudinary Config Debug ---");
console.log("Looking for .env at:", envPath);
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME || "❌ NOT FOUND");
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "✅ LOADED" : "❌ NOT FOUND");
console.log("-------------------------------");

// 3. Prevent the app from running if keys are missing (to avoid 500 errors)
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
  console.error("FATAL ERROR: Cloudinary credentials missing in .env file!");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

module.exports = cloudinary;