import React from 'react';
import { Invoice } from './FinanceTable';

import { apiFetch } from '@/lib/api';

interface FinanceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
}

export const FinanceModal: React.FC<FinanceModalProps> = ({ invoice, isOpen, onClose, activeTab }) => {
  if (!isOpen || !invoice) return null;
  // If we are looking at the Driver Commission tab, we show the driver payout logic
  const isDriverCommission = activeTab === 'Driver Commission';
  // If not Driver Commission tab, fallback to old logic for other tabs
  const isPending = isDriverCommission 
    ? invoice.commissionStatus === 'PENDING' 
    : (invoice.status === 'Pending' || invoice.status === 'Failed');
    
  const req = invoice.rawRequest || {};
  
  const adminQuoteAmount = req.adminQuote?.amount || invoice.amount || 0;
  
  const acceptedDriverQuote = req.driverQuotes?.find((q: any) => q.status === 'ACCEPTED');
  const servicePrice = acceptedDriverQuote?.amount || 0;
  const fuelCost = acceptedDriverQuote?.fuelCost || 0;
  const tollCost = acceptedDriverQuote?.tollCharges || 0;
  const totalExpenses = fuelCost + tollCost;
  const totalPayableToDriver = servicePrice + totalExpenses;

  const handleMarkPaid = async () => {
    if (!req._id) return;
    try {
      const res = await apiFetch(`/requests/${req._id}/commission-status`, {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify({ commissionStatus: 'PAID' })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Failed to update commission status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating commission status');
    }
  };

  const downloadInvoice = async () => {
    if (req.invoiceUrl) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://amraoui-hiredriver-backends.vercel.app';
        const fileUrl = req.invoiceUrl.startsWith('http') ? req.invoiceUrl : `${baseUrl}/${req.invoiceUrl.replace(/\\/g, '/')}`;
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Vehiqqo_${invoice.mission}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error("Failed to download invoice", error);
        window.open(req.invoiceUrl, '_blank');
      }
    } else {
      alert('No invoice document available for download.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{invoice.id}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isPending ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
              }`}>
                {isDriverCommission ? invoice.commissionStatus : invoice.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {invoice.mission} • {isDriverCommission ? 'Driver Payout' : invoice.customer} • {invoice.date}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-4 space-y-6">
          
          {/* Highlight Box */}
          <div className={`p-5 rounded-xl text-white ${isPending ? 'bg-orange-500' : (isDriverCommission ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400')}`}>
            <p className="text-sm font-medium mb-1 opacity-90">
              {isDriverCommission ? 'Total Payable to Driver' : 'Total Amount'}
            </p>
            <h3 className="text-4xl font-bold mb-2">€{isDriverCommission ? totalPayableToDriver.toFixed(2) : adminQuoteAmount.toFixed(2)}</h3>
            <p className="text-xs opacity-80">
              {isDriverCommission ? `Service: €${servicePrice.toFixed(2)} • Expenses: €${totalExpenses.toFixed(2)}` : `${invoice.method} • TXN-${req._id?.substring(0, 4) || '8472'}`}
            </p>
          </div>

          {isDriverCommission ? (
            // Driver Payout Design Details
            <>
              {/* Commission Details */}
              <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-gray-900 mb-2">Commission Details</h4>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Invoice ID</span>
                  <span className="text-blue-600 font-medium cursor-pointer hover:underline">{invoice.id}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Driver</span>
                  <span className="font-bold text-gray-900">{req.assignedDriverId ? 'Assigned' : 'Unassigned'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Mission ID</span>
                  <span className="text-blue-600 font-medium cursor-pointer hover:underline">{invoice.mission}</span>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="border border-gray-100 rounded-xl p-4">
                <h4 className="text-xs font-bold text-gray-900 mb-4">Payment Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Service price</span>
                    <span className="font-bold text-gray-900">€{servicePrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-2">
                    <span className="text-gray-500 text-xs font-medium">Expenses</span>
                    <div className="flex justify-between items-center text-xs mt-2 pl-4">
                      <span className="text-gray-400">Fuel</span>
                      <span className="font-bold text-gray-900">€{fuelCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-2 pl-4">
                      <span className="text-gray-400">Toll</span>
                      <span className="font-bold text-gray-900">€{tollCost.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-50">
                    <span className="text-gray-500">Total expenses</span>
                    <span className="font-bold text-gray-900">€{totalExpenses.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-sm font-bold text-gray-900">Total Payable</span>
                    <span className="font-bold text-green-500 text-lg">€{totalPayableToDriver.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payout Information */}
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                <h4 className="text-xs font-bold text-gray-900 mb-3">Payout Information</h4>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Payment Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    invoice.commissionStatus === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {invoice.commissionStatus}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={downloadInvoice}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Download Invoice
                </button>
                {invoice.commissionStatus !== 'PAID' && (
                  <button onClick={handleMarkPaid} className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Mark Paid
                  </button>
                )}
                <button className="px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1">
                  $ Adjust
                </button>
              </div>
            </>
          ) : (
            // Paid Design Details (Customer Payment)
            <>
              {/* Payment Details */}
              <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-gray-900 mb-2">Payment Details</h4>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Invoice ID</span>
                  <span className="text-blue-600 font-medium cursor-pointer hover:underline">{invoice.id}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Mission ID</span>
                  <span className="text-blue-600 font-medium cursor-pointer hover:underline">{invoice.mission}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Customer</span>
                  <span className="font-bold text-gray-900">{invoice.customer}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Vehicle</span>
                  <span className="font-bold text-gray-900">{invoice.vehicle}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Route</span>
                  <span className="font-bold text-gray-900">{invoice.route}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-gray-900 mb-2">Price Breakdown</h4>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Service fee</span>
                  <span className="font-bold text-gray-900">€{adminQuoteAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-sm font-bold text-gray-900">Total</span>
                  <span className="font-bold text-green-500 text-lg">€{adminQuoteAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Timeline */}
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                <h4 className="text-xs font-bold text-gray-900 mb-4">Payment Timeline</h4>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-green-500 before:to-green-500">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full bg-blue-500 shrink-0 z-10 mr-4 shadow-[0_0_0_2px_#fff]"></div>
                    <div className="w-[calc(100%-2rem)]">
                      <div className="text-xs font-bold text-gray-900">Invoice created</div>
                      <div className="text-[10px] text-gray-400">22 Apr 2026, 09:15</div>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full bg-green-500 shrink-0 z-10 mr-4 shadow-[0_0_0_2px_#fff]"></div>
                    <div className="w-[calc(100%-2rem)]">
                      <div className="text-xs font-bold text-gray-900">Payment received</div>
                      <div className="text-[10px] text-gray-400">22 Apr 2026, 09:17</div>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full bg-green-500 shrink-0 z-10 mr-4 shadow-[0_0_0_2px_#fff]"></div>
                    <div className="w-[calc(100%-2rem)]">
                      <div className="text-xs font-bold text-gray-900">Receipt sent</div>
                      <div className="text-[10px] text-gray-400">22 Apr 2026, 09:18</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
