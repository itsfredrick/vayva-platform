import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './lib/config';
import authPlugin from './plugins/auth';
import signupRoute from './routes/auth/signup';
import loginRoute from './routes/auth/login';
import forgotPasswordRoute from './routes/auth/forgot-password';
import resetPasswordRoute from './routes/auth/reset-password';
import onboardingRoute from './routes/onboarding';

import proxy from '@fastify/http-proxy';

const server = Fastify({
    logger: true
});

server.register(cors);
server.register(authPlugin);

server.get('/health', async () => {
    return { status: 'ok' };
});

// Proxy to Auth Service
server.register(proxy, {
    upstream: 'http://localhost:3001',
    prefix: '/v1/auth',
    rewritePrefix: '/v1/auth',
    http2: false
});

// Proxy to Orders Service
server.register(proxy, {
    upstream: 'http://localhost:3002',
    prefix: '/v1/orders',
    rewritePrefix: '/v1/orders',
    http2: false
});

// Proxy to Payments Service
server.register(proxy, {
    upstream: 'http://localhost:3003',
    prefix: '/v1/payments',
    rewritePrefix: '/v1/payments',
    http2: false
});

// Proxy to Audit Service
server.register(proxy, {
    upstream: 'http://localhost:3004',
    prefix: '/v1/audit',
    rewritePrefix: '/v1/audit',
    http2: false
});

// Proxy to WhatsApp Service
server.register(proxy, {
    upstream: 'http://localhost:3005',
    prefix: '/v1/whatsapp',
    rewritePrefix: '/v1/whatsapp',
    http2: false
});

// Proxy to AI Orchestrator
server.register(proxy, {
    upstream: 'http://localhost:3006',
    prefix: '/v1/ai',
    rewritePrefix: '/v1/ai',
    http2: false
});

// Proxy to Approvals Service
server.register(proxy, {
    upstream: 'http://localhost:3007',
    prefix: '/v1/approvals',
    rewritePrefix: '/v1/approvals',
    http2: false
});

// Proxy to Notifications Service
server.register(proxy, {
    upstream: 'http://localhost:3008',
    prefix: '/v1/notifications',
    rewritePrefix: '/v1/notifications',
    http2: false
});

// Proxy to Products Service
server.register(proxy, {
    upstream: 'http://localhost:3009',
    prefix: '/v1/products',
    rewritePrefix: '/v1/products',
    http2: false
});

// Proxy to Public Storefront Endpoints
server.register(proxy, {
    upstream: 'http://localhost:3009',
    prefix: '/v1/public/products',
    rewritePrefix: '/v1/products/public', // Rewrite to specific public route in service
    http2: false
});

server.register(proxy, {
    upstream: 'http://localhost:3002', // Orders Service
    prefix: '/v1/public/checkout',
    rewritePrefix: '/v1/orders/checkout',
    http2: false
});

server.register(proxy, {
    upstream: 'http://localhost:3003', // Payments Service
    prefix: '/v1/public/pay',
    rewritePrefix: '/v1/payments/initialize',
    http2: false
});

// Legacy Routes (Disabled for V1 refactor)
// server.register(signupRoute, { prefix: '/auth' });
// server.register(loginRoute, { prefix: '/auth' });
// ...

// Onboarding Routes (Might need refactor later)
server.register(onboardingRoute, { prefix: '/onboarding' });

// Stubs for Webhooks
server.post('/webhooks/paystack', async (request, reply) => {
    // TODO: Verify signature
    // TODO: Idempotency check
    // TODO: Forward to Payments Service
    return { status: 'received' };
});

server.post('/webhooks/whatsapp', async (request, reply) => {
    // TODO: Verify signature
    // TODO: Forward to WhatsApp Service
    return { status: 'received' };
});

const start = async () => {
    try {
        await server.listen({ port: parseInt(config.PORT) || 4000, host: '0.0.0.0' });
        console.log(`API Gateway running on port ${parseInt(config.PORT) || 4000}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
