'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import api from '@/lib/axios';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, FileText, Download } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDate, formatDateTime } from '@/lib/dateUtils';

interface Invoice {
  id: string;
  missionId: string;
  vehicle: string;
  plate: string;
  date: string;
  amount: number;
  invoiceUrl: string;
  paymentStatus: 'NOT_PAID' | 'PAID';
}

function InvoicesPageContent() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [initialInvoices, setInitialInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get('/requests');
        if (res.data?.success) {
          // Filter only requests that have an admin quote (priced requests)
          const withInvoices = res.data.data.filter((req: any) => req.adminQuote?.amount);
          
          const mapped = withInvoices.map((req: any) => {
            let vehicleStr = "Vehicle";
            let plateStr = "N/A";

            if (req.type === 'TRANSPORT') {
              vehicleStr = `${req.details?.make || ''} ${req.details?.model || ''}`.trim() || 'Transport';
              plateStr = req.details?.plate || 'N/A';
            } else if (req.type === 'HIRE_DRIVER') {
              vehicleStr = `Driver Request (${req.details?.driverCount || 1})`;
            } else if (req.type === 'INSPECTION') {
              vehicleStr = `${req.details?.vehicleBrand || ''} ${req.details?.vehicleModel || ''}`.trim() || 'Inspection';
              plateStr = req.details?.licensePlate || 'N/A';
            }

            const baseAmount = req.adminQuote?.amount || 0;
            const expensesAmount = req.expenses?.reduce((acc: number, cur: any) => acc + (cur.amount || 0), 0) || 0;
            const finalAmount = baseAmount + expensesAmount;

            const missionIdStr = req.missionId || `#REQ-${req._id.slice(-5).toUpperCase()}`;

            return {
              id: req._id,
              missionId: missionIdStr,
              vehicle: vehicleStr,
              plate: plateStr,
              date: formatDate(req.createdAt),
              amount: finalAmount,
              invoiceUrl: req.invoiceUrl || '',
              paymentStatus: req.paymentStatus === 'PAID' ? 'PAID' : 'NOT_PAID'
            };
          });
          setInitialInvoices(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handleStatusChange = async (id: string, newStatus: 'PAID' | 'NOT_PAID') => {
    setInitialInvoices(prev =>
      prev.map(inv => (inv.id === id ? { ...inv, paymentStatus: newStatus } : inv))
    );
    try {
      await api.patch(`/requests/${id}/payment-status`, { paymentStatus: newStatus });
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  // Filtering Logic
  const filteredInvoices = useMemo(() => {
    return initialInvoices.filter((inv) => {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        inv.missionId.toLowerCase().includes(lowerQuery) ||
        inv.vehicle.toLowerCase().includes(lowerQuery) ||
        inv.plate.toLowerCase().includes(lowerQuery)
      );
    });
  }, [searchQuery, initialInvoices]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / itemsPerPage));
  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const downloadInvoice = (invoice: Invoice) => {
    if (!invoice.invoiceUrl) {
      alert('No invoice document available for download yet. Please contact support if you need it.');
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://backend.vehiqqo.com';
    const fileUrl = invoice.invoiceUrl.startsWith('http')
      ? invoice.invoiceUrl
      : `${baseUrl}/${invoice.invoiceUrl.replace(/\\/g, '/')}`;
    
    const win = window.open(fileUrl, '_blank');
    if (win) {
      win.focus();
    } else {
      window.location.href = fileUrl;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500 font-medium">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-[1400px] mx-auto min-h-screen pb-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-brand-text">My Invoices</h1>
      </div>

      <Card className="p-2 sm:p-3 rounded-full border border-slate-100 shadow-sm bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md px-2 md:px-2 py-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by ID, Vehicle..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-11 rounded-full border border-slate-200 bg-white h-11 focus-visible:ring-brand-blue focus-visible:border-transparent text-sm font-medium shadow-none"
          />
        </div>
      </Card>

      <Card className="rounded-[2rem] border border-slate-100 shadow-sm bg-white overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-5 px-6 sm:px-8 text-xs font-black text-slate-400 tracking-wider">
                  Mission ID
                </th>
                <th className="py-5 px-6 sm:px-8 text-xs font-black text-slate-400 tracking-wider">
                  Vehicle
                </th>
                <th className="py-5 px-6 sm:px-8 text-xs font-black text-slate-400 tracking-wider">
                  Date
                </th>
                <th className="py-5 px-6 sm:px-8 text-xs font-black text-slate-400 tracking-wider">
                  Amount
                </th>
                <th className="py-5 px-6 sm:px-8 text-xs font-black text-slate-400 tracking-wider">
                  Status
                </th>
                <th className="py-5 px-6 sm:px-8 text-xs font-black text-slate-400 tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentInvoices.length > 0 ? (
                currentInvoices.map((inv, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-5 px-6 sm:px-8 align-middle">
                      <span className="font-bold text-brand-blue">{inv.missionId}</span>
                    </td>
                    <td className="py-5 px-6 sm:px-8 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-brand-blue group-hover:bg-white transition-colors">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-brand-text text-sm sm:text-base">{inv.vehicle}</p>
                          <p className="text-[11px] font-bold text-slate-400 mt-0.5">{inv.plate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 sm:px-8 align-middle">
                      <span className="text-sm font-bold text-slate-500">{inv.date}</span>
                    </td>
                    <td className="py-5 px-6 sm:px-8 align-middle">
                      <span className={`text-sm font-bold ${inv.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-orange-500'}`}>
                        €{inv.amount}
                      </span>
                    </td>
                    <td className="py-5 px-6 sm:px-8 align-middle">
                      {inv.paymentStatus === 'PAID' ? (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          Paid
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-orange-50 text-orange-500 border border-orange-200">
                          Not Paid
                        </span>
                      )}
                    </td>
                    <td className="py-5 px-6 sm:px-8 align-middle text-right">
                      <div className="flex items-center justify-end">
                        {inv.invoiceUrl ? (
                          <Button
                            onClick={() => downloadInvoice(inv)}
                            className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full font-bold px-4 h-9 flex items-center gap-2 text-xs shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </Button>
                        ) : (
                          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                            Pending Gen.
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/50">
            <span className="text-sm text-slate-500 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 rounded-full border-slate-200 text-slate-500 hover:text-brand-blue hover:border-brand-blue"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded-full text-sm font-bold transition-colors ${currentPage === page
                      ? 'bg-brand-blue text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 rounded-full border-slate-200 text-slate-500 hover:text-brand-blue hover:border-brand-blue"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 md:space-y-8 max-w-[1400px] mx-auto min-h-screen pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-slate-400 font-bold text-lg">Loading invoices...</p>
      </div>
    }>
      <InvoicesPageContent />
    </Suspense>
  );
}
