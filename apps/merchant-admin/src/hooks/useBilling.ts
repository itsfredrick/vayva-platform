import { useQuery } from "@tanstack/react-query";

export type Invoice = {
    id: string;
    issuedAt: string;
    amountNgn: number;
    status: string;
};

export type BillingStatus = {
    planSlug: string;
    status: string;
    cancelAtPeriodEnd: boolean;
    invoices: Invoice[];
};

export function useBillingStatus() {
    return useQuery({
        queryKey: ['billing-status'],
        queryFn: async () => {
            const res = await fetch("/api/merchant/billing/status");
            if (!res.ok) throw new Error("Failed to fetch billing status");
            return (await res.json()) as BillingStatus;
        }
    });
}
