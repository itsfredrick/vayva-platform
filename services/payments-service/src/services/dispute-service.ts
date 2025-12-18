import { prisma } from '@vayva/db';
import { DisputeProvider, DisputeStatus, DisputeEvidenceType } from '@prisma/client';

export class DisputeService {

    async createDispute(data: {
        merchantId: string;
        provider: DisputeProvider;
        providerDisputeId: string;
        amount: number;
        currency: string;
        reasonCode?: string;
        paymentId?: string;
        orderId?: string;
        evidenceDueAt?: Date;
    }) {
        // Idempotency: Ignore if exists
        const existing = await prisma.dispute.findUnique({
            where: { provider_providerDisputeId: { provider: data.provider, providerDisputeId: data.providerDisputeId } }
        });

        if (existing) return existing;

        return prisma.dispute.create({
            data: {
                merchantId: data.merchantId,
                provider: data.provider,
                providerDisputeId: data.providerDisputeId,
                amount: data.amount,
                currency: data.currency,
                reasonCode: data.reasonCode,
                paymentId: data.paymentId,
                orderId: data.orderId,
                evidenceDueAt: data.evidenceDueAt,
                status: 'OPENED'
            }
        });
    }

    async addEvidence(disputeId: string, data: {
        type: DisputeEvidenceType;
        url?: string;
        textExcerpt?: string;
        metadata?: any;
    }) {
        const evidence = await prisma.disputeEvidence.create({
            data: {
                disputeId,
                type: data.type,
                url: data.url,
                textExcerpt: data.textExcerpt,
                metadata: data.metadata || {}
            }
        });

        await prisma.disputeTimelineEvent.create({
            data: {
                disputeId,
                eventType: 'EVIDENCE_ADDED',
                payload: { evidenceId: evidence.id, type: data.type }
            }
        });

        return evidence;
    }

    async getDisputes(merchantId: string) {
        return prisma.dispute.findMany({
            where: { merchantId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getDisputeDetails(disputeId: string) {
        return prisma.dispute.findUnique({
            where: { id: disputeId },
            include: { evidence: true, timeline: true, order: true }
        });
    }
}

export const disputeService = new DisputeService();
