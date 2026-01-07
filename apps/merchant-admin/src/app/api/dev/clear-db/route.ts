import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 },
    );
  }

  try {
    const { email, deleteAll } = await req.json();

    if (!email && !deleteAll) {
      return NextResponse.json(
        { error: "Email required or set deleteAll: true" },
        { status: 400 },
      );
    }

    if (deleteAll) {
      logger.info('🗑️ Deleting ALL users...');

      // Get all users
      const users = await prisma.user.findMany({
        include: {
          memberships: {
            select: { storeId: true },
          },
        },
      });

      logger.info(`Found ${users.length} user(s) to delete`);

      // Delete each user's data
      for (const user of users) {
        const storeIds = user.memberships.map((m) => m.storeId);

        // Delete store-related data
        for (const storeId of storeIds) {
          await prisma.merchantOnboarding.deleteMany({ where: { storeId } });
          await prisma.merchantAiProfile.deleteMany({ where: { storeId } });
          await prisma.merchantAiSubscription.deleteMany({ where: { storeId } });
          await prisma.ledgerEntry.deleteMany({ where: { storeId } });
          await prisma.wallet.deleteMany({ where: { storeId } });
        }

        // Delete memberships BEFORE deleting stores
        await prisma.membership.deleteMany({ where: { userId: user.id } });

        // Now delete stores
        for (const storeId of storeIds) {
          await prisma.store.delete({ where: { id: storeId } });
        }

        // Delete user-specific data
        await prisma.otpCode.deleteMany({ where: { identifier: user.email.toLowerCase() } });
        await prisma.user.delete({ where: { id: user.id } });
      }

      logger.info('✅ All users deleted successfully!');

      return NextResponse.json({
        success: true,
        message: `Deleted ${users.length} user(s) successfully.`,
        count: users.length,
      });
    }

    logger.info(`🗑️ Clearing data for ${email}...`);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        memberships: {
          include: {
            store: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: "No user found with that email.",
      });
    }

    // Delete user's data
    const storeIds = user.memberships.map((m) => m.storeId);

    // Delete store-related data
    for (const storeId of storeIds) {
      await prisma.merchantOnboarding.deleteMany({ where: { storeId } });
      await prisma.merchantAiProfile.deleteMany({ where: { storeId } });
      await prisma.merchantAiSubscription.deleteMany({ where: { storeId } });
      await prisma.ledgerEntry.deleteMany({ where: { storeId } });
      await prisma.wallet.deleteMany({ where: { storeId } });
    }

    // Delete memberships BEFORE deleting stores
    await prisma.membership.deleteMany({ where: { userId: user.id } });

    // Now delete stores
    for (const storeId of storeIds) {
      await prisma.store.delete({ where: { id: storeId } });
    }

    // Delete user-specific data
    await prisma.otpCode.deleteMany({ where: { identifier: user.email.toLowerCase() } });
    await prisma.user.delete({ where: { id: user.id } });

    logger.info("✅ User data cleared successfully!");

    return NextResponse.json({
      success: true,
      message: "Database cleared successfully. You can now register with new details.",
    });
  } catch (error: any) {
    logger.error("❌ Error clearing database:", error);
    return NextResponse.json(
      { error: "Failed to clear database", details: error.message },
      { status: 500 },
    );
  }
}
