
import { prisma } from '@vayva/db';

const DEFAULT_TEMPLATE_KEY = 'vayva_light_glass_store_default';

export const ThemeController = {
    // --- Template Gallery ---
    listTemplates: async (filters?: any) => {
        return await prisma.themeTemplate.findMany({
            where: {
                isActive: true,
                ...(filters?.category && { category: filters.category })
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    getTemplate: async (key: string) => {
        return await prisma.themeTemplate.findUnique({
            where: { key }
        });
    },

    // --- Merchant Theme Management ---
    getMerchantTheme: async (storeId: string) => {
        return await prisma.merchantTheme.findFirst({
            where: { storeId, status: 'PUBLISHED' },
            include: { template: true, settings: true }
        });
    },

    applyTemplate: async (storeId: string, templateKey: string, userId?: string) => {
        // Create draft theme
        const theme = await prisma.merchantTheme.create({
            data: {
                storeId,
                templateKey,
                templateVersion: 1,
                status: 'DRAFT'
            }
        });

        // Create default settings
        await prisma.merchantThemeSettings.create({
            data: {
                storeId,
                themeId: theme.id,
                brandName: 'My Store',
                accentColor: '#22C55E'
            }
        });

        return theme;
    },

    updateSettings: async (storeId: string, settings: any) => {
        const theme = await prisma.merchantTheme.findFirst({
            where: { storeId, status: 'DRAFT' }
        });

        if (!theme) throw new Error('No draft theme found');

        return await prisma.merchantThemeSettings.upsert({
            where: { themeId: theme.id },
            create: {
                storeId,
                themeId: theme.id,
                ...settings
            },
            update: settings
        });
    },

    publishTheme: async (storeId: string, userId?: string) => {
        // Archive current published theme
        await prisma.merchantTheme.updateMany({
            where: { storeId, status: 'PUBLISHED' },
            data: { status: 'DRAFT' }
        });

        // Get draft theme
        const draftTheme = await prisma.merchantTheme.findFirst({
            where: { storeId, status: 'DRAFT' },
            include: { settings: true }
        });

        if (!draftTheme) throw new Error('No draft theme found');

        // Create history snapshot
        await prisma.merchantThemeHistory.create({
            data: {
                storeId,
                themeId: draftTheme.id,
                templateKey: draftTheme.templateKey,
                templateVersion: draftTheme.templateVersion,
                settingsSnapshot: draftTheme.settings || {},
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
        // Check if template exists
        const template = await prisma.themeTemplate.findUnique({
            where: { key: DEFAULT_TEMPLATE_KEY }
        });

        if (!template) {
            console.warn(`Default template ${DEFAULT_TEMPLATE_KEY} not found`);
            return null;
        }

        // Create published theme
        const theme = await prisma.merchantTheme.create({
            data: {
                storeId,
                templateKey: DEFAULT_TEMPLATE_KEY,
                templateVersion: 1,
                status: 'PUBLISHED',
                publishedAt: new Date()
            }
        });

        // Create default settings
        await prisma.merchantThemeSettings.create({
            data: {
                storeId,
                themeId: theme.id,
                brandName: 'My Store',
                accentColor: '#22C55E'
            }
        });

        return theme;
    }
};
