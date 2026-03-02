const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary'); 
const Inspiration = require('../models/Inspiration');
const upload = require('../middleware/multer');

// POST: Upload new inspiration image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload using buffer stream since we switched Multer to memoryStorage
    const uploadFromBuffer = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          { folder: 'tatas_touch_inspo' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await uploadFromBuffer(req);

    // Updated for Sequelize: .create() instead of new Inspiration().save()
    const newInspo = await Inspiration.create({
      imageUrl: result.secure_url,
      publicId: result.public_id,
      caption: req.body.caption || 'Inspiration'
    });

    res.status(201).json(newInspo);
  } catch (err) {
    console.error("Inspiration Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch all inspiration images
router.get('/', async (req, res) => {
  try {
    // Updated for Sequelize: findAll and order
    const images = await Inspiration.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove an inspiration image
router.delete('/:id', async (req, res) => {
  try {
    // Updated for Sequelize: findByPk
    const image = await Inspiration.findByPk(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    await cloudinary.uploader.destroy(image.publicId);
    
    // Updated for Sequelize: destroy()
    await image.destroy();
    
    res.json({ message: "Inspo image deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;