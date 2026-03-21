const amqp = require('amqplib');

async function rabbitMG() {
    try {
        const conn = await amqp.connect('amqp://localhost');
        const channel = await conn.createChannel();

        // 1. Setup DLQ Exchange and Queue
        const dlxExchange = 'globalbooks.dlx';
        const dlqQueue = 'globalbooks.dlq';
        await channel.assertExchange(dlxExchange, 'direct', { durable: true });
        await channel.assertQueue(dlqQueue, { durable: true });
        await channel.bindQueue(dlqQueue, dlxExchange, 'error');

        // 2. Setup Main Exchanges
        const eventsExchange = 'globalbooks.events';
        await channel.assertExchange(eventsExchange, 'topic', { durable: true });

        // 3. Setup Payments Queue with DLQ arguments
        const paymentsQueue = 'payments.process';
        await channel.assertQueue(paymentsQueue, {
            durable: true,
            deadLetterExchange: dlxExchange,
            deadLetterRoutingKey: 'error'
        });
        await channel.bindQueue(paymentsQueue, eventsExchange, 'order.created');

        // 4. Setup Shipping Queue with DLQ arguments
        const shippingQueue = 'shipping.dispatch';
        await channel.assertQueue(shippingQueue, {
            durable: true,
            deadLetterExchange: dlxExchange,
            deadLetterRoutingKey: 'error'
        });
        await channel.bindQueue(shippingQueue, eventsExchange, 'payment.completed');

        console.log("RabbitMQ topography established successfully (Exchanges, Queues, DLQ).");
        await channel.close();
        await conn.close();
    } catch (err) {
        console.error("Failed to setup RabbitMQ:", err);
    }
}
rabbitMG();
