const express = require('express');
const ordersRouter = require('./routes/orders');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Mock OAuth2 Token Endpoint (Client Credentials Flow)
app.post('/oauth/token', (req, res) => {
    const { client_id, client_secret } = req.body;
    
    // In a real application, validate against a DB and hash secrets
    if (client_id === 'globalbooks_client' && client_secret === 'secret123') {
        const token = jwt.sign({ clientId: client_id }, 'secret_key_mock_oauth', { expiresIn: '1h' });
        return res.json({
            access_token: token,
            token_type: 'Bearer',
            expires_in: 3600
        });
    }
    return res.status(401).json({ error: 'invalid_client' });
});

// OAuth2 Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Format "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) {
        return res.status(401).json({ error: 'Unauthorized: No Bearer token provided' });
    }
    
    jwt.verify(token, 'secret_key_mock_oauth', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Protect the orders API with OAuth2 validation
app.use('/api/v1/orders', authenticateToken, ordersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`OrdersService listening on port ${PORT}`);
});
