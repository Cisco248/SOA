# Local Deployment & Testing Guide

## GlobalBooks Inc. SOA Transition

This document provides the full installation and execution steps to run the microservices locally, either individually (Multiple Files) or via an automated startup script (Single File approach).

---

## 🛠️ Prerequisites

Ensure your local machine has the following installed:

1. **Java Development Kit (JDK 11+)** and **Apache Maven** (for `CatalogService`).
2. **Node.js (v16+)** (for `OrdersService`, `PaymentsService`, `ShippingService`).
3. **Docker Desktop** (for easily running RabbitMQ and Apache ODE).
4. **Apache Tomcat (v9+)** (to host the Java SOAP `.war` file).

---

## Automated "Single Start" Script (Node & Messaging)

We have provided a `app.sh` for linux/mac or `app.ps1` for windows shell script to spin up the infrastructure and Node.js services rapidly.

1. **Start the Infrastructure (RabbitMQ)**
   In the root `/SOA` directory, run:

   ```ps1
   Get-Service *rabbit*
   Start-Service RabbitMQ
   ```

   A. **Check if Node is Running**

      Run:

      ```ps1
      rabbitmq-diagnostics.bat ping
      ```

      > If it fails → server is not running correctly.

   B. **FIX Erlang Cookie (VERY IMPORTANT)**

      Your error strongly suggests this:

      > “Erlang cookie is not identical”

      On Windows, cookie is here:

      ```path
      C:\Users\lahir\.erlang.cookie
      ```

      Also check RabbitMQ service cookie:

      ```path
      C:\Windows\System32\config\systemprofile\.erlang.cookie
      ```

      **Fix:**
      - Open both files
      - Copy content from user cookie
      - Paste into systemprofile cookie

      **Make sure:**
      - Same content EXACTLY
      - No spaces/new lines

   C. **Then Fix Permissions:**

      ```bash
      icacls C:\Users\lahir\.erlang.cookie /inheritance:r /grant:r "%USERNAME%:R"
      ```

   D. **Restart Everything**

      ```ps1
         net stop RabbitMQ
         net start RabbitMQ
      ```

      OR:

      ```ps1
      Restart-Service RabbitMQ
      ```

   E. **Test Again**

      ```cmd
      rabbitmqctl.bat status
      ```

2. **Enable Management UI:**

   ```cmd
   rabbitmq-plugins.bat enable rabbitmq_management
   ```

   > Then open:

   *RabbitMQ will run on <http://localhost:15672>*

3. **Default Login:**

   ```cmd
   guest / guest
   ```

4. **Run the Initialization Script**
   Execute the shell script to install NPM dependencies, configure RabbitMQ queues, and start the three Node.js microservices in the background:

   ```bash
   cd order_service
   ./app.sh 
   ```

   *OrdersService will run on <http://localhost:3000>*

---

## 🛠 Option B: Manual "Multiple Files" Deployment

### 1. CatalogService (Java SOAP)

This service must be manually compiled into a `.war` archive and dropped into a servlet container.

1. Navigate to `CatalogService/`
2. Compile and package the WAR:

   ```bash
   mvn clean package
   ```

3. Copy the resulting `target/CatalogService.war` into your Apache Tomcat `webapps/` folder.
4. Start Tomcat. The WSDL will be available at: `http://localhost:8080/CatalogService/lookup?wsdl`

### 2. RabbitMQ Setup

1. Start RabbitMQ via Docker: `docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management`
2. Navigate to `/Integration`. Run `npm install`, then execute:

   ```bash
   node setupRabbitMQ.js
   ```

### 3. OrdersService (Node REST)

1. Navigate to `OrdersService/`
2. Run `npm install`
3. Run `npm start` (Runs on Port 3000).

### 4. Integration Consumers (Payments & Shipping)

Open two separate terminal windows.

1. **Terminal 1:** Navigate to `Integration/PaymentsService/`, run `npm install`, then `node index.js`.
2. **Terminal 2:** Navigate to `Integration/ShippingService/`, run `npm install`, then `node index.js`.

### 5. BPEL Orchestration (Apache ODE)

1. Download the [Apache ODE](http://ode.apache.org/) WAR distribution.
2. Deploy the ODE WAR to your Tomcat `webapps/` folder.
3. Zip the contents of your `/BPEL` directory (excluding any extraneous files) into a file named `PlaceOrderProcess.zip`.
4. Drop `PlaceOrderProcess.zip` into the `Tomcat/webapps/ode/WEB-INF/processes/` directory. Tomcat/ODE will automatically hot-deploy the BPEL orchestration.

---

## 🧪 Testing the System

### 1. Test the SOAP API (SOAP UI)

- Import the provided `Tests/soapui-project.xml` into SOAP UI, or create a new SOAP UI project pointing to `http://localhost:8080/CatalogService/lookup?wsdl`.
- Make sure to pass the WS-Security UsernameToken header (`admin` / `secret123`).

### 2. Test the REST API & Async Messaging (Postman)

- Import `Tests/postman_collection.json` into Postman.
- Execute **"1. Get OAuth2 Token"**. This simulates obtaining a Bearer token from our mocked authorization server.
- Execute **"2. Create Order"**. You should receive a `201 Created` JSON response.
- **Observe the Integration:** Look at the running terminals (or the output of the `start_all.sh` background processes) for the Payments and Shipping services. You will see them asynchronously receive and process the Order event messages through RabbitMQ!

### 3. Test the Error Handling / Dead Letter Queue (DLQ)

- The `PaymentsService` is programmed with a 10% random failure rate to demonstrate robust error handling.
- If you generate multiple orders rapidly using Postman, you will eventually see a simulated processing failure log in the `PaymentsService` terminal.
- Open the RabbitMQ Management web UI (`http://localhost:15672`), go to the **Queues** tab, and observe that the `globalbooks.dlq` received the failed message exactly as architected!
