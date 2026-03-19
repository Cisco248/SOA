import { OrderServiceError } from '../exeption/orderService.mjs'
import { ERROR_CODES } from '../../types/status.mjs';

/**
 * Validates the shape and types of an order payload.
 * Throws an OrderServiceError on the first violation found.
 *
 * @param { number } id
 * @param { string } name
 * @param { string } params
 * */

function ValidateOrderInput(id, name, params) {
    if (!Number.isFinite(id) || id <= 0) {
        throw new OrderServiceError(`order_id must be a positive finite number, received: ${id}`, ERROR_CODES.INVALID_ODER_ID,
            id
        )
    }

    if (typeof name !== "string" || name.trim().length === 0) {
        throw new OrderServiceError(
            `order_name must be a non-empty string, received: ${JSON.stringify(name)}`,
            ERROR_CODES.INVALID_ORDER_NAME,
            name
        );
    }
    if (typeof params !== "string") {
        throw new OrderServiceError(
            `params must be a string, received: ${typeof params}`,
            ERROR_CODES.INVALID_PARAMS,
            params
        );
    }
}

export { ValidateOrderInput }