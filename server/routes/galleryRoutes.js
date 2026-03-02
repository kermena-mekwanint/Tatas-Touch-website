const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const upload = require('../middleware/multer'); 
const cloudinary = require('../config/cloudinary');

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Since we switched Multer to memoryStorage, we upload using the buffer
    const uploadFromBuffer = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          { folder: 'tata_gallery' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await uploadFromBuffer(req);

    // Updated for Sequelize: .create() instead of new Gallery().save()
    const newImage = await Gallery.create({
      imageUrl: result.secure_url,
      publicId: result.public_id,
      caption: req.body.caption || ''
    });

    res.json(newImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error during upload' });
  }
});

router.get('/', async (req, res) => {
  try {
    // Updated for Sequelize: findAll and order
    const images = await Gallery.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Updated for Sequelize: findByPk (Primary Key)
    const image = await Gallery.findByPk(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);
    
    // Updated for Sequelize: destroy()
    await image.destroy();
    
    res.json({ message: 'Image removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;