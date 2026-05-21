'use client';

import { use } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle2, 
  Truck, 
  Circle,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useTranslation();
  const orderId = `#${id}`;

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen pb-12 px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      {/* Back Button */}
      <div className="pt-2">
        <Link href="/dashboard/orders" className="inline-flex items-center text-slate-500 hover:text-brand-text font-semibold text-sm transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.orders.details?.backToOrders || 'Back to Orders'}
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* Left Column (Map & Locations) */}
        <div className="flex-1 space-y-6">
          {/* Map Area */}
          <Card className="relative overflow-hidden border-none shadow-sm rounded-[2rem] bg-slate-100 aspect-[4/3] lg:aspect-auto lg:h-[500px] flex items-center justify-center p-4">
            
            {/* Center Map Placeholder Content */}
            <div className="flex flex-col items-center justify-center text-center space-y-3 z-10">
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md text-brand-blue">
                <MapPin className="h-8 w-8" />
              </div>
              <div>
                <p className="font-bold text-slate-500">Interactive map view</p>
                <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-400 mt-1">
                  <span>Paris</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Lyon route</span>
                </div>
              </div>
            </div>

            {/* Top Left - Pickup Pin */}
            <Card className="absolute top-6 left-6 p-3 sm:p-4 rounded-2xl shadow-md border-none bg-white flex flex-col gap-1 z-20">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-400">Pickup</span>
              </div>
              <p className="font-black text-brand-text pl-4.5 text-sm">Paris</p>
            </Card>

            {/* Bottom Right - Delivery Pin */}
            <Card className="absolute bottom-6 right-6 p-3 sm:p-4 rounded-2xl shadow-md border-none bg-white flex flex-col gap-1 z-20">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-brand-blue" />
                <span className="text-xs font-bold text-slate-400">Delivery</span>
              </div>
              <p className="font-black text-brand-text pl-4.5 text-sm">Lyon</p>
            </Card>
          </Card>

          {/* Location Details */}
          <Card className="p-6 sm:p-8 rounded-[2rem] border-none shadow-sm bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-400">
                  {t.orders.details?.pickupLocation || 'Pickup Location'}
                </p>
                <div>
                  <p className="font-black text-brand-text text-lg">123 Rue de Rivoli, Paris</p>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    {t.orders.details?.contact || 'Contact:'} Jean Dupont
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-400">
                  {t.orders.details?.deliveryLocation || 'Delivery Location'}
                </p>
                <div>
                  <p className="font-black text-brand-text text-lg">45 Rue de la République, Lyon</p>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    {t.orders.details?.contact || 'Contact:'} Marie Martin
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (Sidebar Tracking) */}
        <Card className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 p-6 sm:p-8 rounded-[2rem] border-none shadow-sm bg-white flex flex-col">
          <div className="space-y-6">
            
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-black text-brand-text leading-none">Order {orderId}</h1>
                <Badge className="bg-brand-blue-light text-brand-blue hover:bg-brand-blue-light px-3 py-1 rounded-full text-xs font-bold border-none whitespace-nowrap">
                  In Transit
                </Badge>
              </div>
              <p className="text-sm font-bold text-slate-600">BMW X5 • AB-123-CD</p>
              
              <div className="flex items-center gap-2 text-brand-blue text-sm font-bold mt-2">
                <Clock className="h-4 w-4" />
                <span>{t.orders.details?.estimatedArrival || 'Estimated arrival:'} Today, 6:30 PM</span>
              </div>
            </div>

            {/* Driver Card */}
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                  JD
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-0.5">{t.orders.details?.driver || 'Driver'}</p>
                  <p className="font-bold text-brand-text text-sm">James Davis</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">+33 6 12 34 56 78</p>
                </div>
              </div>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-slate-200 text-brand-blue hover:bg-brand-blue-light/50 flex-shrink-0">
                <Phone className="h-4 w-4" />
              </Button>
            </div>

            {/* Status Timeline */}
            <div className="space-y-5 pt-4 pb-4 flex-1">
              <h3 className="font-black text-brand-text text-lg">
                {t.orders.details?.statusTimeline || 'Status Timeline'}
              </h3>
              
              <div className="space-y-0 relative ml-3">
                <div className="absolute top-4 bottom-4 left-[11px] w-0.5 bg-slate-100 z-0"></div>
                
                {/* Step 1 */}
                <div className="flex gap-4 relative z-10 pb-6">
                  <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-text text-sm">{t.orders.details?.timeline?.requestSubmitted || 'Request submitted'}</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">May 1, 2026 9:30 AM</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 relative z-10 pb-6">
                  <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-text text-sm">{t.orders.details?.timeline?.driverAssigned || 'Driver assigned'}</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">May 1, 2026 10:15 AM</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 relative z-10 pb-6">
                  <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-text text-sm">{t.orders.details?.timeline?.pickupInProgress || 'Pickup in progress'}</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">May 1, 2026 11:30 AM</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4 relative z-10 pb-6">
                  <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-text text-sm">{t.orders.details?.timeline?.vehiclePickedUp || 'Vehicle picked up'}</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">May 1, 2026 11:45 AM</p>
                  </div>
                </div>

                {/* Step 5 (Current) */}
                <div className="flex gap-4 relative z-10 pb-6">
                  <div className="h-6 w-6 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm shadow-brand-blue/30">
                    <Truck className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-blue text-sm">{t.orders.details?.timeline?.inTransit || 'In transit'}</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">May 1, 2026 12:00 PM</p>
                  </div>
                </div>

                {/* Step 6 (Future) */}
                <div className="flex gap-4 relative z-10 pb-6">
                  <div className="h-6 w-6 rounded-full bg-white border-2 border-slate-200 text-transparent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Circle className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-400 text-sm">{t.orders.details?.timeline?.arrived || 'Arrived at delivery location'}</p>
                  </div>
                </div>

                {/* Step 7 (Future) */}
                <div className="flex gap-4 relative z-10 pb-6">
                  <div className="h-6 w-6 rounded-full bg-white border-2 border-slate-200 text-transparent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Circle className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-400 text-sm">{t.orders.details?.timeline?.inspection || 'Delivery inspection'}</p>
                  </div>
                </div>

                {/* Step 8 (Future) */}
                <div className="flex gap-4 relative z-10">
                  <div className="h-6 w-6 rounded-full bg-white border-2 border-slate-200 text-transparent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Circle className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-400 text-sm">{t.orders.details?.timeline?.completed || 'Completed'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link href={`/dashboard/orders/${id.replace('#', '')}/details`} className="block">
                <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 text-brand-text font-bold hover:bg-slate-50 transition-colors">
                  View Order Details
                </Button>
              </Link>
              <Link href={`/dashboard/orders/${id.replace('#', '')}/report`} className="block">
                <Button className="w-full h-12 rounded-2xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold transition-colors shadow-md shadow-blue-100">
                  View Delivery Report
                </Button>
              </Link>
            </div>
            
          </div>
        </Card>
        
      </div>
    </div>
  );
}
