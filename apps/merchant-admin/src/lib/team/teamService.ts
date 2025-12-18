
import { prisma } from '@vayva/db';
import { SecurityUtils } from '../security/tokens';
import { ROLES } from './permissions';
import { EmailService } from '../email/emailService';

export class TeamService {

    static SEAT_LIMITS: Record<string, number> = {
        'growth': 1,
        'pro': 5,
        'enterprise': 100
    };

    static async getSeatUsage(merchantId: string) {
        return prisma.teamMember.count({
            where: { merchantId, status: 'active' }
        });
    }

    static async inviteMember(merchantId: string, createdByUserId: string, data: { email: string, role: string }) {
        // 1. Check Limits (Mock Plan)
        const currentSeats = await this.getSeatUsage(merchantId);
        const limit = this.SEAT_LIMITS['pro']; // Mock Plan Lookup

        if (currentSeats >= limit) {
            throw new Error(`Seat limit reached (${limit}). Upgrade required.`);
        }

        // 2. Create Invite
        const token = SecurityUtils.generateToken();
        const tokenHash = SecurityUtils.hashToken(token);

        await prisma.teamInvite.create({
            data: {
                merchantId,
                invitedEmail: data.email,
                role: data.role,
                tokenHash,
                createdByUserId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });

        // 3. Send Email
        await EmailService.send({
            to: data.email,
            subject: 'You have been invited to Vayva',
            html: `<p>Accept invite: <a href="/invite/accept?token=${token}">Accept</a></p>`,
            text: `Accept: /invite/accept?token=${token}`,
            templateKey: 'team_invite',
            merchantId,
            correlationId: `invite_${tokenHash.substring(0, 8)}`
        });
        await prisma.teamMember.create({
            data: {
                merchantId,
                email: data.email,
                role: data.role,
                status: 'invited'
            }
        });
    }

    static async acceptInvite(token: string, userId: string) {
        const tokenHash = SecurityUtils.hashToken(token);

        const invite = await prisma.teamInvite.findUnique({ where: { tokenHash } });
        if (!invite) throw new Error('Invalid Invite');
        if (invite.expiresAt < new Date()) throw new Error('Expired Invite');
        if (invite.acceptedAt) throw new Error('Already Accepted');

        await prisma.$transaction(async (tx) => {
            // Mark Accepted
            await tx.teamInvite.update({
                where: { id: invite.id },
                data: { acceptedAt: new Date() }
            });

            // Update Member to Active
            // Find by email or create if email mismatch (edge case, simplified for V1)
            // We update the one created during invite
            if (invite.invitedEmail) {
                await tx.teamMember.updateMany({
                    where: { merchantId: invite.merchantId, email: invite.invitedEmail },
                    data: { status: 'active', userId }
                });
            }
        });
    }
}
