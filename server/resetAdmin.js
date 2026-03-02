const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin'); 
require('dotenv').config();

const reset = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const password = 'admin123'; // 👈 SET YOUR DESIRED PASSWORD HERE
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // This deletes the old admin and creates a fresh one with the right username
  await Admin.deleteMany({ username: 'admin' });
  
  const newAdmin = new Admin({
    username: 'admin',
    password: hashedPassword,
    securityQuestion: 'website name',
    securityAnswer: 'Tatas Touch'
  });

  await newAdmin.save();
  console.log("✅ Admin Reset Successful!");
  console.log("Username: admin");
  console.log("Password:", password);
  process.exit();
};

reset();