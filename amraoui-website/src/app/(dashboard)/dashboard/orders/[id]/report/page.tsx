'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Download,
  Image as ImageIcon,
  AlertCircle,
  FileSignature,
  Fuel,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ModalType = 'pickupPhotos' | 'deliveryPhotos' | 'damage' | 'signature' | 'mileage' | 'documents' | null;

// --- Modals Components ---

const PhotosModalContent = ({ type }: { type: 'pickup' | 'delivery' }) => (
  <>
    <DialogHeader className="mb-6 text-left">
      <DialogTitle className="text-2xl font-black text-brand-text">Driver Uploaded Photos</DialogTitle>
    </DialogHeader>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {['Front', 'Front right', 'Rear right', 'Rear', 'Rear left', 'Front left'].map((label, i) => (
        <div key={i} className="aspect-square rounded-[2rem] bg-blue-50/50 border border-slate-100 border-dashed flex flex-col items-center justify-center gap-3">
          <ImageIcon className="h-8 w-8 text-brand-blue" />
          <p className="font-bold text-slate-500 text-sm">{label}</p>
        </div>
      ))}
    </div>
  </>
);

const DamageModalContent = () => (
  <>
    <DialogHeader className="mb-8 text-center sm:text-center">
      <DialogTitle className="text-3xl font-black text-brand-text">Damage Report</DialogTitle>
      <p className="text-slate-500 font-medium">Vehicle condition inspection</p>
    </DialogHeader>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-6 sm:space-y-6">
        <div className="rounded-[2rem] p-6 sm:p-8 bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 sm:mb-6">
            <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-brand-text mb-2">No Damage Reported</h3>
          <p className="text-slate-500 font-medium">Vehicle delivered in excellent condition</p>
        </div>
        <div className="rounded-[2rem] p-6 sm:p-8 bg-white border border-slate-100 shadow-sm">
          <h4 className="text-xl font-bold text-brand-text mb-4">Inspector Notes</h4>
          <p className="text-slate-600 font-medium leading-relaxed mb-6">
            Vehicle inspected thoroughly upon delivery. All exterior panels, glass, and interior components are in excellent condition. No scratches, dents, or damage found. Vehicle delivered clean and as expected.
          </p>
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1">
              <span className="text-slate-400 font-medium">Inspected by</span>
              <span className="font-bold text-brand-text">James Davis</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1">
              <span className="text-slate-400 font-medium">Date & time</span>
              <span className="font-bold text-brand-text">May 5, 2026 • 3:30 PM</span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 sm:space-y-6">
        <div className="rounded-[2rem] p-6 sm:p-8 bg-white border border-slate-100 shadow-sm">
          <h4 className="text-xl font-bold text-brand-text mb-6">Inspection Details</h4>
          <div className="space-y-4">
            {[
              { label: 'Exterior condition', value: 'Good', icon: CheckCircle2, color: 'text-emerald-500' },
              { label: 'Interior condition', value: 'Good', icon: CheckCircle2, color: 'text-emerald-500' },
              { label: 'Glass & mirrors', value: 'No damage', icon: CheckCircle2, color: 'text-emerald-500' },
              { label: 'Wheels & tires', value: 'Good', icon: CheckCircle2, color: 'text-emerald-500' },
              { label: 'Paint condition', value: 'Excellent', icon: CheckCircle2, color: 'text-emerald-500' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">{item.label}</span>
                <div className="flex items-center gap-2">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  <span className={`font-bold ${item.color}`}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] p-6 sm:p-8 bg-emerald-50/50 border border-emerald-100 flex items-start gap-4">
          <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-brand-text mb-1">Verified Inspection</h4>
            <p className="text-slate-600 font-medium text-sm">
              This damage report has been verified and confirmed by both the driver and customer at the time of delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
);

const SignatureModalContent = () => (
  <>
    <DialogHeader className="mb-6 text-left">
      <DialogTitle className="text-2xl font-black text-brand-text">Customer Signature & Final Report</DialogTitle>
    </DialogHeader>
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-[2rem] p-6 sm:p-8 bg-slate-50 border border-slate-100">
        <p className="text-slate-500 font-medium mb-4">Customer Signature</p>
        <div className="h-40 rounded-2xl border-2 border-dashed border-blue-200 bg-white flex items-center justify-center">
          <span className="font-[cursive] text-4xl font-bold text-brand-blue italic">Luc Moreau</span>
        </div>
        <p className="text-sm text-slate-400 font-medium mt-4">Signed on May 5, 2026 at 3:35 PM</p>
      </div>
      <div className="rounded-[2rem] p-6 sm:p-8 bg-slate-50 border border-slate-100">
        <h4 className="font-bold text-brand-text mb-3">Customer Notes</h4>
        <p className="text-slate-500 font-medium leading-relaxed">
          &quot;Vehicle received in excellent condition. Driver was professional and courteous. Very satisfied with the service. Thank you!&quot;
        </p>
      </div>
      <div className="rounded-[2rem] p-6 bg-emerald-50/50 border border-emerald-200 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-emerald-500 text-emerald-500 flex items-center justify-center flex-shrink-0 bg-white">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-bold text-emerald-600 mb-0.5">Delivery Confirmed</h4>
          <p className="text-slate-500 font-medium text-sm">
            Customer signature received and verified
          </p>
        </div>
      </div>
    </div>
  </>
);

const MileageModalContent = () => (
  <>
    <DialogHeader className="mb-8 text-center sm:text-center">
      <DialogTitle className="text-3xl font-black text-brand-text">Mileage & Fuel Proof</DialogTitle>
      <p className="text-slate-500 font-medium">Odometer and fuel level documentation</p>
    </DialogHeader>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div className="rounded-[2rem] p-6 sm:p-8 bg-white border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="text-brand-blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 16A10 10 0 1 1 20.66 16"/></svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-brand-text">Mileage Data</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-slate-50 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 mb-1">Pickup mileage</p>
            <p className="text-xl sm:text-3xl font-black text-brand-text">45,238</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1">May 1, 11:45 AM</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 mb-1">Delivery mileage</p>
            <p className="text-xl sm:text-3xl font-black text-brand-text">45,626</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1">May 5, 3:30 PM</p>
          </div>
        </div>
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Distance traveled</p>
            <p className="text-xl font-black text-brand-text">388 miles</p>
          </div>
        </div>
      </div>
      <div className="rounded-[2rem] p-6 sm:p-8 bg-white border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="text-brand-blue">
            <Fuel className="h-6 w-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-brand-text">Fuel Level</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-slate-50 rounded-2xl p-3 sm:p-4">
            <p className="text-xs font-bold text-slate-400 mb-2">At pickup</p>
            <div className="flex items-end gap-1 mb-3">
              <span className="text-3xl sm:text-4xl font-black text-brand-blue">75</span>
              <span className="text-base sm:text-lg font-bold text-brand-blue/50 mb-1">%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-brand-blue w-[75%] rounded-full" />
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 sm:p-4">
            <p className="text-xs font-bold text-slate-400 mb-2">At delivery</p>
            <div className="flex items-end gap-1 mb-3">
              <span className="text-3xl sm:text-4xl font-black text-brand-text">62</span>
              <span className="text-base sm:text-lg font-bold text-slate-300 mb-1">%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-brand-blue w-[62%] rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-[2rem] p-6 sm:p-8 bg-white border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-brand-text mb-4">Proof Photos</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-[4/3] rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
            <div className="text-slate-300 mb-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 16A10 10 0 1 1 20.66 16"/></svg>
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-brand-text text-center">Pickup odometer</p>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
            <div className="text-slate-300 mb-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 16A10 10 0 1 1 20.66 16"/></svg>
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-brand-text text-center">Delivery odometer</p>
          </div>
        </div>
      </div>
      <div className="rounded-[2rem] p-6 sm:p-8 bg-slate-50 border border-slate-100 flex items-center h-full">
        <p className="text-slate-500 font-medium leading-relaxed">
          All mileage and fuel data has been verified with photographic evidence taken at both pickup and delivery locations.
        </p>
      </div>
    </div>
  </>
);

const DocumentsModalContent = () => (
  <>
    <DialogHeader className="mb-8 text-center sm:text-center">
      <DialogTitle className="text-3xl font-black text-brand-text">Documents & Proof</DialogTitle>
      <p className="text-slate-500 font-medium">Customer view of uploaded project documents</p>
    </DialogHeader>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div className="rounded-[2rem] p-6 sm:p-8 bg-white border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center">
            <FileText className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-brand-text text-lg sm:text-xl">Document Summary</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-slate-50 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Total documents</p>
            <p className="text-xl sm:text-2xl font-black text-brand-text">1</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Upload method</p>
            <p className="text-base sm:text-lg font-black text-brand-text">Scan / Files</p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
          <div className="h-8 w-8 rounded-full bg-white text-brand-blue shadow-sm flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400">Latest upload</p>
            <p className="text-sm font-bold text-brand-text truncate">PV_document.jpg</p>
          </div>
        </div>
      </div>
      <div className="rounded-[2rem] p-6 sm:p-8 bg-white border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center">
            <FileText className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-brand-text text-lg sm:text-xl">Document Type</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Primary file</p>
            <p className="text-base sm:text-lg font-black text-brand-text truncate">PV document</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">File size</p>
            <p className="text-base sm:text-lg font-black text-brand-text">1.2 MB</p>
          </div>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-blue to-cyan-400 w-[60%] rounded-full" />
        </div>
      </div>
      <div className="rounded-[2rem] p-6 sm:p-8 bg-white border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="text-brand-blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3 className="font-bold text-brand-text text-lg sm:text-xl">Uploaded Documents</h3>
        </div>
        <div className="border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                <p className="font-bold text-brand-text truncate text-sm sm:text-base">PV_document.jpg</p>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 mb-2 sm:mb-3">Uploaded just now</p>
              <div className="hidden sm:block">
                <Button variant="outline" size="sm" className="h-8 rounded-lg border-brand-blue/30 text-brand-blue text-xs font-bold hover:bg-blue-50">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  View
                </Button>
              </div>
            </div>
            <div className="text-slate-300 sm:hidden">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </div>
          </div>
          
          <div className="w-full sm:w-auto sm:hidden">
             <Button variant="outline" className="w-full h-9 rounded-xl border-brand-blue/30 text-brand-blue text-sm font-bold hover:bg-blue-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                View Document
              </Button>
          </div>

          <div className="text-slate-300 hidden sm:block">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </div>
        </div>
      </div>
      <div className="rounded-[2rem] p-6 sm:p-8 bg-slate-50 border border-slate-100 flex flex-col justify-center space-y-4">
        <div className="h-10 w-10 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center">
          <AlertCircle className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-slate-600 leading-relaxed">
          Your uploaded documents are shown here for easy review.
        </p>
        <div className="h-px bg-slate-200 w-full" />
        <p className="text-sm font-medium text-slate-600 leading-relaxed">
          You can open or download files anytime.
        </p>
      </div>
    </div>
  </>
);

// --- Main Page Component ---

export default function DeliveryReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useTranslation();
  const orderId = `#${id}`;

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen pb-12 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      {/* Back Button */}
      <div className="pt-2">
        <Link href={`/dashboard/orders/${id.replace('#', '')}`} className="inline-flex items-center text-slate-500 hover:text-brand-text font-semibold text-sm transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Order
        </Link>
      </div>

      {/* Top Card */}
      <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-brand-text">{t.orders.deliveryReport?.title || 'Delivery Report'}</h1>
              <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border-none">
                Completed
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-400 mt-2">Order {orderId}</p>
          </div>
          <Button className="bg-brand-blue hover:bg-brand-blue-hover text-white font-bold rounded-2xl h-11 px-6 shadow-md shadow-blue-100 w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            {t.orders.deliveryReport?.downloadReport || 'Download Report'}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-xs font-bold text-slate-400 mb-1">{t.orders.deliveryReport?.vehicle || 'Vehicle'}</p>
            <p className="font-bold text-brand-text">Audi A4</p>
            <p className="text-xs font-medium text-slate-400">XY-456-EF</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-xs font-bold text-slate-400 mb-1">{t.orders.deliveryReport?.pickup || 'Pickup'}</p>
            <p className="font-bold text-brand-text">May 1, 2026</p>
            <p className="text-xs font-medium text-slate-400">11:45 AM</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-xs font-bold text-slate-400 mb-1">{t.orders.deliveryReport?.delivery || 'Delivery'}</p>
            <p className="font-bold text-brand-text">May 5, 2026</p>
            <p className="text-xs font-medium text-slate-400">3:30 PM</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-xs font-bold text-slate-400 mb-1">{t.orders.deliveryReport?.route || 'Route'}</p>
            <p className="font-bold text-brand-text flex items-center gap-2">
              Marseille <ArrowLeft className="h-3.5 w-3.5 rotate-180 text-slate-400" /> Nice
            </p>
          </div>
        </div>
      </Card>

      {/* Report Details Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-brand-text">{t.orders.deliveryReport?.reportDetails || 'Report Details'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Card 1 */}
          <Card className="p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm bg-white space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-brand-text text-sm leading-tight">{t.orders.deliveryReport?.pickupPhotos || 'Pickup Inspection Photos'}</p>
                <p className="font-black text-emerald-500 text-lg mt-1">6 {t.orders.deliveryReport?.photos || 'photos'}</p>
              </div>
            </div>
            <Button onClick={() => setActiveModal('pickupPhotos')} variant="outline" className="w-full h-11 rounded-2xl border-slate-200 text-brand-blue font-bold hover:bg-blue-50 transition-colors">
              {t.orders.deliveryReport?.viewDetails || 'View Details'}
            </Button>
          </Card>

          {/* Card 2 */}
          <Card className="p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm bg-white space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-brand-text text-sm leading-tight">{t.orders.deliveryReport?.deliveryPhotos || 'Delivery Inspection Photos'}</p>
                <p className="font-black text-brand-blue text-lg mt-1">6 {t.orders.deliveryReport?.photos || 'photos'}</p>
              </div>
            </div>
            <Button onClick={() => setActiveModal('deliveryPhotos')} variant="outline" className="w-full h-11 rounded-2xl border-slate-200 text-brand-blue font-bold hover:bg-blue-50 transition-colors">
              {t.orders.deliveryReport?.viewDetails || 'View Details'}
            </Button>
          </Card>

          {/* Card 3 */}
          <Card className="p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm bg-white space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-brand-text text-sm leading-tight">{t.orders.deliveryReport?.damageReport || 'Damage Report'}</p>
                <p className="font-black text-emerald-500 text-lg mt-1">{t.orders.deliveryReport?.noDamage || 'No damage'}</p>
              </div>
            </div>
            <Button onClick={() => setActiveModal('damage')} variant="outline" className="w-full h-11 rounded-2xl border-slate-200 text-brand-blue font-bold hover:bg-blue-50 transition-colors">
              {t.orders.deliveryReport?.viewDetails || 'View Details'}
            </Button>
          </Card>

          {/* Card 4 */}
          <Card className="p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm bg-white space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
                <FileSignature className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-brand-text text-sm leading-tight">{t.orders.deliveryReport?.signature || 'Customer Signature / Final Report'}</p>
                <p className="font-black text-brand-blue text-lg mt-1">{t.orders.deliveryReport?.signed || 'Signed'}</p>
              </div>
            </div>
            <Button onClick={() => setActiveModal('signature')} variant="outline" className="w-full h-11 rounded-2xl border-slate-200 text-brand-blue font-bold hover:bg-blue-50 transition-colors">
              {t.orders.deliveryReport?.viewDetails || 'View Details'}
            </Button>
          </Card>

          {/* Card 5 */}
          <Card className="p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm bg-white space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
                <Fuel className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-brand-text text-sm leading-tight">{t.orders.deliveryReport?.mileage || 'Mileage & Fuel Proof'}</p>
                <p className="font-black text-amber-500 text-lg mt-1">{t.orders.deliveryReport?.verified || 'Verified'}</p>
              </div>
            </div>
            <Button onClick={() => setActiveModal('mileage')} variant="outline" className="w-full h-11 rounded-2xl border-slate-200 text-brand-blue font-bold hover:bg-blue-50 transition-colors">
              {t.orders.deliveryReport?.viewDetails || 'View Details'}
            </Button>
          </Card>

          {/* Card 6 */}
          <Card className="p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm bg-white space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-brand-text text-sm leading-tight">{t.orders.deliveryReport?.documents || 'Documents'}</p>
                <p className="font-black text-orange-500 text-lg mt-1">{t.orders.deliveryReport?.view || 'View'}</p>
              </div>
            </div>
            <Button onClick={() => setActiveModal('documents')} variant="outline" className="w-full h-11 rounded-2xl border-slate-200 text-brand-blue font-bold hover:bg-blue-50 transition-colors">
              {t.orders.deliveryReport?.viewDetails || 'View Details'}
            </Button>
          </Card>

        </div>
      </div>

      {/* Transport Timeline */}
      <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-6">
        <h2 className="text-xl font-black text-brand-text">{t.orders.deliveryReport?.transportTimeline || 'Transport Timeline'}</h2>
        
        <div className="space-y-3">
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 flex items-center gap-4 border border-slate-100">
            <div className="h-8 w-8 rounded-full border-2 border-emerald-500 text-emerald-500 flex items-center justify-center flex-shrink-0 bg-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-brand-text text-sm sm:text-base">{t.orders.deliveryReport?.requestSubmitted || 'Request Submitted'}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">May 1, 2026 9:30 AM</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 flex items-center gap-4 border border-slate-100">
            <div className="h-8 w-8 rounded-full border-2 border-emerald-500 text-emerald-500 flex items-center justify-center flex-shrink-0 bg-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-brand-text text-sm sm:text-base">{t.orders.deliveryReport?.vehiclePickedUp || 'Vehicle Picked Up'}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">May 1, 2026 11:45 AM • Marseille</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 flex items-center gap-4 border border-slate-100">
            <div className="h-8 w-8 rounded-full border-2 border-emerald-500 text-emerald-500 flex items-center justify-center flex-shrink-0 bg-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-brand-text text-sm sm:text-base">{t.orders.deliveryReport?.deliveredSuccessfully || 'Delivered Successfully'}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">May 5, 2026 3:30 PM • Nice</p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Dialog for Modals */}
      <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="w-[95vw] md:w-full max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl sm:rounded-[2rem] border-none shadow-2xl bg-white p-5 sm:p-8 md:p-10 hide-scrollbar">
          {activeModal === 'pickupPhotos' && <PhotosModalContent type="pickup" />}
          {activeModal === 'deliveryPhotos' && <PhotosModalContent type="delivery" />}
          {activeModal === 'damage' && <DamageModalContent />}
          {activeModal === 'signature' && <SignatureModalContent />}
          {activeModal === 'mileage' && <MileageModalContent />}
          {activeModal === 'documents' && <DocumentsModalContent />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
