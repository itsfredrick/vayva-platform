import { PrismaClient, Prisma } from '@prisma/client';

export { PrismaClient, Prisma };

// Export frequently used enums explicitly to satisfy Turbopack/Next.js 16
// while ensuring workspace services (like audit-service, whatsapp-service) have access to them.
export {
    Direction,
    MessageStatus,
    MessageType,
    AppRole,
    OnboardingStatus,
    OrderStatus,
    PaymentStatus,
    FulfillmentStatus,
    SubscriptionStatus,
    ApiKeyStatus,
    Channel
} from '@prisma/client';

// Re-export all types (types are safe for Turbopack as they are erased)
export type * from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
