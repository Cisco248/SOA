const amqp = require('amqplib');

async function start() {
    console.log("Starting PaymentsService...");
    try {
        const conn = await amqp.connect('amqp://localhost');
        const ch = await conn.createChannel();
        const queue = 'payments.process';
        const exchange = 'globalbooks.events';

        await ch.assertQueue(queue, { 
            durable: true,
            deadLetterExchange: 'globalbooks.dlx',
            deadLetterRoutingKey: 'error'
        });
        ch.prefetch(1); // Process one message at a time
        
        console.log("PaymentsService connected. Waiting for 'order.created' events in queue 'payments.process'.");

        ch.consume(queue, async (msg) => {
            if (msg !== null) {
                const orderData = JSON.parse(msg.content.toString());
                console.log(`[PaymentsService] -> Received payment processing request for order: ${orderData.id}`);

                try {
                    // Simulate processing time
                    setTimeout(() => {
                        // 10% chance to simulate a payment system failure (dead-letter queue demo)
                        if (Math.random() < 0.1) {
                             console.error(`[PaymentsService] -> Simulation failed for ${orderData.id}. Rejecting msg to DLQ.`);
                             ch.nack(msg, false, false); // requeue = false routes it to DLQ
                             return;
                        }
                        
                        console.log(`[PaymentsService] -> Payment successful for ${orderData.id}. Publishing 'payment.completed'.`);
                        
                        // Publish success event for ShippingService
                        ch.publish(exchange, 'payment.completed', Buffer.from(JSON.stringify(orderData)), { persistent: true });
                        ch.ack(msg); // acknowledge success to RabbitMQ
                    }, 1000);
                } catch (err) {
                    console.error(`[PaymentsService] -> Processing error: ${err.message}`);
                    ch.nack(msg, false, false); 
                }
            }
        });
    } catch(err) {
        console.error("Failed to start PaymentsService connection:", err);
    }
}
start();
