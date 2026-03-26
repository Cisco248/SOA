const express = require('express');
const router = express.Router();
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const orderSchema = require('../schema/orderSchema.json');
const { authenticateToken } = require('../middlewares/authentication.js');
const { RabbitMQ } = require('../Integration/setupRabbitMQ.js');

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(orderSchema);

const ordersDb = new Map();

/**
 * POST /api/v1/orders
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
    await rmq.publish("order.created", newOrder);

    const paymentQueue = 'payment.process';
    await rmq.assertQueue(paymentQueue)
    await rmq.bindQueue(paymentQueue, 'order.created')

    const shippingQueue = 'shipping.dispatch';
    await rmq.assertQueue(shippingQueue)
    await rmq.bindQueue(shippingQueue, 'payment.complete')

    res.status(201).json(newOrder);

});


/**
 * GET /api/v1/orders/:id
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
