'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
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
  ArrowRight,
  Car,
  User,
  Wrench,
  Mail,
  Building2
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useTranslation();

  const [mission, setMission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

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
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-blue rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const res = await api.patch(`/requests/${id}/cancel-customer`);
      if (res.data?.success) {
        setMission((prev: any) => ({ ...prev, status: 'CANCELLED' }));
        setShowCancelModal(false);
      } else {
        alert('Failed to cancel order');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while cancelling the order');
    } finally {
      setIsCancelling(false);
    }
  };

  if (error || !mission) {
    return (
      <div className="max-w-[1400px] mx-auto min-h-screen pb-12 px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 pt-10">
        <Link href="/dashboard/orders" className="inline-flex items-center text-slate-500 hover:text-brand-text font-semibold text-sm transition-colors mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.orders.details?.backToOrders || 'Back to Orders'}
        </Link>
        <Card className="p-8 text-center border-none shadow-sm rounded-2xl bg-white">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Order Not Found</h2>
          <p className="text-slate-500">{error || 'We could not find the details for this order.'}</p>
        </Card>
      </div>
    );
  }

  const orderId = mission.missionId || `#${id}`;
  const d = mission.details || {};
  const isTransport = mission.type === 'TRANSPORT';
  const isInspection = mission.type === 'INSPECTION';
  const isHireDriver = mission.type === 'HIRE_DRIVER';

  // Format Status
  let statusText = 'Pending';
  let statusColor = 'bg-slate-100 text-slate-600';

  if (['PENDING_ADMIN_QUOTE', 'ADMIN_REVIEWING_DRIVERS'].includes(mission.status)) {
    statusText = 'Pending';
    statusColor = 'bg-amber-50 text-amber-600';
  } else if (mission.status === 'CUSTOMER_REVIEWING_QUOTE') {
    statusText = 'Pending Review';
    statusColor = 'bg-blue-50 text-blue-600';
  } else if (['OPEN_FOR_DRIVERS', 'ASSIGNED'].includes(mission.status)) {
    statusText = 'Assigned';
    statusColor = 'bg-brand-blue-light text-brand-blue';
  } else if (mission.status === 'IN_PROGRESS') {
    statusText = 'In Transit';
    statusColor = 'bg-brand-blue text-white';
  } else if (mission.status === 'COMPLETED') {
    statusText = 'Completed';
    statusColor = 'bg-emerald-50 text-emerald-600';
  } else if (['REJECTED_BY_CUSTOMER', 'CANCELLED'].includes(mission.status)) {
    statusText = 'Cancelled';
    statusColor = 'bg-red-50 text-red-600';
  }

  // Format Vehicle Info
  let vehicleInfo = 'N/A';
  if (isTransport) vehicleInfo = `${d.make || ''} ${d.model || ''} ${d.plate ? `• ${d.plate}` : ''}`.trim();
  if (isInspection) vehicleInfo = `${d.vehicleBrand || ''} ${d.vehicleModel || ''} ${d.licensePlate ? `• ${d.licensePlate}` : ''}`.trim();
  if (isHireDriver) vehicleInfo = 'Driver Service';

  const driver = mission.assignedDriverId;

  // Timeline Progress Logic
  const hasDriver = !!driver;
  const isPickupStarted = ['IN_PROGRESS', 'COMPLETED'].includes(mission.status);
  const isCompleted = mission.status === 'COMPLETED';

  let baseTransportFee = mission.adminQuote?.amount || 0;
  let driverTollCharges = 0;
  let driverExceptionalCosts = 0;
  let driverFuelCost = 0;

  if (mission.driverQuotes && mission.driverQuotes.length > 0) {
    const acceptedQuote = mission.driverQuotes.find((q: any) => 
      q.status === 'ACCEPTED' || 
      (driver && ((q.driverId && q.driverId._id === driver._id) || q.driverId === driver._id || q.driverId === driver))
    );
    if (acceptedQuote) {
      baseTransportFee = acceptedQuote.amount || 0;
      driverTollCharges = acceptedQuote.tollCharges || 0;
      driverExceptionalCosts = acceptedQuote.exceptionalCosts || 0;
      driverFuelCost = acceptedQuote.fuelCost || 0;
    }
  }

  const extraExpenses = (mission.expenses || []).reduce((acc: number, cur: any) => acc + (cur.amount || 0), 0);
  const totalAmount = baseTransportFee + driverTollCharges + driverExceptionalCosts + driverFuelCost + extraExpenses;

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
          <Card className="relative overflow-hidden border-none shadow-sm rounded-[2rem] bg-slate-100 aspect-[4/3] lg:aspect-auto lg:h-[400px] flex flex-col items-center justify-center p-4">

            {/* Center Map Placeholder Content */}
            <div className="flex flex-col items-center justify-center text-center space-y-3 z-10">
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md text-brand-blue">
                {isTransport ? <MapPin className="h-8 w-8" /> : isInspection ? <Wrench className="h-8 w-8" /> : <User className="h-8 w-8" />}
              </div>
              <div>
                <p className="font-bold text-slate-500">
                  {isTransport ? 'Route Map' : isInspection ? 'Inspection Details' : 'Driver Details'}
                </p>
                {isTransport && d.pickupAddress && d.dropoffAddress && (
                  <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-400 mt-1">
                    <span>{d.pickupAddress.split(',')[0]}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                    <span>{d.dropoffAddress.split(',')[0]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Top Left - Pickup Pin */}
            {isTransport && d.pickupAddress && (
              <Card className="absolute top-6 left-6 p-3 sm:p-4 rounded-2xl shadow-md border-none bg-white flex flex-col gap-1 z-20 max-w-[200px]">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-400">Pickup</span>
                </div>
                <p className="font-black text-brand-text pl-4.5 text-sm truncate">{d.pickupAddress.split(',')[0]}</p>
              </Card>
            )}

            {/* Bottom Right - Delivery Pin */}
            {isTransport && d.dropoffAddress && (
              <Card className="absolute bottom-6 right-6 p-3 sm:p-4 rounded-2xl shadow-md border-none bg-white flex flex-col gap-1 z-20 max-w-[200px]">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-brand-blue flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-400">Delivery</span>
                </div>
                <p className="font-black text-brand-text pl-4.5 text-sm truncate">{d.dropoffAddress.split(',')[0]}</p>
              </Card>
            )}
          </Card>

          {/* Location Details */}
          <Card className="p-6 sm:p-8 rounded-[2rem] border-none shadow-sm bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {isTransport && (
                <>
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-400">
                      {t.orders.details?.pickupLocation || 'Pickup Location'}
                    </p>
                    <div>
                      <p className="font-black text-brand-text text-lg">{d.pickupAddress || 'N/A'}</p>
                      <p className="text-sm font-medium text-slate-500 mt-1">
                        {t.orders.details?.contact || 'Contact:'} {d.pickupContactName || d.firstName}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-400">
                      {t.orders.details?.deliveryLocation || 'Delivery Location'}
                    </p>
                    <div>
                      <p className="font-black text-brand-text text-lg">{d.dropoffAddress || 'N/A'}</p>
                      <p className="text-sm font-medium text-slate-500 mt-1">
                        {t.orders.details?.contact || 'Contact:'} {d.dropoffContactName || d.firstName}
                      </p>
                    </div>
                  </div>
                </>
              )}
              {isInspection && (
                <div className="space-y-4 md:col-span-2">
                  <p className="text-sm font-bold text-slate-400">Inspection Location</p>
                  <div>
                    <p className="font-black text-brand-text text-lg">{d.inspectionLocation || 'N/A'}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Contact: {d.customerName || d.firstName}</p>
                  </div>
                </div>
              )}
              {isHireDriver && (
                <div className="space-y-4 md:col-span-2">
                  <p className="text-sm font-bold text-slate-400">Service Location</p>
                  <div>
                    <p className="font-black text-brand-text text-lg">{d.driverLocation || d.pickupAddress || 'N/A'}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Contact: {d.customerName || d.firstName}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card className="p-6 sm:p-8 rounded-[2rem] border-none shadow-sm bg-white space-y-6">
              <h3 className="font-bold text-brand-text text-lg">Customer Information</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 mb-0.5">Name</p>
                    <p className="text-sm font-bold text-brand-text">{d.customerName || `${d.firstName || ''} ${d.lastName || ''}`.trim() || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 mb-0.5">Email</p>
                    <p className="text-sm font-bold text-brand-text">{d.customerEmail || d.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400 mb-0.5">Phone</p>
                    <p className="text-sm font-bold text-brand-text">{d.customerPhone || d.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Vehicle Details */}
            {!isHireDriver && (
              <Card className="p-6 sm:p-8 rounded-[2rem] border-none shadow-sm bg-white space-y-6">
                <h3 className="font-bold text-brand-text text-lg">Vehicle Details</h3>
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <span className="text-sm font-medium text-slate-400">Brand</span>
                    <span className="text-sm font-bold text-brand-text">{d.make || d.vehicleBrand || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <span className="text-sm font-medium text-slate-400">Model</span>
                    <span className="text-sm font-bold text-brand-text">{d.model || d.vehicleModel || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <span className="text-sm font-medium text-slate-400">License Plate</span>
                    <span className="text-sm font-bold text-brand-text">{d.plate || d.licensePlate || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <span className="text-sm font-medium text-slate-400">VIN</span>
                    <span className="text-sm font-bold text-brand-text">{d.vin || d.vinNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-400">Engine Type</span>
                    <span className="text-sm font-bold text-brand-text">{d.engineType || 'N/A'}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Payment Status */}
            <Card className="p-6 sm:p-8 rounded-[2rem] border-none shadow-sm bg-white space-y-6 flex flex-col md:col-span-2 lg:col-span-1">
              <h3 className="font-bold text-brand-text text-lg">Payment Summary</h3>
              <div className="space-y-4 pt-2 flex-1">
                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                  <span className="text-sm font-medium text-slate-400">Status</span>
                  <Badge className={`px-3 py-1 rounded-full text-[10px] font-bold border-none tracking-wider ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {isCompleted ? 'Paid / Settled' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                  <span className="text-sm font-medium text-slate-400">Driver Quote (Base)</span>
                  <span className="text-sm font-bold text-brand-text">€ {baseTransportFee.toFixed(2)}</span>
                </div>
                {driverTollCharges > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <span className="text-sm font-medium text-slate-400">Toll Charges</span>
                    <span className="text-sm font-bold text-brand-text">€ {driverTollCharges.toFixed(2)}</span>
                  </div>
                )}
                {driverExceptionalCosts > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <span className="text-sm font-medium text-slate-400">Exceptional Costs</span>
                    <span className="text-sm font-bold text-brand-text">€ {driverExceptionalCosts.toFixed(2)}</span>
                  </div>
                )}
                {driverFuelCost > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <span className="text-sm font-medium text-slate-400">Fuel Cost</span>
                    <span className="text-sm font-bold text-brand-text">€ {driverFuelCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                  <span className="text-sm font-medium text-slate-400">Added Expenses</span>
                  <span className="text-sm font-bold text-brand-text">€ {extraExpenses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-400">Total Amount</span>
                  <span className="text-lg font-black text-brand-blue">€ {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column (Sidebar Tracking) */}
        <Card className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 p-6 sm:p-8 rounded-[2rem] border-none shadow-sm bg-white flex flex-col">
          <div className="space-y-6">

            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-black text-brand-text leading-none">{orderId}</h1>
                <Badge className={`${statusColor} px-3 py-1 rounded-full text-xs font-bold border-none whitespace-nowrap`}>
                  {statusText}
                </Badge>
              </div>
              <p className="text-sm font-bold text-slate-600 flex items-center gap-2">
                {isHireDriver ? <User className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                {vehicleInfo}
              </p>

              <div className="flex items-center gap-2 text-brand-blue text-sm font-bold mt-2">
                <Clock className="h-4 w-4" />
                <span>{new Date(mission.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Driver Card */}
            {driver ? (
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                    {driver.name ? driver.name.charAt(0).toUpperCase() : 'D'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-0.5">{t.orders.details?.driver || 'Driver'}</p>
                    <p className="font-bold text-brand-text text-sm">{driver.name}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{driver.phone_number || 'N/A'}</p>
                  </div>
                </div>
                <a href={`tel:${driver.phone_number}`} className="h-10 w-10 rounded-full border border-slate-200 text-brand-blue hover:bg-brand-blue-light/50 flex-shrink-0 flex items-center justify-center transition-colors">
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 text-sm font-medium">
                No driver assigned yet
              </div>
            )}

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
                    <p className="font-bold text-brand-text text-sm">Request submitted</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">{new Date(mission.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 relative z-10 pb-6">
                  <div className={`h-6 w-6 rounded-full ${hasDriver ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 text-transparent'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    {hasDriver ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${hasDriver ? 'text-brand-text' : 'text-slate-400'}`}>Driver assigned</p>
                    {hasDriver && <p className="text-xs font-medium text-slate-400 mt-1">Completed</p>}
                  </div>
                </div>

                {/* Step 3 */}
                {!isHireDriver && (
                  <div className="flex gap-4 relative z-10 pb-6">
                    <div className={`h-6 w-6 rounded-full ${isPickupStarted ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 text-transparent'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      {isPickupStarted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${isPickupStarted ? 'text-brand-text' : 'text-slate-400'}`}>
                        {isTransport ? 'Pickup in progress' : isInspection ? 'Inspection started' : 'Service started'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Hire a Driver Specific Daily Check-ins */}
                {isHireDriver && (mission.details?.driverArrivals || []).map((arrival: any, idx: number) => (
                  <div key={idx} className="flex gap-4 relative z-10 pb-6">
                    <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-text text-sm">Arrived: {arrival.date}</p>
                      <p className="text-xs font-medium text-slate-400 mt-1">{new Date(arrival.verifiedAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {isHireDriver && (!mission.details?.driverArrivals || mission.details.driverArrivals.length === 0) && (
                  <div className="flex gap-4 relative z-10 pb-6">
                    <div className={`h-6 w-6 rounded-full ${isPickupStarted ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 text-transparent'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      {isPickupStarted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3.5 w-3.5" />}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${isPickupStarted ? 'text-brand-text' : 'text-slate-400'}`}>
                        Service started
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4 */}
                <div className="flex gap-4 relative z-10 pb-6">
                  <div className={`h-6 w-6 rounded-full ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 text-transparent'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${isCompleted ? 'text-brand-text' : 'text-slate-400'}`}>Completed</p>
                    {isCompleted && mission.updatedAt && <p className="text-xs font-medium text-slate-400 mt-1">{new Date(mission.updatedAt).toLocaleString()}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              {(mission.status === 'PENDING_ADMIN_QUOTE' || mission.status === 'CUSTOMER_REVIEWING_QUOTE') && (
                <Link href={`/dashboard/create-request/${isTransport ? 'transport' : isInspection ? 'inspection' : 'hire-driver'}?editId=${mission._id || id}`} className="block">
                  <Button variant="outline" className="w-full h-12 rounded-2xl border-brand-blue text-brand-blue hover:bg-brand-blue-light font-bold transition-colors">
                    Edit Order
                  </Button>
                </Link>
              )}
              
              {mission.status !== 'CANCELLED' && mission.status !== 'COMPLETED' && (
                <Button 
                  onClick={() => setShowCancelModal(true)}
                  variant="outline" 
                  className="w-full h-12 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold transition-colors"
                >
                  Cancel Order
                </Button>
              )}

              <Link href={`/dashboard/orders/${id}/report`} className="block mt-2">
                <Button className="w-full h-12 rounded-2xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold transition-colors shadow-md shadow-blue-100">
                  View Delivery Report / Proofs
                </Button>
              </Link>
            </div>

          </div>
        </Card>

      </div>

      {/* Cancel Warning Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 sm:p-8 rounded-[2rem] border-none shadow-2xl bg-white animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-brand-text mb-2">Cancel Order?</h3>
            <p className="text-slate-500 mb-6 font-medium">
              Are you sure you want to cancel this mission? This action cannot be undone and drivers will be notified.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                variant="outline"
                className="w-full h-12 rounded-2xl border-slate-200 text-slate-600 font-bold"
              >
                No, keep it
              </Button>
              <Button 
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="w-full h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
