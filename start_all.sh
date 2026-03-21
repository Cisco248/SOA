#!/bin/bash
echo "============================================="
echo " Starting GlobalBooks SOA Microservices"
echo "============================================="

# 1. Setup RabbitMQ Queues
echo "-> 1/4 Setting up RabbitMQ Queues and Exchanges..."
cd Integration
npm install --silent
node setupRabbitMQ.js
cd ..

# 2. Start OrdersService
echo "-> 2/4 Starting OrdersService (REST API) on Port 3000..."
cd OrdersService
npm install --silent
node index.js &
ORDERS_PID=$!
cd ..

# 3. Start PaymentsService
echo "-> 3/4 Starting PaymentsService (RabbitMQ Consumer)..."
cd Integration/PaymentsService
npm install --silent
node index.js &
PAYMENTS_PID=$!
cd ../..

# 4. Start ShippingService
echo "-> 4/4 Starting ShippingService (RabbitMQ Consumer)..."
cd Integration/ShippingService
npm install --silent
node index.js &
SHIPPING_PID=$!
cd ../..

echo "============================================="
echo " All Node.js services are running in the background!"
echo " PIDs: Orders($ORDERS_PID), Payments($PAYMENTS_PID), Shipping($SHIPPING_PID)"
echo " To stop them, run: kill $ORDERS_PID $PAYMENTS_PID $SHIPPING_PID"
echo "============================================="
echo " Reminder: The Java CatalogService (SOAP) must be deployed separately to Tomcat."
