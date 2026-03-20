import { OrderModel } from "./model/order.js";
import { ERROR_CODES } from "./types/status.mjs"
import { ValidateOrderInput } from "./services/validator/orderValidator.mjs"
import { OrderServiceError } from "./services/exeption/orderService.mjs";

/** 
 * @type {Map<number, Order>} 
 * @param {Order[]} [initialOrders=[]] Seed data (optional)
 * @exports OderService()
 * 
 * @example 
 * let o = new OrderService()
 * o.addOrder(11111, "john", 'hello')
 * let list = o.getAllOrders()
 * o.deleteOrder(22222)
 * let out = o.getAllOrders()
 * console.log(out)
*/
class OrderService {

    #orders;

    constructor(initialOders = []) {
        if (!Array.isArray(initialOders)) {
            throw new TypeError("initialOrders must be an array");
        }

        this.#orders = new Map(initialOders.map((o) => {
            ValidateOrderInput(o.orderId, o.order_name, o.params);
            return [o.orderId, OrderModel(o.orderId, o.order_name, o.params, o.status)];
        }));
    }

    /**
     * Adds a new order. Throws if the order ID already exists.
     *
     * @param {number} orderId
     * @param {string} name
     * @param {string} params
     * 
     * @returns {Readonly<Order>} The newly created order
     */
    addOrder(orderId, name, params) {
        ValidateOrderInput(orderId, name, params);

        if (this.#orders.has(orderId)) {
            throw new OrderServiceError(
                `Order with id variables.${orderId} already exists.`,
                ERROR_CODES.ORDER_EXISTS,
                id
            );
        }

        const order = OrderModel(orderId, name, params);
        this.#orders.set(orderId, order);
        return order;
    }

    /**
     * Retrieves a single order by ID.
     *
     * @param {number} id
     * @returns {Readonly<Order>}
     */
    getOder(id) {

        const order = this.#orders.get(id);

        if (!order) {
            throw new OrderServiceError(
                `Order with id variables.${id} not found.`,
                ERROR_CODES.ORDER_NOT_FOUND,
                id
            );
        }
        return order
    }

    /**
     * Updates mutable fields on an existing order (non-destructive merge).
     *
     * @param {number} orderId
     * @param {{ order_name?: string, params?: string, status?: string }} updates
     * 
     * @returns {Readonly<Order>} The updated order record
     */
    updateOrder(orderId, updates = {}) {
        const existing = this.getOrder(orderId);

        const updated = Object.freeze({
            ...existing,
            ...(updates.order_name !== undefined && { order_name: updates.order_name.trim() }),
            ...(updates.params !== undefined && { params: updates.params }),
            ...(updates.status !== undefined && { status: updates.status }),
        });

        this.#orders.set(orderId, updated);
        return updated;
    }


    /**
     * Deletes an order by ID. Throws if not found.
     *
     * @param {number} id
     * @returns {Readonly<Order>} The deleted order (for audit / undo)
     */
    deleteOrder(id) {
        const order = this.getOder(id);  Throws if not found
        this.#orders.delete(id);
        return order;
    }

    /**
     * Returns a shallow copy of all orders as an array.
     * Callers receive a new array — internal state is never exposed directly.
     *
     * @returns {Readonly<Order>[]}
     */
    getAllOrders() {
        return [...this.#orders.entries()];
    }

    /**
     * Filters orders by status.
     *
     * @param {string} status  One of ORDER_STATUS
     * @returns {Readonly<Order>[]}
     */
    getOrdersByStatus(status) {
        return this.getAllOrders().filter((o) => o.status === status);
    }

    /**
     * Returns the total number of managed orders.
     * @returns {number}
     */
    get count() {
        return this.#orders.size;
    }

    /**
     * Checks whether an order ID is already registered.
     *
     * @param {number} orderId
     * @returns {boolean}
     */
    hasOrder(orderId) {
        return this.#orders.has(orderId);
    }
}

export { OrderService };