import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

const createOrderSchema = z.object({
    storeId: z.string(),
    items: z.array(z.object({
        title: z.string(),
        price: z.number(),
        quantity: z.number(),
        productId: z.string().optional(),
        variantId: z.string().optional(),
    })),
    total: z.number(),
});

const checkoutSchema = z.object({
    storeId: z.string(),
    items: z.array(z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number(),
        price: z.number(), // In real app, fetch from DB to prevent tampering
        title: z.string()
    })),
    customer: z.object({
        email: z.string().email(),
        name: z.string(),
        phone: z.string().optional(),
        address: z.string().optional()
    }),
    total: z.number()
});

export const createOrderHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = createOrderSchema.parse(req.body);

    const order = await prisma.order.create({
        data: {
            storeId: body.storeId,
            total: body.total,
            status: 'DRAFT',
            items: {
                create: body.items.map(item => ({
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                    productId: item.productId,
                    variantId: item.variantId,
                }))
            },
            timeline: {
                create: {
                    type: 'CREATED',
                    text: 'Order created',
                }
            }
        },
        include: { items: true }
    });

    return reply.send(order);
};

export const createCheckoutOrderHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = checkoutSchema.parse(req.body);

    // 1. Find or Create Customer (Guest)
    let customer = await prisma.customer.findFirst({
        where: { email: body.customer.email, storeId: body.storeId }
    });

    if (!customer) {
        customer = await prisma.customer.create({
            data: {
                storeId: body.storeId,
                email: body.customer.email,
                name: body.customer.name,
                phone: body.customer.phone,
                // In a real app, we might create a session or auth here
            }
        });
    }

    // 2. Create Order
    const order = await prisma.order.create({
        data: {
            storeId: body.storeId,
            customerId: customer.id,
            total: body.total,
            status: 'PENDING_PAYMENT',
            paymentStatus: 'PENDING',
            fulfillmentStatus: 'UNFULFILLED',
            items: {
                create: body.items.map(item => ({
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                    productId: item.productId,
                    variantId: item.variantId,
                }))
            },
            timeline: {
                create: {
                    type: 'CREATED',
                    text: 'Order placed by customer via Storefront',
                }
            }
        },
        include: { items: true }
    });

    return reply.send(order);
};

export const listOrdersHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { storeId } = req.query as { storeId: string };
    if (!storeId) return reply.status(400).send({ error: 'storeId required' });

    const orders = await prisma.order.findMany({
        where: { storeId },
        orderBy: { createdAt: 'desc' },
        include: { items: true, customer: true }
    });

    return reply.send(orders);
};

export const getOrderHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };

    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true, customer: true, timeline: true }
    });

    if (!order) return reply.status(404).send({ error: 'Order not found' });

    return reply.send(order);
};

export const updateStatusHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const { status, note } = z.object({
        status: z.nativeEnum(OrderStatus),
        note: z.string().optional()
    }).parse(req.body);

    const order = await prisma.order.update({
        where: { id },
        data: {
            status,
            timeline: {
                create: {
                    type: 'STATUS_CHANGE',
                    text: `Status updated to ${status}`,
                    metadata: { note }
                }
            }
        },
        include: { items: true, customer: true, timeline: true }
    });

    return reply.send(order);
};
