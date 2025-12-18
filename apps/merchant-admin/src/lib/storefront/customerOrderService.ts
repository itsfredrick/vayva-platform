
import { prisma } from '@vayva/db';

export class CustomerOrderService {

    static async getOrders(storeId: string, customerUserId: string) {
        // Find links
        const links = await prisma.orderCustomerLink.findMany({
            where: { storeId, customerUserId },
            orderBy: { orderId: 'desc' } // Mock sort, ideally join Order date
        });

        // In real app: return prisma.order.findMany({ where: { id: { in: links.map(l=>l.orderId) } } })
        return links.map(l => ({ orderId: l.orderId, status: 'mock_delivered', date: new Date() }));
    }

    static async getOrderDetail(storeId: string, customerUserId: string, orderId: string) {
        // 1. Strict Access Control
        const link = await prisma.orderCustomerLink.findFirst({
            where: { orderId, storeId, customerUserId }
        });

        if (!link) {
            throw new Error('Order not found or access denied');
        }

        // Return Order Data (Mock)
        return {
            id: orderId,
            items: [{ id: '1', name: 'Product A', price: 5000 }],
            total: 5000,
            status: 'delivered',
            trackingRef: 'TRK_123456',
            canReturn: true
        };
    }
}
