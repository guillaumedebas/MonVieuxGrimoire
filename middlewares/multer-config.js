const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/tiff': 'tiff',
  'image/svg+xml': 'svg'
};

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];

    // Check if the file type is supported
    if (!extension) {
      const error = new Error('Unsupported file type');
      error.statusCode = 400;
      return callback(error, null);
    }
    callback(null, name + Date.now() + '.' + extension);
  }
});

// ***Handle file uploads***
module.exports = (req, res, next) => {
  const upload = multer({ storage }).single('image');
  upload(req, res, (error) => {
    if (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    } else {
      next();
    }
  });
};