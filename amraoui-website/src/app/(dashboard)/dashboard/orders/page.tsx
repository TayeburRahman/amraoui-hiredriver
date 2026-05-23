'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
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
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const tabQuery = searchParams.get('tab');

  useEffect(() => {
    if (tabQuery === 'active') {
      setActiveTab(t.orders.active);
    } else if (tabQuery === 'completed') {
      setActiveTab(t.orders.completed);
    } else if (tabQuery === 'pending') {
      setActiveTab(t.orders.pending);
    }
  }, [tabQuery, t.orders.active, t.orders.completed, t.orders.pending]);

  const tabs = [
    t.orders.all,
    t.orders.active,
    t.orders.completed,
    t.orders.cancelled,
    t.orders.pending
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

  // Expanded mock data to demonstrate pagination
  const initialOrders: Order[] = [
    { id: '#VQ-20458', vehicle: 'BMW X5', plate: 'AB-123-CD', from: 'Paris', to: 'Lyon', date: 'May 2, 2026', status: 'Active', statusColor: 'bg-brand-blue-light text-brand-blue hover:bg-brand-blue-light', actionText: t.orders.track },
    { id: '#VQ-20412', vehicle: 'Audi A4', plate: 'XY-456-EF', from: 'Marseille', to: 'Nice', date: 'Apr 28, 2026', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50', actionText: t.orders.view },
    { id: '#VQ-20389', vehicle: 'Mercedes C-Class', plate: 'CD-789-GH', from: 'Paris', to: 'Lille', date: 'Apr 25, 2026', status: 'Pending', statusColor: 'bg-amber-50 text-amber-600 hover:bg-amber-50', actionText: t.orders.view },
    { id: '#VQ-20388', vehicle: 'Mercedes C-Class', plate: 'CD-789-GH', from: 'Paris', to: 'Lille', date: 'Apr 25, 2026', status: 'PendingReview', statusColor: 'bg-blue-50 text-blue-600 hover:bg-blue-50', actionText: t.orders.view },
    { id: '#VQ-20340', vehicle: 'Renault Clio', plate: 'IJ-012-KL', from: 'Lyon', to: 'Bordeaux', date: 'Apr 20, 2026', status: 'Cancelled', statusColor: 'bg-red-50 text-red-600 hover:bg-red-50', actionText: t.orders.view },
    { id: '#VQ-20339', vehicle: 'Tesla Model 3', plate: 'TE-5LA-EV', from: 'Berlin', to: 'Munich', date: 'Apr 18, 2026', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50', actionText: t.orders.view },
    { id: '#VQ-20338', vehicle: 'Porsche 911', plate: 'PO-911-RS', from: 'Stuttgart', to: 'Frankfurt', date: 'Apr 17, 2026', status: 'Active', statusColor: 'bg-brand-blue-light text-brand-blue hover:bg-brand-blue-light', actionText: t.orders.track },
    { id: '#VQ-20337', vehicle: 'Volkswagen Golf', plate: 'VW-123-GO', from: 'Hamburg', to: 'Bremen', date: 'Apr 15, 2026', status: 'Pending', statusColor: 'bg-amber-50 text-amber-600 hover:bg-amber-50', actionText: t.orders.view },
    { id: '#VQ-20336', vehicle: 'Audi Q7', plate: 'AQ-777-ZZ', from: 'Vienna', to: 'Salzburg', date: 'Apr 14, 2026', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50', actionText: t.orders.view },
    { id: '#VQ-20335', vehicle: 'Ford Mustang', plate: 'FM-555-GT', from: 'Madrid', to: 'Barcelona', date: 'Apr 12, 2026', status: 'Cancelled', statusColor: 'bg-red-50 text-red-600 hover:bg-red-50', actionText: t.orders.view },
    { id: '#VQ-20334', vehicle: 'Fiat 500', plate: 'FI-500-IT', from: 'Rome', to: 'Milan', date: 'Apr 10, 2026', status: 'PendingReview', statusColor: 'bg-blue-50 text-blue-600 hover:bg-blue-50', actionText: t.orders.view },
    { id: '#VQ-20333', vehicle: 'Volvo XC90', plate: 'VO-999-XC', from: 'Stockholm', to: 'Gothenburg', date: 'Apr 08, 2026', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50', actionText: t.orders.view },
  ];

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
      const isAll = activeTab === 'All' || activeTab === t.orders.all;
      const matchTab = isAll ||
        getStatusText(order.status) === activeTab ||
        (activeTab === t.orders.pending && order.status === 'PendingReview');

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
  }, [activeTab, searchQuery, t.orders]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset page on filter
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset page on search
  };

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
            const isActive = activeTab === tab || (activeTab === 'All' && tab === t.orders.all);
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${isActive
                  ? 'bg-brand-blue text-white shadow-md shadow-blue-200'
                  : 'text-slate-500 hover:bg-slate-100 bg-slate-50'
                  }`}
              >
                {tab}
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
                      {order.status === 'PendingReview' || order.status === 'Pending' ? (
                        <OfferReceivedModal>
                          <Button variant="link" className="text-brand-blue font-bold px-0 h-auto hover:no-underline">
                            {order.actionText}
                          </Button>
                        </OfferReceivedModal>
                      ) : (
                        <Link href={`/dashboard/orders/${order.id.replace('#', '')}`}>
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
