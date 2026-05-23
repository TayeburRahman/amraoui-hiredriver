'use client';

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

export default function DashboardHome() {
  const { t } = useTranslation();

  const stats = [
    {
      title: t.dashboard.active,
      count: 3,
      icon: Box,
      iconColor: 'text-brand-blue',
      bgColor: 'bg-brand-blue-light',
      tabParam: 'active',
    },
    {
      title: t.dashboard.pending,
      count: 2,
      icon: Clock,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
      tabParam: 'pending',
    },
    {
      title: t.dashboard.completed,
      count: 15,
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      tabParam: 'completed',
    },
  ];

  const recentOrders = [
    {
      id: '#VQ-20458',
      status: 'In Transit',
      statusColor: 'bg-brand-blue-light text-brand-blue',
      vehicle: 'BMW X5',
      plate: '1-ABC-234',
      route: 'Paris → Lyon',
      date: 'May 2, 2026',
    },
    {
      id: '#VQ-20458',
      status: 'Completed',
      statusColor: 'bg-emerald-50 text-emerald-600',
      vehicle: 'Audi A4',
      plate: '1-ABC-234',
      route: 'Marseille → Nice',
      date: 'May 2, 2026',
    },
    {
      id: '#VQ-20458',
      status: 'Pending',
      statusColor: 'bg-amber-50 text-amber-600',
      vehicle: 'Mercedes C-Class',
      plate: '1-ABC-234',
      route: 'Paris → Lille',
      date: 'May 2, 2026',
    },
  ];

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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-brand-text">{t.dashboard.activeDelivery}</h3>
        </div>
        <Card className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-4 sm:space-y-6 flex-1">
              <div className="flex items-center gap-3">
                <p className="text-xs sm:text-sm font-medium text-slate-400">{t.dashboard.orderId} #VQ-20458</p>
                <Badge className="bg-brand-blue-light text-brand-blue hover:bg-brand-blue-light px-3 py-1 rounded-full text-xs font-bold border-none">
                  {t.dashboard.active}
                </Badge>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <h4 className="text-2xl sm:text-3xl font-black text-brand-text">BMW X5</h4>
                <p className="text-sm sm:text-md font-bold text-slate-500">{t.dashboard.licensePlate} : 1-ABC-234</p>
              </div>
              <div className="flex items-center gap-3 text-slate-500 font-bold text-sm sm:text-base">
                <span>Paris</span>
                <ArrowRight className="h-4 w-4 text-slate-300" />
                <span>Lyon</span>
              </div>
              <div className="flex items-center gap-2 text-brand-blue font-bold text-xs sm:text-sm bg-brand-blue-light/50 w-fit px-3 sm:px-4 py-2 rounded-xl">
                <Clock className="h-4 w-4" />
                <span>{t.dashboard.eta}: {t.dashboard.today} 6:30 PM</span>
              </div>
            </div>

            <div className="flex flex-col w-full lg:w-auto items-stretch lg:items-end gap-4 mt-4 lg:mt-0">
              <Link href="/dashboard/orders/VQ-20458" className="w-full lg:w-auto">
                <Button className="bg-brand-blue hover:bg-brand-blue-hover text-white rounded-2xl px-6 sm:px-10 h-12 sm:h-14 text-sm sm:text-md font-bold shadow-lg shadow-blue-100 transition-all duration-200 w-full lg:w-auto">
                  {t.common.trackOrder}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders Section */}
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
                  <Button variant="link" className="text-brand-blue font-bold hover:no-underline px-0 text-sm h-auto py-0">
                    {t.common.view}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
