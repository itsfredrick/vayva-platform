
import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@vayva/db';

interface CreateTicketBody {
    storeId: string;
    customerId?: string;
    subject: string;
    description?: string;
    priority?: string;
    type?: string;
    orderId?: string;
    conversationId?: string;
}

interface UpdateTicketBody {
    status?: string;
    priority?: string;
}

interface AddMessageBody {
    message: string;
    sender?: string;
    senderId?: string;
    attachments?: any;
}

export const SupportController = {
    createTicket: async (req: FastifyRequest<{ Body: CreateTicketBody }>, reply: FastifyReply) => {
        const { storeId, customerId, subject, description, priority, type, orderId, conversationId } = req.body;

        const ticket = await prisma.supportTicket.create({
            data: {
                storeId,
                customerId,
                subject,
                description,
                priority: (priority || 'medium') as any,
                type: type || 'general',
                orderId,
                conversationId,
                status: 'open',
                messages: {
                    create: description ? [{
                        storeId,
                        message: description,
                        sender: 'merchant',
                        senderId: null
                    } as any] : []
                }
            }
        });

        return reply.status(201).send(ticket);
    },

    getTickets: async (req: FastifyRequest<{ Querystring: { storeId: string, status?: string } }>, reply: FastifyReply) => {
        const { storeId, status } = req.query;
        const tickets = await prisma.supportTicket.findMany({
            where: {
                storeId,
                status: (status as any) || undefined
            },
            include: {
                customer: true,
                order: true
            },
            orderBy: { updatedAt: 'desc' }
        });
        return tickets;
    },

    getTicket: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const { id } = req.params;
        const ticket = await prisma.supportTicket.findUnique({
            where: { id },
            include: {
                messages: { orderBy: { createdAt: 'asc' } },
                customer: true,
                order: { include: { items: true } },
                conversation: true
            }
        });
        if (!ticket) return reply.status(404).send({ error: "Ticket not found" });
        return ticket;
    },

    updateTicket: async (req: FastifyRequest<{ Params: { id: string }, Body: UpdateTicketBody }>, reply: FastifyReply) => {
        const { id } = req.params;
        const ticket = await prisma.supportTicket.update({
            where: { id },
            data: req.body as any
        });
        return ticket;
    },

    addMessage: async (req: FastifyRequest<{ Params: { id: string }, Body: AddMessageBody }>, reply: FastifyReply) => {
        const { id } = req.params;
        const { message, sender, senderId, attachments } = req.body;

        const ticket = await prisma.supportTicket.findUnique({ where: { id } });
        if (!ticket) return reply.status(404).send({ error: "Ticket not found" });

        const ticketMessage = await prisma.ticketMessage.create({
            data: {
                storeId: ticket.storeId,
                ticketId: id,
                message,
                sender: (sender || 'merchant') as any,
                senderId,
                attachments: attachments || []
            }
        });

        // Auto-update ticket timestamp
        await prisma.supportTicket.update({
            where: { id },
            data: { updatedAt: new Date() }
        });

        return reply.status(201).send(ticketMessage);
    }
};
