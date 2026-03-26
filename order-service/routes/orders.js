const express = require('express');
const router = express.Router();
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const amqp = require('amqplib');
const orderSchema = require('../schema/orderSchema.json');
const { authenticateToken } = require('../middlewares/authentication.js');
const { RabbitMQ } = require('../Integration/setupRabbitMQ.js');

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(orderSchema);

const ordersDb = new Map();

/**
 * POST /orders
 * Creates a new order after validating JSON schema.
 */
router.post('/', authenticateToken, async (req, res) => {
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

    const rmq = new RabbitMQ('amqp://localhost', 'globalbooks.events')
    await rmq.setupConnection()
    await rmq.setupExchanges()

    const conn = await amqp.connect('amqp://localhost')
    const channel = await conn.createChannel()

    await channel.publish(
        'globalbooks.events',
        'order.created',
        Buffer.from(JSON.stringify(newOrder)),
        { persistent: true }
    );

    res.status(201).json(newOrder);

    await rmq.setupPaymentQueue()
    await rmq.setupShippingQueue()
});

/**
 * GET /orders
 * Returns all orders. (ADDED: was missing from original codebase)
 */
router.get('/', authenticateToken, (req, res) => {
    const allOrders = Array.from(ordersDb.values());
    res.json(allOrders);
});

/**
 * GET /orders/:id
 * Retrieves a specific order by ID.
 */
router.get('/:id', authenticateToken, (req, res) => {
    const order = ordersDb.get(req.params.id);
    if (!order) {
        return res.status(404).json({ error: 'Order Not Found' });
    }
    res.json(order);
});

module.exports = router;
