"use client";

import { useState } from "react";
import { Modal, Input, Button } from "@vayva/ui";
import { toast } from "sonner";

interface WithdrawalDialogProps {
    balance: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function WithdrawalDialog({ balance, isOpen, onClose, onSuccess }: WithdrawalDialogProps) {
    const [amount, setAmount] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [bankCode, setBankCode] = useState("058"); // Default/Mock GTBank
    const [loading, setLoading] = useState(false);

    // Mock bank list
    const banks = [
        { code: "058", name: "GTBank" },
        { code: "011", name: "First Bank" },
        { code: "057", name: "Zenith Bank" },
        { code: "033", name: "UBA" },
        { code: "044", name: "Access Bank" },
    ];

    const handleSubmit = async () => {
        const val = Number(amount);
        if (!val || val <= 0) {
            toast.error("Invalid amount");
            return;
        }
        if (val > balance) {
            toast.error("Insufficient balance");
            return;
        }
        if (accountNumber.length < 10) {
            toast.error("Invalid account number");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/finance/withdrawals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: val,
                    bankCode,
                    accountNumber,
                    accountName: "Merchant Account" // In real flow, resolve this first
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed");
            }

            toast.success("Withdrawal request submitted");
            onSuccess();
            onClose();
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Withdraw Funds">
            <div className="space-y-4 pt-1">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase">Available Balance</p>
                    <p className="text-xl font-bold font-mono">₦{balance.toLocaleString()}</p>
                </div>

                <div>
                    <label className="text-xs font-bold mb-1 block">Amount to Withdraw</label>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold mb-1 block">Bank</label>
                        <select
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={bankCode}
                            onChange={(e) => setBankCode(e.target.value)}
                        >
                            {banks.map(b => (
                                <option key={b.code} value={b.code}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold mb-1 block">Account Number</label>
                        <Input
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            maxLength={10}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <Button className="w-full" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Processing..." : "Confirm Withdrawal"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
