const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const upload = require('../middleware/multer'); 
const cloudinary = require('../config/cloudinary');


router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'tata_gallery',
    });

    const newImage = new Gallery({
      imageUrl: result.secure_url, // Standardized
      publicId: result.public_id,
      caption: req.body.caption || ''
    });

    const savedImage = await newImage.save();
    res.json(savedImage);
  } catch (err) {
    res.status(500).json({ message: 'Server Error during upload' });
  }
});

router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    await cloudinary.uploader.destroy(image.publicId);
    await image.deleteOne();
    res.json({ message: 'Image removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;