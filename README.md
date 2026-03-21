# CCS3341 SOA & Microservices Coursework

This repository contains the architecture, implementation, orchestration, and messaging scripts for the **GlobalBooks Inc. SOA Transition**.

## Project Structure

* `docs/` - Contains the Architecture Document, WSDL/UDDI specs, Governance Policy, and Reflective Report.
* `CatalogService/` - Java JAX-WS project creating a SOAP endpoint protected by WS-Security.
* `OrdersService/` - Node.js REST API protected by OAuth2 (mocked JWT).
* `Integration/` - RabbitMQ messaging scripts (PaymentsService, ShippingService, and setup).
* `BPEL/` - Apache ODE orchestration descriptors for the PlaceOrder flow.
* `Tests/` - Postman collection and SOAP UI XML project.

## Running the Services

### 1. CatalogService (SOAP)

This is a standard Java Web Archive. Build it with Maven (`mvn clean install`) and deploy the generated `CatalogService.war` to a servlet container like Apache Tomcat (`http://localhost:8080/CatalogService/lookup?wsdl`).

### 2. OrdersService (REST)

Navigate to the `OrdersService` directory. Run `npm install` followed by `npm start`. It will boot the server on `http://localhost:3000`.

### 3. Messaging Integration (RabbitMQ)

Ensure you have a local RabbitMQ server running (e.g. via Docker `docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management`).

1. Navigate to the `Integration` directory and run `npm install amqplib`.
2. Run `node setupRabbitMQ.js` to create the exchanges and DLQ.
3. Open two terminals, navigate to `PaymentsService` and `ShippingService`, run `npm install` in both, and `node index.js`.

## Video Demonstration Instructions

As part of the assignment, record a 15-minute video demonstrating the system. Keep this checklist handy:

1. **CatalogService (SOAP):** Open SOAP UI and execute the XML request demonstrating WS-Security authentication and book lookup.
2. **OrdersService (REST):** Open Postman and demonstrate fetching an OAuth2 token and passing it as a Bearer token to create an order.
3. **RabbitMQ Messaging:** Start the `PaymentsService` and `ShippingService` consumers. Create an order and watch the terminal logs output the payment and shipping progress. Show the RabbitMQ Management dashboard queues.
4. **BPEL Orchestration:** Show the ODE console or logs demonstrating the invocation of `PlaceOrderProcess.bpel`.
5. **Failure Scenarios:** Provide incorrect credentials to the REST or SOAP API to show 401/403 responses. Show the `globalbooks.dlq` catching a failed payment processing event (10% random chance baked into the `PaymentsService`).

---
**Video Link:** `[INSERT VIDEO LINK HERE BEFORE SUBMISSION]`
