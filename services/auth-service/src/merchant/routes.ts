import { FastifyInstance } from 'fastify';
import { loginHandler, registerHandler, createStoreHandler } from './controller';

export const merchantRoutes = async (server: FastifyInstance) => {
    server.post('/login', loginHandler);
    server.post('/register', registerHandler);

    // authenticated routes
    server.post('/stores', { onRequest: [server.authenticate] }, createStoreHandler);

    // server.post('/refresh', refreshHandler);
    // server.post('/logout', logoutHandler);
    // server.post('/forgot-password', forgotPasswordHandler);
    // server.post('/reset-password', resetPasswordHandler);
};
