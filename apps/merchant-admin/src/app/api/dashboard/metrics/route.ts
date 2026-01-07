import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withRBAC } from "@/lib/team/rbac";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withRBAC(PERMISSIONS.COMMERCE_VIEW, async (session: any) => {
  try {
    const storeId = session.storeId;

    // Parallelize counts
    const [revenueResult, activeOrdersCount, customersCount, totalOrdersCount] =
      await Promise.all([
        prisma.order.aggregate({
          where: {
            storeId,
            paymentStatus: "SUCCESS" as any,
          },
          _sum: { total: true },
        }),
        prisma.order.count({
          where: {
            storeId,
            OR: [{ status: "PENDING" as any }, { status: "PROCESSING" as any }],
          },
        }),
        prisma.customer.count({
          where: { storeId },
        }),
        prisma.order.count({
          where: { storeId },
        }),
      ]);

    const totalRevenue = Number(revenueResult._sum?.total || 0);
    const avgOrderValue =
      totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

    // Current metrics
    const metrics = {
      revenue: {
        label: "Total Revenue",
        value: `₦${totalRevenue.toLocaleString()}`,
        trend: "stable",
      },
      orders: {
        label: "Active Orders",
        value: activeOrdersCount.toString(),
        trend: activeOrdersCount > 0 ? "up" : "stable",
      },
      customers: {
        label: "Total Customers",
        value: customersCount.toString(),
        trend: "stable",
      },
      avgOrder: {
        label: "Avg Order Value",
        value: `₦${avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        trend: "stable",
      },
    };

    // Chart Data Aggregation (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const ordersLast7Days = await prisma.order.findMany({
      where: {
        storeId,
        createdAt: { gte: sevenDaysAgo },
        paymentStatus: "SUCCESS" as any,
      },
      select: {
        createdAt: true,
        total: true,
      }
    });

    const chartMap = new Map<string, { revenue: number; count: number }>();
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0]; // YYYY-MM-DD
      chartMap.set(dateKey, { revenue: 0, count: 0 });
    }

    ordersLast7Days.forEach(o => {
      const dateKey = o.createdAt.toISOString().split("T")[0];
      if (chartMap.has(dateKey)) {
        const entry = chartMap.get(dateKey)!;
        entry.revenue += Number(o.total);
        entry.count += 1;
      }
    });

    const revenueChart = Array.from(chartMap.entries()).map(([date, data]) => ({
      date,
      value: data.revenue
    }));

    const ordersChart = Array.from(chartMap.entries()).map(([date, data]) => ({
      date,
      value: data.count
    }));

    return NextResponse.json({
      metrics,
      charts: {
        status: "OK",
        revenue: revenueChart,
        orders: ordersChart,
        fulfillment: {
          status: "NOT_IMPLEMENTED", // Keeping this as is for now
          avgTime: null,
          targetTime: null,
          percentage: null,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        code: "internal_error",
        message: "Failed to fetch metrics",
      },
      { status: 500 },
    );
  }
});
