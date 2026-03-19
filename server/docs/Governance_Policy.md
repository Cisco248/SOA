# Governance Policy Document

## GlobalBooks Inc. SOA Transition

This governance policy outlines the centralized strategy for publishing, managing, and deprecating services across GlobalBooks Inc.

### 1. Versioning Strategy

To maintain backward compatibility and avoid breaking existing client integrations (including legacy systems and modern applications), a strict versioning policy must be followed.

***REST APIs (OrdersService, etc.)**

    *   **Convention:** Versioning must be embedded in the URL path.
    *   **Format:** `/api/v{major}/[resource]`
    *   **Example:** `https:api.globalbooks.com/orders/v1`
    *   **Rules:** Minor additive changes (adding a new field to JSON response) do not require a version bump. Any breaking change (removing a field, changing response structure) requires upgrading the major version (`v2`).

***SOAP Web Services (CatalogService)**

    *   **Convention:** Versioning must be embedded in the XML namespace.
    *   **Format:** `http:catalog.globalbooks.com/v{major}/`
    *   **Example:** `targetNamespace="http:catalog.globalbooks.com/v1/"`
    *   **Rules:** A breaking schema change in the WSDL requires a new namespace and a new physical endpoint (e.g., `/CatalogService/v2/lookup`).

### 2. SLA Targets (Service Level Agreements)

Services must meet performance and availability metrics to ensure a reliable shopping experience.

***CatalogService**
    -**Availability:** `99.99%` (Essential for browsing)
    -**Response Time (p95):** `< 50ms` (Reads must be blazingly fast)
***OrdersService**
    -**Availability:** `99.9%`
    -**Response Time (p95):** `< 200ms`
***Asynchronous Messaging (RabbitMQ / ESB)**
    -**Delivery Guarantee:** At-least-once delivery
    -**Maximum Queue Latency:** `< 5 seconds` (Time between order creation and payment initiation)

### 3. Deprecation Strategy

When a service version is superseded, the old version enters a formal sunset process.

- **Notice Period:** Clients will receive a minimum of **6 months** notice before a specific major version is disabled.

- **Communication:** Warnings will be broadcast via email to registered API consumers. For REST APIs, we will append a `Warning: 299 - "Deprecated API"` HTTP header to all responses of the deprecated endpoint for the final 3 months.

- **Sunset Process:**
    1. **Phase 1 (Active):** Service is fully supported.
    2. **Phase 2 (Deprecated):** Service is supported but flagged. Bug fixes only. New clients are banned. (Duration: 6 months).
    3. **Phase 3 (Brownouts):** Intentional intermittent downtime to force remaining clients to migrate (Duration: 2 weeks).
    4. **Phase 4 (Shutdown):** Endpoint returns HTTP 410 Gone or a SOAP Fault indicating service termination.
