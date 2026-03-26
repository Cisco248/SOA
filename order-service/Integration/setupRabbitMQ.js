const amqp = require('amqplib');

class RabbitMQ {
    constructor(url = 'amqp://localhost', mainExchange = 'globalbooks.events') {
        this.url = url;
        this.conn = null;
        this.channel = null;
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

    async assertQueue(queueName) {
        await this.channel.assertQueue(queueName, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': this.dlExchange,
                'x-dead-letter-routing-key': 'error'
            }
        });
    }

    async preFetch() {
        await this.channel.prefetch(1);
    }

    async bindQueue(queueName, pattern) {
        await this.channel.bindQueue(queueName, this.mainExchange, pattern);
        console.log(`[RabbitMQ] ${queueName} Queue Ready ✅`);

    }

    async publish(routingKey, data) {
        if (!this.channel) {
            console.error("Channel not initialized!");
            return;
        }
        const message = JSON.stringify(data);
        this.channel.publish(this.mainExchange, routingKey, Buffer.from(message), { persistent: true });
    }

    async consume(queueName, callback) {
        await this.channel.consume(queueName, (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                callback(content, msg);
            }
        });
    }

    ack(msg) {
        this.channel.ack(msg);
    }

    nack(msg) {
        this.channel.nack(msg, false, false);
    }
}

module.exports = { RabbitMQ };
