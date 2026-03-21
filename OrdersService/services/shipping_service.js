const amqp = require('amqplib');

async function shippingService() {
    console.log("Starting ShippingService...");
    try {
        const conn = await amqp.connect('amqp://localhost');
        const ch = await conn.createChannel();
        const queue = 'shipping.dispatch';

        await ch.assertQueue(queue, {
            durable: true,
            deadLetterExchange: 'globalbooks.dlx',
            deadLetterRoutingKey: 'error'
        });
        ch.prefetch(1);

        console.log("ShippingService connected. Waiting for 'payment.completed' events in queue 'shipping.dispatch'.");

        ch.consume(queue, async (msg) => {
            if (msg !== null) {
                const orderData = JSON.parse(msg.content.toString());
                console.log(`[ShippingService] -> Received shipping dispatch request for order: ${orderData.id}`);

                try {
                    setTimeout(() => {
                        console.log(`[ShippingService] -> Status Update: Order ${orderData.id} shipped successfully to ${orderData.customerEmail}!`);
                        ch.ack(msg);
                    }, 1000);
                } catch (err) {
                    console.error(`[ShippingService] -> Dispatch error: ${err.message}`);
                    ch.nack(msg, false, false);
                }
            }
        });
    } catch (err) {
        console.error("Failed to start ShippingService connection:", err);
    }
}
shippingService();
