import React, { useState, cloneElement, ReactElement } from 'react';
import api from '@/lib/axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Car,
  MapPin,
  Calendar,
  FileText,
  Info,
  Download
} from 'lucide-react';

interface OfferReceivedModalProps {
  children: React.ReactNode;
  order?: any;
}

export function OfferReceivedModal({ children, order }: OfferReceivedModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseAmount = order?.adminQuote?.amount || 0;
  const extraExpensesSum = order?.expenses?.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0) || 0;
  const finalTotal = baseAmount + extraExpensesSum;

  const handleDownloadInvoice = async () => {
    if (!order?.invoiceUrl) {
      alert("Invoice not available yet.");
      return;
    }
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://amraoui-hiredriver-backends.vercel.app';
      const fileUrl = order.invoiceUrl.startsWith('http') ? order.invoiceUrl : `${baseUrl}/${order.invoiceUrl.replace(/\\/g, '/')}`;
      
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Vehiqqo_${order.missionId || order._id.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error("Failed to download invoice", e);
      alert("Failed to download invoice");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
        {children}
      </div>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-[420px] md:max-w-[800px] p-0 gap-0 rounded-[24px] sm:rounded-[28px] overflow-hidden bg-white max-h-[90vh] overflow-y-auto hide-scrollbar" showCloseButton={false}>
        <div id="invoice-pdf-content" className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 lg:space-y-8 bg-white">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                data-html2canvas-ignore="true"
                className="h-10 w-10 rounded-full bg-slate-50 hover:bg-slate-100 flex-shrink-0"
                onClick={() => setOpen(false)}
              >
                <ArrowLeft className="h-5 w-5 text-slate-700" />
              </Button>
              <DialogTitle className="text-2xl font-black text-slate-900">
                Offer Received
              </DialogTitle>
            </div>

            <div className="pl-13">
              <DialogDescription className="text-[15px] font-medium text-slate-500 mb-3">
                Review the offer for your transport request.
              </DialogDescription>
              <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none px-3 py-1.5 rounded-full text-xs font-bold">
                Pending Customer Review
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="h-full">
              {/* Quote Summary */}
              <Card className="h-full rounded-[20px] border border-slate-100 shadow-sm p-4 sm:p-5 space-y-4 sm:space-y-5">
                <h3 className="font-bold text-slate-900 text-base">Quote Summary</h3>

                <div className="space-y-5">
                  {/* Transport Type */}
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Car className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 mb-0.5">Request Type</p>
                      <p className="text-sm font-bold text-slate-900">{order?.type || 'Drive with car'}</p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-slate-100" />

                  {/* Pickup Location */}
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 mb-0.5">Pickup Location</p>
                      <p className="text-sm font-bold text-slate-900">{order?.details?.pickupCity || order?.details?.pickupAddress || order?.details?.driverCity || order?.details?.inspectionLocation || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-slate-100" />

                  {/* Drop-off Location */}
                  {order?.type === 'TRANSPORT' && (
                    <>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 mb-0.5">Drop-off Location</p>
                          <p className="text-sm font-bold text-slate-900">{order?.details?.dropoffCity || order?.details?.dropoffAddress || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="w-full h-px bg-slate-100" />
                    </>
                  )}

                  {/* Preferred Date */}
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 mb-0.5">Date</p>
                      <p className="text-sm font-bold text-slate-900">{new Date(order?.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-slate-100" />

                  {/* Vehicle */}
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Car className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 mb-0.5">Vehicle</p>
                      <p className="text-sm font-bold text-slate-900">{order?.details?.make ? `${order.details.make} ${order.details.model}` : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </Card>

            </div>

            {/* Right Column */}
            <div className="space-y-5 sm:space-y-6 lg:space-y-8 flex flex-col justify-between">
              {/* Offer Details */}
              <Card className="rounded-[20px] border border-slate-100 shadow-sm p-4 sm:p-5 space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Offer Details</h3>

                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">Base Amount</p>
                  <p className="text-3xl font-black text-blue-600">$ {baseAmount}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Admin Notes</p>
                  <p className="text-sm font-medium text-slate-900 mb-2">{order?.adminQuote?.message || 'No additional notes'}</p>
                </div>

                {order?.expenses?.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 mb-2">Extra Expenses</p>
                    {order.expenses.map((exp: any, index: number) => (
                      <div key={index} className="flex justify-between items-center bg-slate-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-slate-700">{exp.type}</span>
                        <span className="text-sm font-bold text-slate-900">$ {exp.amount}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between mt-2">
                  <p className="text-sm font-bold text-slate-700">Final Total</p>
                  <p className="text-xl font-black text-blue-600">$ {finalTotal}</p>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="rounded-[20px] border border-slate-100 shadow-sm p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">Payment Method</h3>
                  {order?.invoiceUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      data-html2canvas-ignore="true"
                      className="h-8 text-xs font-semibold text-slate-600 rounded-lg gap-1.5 border-slate-200 hover:bg-slate-50"
                      onClick={handleDownloadInvoice}
                    >
                      <Download className="h-3.5 w-3.5" /> Download Invoice
                    </Button>
                  )}
                </div>

                <div className="border border-blue-200 bg-blue-50/30 rounded-xl p-4 flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-slate-900">Invoice Payment</p>
                      <Badge className="bg-emerald-100/50 text-emerald-600 hover:bg-emerald-100/50 border-none px-2 py-0 text-[10px] font-bold">
                        Selected
                      </Badge>
                    </div>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">
                      You will receive an invoice after the offer is accepted.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Full-Width Original Request Details */}
          <Card className="rounded-[20px] border border-slate-100 shadow-sm p-4 sm:p-5 mt-5 sm:mt-6 lg:mt-8">
            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Original Request Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {order?.details ? (
                Object.entries(order.details).map(([key, value]) => {
                  const excludeKeys = ['make', 'model', 'pickupCity', 'pickupAddress', 'dropoffCity', 'dropoffAddress', 'driverCity', 'inspectionLocation'];
                  if (!value || typeof value === 'object' || excludeKeys.includes(key)) return null;
                  const strVal = String(value);
                  const isLongText = strVal.length > 50;
                  const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  return (
                    <div key={key} className={`bg-slate-50 rounded-[16px] p-4 border border-slate-100/50 hover:bg-slate-100/50 transition-colors ${isLongText ? 'sm:col-span-2 lg:col-span-3' : ''}`}>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{formattedKey}</p>
                      {strVal.startsWith('http') ? (
                        <a href={strVal} target="_blank" rel="noopener noreferrer" className="text-[13px] font-bold text-blue-600 hover:underline break-words">
                          View File / Link
                        </a>
                      ) : (
                        <p className="text-[13px] font-bold text-slate-900 leading-relaxed whitespace-pre-wrap break-words">{strVal}</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full">
                  <p className="text-sm font-medium text-slate-500 italic text-center py-4">No additional details provided.</p>
                </div>
              )}
            </div>
          </Card>



        </div>

        <div className="space-y-4 sm:space-y-5 pt-2">
          {/* Terms Info */}
          <div className="bg-blue-50 rounded-xl p-4 flex gap-3 px-4 sm:px-6 lg:px-8">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              By accepting this offer, you agree to the <span className="font-bold text-blue-600">Terms & Conditions</span>.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 sm:gap-4 pt-2 pb-10 px-4 sm:px-6 lg:px-8">
            <Button
              variant="outline"
              disabled={isSubmitting || !order || order.status !== 'CUSTOMER_REVIEWING_QUOTE'}
              className="flex-1 h-12 rounded-2xl border-red-200 bg-red-50/50 text-red-500 font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
              onClick={async () => {
                if (!order) return;
                setIsSubmitting(true);
                try {
                  await api.patch(`/requests/${order._id}/customer-reply`, { action: 'REJECT' });
                  setOpen(false);
                  window.location.reload();
                } catch (e) {
                  console.error(e);
                  alert('Failed to reject quote');
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              Reject
            </Button>
            <Button
              disabled={isSubmitting || !order || order.status !== 'CUSTOMER_REVIEWING_QUOTE'}
              className="flex-1 h-12 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-emerald-600 font-bold hover:bg-emerald-50 transition-colors shadow-none"
              onClick={async () => {
                if (!order) return;
                setIsSubmitting(true);
                try {
                  await api.patch(`/requests/${order._id}/customer-reply`, { action: 'ACCEPT' });
                  setOpen(false);
                  window.location.reload();
                } catch (e) {
                  console.error(e);
                  alert('Failed to accept quote');
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              {isSubmitting ? 'Processing...' : 'Accept'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
