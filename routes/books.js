const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const multer = require('../middlewares/multer-config');
const compressImage = require('../middlewares/compress-image');
const booksCtrl = require('../controllers/books');

// Create a new book
router.post('/', auth, multer, compressImage, booksCtrl.createBook);

// Set book rating
router.post('/:id/rating', auth, booksCtrl.setBookRating);

// Update a book
router.put('/:id', auth, multer, compressImage, booksCtrl.modifyBook);

// Delete a book
router.delete('/:id', auth, booksCtrl.deleteBook);

//Get all books
router.get('/', booksCtrl.getAllBook);

// Get the best-rated books
router.get('/bestrating', booksCtrl.getBestRatedBooks);

// Get a specific book
router.get('/:id', booksCtrl.getOneBook);

module.exports = router;

