const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// ***User registration***
exports.signup = (req, res, next) => {
    const { email, password } = req.body;

    // Check if user already exists
    User.findOne({ email: email })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(409).json({ error: 'User already exists' });
            }

            // Hash the password
            bcrypt.hash(password, 10)
                .then((hash) => {
                    const user = new User({
                        email: email,
                        password: hash
                    });
                    user.save()
                        .then(() => res.status(201).json({ message: 'User created' }))
                        .catch((error) => res.status(400).json({ error }));
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

// ***User login***
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: 'Incorrect login and/or password' });
            } else {
                // Compare passwords
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'Incorrect login and/or password' });
                        } else {
                            // Generate JWT token
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    'WBkuVEvxyeewA9R3B8tt1d60FZLdRIHimezaGOLKhrLzPCMEsIs5WkjJmU1BqIdM',
                                    { expiresIn: '24h' }
                                )
                            });
                        }
                    })
                    .catch(error => {
                        res.status(500).json({ error });
                    })
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        })
};