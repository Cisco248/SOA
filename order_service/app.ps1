Write-Host "Starting all services..."

Start-Process powershell -ArgumentList "npm start"
Start-Process powershell -ArgumentList "cd services; node payment_service.js"
Start-Process powershell -ArgumentList "cd services; node shipping_service.js"