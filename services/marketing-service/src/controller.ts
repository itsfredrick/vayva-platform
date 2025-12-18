
import { prisma } from '@vayva/db';

export const MarketingController = {
    // --- Discounts ---
    createDiscountRule: async (storeId: string, data: any) => {
        return await prisma.discountRule.create({
            data: {
                storeId,
                name: data.name,
                type: data.type,
                valueAmount: data.valueAmount,
                valuePercent: data.valuePercent,
                appliesTo: data.appliesTo || 'ALL',
                productIds: data.productIds || [],
                collectionIds: data.collectionIds || [],
                minOrderAmount: data.minOrderAmount,
                maxDiscountAmount: data.maxDiscountAmount,
                startsAt: new Date(data.startsAt),
                endsAt: data.endsAt ? new Date(data.endsAt) : null,
                usageLimitTotal: data.usageLimitTotal,
                usageLimitPerCustomer: data.usageLimitPerCustomer,
                requiresCoupon: data.requiresCoupon || false
            }
        });
    },

    listDiscountRules: async (storeId: string) => {
        return await prisma.discountRule.findMany({
            where: { storeId },
            include: { coupons: true },
            orderBy: { createdAt: 'desc' }
        });
    },

    createCoupon: async (storeId: string, ruleId: string, code: string) => {
        return await prisma.coupon.create({
            data: {
                storeId,
                ruleId,
                code: code.toUpperCase(),
                status: 'ACTIVE'
            }
        });
    },

    // --- Segments ---
    createSegment: async (storeId: string, data: any) => {
        return await prisma.segment.create({
            data: {
                storeId,
                name: data.name,
                definition: data.definition
            }
        });
    },

    listSegments: async (storeId: string) => {
        return await prisma.segment.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' }
        });
    },

    // --- Campaigns ---
    createCampaign: async (storeId: string, userId: string, data: any) => {
        return await prisma.campaign.create({
            data: {
                storeId,
                type: data.type || 'BROADCAST',
                channel: data.channel || 'WHATSAPP',
                name: data.name,
                status: 'DRAFT',
                segmentId: data.segmentId,
                messageBody: data.messageBody,
                messageTemplateKey: data.messageTemplateKey,
                variables: data.variables,
                createdByUserId: userId
            }
        });
    },

    listCampaigns: async (storeId: string) => {
        return await prisma.campaign.findMany({
            where: { storeId },
            include: { segment: true },
            orderBy: { createdAt: 'desc' }
        });
    },

    // --- Automations ---
    upsertAutomationRule: async (storeId: string, key: string, data: any) => {
        return await prisma.automationRule.upsert({
            where: { storeId_key: { storeId, key } },
            create: {
                storeId,
                key,
                enabled: data.enabled || false,
                config: data.config || {}
            },
            update: {
                enabled: data.enabled,
                config: data.config
            }
        });
    },

    listAutomationRules: async (storeId: string) => {
        return await prisma.automationRule.findMany({
            where: { storeId }
        });
    }
};
