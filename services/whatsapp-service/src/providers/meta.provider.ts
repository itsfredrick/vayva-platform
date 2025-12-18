import { WhatsAppProvider, SendMessageOptions } from './interface';

export class MetaProvider implements WhatsAppProvider {
    async sendMessage(options: SendMessageOptions): Promise<{ providerMessageId: string }> {
        console.log(`[MetaProvider] Mocking send to ${options.recipient}: ${options.body || options.templateName}`);

        // Mock a provider message ID
        return {
            providerMessageId: `wamid.${Math.random().toString(36).substring(7)}`
        };
    }

    async syncTemplates(): Promise<void> {
        console.log(`[MetaProvider] Mocking template sync...`);
    }
}
