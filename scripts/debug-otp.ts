
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = "fred@123.design";
    console.log(`Checking OTP for ${email}...`);

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.log("User not found via Prisma!");
        } else {
            console.log("User Found:", user.id, "Verified:", user.emailVerified);
        }

        const verificationCodes = await prisma.verification.findMany({
            where: { identifier: email },
            orderBy: { createdAt: 'desc' }
        });

        console.log(`Found ${verificationCodes.length} codes.`);
        verificationCodes.forEach(c => {
            const isExpired = new Date() > c.expiresAt;
            console.log(`Code: ${c.value} | Expires: ${c.expiresAt.toISOString()} | Expired? ${isExpired}`);
        });

    } catch (e) {
        console.error("Error querying DB:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
