const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// --- ADD NEW SERVICE ---
router.post('/add', async (req, res) => {
  try {
    const { name, price, category } = req.body;
    
    // Updated for Sequelize: .create() instead of new Service().save()
    const newService = await Service.create({
      name,
      price: Number(price),
      category: category || 'General' 
    });
    
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: "Failed to add service", error: err.message });
  }
});

// --- GET ALL SERVICES ---
router.get('/all', async (req, res) => {
  try {
    // Updated for Sequelize: findAll and multi-column ordering
    const services = await Service.findAll({
      order: [
        ['category', 'ASC'],
        ['name', 'ASC']
      ]
    });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Error fetching services" });
  }
});

// --- DELETE SERVICE ---
router.delete('/:id', async (req, res) => {
  try {
    // Updated for Sequelize: destroy with a where clause
    await Service.destroy({
      where: { id: req.params.id }
    });
    res.json({ message: "Deleted successfully", success: true });
  } catch (err) {
    res.status(400).json({ message: "Error deleting" });
  }
});

module.exports = router;