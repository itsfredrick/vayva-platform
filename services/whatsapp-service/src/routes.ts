import { FastifyInstance } from 'fastify';
import { webhookHandler, sendHandler, listConversationsHandler, listMessagesHandler } from './controller';

export const whatsappRoutes = async (server: FastifyInstance) => {
    server.post('/webhook', webhookHandler);
    server.post('/send', sendHandler);
    server.get('/conversations', listConversationsHandler);
    server.get('/conversations/:id/messages', listMessagesHandler);
};
