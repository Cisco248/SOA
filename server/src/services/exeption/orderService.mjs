class OrderServiceError extends Error {
    /**
     * @param {string} message Human-readable description
     * @param {string} code One of ERROR_CODES
     * @param {*} [detail] Optional extra context (e.g. the bad orderId)
     */

    constructor(message, code, detail = null) {
        super(message);
        this.name = "OrderServiceError";
        this.code = code;
        this.detail = detail;
        this.timestamp = new Date().toISOString();

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, OrderServiceError)
        }
    }
}

let ORDER_SERVICE = new OrderServiceError()

export { OrderServiceError }