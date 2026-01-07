

import { SubscriptionPlan, OnboardingStatus, AppRole, prisma } from '@vayva/db';
import * as bcrypt from 'bcryptjs';

async function main() {
    const email = 'pro.merchant@vayva.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Creating dummy pro user: ${email}`);

    // 1. Create User
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            emailVerified: true,
            isEmailVerified: true,
        },
        create: {
            email,
            name: 'Pro Merchant',
            firstName: 'Pro',
            lastName: 'Merchant',
            emailVerified: true,
            isEmailVerified: true,
        },
    });

    console.log(`User created: ${user.id}`);

    // 1b. Create/Update Account with Password
    const existingAccount = await prisma.account.findFirst({
        where: { userId: user.id }
    });

    if (existingAccount) {
        await prisma.account.update({
            where: { id: existingAccount.id },
            data: {
                password: hashedPassword,
                providerId: 'credential'
            }
        });
        console.log('Account password updated.');
    } else {
        await prisma.account.create({
            data: {
                userId: user.id,
                accountId: user.id,
                providerId: 'credential',
                password: hashedPassword,
            }
        });
        console.log('Account created with password.');
    }


    // 2. Create Store
    const storeSlug = 'pro-store-demo';
    const store = await prisma.store.upsert({
        where: { slug: storeSlug },
        update: {
            plan: SubscriptionPlan.PRO, // Set to PRO directly on Store model as seen in schema
            onboardingStatus: OnboardingStatus.COMPLETE,
            onboardingCompleted: true,
            onboardingLastStep: 'COMPLETED',
        },
        create: {
            name: 'Pro Tech Store',
            slug: storeSlug,
            plan: SubscriptionPlan.PRO,
            onboardingStatus: OnboardingStatus.COMPLETE,
            onboardingCompleted: true,
            onboardingLastStep: 'COMPLETED',
            category: 'ELECTRONICS',
            isLive: true,
        },
    });

    console.log(`Store created: ${store.id}`);

    // 3. Create Membership
    await prisma.membership.upsert({
        where: {
            userId_storeId: {
                userId: user.id,
                storeId: store.id,
            },
        },
        update: {
            role: AppRole.OWNER,
            status: 'active',
        },
        create: {
            userId: user.id,
            storeId: store.id,
            role: AppRole.OWNER,
            status: 'active',
        },
    });

    console.log('Membership link created.');

    // 4. Create MerchantOnboarding record (to ensure dashboard checklist is happy)
    await prisma.merchantOnboarding.upsert({
        where: { storeId: store.id },
        update: {
            status: OnboardingStatus.COMPLETE,
            completedSteps: ['brand', 'identity', 'business', 'store', 'products', 'payments', 'delivery'],
        },
        create: {
            storeId: store.id,
            status: OnboardingStatus.COMPLETE,
            completedSteps: ['brand', 'identity', 'business', 'store', 'products', 'payments', 'delivery'],
            data: {
                brand: { completed: true },
                identity: { completed: true },
                business: { completed: true },
                store: { completed: true },
            },
        },
    });

    console.log('Merchant onboarding record created.');

    // 5. Create MerchantAiSubscription (if needed for stricter checks)
    // Schema showed: model MerchantAiSubscription
    // Let's create it just in case logic checks this table

    // We need a Plan ID first. Assuming one exists or we create a dummy one.
    const aiPlanName = 'Pro Plan AI';
    const aiPlan = await prisma.aiPlan.upsert({
        where: { name: aiPlanName },
        update: {},
        create: {
            name: aiPlanName,
            monthlyTokenLimit: 100000,
            monthlyImageLimit: 50,
            monthlyRequestLimit: 5000,
        }
    });

    await prisma.merchantAiSubscription.upsert({
        where: { storeId: store.id },
        update: {
            status: 'ACTIVE',
            planKey: 'PRO',
            planId: aiPlan.id,
        },
        create: {
            storeId: store.id,
            planId: aiPlan.id,
            planKey: 'PRO',
            status: 'ACTIVE',
            periodStart: new Date(),
            periodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
            trialExpiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        }
    });
    console.log('Merchant AI Subscription created.');

    console.log('------------------------------------------------');
    console.log('DONE!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('Login should now work with these credentials directly.');
    console.log('------------------------------------------------');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
