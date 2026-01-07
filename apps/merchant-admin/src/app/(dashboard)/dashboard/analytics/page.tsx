"use client";

import { useEffect, useState } from "react";
import { Icon, Button } from "@vayva/ui";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/formatters";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    orders: 0,
    revenue: 0,
    deliveries: 0
  });
  const [loading, setLoading] = useState(true);

  const [automationEnabled, setAutomationEnabled] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/analytics/summary");
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (e) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: 'csv' | 'pdf') => {
    if (type === 'pdf') {
      toast.info("PDF export coming soon.");
      return;
    }

    try {
      toast.loading("Generating report...");
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "finances", // Default to finances summary for Analytics page
          range: { from: startDate, to: endDate }
        })
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_finances_${startDate.toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.dismiss();
      toast.success("Report downloaded!");
    } catch (e) {
      toast.dismiss();
      toast.error("Failed to export report.");
    }
  };

  const toggleAutomation = () => {
    const newState = !automationEnabled;
    setAutomationEnabled(newState);
    if (newState) {
      toast.success("Daily Summaries Enabled! detailed reports will be sent to your email.");
    } else {
      toast.info("Automated reports disabled.");
    }
  };

  if (loading) return <div className="p-10 flex justify-center text-gray-500">Loading Report Data...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 max-w-7xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Records & Reports 📊</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Clean data for banks, taxes, and investors.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
            <Icon name="Mail" size={16} className="text-indigo-600" />
            <span className="text-xs font-bold text-gray-600">Daily Email</span>
            <button
              onClick={toggleAutomation}
              role="switch"
              aria-checked={automationEnabled}
              aria-label="Toggle daily email reports"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${automationEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${automationEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <Button variant="outline" className="rounded-2xl h-10 border-gray-200 hover:bg-white" onClick={() => handleExport('csv')}>
            <Icon name="FileText" className="mr-2" size={16} /> Export CSV
          </Button>
          <Button className="rounded-2xl h-10 bg-black text-white hover:bg-gray-800" onClick={() => handleExport('pdf')}>
            <Icon name="Download" className="mr-2" size={16} /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: formatCurrency(stats.revenue), icon: "Banknote", color: "text-green-600", bg: "bg-green-50" },
          { label: "Total Orders", value: stats.orders, icon: "ShoppingBag", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Deliveries", value: stats.deliveries, icon: "Truck", color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Store Visitors", value: stats.totalVisitors, icon: "Users", color: "text-orange-600", bg: "bg-orange-50" }
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-6 rounded-3xl shadow-sm border-none group hover:scale-[1.02] transition-all duration-300">
            <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon name={item.icon as any} size={20} />
            </div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</h2>
            <p className="text-2xl font-bold text-gray-900 font-heading">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-0 rounded-3xl shadow-sm border-none overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
          <h2 className="text-lg font-bold text-gray-900">Monthly Performance</h2>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {new Date().toLocaleString('default', { month: 'short' })} 2024
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Metric</th>
                <th className="px-6 py-4">Current Value</th>
                <th className="px-6 py-4">Sync Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white/30">
              {[
                { label: "Total Sales", value: formatCurrency(stats.revenue), status: "Calculated", sColor: "text-green-600" },
                { label: "Orders Handle", value: stats.orders, status: "Live", sColor: "text-indigo-600" },
                { label: "Verified Deliveries", value: stats.deliveries, status: "Verified", sColor: "text-blue-600" }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-white/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{row.label}</td>
                  <td className="px-6 py-4 font-mono font-medium text-gray-700">{row.value}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white rounded-lg shadow-sm ${row.sColor}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
