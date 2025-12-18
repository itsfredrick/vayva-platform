
import { prisma } from '@vayva/db';
import { SecurityUtils } from '../security/tokens';
// import { EmailService } from '../email/emailService'; // Verify path or mock if unavailable in this context

export class CustomerAuthService {

    static async signup(storeId: string, data: { email: string, password?: string, phone?: string }) {
        // 1. Check Linkage
        // In V1 we create user. Unique constraint handles duplicates.

        // Mock Hash
        const passwordHash = data.password ? SecurityUtils.hashToken(data.password) : undefined;

        return prisma.customerUser.create({
            data: {
                storeId,
                email: data.email,
                phone: data.phone,
                passwordHash
            }
        });
    }

    static async login(storeId: string, data: { email: string, password?: string }) {
        const user = await prisma.customerUser.findFirst({
            where: { storeId, email: data.email }
        });

        if (!user || !user.passwordHash) throw new Error('Invalid credentials');

        // Mock Verify
        const inputHash = SecurityUtils.hashToken(data.password || '');
        if (!SecurityUtils.constantTimeCompare(user.passwordHash, inputHash)) {
            throw new Error('Invalid credentials');
        }

        // Create Session
        const token = SecurityUtils.generateToken();
        const tokenHash = SecurityUtils.hashToken(token);

        await prisma.customerSession.create({
            data: {
                customerUserId: user.id,
                sessionTokenHash: tokenHash
            }
        });

        return { sessionToken: token, user };
    }

    static async validateSession(token: string) {
        const tokenHash = SecurityUtils.hashToken(token);
        const session = await prisma.customerSession.findUnique({
            where: { sessionTokenHash: tokenHash }
        });

        if (!session || session.revokedAt) return null;

        // Ideally check expiry (e.g. 30 days)
        return session;
    }
}
