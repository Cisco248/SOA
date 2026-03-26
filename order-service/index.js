const express = require('express');

const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth_router.js');
const { RabbitMQ } = require('./Integration/setupRabbitMQ.js');

const { PORT } = require('./config/constant.js');

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.json({ message: 'Order Service is Running!' });
});

app.use('/oauth', authRouter);
app.use('/orders', ordersRouter);

app.use((err, req, res, next) => {
    console.error('[Server] Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

const rmq = new RabbitMQ()

rmq.setupConnection()

app.listen(PORT, () => {
    console.log(`[Server] OrdersService listening on port ${PORT}`);
});


