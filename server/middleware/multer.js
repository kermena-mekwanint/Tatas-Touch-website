const multer = require('multer');
const path = require('path');

// Use memoryStorage instead of diskStorage for compatibility with Render's file system
module.exports = multer({
  storage: multer.memoryStorage(), 
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});