import { PaystackService } from "@vayva/shared"; // Assuming shared or similar structure, lets check existing. 
// Actually I'll write a standalone simple service effectively reusing logic or just fetch directly if shared isn't clean.
// Based on merchant-admin, PaystackService is in lib/payment/paystack.ts. 
// I should probably duplicate or reference if possible, but Ops might be separate. 
// Let's create a clean tailored service for Ops.

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export interface PlatformBalance {
    currency: string;
    balance: number;
}

export interface PlatformTransaction {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string; // "Successful", etc.
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata?: any;
    customer: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        metadata: any;
        customer_code: string;
    };
}

export class PaystackPlatformService {
    private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `https://api.paystack.co${endpoint}`;
        const headers = {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
            ...options.headers,
        };

        const response = await fetch(url, { ...options, headers });
        const json = await response.json();

        if (!response.ok || !json.status) {
            throw new Error(json.message || `Paystack API Error: ${response.status}`);
        }

        return json;
    }

    static async getBalance(): Promise<PlatformBalance> {
        try {
            const response = await this.request<{ data: { balance: number; currency: string }[] }>("/balance");
            // Paystack returns an array of balances (per currency). We usually care about NGN.
            const ngnBalance = response.data.find((b) => b.currency === "NGN");
            return {
                currency: "NGN",
                balance: ngnBalance ? ngnBalance.balance / 100 : 0, // Convert kobo to naira
            };
        } catch (error) {
            console.error("Failed to fetch platform balance", error);
            return { currency: "NGN", balance: 0 };
        }
    }

    static async getSubscriptionInflows(limit = 20): Promise<PlatformTransaction[]> {
        try {
            // Fetch transactions that are likely subscription payments. 
            // We can filter by "status=success"
            const response = await this.request<{ data: any[] }>(`/transaction?perPage=${limit}&status=success`);

            return response.data.map((tx: any) => ({
                ...tx,
                amount: tx.amount / 100, // Convert to Naira
            }));
        } catch (error) {
            console.error("Failed to fetch inflows", error);
            return [];
        }
    }
}
