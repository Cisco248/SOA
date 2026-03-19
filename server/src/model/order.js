import { ORDER_STATUS } from "../types/status.mjs";

/**
 * Creates a plain, frozen order record.
 *
 * @param {number} id
 * @param {string} name
 * @param {string} params
 * @param {string} [status]
 * @returns {Readonly<Order>}
 *
 * @typedef {{ order_id: number, order_name: string, params: string, status: string, created_at: string }} Order
 */

function OrderModel(id, name, params, status = ORDER_STATUS.PENDING) {
    return Object.freeze({
        order_id: id,
        order_name: name,
        params,
        status,
        created_at: new Date().toISOString()
    });
}

export { OrderModel }