require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import Routes
const bookingRoutes = require('./routes/bookingRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const inspirationRoutes = require('./routes/inspirationRoutes'); // 👈 ADDED THIS
const settingsRoutes = require('./routes/settingsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const commentRoutes = require('./routes/commentRoutes'); // 👈 ADDED THIS

const app = express();

// --- 1. UPLOADS DIRECTORY CHECK ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log("📁 'uploads' folder created successfully.");
}

// --- 2. MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// --- 3. STATIC FOLDER HOSTING ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 4. API ROUTES ---
app.use('/api/bookings', bookingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gallery', galleryRoutes);       // For Owner Portfolio
app.use('/api/inspiration', inspirationRoutes); // 👈 For Pinterest Board (Fixed Error)
app.use('/api/services', serviceRoutes); 
app.use('/api/comments', commentRoutes);       // 👈 ADDED THIS

// --- 5. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Tata's Touch Database Connected!"))
  .catch(err => console.log("❌ Database connection error:", err));

// --- 6. SERVER STATUS & START ---
app.get('/', (req, res) => {
  res.send("Tata's Touch Server is Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
});