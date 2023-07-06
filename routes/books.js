const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const multer = require('../middlewares/multer-config');

const booksCtrl = require('../controllers/books');



router.post('/', auth, multer, booksCtrl.createBook);


router.put('/:id', auth, multer, booksCtrl.modifyBook);


router.delete('/:id', auth, booksCtrl.deleteBook);



router.get('/:id', booksCtrl.getOneBook);


router.get('/', booksCtrl.getAllBook);

module.exports = router;