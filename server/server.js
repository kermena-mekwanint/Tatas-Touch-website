require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database'); 
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
sequelize.sync({ alter: true })
  .then(() => console.log("✅ Tata's Touch PostgreSQL Database Connected & Synced!"))
  .catch(err => console.log("❌ Database connection/sync error:", err));

  // --- 4. SERVING THE FRONTEND ---
const buildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(buildPath));

// Use a Regular Expression literal instead of a string.
// This is the most compatible way for Express 5 catch-all.
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});


// --- 5. SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
});