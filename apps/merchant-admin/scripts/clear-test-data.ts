import { prisma } from '@vayva/db';

async function clearDatabase() {
    console.log('🗑️  Starting database cleanup...');

    try {
        // Delete in correct order to respect foreign key constraints
        console.log('Deleting user-related data...');

        // Delete onboarding and related data
        await prisma.merchantOnboarding.deleteMany({});
        await prisma.merchantAiProfile.deleteMany({});
        await prisma.merchantAiSubscription.deleteMany({});

        // Delete OTP codes
        await prisma.otpCode.deleteMany({});

        // Delete memberships
        await prisma.membership.deleteMany({});

        // Delete stores
        await prisma.store.deleteMany({});

        // Delete users (this should be last for user-related tables)
        await prisma.user.deleteMany({});

        console.log('✅ Database cleared successfully!');
        console.log('You can now register with new details.');

    } catch (error) {
        console.error('❌ Error clearing database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
