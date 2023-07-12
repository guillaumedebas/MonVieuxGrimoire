const jwt = require('jsonwebtoken');

// ***Verify authentification***
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'WBkuVEvxyeewA9R3B8tt1d60FZLdRIHimezaGOLKhrLzPCMEsIs5WkjJmU1BqIdM');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};