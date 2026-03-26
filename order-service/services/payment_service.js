const amqp = require('amqplib');

async function paymentService() {
    console.log('[PaymentsService] Start Payment Service V1.0.0');
    try {
        const conn = await amqp.connect('amqp://localhost');

        conn.on('error', (err) => console.error('[PaymentsService] Connection Error:', err.message));
        conn.on('close', () => console.warn('[PaymentsService] Connection Closed!'));

        const ch = await conn.createChannel();
        const queue = 'payment.process';
        const exchange = 'globalbooks.events';

        await ch.assertQueue(queue, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': 'globalbooks.dlx',
                'x-dead-letter-routing-key': 'error'
            }
        });
        ch.prefetch(1);

        console.log("[PaymentsService] Connected, Waiting for Order...");

        ch.consume(queue, (msg) => {
            if (msg === null) return;

            const orderData = JSON.parse(msg.content.toString());
            console.log(`[PaymentsService] Received Payment Requested: Order ID: ${orderData.id}`);

            setTimeout(() => {
                try {
                    const failed = Math.random() < 0.1;
                    if (failed) {
                        console.error(`[PaymentsService] Simulated Failure: ${orderData.id} Sending to DLQ.`);
                        ch.nack(msg, false, false);
                        return;
                    }

                    const completedOrder = { ...orderData, status: 'PAYMENT_COMPLETED' };
                    ch.publish(
                        exchange,
                        'payment.complete',
                        Buffer.from(JSON.stringify(completedOrder)),
                        { persistent: true }
                    );
                    ch.ack(msg);
                    console.log(`[PaymentsService] Payment Successful: Order ID: ${orderData.id}`);
                } catch (err) {
                    console.error(`[PaymentsService] Processing Error: ${err.message}`);
                    ch.nack(msg, false, false);
                }
            }, 1000);
        });
    } catch (err) {
        console.error('[PaymentsService] Failed:', err.message);
        process.exit(1); // Exit so a process manager (e.g. Docker, PM2) can restart
    }
}

paymentService();
