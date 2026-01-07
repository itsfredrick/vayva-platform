"use client";

import { useState } from "react";
import { Button } from "@vayva/ui";
import { ArrowUpRight } from "lucide-react";
import { WithdrawalDialog } from "./withdrawal-dialog";
import { useRouter } from "next/navigation";

export function WalletActions({ balance }: { balance: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    return (
        <>
            <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => router.push("/dashboard/finance/history")}>
                    History
                </Button>
                <Button onClick={() => setIsOpen(true)}>
                    <ArrowUpRight className="mr-2 h-4 w-4" /> Withdraw Funds
                </Button>
            </div>

            <WithdrawalDialog
                balance={balance}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSuccess={() => {
                    router.refresh(); // Refresh server data to show new balance
                }}
            />
        </>
    );
}
