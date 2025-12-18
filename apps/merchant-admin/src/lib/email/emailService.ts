
import { prisma } from '@vayva/db';
import { EmailAdapter, EmailPayload } from './types';
import { ConsoleAdapter } from './adapters/consoleAdapter';


import { FlagService } from '../flags/flagService';

export class EmailService {

    // ... existing setup ...

    static async send(payload: EmailPayload) {
        // KILL SWITCH CHECK
        // Using "email.outbound.enabled" as the key
        // NOTE: In real world, we need merchantId context here. 
        // Assuming payload has it or we can derive it, otherwise falling back to Global Check.
        // For V1, we will check GLOBAL safety if no merchantId is available roughly, 
        // but ideally we should pass merchantId.

        // Let's assume global safety for generic system emails, or specific if known.
        // For safety, let's create a "system" context if generic.
        const enabled = await FlagService.isEnabled('email.outbound.enabled');
        if (!enabled) {
            console.warn(`[Email] Blocked by Kill Switch`);
            return { success: false, error: 'Feature Disabled' };
        }

        // ... existing logic

    private static adapter: EmailAdapter = new ConsoleAdapter(); // Default to Console

    static initialize() {
        if (process.env.EMAIL_PROVIDER === 'resend') {
            // this.adapter = new ResendAdapter(); // TODO: Import when ready
        }
    }

    static async send(payload: EmailPayload) {
        // 1. Check Suppression
        const suppression = await prisma.emailSuppression.findUnique({
            where: { email: payload.to }
        });

        if (suppression) {
            console.warn(`[EmailService] Suppression hit for ${payload.to}`);
            await this.logEmail(payload, 'suppressed', 'console', undefined, 'Recipient suppressed');
            return;
        }

        // 2. Log Queued/Sending
        // We log "sent" immediately after success usually, or "queued" if using a queue.
        // For sync sending V1:

        try {
            const result = await this.adapter.send(payload);

            await this.logEmail(
                payload,
                result.error ? 'failed' : 'sent',
                'console', // dynamic based on adapter
                result.providerId,
                result.error
            );

        } catch (e: any) {
            console.error('[EmailService] Send Failed', e);
            await this.logEmail(payload, 'failed', 'console', undefined, e.message);
        }
    }

    private static async logEmail(
        payload: EmailPayload,
        status: string,
        provider: string,
        providerMsgId?: string,
        error?: string
    ) {
        await prisma.emailMessage.create({
            data: {
                toEmail: payload.to,
                templateKey: payload.templateKey,
                merchantId: payload.merchantId,
                userId: payload.userId,
                status,
                provider,
                providerMsgId,
                subject: payload.subject,
                meta: payload.meta || {},
                correlationId: payload.correlationId,
                error
            }
        });
    }
}
