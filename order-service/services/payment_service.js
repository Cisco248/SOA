const { RabbitMQ } = require('../Integration/setupRabbitMQ.js');

async function paymentService() {
    console.log('[PaymentsService] Start Payment Service V1.0.0');

    try {
        const rmq = new RabbitMQ();
        await rmq.setupConnection();
        await rmq.setupExchanges();

        const queue = 'payment.process';
        await rmq.assertQueue(queue);

        console.log("[PaymentsService] Connected, Waiting for Order...");

        await rmq.consume(queue, async (orderData, originalMsg) => {
            console.log(`[PaymentsService] Received: Order ID: ${orderData.id}`);

            setTimeout(async () => {
                try {
                    const failed = Math.random() < 0.1;

                    if (failed) {
                        console.error(`[PaymentsService] Simulated Failure: ${orderData.id}. Sending to DLQ.`);
                        rmq.nack(originalMsg);
                        return;
                    }

                    const completedOrder = { ...orderData, status: 'PAYMENT_COMPLETED' };

                    await rmq.publish('payment.complete', completedOrder);
                    rmq.ack(originalMsg);

                    console.log(`[PaymentsService] Payment Successful: Order ID: ${orderData.id}`);
                } catch (err) {
                    console.error(`[PaymentsService] Processing Error: ${err.message}`);
                    rmq.nack(originalMsg);
                }
            }, 1000);
        });

    } catch (err) {
        console.error('[PaymentsService] Initialization Failed:', err.message);
        process.exit(1);
    }
}

paymentService();
