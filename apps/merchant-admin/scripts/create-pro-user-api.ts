
import { auth } from "../src/lib/auth";
import { prisma, SubscriptionPlan, OnboardingStatus, AppRole } from '@vayva/db';
import { headers } from "next/headers";

// Mock headers for local execution if needed, though Better Auth API might not strictly need them for direct calls if we bypass context
// Actually, auth.api.signUpEmail usually requires a request context or headers.
// However, let's try calling it. If it fails due to missing context, we might need a different approach.
// BETTER APPROACH: Use the internal 'api' exposed by better-auth server instance, usually it has methods.

async function main() {
    const email = 'pro.merchant@vayva.com';
    const password = 'password123';
    const name = 'Pro Merchant';

    console.log(`Creating/Resetting user via Better Auth API: ${email}`);

    // Clean up existing user to start fresh and ensure clean auth state
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
            include: { memberships: true, accounts: true }
        });

        if (existingUser) {
            console.log('User exists. Performing cascade delete...');

            // 1. Delete Memberships
            await prisma.membership.deleteMany({
                where: { userId: existingUser.id }
            });
            console.log('Deleted memberships');

            // 2. Delete Accounts
            await prisma.account.deleteMany({
                where: { userId: existingUser.id }
            });
            console.log('Deleted accounts');

            // 3. Delete Sessions
            await prisma.session.deleteMany({
                where: { userId: existingUser.id }
            });

            // 4. Delete the User
            await prisma.user.delete({ where: { email } });
            console.log('Deleted user record');

            // 4b. Also clean up the store specifically to avoid unique constraint if we use same slug
            try {
                await prisma.store.delete({ where: { slug: 'pro-store-demo' } });
                console.log('Deleted previous demo store');
            } catch (ignored) { }
        }
    } catch (e) {
        console.log('Error cleaning up existing user:', e);
    }

    try {
        // Direct API call
        // Note: auth.api.signUpEmail returns a Response object usually or the session.
        // We need to pass a mock request or minimal headers if required.
        // For server-side internal calls, we often use the 'internal' client or just calling the router handler?
        // documentation says: auth.api.signUpEmail({ body: ... })

        console.log('Signing up...');
        const res = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
            }
        });

        console.log('Sign up response:', res);

        if (res && res.user) {
            console.log('User created successfully:', res.user.id);
            const userId = res.user.id;

            // Force verify email
            await prisma.user.update({
                where: { id: userId },
                data: {
                    emailVerified: true,
                    isEmailVerified: true
                }
            });
            console.log('Forced email verification to true.');

            // Now Upgrade to Pro manually
            await upgradeToPro(userId, email);
        } else {
            console.error('Failed to create user. Response:', res);
        }

    } catch (error) {
        console.error('Error during signup:', error);
    }
}

async function upgradeToPro(userId: string, email: string) {
    console.log('Upgrading to PRO and completing onboarding...');

    // 2. Create Store
    const storeSlug = 'pro-store-demo';
    const store = await prisma.store.upsert({
        where: { slug: storeSlug },
        update: {
            plan: SubscriptionPlan.PRO,
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

    // 3. Create Membership (Better Auth might have created one if hooks exist, but let's ensure OWNER role)
    await prisma.membership.upsert({
        where: {
            userId_storeId: {
                userId: userId,
                storeId: store.id,
            },
        },
        update: {
            role: AppRole.OWNER,
            status: 'active',
        },
        create: {
            userId: userId,
            storeId: store.id,
            role: AppRole.OWNER,
            status: 'active',
        },
    });

    // 4. Onboarding Record
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

    // 4b. Create a Dummy Product to satisfy "Add Products" check
    await prisma.product.create({
        data: {
            storeId: store.id,
            title: "Demo Pro Product",
            description: "A sample product to show the completed catalog state.",
            price: 5000, // 50.00
            handle: "demo-pro-product-" + Date.now(),
            status: "ACTIVE",
            // trackQuantity: true,
            // stock: 100
        }
    }).catch(e => console.log('Product creation note:', e.message));

    // 4c. Create Dummy Customers
    console.log('Creating dummy customers...');
    const cust1 = await prisma.customer.create({
        data: {
            storeId: store.id,
            firstName: "Sven",
            lastName: "Retailer",
            email: "sven@test.com",
            phone: "+2348012345678",
            // totalSpent/Orders removed as they don't exist in schema
        }
    });

    const cust2 = await prisma.customer.create({
        data: {
            storeId: store.id,
            firstName: "Amara",
            lastName: "Buyer",
            email: "amara@test.com",
        }
    });

    // 4d. Create Dummy Orders
    console.log('Creating dummy orders...');

    // Order 1: Recent, Paid (SUCCESS)
    const order1 = await prisma.order.create({
        data: {
            storeId: store.id,
            orderNumber: "#1001",
            customerId: cust1.id,
            customerEmail: cust1.email,
            refCode: "ORD-1001-" + Date.now(),
            total: 10000,
            subtotal: 9000,
            shippingTotal: 500,
            status: "PROCESSING", // Active order
            paymentStatus: "SUCCESS",
            fulfillmentStatus: "UNFULFILLED",
            createdAt: new Date(),
        }
    });

    await prisma.orderItem.create({
        data: {
            orderId: order1.id,
            productId: null,
            title: "Demo Pro Product",
            quantity: 2,
            price: 5000,
        }
    });

    // Order 2: Yesterday, Delivered
    const order2 = await prisma.order.create({
        data: {
            storeId: store.id,
            orderNumber: "#1000",
            customerId: cust2.id,
            customerEmail: cust2.email,
            refCode: "ORD-1000-" + Date.now(),
            total: 5000,
            subtotal: 4500,
            shippingTotal: 250,
            status: "DELIVERED",
            paymentStatus: "SUCCESS",
            fulfillmentStatus: "DELIVERED",
            createdAt: new Date(Date.now() - 86400000),
        }
    });

    await prisma.orderItem.create({
        data: {
            orderId: order2.id,
            title: "Demo Pro Product",
            quantity: 1,
            price: 5000,
        }
    });

    // Order 3: Older, Delivered
    const order3 = await prisma.order.create({
        data: {
            storeId: store.id,
            orderNumber: "#999",
            customerId: cust1.id,
            customerEmail: cust1.email,
            refCode: "ORD-999-" + Date.now(),
            total: 5000,
            subtotal: 4500,
            shippingTotal: 250,
            status: "DELIVERED",
            paymentStatus: "SUCCESS",
            fulfillmentStatus: "DELIVERED",
            createdAt: new Date(Date.now() - 172800000), // 2 days ago
        }
    });

    await prisma.orderItem.create({
        data: {
            orderId: order3.id,
            title: "Demo Pro Product",
            quantity: 1,
            price: 5000,
        }
    });

    // 5. Merchant AI Subscription
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

    console.log('User upgraded to PRO and onboarding completed.');
    console.log('Login credentials:');
    console.log(`Email: ${email}`);
    console.log('Password: password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
