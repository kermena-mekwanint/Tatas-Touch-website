const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET ALL BOOKINGS
router.get('/all', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD NEW BOOKING
router.post('/add', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// THE MASTER UPDATE ROUTE (Fixes the "Pending" not changing issue)
router.patch('/:id/update', async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id, 
      req.body, // This now accepts {status} OR {price} OR both
      { new: true }
    );
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: "Error updating booking" });
  }
});

// DELETE CUSTOMER (Fixes the "Delete Test Name" issue)
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking successfully removed." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;