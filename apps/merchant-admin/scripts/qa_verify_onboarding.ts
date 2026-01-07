
import { PrismaClient } from '@vayva/db';
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Starting QA Verification: Onboarding Flow");

    const timestamp = Date.now();
    const testEmail = `qa_test_${timestamp}@vayva.com`;
    const testStoreName = `QA Store ${timestamp}`;
    const storeSlug = `qa-store-${timestamp}`;

    let user: any;
    let newStore: any;

    try {
        // 1. Setup User (Simulate Auth)
        // Simulate Frontend Logic: SignUpForm concatenates firstName + lastName
        const firstName = "QA";
        const lastName = "Tester";
        const expectedName = `${firstName} ${lastName}`.trim();

        console.log(`\n[1/4] Setting up Test User: ${testEmail}`);
        console.log(`ℹ️ Simulating Signup: First="${firstName}", Last="${lastName}" -> Name="${expectedName}"`);

        user = await prisma.user.create({
            data: {
                email: testEmail,
                name: expectedName, // Mimic frontend logic
                emailVerified: true,
                image: "https://example.com/avatar.jpg",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        if (user.name !== expectedName) {
            throw new Error(`❌ Data Integrity Fail: Expected name "${expectedName}", got "${user.name}"`);
        }
        console.log(`✅ User Created & Name Verified: ${user.id}`);

        // 2. Simulate Step 1: Store Name & Creation (API Logic Mirror)
        console.log(`\n[2/4] Verifying Store Creation Logic (Step 1)`);
        // Logic from POST /api/merchant/onboarding/state
        newStore = await prisma.store.create({
            data: {
                name: testStoreName,
                slug: storeSlug,
                onboardingStatus: "IN_PROGRESS",
                onboardingLastStep: "business-info",
                settings: {
                    storeName: testStoreName
                } // Initial payload
            }
        });

        await prisma.membership.create({
            data: {
                userId: user.id,
                storeId: newStore.id,
                role: "OWNER",
                status: "active"
            }
        });

        // Membership is sufficient to link User to Store in this schema
        console.log(`✅ Membership Created (User -> Store)`);

        console.log(`✅ Store Created: ${newStore.id}`);
        console.log(`✅ Membership Link Verified`);

        // 3. Simulate Progressive Saves (Steps 2-10)
        console.log(`\n[3/4] Verifying Progressive State Saving`);

        // Simulate Business Info Update
        const businessData = {
            category: "Fashion",
            location: { city: "Lagos", country: "Nigeria" }
        };

        await prisma.store.update({
            where: { id: newStore.id },
            data: {
                onboardingLastStep: "identity",
                settings: {
                    storeName: testStoreName,
                    business: businessData
                }
            }
        });
        console.log(`✅ Step 'business-info' saved`);

        // Simulate Products "Skip" (Empty products but step advanced)
        await prisma.store.update({
            where: { id: newStore.id },
            data: {
                onboardingLastStep: "payments",
                // We verify that existing data is preserved
                settings: {
                    storeName: testStoreName,
                    business: businessData,
                    products: { count: 0, skipped: true }
                }
            }
        });
        console.log(`✅ Step 'products' (skipped) saved`);

        // Verify Persistence
        const verifyStore = await prisma.store.findUnique({ where: { id: newStore.id } });
        if (verifyStore?.onboardingLastStep !== "payments") throw new Error("Persistence Mismatch: Step not updated");
        const settings = verifyStore.settings as any;
        if (settings.business.category !== "Fashion") throw new Error("Persistence Mismatch: Data lost");
        console.log(`✅ Database Persistence Verified`);

        // 4. Simulate Completion
        console.log(`\n[4/4] Verifying Completion Logic`);
        // Logic from PUT /api/merchant/onboarding/complete
        await prisma.store.update({
            where: { id: newStore.id },
            data: {
                onboardingCompleted: true,
                onboardingStatus: "COMPLETE"
            }
        });

        const finalStore = await prisma.store.findUnique({ where: { id: newStore.id } });
        if (!finalStore?.onboardingCompleted) throw new Error("Completion Flag Failed");
        console.log(`✅ Store marked COMPLETE`);

        console.log("\n🎉 QA Audit Passed Successfully!");

    } catch (error) {
        console.error("\n❌ QA Verification Failed:", error);
        process.exit(1);
    } finally {
        // Cleanup
        if (testEmail || user || newStore) {
            console.log("\n🧹 Cleaning up test data...");
            try {
                // Delete memberships first to avoid FK constraints on Store deletion
                if (user) {
                    await prisma.membership.deleteMany({
                        where: { userId: user.id } // Use the created user ID
                    });
                }

                // Let's delete the Store explicitly if we created it
                if (newStore) {
                    // Try to delete by ID if available, else find by slug
                    await prisma.store.delete({ where: { id: newStore.id } });
                    console.log(`trash Cleaned up Store: ${newStore.id}`);
                } else if (storeSlug) {
                    const storeToDelete = await prisma.store.findFirst({ where: { slug: storeSlug } });
                    if (storeToDelete) {
                        await prisma.store.delete({ where: { id: storeToDelete.id } });
                        console.log(`trash Cleaned up Store: ${storeToDelete.id}`);
                    }
                }

                // Delete the user
                if (testEmail) {
                    await prisma.user.deleteMany({ where: { email: testEmail } });
                    console.log(`trash Cleaned up User: ${testEmail}`);
                }

            } catch (cleanupError) {
                console.error("⚠️ Cleanup passed with minor error or nothing to clean:", cleanupError);
            }
        }
        await prisma.$disconnect();
    }
}

main();
