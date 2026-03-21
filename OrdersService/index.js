import { TOKEN, CLIENT_ID, CLIENT_SCREATE, PORT, AUTH_ERROR } from "./config/constant.js";
import { authenticateToken } from "./middlewares/authentication.js";

const express = require('express');
const ordersRouter = require('./routes/orders');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Mock OAuth2 Token Endpoint (Client Credentials Flow)
app.post('/oauth/token', (req, res) => {
    const { client_id, client_secret } = req.body;

    if (client_id === CLIENT_ID && client_secret === CLIENT_SCREATE) {
        const token = jwt.sign({ clientId: client_id }, TOKEN, { expiresIn: '1h' });
        return res.json({
            access_token: token,
            token_type: 'Bearer',
            expires_in: 3600
        });
    }
    return res.status(401).json({ error: AUTH_ERROR });
});

// Protect the orders API with OAuth2 validation
app.use('/api/v1/orders', authenticateToken, ordersRouter);

app.listen(PORT, () => {
    console.log(`OrdersService listening on port ${PORT}`);
});
