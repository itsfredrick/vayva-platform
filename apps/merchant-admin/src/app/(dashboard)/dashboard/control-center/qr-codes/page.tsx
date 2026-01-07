"use client";

import React from "react";
import { StoreQRCode } from "@/components/store-qr-code";
import { ControlCenterShell } from "@/components/control-center/ControlCenterShell";

export default function QRCodesPage() {
    return (
        <ControlCenterShell>
            <div className="p-8 space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-heading">
                        Store Access Points
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Generate and manage QR codes for physical marketing and easy customer access.
                    </p>
                </div>

                <div className="max-w-md mx-auto w-full">
                    <StoreQRCode />
                </div>
            </div>
        </ControlCenterShell>
    );
}
