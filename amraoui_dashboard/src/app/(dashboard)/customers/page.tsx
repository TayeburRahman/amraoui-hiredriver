"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { Pagination } from '../mission-monitoring/components/Pagination';
import { CustomerDetailsModal } from './components/CustomerDetailsModal';
import { CustomerEditModal } from './components/CustomerEditModal';
import { Search, Users, RefreshCw, UserPlus, X, CheckCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/dateUtils';

// ─── Types ────────────────────────────────────────────
export interface ICustomerRecord {
  _id: string;
  name: string;
  family_name?: string;
  company?: string;
  tax_number?: string;
  message?: string;
  email: string;
  phone_number?: string | null;
  address?: string | null;
  profile_image?: string | null;
  date_of_birth?: string;
  status: 'pending' | 'active' | 'deactivate';
  language?: string;
  currency?: string;
  createdAt?: string;
  notificationPrefs?: {
    orderUpdates: boolean;
    emailNotifs: boolean;
    smsNotifs: boolean;
    deliveryReminders: boolean;
    promoOffers: boolean;
  };
  authId?: {
    _id: string;
    email: string;
    name: string;
    isActive?: boolean;
    is_block?: boolean;
    createdAt?: string;
  };
}

interface Meta {
  total: number;
  page: number;
  limit: number;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://amraoui-hiredriver-backends.vercel.app';
const LIMIT = 10;

const tabs = ['All Customers', 'Pending', 'Active', 'Deactivated'];

// ─── Skeleton Row ─────────────────────────────────────
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-4 bg-gray-100 rounded-md w-3/4" />
      </td>
    ))}
  </tr>
);

// ─── Create Customer Modal ─────────────────────────────
const CreateCustomerModal = ({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [form, setForm] = useState({
    name: '', family_name: '', company: '', tax_number: '',
    phone_number: '', email: '', password: '', message: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token') || '';
      const formData = new FormData();
      formData.append('data', JSON.stringify({ ...form, confirmPassword: form.password }));
      if (imageFile) {
        formData.append('profile_image', imageFile);
      }

      const res = await fetch(`${BACKEND_URL}/api/v1/admin/customers`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to create customer');
      onSuccess();
      onClose();
      setForm({ name: '', family_name: '', company: '', tax_number: '', phone_number: '', email: '', password: '', message: '' });
      setProfileImage(null);
      setImageFile(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-extrabold text-gray-900">Create Customer</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Profile Image Uploader */}
          <div className="flex flex-col items-center justify-center gap-2 pb-2">
            <div className="relative w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border-2 border-gray-200 shadow-sm">
              {profileImage ? (
                <img src={profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <Users className="w-8 h-8 text-blue-400" />
              )}
            </div>
            <label className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer">
              Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">First Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="John"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Family Name *</label>
              <input name="family_name" value={form.family_name} onChange={handleChange} required placeholder="Doe"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Company *</label>
              <input name="company" value={form.company} onChange={handleChange} required placeholder="Company LLC"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Tax Number *</label>
              <input name="tax_number" value={form.tax_number} onChange={handleChange} required placeholder="TAX-123456"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Email *</label>
              <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="john@example.com"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 mb-1 block">Phone Number</label>
              <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="+1234567890"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">Password *</label>
            <input name="password" value={form.password} onChange={handleChange} required type="password" placeholder="••••••••" minLength={6}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">Notes / Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Internal notes..." rows={2}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          {error && (
            <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">⚠ {error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><UserPlus className="w-4 h-4" /> Create Customer</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Page Component ───────────────────────────────────
const CustomersPage = () => {
  const [activeTab, setActiveTab] = useState('All Customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState<ICustomerRecord[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: LIMIT });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomerRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<ICustomerRecord | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Status filter from tab
  const getStatusFilter = () => {
    if (activeTab === 'Active') return 'active';
    if (activeTab === 'Deactivated') return 'deactivate';
    if (activeTab === 'Pending') return 'pending';
    return '';
  };

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token') || '';
      const statusParam = getStatusFilter();
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(LIMIT),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(statusParam ? { status: statusParam } : {}),
      });

      const res = await fetch(`${BACKEND_URL}/api/v1/admin/customers?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const json = await res.json();
      const data = json.data;
      setCustomers(data.customers || []);
      setMeta(data.meta || { total: 0, page: 1, limit: LIMIT });
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, activeTab]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Update selectedCustomer if it gets updated in the fetched list (e.g., after adding a sub-login)
  useEffect(() => {
    if (selectedCustomer) {
      const updated = customers.find(c => c._id === selectedCustomer._id);
      if (updated) {
        setSelectedCustomer(updated);
      }
    }
  }, [customers]);

  const totalPages = Math.max(1, Math.ceil(meta.total / LIMIT));

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleViewCustomer = (customer: ICustomerRecord) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleBlockToggle = async (customerId: string, email: string, currentlyBlocked: boolean) => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token') || '';
      await fetch(`${BACKEND_URL}/api/v1/auth/block-unblock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ role: 'customers', email, is_block: !currentlyBlocked }),
      });
      fetchCustomers();
      setIsModalOpen(false);
    } catch {
      // silently fail
    }
  };

  const handleApprove = async (customerId: string) => {
    setApprovingId(customerId);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token') || '';
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/customers/${customerId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Approval failed');
      fetchCustomers();
    } catch {
      // silently fail
    } finally {
      setApprovingId(null);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) return;
    setIsDeletingId(customerId);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token') || '';
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchCustomers();
    } catch {
      // silently fail
    } finally {
      setIsDeletingId(null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return formatDate(dateStr);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <StatusBadge status="Active" variant="success" />;
    if (status === 'pending') return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600 border border-orange-200">
        ● Pending
      </span>
    );
    return <StatusBadge status="Deactivated" variant="error" />;
  };

  return (
    <div className="overflow-auto pb-12 min-h-screen bg-[#F8F9FA] px-2 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="mb-6 pt-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-500" />
            Customers
          </h1>
          <p className="text-sm text-gray-500">
            Manage registered customers, approve pending accounts, and control access.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCustomers}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Create Customer
          </button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Total Customers</p>
          <p className="text-2xl font-extrabold text-gray-900">{meta.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Showing</p>
          <p className="text-2xl font-extrabold text-blue-600">{customers.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 mb-1">Page</p>
          <p className="text-2xl font-extrabold text-gray-900">{currentPage} / {totalPages}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 w-full max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center justify-between">
          <span>⚠ {error}</span>
          <button onClick={fetchCustomers} className="font-semibold underline text-red-700 text-xs">Retry</button>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-2 sm:p-5">
        {/* Tabs */}
        <SegmentedTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Table */}
        <div className="w-full overflow-x-auto mt-2 rounded-xl border border-gray-100">
          <table className="w-full min-w-[1000px] text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-[13px] text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="px-5 py-4">Customer Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Company</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                : customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className={`hover:bg-gray-50/50 transition-colors ${customer.status === 'pending' ? 'bg-orange-50/30' : 'bg-white'}`}
                  >
                    {/* Avatar + Name */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0 overflow-hidden">
                          {customer.profile_image ? (
                            <img src={customer.profile_image} alt={customer.name} className="w-full h-full object-cover" />
                          ) : (
                            customer.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900">{customer.name} {customer.family_name || ''}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-500">{customer.email}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-500">{customer.company || '—'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-500">{customer.phone_number || '—'}</td>
                    <td className="px-5 py-4 whitespace-nowrap">{getStatusBadge(customer.status)}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-400 text-xs">
                      {formatDate(customer.createdAt || customer.authId?.createdAt)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {customer.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(customer._id)}
                            disabled={approvingId === customer._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-60"
                          >
                            {approvingId === customer._id
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : <CheckCircle className="w-3 h-3" />}
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="text-gray-900 font-bold hover:text-blue-600 transition-colors text-sm"
                          title="View Customer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => { setCustomerToEdit(customer); setIsEditOpen(true); }}
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                          title="Edit Customer"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer._id)}
                          disabled={isDeletingId === customer._id}
                          className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                          title="Delete Customer"
                        >
                          {isDeletingId === customer._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && customers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Users className="w-10 h-10 opacity-30" />
                      <p className="text-sm font-medium">No customers found</p>
                      {debouncedSearch && <p className="text-xs">Try a different search term.</p>}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && customers.length > 0 && (
          <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
        onBlockToggle={handleBlockToggle}
        onRefresh={() => fetchCustomers()}
      />

      {/* Create Customer Modal */}
      <CreateCustomerModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchCustomers}
      />

      <CustomerEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={fetchCustomers}
        customer={customerToEdit}
      />
    </div>
  );
};

export default CustomersPage;