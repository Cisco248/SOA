const amqp = require('amqplib');

async function paymentService() {
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
        ch.prefetch(1);

        console.log("PaymentsService connected. Waiting for 'order.created' events in queue 'payments.process'.");

        ch.consume(queue, async (msg) => {
            if (msg !== null) {
                const orderData = JSON.parse(msg.content.toString());
                console.log(`[PaymentsService] -> Received payment for order: ${orderData.id}`);

                try {
                    setTimeout(() => {
                        if (Math.random() < 0.1) {
                            console.error(`[PaymentsService] -> Simulation failed for ${orderData.id}. Rejecting msg to DLQ.`);
                            ch.nack(msg, false, false);
                            return;
                        }

                        console.log(`[PaymentsService] -> Payment successful for ${orderData.id}. Publishing`);

                        ch.publish(exchange, 'payment.completed', Buffer.from(JSON.stringify(orderData)), { persistent: true });
                        ch.ack(msg);
                    }, 1000);
                } catch (err) {
                    console.error(`[PaymentsService] -> Processing error: ${err.message}`);
                    ch.nack(msg, false, false);
                }
            }
        });
    } catch (err) {
        console.error("Failed to start PaymentsService connection:", err);
    }
}
paymentService();
