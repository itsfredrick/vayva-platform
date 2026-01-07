"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/formatters";

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableBalance: number;
    onSuccess: () => void;
}

export function WithdrawModal({ isOpen, onClose, availableBalance, onSuccess }: WithdrawModalProps) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    // Mock bank data for now, ideally fetched from API
    const [bankDetails, setBankDetails] = useState({
        bankCode: "",
        accountNumber: "",
        accountName: ""
    });

    const handleWithdraw = async () => {
        if (!amount || Number(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        if (Number(amount) > availableBalance) {
            toast.error("Insufficient funds");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/finance/withdrawals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: Number(amount),
                    // In a real flow, checking bank details would happen here or be pre-saved
                    bankCode: "058", // GTBank mock
                    accountNumber: "0123456789",
                    accountName: "Vayva Merchant"
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Withdrawal request submitted");
                onSuccess();
                onClose();
                setAmount("");
                setStep(1);
            } else {
                toast.error(data.error || "Withdrawal failed");
            }
        } catch (e) {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                    <DialogDescription>
                        Transfer funds from your wallet to your connected bank account.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium uppercase mb-1">Available to Withdraw</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(availableBalance)}</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Amount</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">₦</span>
                            <input
                                id="withdraw-amount"
                                name="amount"
                                type="number"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-7"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <p className="text-xs text-gray-500">
                            Withdrawals are processed within 24 hours. A transaction fee of ₦50 applies.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button onClick={handleWithdraw} disabled={loading || !amount || Number(amount) <= 0}>
                        {loading ? "Processing..." : "Withdraw Funds"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
