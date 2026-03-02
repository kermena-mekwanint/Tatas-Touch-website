require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database'); // 👈 Switched to Sequelize
const cors = require('cors');
const path = require('path');

// Import Routes
const bookingRoutes = require('./routes/bookingRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const inspirationRoutes = require('./routes/inspirationRoutes'); 
const settingsRoutes = require('./routes/settingsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const commentRoutes = require('./routes/commentRoutes'); 

const app = express();

// --- 1. MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// --- 2. API ROUTES ---
app.use('/api/bookings', bookingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gallery', galleryRoutes);       
app.use('/api/inspiration', inspirationRoutes); 
app.use('/api/services', serviceRoutes); 
app.use('/api/comments', commentRoutes);       

// --- 3. DATABASE CONNECTION & SYNC ---
// This connects to PostgreSQL and creates your tables automatically
sequelize.sync({ alter: true })
  .then(() => console.log("✅ Tata's Touch PostgreSQL Database Connected & Synced!"))
  .catch(err => console.log("❌ Database connection/sync error:", err));

// --- 4. SERVER STATUS & START ---
app.get('/', (req, res) => {
  res.send("Tata's Touch Server is Running on PostgreSQL...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
});