"use client";

import React, { useState, useMemo } from 'react';
import { FinanceModal } from './FinanceModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination } from "../../mission-monitoring/components/Pagination";
import { apiFetch } from '@/lib/api';

export interface Invoice {
  id: string;
  mission: string;
  customer: string;
  driver?: string;
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
  const [timeframeFilter, setTimeframeFilter] = useState("All");
  const [customerFilter, setCustomerFilter] = useState("All");
  const [driverFilter, setDriverFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Extract unique customers and drivers for filters
  const uniqueCustomers = useMemo(() => {
    const customers = new Set(invoices.map(inv => inv.customer).filter((c): c is string => !!c && c !== "N/A"));
    return ["All", ...Array.from(customers)];
  }, [invoices]);

  const uniqueDrivers = useMemo(() => {
    const drivers = new Set(invoices.map(inv => inv.driver).filter((d): d is string => !!d && d !== "Unassigned" && d !== "N/A"));
    return ["All", ...Array.from(drivers)];
  }, [invoices]);

  // Reset page when tab or filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, statusFilter, timeframeFilter, customerFilter, driverFilter]);

  const handleOpenModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedInvoice(null), 200); // clear after animation
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Paid': return { backgroundColor: '#dcfce3', color: '#16a34a' }; // bg-green-100 text-green-600
      case 'Pending': return { backgroundColor: '#ffedd5', color: '#ea580c' }; // bg-orange-100 text-orange-600
      case 'Failed': return { backgroundColor: '#fee2e2', color: '#dc2626' }; // bg-red-100 text-red-600
      case 'Cancelled': return { backgroundColor: '#e5e7eb', color: '#374151' }; // bg-gray-200 text-gray-700
      default: return { backgroundColor: '#f3f4f6', color: '#1f2937' }; // bg-gray-100 text-gray-800
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    if (activeTab === "Customer Payments" && (!inv.amount || inv.amount <= 0)) return false;
    if (activeTab === "Driver Commission" && !inv.rawRequest?.driverQuotes?.length && !inv.rawRequest?.expenses?.length && inv.commissionStatus === 'PENDING') return false; 
    if (activeTab === "Failed" && inv.status !== 'Failed') return false;
    if (activeTab === "Cancellations" && inv.status !== 'Cancelled' && inv.rawRequest?.status !== 'CANCELLED') return false;

    if (statusFilter !== "All") {
      if (statusFilter === "Paid" && inv.status !== 'Paid') return false;
      if (statusFilter === "Pending" && inv.status !== 'Pending') return false;
      if (statusFilter === "Failed" && inv.status !== 'Failed') return false;
    }

    if (customerFilter !== "All" && inv.customer !== customerFilter) return false;
    if (driverFilter !== "All" && inv.driver !== driverFilter) return false;

    if (timeframeFilter !== "All" && inv.rawRequest?.createdAt) {
      const invDate = new Date(inv.rawRequest.createdAt);
      const today = new Date();
      if (timeframeFilter === "Today") {
        if (invDate.toDateString() !== today.toDateString()) return false;
      } else if (timeframeFilter === "Last 7 Days") {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        if (invDate < sevenDaysAgo) return false;
      } else if (timeframeFilter === "This Month") {
        if (invDate.getMonth() !== today.getMonth() || invDate.getFullYear() !== today.getFullYear()) return false;
      } else if (timeframeFilter === "This Year") {
        if (invDate.getFullYear() !== today.getFullYear()) return false;
      }
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

  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * 10, currentPage * 10);
  const totalPages = Math.ceil(filteredInvoices.length / 10) || 1;

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('finance-table-export');
      if (!element) return;
      
      const opt = {
        margin: 10,
        filename: `Finance_Report_${timeframeFilter.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'landscape' as const }
      };
      
      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("Error generating PDF", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleMarkCustomerPayment = async (invoice: Invoice, status: 'PAID' | 'NOT_PAID') => {
    if (!invoice.rawRequest?._id) return;
    try {
      const res = await apiFetch(`/requests/${invoice.rawRequest._id}/payment-status`, {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify({ paymentStatus: status })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Failed to update payment status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating payment status');
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mt-6 overflow-hidden relative z-0">

        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row gap-4 bg-gray-50/30">
          <div className="flex-1 relative min-w-[200px]">
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
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Customer Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors text-sm outline-none">
                Customer: {customerFilter === "All" ? "All" : customerFilter.substring(0, 10) + (customerFilter.length > 10 ? '...' : '')}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-64 overflow-y-auto p-2">
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter by Customer</div>
                {uniqueCustomers.map(c => (
                  <DropdownMenuItem key={c} className="cursor-pointer" onClick={() => setCustomerFilter(c)}>
                    <span className={customerFilter === c ? "font-bold text-blue-600" : ""}>{c}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Driver Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors text-sm outline-none">
                Driver: {driverFilter === "All" ? "All" : driverFilter.substring(0, 10) + (driverFilter.length > 10 ? '...' : '')}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-64 overflow-y-auto p-2">
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter by Driver</div>
                {uniqueDrivers.map(d => (
                  <DropdownMenuItem key={d} className="cursor-pointer" onClick={() => setDriverFilter(d)}>
                    <span className={driverFilter === d ? "font-bold text-blue-600" : ""}>{d}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* General Filters (Status/Timeframe) */}
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
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTimeframeFilter("Today")}>
                  <span className={timeframeFilter === "Today" ? "font-bold text-blue-600" : ""}>Today</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTimeframeFilter("Last 7 Days")}>
                  <span className={timeframeFilter === "Last 7 Days" ? "font-bold text-blue-600" : ""}>Last 7 Days (Week)</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTimeframeFilter("This Month")}>
                  <span className={timeframeFilter === "This Month" ? "font-bold text-blue-600" : ""}>This Month</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTimeframeFilter("This Year")}>
                  <span className={timeframeFilter === "This Year" ? "font-bold text-blue-600" : ""}>This Year</span>
                </DropdownMenuItem>
                <div className="h-px bg-gray-100 my-1"></div>
                <DropdownMenuItem className="cursor-pointer text-blue-600 font-medium" onClick={() => { setStatusFilter("All"); setTimeframeFilter("All"); setCustomerFilter("All"); setDriverFilter("All"); }}>Clear Filters</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export PDF Button */}
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm outline-none ${isExporting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              {isExporting ? 'Generating...' : 'Export PDF'}
            </button>
          </div>
        </div>

        {/* Table Container (used for PDF Export) */}
        <div id="finance-table-export" className="w-full overflow-x-auto" style={{ backgroundColor: '#ffffff', padding: '20px' }}>
          
          {/* Report Header for Context (Visible in PDF) */}
          <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #f3f4f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                Finance Report: {activeTab}
              </h2>
              {/* Fallback to standard img tag to ensure html2canvas can render it perfectly */}
              <img src="/logo.png" alt="Vehiqqo" style={{ height: '40px', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '0.875rem', color: '#4b5563' }}>
              <p style={{ margin: 0 }}><strong>Status:</strong> {statusFilter}</p>
              <p style={{ margin: 0 }}><strong>Timeframe:</strong> {timeframeFilter}</p>
              <p style={{ margin: 0 }}><strong>Customer:</strong> {customerFilter === "All" ? "All" : (customerFilter.length > 20 ? customerFilter.substring(0, 20) + "..." : customerFilter)}</p>
              <p style={{ margin: 0 }}><strong>Driver:</strong> {driverFilter === "All" ? "All" : (driverFilter.length > 20 ? driverFilter.substring(0, 20) + "..." : driverFilter)}</p>
              {searchQuery && <p style={{ margin: 0 }}><strong>Search:</strong> {searchQuery}</p>}
            </div>
          </div>

          <table className="w-full min-w-[1000px] text-left text-sm" style={{ color: '#4b5563' }}>
            <thead className="text-xs font-bold uppercase" style={{ backgroundColor: '#ffffff', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th className="px-5 py-4">Invoice ID</th>
                <th className="px-5 py-4">Mission</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Driver</th>
                <th className="px-5 py-4">Vehicle</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-center" data-html2canvas-ignore>Action</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid #f3f4f6' }}>
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((invoice) => (
                  <tr key={invoice.id} style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f3f4f6' }}>
                    <td className="px-5 py-4 whitespace-nowrap font-semibold" style={{ color: '#2563eb' }}>{invoice.id}</td>
                    <td className="px-5 py-4 whitespace-nowrap font-semibold" style={{ color: '#2563eb' }}>{invoice.mission}</td>
                    <td className="px-5 py-4 whitespace-nowrap font-bold" style={{ color: '#111827' }}>{invoice.customer}</td>
                    <td className="px-5 py-4 whitespace-nowrap">{invoice.driver}</td>
                    <td className="px-5 py-4 whitespace-nowrap">{invoice.vehicle}</td>
                    <td className="px-5 py-4 whitespace-nowrap font-bold" style={{ color: '#16a34a' }}>€{invoice.amount}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={getStatusStyle(invoice.status)}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs" style={{ color: '#6b7280' }}>{invoice.date}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-center flex justify-center items-center gap-3" data-html2canvas-ignore>
                      <button
                        onClick={() => handleOpenModal(invoice)}
                        className="font-bold transition-colors"
                        style={{ color: '#111827' }}
                      >
                        View
                      </button>
                      
                      {activeTab === "Customer Payments" && (
                        <>
                          <span style={{ color: '#d1d5db' }}>|</span>
                          {invoice.status === 'Paid' || invoice.rawRequest?.paymentStatus === 'PAID' ? (
                            <button
                              onClick={() => handleMarkCustomerPayment(invoice, 'NOT_PAID')}
                              className="font-bold transition-colors"
                              style={{ color: '#f97316' }}
                            >
                              Mark Pending
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkCustomerPayment(invoice, 'PAID')}
                              className="font-bold transition-colors"
                              style={{ color: '#16a34a' }}
                            >
                              Mark Paid
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))) : (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center" style={{ color: '#6b7280' }}>
                    No invoices found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
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
