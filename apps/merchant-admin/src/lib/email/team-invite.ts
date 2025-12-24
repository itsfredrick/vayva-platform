import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendTeamInviteParams {
    email: string;
    storeName: string;
    role: string;
    inviterName: string;
}

export async function sendTeamInvite({
    email,
    storeName,
    role,
    inviterName,
}: SendTeamInviteParams) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Vayva <noreply@vayva.com>',
            to: [email],
            subject: `You've been invited to join ${storeName} on Vayva`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #22C55E; color: white; padding: 20px; text-align: center; }
                        .content { padding: 30px 20px; background: #f9f9f9; }
                        .button { display: inline-block; padding: 12px 30px; background: #22C55E; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Vayva</h1>
                        </div>
                        <div class="content">
                            <h2>You've been invited!</h2>
                            <p>Hi there,</p>
                            <p><strong>${inviterName}</strong> has invited you to join <strong>${storeName}</strong> on Vayva as a <strong>${role}</strong>.</p>
                            <p>As a ${role}, you'll be able to:</p>
                            <ul>
                                ${role === 'OWNER' ? '<li>Full access to all features including billing</li>' : ''}
                                ${role === 'ADMIN' ? '<li>Manage orders, products, and customers</li><li>View analytics and reports</li>' : ''}
                                ${role === 'SUPPORT' ? '<li>View orders and chat with customers</li><li>Provide customer support</li>' : ''}
                            </ul>
                            <p>Click the button below to accept the invitation and get started:</p>
                            <a href="${process.env.NEXTAUTH_URL}/accept-invite?email=${encodeURIComponent(email)}" class="button">
                                Accept Invitation
                            </a>
                            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Vayva. All rights reserved.</p>
                            <p>Lagos, Nigeria</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            throw new Error(error.message);
        }

        return { success: true, data };
    } catch (error: any) {
        console.error('Email send error:', error);
        throw error;
    }
}
