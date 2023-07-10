const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const multer = require('../middlewares/multer-config');
const compressImage = require('../middlewares/compress-image');
const booksCtrl = require('../controllers/books');


router.post('/', auth, multer, compressImage, booksCtrl.createBook);

router.get('/bestrating', booksCtrl.getBestRatedBooks);

router.put('/:id', auth, multer, compressImage, booksCtrl.modifyBook);

router.delete('/:id', auth, booksCtrl.deleteBook);

router.post('/:id/rating', auth, booksCtrl.setBookRating);

router.get('/:id', booksCtrl.getOneBook);


router.get('/', booksCtrl.getAllBook);

module.exports = router;