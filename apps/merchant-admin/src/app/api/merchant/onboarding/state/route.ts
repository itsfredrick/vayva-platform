import { NextRequest, NextResponse } from "next/server";
import { getOnboardingUser } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function GET(req: NextRequest) {
    try {
        const user = await getOnboardingUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!user.storeId) {
            // User hasn't started/created a store yet
            return NextResponse.json({
                onboardingStatus: "NOT_STARTED",
                currentStep: "store",
                data: {}
            });
        }

        const store = await prisma.store.findUnique({
            where: { id: user.storeId },
            include: {
                merchantOnboarding: true
            }
        });

        if (!store) {
            return NextResponse.json({
                onboardingStatus: "NOT_STARTED",
                currentStep: "store",
                data: {}
            });
        }

        // Reconstruct onboarding data from Store fields and MerchantOnboarding
        const merchantData = (store.merchantOnboarding?.data || {}) as Record<string, any>;
        const onboardingData = {
            // Get complete state from MerchantOnboarding.data
            ...merchantData,

            // Override with Store model fields (source of truth for these)
            storeName: store.name,
            business: {
                ...(merchantData.business || {}),
                name: store.name,
                category: store.category,
            },
            brand: {
                ...(merchantData.brand || {}),
                logo: store.logoUrl,
            }
        };

        console.log(`[ONBOARDING] Retrieved state for store ${store.id}`, {
            storeName: store.name,
            category: store.category,
            hasLogo: !!store.logoUrl,
            currentStep: store.onboardingLastStep
        });

        return NextResponse.json({
            onboardingStatus: store.onboardingStatus,
            currentStep: store.onboardingLastStep,
            data: onboardingData
        });

    } catch (error) {
        console.error("[ONBOARDING_STATE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    let currentStepForLog = "unknown";
    try {
        const user = await getOnboardingUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { currentStep, data, completedSteps } = body;
        currentStepForLog = currentStep;

        let storeId = user.storeId;

        // 1. If no store, try to create one if we have a name
        if (!storeId && data?.storeName && currentStep === "business-info") {
            const slug = data.storeName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.random().toString(36).substring(7);

            const newStore = await prisma.store.create({
                data: {
                    name: data.storeName,
                    slug: slug,
                    onboardingStatus: "IN_PROGRESS",
                    onboardingLastStep: currentStep,
                    category: data.business?.category || "general",
                }
            });

            // Create Membership
            await prisma.membership.create({
                data: {
                    userId: user.id,
                    storeId: newStore.id,
                    role: "OWNER",
                    status: "active"
                }
            });

            // Create MerchantOnboarding record
            await prisma.merchantOnboarding.create({
                data: {
                    storeId: newStore.id,
                    status: "IN_PROGRESS",
                    currentStepKey: currentStep,
                    completedSteps: completedSteps || [],
                    data: data // Save complete onboarding state
                }
            });

            storeId = newStore.id;
        } else if (!storeId) {
            // Cannot save if we don't have a store and are not creating one.
            return NextResponse.json({ success: true, localOnly: true });
        }

        // 2. Update existing store with mapped fields
        if (storeId) {
            // Map onboarding data to Store model fields
            const storeUpdateData: any = {
                onboardingLastStep: currentStep,
                onboardingUpdatedAt: new Date(),
            };

            // Update store name from business info or storeName
            if (data.business?.name) {
                storeUpdateData.name = data.business.name;
            } else if (data.storeName) {
                storeUpdateData.name = data.storeName;
            }

            // Update category
            if (data.business?.category) {
                storeUpdateData.category = data.business.category;
            }

            // Update logo
            if (data.brand?.logo) {
                storeUpdateData.logoUrl = data.brand.logo;
            }

            // Update contacts (Flatten for Store model)
            if (data.business?.contacts) {
                storeUpdateData.contacts = {
                    email: data.business.contacts.email,
                    phone: data.business.contacts.phone,
                    whatsapp: data.business.contacts.whatsapp,
                    address: data.business.contacts.address1 // Mapping address1 to generic address
                };
            } else if (data.contacts) {
                // Fallback if data structure is flat
                storeUpdateData.contacts = data.contacts;
            }

            // Update store
            await prisma.store.update({
                where: { id: storeId },
                data: storeUpdateData
            });

            // Update or create MerchantOnboarding record with complete data
            await prisma.merchantOnboarding.upsert({
                where: { storeId },
                create: {
                    storeId,
                    status: "IN_PROGRESS",
                    currentStepKey: currentStep,
                    completedSteps: completedSteps || [],
                    data: data
                },
                update: {
                    currentStepKey: currentStep,
                    completedSteps: completedSteps || [],
                    data: data, // Save complete onboarding state
                    updatedAt: new Date()
                }
            });

            console.log(`[ONBOARDING] Saved step ${currentStep} for store ${storeId}`, {
                storeName: storeUpdateData.name,
                category: storeUpdateData.category,
                hasLogo: !!storeUpdateData.logoUrl
            });
        }

        return NextResponse.json({ success: true, storeId });

    } catch (error: any) {
        console.error("[ONBOARDING_STATE_POST] Critical error:", {
            message: error.message,
            stack: error.stack,
            currentStep: currentStepForLog
        });
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
