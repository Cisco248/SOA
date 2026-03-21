const amqp = require('amqplib');

async function setup() {
    try {
        const conn = await amqp.connect('amqp://localhost');
        const ch = await conn.createChannel();

        // 1. Setup DLQ Exchange and Queue
        const dlxExchange = 'globalbooks.dlx';
        const dlqQueue = 'globalbooks.dlq';
        await ch.assertExchange(dlxExchange, 'direct', { durable: true });
        await ch.assertQueue(dlqQueue, { durable: true });
        await ch.bindQueue(dlqQueue, dlxExchange, 'error');

        // 2. Setup Main Exchanges
        const eventsExchange = 'globalbooks.events';
        await ch.assertExchange(eventsExchange, 'topic', { durable: true });

        // 3. Setup Payments Queue with DLQ arguments
        const paymentsQueue = 'payments.process';
        await ch.assertQueue(paymentsQueue, { 
            durable: true,
            deadLetterExchange: dlxExchange,
            deadLetterRoutingKey: 'error'
        });
        await ch.bindQueue(paymentsQueue, eventsExchange, 'order.created');

        // 4. Setup Shipping Queue with DLQ arguments
        const shippingQueue = 'shipping.dispatch';
        await ch.assertQueue(shippingQueue, { 
            durable: true,
            deadLetterExchange: dlxExchange,
            deadLetterRoutingKey: 'error'
        });
        await ch.bindQueue(shippingQueue, eventsExchange, 'payment.completed');

        console.log("RabbitMQ topography established successfully (Exchanges, Queues, DLQ).");
        await ch.close();
        await conn.close();
    } catch (err) {
        console.error("Failed to setup RabbitMQ:", err);
    }
}
setup();
