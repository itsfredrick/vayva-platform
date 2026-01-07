
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

async function main() {
    try {
        console.log('Dropping KnowledgeEmbedding table...');
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "KnowledgeEmbedding" CASCADE;`);
        console.log('Drop successful.');

        console.log('Ensuring vector extension...');
        await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);
        console.log('Extension enabled.');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
