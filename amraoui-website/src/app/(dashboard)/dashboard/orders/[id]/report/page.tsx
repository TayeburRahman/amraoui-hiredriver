'use client';

import { use, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
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
  Loader2,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDate, formatDateTime } from '@/lib/dateUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ModalType = 'pickupPhotos' | 'deliveryPhotos' | 'damage' | 'signature' | 'mileage' | 'documents' | null;

// --- Modals Components ---

const PhotosModalContent = ({ type, data }: { type: 'pickup' | 'delivery', data: any }) => {
  const inspection = type === 'pickup' ? data?.pickupInspection : data?.deliveryInspection;
  const exterior = inspection?.exteriorPhotos || {};
  const interior = inspection?.interiorPhotos || {};

  const allPhotos = [
    ...Object.entries(exterior).filter(([k]) => k !== 'updatedAt').map(([k, v]) => ({ label: `Exterior: ${k}`, url: v as string })),
    ...Object.entries(interior).filter(([k]) => k !== 'updatedAt').map(([k, v]) => ({ label: `Interior: ${k}`, url: v as string }))
  ];

  return (
    <>
      <DialogHeader className="mb-6 text-left">
        <DialogTitle className="text-2xl font-black text-brand-text">
          {type === 'pickup' ? 'Pickup' : 'Delivery'} Inspection Photos
        </DialogTitle>
      </DialogHeader>
      {allPhotos.length === 0 ? (
        <div className="text-center p-8 text-slate-500 font-medium">No photos uploaded</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allPhotos.map((photo, i) => (
            <div key={i} className="aspect-square rounded-[2rem] bg-blue-50/50 border border-slate-100 border-dashed overflow-hidden flex flex-col relative group">
              <a href={photo.url} target="_blank" rel="noreferrer" className="absolute inset-0 cursor-pointer block hover:opacity-90 transition-opacity">
                <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" crossOrigin="anonymous" />
              </a>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pb-3 pointer-events-none">
                <p className="font-bold text-white text-xs z-10">{photo.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const DamageModalContent = ({ data }: { data: any }) => {
  const pickupDamage = data?.pickupInspection?.damageReport;
  const deliveryDamage = data?.deliveryInspection?.damageReport;

  const renderDamage = (report: any, title: string) => {
    if (!report) return null;
    const hasDamage = report.status && report.status.toLowerCase().includes('damage') && !report.status.toLowerCase().includes('no damage');

    return (
      <div className="space-y-6">
        <h4 className="text-xl font-bold text-brand-text">{title}</h4>
        {!hasDamage ? (
          <div className="rounded-[2rem] p-6 sm:p-8 bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center h-full">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 sm:mb-6">
              <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-brand-text mb-2">No Damage Reported</h3>
            <p className="text-slate-500 font-medium">Vehicle reported in excellent condition</p>
          </div>
        ) : (
          <div className="rounded-[2rem] p-6 sm:p-8 bg-white border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-brand-text text-red-600">Damage Detected</h3>
                <p className="text-slate-500 font-medium text-sm">Status: {report.status}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
              <p className="text-sm font-bold text-slate-400">Component Affected</p>
              <p className="font-bold text-brand-text">{report.component || 'N/A'}</p>
            </div>
            {report.comment && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                <p className="text-sm font-bold text-slate-400">Inspector Notes</p>
                <p className="font-medium text-slate-600">{report.comment}</p>
              </div>
            )}
            {report.photo && (
              <div className="aspect-video rounded-2xl border border-slate-200 overflow-hidden mt-4 group">
                <a href={report.photo} target="_blank" rel="noreferrer" className="block w-full h-full cursor-pointer hover:opacity-90 transition-opacity">
                  <img src={report.photo} alt="Damage proof" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <DialogHeader className="mb-8 text-center sm:text-center">
        <DialogTitle className="text-3xl font-black text-brand-text">Damage Report</DialogTitle>
        <p className="text-slate-500 font-medium">Vehicle condition inspection</p>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {renderDamage(pickupDamage, "Pickup Inspection")}
        {renderDamage(deliveryDamage, "Delivery Inspection")}
      </div>
    </>
  );
};

const SignatureModalContent = ({ data }: { data: any }) => {
  const pickupSig = data?.pickupInspection?.customerSignature;
  const deliverySig = data?.deliveryInspection?.customerSignature;

  const renderSig = (sig: any, title: string) => {
    if (!sig) return (
      <div className="rounded-[2rem] p-6 sm:p-8 bg-slate-50 border border-slate-100 text-center text-slate-400 font-medium">
        No signature recorded for {title}
      </div>
    );

    return (
      <div className="rounded-[2rem] p-6 sm:p-8 bg-slate-50 border border-slate-100 space-y-4">
        <h4 className="font-bold text-brand-text">{title}</h4>
        <p className="text-slate-500 font-medium text-sm">Customer Name: <span className="font-bold text-brand-text">{sig.customerName}</span></p>
        {sig.signaturePhoto && (
          <div className="h-40 rounded-2xl border-2 border-dashed border-blue-200 bg-white flex items-center justify-center p-4 group">
            <a href={sig.signaturePhoto} target="_blank" rel="noreferrer" className="block w-full h-full cursor-pointer hover:opacity-90 transition-opacity">
              <img src={sig.signaturePhoto} alt="Signature" className="h-full w-full object-contain" crossOrigin="anonymous" />
            </a>
          </div>
        )}
        {sig.updatedAt && <p className="text-xs text-slate-400 font-medium mt-4">Signed on {formatDateTime(sig.updatedAt)}</p>}
      </div>
    );
  };

  const renderReceiverId = (receiver: any) => {
    if (!receiver) return null;
    return (
      <div className="rounded-[2rem] p-6 sm:p-8 bg-slate-50 border border-slate-100 space-y-4 md:col-span-2">
        <h4 className="font-bold text-brand-text">Receiver ID Verification</h4>
        <p className="text-slate-500 font-medium text-sm">Full Name: <span className="font-bold text-brand-text">{receiver.receiverFullName}</span></p>
        <p className="text-slate-500 font-medium text-sm">ID Number: <span className="font-bold text-brand-text">{receiver.idNumber}</span></p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {receiver.idFront && (
            <div>
              <p className="text-xs font-bold text-slate-400 mb-2">ID Front</p>
              <div className="h-40 rounded-2xl border border-slate-200 bg-white flex items-center justify-center p-2 group">
                <a href={receiver.idFront} target="_blank" rel="noreferrer" className="block w-full h-full cursor-pointer hover:opacity-90 transition-opacity">
                  <img src={receiver.idFront} alt="ID Front" className="h-full w-full object-contain" crossOrigin="anonymous" />
                </a>
              </div>
            </div>
          )}
          {receiver.idBack && (
            <div>
              <p className="text-xs font-bold text-slate-400 mb-2">ID Back</p>
              <div className="h-40 rounded-2xl border border-slate-200 bg-white flex items-center justify-center p-2 group">
                <a href={receiver.idBack} target="_blank" rel="noreferrer" className="block w-full h-full cursor-pointer hover:opacity-90 transition-opacity">
                  <img src={receiver.idBack} alt="ID Back" className="h-full w-full object-contain" crossOrigin="anonymous" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDriverConf = (conf: any) => {
    if (!conf) return null;
    return (
      <div className="rounded-[2rem] p-6 sm:p-8 bg-slate-50 border border-slate-100 space-y-4 md:col-span-2">
        <h4 className="font-bold text-brand-text">Driver Final Confirmation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {conf.driverSelfiePhoto && (
            <div>
              <p className="text-xs font-bold text-slate-400 mb-2">Driver Selfie</p>
              <div className="h-40 rounded-2xl border border-slate-200 bg-white flex items-center justify-center p-2 group">
                <a href={conf.driverSelfiePhoto} target="_blank" rel="noreferrer" className="block w-full h-full cursor-pointer hover:opacity-90 transition-opacity">
                  <img src={conf.driverSelfiePhoto} alt="Driver Selfie" className="h-full w-full object-contain" crossOrigin="anonymous" />
                </a>
              </div>
            </div>
          )}
          {conf.driverSignaturePhoto && (
            <div>
              <p className="text-xs font-bold text-slate-400 mb-2">Driver Signature</p>
              <div className="h-40 rounded-2xl border-2 border-dashed border-slate-200 bg-white flex items-center justify-center p-4 group">
                <a href={conf.driverSignaturePhoto} target="_blank" rel="noreferrer" className="block w-full h-full cursor-pointer hover:opacity-90 transition-opacity">
                  <img src={conf.driverSignaturePhoto} alt="Driver Signature" className="h-full w-full object-contain" crossOrigin="anonymous" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const receiverId = data?.deliveryInspection?.receiverIdVerification;
  const driverConf = data?.deliveryInspection?.driverConfirmation;

  return (
    <>
      <DialogHeader className="mb-6 text-left">
        <DialogTitle className="text-2xl font-black text-brand-text">Customer Signatures</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {renderSig(pickupSig, "Pickup Signature")}
        {renderSig(deliverySig, "Delivery Signature")}
        {renderReceiverId(receiverId)}
        {renderDriverConf(driverConf)}
      </div>
    </>
  );
};

const MileageModalContent = ({ data }: { data: any }) => {
  const pickup = data?.pickupInspection?.mileageAndFuel || {};
  const delivery = data?.deliveryInspection?.mileageAndFuel || {};

  const pickupMileage = parseInt(pickup.mileage || '0');
  const deliveryMileage = parseInt(delivery.mileage || '0');
  const distance = (deliveryMileage > pickupMileage) ? deliveryMileage - pickupMileage : 0;

  return (
    <>
      <DialogHeader className="mb-8 text-center sm:text-center">
        <DialogTitle className="text-3xl font-black text-brand-text">Mileage & Fuel Tracking</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-[2rem] p-6 sm:p-8 bg-white border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="text-brand-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4" /><path d="M3.34 16A10 10 0 1 1 20.66 16" /></svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-brand-text">Mileage Data</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-slate-50 rounded-2xl p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 mb-1">Pickup mileage</p>
              <p className="text-xl sm:text-3xl font-black text-brand-text">{pickup.mileage || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 mb-1">Delivery mileage</p>
              <p className="text-xl sm:text-3xl font-black text-brand-text">{delivery.mileage || 'N/A'}</p>
            </div>
          </div>
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Distance traveled</p>
              <p className="text-xl font-black text-brand-text">{distance} km</p>
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
            <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center min-h-[120px]">
              <div className="text-center mb-2">
                <p className="text-xs font-bold text-slate-400 mb-2">At pickup</p>
                <span className="text-2xl font-black text-brand-blue">{pickup.fuelLevel || 'N/A'}</span>
              </div>
              {pickup.fuelGaugePhoto && (
                <div className="mt-2 h-16 w-full rounded border border-slate-200 overflow-hidden group">
                  <a href={pickup.fuelGaugePhoto} target="_blank" rel="noreferrer" className="block w-full h-full cursor-pointer hover:opacity-90 transition-opacity">
                    <img src={pickup.fuelGaugePhoto} alt="Pickup fuel gauge" className="w-full h-full object-cover" crossOrigin="anonymous" />
                  </a>
                </div>
              )}
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center min-h-[120px]">
              <div className="text-center mb-2">
                <p className="text-xs font-bold text-slate-400 mb-2">At delivery</p>
                <span className="text-2xl font-black text-brand-text">{delivery.fuelLevel || 'N/A'}</span>
              </div>
              {delivery.fuelGaugePhoto && (
                <div className="mt-2 h-16 w-full rounded border border-slate-200 overflow-hidden group">
                  <a href={delivery.fuelGaugePhoto} target="_blank" rel="noreferrer" className="block w-full h-full cursor-pointer hover:opacity-90 transition-opacity">
                    <img src={delivery.fuelGaugePhoto} alt="Delivery fuel gauge" className="w-full h-full object-cover" crossOrigin="anonymous" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Odometer Proof Photos */}
        {(pickup.odometerPhoto || delivery.odometerPhoto) && (
          <div className="rounded-[2rem] p-6 sm:p-8 bg-white border border-slate-100 shadow-sm md:col-span-2">
            <h3 className="text-lg font-bold text-brand-text mb-4">Odometer Proof Photos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pickup.odometerPhoto && (
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-2">Pickup Odometer</p>
                  <div className="aspect-video rounded-2xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden group">
                    <a href={pickup.odometerPhoto} target="_blank" rel="noreferrer" className="block w-full h-full cursor-pointer hover:opacity-90 transition-opacity">
                      <img src={pickup.odometerPhoto} alt="Pickup Odometer" className="w-full h-full object-cover" crossOrigin="anonymous" />
                    </a>
                  </div>
                </div>
              )}
              {delivery.odometerPhoto && (
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-2">Delivery Odometer</p>
                  <div className="aspect-video rounded-2xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden group">
                    <a href={delivery.odometerPhoto} target="_blank" rel="noreferrer" className="block w-full h-full cursor-pointer hover:opacity-90 transition-opacity">
                      <img src={delivery.odometerPhoto} alt="Delivery Odometer" className="w-full h-full object-cover" crossOrigin="anonymous" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const DocumentsModalContent = ({ data }: { data: any }) => {
  const pDocs = data?.pickupInspection?.uploadDocuments || [];
  const dDocs = data?.deliveryInspection?.uploadDocuments || [];
  const hasNoDocs = pDocs.length === 0 && dDocs.length === 0;

  return (
    <>
      <DialogHeader className="mb-8 text-center sm:text-center">
        <DialogTitle className="text-3xl font-black text-brand-text">Documents & Proof</DialogTitle>
      </DialogHeader>

      {hasNoDocs ? (
        <div className="text-center p-8 text-slate-500 font-medium">No documents uploaded</div>
      ) : (
        <div className="space-y-6">
          {pDocs.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-bold text-brand-text">Pickup Documents</h4>
              {pDocs.map((doc: string, i: number) => (
                <div key={`pickup-${i}`} className="border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                        <p className="font-bold text-brand-text truncate text-sm sm:text-base">Pickup Document {i + 1}</p>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto">
                    <a href={doc} target="_blank" rel="noreferrer">
                      <Button variant="outline" className="w-full h-9 rounded-xl border-brand-blue/30 text-brand-blue text-sm font-bold hover:bg-blue-50">
                        View Document
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {dDocs.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-bold text-brand-text">Delivery Documents</h4>
              {dDocs.map((doc: string, i: number) => (
                <div key={`delivery-${i}`} className="border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                        <p className="font-bold text-brand-text truncate text-sm sm:text-base">Delivery Document {i + 1}</p>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto">
                    <a href={doc} target="_blank" rel="noreferrer">
                      <Button variant="outline" className="w-full h-9 rounded-xl border-brand-blue/30 text-brand-blue text-sm font-bold hover:bg-blue-50">
                        View Document
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

// --- Main Page Component ---

export default function DeliveryReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useTranslation();

  const [mission, setMission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt: any = {
        margin:       10,
        filename:     `order_report_${id.replace('#', '')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true, windowWidth: 1200 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().from(reportRef.current).set(opt).save();
    } catch (err) {
      console.error('Error generating PDF', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await api.get(`/requests/${id}`);
        if (res.data?.success) {
          setMission(res.data.data);
        } else {
          setError('Failed to fetch order details');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching order details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMission();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto min-h-screen pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="max-w-[1400px] mx-auto min-h-screen pb-12 px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 pt-10">
        <Card className="p-8 text-center border-none shadow-sm rounded-2xl bg-white">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Order Not Found</h2>
        </Card>
      </div>
    );
  }

  const orderId = mission.missionId || `#${id}`;
  const d = mission.details || {};
  const isTransport = mission.type === 'TRANSPORT';
  const isInspection = mission.type === 'INSPECTION';
  const isHireDriver = mission.type === 'HIRE_DRIVER';

  let routeText = 'Single Location';
  if (isTransport) routeText = `${(d.pickupAddress || '').split(',')[0]} → ${(d.dropoffAddress || '').split(',')[0]}`;
  if (isInspection) routeText = d.inspectionLocation?.split(',')[0] || 'N/A';
  if (isHireDriver) routeText = d.driverLocation?.split(',')[0] || 'N/A';

  const deliveryDate = d.deliveryArrivalTime || d.deliveryInspection?.driverConfirmation?.updatedAt || (mission.status === 'COMPLETED' ? mission.updatedAt : null);

  const pickupPhotosCount = Object.keys(mission.details?.pickupInspection?.exteriorPhotos || {}).filter(k => k !== 'updatedAt').length + Object.keys(mission.details?.pickupInspection?.interiorPhotos || {}).filter(k => k !== 'updatedAt').length;
  const deliveryPhotosCount = Object.keys(mission.details?.deliveryInspection?.exteriorPhotos || {}).filter(k => k !== 'updatedAt').length + Object.keys(mission.details?.deliveryInspection?.interiorPhotos || {}).filter(k => k !== 'updatedAt').length;
  const documentsCount = (d.pickupInspection?.uploadDocuments || []).length + (d.deliveryInspection?.uploadDocuments || []).length;

  const hasDamage = (mission.details?.pickupInspection?.damageReport?.status && !mission.details?.pickupInspection?.damageReport?.status.toLowerCase().includes('no damage')) || (mission.details?.deliveryInspection?.damageReport?.status && !mission.details?.deliveryInspection?.damageReport?.status.toLowerCase().includes('no damage'));

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
                {mission.status}
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-400 mt-2">Order {orderId}</p>
          </div>
          <Button 
            className="bg-brand-blue hover:bg-brand-blue-hover text-white font-bold rounded-2xl h-11 px-6 shadow-md shadow-blue-100 w-full sm:w-auto" 
            onClick={generatePDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {isGeneratingPDF ? 'Generating PDF...' : (t.orders.deliveryReport?.downloadReport || 'Download Report')}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-xs font-bold text-slate-400 mb-1">{isHireDriver ? 'Tasks' : (t.orders.deliveryReport?.vehicle || 'Vehicle')}</p>
            <p className="font-bold text-brand-text truncate">
              {isHireDriver ? (d.driverTasks || []).join(', ') : `${d.make || d.vehicleBrand || 'N/A'} ${d.model || d.vehicleModel || ''}`}
            </p>
            {!isHireDriver && <p className="text-xs font-medium text-slate-400">{d.plate || d.licensePlate}</p>}
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-xs font-bold text-slate-400 mb-1">{isHireDriver ? 'Service Start' : (t.orders.deliveryReport?.pickup || 'Pickup Time')}</p>
            <p className="font-bold text-brand-text">
              {d.pickupVerification?.verifiedAt ? formatDate(d.pickupVerification.verifiedAt) : 'Pending'}
            </p>
            <p className="text-xs font-medium text-slate-400">
              {d.pickupVerification?.verifiedAt ? new Date(d.pickupVerification.verifiedAt).toLocaleTimeString() : ''}
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-xs font-bold text-slate-400 mb-1">{isHireDriver ? 'Service End' : (t.orders.deliveryReport?.delivery || 'Delivery Time')}</p>
            <p className="font-bold text-brand-text">
              {deliveryDate ? formatDate(deliveryDate) : 'Pending'}
            </p>
            <p className="text-xs font-medium text-slate-400">
              {deliveryDate ? new Date(deliveryDate).toLocaleTimeString() : ''}
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-xs font-bold text-slate-400 mb-1">{isTransport ? (t.orders.deliveryReport?.route || 'Route') : 'Location'}</p>
            <p className="font-bold text-brand-text flex items-center gap-2 truncate">
              {routeText}
            </p>
          </div>
        </div>
      </Card>

      {/* Report Details Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-brand-text">
          {isHireDriver ? 'Daily Driver Check-ins' : (t.orders.deliveryReport?.reportDetails || 'Report Details')}
        </h2>

        {isHireDriver ? (
          <Card className="p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm bg-white">
            <div className="space-y-4">
              {(mission.details?.driverArrivals || []).length > 0 ? (
                (mission.details.driverArrivals).map((arrival: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-text">Arrival Verified</p>
                        <p className="text-sm font-medium text-slate-500">Scheduled: {arrival.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">Logged At</p>
                      <p className="text-sm font-medium text-slate-500">{formatDateTime(arrival.verifiedAt)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-500 font-medium">No check-ins have been recorded yet.</p>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

            {/* Card 1 */}
            <Card className="p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm bg-white space-y-6">
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-2xl ${pickupPhotosCount > 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'} flex items-center justify-center flex-shrink-0`}>
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-brand-text text-sm leading-tight">{t.orders.deliveryReport?.pickupPhotos || 'Pickup Inspection Photos'}</p>
                  <p className={`font-black text-lg mt-1 ${pickupPhotosCount > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {pickupPhotosCount} {t.orders.deliveryReport?.photos || 'photos'}
                  </p>
                </div>
              </div>
              <Button onClick={() => setActiveModal('pickupPhotos')} disabled={pickupPhotosCount === 0} variant="outline" className="w-full h-11 rounded-2xl border-slate-200 text-brand-blue font-bold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent">
                {t.orders.deliveryReport?.viewDetails || 'View Details'}
              </Button>
            </Card>

            {/* Card 2 */}
            <Card className="p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm bg-white space-y-6">
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-2xl ${deliveryPhotosCount > 0 ? 'bg-blue-50 text-brand-blue' : 'bg-slate-50 text-slate-400'} flex items-center justify-center flex-shrink-0`}>
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-brand-text text-sm leading-tight">{t.orders.deliveryReport?.deliveryPhotos || 'Delivery Inspection Photos'}</p>
                  <p className={`font-black text-lg mt-1 ${deliveryPhotosCount > 0 ? 'text-brand-blue' : 'text-slate-400'}`}>
                    {deliveryPhotosCount} {t.orders.deliveryReport?.photos || 'photos'}
                  </p>
                </div>
              </div>
              <Button onClick={() => setActiveModal('deliveryPhotos')} disabled={deliveryPhotosCount === 0} variant="outline" className="w-full h-11 rounded-2xl border-slate-200 text-brand-blue font-bold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent">
                {t.orders.deliveryReport?.viewDetails || 'View Details'}
              </Button>
            </Card>

            {/* Card 3 */}
            <Card className="p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm bg-white space-y-6">
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-2xl ${hasDamage ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'} flex items-center justify-center flex-shrink-0`}>
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-brand-text text-sm leading-tight">{t.orders.deliveryReport?.damageReport || 'Damage Report'}</p>
                  <p className={`font-black text-lg mt-1 ${hasDamage ? 'text-red-500' : 'text-emerald-500'}`}>{hasDamage ? 'Damage Found' : (t.orders.deliveryReport?.noDamage || 'No damage')}</p>
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
                  <p className="font-bold text-brand-text text-sm leading-tight">{t.orders.deliveryReport?.signature || 'Customer Signatures'}</p>
                  <p className="font-black text-brand-blue text-lg mt-1">{d.deliveryInspection?.customerSignature ? 'Signed' : 'Pending'}</p>
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
                  <p className="font-black text-amber-500 text-lg mt-1">Data Logged</p>
                </div>
              </div>
              <Button onClick={() => setActiveModal('mileage')} variant="outline" className="w-full h-11 rounded-2xl border-slate-200 text-brand-blue font-bold hover:bg-blue-50 transition-colors">
                {t.orders.deliveryReport?.viewDetails || 'View Details'}
              </Button>
            </Card>

            {/* Card 6 */}
            <Card className="p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm bg-white space-y-6">
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-2xl ${documentsCount > 0 ? 'bg-orange-50 text-orange-500' : 'bg-slate-50 text-slate-400'} flex items-center justify-center flex-shrink-0`}>
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-brand-text text-sm leading-tight">{t.orders.deliveryReport?.documents || 'Documents'}</p>
                  <p className={`font-black text-lg mt-1 ${documentsCount > 0 ? 'text-orange-500' : 'text-slate-400'}`}>
                    {documentsCount} Files
                  </p>
                </div>
              </div>
              <Button onClick={() => setActiveModal('documents')} disabled={documentsCount === 0} variant="outline" className="w-full h-11 rounded-2xl border-slate-200 text-brand-blue font-bold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent">
                {t.orders.deliveryReport?.viewDetails || 'View Details'}
              </Button>
            </Card>

          </div>
        )}
      </div>

      {/* Transport Timeline */}
      {!isHireDriver && (
        <Card className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm bg-white space-y-6">
          <h2 className="text-xl font-black text-brand-text">{t.orders.deliveryReport?.transportTimeline || 'Transport Timeline'}</h2>

          <div className="space-y-3">
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 flex items-center gap-4 border border-slate-100">
              <div className="h-8 w-8 rounded-full border-2 border-emerald-500 text-emerald-500 flex items-center justify-center flex-shrink-0 bg-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-brand-text text-sm sm:text-base">{t.orders.deliveryReport?.requestSubmitted || 'Request Submitted'}</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{formatDateTime(mission.createdAt)}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 flex items-center gap-4 border border-slate-100">
              <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${d.pickupVerification?.verifiedAt ? 'border-emerald-500 text-emerald-500 bg-white' : 'border-slate-200 text-slate-300 bg-white'}`}>
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className={`font-bold text-sm sm:text-base ${d.pickupVerification?.verifiedAt ? 'text-brand-text' : 'text-slate-400'}`}>
                  {t.orders.deliveryReport?.vehiclePickedUp || 'Vehicle Picked Up'}
                </p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  {d.pickupVerification?.verifiedAt ? `${formatDateTime(d.pickupVerification.verifiedAt)}` : 'Pending'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 flex items-center gap-4 border border-slate-100">
              <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${deliveryDate ? 'border-emerald-500 text-emerald-500 bg-white' : 'border-slate-200 text-slate-300 bg-white'}`}>
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className={`font-bold text-sm sm:text-base ${deliveryDate ? 'text-brand-text' : 'text-slate-400'}`}>
                  {t.orders.deliveryReport?.deliveredSuccessfully || 'Delivered Successfully'}
                </p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  {deliveryDate ? `${formatDateTime(deliveryDate)}` : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Dialog for Modals */}
      <Dialog open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent className="w-[95vw] md:w-full max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl sm:rounded-[2rem] border-none shadow-2xl bg-white p-5 sm:p-8 md:p-10 hide-scrollbar">
          {activeModal === 'pickupPhotos' && <PhotosModalContent type="pickup" data={d} />}
          {activeModal === 'deliveryPhotos' && <PhotosModalContent type="delivery" data={d} />}
          {activeModal === 'damage' && <DamageModalContent data={d} />}
          {activeModal === 'signature' && <SignatureModalContent data={d} />}
          {activeModal === 'mileage' && <MileageModalContent data={d} />}
          {activeModal === 'documents' && <DocumentsModalContent data={d} />}
        </DialogContent>
      </Dialog>

      {/* Hidden PDF Layout */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
        <div ref={reportRef} className="p-10 bg-white text-slate-800" style={{ width: '1200px' }}>
          <h1 className="text-4xl font-black text-brand-text mb-4">Order Report: {orderId}</h1>
          <div className="grid grid-cols-2 gap-4 mb-8 text-lg border-b pb-8">
            <div><strong>Status:</strong> {mission.status}</div>
            <div><strong>Vehicle:</strong> {isHireDriver ? (d.driverTasks || []).join(', ') : `${d.make || d.vehicleBrand || 'N/A'} ${d.model || d.vehicleModel || ''}`}</div>
            <div><strong>Location/Route:</strong> {routeText}</div>
            <div><strong>Pickup Time:</strong> {d.pickupVerification?.verifiedAt ? formatDate(d.pickupVerification.verifiedAt) : 'Pending'}</div>
            <div><strong>Delivery Time:</strong> {deliveryDate ? formatDate(deliveryDate) : 'Pending'}</div>
          </div>
          
          <div className="space-y-12">
            {!isHireDriver && (
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-4 border-b pb-2">Pickup Photos</h2>
                  <PhotosModalContent type="pickup" data={d} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4 border-b pb-2">Delivery Photos</h2>
                  <PhotosModalContent type="delivery" data={d} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4 border-b pb-2">Damage Report</h2>
                  <DamageModalContent data={d} />
                </div>
              </>
            )}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Signatures & Proof</h2>
              <SignatureModalContent data={d} />
            </div>
            {!isHireDriver && (
              <div>
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Mileage & Fuel</h2>
                <MileageModalContent data={d} />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Documents</h2>
              <DocumentsModalContent data={d} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
