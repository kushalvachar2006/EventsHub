const multer = require('multer');

// Use memory storage so we can upload to Cloudinary from buffer
const storage = multer.memoryStorage();

// Create multer instance
const upload = multer({ storage });

module.exports = upload;
