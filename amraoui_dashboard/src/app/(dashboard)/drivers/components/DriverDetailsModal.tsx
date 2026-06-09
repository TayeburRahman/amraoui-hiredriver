"use client";

import React, { useState } from 'react';
import { X, Mail, Phone, FileText, Loader2 } from 'lucide-react';
import { BackendDriver, getDocumentUrl, getProfileImageUrl, mapDriverStatusLabel } from '@/lib/drivers.api';

interface DriverDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: BackendDriver | null;
  onApprove: (id: string) => Promise<void>;
  onDecline: (id: string, reason?: string) => Promise<void>;
  loading?: boolean;
}

export const DriverDetailsModal: React.FC<DriverDetailsModalProps> = ({
  isOpen,
  onClose,
  driver,
  onApprove,
  onDecline,
  loading = false,
}) => {
  const [declineReason, setDeclineReason] = useState("");

  if (!isOpen || !driver) return null;

  const isPending = driver.status === 'pending';
  const docs = [
    { label: 'Driver License', path: driver.license_document },
    { label: 'ID Document', path: driver.id_document },
    { label: 'Contract', path: driver.contract_document },
  ].filter((d) => d.path);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 relative">
          <button onClick={onClose} className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">Driver Profile & Documents</h2>
          <p className="text-xs text-gray-400">Review driver information and verification documents</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          <div className="flex gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center font-bold text-xl text-blue-600 overflow-hidden">
              {driver.profile_image ? (
                <img src={getProfileImageUrl(driver.profile_image) || ''} alt="" className="w-full h-full object-cover" />
              ) : (
                driver.name[0]?.toUpperCase()
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-base">{driver.name}</h3>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                  {mapDriverStatusLabel(driver.status)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs"><Mail className="w-3 h-3" /> {driver.email}</div>
              <div className="flex items-center gap-1 text-gray-500 text-xs"><Phone className="w-3 h-3" /> {driver.phone_number || 'N/A'}</div>
              <p className="text-xs text-gray-500">License: {driver.license_number || 'N/A'} • {driver.vehicle_type || 'N/A'} • {driver.vehicle_plate || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Documents</h3>
            {!driver.documents_submitted ? (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">Driver has not submitted documents yet.</p>
            ) : docs.length === 0 ? (
              <p className="text-sm text-gray-500">No document files found.</p>
            ) : (
              <div className="space-y-3">
                {docs.map((doc) => {
                  const url = getDocumentUrl(doc.path);
                  return (
                    <div key={doc.label} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-gray-900">{doc.label}</span>
                      </div>
                      {url && (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold text-xs hover:underline">
                          View / Download
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {isPending && (
            <div>
              <label className="text-xs font-bold text-gray-700">Decline reason (optional)</label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                rows={3}
                className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Reason shown to the driver if declined..."
              />
            </div>
          )}
        </div>

        {isPending && driver.documents_submitted && (
          <div className="p-6 border-t border-gray-100 flex gap-3 text-sm">
            <button
              disabled={loading}
              onClick={() => onDecline(driver._id, declineReason || undefined)}
              className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Decline Driver
            </button>
            <button
              disabled={loading}
              onClick={() => onApprove(driver._id)}
              className="flex-1 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Approve Driver
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
