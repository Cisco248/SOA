const amqp = require('amqplib');

async function shippingService() {
    console.log('[ShippingService] Start Shipping Service V1.0.0');
    try {
        const conn = await amqp.connect('amqp://localhost');

        conn.on('error', (err) => console.error('[ShippingService] Connection Error:', err.message));
        conn.on('close', () => console.warn('[ShippingService] Connection Closed...!'));

        const ch = await conn.createChannel();
        const queue = 'shipping.dispatch';

        await ch.assertQueue(queue, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': 'globalbooks.dlx',
                'x-dead-letter-routing-key': 'error'
            }
        });
        ch.prefetch(1);

        console.log("[ShippingService] Connected, Waiting for Payment...");

        ch.consume(queue, (msg) => {
            if (msg === null) return;

            const orderData = JSON.parse(msg.content.toString());
            console.log(`[ShippingService] Received Request: Order ID: ${orderData.id}`);

            setTimeout(() => {
                try {
                    console.log(`[ShippingService] Order Shipped Successful: Order ID: ${orderData.id} --> User Email: ${orderData.customerEmail}!`);
                    ch.ack(msg);
                } catch (err) {
                    console.error(`[ShippingService] Dispatch Error: ${err.message}`);
                    ch.nack(msg, false, false);
                }
            }, 1000);
        });
    } catch (err) {
        console.error('[ShippingService] Failed:', err.message);
        process.exit(1);
    }
}

shippingService();
