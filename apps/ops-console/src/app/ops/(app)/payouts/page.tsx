"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function PayoutsPage() {
    const queryClient = useQueryClient();
    const [selectedPayout, setSelectedPayout] = useState<any | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [actionType, setActionType] = useState<"APPROVE" | "REJECT" | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["ops-payouts"],
        queryFn: async () => {
            const res = await fetch("/api/ops/financials/payouts");
            if (!res.ok) throw new Error("Failed to fetch payouts");
            return res.json();
        },
    });

    const mutation = useMutation({
        mutationFn: async ({ id, action, reason }: { id: string, action: string, reason?: string }) => {
            const res = await fetch(`/api/ops/financials/payouts/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, reason }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to process payout");
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success(`Payout ${actionType === "APPROVE" ? "Approved" : "Rejected"}`);
            setSelectedPayout(null);
            setRejectReason("");
            setActionType(null);
            queryClient.invalidateQueries({ queryKey: ["ops-payouts"] });
        },
        onError: (err: any) => {
            toast.error(err.message);
        }
    });

    const handleProcess = () => {
        if (!selectedPayout || !actionType) return;
        mutation.mutate({
            id: selectedPayout.id,
            action: actionType,
            reason: rejectReason
        });
    };

    const payouts = data?.data || [];

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Payout Requests</h1>
                    <p className="text-muted-foreground">Manage merchant withdrawals.</p>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Store</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Bank Details</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : payouts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    No pending payouts.
                                </TableCell>
                            </TableRow>
                        ) : (
                            payouts.map((p: any) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{p.store.name}</span>
                                            <span className="text-xs text-muted-foreground">{p.store.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{p.referenceCode}</TableCell>
                                    <TableCell>
                                        ₦{(Number(p.amountKobo) / 100).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-xs space-y-1">
                                        <div className="font-semibold">{p.bankName}</div>
                                        <div>{p.accountNumber}</div>
                                        <div className="text-muted-foreground">{p.accountName}</div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={p.status} />
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {format(new Date(p.createdAt), "MMM d, HH:mm")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {p.status === "PENDING" && (
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" className="h-8 gap-1 text-red-600 hover:text-red-700" onClick={() => { setSelectedPayout(p); setActionType("REJECT"); }}>
                                                    Reject
                                                </Button>
                                                <Button size="sm" className="h-8 gap-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => { setSelectedPayout(p); setActionType("APPROVE"); }}>
                                                    Approve
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!selectedPayout} onOpenChange={(o) => { if (!o) setSelectedPayout(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{actionType === "APPROVE" ? "Confirm Transfer" : "Reject Withdrawal"}</DialogTitle>
                        <DialogDescription>
                            {actionType === "APPROVE" ? (
                                `Confirm that you have manually transferred ₦${(Number(selectedPayout?.amountKobo || 0) / 100).toLocaleString()} to the account below.`
                            ) : (
                                "Provide a reason for rejection. The funds will be refunded to the merchant's wallet immediately."
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPayout && (
                        <div className="bg-muted p-4 rounded-md text-sm space-y-2 mb-4">
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-medium text-muted-foreground">Bank:</span>
                                <span className="col-span-2">{selectedPayout.bankName}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-medium text-muted-foreground">Account:</span>
                                <span className="col-span-2 font-mono">{selectedPayout.accountNumber}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-medium text-muted-foreground">Name:</span>
                                <span className="col-span-2">{selectedPayout.accountName}</span>
                            </div>
                        </div>
                    )}

                    {actionType === "REJECT" && (
                        <Textarea
                            placeholder="Reason for rejection (visible to merchant)..."
                            value={rejectReason}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRejectReason(e.target.value)}
                        />
                    )}

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setSelectedPayout(null)}>Cancel</Button>
                        <Button
                            variant={actionType === "REJECT" ? "destructive" : "primary"}
                            onClick={handleProcess}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {actionType === "APPROVE" ? "Confirm Processed" : "Reject Withdrawal"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === "PENDING") return <Badge variant="secondary">Pending</Badge>;
    if (status === "PROCESSED") return <Badge variant="default">Processed</Badge>;
    if (status === "REJECTED") return <Badge variant="destructive">Rejected</Badge>;
    return <Badge variant="outline">{status}</Badge>;
}

