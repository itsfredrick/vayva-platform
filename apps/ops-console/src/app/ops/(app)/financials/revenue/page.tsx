
import { PaystackPlatformService } from "@/lib/paystack-platform";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
    TrendingUp,
    ArrowUpRight,
    CreditCard,
    DollarSign
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function RevenuePage() {
    const balance = await PaystackPlatformService.getBalance();
    const transactions = await PaystackPlatformService.getSubscriptionInflows(20);

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Platform Revenue</h1>
                <p className="text-gray-500">Overview of Vayva's subscription income and wallet status.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">
                            Vayva Wallet Balance
                        </CardTitle>
                        <DollarSign className="h-4 w-4 opacity-75" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₦{balance.balance.toLocaleString()}</div>
                        <p className="text-xs opacity-75 mt-1">
                            Available for Payout
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Inflow Volume</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {/* Simple sum of visible transactions for now, ideally strictly from metrics API */}
                            ₦{transactions.reduce((acc, tx) => acc + tx.amount, 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            From last 20 transactions
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Recent Subscription Payments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Reference</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Customer</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Amount</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-mono text-xs">{tx.reference}</td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{tx.customer.email}</span>
                                                <span className="text-xs text-gray-500">ID: {tx.customer.customer_code}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle font-medium">₦{tx.amount.toLocaleString()}</td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tx.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-gray-500">
                                            {format(new Date(tx.paid_at || tx.created_at), 'MMM d, yyyy HH:mm')}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <a
                                                href={`https://dashboard.paystack.com/transactions/${tx.id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1 text-xs"
                                            >
                                                View <ArrowUpRight className="h-3 w-3" />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
