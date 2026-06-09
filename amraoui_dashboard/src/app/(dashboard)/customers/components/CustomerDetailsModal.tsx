"use client";

import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  DollarSign,
  Bell,
  ShieldOff,
  ShieldCheck,
  User,
} from 'lucide-react';
import type { ICustomerRecord } from '../page';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: ICustomerRecord | null;
  onBlockToggle?: (id: string, email: string, currentlyBlocked: boolean) => void;
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-blue-500 shrink-0">{icon}</div>
    <div>
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-gray-800 mt-0.5">{value || '—'}</p>
    </div>
  </div>
);

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  customer,
  onBlockToggle,
}) => {
  const [confirming, setConfirming] = useState(false);

  if (!isOpen || !customer) return null;

  const isBlocked = customer.authId?.is_block ?? customer.status === 'deactivate';
  const email = customer.authId?.email || customer.email;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleBlockClick = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setConfirming(false);
    onBlockToggle?.(customer._id, email, isBlocked);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[92vh]">

        {/* Header */}
        <div className="p-6 border-b border-gray-100 relative">
          <button
            onClick={() => { setConfirming(false); onClose(); }}
            className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">Customer Details</h2>
          <p className="text-xs text-gray-400 mt-0.5">Full profile and account information</p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm scrollbar-hide">

          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-xl shrink-0 overflow-hidden border-2 border-blue-200">
              {customer.profile_image ? (
                <img
                  src={customer.profile_image}
                  alt={customer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                customer.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{customer.name}</h3>
              <p className="text-xs text-gray-400">{email}</p>
              <span
                className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  isBlocked
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                }`}
              >
                {isBlocked ? 'Deactivated' : 'Active'}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</p>
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={email} />
            <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={customer.phone_number} />
            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Address" value={customer.address} />
          </div>

          {/* Account Info */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account</p>
            <InfoRow
              icon={<Calendar className="w-4 h-4" />}
              label="Date of Birth"
              value={formatDate(customer.date_of_birth)}
            />
            <InfoRow
              icon={<Calendar className="w-4 h-4" />}
              label="Joined"
              value={formatDate(customer.createdAt || customer.authId?.createdAt)}
            />
            <InfoRow
              icon={<Globe className="w-4 h-4" />}
              label="Language"
              value={customer.language?.toUpperCase()}
            />
            <InfoRow
              icon={<DollarSign className="w-4 h-4" />}
              label="Currency"
              value={customer.currency?.toUpperCase()}
            />
          </div>

          {/* Notification Prefs (read-only) */}
          {customer.notificationPrefs && (
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Notification Preferences
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(customer.notificationPrefs).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${val ? 'bg-green-400' : 'bg-gray-300'}`}
                    />
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Block / Unblock */}
          {onBlockToggle && (
            <div className="pt-1 space-y-2">
              {confirming && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
                  Are you sure you want to <strong>{isBlocked ? 'unblock' : 'block'}</strong> this
                  customer? Click again to confirm.
                </div>
              )}
              <button
                onClick={handleBlockClick}
                className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  isBlocked
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                {isBlocked ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {confirming ? 'Confirm Unblock' : 'Unblock Customer'}
                  </>
                ) : (
                  <>
                    <ShieldOff className="w-3.5 h-3.5" />
                    {confirming ? 'Confirm Block' : 'Block Customer'}
                  </>
                )}
              </button>
              {confirming && (
                <button
                  onClick={() => setConfirming(false)}
                  className="w-full py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
