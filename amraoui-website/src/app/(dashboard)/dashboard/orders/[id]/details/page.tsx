'use client';

import { use } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Building2, 
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function OrderDetailsReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useTranslation();
  const orderId = `#${id}`;

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen pb-12 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-text leading-tight">{t.orders.report?.title || 'Order Details'}</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">{orderId}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Card 1: Overview */}
        <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-brand-text">BMW X5</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">AB-123-CD</p>
            </div>
            <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border-none">
              Completed
            </Badge>
          </div>
          
          <div className="mt-10 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center">
                <MapPin className="h-3.5 w-3.5 text-brand-blue" />
              </div>
              <span className="text-sm font-bold text-brand-text">Paris</span>
            </div>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-brand-blue/30 via-brand-blue/10 to-emerald-500/30 mx-2 rounded-full" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              <span className="text-sm font-bold text-brand-text">Lyon</span>
            </div>
          </div>
          <div className="mt-8 text-center">
             <p className="text-xs font-bold text-slate-400">22 Apr 2026</p>
          </div>
        </Card>

        {/* Card 2: Pickup Information */}
        <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white flex flex-col justify-center space-y-4">
          <h3 className="font-bold text-brand-text text-lg">{t.orders.report?.pickupInfo || 'Pickup Information'}</h3>
          <div>
            <p className="text-sm font-bold text-slate-700">15 Avenue des Champs-Élysées</p>
            <p className="text-sm font-medium text-slate-500 mt-1">75008 Paris, France</p>
          </div>
          <div className="pt-2">
            <p className="text-xs font-medium text-slate-400">Contact: <span className="font-semibold text-slate-500">Pierre Dubois</span></p>
            <p className="text-xs font-medium text-slate-400 mt-1">Phone: <span className="font-semibold text-slate-500">+33 6 23 45 67 89</span></p>
          </div>
        </Card>

        {/* Card 3: Customer Information */}
        <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-6">
          <h3 className="font-bold text-brand-text text-lg">{t.orders.report?.customerInfo || 'Customer Information'}</h3>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-0.5">{t.orders.report?.email || 'Email'}</p>
                <p className="text-sm font-bold text-brand-text">john.smith@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-0.5">{t.orders.report?.phone || 'Phone'}</p>
                <p className="text-sm font-bold text-brand-text">+33 6 12 34 56 78</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-0.5">{t.orders.report?.company || 'Company'}</p>
                <p className="text-sm font-bold text-brand-text">Premium Motors SAS</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 4: Vehicle Details */}
        <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-6">
          <h3 className="font-bold text-brand-text text-lg">{t.orders.report?.vehicleDetails || 'Vehicle Details'}</h3>
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
              <span className="text-sm font-medium text-slate-400">{t.orders.report?.brand || 'Brand'}</span>
              <span className="text-sm font-bold text-brand-text">BMW</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
              <span className="text-sm font-medium text-slate-400">{t.orders.report?.model || 'Model'}</span>
              <span className="text-sm font-bold text-brand-text">X5 xDrive40i</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
              <span className="text-sm font-medium text-slate-400">{t.orders.report?.licensePlate || 'License Plate'}</span>
              <span className="text-sm font-bold text-brand-text">AB-123-CD</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
              <span className="text-sm font-medium text-slate-400">{t.orders.report?.vin || 'VIN'}</span>
              <span className="text-sm font-bold text-brand-text">5UXCR6C0XL9B74291</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-400">{t.orders.report?.engineType || 'Engine Type'}</span>
              <span className="text-sm font-bold text-brand-text">Petrol</span>
            </div>
          </div>
        </Card>

        {/* Card 5: Delivery Information */}
        <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-4">
          <h3 className="font-bold text-brand-text text-lg">{t.orders.report?.deliveryInfo || 'Delivery Information'}</h3>
          <div>
            <p className="text-sm font-bold text-slate-700">42 Rue de la République</p>
            <p className="text-sm font-medium text-slate-500 mt-1">69002 Lyon, France</p>
          </div>
          <div className="pt-2">
            <p className="text-xs font-medium text-slate-400">Contact: <span className="font-semibold text-slate-500">Marie Laurent</span></p>
            <p className="text-xs font-medium text-slate-400 mt-1">Phone: <span className="font-semibold text-slate-500">+33 6 34 56 78 90</span></p>
          </div>
        </Card>

        {/* Card 6: Delivery Report */}
        <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-brand-text text-lg">{t.orders.report?.deliveryReport || 'Delivery Report'}</h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed pr-8">
              {t.orders.report?.viewPhotos || 'View photos, damage report, mileage/fuel proof, and signature report.'}
            </p>
          </div>
          <Link href={`/dashboard/orders/${id.replace('#', '')}/report`} className="block mt-8">
            <Button className="w-full h-12 rounded-2xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold shadow-md shadow-blue-100 transition-colors">
              {t.orders.report?.viewReportBtn || 'View Report'}
            </Button>
          </Link>
        </Card>

        {/* Card 7: Tracking Status */}
        <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-bold text-brand-text text-lg">{t.orders.report?.trackingStatus || 'Tracking Status'}</h3>
            
            <div className="space-y-0 relative ml-[11px] pt-2">
              <div className="absolute top-6 bottom-8 left-[3px] w-px bg-slate-200 z-0"></div>
              
              <div className="flex items-center gap-6 relative z-10 pb-6">
                <div className="h-2 w-2 rounded-full bg-brand-blue ring-4 ring-blue-100 flex-shrink-0" />
                <p className="font-bold text-slate-700 text-sm">Request submitted</p>
              </div>

              <div className="flex items-center gap-6 relative z-10 pb-6">
                <div className="h-2 w-2 rounded-full bg-brand-blue ring-4 ring-blue-100 flex-shrink-0" />
                <p className="font-bold text-slate-700 text-sm">Driver assigned</p>
              </div>

              <div className="flex items-center gap-6 relative z-10 pb-6">
                <div className="h-2 w-2 rounded-full bg-brand-blue ring-4 ring-blue-100 flex-shrink-0" />
                <p className="font-bold text-slate-700 text-sm">Pickup in progress</p>
              </div>

              <div className="flex items-center gap-6 relative z-10 pb-6">
                <div className="h-2 w-2 rounded-full bg-brand-blue ring-4 ring-blue-100 flex-shrink-0" />
                <p className="font-bold text-slate-700 text-sm">Vehicle picked up</p>
              </div>

              <div className="flex items-center gap-6 relative z-10 pb-6">
                <div className="h-2 w-2 rounded-full bg-brand-blue ring-4 ring-blue-100 flex-shrink-0" />
                <p className="font-bold text-slate-700 text-sm">In transit</p>
              </div>

              <div className="flex items-center gap-6 relative z-10 pb-2">
                <div className="h-2 w-2 rounded-full bg-brand-blue ring-4 ring-blue-100 flex-shrink-0" />
                <p className="font-bold text-slate-700 text-sm">Completed</p>
              </div>
            </div>
          </div>
          
          <Link href={`/dashboard/orders/${id.replace('#', '')}`} className="block mt-8">
            <Button variant="outline" className="w-full h-12 rounded-2xl border-brand-blue/30 bg-blue-50/50 text-brand-blue font-bold hover:bg-blue-50 transition-colors">
              {t.orders.report?.viewTracking || 'View Tracking'}
            </Button>
          </Link>
        </Card>

        {/* Card 8: Payment Status */}
        <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-6 flex flex-col">
          <h3 className="font-bold text-brand-text text-lg">{t.orders.report?.paymentStatus || 'Payment Status'}</h3>
          <div className="space-y-4 pt-2 flex-1">
            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
              <span className="text-sm font-medium text-slate-400">{t.orders.report?.status || 'Status'}</span>
              <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-bold border-none tracking-wider">
                {t.orders.report?.paid || 'Paid'}
              </Badge>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
              <span className="text-sm font-medium text-slate-400">{t.orders.report?.method || 'Method'}</span>
              <span className="text-sm font-bold text-brand-text">Credit Card</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
              <span className="text-sm font-medium text-slate-400">{t.orders.report?.totalAmount || 'Total Amount'}</span>
              <span className="text-sm font-black text-brand-text">€ 450.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-400">{t.orders.report?.paymentDate || 'Payment Date'}</span>
              <span className="text-sm font-bold text-brand-text">22 Apr 2026</span>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
