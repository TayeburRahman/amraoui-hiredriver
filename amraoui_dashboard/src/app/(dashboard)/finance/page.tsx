"use client";

import React, { useState, useEffect } from "react";
import { FinanceMetricCard } from "./components/FinanceMetricCard";
import { RevenueChart } from "./components/RevenueChart";
import { PaymentStatusChart } from "./components/PaymentStatusChart";
import { DriverPayoutChart } from "./components/DriverPayoutChart";
import { FinanceTable, Invoice } from "./components/FinanceTable";
import { Pagination } from "../mission-monitoring/components/Pagination";
import { apiFetch } from "@/lib/api";
import { formatDate, formatDateTime } from '@/lib/dateUtils';

const mockInvoices: Invoice[] = [
  {
    id: "INV-C-20458",
    mission: "#MS-20458",
    customer: "Vehiqqo",
    vehicle: "BMW X5",
    route: "Paris → Lyon",
    amount: 450,
    status: "Paid",
    method: "Visa 4242",
    date: "22 Apr 2026",
  },
  {
    id: "INV-C-20461",
    mission: "#MS-20461",
    customer: "Premium Motors SAS",
    vehicle: "Audi A4",
    route: "Marseille → Nice",
    amount: 320,
    status: "Pending",
    method: "Card pending",
    date: "—",
  },
  {
    id: "INV-C-20389",
    mission: "#MS-20389",
    customer: "Sarah Williams",
    vehicle: "Tesla Model 3",
    route: "Lille → Paris",
    amount: 520,
    status: "Failed",
    method: "Mastercard 8891",
    date: "18 Apr 2026",
  },
];

const FinancePage = () => {
  const [activeTab, setActiveTab] = useState("Customer Payments");
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch<any>('/requests?limit=1000', { auth: true });
        if (res.ok && res.data?.success) {
          setRequests(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch requests", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [refreshKey]);

  const totalRevenue = requests.reduce((sum, r) => sum + (r.adminQuote?.amount || 0), 0);
  const pendingPayments = requests.reduce((sum, r) => sum + (r.status !== 'COMPLETED' && r.status !== 'CANCELLED' ? (r.adminQuote?.amount || 0) : 0), 0);
  const paidPayments = requests.reduce((sum, r) => sum + (r.status === 'COMPLETED' ? (r.adminQuote?.amount || 0) : 0), 0);
  const failedPayments = requests.reduce((sum, r) => sum + (r.status === 'CANCELLED' ? (r.adminQuote?.amount || 0) : 0), 0);

  const getDriverPayout = (r: any) => {
    const quote = r.driverQuotes?.find((q: any) => q.status === 'ACCEPTED');
    const baseService = quote?.amount || r.adminQuote?.driverPrice || 0;
    
    let extraCosts = 0;
    if (quote) {
      extraCosts += (quote.fuelCost || 0) + (quote.tollCharges || 0) + (quote.travelCost || 0) + (quote.taxiCost || 0);
    }
    
    if (r.expenses && r.expenses.length > 0) {
      extraCosts += r.expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
    }
    
    return baseService + extraCosts;
  };

  const payoutsPending = requests.reduce((sum, r) => sum + (r.status !== 'COMPLETED' ? getDriverPayout(r) : 0), 0);
  const payoutsPaid = requests.reduce((sum, r) => sum + (r.status === 'COMPLETED' ? getDriverPayout(r) : 0), 0);

  const cancellationFees = requests.reduce((sum, r) => sum + (r.status === 'CANCELLED' ? 50 : 0), 0); // Mock 50 per cancellation

  const paymentStatusData = [
    { name: `Paid: €${(paidPayments/1000).toFixed(1)}k`, value: paidPayments, color: '#10B981' },
    { name: `Pending: €${(pendingPayments/1000).toFixed(1)}k`, value: pendingPayments, color: '#F59E0B' },
    { name: `Failed: €${(failedPayments/1000).toFixed(1)}k`, value: failedPayments, color: '#EF4444' },
  ].filter(d => d.value > 0);

  const driverPayoutData = [
    { name: 'Paid', value: payoutsPaid },
    { name: 'Pending', value: payoutsPending },
  ];

  const revenueByDate: Record<string, { Revenue: number, Payouts: number, Margin: number }> = {};
  [...requests]
    .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
    .forEach(r => {
      if (!r.createdAt) return;
      const d = new Date(r.createdAt);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!revenueByDate[dateStr]) {
        revenueByDate[dateStr] = { Revenue: 0, Payouts: 0, Margin: 0 };
      }
      const rev = r.adminQuote?.amount || 0;
      const payout = getDriverPayout(r);
      revenueByDate[dateStr].Revenue += rev;
      revenueByDate[dateStr].Payouts += payout;
      revenueByDate[dateStr].Margin += (rev - payout);
    });

  const revenueChartData = Object.keys(revenueByDate).slice(-6).map(name => ({
    name,
    ...revenueByDate[name]
  }));

  const dynamicInvoices: Invoice[] = requests.filter(r => r.adminQuote?.amount).map(r => {
    let vehicle = 'N/A';
    if (r.type === 'TRANSPORT') vehicle = `${r.details?.make || ''} ${r.details?.model || ''}`.trim() || 'N/A';
    else if (r.type === 'INSPECTION') vehicle = `${r.details?.vehicleBrand || ''} ${r.details?.vehicleModel || ''}`.trim() || 'N/A';

    let route = 'Single Location';
    if (r.type === 'TRANSPORT') {
      const p = (r.details?.pickupAddress || "").split(",")[0];
      const d = (r.details?.dropoffAddress || "").split(",")[0];
      route = p && d ? `${p} → ${d}` : 'N/A';
    } else if (r.type === 'INSPECTION') {
      route = (r.details?.inspectionLocation || "").split(",")[0] || 'N/A';
    } else if (r.type === 'HIRE_DRIVER') {
      route = (r.details?.driverLocation || "").split(",")[0] || 'N/A';
    }

    return {
      id: `INV-C-${r.missionId?.replace('#MS-', '') || r._id.substring(0, 6)}`,
      mission: r.missionId || 'N/A',
      customer: r.customerId?.name || "N/A",
      driver: r.assignedDriverId?.name || "Unassigned",
      vehicle,
      route,
      amount: r.adminQuote?.amount || 0,
      driverPayout: getDriverPayout(r),
      status: r.paymentStatus === 'PAID' ? 'Paid' : (r.status === 'COMPLETED' ? 'Paid' : (r.status === 'CANCELLED' ? 'Cancelled' : (r.status === 'FAILED' ? 'Failed' : 'Pending'))),
      method: r.details?.paymentMethod || 'Invoice',
      date: formatDate(r.updatedAt),
      rawRequest: r,
      commissionStatus: r.commissionStatus || 'PENDING'
    };
  });

  return (
    <div className="overflow-auto pb-12 min-h-screen bg-[#F8F9FA] px-2 sm:px-4 lg:px-6">
      {/* Header Section */}
      <div className="mb-8 pt-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Finance</h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Manage customer payments, driver commissions, payouts, refunds,
          adjustments, and cancellation fees.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <FinanceMetricCard
          title="Total Revenue"
          amount={`€${totalRevenue.toLocaleString()}`}
          subtitle="All time"
        />
        <FinanceMetricCard
          title="Pending Payments"
          amount={`€${pendingPayments.toLocaleString()}`}
          amountColor="text-amber-500"
        />
        <FinanceMetricCard
          title="Paid Payments"
          amount={`€${paidPayments.toLocaleString()}`}
          amountColor="text-emerald-500"
        />
        <FinanceMetricCard
          title="Driver Payouts Pending"
          amount={`€${payoutsPending.toLocaleString()}`}
          amountColor="text-indigo-500"
        />
        <FinanceMetricCard
          title="Driver Payouts Paid"
          amount={`€${payoutsPaid.toLocaleString()}`}
          amountColor="text-emerald-500"
        />
        <FinanceMetricCard
          title="Cancellation Fees"
          amount={`€${cancellationFees.toLocaleString()}`}
          amountColor="text-amber-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RevenueChart data={revenueChartData} />
        <PaymentStatusChart data={paymentStatusData} />
      </div>

      {/* Driver Payout Chart */}
      <DriverPayoutChart data={driverPayoutData} />

      {/* Data Table */}
      <FinanceTable
        invoices={dynamicInvoices}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={() => setRefreshKey(prev => prev + 1)}
      />
    </div>
  );
};

export default FinancePage;
