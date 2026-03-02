const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET ALL BOOKINGS
router.get('/all', async (req, res) => {
  try {
    // Sequelize uses findAll and 'order' instead of sort
    const bookings = await Booking.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD NEW BOOKING
router.post('/add', async (req, res) => {
  try {
    // Sequelize uses .create() to build and save in one step
    const savedBooking = await Booking.create(req.body);
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// THE MASTER UPDATE ROUTE (Fixes the "Pending" not changing issue)
router.patch('/:id/update', async (req, res) => {
  try {
    // Sequelize update returns the number of rows affected
    await Booking.update(req.body, {
      where: { id: req.params.id }
    });
    
    // Fetch the updated record to send back to the frontend
    const updatedBooking = await Booking.findByPk(req.params.id);
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: "Error updating booking" });
  }
});

// DELETE CUSTOMER (Fixes the "Delete Test Name" issue)
router.delete('/:id', async (req, res) => {
  try {
    // Sequelize uses destroy with a 'where' clause
    const deletedCount = await Booking.destroy({
      where: { id: req.params.id }
    });
    
    if (deletedCount === 0) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking successfully removed." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;