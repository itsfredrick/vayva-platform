import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export const processHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { messageId } = req.body as { messageId: string };

    const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: { conversation: true }
    });

    if (!message || !message.conversation) return reply.status(404).send({ error: 'Message not found' });

    const text = message.content.toLowerCase();
    let responseText = '';

    // Simple V1 Heuristics
    if (text.includes('order')) {
        responseText = "I see you're asking about an order. Let me check the status... (Simulated: Processing)";
        // TODO: Call orders-service to list latest order
    } else if (text.includes('discount')) {
        // Create Approval
        const approval = await prisma.approval.create({
            data: {
                storeId: message.conversation.storeId,
                requesterId: message.conversation.customerPhone, // Using phone as ID for V1
                actionType: 'DISCOUNT_APPLICATION',
                payload: { discount: '10%' },
                status: 'PENDING'
            }
        });
        responseText = `I've requested a 10% discount for you. Waiting for manager approval. (Approval ID: ${approval.id})`;
    } else {
        responseText = `Echo: ${message.content} - (AI Logic Placeholder)`;
    }

    // Send Reply
    await axios.post('http://localhost:3005/v1/whatsapp/send', {
        conversationId: message.conversationId,
        content: responseText
    }).catch(err => console.error("Failed to send reply", err.message));

    return reply.send({ status: 'processed', action: responseText });
};
