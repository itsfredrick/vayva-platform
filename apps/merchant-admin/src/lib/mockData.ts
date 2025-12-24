/**
 * Centralized Mock Data Utility
 * 
 * This file contains all mock data used across the dashboard for development.
 * In production, these will be replaced with real API calls to the database.
 * 
 * Usage:
 * import { mockWalletBalance, mockOrders } from '@/lib/mockData';
 */

// ============================================================================
// WALLET MOCK DATA
// ============================================================================

export const mockWalletBalance = {
    available: 250000,
    pending: 75000,
    total: 325000,
    blocked: 0,
    currency: 'NGN',
    lastUpdated: new Date().toISOString()
};

export const mockWalletTransactions = [
    {
        id: 'txn_001',
        merchantId: 'merchant_001',
        type: 'PAYMENT',
        amount: 15000,
        currency: 'NGN',
        status: 'COMPLETED',
        source: 'order',
        referenceId: 'ORD-2024-001',
        description: 'Payment for Order #001',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'txn_002',
        merchantId: 'merchant_001',
        type: 'PAYMENT',
        amount: 25000,
        currency: 'NGN',
        status: 'COMPLETED',
        source: 'order',
        referenceId: 'ORD-2024-002',
        description: 'Payment for Order #002',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'txn_003',
        merchantId: 'merchant_001',
        type: 'PAYOUT',
        amount: -50000,
        currency: 'NGN',
        status: 'COMPLETED',
        source: 'bank_transfer',
        referenceId: 'PAYOUT-001',
        description: 'Withdrawal to bank account',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
];

export const mockWalletSettlements = [
    {
        id: 'settlement_001',
        amount: 250000,
        currency: 'NGN',
        status: 'PENDING',
        payoutDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        referenceId: 'SETTLE-2024-001',
        description: 'Next scheduled payout'
    },
    {
        id: 'settlement_002',
        amount: 500000,
        currency: 'NGN',
        status: 'COMPLETED',
        payoutDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        referenceId: 'SETTLE-2024-002',
        description: 'Last payout - Dec 21'
    }
];

// ============================================================================
// ORDERS MOCK DATA
// ============================================================================

export const mockOrders = [
    {
        id: 'ord_1025',
        merchantId: 'mer_1',
        type: 'retail',
        status: 'NEW',
        paymentStatus: 'paid',
        customer: { id: 'c1', name: 'Chioma Adebayo', phone: '+234 801 234 5678' },
        items: [{ id: 'p1', name: 'Vintage Silk Scarf', quantity: 1, price: 12000 }],
        totalAmount: 12000,
        currency: 'NGN',
        source: 'whatsapp',
        timestamps: {
            createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
        },
        fulfillmentType: 'delivery'
    },
    {
        id: 'ord_1024',
        merchantId: 'mer_1',
        type: 'retail',
        status: 'PROCESSING',
        paymentStatus: 'paid',
        customer: { id: 'c2', name: 'Ibrahim Musa', phone: '+234 705 555 1212' },
        items: [{ id: 'p2', name: 'Leather Wallet', quantity: 1, price: 8500 }],
        totalAmount: 8500,
        currency: 'NGN',
        source: 'website',
        timestamps: {
            createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
        },
        fulfillmentType: 'delivery'
    },
    {
        id: 'ord_1023',
        merchantId: 'mer_1',
        type: 'retail',
        status: 'COMPLETED',
        paymentStatus: 'paid',
        customer: { id: 'c3', name: 'Amaka Okafor', phone: '+234 803 123 4567' },
        items: [
            { id: 'p3', name: 'Designer Handbag', quantity: 1, price: 35000 },
            { id: 'p4', name: 'Sunglasses', quantity: 1, price: 8000 }
        ],
        totalAmount: 43000,
        currency: 'NGN',
        source: 'whatsapp',
        timestamps: {
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
        },
        fulfillmentType: 'delivery'
    },
    {
        id: 'ord_1022',
        merchantId: 'mer_1',
        type: 'retail',
        status: 'NEW',
        paymentStatus: 'pending',
        customer: { id: 'c4', name: 'Tunde Bakare', phone: '+234 806 789 0123' },
        items: [{ id: 'p5', name: 'Running Shoes', quantity: 2, price: 15000 }],
        totalAmount: 30000,
        currency: 'NGN',
        source: 'website',
        timestamps: {
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
        },
        fulfillmentType: 'delivery'
    },
    {
        id: 'ord_1021',
        merchantId: 'mer_1',
        type: 'retail',
        status: 'PROCESSING',
        paymentStatus: 'paid',
        customer: { id: 'c5', name: 'Ngozi Eze', phone: '+234 809 456 7890' },
        items: [{ id: 'p6', name: 'Laptop Sleeve', quantity: 1, price: 12500 }],
        totalAmount: 12500,
        currency: 'NGN',
        source: 'whatsapp',
        timestamps: {
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
        },
        fulfillmentType: 'pickup'
    }
];

export const mockOrderStats = {
    totalRevenue: 154000,
    countNew: 5,
    countInProgress: 3,
    countCompleted: 12,
    countPendingPayment: 2
};

// ============================================================================
// PRODUCTS MOCK DATA
// ============================================================================

export const mockProducts = [
    {
        id: 'prod_001',
        merchantId: 'mer_1',
        type: 'RETAIL',
        name: 'Premium T-Shirt',
        description: 'High-quality cotton t-shirt with modern fit',
        price: 5000,
        currency: 'NGN',
        status: 'ACTIVE',
        inventory: {
            enabled: true,
            quantity: 50
        },
        itemsSold: 12,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'prod_002',
        merchantId: 'mer_1',
        type: 'RETAIL',
        name: 'Designer Sneakers',
        description: 'Comfortable and stylish sneakers for everyday wear',
        price: 25000,
        currency: 'NGN',
        status: 'ACTIVE',
        inventory: {
            enabled: true,
            quantity: 20
        },
        itemsSold: 8,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'prod_003',
        merchantId: 'mer_1',
        type: 'RETAIL',
        name: 'Leather Wallet',
        description: 'Genuine leather wallet with multiple card slots',
        price: 8500,
        currency: 'NGN',
        status: 'ACTIVE',
        inventory: {
            enabled: true,
            quantity: 35
        },
        itemsSold: 15,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'prod_004',
        merchantId: 'mer_1',
        type: 'RETAIL',
        name: 'Designer Handbag',
        description: 'Elegant handbag perfect for any occasion',
        price: 35000,
        currency: 'NGN',
        status: 'ACTIVE',
        inventory: {
            enabled: true,
            quantity: 10
        },
        itemsSold: 5,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'prod_005',
        merchantId: 'mer_1',
        type: 'RETAIL',
        name: 'Sunglasses',
        description: 'UV protection sunglasses with polarized lenses',
        price: 8000,
        currency: 'NGN',
        status: 'ACTIVE',
        inventory: {
            enabled: true,
            quantity: 40
        },
        itemsSold: 20,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'prod_006',
        merchantId: 'mer_1',
        type: 'RETAIL',
        name: 'Laptop Sleeve',
        description: 'Protective sleeve for 13-15 inch laptops',
        price: 12500,
        currency: 'NGN',
        status: 'DRAFT',
        inventory: {
            enabled: true,
            quantity: 0
        },
        itemsSold: 0,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get mock data by type
 * Useful for dynamic imports in API routes
 */
export function getMockData(type: 'wallet-balance' | 'wallet-transactions' | 'wallet-settlements' | 'orders' | 'order-stats' | 'products') {
    switch (type) {
        case 'wallet-balance':
            return mockWalletBalance;
        case 'wallet-transactions':
            return mockWalletTransactions;
        case 'wallet-settlements':
            return mockWalletSettlements;
        case 'orders':
            return mockOrders;
        case 'order-stats':
            return mockOrderStats;
        case 'products':
            return mockProducts;
        default:
            return null;
    }
}

/**
 * Simulate API delay for more realistic testing
 */
export async function simulateDelay(ms: number = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
