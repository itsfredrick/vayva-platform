import { prisma } from '@vayva/db';

async function listAndDeleteUsers() {
    console.log('📋 Fetching all users...\n');

    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    if (users.length === 0) {
        console.log('✅ No users found in database.');
        return;
    }

    console.log(`Found ${users.length} user(s):\n`);
    users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   Created: ${user.createdAt.toLocaleString()}`);
        console.log('');
    });

    console.log('\n🗑️  Deleting all users and their data...\n');

    for (const user of users) {
        console.log(`Deleting ${user.email}...`);

        // Get user's stores
        const memberships = await prisma.membership.findMany({
            where: { userId: user.id },
            select: { storeId: true },
        });

        const storeIds = memberships.map((m) => m.storeId);

        // Delete store-related data
        for (const storeId of storeIds) {
            await prisma.merchantOnboarding.deleteMany({ where: { storeId } });
            await prisma.merchantAiProfile.deleteMany({ where: { storeId } });
            await prisma.merchantAiSubscription.deleteMany({ where: { storeId } });
            await prisma.ledgerEntry.deleteMany({ where: { storeId } });
            await prisma.wallet.deleteMany({ where: { storeId } });
            await prisma.store.delete({ where: { id: storeId } });
        }

        // Delete user-specific data
        await prisma.otpCode.deleteMany({ where: { identifier: user.email.toLowerCase() } });
        await prisma.membership.deleteMany({ where: { userId: user.id } });
        await prisma.user.delete({ where: { id: user.id } });

        console.log(`✅ Deleted ${user.email}`);
    }

    console.log('\n✅ All users deleted successfully!');
    console.log('You can now register with fresh details.');
}

listAndDeleteUsers()
    .then(() => {
        prisma.$disconnect();
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        prisma.$disconnect();
        process.exit(1);
    });
