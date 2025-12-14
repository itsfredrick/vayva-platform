import Fastify from 'fastify';
import cors from '@fastify/cors';
import { paymentRoutes } from './routes';

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get('/health', async () => ({ status: 'ok' }));

// Register Routes
server.register(paymentRoutes, { prefix: '/v1/payments' });

const start = async () => {
    try {
        await server.listen({ port: 3003, host: '0.0.0.0' });
        console.log('Payments Service running on port 3003');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
