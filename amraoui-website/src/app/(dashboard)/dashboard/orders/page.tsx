'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, ArrowRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { OfferReceivedModal } from '@/components/orders/offer-received-modal';

type OrderStatus = 'Active' | 'Completed' | 'Pending' | 'Cancelled' | 'PendingReview';

interface Order {
  id: string;
  vehicle: string;
  plate: string;
  from: string;
  to: string;
  date: string;
  status: OrderStatus;
  statusColor: string;
  actionText: string;
}

function OrdersPageContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [activeTabId, setActiveTabId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const tabQuery = searchParams.get('tab');

  useEffect(() => {
    if (tabQuery === 'active') {
      setActiveTabId('active');
    } else if (tabQuery === 'completed') {
      setActiveTabId('completed');
    } else if (tabQuery === 'pending') {
      setActiveTabId('pending');
    }
  }, [tabQuery]);

  const tabs = [
    { id: 'all', label: t.orders.all },
    { id: 'active', label: t.orders.active },
    { id: 'completed', label: t.orders.completed },
    { id: 'cancelled', label: t.orders.cancelled },
    { id: 'pending', label: t.orders.pending }
  ];

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'Active': return t.orders.active;
      case 'Completed': return t.orders.completed;
      case 'Pending': return t.orders.pending;
      case 'Cancelled': return t.orders.cancelled;
      case 'PendingReview': return t.orders.pendingReview;
      default: return status;
    }
  };

  const [initialOrders, setInitialOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/requests');
        if (res.data?.success) {
          const mapped = res.data.data.map((req: any) => {
            let status = 'Pending';
            let statusColor = 'bg-amber-50 text-amber-600 hover:bg-amber-50';
            let actionText = t.orders.view;

            if (req.status === 'PENDING_ADMIN_QUOTE' || req.status === 'ADMIN_REVIEWING_DRIVERS') {
               status = 'Pending';
            } else if (req.status === 'CUSTOMER_REVIEWING_QUOTE') {
               status = 'PendingReview';
               statusColor = 'bg-blue-50 text-blue-600 hover:bg-blue-50';
            } else if (req.status === 'OPEN_FOR_DRIVERS') {
               status = 'Active';
               statusColor = 'bg-brand-blue-light text-brand-blue hover:bg-brand-blue-light';
               actionText = t.orders.track;
            } else if (req.status === 'ASSIGNED' || req.status === 'IN_PROGRESS') {
               status = 'Active';
               statusColor = 'bg-brand-blue-light text-brand-blue hover:bg-brand-blue-light';
               actionText = t.orders.track;
            } else if (req.status === 'COMPLETED') {
               status = 'Completed';
               statusColor = 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50';
            } else if (req.status === 'REJECTED_BY_CUSTOMER' || req.status === 'CANCELLED') {
               status = 'Cancelled';
               statusColor = 'bg-red-50 text-red-600 hover:bg-red-50';
            }

            let vehicleStr = "Vehicle";
            let plateStr = "N/A";
            let fromStr = "N/A";
            let toStr = "N/A";

            if (req.type === 'TRANSPORT') {
              vehicleStr = `${req.details?.make || ''} ${req.details?.model || ''}`.trim() || 'Transport';
              plateStr = req.details?.plate || 'N/A';
              fromStr = req.details?.pickupCity || req.details?.pickupAddress || 'N/A';
              toStr = req.details?.dropoffCity || req.details?.dropoffAddress || 'N/A';
            } else if (req.type === 'HIRE_DRIVER') {
              vehicleStr = `Driver Request (${req.details?.driverCount || 1})`;
              fromStr = req.details?.driverCity || 'N/A';
            } else if (req.type === 'INSPECTION') {
              vehicleStr = `${req.details?.vehicleBrand || ''} ${req.details?.vehicleModel || ''}`.trim() || 'Inspection';
              plateStr = req.details?.licensePlate || 'N/A';
              fromStr = req.details?.inspectionLocation || 'N/A';
            }

            return {
              id: req.missionId || `#REQ-${req._id.slice(-5).toUpperCase()}`,
              realId: req._id,
              vehicle: vehicleStr,
              plate: plateStr,
              from: fromStr,
              to: toStr,
              date: new Date(req.createdAt).toLocaleDateString(),
              status,
              statusColor,
              actionText,
              raw: req
            };
          });
          setInitialOrders(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [t.orders.view, t.orders.track]);

  // Derive stats dynamically from data
  const totalCount = initialOrders.length;
  const activeCount = initialOrders.filter(o => o.status === 'Active').length;
  const completedCount = initialOrders.filter(o => o.status === 'Completed').length;
  const pendingCount = initialOrders.filter(o => o.status === 'Pending' || o.status === 'PendingReview').length;

  const stats = [
    { title: t.orders.totalOrders, count: totalCount, type: 'total' },
    { title: t.orders.active, count: activeCount, type: 'active', color: 'text-brand-blue' },
    { title: t.orders.completed, count: completedCount, type: 'completed', color: 'text-emerald-500' },
    { title: t.orders.pending, count: pendingCount, type: 'pending', color: 'text-amber-500' },
  ];

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      // 1. Filter by tab
      const isAll = activeTabId === 'all';
      const matchTab = isAll || 
        (activeTabId === 'active' && order.status === 'Active') ||
        (activeTabId === 'completed' && order.status === 'Completed') ||
        (activeTabId === 'cancelled' && order.status === 'Cancelled') ||
        (activeTabId === 'pending' && (order.status === 'Pending' || order.status === 'PendingReview'));

      // 2. Filter by search query
      const lowerQuery = searchQuery.toLowerCase();
      const matchSearch =
        order.id.toLowerCase().includes(lowerQuery) ||
        order.vehicle.toLowerCase().includes(lowerQuery) ||
        order.from.toLowerCase().includes(lowerQuery) ||
        order.to.toLowerCase().includes(lowerQuery) ||
        order.plate.toLowerCase().includes(lowerQuery);

      return matchTab && matchSearch;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId, searchQuery, initialOrders]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    setCurrentPage(1); // Reset page on filter
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset page on search
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500 font-medium">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-[1400px] mx-auto min-h-screen pb-12 px-4 sm:px-6 lg:px-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm bg-white flex flex-col justify-center">
            <p className="text-sm font-semibold text-slate-500 mb-2">{stat.title}</p>
            <p className={`text-4xl sm:text-5xl font-black ${stat.color || 'text-brand-text'}`}>{stat.count}</p>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <Card className="p-2 sm:p-3 rounded-full border border-slate-100 shadow-sm bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar px-2">
          {tabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${isActive
                  ? 'bg-brand-blue text-white shadow-md shadow-blue-200'
                  : 'text-slate-500 hover:bg-slate-100 bg-slate-50'
                  }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
        <div className="relative w-full md:max-w-md px-2 md:px-0 md:pr-2">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={t.orders.searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-11 rounded-full border border-slate-200 bg-white h-11 focus-visible:ring-brand-blue focus-visible:border-transparent text-sm font-medium shadow-none"
          />
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="rounded-[2rem] border border-slate-100 shadow-sm bg-white overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-5 px-6 sm:px-8 text-xs font-black text-slate-400 tracking-wider w-[15%]">
                  {t.orders.table.orderId}
                </th>
                <th className="py-5 px-6 sm:px-8 text-xs font-black text-slate-400 tracking-wider w-[25%]">
                  {t.orders.table.vehicle}
                </th>
                <th className="py-5 px-6 sm:px-8 text-xs font-black text-slate-400 tracking-wider w-[25%]">
                  {t.orders.table.route}
                </th>
                <th className="py-5 px-6 sm:px-8 text-xs font-black text-slate-400 tracking-wider w-[15%]">
                  {t.orders.table.date}
                </th>
                <th className="py-5 px-6 sm:px-8 text-xs font-black text-slate-400 tracking-wider w-[10%]">
                  {t.orders.table.status}
                </th>
                <th className="py-5 px-6 sm:px-8 text-xs font-black text-slate-400 tracking-wider w-[10%] text-right">
                  {t.orders.table.action}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentOrders.length > 0 ? (
                currentOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-5 px-6 sm:px-8 align-middle">
                      <span className="font-bold text-brand-blue">{order.id}</span>
                    </td>
                    <td className="py-5 px-6 sm:px-8 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-brand-blue group-hover:bg-white transition-colors">
                          <Truck className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-brand-text text-sm sm:text-base">{order.vehicle}</p>
                          <p className="text-[11px] font-bold text-slate-400 mt-0.5">{order.plate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 sm:px-8 align-middle">
                      <div className="flex items-center gap-2 font-bold text-brand-text text-sm">
                        {order.from}
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                        {order.to}
                      </div>
                    </td>
                    <td className="py-5 px-6 sm:px-8 align-middle">
                      <span className="text-sm font-bold text-slate-500">{order.date}</span>
                    </td>
                    <td className="py-5 px-6 sm:px-8 align-middle">
                      <Badge className={`${order.statusColor} border-none px-3 py-1 rounded-full text-[11px] font-bold`}>
                        {getStatusText(order.status)}
                      </Badge>
                    </td>
                    <td className="py-5 px-6 sm:px-8 align-middle text-right">
                      {order.status === 'PendingReview' ? (
                        <div className="flex items-center justify-end gap-3">
                          <OfferReceivedModal order={order.raw}>
                            <Button variant="link" className="text-brand-blue font-bold px-0 h-auto hover:no-underline">
                              Review Quote
                            </Button>
                          </OfferReceivedModal>
                          <Link href={`/dashboard/orders/${order.realId}`}>
                            <Button variant="outline" size="sm" className="h-8 text-xs font-bold rounded-lg">
                              Details
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <Link href={`/dashboard/orders/${order.realId}`}>
                          <Button variant="link" className="text-brand-blue font-bold px-0 h-auto hover:no-underline">
                            {order.actionText}
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                    No orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/50">
            <span className="text-sm text-slate-500 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 rounded-full border-slate-200 text-slate-500 hover:text-brand-blue hover:border-brand-blue"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded-full text-sm font-bold transition-colors ${currentPage === page
                      ? 'bg-brand-blue text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 rounded-full border-slate-200 text-slate-500 hover:text-brand-blue hover:border-brand-blue"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 md:space-y-8 max-w-[1400px] mx-auto min-h-screen pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-slate-400 font-bold text-lg">Loading orders...</p>
      </div>
    }>
      <OrdersPageContent />
    </Suspense>
  );
}
