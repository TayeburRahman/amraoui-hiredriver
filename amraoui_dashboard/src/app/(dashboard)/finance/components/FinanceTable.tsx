"use client";

import React, { useState } from 'react';
import { FinanceModal } from './FinanceModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export interface Invoice {
  id: string;
  mission: string;
  customer: string;
  vehicle: string;
  route: string;
  amount: number;
  status: string;
  method: string;
  date: string;
  rawRequest?: any;
  commissionStatus?: string;
}

interface FinanceTableProps {
  invoices: Invoice[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ["Overview", "Customer Payments", "Driver Commission", "Failed", "Cancellations"];

export const FinanceTable: React.FC<FinanceTableProps> = ({ invoices, activeTab, onTabChange }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleOpenModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedInvoice(null), 200); // clear after animation
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-600';
      case 'Pending': return 'bg-orange-100 text-orange-600';
      case 'Failed': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    if (statusFilter !== "All") {
       if (statusFilter === "Paid" && inv.status !== 'Paid') return false;
       if (statusFilter === "Pending" && inv.status !== 'Pending') return false;
       if (statusFilter === "Failed" && inv.status !== 'Failed') return false;
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inv.id.toLowerCase().includes(q) ||
        inv.mission.toLowerCase().includes(q) ||
        inv.customer.toLowerCase().includes(q) ||
        inv.vehicle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mt-6 overflow-hidden relative z-0">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 bg-gray-50/30">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search invoice, mission, customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" 
            />
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors text-sm outline-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                Filters
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2">
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</div>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setStatusFilter("Paid")}>Paid Invoices</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setStatusFilter("Pending")}>Pending Invoices</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setStatusFilter("Failed")}>Failed Invoices</DropdownMenuItem>
                <div className="h-px bg-gray-100 my-1"></div>
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Timeframe</div>
                <DropdownMenuItem className="cursor-pointer">Today</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Last 7 Days</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">This Month</DropdownMenuItem>
                <div className="h-px bg-gray-100 my-1"></div>
                <DropdownMenuItem className="cursor-pointer text-blue-600 font-medium" onClick={() => setStatusFilter("All")}>Clear Filters</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm text-gray-600">
            <thead className="bg-white text-xs text-gray-500 font-bold uppercase border-b border-gray-200">
              <tr>
                <th className="px-5 py-4">Invoice ID</th>
                <th className="px-5 py-4">Mission</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Vehicle</th>
                <th className="px-5 py-4">Route</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Method</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50/80 transition-colors bg-white">
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-blue-600">{invoice.id}</td>
                  <td className="px-5 py-4 whitespace-nowrap font-semibold text-blue-600">{invoice.mission}</td>
                  <td className="px-5 py-4 whitespace-nowrap font-bold text-gray-900">{invoice.customer}</td>
                  <td className="px-5 py-4 whitespace-nowrap">{invoice.vehicle}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-gray-500 text-xs">{invoice.route}</td>
                  <td className="px-5 py-4 whitespace-nowrap font-bold text-green-600">€{invoice.amount}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">{invoice.method}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">{invoice.date}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-center">
                    <button 
                      onClick={() => handleOpenModal(invoice)}
                      className="text-gray-900 font-bold hover:text-blue-600 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))) : (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-gray-500">
                    No invoices found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FinanceModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        invoice={selectedInvoice}
        activeTab={activeTab} 
      />
    </>
  );
};
