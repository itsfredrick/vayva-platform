"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/neon-auth";
import { Button } from "@vayva/ui";
import { Input } from "@vayva/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const VerifyOTPForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailParam = searchParams.get("email") || "";
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(emailParam);
    const [otp, setOtp] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {


            // Verify the email using the specific verifyEmail method for email-verification OTPs
            const { data, error } = await authClient.emailOtp.verifyEmail({
                email,
                otp,
            });

            if (error) {
                toast.error(error.message || "Invalid or expired OTP");
            } else {
                toast.success("Email verified successfully!");
                // Force a hard navigation to ensure cookies are sent and middleware allows access
                // The AuthContext will automatically redirect to Onboarding if not completed.
                window.location.href = "/dashboard";
            }
        } catch (err: any) {
            toast.error(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error("Please enter your email first");
            return;
        }

        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "email-verification"
            });
            if (error) toast.error(error.message);
            else toast.success("A new OTP has been sent to your email.");
        } catch (err: any) {
            toast.error("Failed to resend OTP");
        }
    };

    return (
        <div className="space-y-6 w-full max-w-md">
            {/* Show email where code was sent */}
            <div className="text-center mb-6">
                <p className="text-gray-600">
                    We've sent a 6-digit code to
                </p>
                <p className="font-bold text-gray-900 mt-1">{email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="otp" className="text-sm font-medium">Verification Code</label>
                    <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        required
                        className="text-center tracking-[1em] font-mono text-2xl"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </div>
                <Button type="submit" className="w-full" isLoading={loading}>
                    Verify Email
                </Button>
            </form>

            <div className="text-center">
                <button
                    onClick={handleResend}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Didn't receive a code? Resend
                </button>
            </div>
        </div>
    );
};
