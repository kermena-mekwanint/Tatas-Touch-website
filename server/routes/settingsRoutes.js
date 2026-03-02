const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// --- GET SETTINGS ---
router.get('/', async (req, res) => {
  try {
    // Look for the first settings document
    let settings = await Settings.findOne();
    
    // If no settings exist yet, create a default one
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- UPDATE SETTINGS ---
router.post('/update', async (req, res) => {
  try {
    const { branches, services, phones } = req.body;
    
    
    const updatedSettings = await Settings.findOneAndUpdate(
      {}, 
      { branches, services, phones }, 
      { returnDocument: 'after' }
    );
    
    res.json(updatedSettings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;