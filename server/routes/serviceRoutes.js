const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// --- ADD NEW SERVICE ---
router.post('/add', async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const newService = new Service({
      name,
      price: Number(price),
      category: category || 'General' // Falls back to General if not chosen
    });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: "Failed to add service", error: err.message });
  }
});

// --- GET ALL SERVICES ---
router.get('/all', async (req, res) => {
  try {
    const services = await Service.find().sort({ category: 1, name: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Error fetching services" });
  }
});

// --- DELETE SERVICE ---
router.delete('/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully", success: true });
  } catch (err) {
    res.status(400).json({ message: "Error deleting" });
  }
});

module.exports = router;