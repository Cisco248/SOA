#!/bin/bash

echo "Starting all services..."
# Start main app
wt new-tab cmd /k "npm start"

# Start payment service
wt new-tab cmd /k "cd services && node payment_service.js"

# Start shipping service
wt new-tab cmd /k "cd services && node shipping_service.js"