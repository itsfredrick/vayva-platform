import { FastifyInstance } from 'fastify';
import { verifyPaymentHandler, webhookHandler, listTransactionsHandler, initializeTransactionHandler } from './controller';

export const paymentRoutes = async (server: FastifyInstance) => {
    server.post('/verify', verifyPaymentHandler);
    server.post('/webhook', webhookHandler);
    server.get('/transactions', listTransactionsHandler);
    server.post('/initialize', initializeTransactionHandler);
};
