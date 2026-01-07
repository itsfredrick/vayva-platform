import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Building2,
  Copy,
} from "lucide-react";
import { Icon } from "@vayva/ui";
import { WalletActions } from "@/components/finance/wallet-actions";
import { ServerTransactionList } from "@/components/finance/transaction-list";
import { formatCurrency } from "@/lib/formatters";

async function getWallet(storeId: string) {
  const wallet = await prisma.wallet.findUnique({
    where: { storeId },
  });
  return wallet;
}

export default async function WalletPage() {
  const user = await requireAuth();
  const wallet = await getWallet(user.storeId);

  // Format currency
  // const formatter = ... removed
  // Using shared formatter inline

  const balance = wallet ? Number(wallet.availableKobo) / 100 : 0;
  const pending = wallet ? Number(wallet.pendingKobo) / 100 : 0;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 pb-24 md:pb-8 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Wallet</h2>
        <div className="md:block hidden">
          <WalletActions balance={balance} />
        </div>
      </div>

      {/* Main Balance Card - Premium Design */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#D946EF] p-8 text-white shadow-2xl shadow-purple-200/50">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/70 text-sm font-medium uppercase tracking-widest">Available Balance</p>
              <h1 className="text-4xl md:text-5xl font-bold mt-1 tracking-tight">
                {formatCurrency(balance)}
              </h1>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Wallet className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/80 text-sm mb-8">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Real-time
            </span>
            <span>+ {formatCurrency(pending)} pending settlement</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-12 rounded-2xl bg-white text-purple-600 hover:bg-gray-50 flex items-center gap-2 font-bold shadow-lg shadow-black/5 active:scale-95 transition-transform">
              <Icon name="ArrowUpRight" size={18} />
              Transfer
            </Button>
            <Button className="h-12 rounded-2xl bg-black/20 backdrop-blur-md text-white hover:bg-black/30 border border-white/10 flex items-center gap-2 font-bold active:scale-95 transition-transform">
              <Icon name="Plus" size={18} />
              Add Money
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Virtual Account Info */}
        <div className="glass-card rounded-[2rem] p-6 shadow-sm border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Settlement Account</h3>
            <div className="p-2 rounded-xl bg-gray-50 text-gray-400">
              <Building2 className="h-5 w-5" />
            </div>
          </div>

          {wallet && wallet.vaStatus === "CREATED" ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 relative group truncate">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Account Number</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-heading font-bold text-gray-900 tracking-wider">
                    {wallet.vaAccountNumber}
                  </span>
                  <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100 shadow-sm">
                    <Copy className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <div>
                  <p className="text-xs text-gray-500">Bank Name</p>
                  <p className="text-sm font-bold text-gray-900">{wallet.vaBankName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Account Name</p>
                  <p className="text-sm font-bold text-gray-900">{wallet.vaAccountName}</p>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-start gap-3">
                <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                  Direct transfers to this account will reflect in your wallet instantly.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                <Icon name="ShieldAlert" size={24} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 font-medium mb-4 max-w-[200px]">
                Complete your identity verification to activate your account.
              </p>
              <Button size="sm" variant="outline" className="rounded-xl font-bold px-6">
                Verify Identity
              </Button>
            </div>
          )}
        </div>

        {/* Transaction History Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-gray-900">Activity</h3>
            <Link href="/dashboard/finance/transactions" className="text-xs font-bold text-purple-600 hover:text-purple-700">
              View All
            </Link>
          </div>

          <div className="bg-white rounded-[2rem] p-2 border border-gray-100 shadow-sm overflow-hidden">
            <ServerTransactionList storeId={user.storeId} />
          </div>
        </div>
      </div>
    </div>
  );
}
