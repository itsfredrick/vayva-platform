import { prisma } from '@vayva/db';
import { ReturnReason, ReturnResolution, ReturnMethod, ReturnStatus } from '@prisma/client';

export class ReturnService {

    async createReturnRequest(data: {
        merchantId: string;
        orderId: string;
        customerId?: string;
        reasonCode: ReturnReason;
        reasonText?: string;
        resolutionType: ReturnResolution;
        items: Array<{ orderItemId?: string; qty: number }>;
        logistics: {
            method: ReturnMethod;
            pickupAddress?: any;
            dropoffInstructions?: string;
        }
    }) {
        // Validate Order Eligibility (omitted for brevity)

        return prisma.returnRequest.create({
            data: {
                merchantId: data.merchantId,
                orderId: data.orderId,
                customerId: data.customerId,
                reasonCode: data.reasonCode,
                reasonText: data.reasonText,
                resolutionType: data.resolutionType,
                logistics: {
                    create: {
                        method: data.logistics.method,
                        pickupAddress: data.logistics.pickupAddress,
                        dropoffInstructions: data.logistics.dropoffInstructions,
                        status: 'PENDING'
                    }
                },
                items: {
                    create: data.items.map(item => ({
                        orderItemId: item.orderItemId,
                        qty: item.qty,
                        conditionReceived: 'UNKNOWN' // Default until receipt
                    }))
                }
            },
            include: { items: true, logistics: true }
        });
    }

    async updateStatus(returnId: string, status: ReturnStatus) {
        return prisma.returnRequest.update({
            where: { id: returnId },
            data: {
                status,
                approvedAt: status === 'APPROVED' ? new Date() : undefined,
                completedAt: status === 'COMPLETED' ? new Date() : undefined
            }
        });
    }

    async getReturnRequests(merchantId: string) {
        return prisma.returnRequest.findMany({
            where: { merchantId },
            include: { logistics: true, order: true },
            orderBy: { createdAt: 'desc' }
        });
    }
}

export const returnService = new ReturnService();
