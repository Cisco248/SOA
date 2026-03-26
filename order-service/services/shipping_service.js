const { RabbitMQ } = require('../Integration/setupRabbitMQ.js');

async function shippingService() {
    console.log('[ShippingService] Start Shipping Service V1.0.0');

    try {
        const rmq = new RabbitMQ();
        await rmq.setupConnection();
        await rmq.setupExchanges();

        const queue = 'shipping.dispatch';
        await rmq.assertQueue(queue);

        console.log("[ShippingService] Connected, Waiting for Payment...");

        await rmq.consume(queue, async (orderData, originalMsg) => {
            console.log(`[ShippingService] Received Request: Order ID: ${orderData.id}`);

            setTimeout(() => {
                try {
                    console.log(`[ShippingService] Order Shipped Successfully: Order ID: ${orderData.id} --> User Email: ${orderData.customerEmail}! ✅`);
                    rmq.ack(originalMsg);
                } catch (err) {
                    console.error(`[ShippingService] Dispatch Error: ${err.message}`);
                    rmq.nack(originalMsg);
                }
            }, 1000);
        });

    } catch (err) {
        console.error('[ShippingService] Failed to initialize:', err.message);
        process.exit(1);
    }
}

shippingService();