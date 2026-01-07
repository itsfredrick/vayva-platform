import { prisma } from "@vayva/db";
import { EmptyState, Badge } from "@vayva/ui";
import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

async function getTransactions(storeId: string): Promise<any[]> {
    // Fetch Ledger Entries for wallet history
    const wallet = await prisma.wallet.findUnique({ where: { storeId } });
    if (!wallet) return [];

    // LedgerEntry uses storeId, not walletId
    return await prisma.ledgerEntry.findMany({
        where: { storeId },
        orderBy: { occurredAt: "desc" },
        take: 10
    });
}

export async function ServerTransactionList({ storeId }: { storeId: string }) {
    const transactions = await getTransactions(storeId);

    if (transactions.length === 0) {
        return (
            <EmptyState
                title="No recent transactions"
                icon="AlertCircle"
                description="Your recent inflows and payouts will appear here."
            />
        );
    }

    return (
        <div className="space-y-4">
            {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${t.type === 'CREDIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {t.type === 'CREDIT' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{t.description}</p>
                            <p className="text-xs text-gray-500">{format(t.createdAt, "MMM d, h:mm a")}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`font-mono font-bold ${t.type === 'CREDIT' ? 'text-green-600' : 'text-gray-900'}`}>
                            {t.type === 'CREDIT' ? '+' : ''}₦{(Number(t.amount) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <Badge variant="default" className="text-[10px] h-5">{t.type}</Badge>
                    </div>
                </div>
            ))}
        </div>
    );
}
