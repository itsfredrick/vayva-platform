import {
    StoreConfig,
    StoreTemplate,
    StoreBranding,
    StorePage,
    StoreNavigation,
    StorePolicy
} from '../types/control-center';

// MOCK DATA
const MOCK_TEMPLATES: StoreTemplate[] = [
    {
        id: 'vayva-storefront',
        name: 'Vayva Storefront',
        description: 'The official, high-performance storefront designed for conversion.',
        category: 'minimal',
        isPremium: false,
    },
    {
        id: 'modern-retail',
        name: 'Modern Retail',
        description: 'Clean lines and large imagery, perfect for fashion and lifestyle.',
        category: 'editorial',
        isPremium: true,
    },
    {
        id: 'catalog-pro',
        name: 'Catalog Pro',
        description: 'Dense layout for large inventories.',
        category: 'catalog',
        isPremium: true,
    },
    {
        id: 'boutique',
        name: 'Boutique',
        description: 'Elegant typeface and whitespace for luxury items.',
        category: 'minimal',
        isPremium: false,
    }
];

let mockStore: StoreConfig = {
    templateId: 'vayva-storefront',
    branding: {
        storeName: 'My Awesome Store',
        accentColor: '#000000',
        fontHeading: 'Space Grotesk',
        fontBody: 'Inter',
    },
    pages: [
        { id: '1', title: 'About Us', slug: 'about', isPublished: true, updatedAt: new Date(), content: 'Welcome to our store.' },
        { id: '2', title: 'Contact', slug: 'contact', isPublished: true, updatedAt: new Date(), content: 'Contact us at help@example.com' },
    ],
    navigation: {
        header: [
            { id: 'n1', label: 'Home', path: '/', type: 'page' },
            { id: 'n2', label: 'Shop', path: '/shop', type: 'collection' },
        ],
        footer: [
            { id: 'n3', label: 'Returns', path: '/policies/returns', type: 'page' },
        ],
    },
    policies: [
        { type: 'returns', title: 'Return Policy', content: '30-day returns.', isEnabled: true },
        { type: 'shipping', title: 'Shipping Policy', content: 'We ship worldwide.', isEnabled: true },
    ],
    domains: {
        subdomain: 'my-store',
        status: 'active'
    },
    isPublished: false,
};

export const ControlCenterService = {
    getTemplates: async (): Promise<StoreTemplate[]> => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        return MOCK_TEMPLATES;
    },

    getStoreConfig: async (): Promise<StoreConfig> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { ...mockStore };
    },

    updateTemplate: async (templateId: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        mockStore.templateId = templateId;
    },

    updateBranding: async (branding: Partial<StoreBranding>): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        mockStore.branding = { ...mockStore.branding, ...branding };
    },

    // Pages
    getPages: async (): Promise<StorePage[]> => {
        return mockStore.pages;
    },

    createPage: async (page: Omit<StorePage, 'id' | 'updatedAt'>): Promise<StorePage> => {
        const newPage: StorePage = {
            ...page,
            id: Math.random().toString(36).substr(2, 9),
            updatedAt: new Date(),
        };
        mockStore.pages.push(newPage);
        return newPage;
    },

    updatePage: async (id: string, updates: Partial<StorePage>): Promise<void> => {
        mockStore.pages = mockStore.pages.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p);
    },

    // Mock Publish
    publishStore: async (): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        mockStore.isPublished = true;
    }
};
