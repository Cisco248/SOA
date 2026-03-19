# SOA Architecture Design Document

## GlobalBooks Inc. SOA Transition

### 1. Architectural SOA Design Principles Applied

When decomposing the GlobalBooks monolith into independent services, the following SOA design principles were applied:

**> Service Loose Coupling:** Services are designed to maintain a relationship that minimizes dependencies. Changes in the `CatalogService` do not directly break the `OrdersService`, and asynchronous messaging (RabbitMQ) completely decouples the `PaymentsService` and `ShippingService` from the immediate request-response cycle of placing an order.

**> Service Abstraction:** The underlying logic and database details of each service are hidden from consumers. Clients interact with the `CatalogService` purely via its WSDL/SOAP contract and with the `OrdersService` via its REST API.

**> Service Reusability:** The extracted services are designed to be agnostic to the specific client. For instance, the `CatalogService` can easily be reused by partner platforms via SOAP, and the `OrdersService` can be consumed by web, mobile, and third-party applications via REST/JSON.

**> Service Autonomy:** Each service has a high level of control over its runtime environment. The `OrdersService` manages its own database schema for orders, independent of the catalog, preventing database-level contention.

**> Service Discoverability:** The `CatalogService` metadata will be published to a UDDI registry, allowing dynamic discovery of its location and binding details by clients.

**> Service Composability:** Services are designed to act as building blocks. The BPEL process orchestrates the `PlaceOrder` business workflow by cleanly composing the `CatalogService` (for inventory/price check) and `OrdersService` (to persist the order).

### 2. Component Decomposition Approach

The monolith was decomposed based on **Business Capability** boundaries:

**> CatalogService (SOAP):** Focuses solely on book inventory, querying, and pricing.

**> OrdersService (REST):** Manages the lifecycle of an order (creation, retrieval), abstracting order state.

**> PaymentsService (Messaging):** Handles payment capturing and confirmation asynchronously to avoid blocking user flows.

**> ShippingService (Messaging):** Coordinates the logistics of shipping an order asynchronously once payment is confirmed.

#### Key Benefit

**> Independent Scalability:** During high-traffic events (e.g., global author launches), the `CatalogService` (which traditionally experiences high reads) and `OrdersService` (high write throughput) can be scaled independently of each other. In the monolith, the entire application had to be scaled, which was inefficient and expensive.

#### Primary Challenge

**> Data Inconsistency & Distributed Transactions:** Since each service now manages its own state, achieving atomicity across the "PlaceOrder" workflow is difficult. Because we cannot use local ACID transactions across the `OrdersService`, `PaymentsService`, and `ShippingService`, we must rely on Eventual Consistency and distributed transaction patterns (like the Saga pattern) or compensatory actions within our BPEL orchestration to handle failures (e.g., reverting an order if payment fails asynchronously).
