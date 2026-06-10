"use client";

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { X, User, Mail, Phone, MapPin, Car, FileText, CheckCircle2, Clock, Plus, Eye, Download, Send, Play } from 'lucide-react';
import { ProofViewerModal } from './ProofViewerModal';
import { AddExpenseModal } from './AddExpenseModal';


interface MissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: any;
}

export const MissionDetailsModal: React.FC<MissionDetailsModalProps> = ({ isOpen, onClose, mission }) => {
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  
  const [quoteMessage, setQuoteMessage] = useState('Here is your final quote.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingBaseFee, setIsEditingBaseFee] = useState(false);
  const [baseFeeInput, setBaseFeeInput] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (isOpen && mission) {
      const amount = mission.raw?.adminQuote?.amount;
      const canEdit = ['PENDING_ADMIN_QUOTE', 'CUSTOMER_REVIEWING_QUOTE'].includes(mission.raw?.status);
      setIsEditingBaseFee(!amount && canEdit);
      setBaseFeeInput(amount ? String(amount) : '');
    }
  }, [isOpen, mission]);

  if (!isOpen || !mission) return null;

  const handlePublish = async () => {
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/requests/${mission.realId}/publish-mission`, {
        method: 'PATCH',
        auth: true,
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Failed to publish mission');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignDriver = async (driverId: string) => {
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/requests/${mission.realId}/assign-driver`, {
        method: 'PATCH',
        body: JSON.stringify({ driverId }),
        auth: true,
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Failed to assign driver');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBaseFee = async () => {
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/requests/${mission.realId}/base-fee`, {
        method: 'PATCH',
        body: JSON.stringify({ amount: Number(baseFeeInput) }),
        auth: true,
      });
      if (res.ok) {
        if (!mission.raw.adminQuote) {
          mission.raw.adminQuote = {};
        }
        mission.raw.adminQuote.amount = Number(baseFeeInput);
        setIsEditingBaseFee(false);
      } else {
        alert('Failed to update base fee');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/requests/${mission.realId}/expenses/${expenseId}`, {
        method: 'DELETE',
        auth: true,
      });
      if (res.ok) {
        mission.raw.expenses = mission.raw.expenses.filter((exp: any) => exp._id !== expenseId);
      } else {
        alert('Failed to delete expense');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendCustomerQuote = async () => {
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/requests/${mission.realId}/admin-quote`, {
        method: 'PATCH',
        body: JSON.stringify({
          amount: Number(mission.raw?.adminQuote?.amount || 0),
          message: quoteMessage,
        }),
        auth: true,
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const errorData: any = res.data || {};
        alert(`Failed to send quote: ${errorData.message || 'Unknown error'}`);
      }
    } catch (e) {
      console.error(e);
      alert('Error sending quote');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use html-to-image to bypass the html2canvas lab/oklch parser bugs
      const { toPng } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');
      
      const element = document.getElementById('admin-invoice-pdf-content');
      if (!element) return;
      
      const dataUrl = await toPng(element, { 
        quality: 1, 
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        filter: (node) => {
          if (node instanceof HTMLElement && node.dataset.html2canvasIgnore === 'true') {
            return false;
          }
          return true;
        }
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // 10mm margins
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'PNG', 10, 10, pdfWidth, pdfHeight);
      pdf.save(`Amraoui_Invoice_${mission.id || 'Details'}.pdf`);
    } catch (e) {
      console.error("Failed to generate PDF", e);
      alert("Failed to generate PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 relative">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-gray-900">{mission.id || "MS-20458"}</h2>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">In Transit</span>
          </div>
          <p className="text-xs text-gray-400">Request ID: {mission.requestId || "REQ-20458"}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Car className="w-3.5 h-3.5" /> {mission.vehicle || "BMW X5"}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {mission.route || "Paris → Lyon"}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          
          {/* Extra Expenses & Final Invoice */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Extra Expenses & Final Invoice</h3>
            <p className="text-xs text-gray-400 mb-3">Review driver-submitted receipts, approve extra charges, and update the customer's final invoice.</p>
            
            {/* Expenses Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px]">
                  <tr>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">Amount</th>
                    <th className="px-3 py-2 text-left">Proof</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mission.raw?.expenses?.length > 0 ? (
                    mission.raw.expenses.map((exp: any, i: number) => (
                      <tr key={i}>
                        <td className="px-3 py-2">{exp.type}</td>
                        <td className="px-3 py-2">€{exp.amount}</td>
                        <td className="px-3 py-2 text-blue-600">{exp.proofUrl || 'No proof'}</td>
                        <td className="px-3 py-2 flex items-center gap-2">
                          <button className="text-blue-600 font-medium hover:underline">View</button>
                          <button onClick={() => handleDeleteExpense(exp._id)} disabled={isSubmitting} className="text-red-500 font-medium hover:underline disabled:opacity-50">Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-gray-400">No extra expenses added.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <button 
              onClick={() => setIsExpenseModalOpen(true)}
              className="w-full mt-3 py-2 border border-blue-200 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Extra Expense
            </button>

          </div>

          {/* Final Invoice Summary */}
          <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 text-xs">
            <h3 className="font-bold text-gray-900 mb-3">Final Invoice Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Base transport fee</span>
                {isEditingBaseFee ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      className="w-20 px-2 py-1 text-xs border border-gray-200 rounded text-right focus:outline-none focus:border-blue-500" 
                      value={baseFeeInput} 
                      onChange={e => setBaseFeeInput(e.target.value)} 
                      placeholder="0"
                    />
                    <button 
                      onClick={handleUpdateBaseFee} 
                      disabled={isSubmitting || !baseFeeInput}
                      className="text-blue-600 font-bold hover:underline disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setIsEditingBaseFee(false)} 
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">€{mission.raw?.adminQuote?.amount || 0}</span>
                    {['PENDING_ADMIN_QUOTE', 'CUSTOMER_REVIEWING_QUOTE'].includes(mission.raw?.status) && (
                      <button 
                        onClick={() => { 
                          setIsEditingBaseFee(true); 
                          setBaseFeeInput(String(mission.raw?.adminQuote?.amount || 0)); 
                        }} 
                        className="text-blue-600 text-xs underline hover:text-blue-800"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Extra expenses</span>
                <span className="font-bold text-gray-900">€{mission.raw?.expenses?.reduce((acc: number, cur: any) => acc + (cur.amount || 0), 0) || 0}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-green-200 mt-2">
                <span className="font-bold text-gray-900 text-sm">Final Total</span>
                <span className="text-xl font-bold text-blue-600">
                  €{ (mission.raw?.adminQuote?.amount || 0) + (mission.raw?.expenses?.reduce((acc: number, cur: any) => acc + (cur.amount || 0), 0) || 0) }
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button 
                onClick={() => setIsPreviewOpen(true)}
                className="py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Preview Invoice
              </button>
              <button 
                onClick={handleSendCustomerQuote}
                disabled={isSubmitting}
                className="py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1 disabled:opacity-50"
              >
                Send Customer Quote
              </button>
            </div>
          </div>          {mission.raw?.status === 'CUSTOMER_REVIEWING_QUOTE' && (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center justify-between">
              <span className="text-amber-800 text-sm font-medium">Waiting for customer to accept/reject the quote (€{mission.raw?.adminQuote?.amount}).</span>
              <button 
                onClick={handlePublish}
                disabled={isSubmitting}
                className="px-4 py-2 bg-white border border-amber-200 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 flex items-center gap-2"
              >
                <Play className="w-4 h-4" /> Force Publish
              </button>
            </div>
          )}

          {(mission.raw?.status === 'OPEN_FOR_DRIVERS' || mission.raw?.status === 'ADMIN_REVIEWING_DRIVERS') && (
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <h3 className="font-bold text-purple-900 mb-3 text-sm">Driver Quotes ({mission.raw?.driverQuotes?.length || 0})</h3>
              {mission.raw?.driverQuotes?.length > 0 ? (
                <div className="space-y-2">
                  {mission.raw.driverQuotes.map((q: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-purple-200">
                      <div>
                        <p className="text-sm font-bold text-purple-900">Driver {q.driverId}</p>
                        <p className="text-xs text-purple-700">Amount: €{q.amount} | Est: {q.estimatedTime || 'N/A'}</p>
                      </div>
                      <button 
                        onClick={() => handleAssignDriver(q.driverId)}
                        disabled={isSubmitting}
                        className="px-3 py-1.5 bg-purple-600 text-white rounded-md text-xs font-medium hover:bg-purple-700"
                      >
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-purple-700">Waiting for drivers to submit quotes...</p>
              )}
            </div>
          )}

          {/* Mission Summary */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Mission Summary</h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
              <div>
                <p className="text-gray-400">Customer</p>
                <p className="font-bold text-gray-900">{mission.customer || "Amraoui"}</p>
              </div>
              <div>
                <p className="text-gray-400">Driver</p>
                <p className="font-bold text-gray-900">{mission.driver || "Marc Dubois"}</p>
              </div>
              <div>
                <p className="text-gray-400">Priority</p>
                <p className="font-bold text-gray-900">Normal</p>
              </div>
              <div>
                <p className="text-gray-400">Assigned Quote</p>
                <p className="font-bold text-gray-900">€450</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Contact */}
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
              <h4 className="font-bold text-gray-900 mb-3">Customer Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">Amraoui</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">customer@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">+33 6 12 34 56 78</span>
                </div>
              </div>
            </div>
            {/* Driver Contact */}
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
              <h4 className="font-bold text-gray-900 mb-3">Driver Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">Marc Dubois</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">driver@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">+33 6 98 76 54 32</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Status Timeline */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Mission Status Timeline</h3>
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="space-y-3 relative before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-green-500">
                <div className="relative pl-7 text-xs flex items-center justify-between">
                  <span className="absolute left-0 top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </span>
                  <span className="font-medium text-gray-900">Request accepted</span>
                </div>
                <div className="relative pl-7 text-xs flex items-center justify-between">
                  <span className="absolute left-0 top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </span>
                  <span className="font-medium text-gray-900">Driver assigned</span>
                </div>
                <div className="relative pl-7 text-xs flex items-center justify-between">
                  <span className="absolute left-0 top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </span>
                  <span className="font-medium text-gray-900">Pickup started</span>
                </div>
                <div className="relative pl-7 text-xs flex items-center justify-between">
                  <span className="absolute left-0 top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </span>
                  <span className="font-medium text-gray-900">Vehicle verified</span>
                </div>
                <div className="relative pl-7 text-xs flex items-center justify-between">
                  <span className="absolute left-0 top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Clock className="w-2.5 h-2.5 text-white" />
                  </span>
                  <span className="font-medium text-gray-900">In transit</span>
                  <span className="text-gray-400">Current step</span>
                </div>
              </div>
            </div>
          </div>

          {/* Proof & Report Status */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Proof & Report Status</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                <span className="text-gray-600">Pickup Photos</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                <span className="text-gray-600">Pickup Signature</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                <span className="text-gray-600">Delivery Photos</span>
                <span className="text-gray-400">Pending</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                <span className="text-gray-600">Damage Report</span>
                <span className="text-green-600 font-medium">No Damage</span>
              </div>
            </div>
          </div>


        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3 text-sm">
          <button 
            onClick={() => setIsProofModalOpen(true)}
            className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center justify-center gap-1"
          >
            <Download className="w-4 h-4" /> View Proof
          </button>

          <button className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center justify-center gap-1">
            Cancel Mission
          </button>
        </div>
      </div>

      <ProofViewerModal 
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
      />

      <AddExpenseModal 
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        mission={mission}
      />

      {/* Preview Invoice Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-900">Invoice Preview</h2>
              <button onClick={() => setIsPreviewOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div id="admin-invoice-pdf-content" className="p-6 space-y-4 text-sm text-gray-700 bg-white">
              <div className="flex justify-between border-b pb-4">
                <div>
                  <p className="font-bold text-gray-900">Amraoui HireDriver</p>
                  <p className="text-xs text-gray-500">Invoice #{mission.id || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">Customer</p>
                  <p className="text-xs text-gray-500">{mission.raw?.customerId?.firstName} {mission.raw?.customerId?.lastName}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span>Base transport fee</span>
                  <span>€{mission.raw?.adminQuote?.amount || 0}</span>
                </div>
                {mission.raw?.expenses?.map((exp: any, i: number) => (
                  <div key={i} className="flex justify-between py-1 text-xs text-gray-500">
                    <span>+ {exp.type}</span>
                    <span>€{exp.amount}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t font-bold text-lg text-gray-900">
                <span>Final Total</span>
                <span>€{ (mission.raw?.adminQuote?.amount || 0) + (mission.raw?.expenses?.reduce((acc: number, cur: any) => acc + (cur.amount || 0), 0) || 0) }</span>
              </div>

              {/* Signature Section - Only visible during PDF generation */}
              {isGeneratingPDF && (
                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Company Signature</p>
                    <div className="h-12 w-48 border-b-2 border-gray-200 mb-2 flex items-end pb-1">
                      <span className="font-bold text-gray-800 italic text-2xl opacity-80">Amraoui</span>
                    </div>
                    <p className="text-[10px] font-semibold text-gray-400">Authorized Representative</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Customer Signature</p>
                    <div className="h-12 w-48 border-b-2 border-gray-200 mb-2"></div>
                    <p className="text-[10px] font-semibold text-gray-400">Date: ____/____/20__</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setIsPreviewOpen(false)} className="px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-100">Close</button>
              <button 
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

