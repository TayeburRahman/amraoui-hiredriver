"use client";

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Check, Download, Eye, AlertCircle, Clock, Loader2, FileText, Ban } from 'lucide-react';
import {
  BackendDriver,
  getDocumentUrl,
  getProfileImageUrl,
  adminUpdateDocumentStatus,
  adminUpdateNotes,
  adminUploadDocument,
  getDriverById
} from '@/lib/drivers.api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface DriverDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: BackendDriver | null;
  onApprove: (id: string) => Promise<void>;
  onDecline: (id: string, reason?: string) => Promise<void>;
  loading?: boolean;
  refreshDrivers?: () => void;
}

export const DriverDetailsModal: React.FC<DriverDetailsModalProps> = ({
  isOpen,
  onClose,
  driver: initialDriver,
  onApprove,
  onDecline,
  loading = false,
  refreshDrivers,
}) => {
  const [driver, setDriver] = useState<BackendDriver | null>(initialDriver);
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    setDriver(initialDriver);
    setAdminNotes(initialDriver?.admin_notes || "");
  }, [initialDriver]);

  const reloadDriver = async () => {
    if (!driver) return;
    try {
      const updated = await getDriverById(driver._id);
      setDriver(updated);
      setAdminNotes(updated.admin_notes || "");
      if (refreshDrivers) refreshDrivers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (docType: string, status: 'verified' | 'rejected') => {
    if (!driver) return;
    setActionLoading(docType);
    try {
      await adminUpdateDocumentStatus(driver._id, docType, status);
      await reloadDriver();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!driver) return;
    setSavingNotes(true);
    try {
      await adminUpdateNotes(driver._id, adminNotes);
      await reloadDriver();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    if (!driver || !e.target.files?.[0]) return;
    setActionLoading(docType);
    try {
      await adminUploadDocument(driver._id, docType, e.target.files[0]);
      await reloadDriver();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  if (!isOpen || !driver) return null;

  const isPending = driver.status === 'pending';

  // Calculate completeness
  const checks = [
    { label: 'Profile picture uploaded', done: !!driver.profile_image },
    { label: 'Driver license uploaded', done: !!driver.license_document },
    { label: 'ID document uploaded', done: !!driver.id_document },
    { label: 'Contract document uploaded', done: !!driver.contract_document },
    { label: 'Driver license verified', done: driver.license_status === 'verified' },
    { label: 'ID document verified', done: driver.id_status === 'verified' },
    { label: 'Contract document verified', done: driver.contract_status === 'verified' },
    ...(driver.vehicle_carrier_image ? [{ label: 'Vehicle carrier image verified', done: driver.vehicle_carrier_status === 'verified' }] : []),
    ...(driver.dealer_plate_image ? [{ label: 'Dealer plate image verified', done: driver.dealer_plate_status === 'verified' }] : []),
  ];
  const completedChecks = checks.filter(c => c.done).length;
  const progressPercent = Math.round((completedChecks / checks.length) * 100);
  const isAllDocsVerified = checks.filter(c => c.label.includes('verified')).every(c => c.done);

  let experience = 'New';
  if (driver.createdAt) {
    const diffMonths = dayjs().diff(dayjs(driver.createdAt), 'month');
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    if (years > 0) {
      experience = `${years}.${months}yr`;
    } else if (months > 0) {
      experience = `${months}mo`;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gray-50 rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col my-auto max-h-full">
        <div className="p-6 bg-white border-b border-gray-100 rounded-t-3xl flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Driver Profile & Documents</h2>
            <p className="text-sm text-gray-500 mt-1">Review and manage driver information and verification documents</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Header Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 shadow-sm">
            <div className="flex gap-5">
              <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-blue-50/50 flex items-center justify-center font-bold text-3xl text-blue-600 overflow-hidden shrink-0 shadow-sm relative">
                {driver.profile_image ? (
                  <img src={getProfileImageUrl(driver.profile_image) || ''} alt="" className="w-full h-full object-cover" />
                ) : (
                  driver.name?.[0]?.toUpperCase() || 'U'
                )}
                {driver.status === 'approved' && (
                  <div className="absolute bottom-0 right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white font-bold" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-gray-900">{driver.name}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  {driver.status === 'approved' && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200/50">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                  {driver.status === 'pending' && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                      <Clock className="w-3 h-3" /> Pending Review
                    </span>
                  )}
                  {driver.status === 'declined' && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200/50">
                      <Ban className="w-3 h-3" /> Suspended
                    </span>
                  )}
                  <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                    {driver.vehicle_type || 'Available'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col justify-center items-center">
                <span className="text-xl font-bold text-blue-600">{driver.rating || 'N/A'}</span>
                <span className="text-xs text-gray-500 font-medium mt-0.5">Rating</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col justify-center items-center">
                <span className="text-xl font-bold text-blue-600">{driver.totalDeliveries || 0}</span>
                <span className="text-xs text-gray-500 font-medium mt-0.5">Completed</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col justify-center items-center">
                <span className="text-xl font-bold text-green-600">{driver.successRate ?? 0}%</span>
                <span className="text-xs text-gray-500 font-medium mt-0.5">Success Rate</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col justify-center items-center">
                <span className="text-xl font-bold text-gray-700">{experience}</span>
                <span className="text-xs text-gray-500 font-medium mt-0.5">Experience</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Email</span>
              <span className="text-sm font-semibold text-gray-900">{driver.email}</span>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Phone</span>
              <span className="text-sm font-semibold text-gray-900">{driver.phone_number || 'Not provided'}</span>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Region</span>
              <span className="text-sm font-semibold text-gray-900">{driver.address || 'Unknown'}</span>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Created</span>
              <span className="text-sm font-semibold text-gray-900">{dayjs(driver.createdAt).format('MMM D, YYYY')}</span>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Company Name</span>
              <span className="text-sm font-semibold text-gray-900">{driver.company_name || 'Not provided'}</span>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Tax Number Company</span>
              <span className="text-sm font-semibold text-gray-900">{driver.tax_number || 'Not provided'}</span>
            </div>
          </div>

          {/* Document Completeness */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Document Completeness</h3>
              <span className="text-sm font-bold text-blue-600">{completedChecks} of {checks.length} completed</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6 overflow-hidden">
              <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              {checks.map((check, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-600">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${check.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-300'}`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className={check.done ? 'text-gray-900' : 'text-gray-400'}>{check.label}</span>
                </div>
              ))}
            </div>
            {!isAllDocsVerified && (
              <div className="mt-5 bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2 text-amber-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Documents need review before driver approval.</p>
              </div>
            )}
          </div>

          {/* Driver Documents Title */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Driver Documents</h3>
            <p className="text-sm text-gray-500 mb-4">Review and manage required driver documents for verification</p>

            <div className="space-y-4">
              {/* Document Card Template */}
              {[
                { type: 'license_document', title: 'Driver License', val: driver.license_document, status: driver.license_status, icon: FileText, num: driver.license_number, date: driver.createdAt, isImage: false },
                { type: 'id_document', title: 'ID Document', val: driver.id_document, status: driver.id_status, icon: FileText, date: driver.createdAt, isImage: false },
                { type: 'contract_document', title: 'Contract Document', val: driver.contract_document, status: driver.contract_status, icon: FileText, date: driver.createdAt, isImage: false },
                { type: 'vehicle_carrier_image', title: 'Vehicle Carrier Image', val: driver.vehicle_carrier_image, status: driver.vehicle_carrier_status, icon: FileText, date: driver.createdAt, isImage: true },
                { type: 'dealer_plate_image', title: 'Dealer Plate Image', val: driver.dealer_plate_image, status: driver.dealer_plate_status, icon: FileText, date: driver.createdAt, isImage: true },
              ].map(doc => (
                <div key={doc.type} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                        <doc.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{doc.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{doc.val ? doc.val.split('/').pop() : 'Not uploaded'}</p>
                      </div>
                    </div>
                    <div>
                      {doc.status === 'verified' && <span className="bg-green-50 text-green-700 border border-green-200/50 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span>}
                      {doc.status === 'rejected' && <span className="bg-red-50 text-red-700 border border-red-200/50 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5"><Ban className="w-3.5 h-3.5" /> Rejected</span>}
                      {(!doc.status || doc.status === 'pending') && doc.val && <span className="bg-amber-50 text-amber-700 border border-amber-200/50 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Pending</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {(doc as any).num && (
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">License Number</p>
                        <p className="text-sm font-semibold text-gray-900">{(doc as any).num}</p>
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Uploaded Date</p>
                      <p className="text-sm font-semibold text-gray-900">{doc.date ? dayjs(doc.date).format('MMM D, YYYY') : '—'}</p>
                    </div>
                  </div>

                  {/* Inline image preview for image-type docs */}
                  {doc.isImage && doc.val && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 max-h-48 flex items-center justify-center">
                      <img
                        src={getDocumentUrl(doc.val) || ''}
                        alt={doc.title}
                        className="max-h-48 w-auto object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    {doc.val ? (
                      <>
                        {/* Preview — open image in new tab */}
                        <a href={getDocumentUrl(doc.val) || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold transition-colors">
                          <Eye className="w-4 h-4" /> Preview
                        </a>
                        <a href={getDocumentUrl(doc.val) || '#'} download className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition-colors">
                          <Download className="w-4 h-4" /> Download
                        </a>

                        {/* Verify button — shown for all doc types when not already verified */}
                        {doc.status !== 'verified' && (
                          <button
                            onClick={() => handleStatusChange(doc.type, 'verified')}
                            disabled={actionLoading === doc.type}
                            className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-semibold transition-colors ml-auto disabled:opacity-50"
                          >
                            {actionLoading === doc.type ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Verify
                          </button>
                        )}
                        {/* Reject button — shown for all doc types when not already rejected */}
                        {doc.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(doc.type, 'rejected')}
                            disabled={actionLoading === doc.type}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                          >
                            {actionLoading === doc.type ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />} Reject
                          </button>
                        )}
                      </>
                    ) : (
                      /* Only allow upload for document types, not image-only fields */
                      !doc.isImage ? (
                        <div className="flex items-center gap-2 ml-auto">
                          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50">
                            {actionLoading === doc.type ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Upload</span>}
                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.type)} disabled={actionLoading === doc.type} />
                          </label>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Not provided by driver</span>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Admin Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col shadow-sm">
              <h3 className="font-bold text-gray-900 mb-1">Admin Verification Notes</h3>
              <p className="text-xs text-gray-400 mb-4">Internal only — not visible to driver</p>
              <textarea
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                className="w-full flex-1 min-h-[120px] p-4 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none mb-4"
                placeholder="Add verification note for this driver..."
              />
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes || adminNotes === driver.admin_notes}
                className="w-full py-2.5 bg-[#00C2FF] hover:bg-blue-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {savingNotes && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Note
              </button>
            </div>

            {/* Document Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-[300px] md:h-auto">
              <h3 className="font-bold text-gray-900 mb-4">Document Activity</h3>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {driver.document_activity && driver.document_activity.length > 0 ? (
                  driver.document_activity.map((act, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        {i !== driver.document_activity!.length - 1 && <div className="w-px h-8 bg-gray-100 my-1"></div>}
                      </div>
                      <div className="pt-1.5 pb-2">
                        <p className="text-sm font-bold text-gray-900 leading-none mb-1">{act.message}</p>
                        <p className="text-xs text-gray-500">by {act.by} • {dayjs(act.date).fromNow()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-4">No recent activity.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-100 rounded-b-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-start gap-2 text-amber-600">
            {!isAllDocsVerified && (
              <>
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div className="text-sm">
                  <span className="font-bold block">Documents Incomplete</span>
                  <span className="text-gray-500">All required documents must be verified before approval</span>
                </div>
              </>
            )}
          </div>
          <div className="flex w-full sm:w-auto gap-3">
            <button
              onClick={() => onDecline(driver._id)}
              disabled={loading || driver.status === 'declined'}
              className="flex-1 sm:flex-none px-6 py-2.5 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              Suspend Driver
            </button>
            <button
              onClick={() => onApprove(driver._id)}
              disabled={loading || !isAllDocsVerified || driver.status === 'approved'}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#87E0F5] hover:bg-[#6bd6f0] text-gray-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Approve Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
