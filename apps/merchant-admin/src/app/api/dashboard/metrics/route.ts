import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'RETAIL';

    let metrics = {};

    if (type === 'FOOD') {
        metrics = {
            metric1: { label: 'Orders Today', value: '12', trend: 'up' },
            metric2: { label: 'Revenue', value: '₦45,200', trend: 'up' },
            metric3: { label: 'Pending', value: '3', trend: 'down' }, // e.g. currently preparing
            metric4: { label: 'Avg Prep', value: '14m', trend: 'stable' },
        };
    } else if (type === 'SERVICES') {
        metrics = {
            metric1: { label: 'Appointments', value: '4', trend: 'up' }, // Today
            metric2: { label: 'Upcoming', value: '8', trend: 'up' }, // Future bookings
            metric3: { label: 'Pending', value: '1', trend: 'down' }, // Payment pending
            metric4: { label: 'Availability', value: '6 slots', trend: 'stable' },
        };
    } else {
        // RETAIL default
        metrics = {
            metric1: { label: 'Orders Today', value: '5', trend: 'up' },
            metric2: { label: 'Revenue', value: '₦125,000', trend: 'up' },
            metric3: { label: 'Pending', value: '2', trend: 'down' }, // e.g. unfulfilled
            metric4: { label: 'Avg Fulfillment', value: '2h', trend: 'down' },
        };
    }

    return NextResponse.json(metrics);
}
