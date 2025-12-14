import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from '../../utils/hash';
import jwt from 'jsonwebtoken'; // Using standard lib or fastify-jwt properly

const prisma = new PrismaClient();

// ... login/register handlers ...

// Assuming login/register are already there, I will APPEND createStoreHandler 
// properly to avoid overwriting existing logic if I can't see it all. 
// But I need to view the file first to append properly or overwrite safely.
// I'll replace the file content with the updated full content.

export const loginHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = req.body as any;

    const user = await prisma.merchantUser.findUnique({
        where: { email },
        include: { memberships: true }, // Include memberships
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
        return reply.status(401).send({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = await reply.jwtSign({
        sub: user.id,
        email: user.email,
        aud: 'merchant',
        memberships: user.memberships.map((m: any) => m.storeId), // Use 'any' or proper type
    });

    // Store session in DB
    await prisma.merchantSession.create({
        data: {
            userId: user.id,
            token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        },
    });

    return reply.send({
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            memberships: user.memberships.map((m: any) => m.storeId)
        }
    });
};

export const registerHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, password, name } = req.body as any;

    const existing = await prisma.merchantUser.findUnique({ where: { email } });
    if (existing) return reply.status(400).send({ error: 'Email already exists' });

    const hashedPassword = await hashPassword(password);

    const user = await prisma.merchantUser.create({
        data: {
            email,
            passwordHash: hashedPassword,
            name
        }
    });

    return reply.send({ status: 'ok', userId: user.id });
};

export const createStoreHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    // Expect Authorization header with user ID (verified by middleware in Gateway)
    // But here in microservice, we might need to trust gateway or verify token.
    // Ideally Gateway sends x-user-id header. For V1 simple, we might parse token or rely on Gateway.
    // Let's assume req.user is populated by @fastify/jwt if registered, PROBABLY.
    // Services use fastify-jwt, so if Gateway passes Authorization header, service can verify it.

    // Check if req.user exists (from verifyJwt middleware if applied)
    // I need to ensure Routes apply onRequest: [server.authenticate]

    const user = req.user as any;
    if (!user) return reply.status(401).send({ error: 'Unauthorized' });

    const { name, slug } = req.body as any;

    // Create Store
    const store = await prisma.store.create({
        data: {
            name,
            subdomain: slug, // Map slug to subdomain or custom field logic
            status: 'DRAFT',
            currency: 'NGN', // Default
            memberships: {
                create: {
                    userId: user.sub, // JWT sub
                    role: 'OWNER'
                }
            }
        }
    });

    return reply.send(store);
};
