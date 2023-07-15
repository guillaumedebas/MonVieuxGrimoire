const sharp = require('sharp');
const fs = require('fs');

// ***Compress uploaded images***
const compressImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  // Original file path
  const imagePath = req.file.path;

  // New file name
  const fileName = req.file.filename.split('.')[0];
  const compressedFileName = `${fileName}${Date.now()}.webp`;

  // New path for compressed image
  const compressedImagePath = `${req.file.destination}/${compressedFileName}`;

  // Compress image
  sharp(imagePath)
    .metadata()
    .then(metadata => {
      let width = metadata.width;
      let height = metadata.height;

      if (width > 1000 || height > 1000) {
        if (width > height) {
            width = 1000;
            height = null;
          } else {
            height = 1000;
            width = null;
        }
      }

      sharp(imagePath)
        .resize(width, height)
        .webp()
        .toFile(compressedImagePath, (error) => {
          if (error) {
            return res.status(500).json({ error: 'Error during image compression' });
          }

          // Update image URL with new path and filename
          req.file.filename = compressedFileName;
          req.file.path = compressedImagePath;

          // Delete old file
          fs.unlinkSync(imagePath);

          next();
        });
    })
    .catch(error => {
      return res.status(500).json({ error: 'Error during image processing' });
    });
};

module.exports = compressImage;
