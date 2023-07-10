const Book = require('../models/Book');
const fs = require('fs');



exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
     book.save()
    .then(() => res.status(201).json({message: 'Object Registered'}))
    .catch(error => res.status(400).json({ error }));    
  };


exports.modifyBook = (req, res, next) => {
  const bookId = req.params.id;
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    : { ...req.body };

  delete bookObject._userId;

  Book.findOne({ _id: bookId })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Supprimer l'ancienne image si une nouvelle image a été ajoutée
      if (req.file) {
        const imagePath = book.imageUrl.split('/images/')[1];
        fs.unlinkSync(`images/${imagePath}`);
      }

      // Mettre à jour les informations du livre
      Book.updateOne({ _id: bookId }, { ...bookObject, _id: bookId })
        .then(() => res.status(200).json({ message: 'Object modified' }))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

  

  exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({message: 'unauthorized'});
    } else {
      const filename = book.imageUrl.split('/images')[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({_id: req.params.id})
        .then(() => {res.status(200).json({message: 'Object deleted'})})
        .catch(error => res.status(401).json({error}));

      });
    }
    })
    .catch(error => res.status(500).json({error}));
  };

  exports.getOneBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({error}));
  };

  exports.getAllBook = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({error}));
    }

    exports.setBookRating = (req, res, next) => {
      const bookId = req.params.id;
      const { userId, rating } = req.body;
    
      // Vérifier si la note est valide (entre 0 et 5)
      if (rating < 0 || rating > 5) {
        return res.status(400).json({ error: 'La note doit être comprise entre 0 et 5.' });
      }
    
      Book.findOne({ _id: bookId, 'ratings.userId': userId })
        .then((book) => {
          if (book) {
            return res.status(400).json({ error: 'L\'utilisateur a déjà noté ce livre.' });
          }
    
          Book.updateOne(
            { _id: bookId },
            { $push: { ratings: { userId, grade: rating } } }
          )
            .then(() => {
              Book.findById(bookId)
                .then((updatedBook) => {
                  const ratings = updatedBook.ratings;
                  const totalRating = ratings.reduce((sum, rating) => sum + rating.grade, 0);
                  const averageRating = totalRating / ratings.length;
    
                  updatedBook.averageRating = Math.floor(averageRating);
                  updatedBook.save()
                    .then(() => {
                      res.status(200).json(updatedBook);
                    })
                    .catch((error) => res.status(500).json({ error }));
                })
                .catch((error) => res.status(500).json({ error }));
            })
            .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
    };
    
    exports.getBestRatedBooks = (req, res, next) => {
      Book.find()
        .sort({ averageRating: -1 }) // Tri par ordre décroissant de la note moyenne
        .limit(3) // Limite le résultat à 3 livres
        .then((books) => {
          res.status(200).json(books);
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    };