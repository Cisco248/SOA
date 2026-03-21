# Reflective Report

## GlobalBooks Inc. SOA Transition

### Architectural Trade-offs

Moving from a monolithic architecture to a Service-Oriented Architecture (SOA) presented several critical trade-offs. The primary benefit realized was **Independent Scalability** and **Loose Coupling**. For example, the `CatalogService` can now be horizontally scaled independent of the `OrdersService` to handle high read traffic during sales events. However, this came at the cost of **Operational Complexity**. Deploying one cohesive application was replaced with managing a Java SOAP service, a Node.js REST API, a RabbitMQ message broker, and an Apache ODE BPEL engine. Furthermore, ensuring data consistency across distributed services required implementing asynchronous patterns (eventual consistency) rather than relying on simple local database transactions.

### SOA vs Microservices Considerations

While the coursework explicitly required SOA design principles, some Microservices patterns were inherently adopted, specifically bounded contexts and polyglot programming (Java alongside Node.js). Traditional SOA leans heavily on an Enterprise Service Bus (ESB) and heavy SOAP/WSDL contracts. Microservices favor "smart endpoints and dumb pipes" using REST/JSON and lightweight messaging. In this project, a hybrid approach was utilized: `CatalogService` retained SOA-style SOAP for legacy partner compatibility, while `OrdersService` utilized REST, aligning more closely with modern Microservices architectures. We replaced a heavyweight ESB with RabbitMQ for lightweight, asynchronous message routing.

### Challenges Faced During Integration

The most prominent challenge during integration was orchestrating the `PlaceOrder` workflow. While BPEL is powerful for managing complex stateful interactions, configuring Apache ODE and fighting XML namespace mismatches between the BPEL descriptor and the `CatalogService` WSDL proved tedious. Additionally, introducing RabbitMQ for asynchronous processing meant implementing a Dead-Letter Queue (DLQ) to handle failed payment or shipping events, requiring more defensive programming in the consumer scripts than would be necessary in a synchronous monolith.

### Security and Governance Observations

Security in a distributed environment must be handled at every endpoint rather than at a single monolithic gateway. Implementing `WS-Security (UsernameToken)` for the SOAP endpoint and `OAuth2` for the REST endpoint highlighted the contrast in modern vs legacy security protocols. OAuth2 with its bearer tokens was significantly easier to implement and test via Postman than constructing XML-DSig or UsernameToken headers for SOAP. From a governance perspective, enforcing a strict URL versioning policy (e.g., `v1`) and namespace versioning ensures that we do not break existing clients when extending service schemas in the future.

### Scalability Analysis

The decomposed system is highly scalable. The RabbitMQ implementation allows the `OrdersService` to quickly persist an order to its localized store and immediately return an HTTP 201 to the client, pushing the heavy lifting of Payment Processing and Shipping coordination to asynchronous workers. If the `PaymentsService` gets overwhelmed, messages simply queue in RabbitMQ without dropping the customer's request, demonstrating high resilience under load.
