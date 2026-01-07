"use client";

import { VerifyOTPForm } from "@/components/auth/VerifyOTPForm";
import { SplitAuthLayout } from "@/components/auth/SplitAuthLayout";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VerifyContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    return (
        <SplitAuthLayout
            title="Verify your email"
            subtitle={email
                ? <span className="text-muted-foreground">We've sent a 6-digit code to <span className="font-medium text-foreground">{email}</span></span>
                : "We've sent a 6-digit code to your inbox"
            }
        >
            <div className="flex justify-center w-full">
                <VerifyOTPForm />
            </div>
        </SplitAuthLayout>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
