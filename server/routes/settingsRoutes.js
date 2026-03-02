const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// --- GET SETTINGS ---
router.get('/', async (req, res) => {
  try {
    // Sequelize findOne looks for the first record in the table
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
    
    // Find the current settings record
    let settings = await Settings.findOne();
    
    if (settings) {
      // Update the existing record
      await settings.update({ branches, services, phones });
    } else {
      // Create it if for some reason it doesn't exist
      settings = await Settings.create({ branches, services, phones });
    }
    
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;