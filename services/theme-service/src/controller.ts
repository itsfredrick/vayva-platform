import { prisma } from '@vayva/db';

const DEFAULT_TEMPLATE_SLUG = 'vayva-default';

export const ThemeController = {
    // --- Template Gallery ---
    listTemplates: async (filters?: any) => {
        return await prisma.template.findMany({
            where: {
                isActive: true,
                ...(filters?.category && filters.category !== 'All' && { category: filters.category })
            },
            orderBy: { createdAt: 'desc' },
            include: {
                assets: { where: { type: 'preview_image' }, take: 1 }
            }
        });
    },

    getTemplate: async (slug: string) => {
        return await prisma.template.findUnique({
            where: { slug },
            include: { assets: true, versions: true }
        });
    },

    // --- Merchant Theme Management ---
    getMerchantTheme: async (storeId: string) => {
        return await prisma.merchantTheme.findFirst({
            where: { storeId, status: 'PUBLISHED' },
            include: { template: true }
        });
    },

    applyTemplate: async (storeId: string, templateSlug: string, userId?: string) => {
        const template = await prisma.template.findUnique({ where: { slug: templateSlug } });
        if (!template) throw new Error('Template not found');

        // Create or update draft theme? 
        // Logic: Create new draft
        return await prisma.merchantTheme.create({
            data: {
                storeId,
                templateId: template.id,
                status: 'DRAFT',
                config: {},
                // History tracking handled by creating history snapshot on publish
            }
        });
    },

    updateSettings: async (storeId: string, config: any) => {
        const theme = await prisma.merchantTheme.findFirst({
            where: { storeId, status: 'DRAFT' } // Assume editing draft
        });

        if (!theme) throw new Error('No draft theme found');

        return await prisma.merchantTheme.update({
            where: { id: theme.id },
            data: {
                config
            }
        });
    },

    publishTheme: async (storeId: string, userId?: string) => {
        // Archive current published theme
        await prisma.merchantTheme.updateMany({
            where: { storeId, status: 'PUBLISHED' },
            data: { status: 'DRAFT', publishedAt: null }
        });

        // Get draft theme
        const draftTheme = await prisma.merchantTheme.findFirst({
            where: { storeId, status: 'DRAFT' }
        });

        if (!draftTheme) throw new Error('No draft theme found');

        // Create history snapshot
        await prisma.merchantThemeHistory.create({
            data: {
                storeId,
                themeId: draftTheme.id,
                templateId: draftTheme.templateId,
                templateVersionId: draftTheme.templateVersionId,
                configSnapshot: draftTheme.config || {},
                changedByUserId: userId
            }
        });

        // Publish draft
        return await prisma.merchantTheme.update({
            where: { id: draftTheme.id },
            data: {
                status: 'PUBLISHED',
                publishedAt: new Date()
            }
        });
    },

    // --- Auto-assign Default Template ---
    assignDefaultTemplate: async (storeId: string) => {
        const template = await prisma.template.findUnique({
            where: { slug: DEFAULT_TEMPLATE_SLUG }
        });

        if (!template) {
            console.warn(`Default template ${DEFAULT_TEMPLATE_SLUG} not found`);
            return null;
        }

        return await prisma.merchantTheme.create({
            data: {
                storeId,
                templateId: template.id,
                status: 'PUBLISHED',
                config: {},
                publishedAt: new Date()
            }
        });
    }
};
