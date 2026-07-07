"use client";

import React, { useState, useEffect } from "react";
import { FinanceMetricCard } from "./components/FinanceMetricCard";
import { RevenueChart } from "./components/RevenueChart";
import { PaymentStatusChart } from "./components/PaymentStatusChart";
import { DriverPayoutChart } from "./components/DriverPayoutChart";
import { FinanceTable, Invoice } from "./components/FinanceTable";
import { Pagination } from "../mission-monitoring/components/Pagination";
import { apiFetch } from "@/lib/api";

const mockInvoices: Invoice[] = [
  {
    id: "INV-C-20458",
    mission: "#MS-20458",
    customer: "Amraoui",
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
  const [currentPage, setCurrentPage] = useState(1);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  const totalRevenue = requests.reduce((sum, r) => sum + (r.adminQuote?.amount || 0), 0);
  const pendingPayments = requests.reduce((sum, r) => sum + (r.status !== 'COMPLETED' ? (r.adminQuote?.amount || 0) : 0), 0);
  const paidPayments = requests.reduce((sum, r) => sum + (r.status === 'COMPLETED' ? (r.adminQuote?.amount || 0) : 0), 0);

  const getDriverPayout = (r: any) => {
    const quote = r.driverQuotes?.find((q: any) => q.status === 'ACCEPTED');
    if (!quote) return 0;
    return (quote.amount || 0) + (quote.fuelCost || 0) + (quote.tollCharges || 0) + (quote.exceptionalCosts || 0);
  };

  const payoutsPending = requests.reduce((sum, r) => sum + (r.status !== 'COMPLETED' ? getDriverPayout(r) : 0), 0);
  const payoutsPaid = requests.reduce((sum, r) => sum + (r.status === 'COMPLETED' ? getDriverPayout(r) : 0), 0);
  
  const cancellationFees = requests.reduce((sum, r) => sum + (r.status === 'CANCELLED' ? 50 : 0), 0); // Mock 50 per cancellation

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
      vehicle,
      route,
      amount: r.adminQuote?.amount || 0,
      status: r.status === 'COMPLETED' ? 'Paid' : (r.status === 'CANCELLED' ? 'Failed' : 'Pending'),
      method: r.details?.paymentMethod || 'Invoice',
      date: new Date(r.updatedAt).toLocaleDateString(),
      rawRequest: r
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
        <RevenueChart />
        <PaymentStatusChart />
      </div>

      {/* Driver Payout Chart */}
      <DriverPayoutChart />

      {/* Data Table */}
      <FinanceTable
        invoices={dynamicInvoices.slice((currentPage - 1) * 10, currentPage * 10)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="rounded-b-2xl overflow-hidden border-x border-b border-gray-200">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(dynamicInvoices.length / 10) || 1}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default FinancePage;
