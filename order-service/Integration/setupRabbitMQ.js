const amqp = require('amqplib');

class RabbitMQ {
    constructor(url = 'amqp://localhost', mainExchange = 'globalbooks.events') {
        this.url = url;
        this.conn;
        this.channel;

        this.mainExchange = mainExchange;
        this.dlExchange = 'globalbooks.dlx';
        this.dlQueue = 'globalbooks.dlq';
    }

    async setupConnection() {
        this.conn = await amqp.connect(this.url);

        this.conn.on('error', (err) => {
            console.error('[RabbitMQ] Connection Error:', err.message);
            this.channel = null;
        });

        this.conn.on('close', () => {
            console.warn('[RabbitMQ] Connection Closed!');
            this.channel = null;
        });

        this.channel = await this.conn.createChannel();

        console.log('[RabbitMQ] Connected! ✅');
    }

    async setupExchanges() {
        await this.channel.assertExchange(this.mainExchange, 'topic', { durable: true });
        await this.channel.assertExchange(this.dlExchange, 'topic', { durable: true });

        await this.channel.assertQueue(this.dlQueue, { durable: true });
        await this.channel.bindQueue(this.dlQueue, this.dlExchange, 'error');

        console.log('[RabbitMQ] Exchanges & DLQ Ready ✅');
    }

    async setupPaymentQueue() {
        await this.channel.assertQueue('payment.process', {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': this.dlExchange,
                'x-dead-letter-routing-key': 'error'
            }
        });

        await this.channel.bindQueue('payment.process', 'globalbooks.events', 'order.created');

        console.log('[RabbitMQ] Payment Queue Ready ✅');
    }

    async setupShippingQueue() {
        await this.channel.assertQueue('shipping.dispatch', {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': this.dlExchange,
                'x-dead-letter-routing-key': 'error'
            }
        });

        await this.channel.bindQueue('shipping.dispatch', 'globalbooks.events', 'payment.complete');

        console.log('[RabbitMQ] Shipping Queue Ready ✅');
    }
}

module.exports = { RabbitMQ };
