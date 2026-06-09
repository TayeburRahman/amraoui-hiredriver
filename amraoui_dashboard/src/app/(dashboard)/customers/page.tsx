"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { Pagination } from '../mission-monitoring/components/Pagination';
import { CustomerDetailsModal } from './components/CustomerDetailsModal';
import { Search, Users, RefreshCw } from 'lucide-react';

// ─── Types ────────────────────────────────────────────
export interface ICustomerRecord {
  _id: string;
  name: string;
  email: string;
  phone_number?: string | null;
  address?: string | null;
  profile_image?: string | null;
  date_of_birth?: string;
  status: 'active' | 'deactivate';
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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const LIMIT = 10;

const tabs = ['All Customers', 'Active', 'Deactivated'];

// ─── Skeleton Row ─────────────────────────────────────
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-4 bg-gray-100 rounded-md w-3/4" />
      </td>
    ))}
  </tr>
);

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

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

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
        body: JSON.stringify({
          role: 'customers',
          email,
          is_block: !currentlyBlocked,
        }),
      });
      // Refresh after action
      fetchCustomers();
      setIsModalOpen(false);
    } catch {
      // silently fail; user can retry
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className="overflow-auto pb-12 min-h-screen bg-[#F8F9FA] px-2 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="mb-6 pt-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-500" />
            Customers
          </h1>
          <p className="text-sm text-gray-500">
            Manage registered customers, view profiles, and control account status.
          </p>
        </div>
        <button
          onClick={fetchCustomers}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mt-1"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
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
          <button onClick={fetchCustomers} className="font-semibold underline text-red-700 text-xs">
            Retry
          </button>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-2 sm:p-5">

        {/* Tabs */}
        <SegmentedTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Table */}
        <div className="w-full overflow-x-auto mt-2 rounded-xl border border-gray-100">
          <table className="w-full min-w-[900px] text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-[13px] text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="px-5 py-4">Customer Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Address</th>
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
                      className="hover:bg-gray-50/50 transition-colors bg-white"
                    >
                      {/* Avatar + Name */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0 overflow-hidden">
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
                          <span className="font-bold text-gray-900">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-gray-500">
                        {customer.email}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-gray-500">
                        {customer.phone_number || '—'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-gray-500 max-w-[160px] truncate">
                        {customer.address || '—'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={customer.status === 'active' ? 'Active' : 'Deactivated'}
                          variant={customer.status === 'active' ? 'success' : 'error'}
                        />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-gray-400 text-xs">
                        {formatDate(customer.createdAt || customer.authId?.createdAt)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="text-gray-900 font-bold hover:text-blue-600 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}

              {!loading && customers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Users className="w-10 h-10 opacity-30" />
                      <p className="text-sm font-medium">No customers found</p>
                      {debouncedSearch && (
                        <p className="text-xs">Try a different search term.</p>
                      )}
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Details Modal */}
      <CustomerDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
        onBlockToggle={handleBlockToggle}
      />
    </div>
  );
};

export default CustomersPage;