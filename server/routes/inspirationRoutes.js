const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary'); // Use the config file
const Inspiration = require('../models/Inspiration');
const upload = require('../middleware/multer');



// POST: Upload new inspiration image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to a specific 'inspo' folder on Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'tatas_touch_inspo',
    });

    const newInspo = new Inspiration({
      imageUrl: result.secure_url,
      publicId: result.public_id,
      caption: req.body.caption || 'Inspiration'
    });

    await newInspo.save();
    res.status(201).json(newInspo);
  } catch (err) {
    console.error("Inspiration Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch all inspiration images
router.get('/', async (req, res) => {
  try {
    const images = await Inspiration.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove an inspiration image
router.delete('/:id', async (req, res) => {
  try {
    const image = await Inspiration.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    await cloudinary.uploader.destroy(image.publicId);
    await Inspiration.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Inspo image deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;