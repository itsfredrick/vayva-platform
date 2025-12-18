import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@vayva/db';
import { OrderStatus, PaymentStatus, FulfillmentStatus, Channel } from '@prisma/client';

export const OrdersController = {
    // --- QUERY ---
    getOrders: async (req: FastifyRequest<{ Querystring: { storeId: string, status?: string, paymentStatus?: string, fulfillmentStatus?: string } }>, reply: FastifyReply) => {
        const { storeId, status, paymentStatus, fulfillmentStatus } = req.query;

        const orders = await prisma.order.findMany({
            where: {
                storeId,
                status: status ? (status as OrderStatus) : undefined,
                paymentStatus: paymentStatus ? (paymentStatus as PaymentStatus) : undefined,
                fulfillmentStatus: fulfillmentStatus ? (fulfillmentStatus as FulfillmentStatus) : undefined
            },
            include: {
                customer: true,
                items: true,
                events: { orderBy: { createdAt: 'desc' }, take: 1 } // Latest event
            },
            orderBy: { createdAt: 'desc' }
        });
        return orders;
    },

    getOrder: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                customer: true,
                items: true,
                events: { orderBy: { createdAt: 'desc' } },
                transactions: true,
                shipment: true
            }
        });
        if (!order) return reply.status(404).send({ error: "Order not found" });
        return order;
    },

    // --- ACTIONS ---

    createOrder: async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
        const { storeId, items, customer, paymentMethod, deliveryMethod, notes } = req.body;

        // 1. CRM - Find or Create Customer
        let customerId = null;
        if (customer && customer.phone) {
            const existing = await prisma.customer.findUnique({
                where: { storeId_phone: { storeId, phone: customer.phone } }
            });
            if (existing) {
                customerId = existing.id;
                // Update latest info? Optional
            } else {
                const newCust = await prisma.customer.create({
                    data: {
                        storeId,
                        phone: customer.phone,
                        email: customer.email,
                        firstName: customer.firstName,
                        lastName: customer.lastName,
                    }
                });
                customerId = newCust.id;
            }
        }

        // 2. Create Order
        // Calculate totals (simplified for V1, usually robust calc engine)
        const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const total = subtotal; // + tax + shipping

        const order = await prisma.order.create({
            data: {
                storeId,
                customerId,
                customerPhone: customer?.phone,
                customerEmail: customer?.email,

                status: OrderStatus.OPEN,
                // Cast to PaymentStatus enum. If COD -> INITIATED
                paymentStatus: paymentMethod === 'COD' ? PaymentStatus.INITIATED : PaymentStatus.INITIATED,
                fulfillmentStatus: FulfillmentStatus.UNFULFILLED,

                paymentMethod,
                deliveryMethod,
                internalNote: notes,

                subtotal,
                total,

                items: {
                    create: items.map((item: any) => ({
                        title: item.title,
                        productId: item.productId,
                        variantId: item.variantId,
                        price: item.price,
                        quantity: item.quantity
                    }))
                },

                events: {
                    create: {
                        storeId,
                        type: 'CREATED',
                        message: 'Order created manually',
                        createdBy: 'admin' // TODO: Get from auth
                    }
                }
            },
            include: { events: true }
        });

        // 3. Reserve Inventory? (Integration 8 call - TODO)

        return reply.status(201).send(order);
    },

    markPaid: async (req: FastifyRequest<{ Params: { id: string }, Body: { method: string, reference?: string } }>, reply: FastifyReply) => {
        const { id } = req.params;
        const { method, reference } = req.body; // method: TRANSFER, COD

        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) return reply.status(404).send({ error: "Order not found" });

        const updated = await prisma.order.update({
            where: { id },
            data: {
                paymentStatus: PaymentStatus.PAID,
                paymentMethod: method,
                events: {
                    create: {
                        storeId: order.storeId,
                        type: 'PAYMENT_UPDATED',
                        message: `Marked as PAID via ${method}`,
                        metadata: { reference }
                    }
                }
            }
        });

        // Trigger Notification Logic (Async)
        // await notify(order.storeId, 'ORDER_PAID', order);

        return updated;
    },

    markDelivered: async (req: FastifyRequest<{ Params: { id: string }, Body: { note?: string } }>, reply: FastifyReply) => {
        const { id } = req.params;
        const { note } = req.body;

        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) return reply.status(404).send({ error: "Order not found" });

        const updated = await prisma.order.update({
            where: { id },
            data: {
                fulfillmentStatus: FulfillmentStatus.DELIVERED,
                status: OrderStatus.FULFILLED, // Auto-close/fulfill logic
                events: {
                    create: {
                        storeId: order.storeId,
                        type: 'FULFILLMENT_UPDATED',
                        message: 'Marked as DELIVERED manually',
                        metadata: { note }
                    }
                }
            }
        });

        return updated;
    }
};
