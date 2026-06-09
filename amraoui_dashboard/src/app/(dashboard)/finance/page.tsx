"use client";

import React, { useState } from "react";
import { FinanceMetricCard } from "./components/FinanceMetricCard";
import { RevenueChart } from "./components/RevenueChart";
import { PaymentStatusChart } from "./components/PaymentStatusChart";
import { DriverPayoutChart } from "./components/DriverPayoutChart";
import { FinanceTable, Invoice } from "./components/FinanceTable";
import { Pagination } from "../mission-monitoring/components/Pagination"; // reusing the pagination component

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
          amount="€128,450"
          subtitle="This month"
        />
        <FinanceMetricCard
          title="Pending Payments"
          amount="€12,800"
          amountColor="text-amber-500"
        />
        <FinanceMetricCard
          title="Paid Payments"
          amount="€98,320"
          amountColor="text-emerald-500"
        />
        <FinanceMetricCard
          title="Driver Payouts Pending"
          amount="€18,640"
          amountColor="text-indigo-500"
        />
        <FinanceMetricCard
          title="Driver Payouts Paid"
          amount="€74,920"
          amountColor="text-emerald-500"
        />
        <FinanceMetricCard
          title="Cancellation Fees"
          amount="€1,250"
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
        invoices={mockInvoices}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="rounded-b-2xl overflow-hidden border-x border-b border-gray-200">
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default FinancePage;
