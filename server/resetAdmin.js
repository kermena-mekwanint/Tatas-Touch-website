const bcrypt = require('bcrypt');
const Admin = require('./models/Admin'); 
const sequelize = require('./config/database'); // Updated to use your new PostgreSQL config
require('dotenv').config();

const reset = async () => {
  try {
    // 1. Ensure the database connection is alive
    await sequelize.authenticate();
    
    // 2. Prepare the password
    const password = 'admin123'; // 👈 SET YOUR DESIRED PASSWORD HERE
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. PostgreSQL/Sequelize: Delete the old admin if it exists
    await Admin.destroy({
      where: { username: 'admin' }
    });
    
    // 4. Create the fresh Admin record in the PostgreSQL 'admins' table
    await Admin.create({
      username: 'admin',
      password: hashedPassword,
      securityQuestion: 'website name',
      securityAnswer: 'Tatas Touch'
    });

    console.log("------------------------------------");
    console.log("✅ PostgreSQL Admin Reset Successful!");
    console.log("Username: admin");
    console.log("Password:", password);
    console.log("------------------------------------");
    
  } catch (error) {
    console.error("❌ Reset Failed:", error);
  } finally {
    process.exit();
  }
};

reset();