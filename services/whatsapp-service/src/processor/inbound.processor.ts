import { prisma, Direction, MessageStatus, MessageType } from '@vayva/db';

export class InboundProcessor {
    static async processMessage(storeId: string, payload: any) {
        const contactData = payload.contacts?.[0];
        const messageData = payload.messages?.[0];

        if (!contactData || !messageData) return;

        const waId = contactData.wa_id;
        const displayName = contactData.profile?.name;

        // 1. Resolve Contact
        let contact = await prisma.contact.findUnique({
            where: {
                merchantId_channel_externalId: {
                    merchantId: storeId,
                    channel: 'WHATSAPP',
                    externalId: waId
                }
            }
        });

        if (!contact) {
            contact = await prisma.contact.create({
                data: {
                    merchantId: storeId,
                    channel: 'WHATSAPP',
                    externalId: waId,
                    displayName,
                    phoneE164: waId // Usually wa_id is phone without +
                }
            });
        }

        // 2. Resolve Conversation
        let conversation = await prisma.conversation.findUnique({
            where: {
                merchantId_contactId: {
                    merchantId: storeId,
                    contactId: contact.id
                }
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    merchantId: storeId,
                    contactId: contact.id,
                    status: 'OPEN'
                }
            });
        }

        // 3. Append Message
        const message = await prisma.message.create({
            data: {
                merchantId: storeId,
                conversationId: conversation.id,
                direction: Direction.INBOUND,
                type: (messageData.type?.toUpperCase() as any) || MessageType.TEXT,
                providerMessageId: messageData.id,
                textBody: messageData.text?.body || '',
                status: MessageStatus.DELIVERED,
                receivedAt: new Date()
            }
        });

        // 4. Update Conversation lastMessageAt and unreadCount
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
                lastMessageAt: new Date(),
                unreadCount: { increment: 1 }
            }
        });

        return message;
    }

    static async processStatus(storeId: string, status: any) {
        if (!status.id || !status.status) return;

        await prisma.message.updateMany({
            where: {
                merchantId: storeId,
                providerMessageId: status.id
            },
            data: {
                status: (status.status.toUpperCase() as any) || MessageStatus.SENT
            }
        });
    }
}
