const express = require('express');
const router = express.Router();
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const orderSchema = require('../schemas/orderSchema.json');

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(orderSchema);

const ordersDb = new Map();

/**
 * POST /api/v1/orders
 * Creates a new order after validating JSON schema.
 */
router.post('/', (req, res) => {
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            error: 'Invalid Request Payload',
            details: validate.errors
        });
    }

    const orderId = `ORD-${Date.now()}`;
    const newOrder = {
        id: orderId,
        bookIsbn: req.body.bookIsbn,
        quantity: req.body.quantity,
        customerEmail: req.body.customerEmail,
        status: 'PENDING_PAYMENT',
        createdAt: new Date().toISOString()
    };

    ordersDb.set(orderId, newOrder);
    res.status(201).json(newOrder);
});

/**
 * GET /api/v1/orders/:id
 * Retrieves a specific order by ID.
 */
router.get('/:id', (req, res) => {
    const order = ordersDb.get(req.params.id);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
});

module.exports = router;
