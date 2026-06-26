'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Plus,
  Box,
  Clock,
  CheckCircle2,
  ArrowRight,
  Truck,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function DashboardHome() {
  const { t } = useTranslation();
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

            if (req.status === 'PENDING_ADMIN_QUOTE' || req.status === 'ADMIN_REVIEWING_DRIVERS') {
               status = 'Pending';
               statusColor = 'bg-amber-50 text-amber-600 hover:bg-amber-50';
            } else if (req.status === 'CUSTOMER_REVIEWING_QUOTE') {
               status = 'PendingReview';
               statusColor = 'bg-blue-50 text-blue-600 hover:bg-blue-50';
            } else if (req.status === 'OPEN_FOR_DRIVERS') {
               status = 'Active';
               statusColor = 'bg-brand-blue-light text-brand-blue hover:bg-brand-blue-light';
            } else if (req.status === 'ASSIGNED' || req.status === 'IN_PROGRESS') {
               status = 'Active';
               statusColor = 'bg-brand-blue-light text-brand-blue hover:bg-brand-blue-light';
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

            let routeStr = fromStr !== 'N/A' && toStr !== 'N/A' 
              ? `${fromStr} → ${toStr}` 
              : (fromStr !== 'N/A' ? fromStr : (toStr !== 'N/A' ? toStr : 'N/A'));

            return {
              id: req.missionId || `#REQ-${req._id.slice(-5).toUpperCase()}`,
              realId: req._id,
              vehicle: vehicleStr,
              plate: plateStr,
              from: fromStr,
              to: toStr,
              route: routeStr,
              date: new Date(req.createdAt).toLocaleDateString(),
              status,
              statusColor,
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
  }, []);

  const activeCount = initialOrders.filter(o => o.status === 'Active').length;
  const pendingCount = initialOrders.filter(o => o.status === 'Pending' || o.status === 'PendingReview').length;
  const completedCount = initialOrders.filter(o => o.status === 'Completed').length;

  const stats = [
    {
      title: t.dashboard.active,
      count: activeCount,
      icon: Box,
      iconColor: 'text-brand-blue',
      bgColor: 'bg-brand-blue-light',
      tabParam: 'active',
    },
    {
      title: t.dashboard.pending,
      count: pendingCount,
      icon: Clock,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
      tabParam: 'pending',
    },
    {
      title: t.dashboard.completed,
      count: completedCount,
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      tabParam: 'completed',
    },
  ];

  // Get most recent active order for the Active Delivery Section
  const activeDelivery = initialOrders.find(o => o.status === 'Active');
  
  // Get top 3 recent orders
  const recentOrders = initialOrders.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-[1400px] mx-auto min-h-screen pb-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-400 to-brand-blue p-6 sm:p-8 md:p-10 text-white shadow-xl shadow-blue-200/50">
        <div className="relative z-10 space-y-4 md:space-y-6 max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t.dashboard.heroTitle}</h2>
          <p className="text-blue-50 text-base sm:text-lg font-medium opacity-90 leading-relaxed">
            {t.dashboard.heroSubtitle}
          </p>
          <Link href="/dashboard/create-request" className="w-full sm:w-auto">
            <Button className="bg-white text-brand-blue hover:bg-blue-50 rounded-2xl px-6 sm:px-8 h-12 text-md font-bold transition-all duration-200 w-full sm:w-auto">
              <Plus className="mr-2 h-5 w-5" />
              {t.common.startRequest}
            </Button>
          </Link>
        </div>
        <div className="absolute right-[-50px] top-[-50px] h-64 w-64 rounded-full bg-white/10 blur-3xl hidden sm:block" />
        <div className="absolute right-[10%] bottom-[-30px] h-40 w-40 rounded-full bg-white/10 hidden md:block" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <Link key={i} href={`/dashboard/orders?tab=${stat.tabParam}`} className="block">
            <Card className="p-6 md:p-8 rounded-3xl border-none shadow-sm hover:shadow-md hover:scale-[1.02] cursor-pointer transition-all duration-200 flex items-center gap-4 sm:gap-6 bg-white">
              <div className={`p-3 sm:p-4 rounded-2xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.iconColor}`} />
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                <p className="text-3xl sm:text-4xl font-black text-brand-text">{stat.count}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Active Delivery Section */}
      {activeDelivery && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-brand-text">{t.dashboard.activeDelivery}</h3>
          </div>
          <Card className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
              <div className="space-y-4 sm:space-y-6 flex-1">
                <div className="flex items-center gap-3">
                  <p className="text-xs sm:text-sm font-medium text-slate-400">{t.dashboard.orderId} {activeDelivery.id}</p>
                  <Badge className="bg-brand-blue-light text-brand-blue hover:bg-brand-blue-light px-3 py-1 rounded-full text-xs font-bold border-none">
                    {t.dashboard.active}
                  </Badge>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <h4 className="text-2xl sm:text-3xl font-black text-brand-text">{activeDelivery.vehicle}</h4>
                  <p className="text-sm sm:text-md font-bold text-slate-500">{t.dashboard.licensePlate} : {activeDelivery.plate}</p>
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm sm:text-base">
                  {activeDelivery.from !== 'N/A' && <span>{activeDelivery.from}</span>}
                  {activeDelivery.from !== 'N/A' && activeDelivery.to !== 'N/A' && <ArrowRight className="h-4 w-4 text-slate-300" />}
                  {activeDelivery.to !== 'N/A' && <span>{activeDelivery.to}</span>}
                </div>
                <div className="flex items-center gap-2 text-brand-blue font-bold text-xs sm:text-sm bg-brand-blue-light/50 w-fit px-3 sm:px-4 py-2 rounded-xl">
                  <Clock className="h-4 w-4" />
                  <span>{activeDelivery.date}</span>
                </div>
              </div>

              <div className="flex flex-col w-full lg:w-auto items-stretch lg:items-end gap-4 mt-4 lg:mt-0">
                <Link href={`/dashboard/orders/${activeDelivery.realId}`} className="w-full lg:w-auto">
                  <Button className="bg-brand-blue hover:bg-brand-blue-hover text-white rounded-2xl px-6 sm:px-10 h-12 sm:h-14 text-sm sm:text-md font-bold shadow-lg shadow-blue-100 transition-all duration-200 w-full lg:w-auto">
                    {t.common.trackOrder}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Orders Section */}
      {recentOrders.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-brand-text">{t.dashboard.recentOrders}</h3>
            <Link href="/dashboard/orders">
              <Button variant="link" className="text-brand-blue font-bold hover:no-underline text-sm sm:text-base">
                {t.common.viewAll}
              </Button>
            </Link>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {recentOrders.map((order, i) => (
              <Card key={i} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-none shadow-sm bg-white hover:bg-slate-50 transition-colors duration-200 group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 sm:gap-6 flex-1">
                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-brand-blue transition-colors flex-shrink-0">
                      <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-brand-text text-sm sm:text-base">{order.id}</span>
                        <Badge className={`${order.statusColor} border-none px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap`}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs font-bold text-slate-400 truncate">{t.dashboard.licensePlate} : {order.plate}</p>
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter truncate">
                        {order.vehicle} • {order.route}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <span className="text-xs font-bold text-slate-300 sm:block">
                      {order.date}
                    </span>
                    <Link href={`/dashboard/orders/${order.realId}`}>
                      <Button variant="link" className="text-brand-blue font-bold hover:no-underline px-0 text-sm h-auto py-0">
                        {t.common.view}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

