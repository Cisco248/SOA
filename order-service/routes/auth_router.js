const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { CLIENT_ID, CLIENT_SECRET, JWT_SECRET, AUTH_ERROR } = require('../config/constant.js');

router.post('/token', (req, res) => {
    const { client_id, client_secret } = req.body;

    if (client_id === CLIENT_ID && client_secret === CLIENT_SECRET) {
        const token = jwt.sign(
            { clientId: client_id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({
            access_token: token,
            token_type: 'Bearer',
            expires_in: 3600
        });
    }

    return res.status(401).json({ error: AUTH_ERROR });
});

module.exports = router; 
