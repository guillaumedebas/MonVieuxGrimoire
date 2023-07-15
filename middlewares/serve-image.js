const path = require('path');
const fs = require('fs');

// ***Serve image files***
const ServeImage = (req, res) => {
  // Retrieve requested image
  const imagePath = path.join(__dirname, '../images', req.params.image);

  // Check if the image file exists
  if (!fs.existsSync(imagePath)) {
    res.status(404).sendFile(path.join(__dirname, '../images', 'error-book.webp'));
  } else {
    res.sendFile(imagePath);
  }
};

module.exports = ServeImage;