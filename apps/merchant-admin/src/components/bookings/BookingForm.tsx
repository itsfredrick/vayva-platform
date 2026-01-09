"use client";

import { useForm } from "react-hook-form";
import { Button, Input, Textarea, Label, Select } from "@vayva/ui";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

interface BookingFormProps {
    onSuccess?: () => void;
    preselectedDate?: Date;
}

export function BookingForm({ onSuccess, preselectedDate }: BookingFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [services, setServices] = useState<any[]>([]);

    // Fetch Services on Mount
    useEffect(() => {
        fetch("/api/products?category=service")
            .then(res => res.json())
            .then(data => {
                // Assuming standard product fetch returns { products: [] }
                // We might need to adjust endpoint or filtering.
                // For now, let's fetch all products and manually filter client side if needed 
                // or just rely on the user to pick valid ones if API is generic.
                if (data.products) setServices(data.products);
            })
            .catch(err => console.error("Failed to fetch services", err));
    }, []);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            serviceId: "",
            date: preselectedDate ? format(preselectedDate, "yyyy-MM-dd") : "",
            time: "09:00",
            customerName: "",
            notes: ""
        }
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create booking");
            }

            toast.success("Booking created successfully");
            if (onSuccess) onSuccess();
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label>Service</Label>
                <Select {...register("serviceId", { required: "Service is required" })}>
                    <option value="">Select a service</option>
                    {services.length === 0 ? (
                        <option disabled>No services found</option>
                    ) : (
                        services.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.title}
                            </option>
                        ))
                    )}
                </Select>
                {errors.serviceId && <p className="text-red-500 text-xs">{errors.serviceId.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                        type="date"
                        {...register("date", { required: true })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                        type="time"
                        {...register("time", { required: true })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                    placeholder="e.g. John Doe"
                    {...register("customerName", { required: "Customer name is required" })}
                />
                {errors.customerName && <p className="text-red-500 text-xs">{errors.customerName.message as string}</p>}
            </div>

            <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                    placeholder="Additional details..."
                    {...register("notes")}
                />
            </div>

            <div className="pt-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Booking..." : "Create Appointment"}
                </Button>
            </div>
        </form>
    );
}
