"use client";

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { X, User, Mail, Phone, MapPin, Car, FileText, CheckCircle2, Clock, Plus, Eye, Download, Send, Play } from 'lucide-react';
import { ProofViewerModal } from './ProofViewerModal';
import { AddExpenseModal } from './AddExpenseModal';
import Link from 'next/link';
import { formatDate, formatDateTime } from '@/lib/dateUtils';


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
  const [driverPriceInput, setDriverPriceInput] = useState('');
  const [isEditingDriverPrice, setIsEditingDriverPrice] = useState(false);
  const [isUploadingInvoice, setIsUploadingInvoice] = useState(false);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen && mission) {
      const amount = mission.raw?.adminQuote?.amount;
      const canEdit = ['PENDING_ADMIN_QUOTE', 'CUSTOMER_REVIEWING_QUOTE'].includes(mission.raw?.status);
      setIsEditingBaseFee(!amount && canEdit);
      setBaseFeeInput(amount ? String(amount) : '');
      const dPrice = mission.raw?.adminQuote?.driverPrice;
      setDriverPriceInput(dPrice ? String(dPrice) : '');
      setIsEditingDriverPrice(!dPrice && canEdit);
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

  const handleDeleteMission = async () => {
    if (!confirm('Are you sure you want to delete this mission completely? This action cannot be undone.')) return;
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/requests/${mission.realId}`, {
        method: 'DELETE',
        auth: true,
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Failed to delete mission');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenForDrivers = async () => {
    if (!confirm('Are you sure you want to open this mission for drivers to quote?')) return;
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/requests/${mission.realId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'OPEN_FOR_DRIVERS' }),
        auth: true,
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert('Failed to open mission for drivers');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignDriver = async (quoteId: string) => {
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/requests/${mission.realId}/assign-driver`, {
        method: 'PATCH',
        body: JSON.stringify({ quoteId }),
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

  const handleUpdateDriverPrice = async () => {
    if (!driverPriceInput || Number(driverPriceInput) <= 0) {
      alert("Please enter a valid driver price.");
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/requests/${mission.realId}/driver-price`, {
        method: 'PATCH',
        body: JSON.stringify({ driverPrice: Number(driverPriceInput) }),
        auth: true,
      });
      if (res.ok) {
        if (!mission.raw.adminQuote) {
          mission.raw.adminQuote = {};
        }
        mission.raw.adminQuote.driverPrice = Number(driverPriceInput);
        setIsEditingDriverPrice(false);
      } else {
        alert('Failed to update driver price');
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
    if (!driverPriceInput || Number(driverPriceInput) <= 0) {
      alert("Driver Price is mandatory before sending the quote.");
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/requests/${mission.realId}/admin-quote`, {
        method: 'PATCH',
        body: JSON.stringify({
          amount: Number(mission.raw?.adminQuote?.amount || baseFeeInput || 0),
          driverPrice: Number(driverPriceInput),
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

  const handleUploadInvoice = async () => {
    if (!invoiceFile) return;
    try {
      setIsUploadingInvoice(true);
      const formData = new FormData();
      formData.append('invoice', invoiceFile);

      const res = await apiFetch<any>(`/requests/${mission.realId}/invoice`, {
        method: 'PATCH',
        body: formData,
        auth: true,
      });

      if (res.ok) {
        if (!mission.raw) mission.raw = {};
        mission.raw.invoiceUrl = res.data?.data?.invoiceUrl || res.data?.invoiceUrl;
        setInvoiceFile(null);
        alert('Invoice uploaded successfully!');
      } else {
        alert('Failed to upload invoice');
      }
    } catch (e) {
      console.error(e);
      alert('Error uploading invoice');
    } finally {
      setIsUploadingInvoice(false);
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
                        <td className="px-3 py-2">
                          {exp.proofUrl ? (
                            <a href={exp.proofUrl} target="_blank" rel="noopener noreferrer">
                              <img src={exp.proofUrl} alt="Proof" className="h-8 w-12 object-cover rounded border border-gray-200 hover:opacity-80 transition-opacity" />
                            </a>
                          ) : (
                            <span className="text-gray-400">No proof</span>
                          )}
                        </td>
                        <td className="px-3 py-2 flex items-center gap-2">
                          {exp.proofUrl ? (
                            <button onClick={() => window.open(exp.proofUrl, '_blank')} className="text-blue-600 font-medium hover:underline">View</button>
                          ) : (
                            <button disabled className="text-gray-400 font-medium cursor-not-allowed">View</button>
                          )}
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

          {/* Internal Pricing */}
          <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 text-xs mb-6">
            <h3 className="font-bold text-purple-900 mb-3">Internal Pricing (Admin/Driver Only)</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Driver Price</span>
              {isEditingDriverPrice ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-20 px-2 py-1 text-xs border border-gray-200 rounded text-right focus:outline-none focus:border-purple-500"
                    value={driverPriceInput}
                    onChange={e => setDriverPriceInput(e.target.value)}
                    placeholder="0"
                  />
                  <button
                    onClick={handleUpdateDriverPrice}
                    disabled={isSubmitting || !driverPriceInput}
                    className="text-purple-600 font-bold hover:underline disabled:opacity-50"
                  >
                    Save
                  </button>
                  {mission.raw?.adminQuote?.driverPrice && (
                    <button
                      onClick={() => setIsEditingDriverPrice(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-purple-900">€{mission.raw?.adminQuote?.driverPrice || 0}</span>
                  <button
                    onClick={() => {
                      setIsEditingDriverPrice(true);
                      setDriverPriceInput(String(mission.raw?.adminQuote?.driverPrice || 0));
                    }}
                    className="text-purple-600 text-xs underline hover:text-purple-800"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
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
                  €{(mission.raw?.adminQuote?.amount || 0) + (mission.raw?.expenses?.reduce((acc: number, cur: any) => acc + (cur.amount || 0), 0) || 0)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 items-end">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">Official Invoice (PDF)</label>
                {mission.raw?.invoiceUrl ? (
                  <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2">
                    <span className="text-xs text-gray-500 truncate flex-1">Invoice Uploaded</span>
                    <a
                      href={mission.raw.invoiceUrl.startsWith('http') ? mission.raw.invoiceUrl : `${process.env.NEXT_PUBLIC_API_URL || 'https://amraoui-hiredriver-backends.vercel.app/api/v1'}${mission.raw.invoiceUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-xs font-medium hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> View
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setInvoiceFile(e.target.files ? e.target.files[0] : null)}
                      className="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg p-1 bg-white cursor-pointer"
                    />
                    <button
                      onClick={handleUploadInvoice}
                      disabled={isUploadingInvoice || !invoiceFile}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 shrink-0"
                    >
                      {isUploadingInvoice ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleSendCustomerQuote}
                disabled={isSubmitting}
                className="py-2.5 h-[38px] bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1 disabled:opacity-50"
              >
                Send Customer Quote
              </button>
            </div>
          </div>
          {mission.raw?.status === 'CUSTOMER_REVIEWING_QUOTE' && (
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-purple-900 text-sm">Driver Quotes ({mission.raw?.driverQuotes?.length || 0})</h3>
                <Link
                  href={`/quote-desk/${mission.realId}/compare?reqId=${mission.realId}`}
                  className="px-3 py-1.5 bg-white border border-purple-200 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors"
                >
                  Compare Quotes
                </Link>
              </div>
              {mission.raw?.driverQuotes?.length > 0 ? (
                <div className="space-y-2">
                  {mission.raw.driverQuotes.map((q: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-purple-200">
                      <div>
                        <p className="text-sm font-bold text-purple-900">{q.driverId?.name || "Unknown Driver"}</p>
                        <p className="text-xs text-purple-700">Amount: €{q.amount} | Est: {q.estimatedTime || 'N/A'}</p>
                      </div>
                      <button
                        onClick={() => handleAssignDriver(q._id)}
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
                <p className="font-bold text-gray-900">{mission.customer || "Vehiqqo"}</p>
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
                <p className="font-bold text-gray-900">€{mission.raw?.adminQuote?.amount || 0}</p>
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
                  <span className="text-gray-600">
                    {(mission.raw?.customerId?.name ? `${mission.raw.customerId.name} ${mission.raw.customerId.family_name || ''}`.trim() : null) ||
                     (mission.raw?.details?.firstName ? `${mission.raw.details.firstName} ${mission.raw.details.lastName || ''}`.trim() : null) ||
                     mission.raw?.details?.customerName ||
                     mission.customer ||
                     "Unknown Customer"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">
                    {mission.raw?.customerId?.email ||
                     mission.raw?.details?.customerEmail ||
                     mission.raw?.details?.email ||
                     mission.raw?.email ||
                     "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">
                    {mission.raw?.customerId?.phone_number ||
                     mission.raw?.customerId?.phone ||
                     mission.raw?.customerId?.phoneNumber ||
                     mission.raw?.details?.customerPhone ||
                     mission.raw?.details?.phone ||
                     mission.raw?.details?.pickupContactPhone ||
                     mission.raw?.phone ||
                     mission.raw?.phone_number ||
                     "N/A"}
                  </span>
                </div>
              </div>
            </div>
            {/* Driver Contact */}
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
              <h4 className="font-bold text-gray-900 mb-3">Driver Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">
                    {mission.raw?.assignedDriverId?.name ||
                     (mission.raw?.assignedDriverId?.firstName ? `${mission.raw.assignedDriverId.firstName} ${mission.raw.assignedDriverId.lastName || ''}`.trim() : null) ||
                     mission.raw?.assignedDriverIds?.[0]?.name ||
                     "Unassigned"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">
                    {mission.raw?.assignedDriverId?.email ||
                     mission.raw?.assignedDriverIds?.[0]?.email ||
                     "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">
                    {mission.raw?.assignedDriverId?.phone_number ||
                     mission.raw?.assignedDriverId?.phone ||
                     mission.raw?.assignedDriverId?.phoneNumber ||
                     mission.raw?.assignedDriverIds?.[0]?.phone_number ||
                     mission.raw?.assignedDriverIds?.[0]?.phone ||
                     mission.raw?.assignedDriverIds?.[0]?.phoneNumber ||
                     mission.raw?.details?.driverPhone ||
                     "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Original Request Details */}
          {mission.raw?.details && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Original Request Details</h3>
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(mission.raw.details).map(([key, value]) => {
                    // Skip already displayed contact fields and internal execution data
                    const excludedFields = [
                      'firstName', 'lastName', 'email', 'phone', 'company',
                      'documents', 'pickupInspection', 'deliveryInspection',
                      'pickupVerification', 'deliveryArrivalDeclared',
                      'deliveryArrivalTime', 'deliveryArrivalLocation'
                    ];
                    if (excludedFields.includes(key)) return null;

                    // Render document fields as clickable open/download links
                    const docFields = ['vehiclePhotos', 'registrationDocumentName', 'referenceDocumentName'];
                    if (docFields.includes(key) && value) {
                      const strVal = String(value);
                      const filename = decodeURIComponent(strVal.split('/').pop() || strVal);
                      // The field stores only the raw filename; look up the full URL in details.documents[]
                      const docsArray: any[] = Array.isArray(mission.raw.details.documents) ? mission.raw.details.documents : [];
                      
                      // Match by documentType, originalName, URL substring, or position
                      let matchedDoc = docsArray.find((d: any) => {
                        const docUrl = typeof d === 'string' ? d : d?.url || '';
                        const docOrig = typeof d === 'object' ? d?.originalName || '' : '';
                        const docType = typeof d === 'object' ? d?.documentType || '' : '';

                        if (docType && docType === key) return true;
                        if (docOrig && (docOrig === strVal || docOrig.includes(strVal) || strVal.includes(docOrig))) return true;
                        if (docUrl && (docUrl.includes(strVal) || docUrl.toLowerCase().endsWith(strVal.toLowerCase()))) return true;
                        try {
                          if (docUrl && decodeURIComponent(docUrl).includes(strVal)) return true;
                        } catch (e) {}
                        return false;
                      });

                      // Fallback matching by position if docs exist in details.documents[]
                      if (!matchedDoc && docsArray.length > 0) {
                        if (key === 'vehiclePhotos' && docsArray[0]) {
                          matchedDoc = docsArray[0];
                        } else if (key === 'registrationDocumentName') {
                          matchedDoc = docsArray.length > 1 ? docsArray[1] : docsArray[0];
                        } else if (key === 'referenceDocumentName') {
                          matchedDoc = docsArray.length > 2 ? docsArray[2] : (docsArray.length > 1 ? docsArray[1] : docsArray[0]);
                        }
                      }

                      const matchedDocUrl = typeof matchedDoc === 'string' ? matchedDoc : matchedDoc?.url || null;
                      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://amraoui-hiredriver-backends.vercel.app/api/v1').replace('/api/v1', '');
                      const fileUrl = matchedDocUrl
                        ? (matchedDocUrl.startsWith('http') ? matchedDocUrl : `${baseUrl}${matchedDocUrl.startsWith('/') ? '' : '/'}${matchedDocUrl}`)
                        : null; // No URL found — file may not have been uploaded yet
                      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                      // Use Google Docs Viewer for PDFs so they render in-browser regardless
                      // of Cloudinary resource_type (raw vs image). Word/Excel docs open directly (download).
                      const isDocument = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i.test(filename);
                      const openUrl = isDocument && fileUrl
                        ? `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=false`
                        : fileUrl;
                      return (
                        <div key={key} className="col-span-1 sm:col-span-2 md:col-span-3 min-w-0">
                          <p className="text-gray-400 mb-1">{formattedKey}</p>
                          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2">
                            <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                            <span className="flex-1 text-gray-700 font-medium truncate" title={filename}>{filename}</span>
                            {fileUrl ? (
                              <>
                                <a
                                  href={openUrl!}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold hover:bg-blue-100 transition-colors shrink-0"
                                  title={isDocument ? 'Open document viewer' : 'Open in new tab'}
                                >
                                  <Eye className="w-3 h-3" /> Open
                                </a>
                                <a
                                  href={fileUrl}
                                  download={filename}
                                  className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md text-[10px] font-bold hover:bg-green-100 transition-colors shrink-0"
                                  title="Download file"
                                >
                                  <Download className="w-3 h-3" /> Download
                                </a>
                              </>
                            ) : (
                              <span className="text-[10px] text-gray-400 italic shrink-0">Not uploaded</span>
                            )}
                          </div>
                        </div>
                      );
                    }

                    let displayValue = value;
                    if (typeof displayValue === 'boolean') displayValue = displayValue ? 'Yes' : 'No';
                    if (Array.isArray(displayValue)) displayValue = displayValue.join(', ');
                    if (typeof displayValue === 'object' && displayValue !== null) displayValue = JSON.stringify(displayValue);
                    if (!displayValue || displayValue === '') return null;

                    const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                    return (
                      <div key={key} className={String(displayValue).length > 50 ? "col-span-1 sm:col-span-2 md:col-span-3" : "min-w-0"}>
                        <p className="text-gray-400 truncate">{formattedKey}</p>
                        <p className="font-bold text-gray-900 whitespace-pre-wrap break-words">{String(displayValue)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Mission Status Timeline */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Mission Status Timeline</h3>
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="space-y-3 relative before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-green-500">
                <div className="relative pl-7 text-xs flex items-center justify-between">
                  <span className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${mission.raw?.status !== 'PENDING_ADMIN_QUOTE' && mission.raw?.status !== 'CUSTOMER_REVIEWING_QUOTE' && mission.raw?.status !== 'REJECTED_BY_CUSTOMER' ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </span>
                  <span className="font-medium text-gray-900">Request accepted</span>
                </div>
                <div className="relative pl-7 text-xs flex items-center justify-between">
                  <span className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${mission.raw?.assignedDriverId || (mission.raw?.assignedDriverIds && mission.raw?.assignedDriverIds.length > 0) ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </span>
                  <span className="font-medium text-gray-900">Driver assigned</span>
                </div>
                {mission.raw?.type !== 'HIRE_DRIVER' ? (
                  <>
                    <div className="relative pl-7 text-xs flex items-center justify-between">
                      <span className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${['IN_PROGRESS', 'COMPLETED'].includes(mission.raw?.status) ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </span>
                      <div className="flex flex-col flex-grow">
                        <span className="font-medium text-gray-900">Pickup started</span>
                        {mission.raw?.details?.pickupVerification?.distanceFromTarget !== undefined && (
                          <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${mission.raw.details.pickupVerification.distanceFromTarget <= 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {mission.raw.details.pickupVerification.distanceFromTarget <= 100 
                              ? 'Location Verified' 
                              : `Warning: ${(mission.raw.details.pickupVerification.distanceFromTarget / 1000).toFixed(1)} km away`}
                          </span>
                        )}
                      </div>
                    </div>
                    {mission.raw?.details?.deliveryArrivalDeclared && (
                      <div className="relative pl-7 text-xs flex items-center justify-between">
                        <span className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center bg-green-500`}>
                          <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                        </span>
                        <div className="flex flex-col flex-grow">
                          <span className="font-medium text-gray-900">Delivery Arrival</span>
                          {mission.raw?.details?.deliveryArrivalDistance !== undefined && (
                            <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${mission.raw.details.deliveryArrivalDistance <= 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {mission.raw.details.deliveryArrivalDistance <= 100 
                                ? 'Location Verified' 
                                : `Warning: ${(mission.raw.details.deliveryArrivalDistance / 1000).toFixed(1)} km away`}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="relative pl-7 text-xs flex items-center justify-between">
                      <span className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${['COMPLETED'].includes(mission.raw?.status) ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </span>
                      <span className="font-medium text-gray-900">Mission Completed</span>
                    </div>
                  </>
                ) : (
                  <>
                    {(mission.raw?.details?.driverArrivals || []).map((arrival: any, idx: number) => (
                      <div key={idx} className="relative pl-7 text-xs flex items-center justify-between">
                        <span className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center bg-green-500">
                          <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                        </span>
                        <div>
                          <span className="font-medium text-gray-900 block">Arrived: {arrival.date}</span>
                          <span className="text-gray-500">{formatDateTime(arrival.verifiedAt)}</span>
                        </div>
                      </div>
                    ))}
                    {(!mission.raw?.details?.driverArrivals || mission.raw.details.driverArrivals.length === 0) && (
                      <div className="relative pl-7 text-xs flex items-center justify-between">
                        <span className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${['IN_PROGRESS', 'COMPLETED'].includes(mission.raw?.status) ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                        </span>
                        <span className="font-medium text-gray-900">Service started</span>
                      </div>
                    )}
                    <div className="relative pl-7 text-xs flex items-center justify-between mt-3">
                      <span className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${['COMPLETED'].includes(mission.raw?.status) ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </span>
                      <span className="font-medium text-gray-900">Mission Completed</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Proof & Report Status */}
          {mission.raw?.type !== 'HIRE_DRIVER' && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Proof & Report Status</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                <span className="text-gray-600">Pickup Photos</span>
                <span className={['IN_PROGRESS', 'COMPLETED'].includes(mission.raw?.status) ? "text-green-600 font-medium" : "text-gray-400"}>
                  {['IN_PROGRESS', 'COMPLETED'].includes(mission.raw?.status) ? "Completed" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                <span className="text-gray-600">Pickup Signature</span>
                <span className={['IN_PROGRESS', 'COMPLETED'].includes(mission.raw?.status) ? "text-green-600 font-medium" : "text-gray-400"}>
                  {['IN_PROGRESS', 'COMPLETED'].includes(mission.raw?.status) ? "Completed" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                <span className="text-gray-600">Delivery Photos</span>
                <span className={['COMPLETED'].includes(mission.raw?.status) ? "text-green-600 font-medium" : "text-gray-400"}>
                  {['COMPLETED'].includes(mission.raw?.status) ? "Completed" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                <span className="text-gray-600">Damage Report</span>
                <span className={['COMPLETED'].includes(mission.raw?.status) ? "text-green-600 font-medium" : "text-gray-400"}>
                  {['COMPLETED'].includes(mission.raw?.status) ? "No Damage" : "Pending"}
                </span>
              </div>
            </div>
          </div>
          )}


        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3 text-sm">
          {mission.raw?.type !== 'HIRE_DRIVER' && (
            <button
              onClick={() => setIsProofModalOpen(true)}
              className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center justify-center gap-1"
            >
              <Download className="w-4 h-4" /> View Proof
            </button>
          )}

          <button
            onClick={handleDeleteMission}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
          >
            Delete Mission
          </button>

          <button
            onClick={handleOpenForDrivers}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
          >
            Open for Drivers
          </button>
        </div>
      </div>

      <ProofViewerModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        mission={mission}
      />

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        mission={mission}
      />


    </div>
  );
};

