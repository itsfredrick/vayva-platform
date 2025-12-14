import { FastifyInstance } from 'fastify';
import { loginHandler, verifyMfaHandler, registerOpsHandler, setupMfaHandler } from './controller';

export const opsRoutes = async (server: FastifyInstance) => {
    server.post('/login', loginHandler);
    server.post('/mfa/verify', verifyMfaHandler);

    // Internal/Bootstrap utils
    server.post('/register', registerOpsHandler);
    server.post('/mfa/setup', setupMfaHandler); // Helper to generate secret
};
