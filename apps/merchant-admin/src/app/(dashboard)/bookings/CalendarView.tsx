"use client";

import React, { useState } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@vayva/ui";

interface CalendarProps {
    selectedDate?: Date;
    onSelectDate: (date: Date) => void;
    bookings?: { date: Date; count: number }[]; // For little dots/indicators
}

export function CalendarView({ selectedDate, onSelectDate, bookings = [] }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="w-full bg-white border rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/50">
                <h2 className="font-semibold text-lg text-gray-900">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={onPrevMonth}
                        className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 hover:shadow-sm transition-all text-gray-500 hover:text-gray-900"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={onNextMonth}
                        className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 hover:shadow-sm transition-all text-gray-500 hover:text-gray-900"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="p-4">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2">
                    {weekDays.map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, idx) => {
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isDayToday = isToday(day);
                        const hasBooking = bookings.some(b => isSameDay(b.date, day));

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => onSelectDate(day)}
                                className={cn(
                                    "relative h-14 rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all duration-200",
                                    !isCurrentMonth && "text-gray-300 bg-gray-50/30",
                                    isCurrentMonth && "text-gray-700 hover:bg-gray-100",
                                    isSelected && "bg-black text-white hover:bg-gray-900 shadow-md transform scale-[1.02]",
                                    isDayToday && !isSelected && "border border-black/10 bg-gray-50 font-semibold"
                                )}
                            >
                                <span>{format(day, "d")}</span>

                                {/* Booking Indicator */}
                                {hasBooking && (
                                    <span className={cn(
                                        "absolute bottom-2 w-1.5 h-1.5 rounded-full",
                                        isSelected ? "bg-white/80" : "bg-blue-500"
                                    )} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
