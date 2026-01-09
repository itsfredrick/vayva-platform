
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";
import { startOfDay, endOfDay, parseISO } from "date-fns";

// GET /api/bookings?date=2024-01-01
export async function GET(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const dateParam = searchParams.get("date");

        if (!dateParam) {
            return NextResponse.json({ error: "Date parameter required" }, { status: 400 });
        }

        const date = parseISO(dateParam);
        const start = startOfDay(date);
        const end = endOfDay(date);

        const bookings = await prisma.booking.findMany({
            where: {
                storeId: sessionUser.storeId,
                startsAt: {
                    gte: start,
                    lte: end
                }
            },
            include: {
                service: {
                    select: { title: true }
                },
                customer: {
                    select: { firstName: true, lastName: true, email: true }
                }
            },
            orderBy: {
                startsAt: 'asc'
            }
        });

        return NextResponse.json({ bookings });
    } catch (e) {
        console.error("Fetch bookings error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// POST /api/bookings
export async function POST(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { serviceId, date, time, customerName, notes } = body;

        // Simple validation
        if (!serviceId || !date || !time) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Parse Date/Time
        // date: "2024-01-01", time: "14:30" -> startsAt
        const startsAt = new Date(`${date}T${time}:00`);
        const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000); // Default 1 hour duration

        // Create Booking
        const booking = await prisma.booking.create({
            data: {
                storeId: sessionUser.storeId,
                serviceId,
                startsAt,
                endsAt,
                notes,
                status: "CONFIRMED",
                // For MVP, we aren't creating a real Customer record yet, just storing name in notes or metadata if needed
                // But schema has customerId. If we want to store name without ID, we might use metadata?
                // Let's check schema again. `notes` is string.
                // We'll put customerName in notes for now if no customerId.
                metadata: { customerName }
            }
        });

        return NextResponse.json({ booking });

    } catch (e) {
        console.error("Create booking error:", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
