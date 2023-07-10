const sharp = require('sharp');
const fs = require('fs');

const compressImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  // Chemin du fichier d'origine
  const imagePath = req.file.path;

  // Nouveau nom de fichier
  const fileName = req.file.filename.split('.')[0];
  const compressedFileName = `${fileName}${Date.now()}.webp`;

  // Nouveau chemin pour l'image compressée
  const compressedImagePath = `${req.file.destination}/${compressedFileName}`;

  // Compression de l'image au format WebP
  sharp(imagePath)
    .webp()
    .toFile(compressedImagePath, (error) => {
      if (error) {
        return res.status(500).json({ error: 'Erreur lors de la compression de l\'image.' });
      }

      // Mettre à jour l'URL de l'image avec le nouveau chemin et nom de fichier
      req.file.filename = compressedFileName;
      req.file.path = compressedImagePath;

      // Supprimer l'ancien fichier
      fs.unlinkSync(imagePath);

      next();
    });
};

module.exports = compressImage;
