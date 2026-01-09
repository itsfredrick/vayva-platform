"use client";

import { useState, useEffect } from "react";
import { Button, Modal, Card, StatusChip } from "@vayva/ui";
import { Plus, Clock, User, Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { CalendarView } from "./CalendarView";
import { BookingForm } from "@/components/bookings/BookingForm";

export default function BookingsPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [bookings, setBookings] = useState<any[]>([]);
    const [monthBookings, setMonthBookings] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fetch bookings for the selected date
    const fetchDayBookings = async (date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        try {
            const res = await fetch(`/api/bookings?date=${dateStr}`);
            const data = await res.json();
            if (data.bookings) {
                setBookings(data.bookings);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchDayBookings(selectedDate);
    }, [selectedDate]);

    // Format for simple display
    const formattedDate = format(selectedDate, "EEEE, MMMM do, yyyy");

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Bookings & Appointments</h1>
                    <p className="text-gray-500">Manage your service schedule.</p>
                </div>

                <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
                    <Plus size={16} /> New Booking
                </Button>

                <Modal
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title="Create New Appointment"
                >
                    <BookingForm
                        preselectedDate={selectedDate}
                        onSuccess={() => {
                            setIsDialogOpen(false);
                            fetchDayBookings(selectedDate);
                        }}
                    />
                </Modal>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
                <div className="space-y-6">
                    <CalendarView
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                        bookings={monthBookings} // TODO: wiring this up requires fetching month range
                    />

                    {/* Quick Stats or Info Card could go here */}
                    <Card className="p-4 bg-blue-50 border-blue-100">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-900">Business Hours</h4>
                                <p className="text-sm text-blue-700 mt-1">
                                    09:00 AM - 05:00 PM<br />
                                    Monday - Friday
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <CalendarIcon size={20} className="text-gray-400" />
                        {formattedDate}
                    </h3>

                    {bookings.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                            <p className="text-gray-500">No bookings for this date.</p>
                            <Button variant="link" onClick={() => setIsDialogOpen(true)}>
                                Schedule an appointment
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {bookings.map((booking) => (
                                <Card key={booking.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 flex flex-col items-center justify-center bg-gray-50 rounded-lg py-2 border">
                                            <span className="text-xs font-medium text-gray-500">START</span>
                                            <span className="text-lg font-bold text-gray-900">
                                                {format(parseISO(booking.startsAt), "HH:mm")}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{booking.service.title}</h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <User size={14} />
                                                <span>{booking.customer?.firstName || booking.metadata?.customerName || "Walk-in Guest"}</span>
                                            </div>
                                            {booking.notes && (
                                                <p className="text-xs text-gray-400 mt-2 max-w-sm line-clamp-1">{booking.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <StatusChip status={booking.status} />
                                        {/* Actions dropdown could go here */}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
