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
    const bookingId = parseInt(req.params.id);
    const { price, status } = req.body; // Explicitly pull these out

    // 1. Log what the backend is actually receiving
    console.log(`Attempting update for ID ${bookingId}:`, { price, status });

    // 2. Perform the update using explicit column names
    // IMPORTANT: Check if your columns are 'price' or 'Price' in the database
    const [updatedRows] = await Booking.update(
      { 
        price: price, 
        status: status 
      }, 
      { where: { id: bookingId } }
    );
    
    if (updatedRows === 0) {
      console.log("⚠️ Update ran but 0 rows changed. Check if ID exists.");
      return res.status(404).json({ message: "No changes made to database." });
    }

    const updatedBooking = await Booking.findByPk(bookingId);
    console.log("✅ Saved to Postgres:", updatedBooking.toJSON());
    res.json(updatedBooking);
    
  } catch (err) {
    console.error("❌ Database Error:", err.message);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});
    
 

// DELETE CUSTOMER
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