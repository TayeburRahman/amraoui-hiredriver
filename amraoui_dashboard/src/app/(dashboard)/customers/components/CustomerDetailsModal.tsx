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
  onBlockToggle?: (id: string, email: string, currentlyBlocked: boolean) => void;
  onRefresh?: () => void;
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
  onRefresh,
}) => {
  const [confirming, setConfirming] = useState(false);
  const [showAddLogin, setShowAddLogin] = useState(false);
  const [subLoginName, setSubLoginName] = useState('');
  const [subLoginEmail, setSubLoginEmail] = useState('');
  const [subLoginPassword, setSubLoginPassword] = useState('');
  const [addingLogin, setAddingLogin] = useState(false);
  const [editingLoginId, setEditingLoginId] = useState<string | null>(null);
  const [editLoginName, setEditLoginName] = useState('');
  const [editLoginEmail, setEditLoginEmail] = useState('');
  const [editLoginPassword, setEditLoginPassword] = useState('');

  if (!isOpen || !customer) return null;

  const handleAddLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subLoginName || !subLoginEmail || !subLoginPassword) return;

    setAddingLogin(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token') || '';
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/customers/${customer._id}/add-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: subLoginName,
          email: subLoginEmail,
          password: subLoginPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add login');

      setSubLoginName('');
      setSubLoginEmail('');
      setSubLoginPassword('');
      setShowAddLogin(false);
      onRefresh?.();
    } catch (err: any) {
      alert(err.message || 'Error adding login');
    } finally {
      setAddingLogin(false);
    }
  };

  const handleUpdateLogin = async (e: React.FormEvent, authId: string) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token') || '';
      const payload: any = {};
      if (editLoginName) payload.name = editLoginName;
      if (editLoginEmail) payload.email = editLoginEmail;
      if (editLoginPassword) payload.password = editLoginPassword;

      if (Object.keys(payload).length === 0) {
        setEditingLoginId(null);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/customers/${customer._id}/sub-login/${authId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update login');

      setEditingLoginId(null);
      setEditLoginName('');
      setEditLoginEmail('');
      setEditLoginPassword('');
      onRefresh?.();
    } catch (err: any) {
      alert(err.message || 'Error updating login');
    }
  };

  const handleDeleteLogin = async (authId: string) => {
    if (!confirm('Are you sure you want to delete this sub-login?')) return;
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token') || '';
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/customers/${customer._id}/sub-login/${authId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete login');

      onRefresh?.();
    } catch (err: any) {
      alert(err.message || 'Error deleting login');
    }
  };

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

          {/* Logins / Access */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Logins / Access</p>
              <button 
                onClick={() => setShowAddLogin(!showAddLogin)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                {showAddLogin ? 'Cancel' : '+ Add Login'}
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                <div>
                  <p className="text-xs font-semibold text-gray-800">{customer.authId?.name || customer.name} <span className="ml-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">Primary</span></p>
                  <p className="text-[11px] text-gray-500">{email}</p>
                </div>
                <div className="text-[10px] text-gray-400">Created: {formatDate(customer.authId?.createdAt)}</div>
              </div>

              {(customer as any).linkedAuthIds?.map((auth: any) => (
                <div key={auth._id} className="bg-white p-3 rounded-lg border border-gray-100 space-y-2">
                  {editingLoginId === auth._id ? (
                    <form onSubmit={(e) => handleUpdateLogin(e, auth._id)} className="space-y-2">
                      <input
                        type="text"
                        value={editLoginName}
                        onChange={(e) => setEditLoginName(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="New Name (Optional)"
                      />
                      <input
                        type="email"
                        value={editLoginEmail}
                        onChange={(e) => setEditLoginEmail(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="New Email (Optional)"
                      />
                      <input
                        type="password"
                        value={editLoginPassword}
                        onChange={(e) => setEditLoginPassword(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="New Password (Optional)"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="text-xs font-bold text-white bg-blue-600 px-2 py-1 rounded hover:bg-blue-700">Save</button>
                        <button type="button" onClick={() => setEditingLoginId(null)} className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{auth.name}</p>
                        <p className="text-[11px] text-gray-500">{auth.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-[10px] text-gray-400">Created: {formatDate(auth.createdAt)}</div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingLoginId(auth._id);
                              setEditLoginName(auth.name);
                              setEditLoginEmail(auth.email);
                              setEditLoginPassword('');
                            }}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLogin(auth._id)}
                            className="text-[10px] font-bold text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {showAddLogin && (
              <form onSubmit={handleAddLogin} className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm space-y-3 mt-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Create New Sub-Login</p>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Name</label>
                  <input
                    type="text"
                    required
                    value={subLoginName}
                    onChange={(e) => setSubLoginName(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Sub-user name"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Email</label>
                  <input
                    type="email"
                    required
                    value={subLoginEmail}
                    onChange={(e) => setSubLoginEmail(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="login@company.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Password</label>
                  <input
                    type="password"
                    required
                    value={subLoginPassword}
                    onChange={(e) => setSubLoginPassword(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={addingLogin}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {addingLogin ? 'Adding...' : 'Add Sub-Login'}
                </button>
              </form>
            )}
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
