import { prisma } from '@vayva/db';

export interface CreateTicketDTO {
    storeId: string;
    userId: string;
    type: string;
    subject: string;
    description: string;
    correlationId?: string;
    priority?: string;
}

export class SupportService {

    static async createTicket(data: CreateTicketDTO) {
        return prisma.supportTicket.create({
            data: {
                storeId: data.storeId,
                createdByUserId: data.userId,
                type: data.type,
                subject: data.subject,
                description: data.description,
                priority: data.priority || 'normal',
                correlationId: data.correlationId || null,
                messages: {
                    create: {
                        senderType: 'merchant_user',
                        senderId: data.userId,
                        message: data.description // Initial message is the description
                    }
                }
            },
            include: { messages: true }
        });
    }

    static async addMessage(ticketId: string, senderType: 'merchant_user' | 'platform_admin' | 'system', senderId: string, message: string) {
        const msg = await prisma.supportMessage.create({
            data: {
                ticketId,
                senderType,
                senderId,
                message
            }
        });

        // Update ticket updated_at
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: {
                updatedAt: new Date(),
                // If merchant replies, maybe move to 'open' if 'waiting'? Logic can vary.
                status: senderType === 'merchant_user' ? 'open' : undefined
            }
        });

        return msg;
    }

    static async getMerchantTickets(storeId: string) {
        return prisma.supportTicket.findMany({
            where: { storeId },
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: { select: { messages: true } }
            }
        });
    }

    static async getTicketDetails(ticketId: string, storeId: string) {
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });

        if (!ticket || ticket.storeId !== storeId) {
            throw new Error('Not found or access denied');
        }

        return ticket;
    }
}
