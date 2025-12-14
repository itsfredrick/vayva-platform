import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export const webhookHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = req.body as any;

    if (!body.entry || !body.entry[0].changes || !body.entry[0].changes[0].value.messages) {
        return reply.send({ status: 'ignored' });
    }

    const messageData = body.entry[0].changes[0].value.messages[0];
    const contactData = body.entry[0].changes[0].value.contacts[0];

    // In a real multi-tenant app, we'd lookup store by phone number ID or waba ID.
    // For V1 demo, we hardcode or assume single store from env, but let's just use "store-123" if missing.
    const storeId = "store-123";
    const customerPhone = contactData.wa_id;

    let conversation = await prisma.conversation.findUnique({
        where: { storeId_customerPhone: { storeId, customerPhone } }
    });

    if (!conversation) {
        conversation = await prisma.conversation.create({
            data: {
                storeId,
                customerPhone,
                status: 'OPEN'
            }
        });
    }

    const message = await prisma.message.create({
        data: {
            conversationId: conversation.id,
            direction: 'INBOUND',
            type: messageData.type,
            content: messageData.text?.body || '[Media]',
            aiMetadata: { raw: messageData }
        }
    });

    console.log(`[WhatsApp] stored message ${message.id}, triggering AI...`);
    // Fire and forget AI processing
    axios.post('http://localhost:3006/v1/ai/process', { messageId: message.id }).catch((err) => {
        console.error("AI Trigger Failed", err.message);
    });

    return reply.send({ status: 'processed' });
};

export const sendHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { conversationId, content } = req.body as { conversationId: string, content: string };

    const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conversation) return reply.status(404).send({ error: 'Conversation not found' });

    // Store Outbound Message
    const message = await prisma.message.create({
        data: {
            conversationId,
            direction: 'OUTBOUND',
            type: 'text',
            content
        }
    });

    // Call Meta API (Mocked)
    console.log(`[WhatsApp] Sending to ${conversation.customerPhone}: ${content}`);

    return reply.send(message);
};

export const listConversationsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    // For V1 demo hardcoded in webhook, but listing should filter by storeId passed in headers.
    // If no storeId, return empty or error.
    if (!storeId) return reply.send([]); // or error

    const conversations = await prisma.conversation.findMany({
        where: { storeId },
        include: {
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: { updatedAt: 'desc' }
    });
    return reply.send(conversations);
};

export const listMessagesHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }; // conversationId

    const messages = await prisma.message.findMany({
        where: { conversationId: id },
        orderBy: { createdAt: 'asc' }
    });
    return reply.send(messages);
};
