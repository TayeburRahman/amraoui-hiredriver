"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { Pagination } from '../mission-monitoring/components/Pagination';
import { DriverDetailsModal } from './components/DriverDetailsModal';
import {
  BackendDriver,
  getDriverById,
  getDrivers,
  mapDriverStatusLabel,
  updateDriverStatus,
} from '@/lib/drivers.api';
import { Loader2 } from 'lucide-react';

const tabs = ["All Drivers", "Pending Approval", "Verified", "Suspended"];

const statusMap: Record<string, string | undefined> = {
  "All Drivers": undefined,
  "Pending Approval": "pending",
  "Verified": "approved",
  "Suspended": "declined",
};

const DriversPage = () => {
  const [activeTab, setActiveTab] = useState("All Drivers");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState<BackendDriver | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drivers, setDrivers] = useState<BackendDriver[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadDrivers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getDrivers({
        status: statusMap[activeTab],
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
      });
      setDrivers(data.drivers);
      const total = data.meta.total;
      setTotalPages(Math.max(1, Math.ceil(total / data.meta.limit)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load drivers");
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, searchQuery]);

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  const openDriver = async (driver: BackendDriver) => {
    try {
      const full = await getDriverById(driver._id);
      setSelectedDriver(full);
      setIsModalOpen(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load driver details");
    }
  };

  const handleApprove = async (driverId: string) => {
    setActionLoading(true);
    try {
      await updateDriverStatus(driverId, "approved");
      setIsModalOpen(false);
      await loadDrivers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to approve driver");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async (driverId: string, reason?: string) => {
    setActionLoading(true);
    try {
      await updateDriverStatus(driverId, "declined", reason);
      setIsModalOpen(false);
      await loadDrivers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to decline driver");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="overflow-auto pb-12 min-h-screen bg-[#F8F9FA] px-2 sm:px-4 lg:px-6">
      <div className="mb-6 pt-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Drivers</h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Manage drivers, review documents, and approve or decline applications.
        </p>
      </div>

      <div className="mb-8 w-full max-w-md relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input
          type="text"
          placeholder="Search drivers..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-2 sm:p-5">
        <SegmentedTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(t) => { setActiveTab(t); setCurrentPage(1); }}
        />

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="w-full overflow-x-auto mt-2 rounded-xl border border-gray-100">
            <table className="w-full min-w-[900px] text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 text-[13px] text-gray-500 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-5 py-4">Driver Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Documents</th>
                  <th className="px-5 py-4">Rating</th>
                  <th className="px-5 py-4">Completed</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {drivers.map((driver) => (
                  <tr key={driver._id} className="hover:bg-gray-50/50 transition-colors bg-white">
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-gray-900">{driver.name}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-500">{driver.email}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-500">{driver.phone_number || '—'}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={mapDriverStatusLabel(driver.status)} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {driver.documents_submitted ? (
                        <span className="text-green-600 font-semibold text-xs">Submitted</span>
                      ) : (
                        <span className="text-amber-600 font-semibold text-xs">Not submitted</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-gray-900">
                      {driver.rating ?? '—'}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-medium text-gray-700">
                      {driver.totalDeliveries ?? 0}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => openDriver(driver)}
                        className="text-gray-900 font-bold hover:text-blue-600 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {drivers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                      No drivers found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {drivers.length > 0 && (
          <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <DriverDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        driver={selectedDriver}
        onApprove={handleApprove}
        onDecline={handleDecline}
        loading={actionLoading}
      />
    </div>
  );
};

export default DriversPage;
