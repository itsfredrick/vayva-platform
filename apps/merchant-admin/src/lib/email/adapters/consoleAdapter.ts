
import { EmailAdapter, EmailPayload } from '../types';

export class ConsoleAdapter implements EmailAdapter {
    async send(payload: EmailPayload) {
        console.log(`
        ------------------------------------------
        [EMAIL SENT - CONSOLE]
        TO: ${payload.to}
        SUBJECT: ${payload.subject}
        TEMPLATE: ${payload.templateKey}
        CORRELATION: ${payload.correlationId}
        ------------------------------------------
        ${payload.text || '(No Plaintext)'}
        ------------------------------------------
        `);
        return { providerId: `console-${Date.now()}` };
    }
}
