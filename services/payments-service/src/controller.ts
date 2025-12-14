import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { PrismaClient, PaymentStatus } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const verifySchema = z.object({
    reference: z.string(),
    storeId: z.string(),
});

const initializeSchema = z.object({
    orderId: z.string(),
    email: z.string().email(),
    amount: z.number(),
    currency: z.string().default('NGN'),
    callbackUrl: z.string().optional()
});

export const initializeTransactionHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = initializeSchema.parse(req.body);

    // Create Transaction Record
    const reference = `ref_${Date.now()}`; // Mock Ref
    const transaction = await prisma.paymentTransaction.create({
        data: {
            orderId: body.orderId,
            reference,
            amount: body.amount,
            currency: body.currency,
            status: 'PENDING',
            provider: 'PAYSTACK',
            metadata: { email: body.email }
        }
    });

    // Mock Paystack Response
    // In real life: await axios.post('https://api.paystack.co/transaction/initialize', ...)

    // We return a mock redirect URL that would normally go to Paystack form.
    // For local dev, maybe we redirect to a mock page or just return success.
    // Let's assume we return a URL `https://checkout.paystack.com/mock-access-code`.
    // BUT since we don't have a real Paystack access code, frontend might need to simulate success.

    return reply.send({
        status: true,
        message: "Authorization URL created",
        data: {
            authorization_url: `http://localhost:3000/paystack-mock?reference=${reference}&amount=${body.amount}`, // Redirect to our own mock page/component? Or just assume frontend handles it.
            access_code: "mock_access_code",
            reference
        }
    });
};

export const verifyPaymentHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { reference, storeId } = verifySchema.parse(req.body);

    // Idempotency: Check if already processed
    const existing = await prisma.paymentTransaction.findUnique({
        where: { reference }
    });

    if (existing && existing.status === 'VERIFIED') {
        return reply.send({ status: 'VERIFIED', transaction: existing });
    }

    // Call Paystack (Mocking for now unless env provided)
    // In real life: await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, ...)
    const mockPaystackStatus = 'success'; // Assume success for V1 demo

    let status: PaymentStatus = 'PENDING';
    if (mockPaystackStatus === 'success') status = 'VERIFIED';
    else status = 'FAILED';

    if (!existing) {
        return reply.status(404).send({ error: 'Transaction not found. Initiate first.' });
    }

    const updated = await prisma.paymentTransaction.update({
        where: { id: existing.id },
        data: { status }
    });

    if (status === 'VERIFIED') {
        // Update Order
        await prisma.order.update({
            where: { id: existing.orderId },
            data: {
                paymentStatus: 'VERIFIED',
                status: 'PAID' // Auto transition
            }
        });

        // Create Timeline Event
        await prisma.orderTimelineEvent.create({
            data: {
                orderId: existing.orderId,
                type: 'PAYMENT_VERIFIED',
                text: `Payment verified via Reference ${reference}`,
                metadata: { amount: Number(existing.amount) }
            }
        });
    }

    return reply.send({ status, transaction: updated });
};

export const webhookHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    // Verify Signature (TODO: crypto.createHmac ...)
    const event = req.body as any;

    if (event.event === 'charge.success') {
        const reference = event.data.reference;
        const tx = await prisma.paymentTransaction.findUnique({ where: { reference } });
        if (tx && tx.status !== 'VERIFIED') {
            const updated = await prisma.paymentTransaction.update({
                where: { id: tx.id },
                data: { status: 'VERIFIED', metadata: event } // Store raw payload
            });

            await prisma.order.update({
                where: { id: tx.orderId },
                data: { paymentStatus: 'VERIFIED', status: 'PAID' }
            });

            await prisma.orderTimelineEvent.create({
                data: {
                    orderId: tx.orderId,
                    type: 'PAYMENT_WEBHOOK',
                    text: `Payment confirmed via Webhook`,
                    metadata: { reference }
                }
            });
        }
    }

    return reply.send({ received: true });
};

export const listTransactionsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    if (!storeId) return reply.status(400).send({ error: 'Store ID required' });

    // Join with Order to filter by storeId
    const transactions = await prisma.paymentTransaction.findMany({
        where: {
            order: {
                storeId: storeId
            }
        },
        include: {
            order: {
                include: { customer: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return reply.send(transactions);
};
