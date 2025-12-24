import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export class ResendEmailService {
    private static fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@vayva.com';

    /**
     * Send OTP verification email
     */
    static async sendOTPEmail(to: string, code: string, firstName?: string) {
        if (!process.env.RESEND_API_KEY) {
            console.log(`[DEV] OTP Email would be sent to ${to}: ${code}`);
            return { success: true, messageId: 'dev-mode' };
        }

        try {
            const { data, error } = await resend.emails.send({
                from: this.fromEmail,
                to,
                subject: 'Verify your email - Vayva',
                html: this.getOTPTemplate(code, firstName),
            });

            if (error) {
                console.error('[Resend] Error sending OTP:', error);
                return { success: false, error: error.message };
            }

            return { success: true, messageId: data?.id };
        } catch (error: any) {
            console.error('[Resend] Exception sending OTP:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send welcome email after verification
     */
    static async sendWelcomeEmail(to: string, firstName: string, storeName: string) {
        if (!process.env.RESEND_API_KEY) {
            console.log(`[DEV] Welcome email would be sent to ${to}`);
            return { success: true, messageId: 'dev-mode' };
        }

        try {
            const { data, error } = await resend.emails.send({
                from: this.fromEmail,
                to,
                subject: `Welcome to Vayva, ${firstName}!`,
                html: this.getWelcomeTemplate(firstName, storeName),
            });

            if (error) {
                console.error('[Resend] Error sending welcome email:', error);
                return { success: false, error: error.message };
            }

            return { success: true, messageId: data?.id };
        } catch (error: any) {
            console.error('[Resend] Exception sending welcome email:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * OTP Email Template
     */
    private static getOTPTemplate(code: string, firstName?: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 24px 0; font-size: 28px; font-weight: 700; color: #000000;">
                                ${firstName ? `Hi ${firstName}!` : 'Welcome!'}
                            </h1>
                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #666666;">
                                Thanks for signing up with Vayva. To complete your registration, please verify your email address using the code below:
                            </p>
                            <div style="background-color: #f8f8f8; border-radius: 8px; padding: 32px; text-align: center; margin: 32px 0;">
                                <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #000000; font-family: 'Courier New', monospace;">
                                    ${code}
                                </div>
                            </div>
                            <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 20px; color: #999999;">
                                This code will expire in 10 minutes.
                            </p>
                            <p style="margin: 0; font-size: 14px; line-height: 20px; color: #999999;">
                                If you didn't request this code, please ignore this email.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 24px 40px; border-top: 1px solid #eeeeee; text-align: center;">
                            <p style="margin: 0; font-size: 12px; color: #999999;">
                                © ${new Date().getFullYear()} Vayva. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;
    }

    /**
     * Welcome Email Template
     */
    private static getWelcomeTemplate(firstName: string, storeName: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Vayva</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 24px 0; font-size: 28px; font-weight: 700; color: #000000;">
                                Welcome to Vayva, ${firstName}! 🎉
                            </h1>
                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #666666;">
                                Your email has been verified successfully. You're all set to start building ${storeName}!
                            </p>
                            <div style="background-color: #f8f8f8; border-radius: 8px; padding: 24px; margin: 24px 0;">
                                <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #000000;">
                                    Next Steps:
                                </h3>
                                <ul style="margin: 0; padding-left: 20px; color: #666666;">
                                    <li style="margin-bottom: 8px;">Complete your onboarding to set up your store</li>
                                    <li style="margin-bottom: 8px;">Add your first products or services</li>
                                    <li style="margin-bottom: 8px;">Connect your payment methods</li>
                                    <li>Start accepting orders!</li>
                                </ul>
                            </div>
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="${process.env.NEXTAUTH_URL || 'https://vayva.com'}/onboarding" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                    Continue Onboarding
                                </a>
                            </div>
                            <p style="margin: 0; font-size: 14px; line-height: 20px; color: #999999;">
                                Need help? Reply to this email or visit our help center.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 24px 40px; border-top: 1px solid #eeeeee; text-align: center;">
                            <p style="margin: 0; font-size: 12px; color: #999999;">
                                © ${new Date().getFullYear()} Vayva. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;
    }
}
