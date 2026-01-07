
import { PrismaClient } from '@vayva/db';
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Starting Database Cleanup: Deleting all Users and Stores");

    try {
        // Memberships link Users and Stores, delete them first to avoid foreign key issues
        console.log("Deleting memberships...");
        await prisma.membership.deleteMany({});

        // Sessions usually cascade from User, but good to be explicit if mixed
        console.log("Deleting sessions...");
        try {
            // Check if these models exist, otherwise catch error
            await prisma.session.deleteMany({});
        } catch (e) { /* Ignore if model doesn't exist or is named differently */ }

        try {
            await prisma.merchantSession.deleteMany({});
        } catch (e) { /* Ignore */ }

        // Delete Stores
        console.log("Deleting stores...");
        await prisma.store.deleteMany({});

        // Delete Users
        console.log("Deleting users...");
        await prisma.user.deleteMany({});

        console.log("✅ Database Cleaned Successfully (Users, Stores, Memberships removed)");

    } catch (error) {
        console.error("❌ Cleanup Failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
