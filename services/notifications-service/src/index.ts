import Fastify from 'fastify';
import cors from '@fastify/cors';
import { notificationRoutes } from './routes';

const server = Fastify({ logger: true });

server.register(cors);

// Health check
server.get('/health', async () => ({ status: 'ok' }));

// Register Routes
server.register(notificationRoutes, { prefix: '/v1/notifications' });

const start = async () => {
    try {
        await server.listen({ port: 3008, host: '0.0.0.0' });
        console.log('Notifications Service running on port 3008');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
