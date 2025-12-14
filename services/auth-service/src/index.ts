import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { merchantRoutes } from './merchant/routes';
import { customerRoutes } from './customer/routes';
import { opsRoutes } from './ops/routes';

const server = Fastify({ logger: true });

server.register(cors);
server.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret',
});

// Health check
server.get('/health', async () => ({ status: 'ok' }));

// Register Routes
server.register(merchantRoutes, { prefix: '/v1/auth/merchant' });
server.register(customerRoutes, { prefix: '/v1/auth/customer' });
server.register(opsRoutes, { prefix: '/v1/auth/ops' });

const start = async () => {
    try {
        await server.listen({ port: 3001, host: '0.0.0.0' });
        console.log('Auth Service running on port 3001');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
