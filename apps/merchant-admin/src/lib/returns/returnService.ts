
import { prisma } from '@vayva/db';

export class ReturnService {

    static async createRequest(
        storeId: string,
        orderId: string,
        customerPhone: string,
        payload: { items: any[], reason: string, notes?: string, preferredMethod?: string }
    ) {
        // Check if exists
        const existing = await prisma.returnRequest.findFirst({
            where: { orderId, status: { not: 'cancelled' } }
        });

        if (existing) {
            throw new Error('Return already active for this order');
        }

        const request = await prisma.returnRequest.create({
            data: {
                storeId,
                merchantId: 'pending_lookup', // Ideally lookup from Store owner
                orderId,
                customerPhone,
                items: payload.items,
                reason: payload.reason,
                notes: payload.notes,
                pickupMethod: payload.preferredMethod, // 'dropoff' | 'pickup'
                status: 'requested',
                correlationId: `ret_${Date.now()}`,
                events: {
                    create: {
                        type: 'status_change',
                        actorType: 'customer',
                        actorLabel: 'Customer',
                        metadata: { status: 'requested', reason: payload.reason }
                    }
                }
            }
        });

        return request;
    }

    static async getRequests(storeId: string) {
        return prisma.returnRequest.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' },
            include: { events: true } // V1 include events for history
        });
    }

    static async updateStatus(
        requestId: string,
        status: string,
        actorId: string,
        data?: { decisionReason?: string, pickupAddress?: any, dropoffAddress?: any, inspectionOutcome?: string }
    ) {
        // Logic for specific status transitions
        await prisma.$transaction(async (tx) => {
            await tx.returnRequest.update({
                where: { id: requestId },
                data: {
                    status,
                    decisionReason: data?.decisionReason,
                    decidedBy: status === 'approved' || status === 'rejected' ? actorId : undefined,
                    decidedAt: status === 'approved' || status === 'rejected' ? new Date() : undefined,
                    pickupAddress: data?.pickupAddress,
                    dropoffAddress: data?.dropoffAddress,
                    inspectionOutcome: data?.inspectionOutcome,
                    inspectedAt: data?.inspectionOutcome ? new Date() : undefined,
                    receivedAt: status === 'received' ? new Date() : undefined
                }
            });

            await tx.returnEvent.create({
                data: {
                    returnRequestId: requestId,
                    type: 'status_change',
                    actorType: 'merchant_user',
                    actorLabel: 'Merchant', // Ideally fetch user name
                    metadata: { status, ...data }
                }
            });
        });
    }
}
