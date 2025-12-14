import { z } from 'zod';

// Event Categories
export enum EventCategory {
    AUTH = 'auth',
    COMMERCE = 'commerce',
    FINANCE = 'finance',
    OPS = 'ops',
    SYSTEM = 'system'
}

// Event Names
export enum EventName {
    // Auth
    USER_SIGNED_UP = 'user.signed_up',
    USER_LOGGED_IN = 'user.logged_in',

    // Commerce
    ORDER_CREATED = 'order.created',
    ORDER_PAID = 'order.paid',
    ORDER_FULFILLED = 'order.fulfilled',
    ORDER_CANCELLED = 'order.cancelled',
    PRODUCT_CREATED = 'product.created',
    PRODUCT_UPDATED = 'product.updated',

    // Finance
    PAYMENT_RECEIVED = 'payment.received',
    REFUND_REQUESTED = 'refund.requested',
    PAYOUT_INITIATED = 'payout.initiated',

    // Ops
    DELIVERY_ASSIGNED = 'delivery.assigned',
    TICKET_CREATED = 'ticket.created',

    // System
    ERROR_OCCURRED = 'error.occurred',
}

// Event Payrolls (Zod Schemas can be added here for strict validation if needed)
export const EventPayloads = {
    [EventName.USER_SIGNED_UP]: z.object({ userId: z.string(), email: z.string() }),
    [EventName.ORDER_CREATED]: z.object({ orderId: z.string(), total: z.number() }),
};
