"use client";

import React, { useState, useEffect, use } from 'react';
import { X, Image as ImageIcon, ArrowLeft, ArrowRight, Download, CheckCircle2, AlertTriangle, FileText, User } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { formatDate, formatDateTime } from '@/lib/dateUtils';

export default function InspectionDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [request, setRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("");
  const [tabs, setTabs] = useState<string[]>([]);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await apiFetch<any>(`/requests/${id}`, { auth: true });
        if (res.ok && res.data?.success) {
          const reqData = res.data.data;
          setRequest(reqData);

          // Build dynamic tabs
          const pickupExt = reqData.details?.pickupInspection?.exteriorPhotos || {};
          const pickupInt = reqData.details?.pickupInspection?.interiorPhotos || {};
          const deliveryExt = reqData.details?.deliveryInspection?.exteriorPhotos || {};
          const deliveryInt = reqData.details?.deliveryInspection?.interiorPhotos || {};

          const allKeys = new Set([
            ...Object.keys(pickupExt),
            ...Object.keys(pickupInt),
            ...Object.keys(deliveryExt),
            ...Object.keys(deliveryInt)
          ]);
          allKeys.delete('updatedAt');

          const tabList = Array.from(allKeys);
          tabList.push('Others');
          setTabs(tabList);
          if (tabList.length > 0) {
            setActiveTab(tabList[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch request", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center flex-col gap-4">
        <p className="text-gray-500 font-medium">Mission report not found.</p>
        <Link href="/inspections-reports" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          Go Back
        </Link>
      </div>
    );
  }

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  let vehicle = 'N/A';
  if (request.type === 'TRANSPORT') vehicle = `${request.details?.make || ''} ${request.details?.model || ''}`.trim() || 'N/A';
  else if (request.type === 'INSPECTION') vehicle = `${request.details?.vehicleBrand || ''} ${request.details?.vehicleModel || ''}`.trim() || 'N/A';

  const pickupDate = request.details?.pickupVerification?.verifiedAt ? formatDateTime(request.details.pickupVerification.verifiedAt) : 'Pending';
  const deliveryDateRaw = request.details?.deliveryArrivalTime || request.details?.deliveryInspection?.driverConfirmation?.updatedAt;
  const deliveryDate = deliveryDateRaw ? formatDateTime(deliveryDateRaw) : 'Pending';

  const pickupExt = request.details?.pickupInspection?.exteriorPhotos || {};
  const pickupInt = request.details?.pickupInspection?.interiorPhotos || {};
  const deliveryExt = request.details?.deliveryInspection?.exteriorPhotos || {};
  const deliveryInt = request.details?.deliveryInspection?.interiorPhotos || {};

  const currentPickupPhoto = pickupExt[activeTab] || pickupInt[activeTab];
  const currentDeliveryPhoto = deliveryExt[activeTab] || deliveryInt[activeTab];

  // Others data
  const pickupDamage = request.details?.pickupInspection?.damageReport?.status || 'Pending';
  const deliveryDamage = request.details?.deliveryInspection?.damageReport?.status || 'Pending';
  const pickupMileage = request.details?.pickupInspection?.mileageAndFuel?.mileage || 0;
  const deliveryMileage = request.details?.deliveryInspection?.mileageAndFuel?.mileage || 0;
  const mileageDiff = deliveryMileage - pickupMileage;
  const pickupFuel = request.details?.pickupInspection?.mileageAndFuel?.fuelLevel || 'N/A';
  const deliveryFuel = request.details?.deliveryInspection?.mileageAndFuel?.fuelLevel || 'N/A';

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 relative">
          <Link href="/inspections-reports" className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Link>
          <h2 className="text-xl font-bold text-gray-900">Compare Pickup vs Delivery</h2>
          <p className="text-xs text-gray-400">Mission #{request.missionId} • {vehicle}</p>
        </div>

        {/* Tabs */}
        <div className="px-6 py-3 border-b border-gray-100 overflow-x-auto flex gap-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {activeTab !== "Others" ? (
            /* Layout 1: Photos */
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Pickup */}
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-4 text-white">
                    <p className="text-sm font-bold">Pickup</p>
                    <p className="text-xs opacity-80">{pickupDate}</p>
                  </div>
                  <div className="p-4 bg-gray-50/50 flex flex-col items-center justify-center min-h-[300px]">
                    {currentPickupPhoto ? (
                      <a href={currentPickupPhoto} target="_blank" rel="noreferrer">
                        <img src={currentPickupPhoto} alt={activeTab} className="max-h-[300px] object-contain rounded-lg shadow-sm hover:opacity-90 transition-opacity" />
                      </a>
                    ) : (
                      <div className="flex flex-col items-center opacity-50">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span className="text-xs">No photo uploaded</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery */}
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-400 p-4 text-white">
                    <p className="text-sm font-bold">Delivery</p>
                    <p className="text-xs opacity-80">{deliveryDate}</p>
                  </div>
                  <div className="p-4 bg-gray-50/50 flex flex-col items-center justify-center min-h-[300px]">
                    {currentDeliveryPhoto ? (
                      <a href={currentDeliveryPhoto} target="_blank" rel="noreferrer">
                        <img src={currentDeliveryPhoto} alt={activeTab} className="max-h-[300px] object-contain rounded-lg shadow-sm hover:opacity-90 transition-opacity" />
                      </a>
                    ) : (
                      <div className="flex flex-col items-center opacity-50">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span className="text-xs">No photo uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Layout 2: Others */
            <div className="space-y-6 text-xs">
              <p className="text-xs font-bold text-gray-900 mb-1">Other Inspection Details</p>
              <p className="text-xs text-gray-400 mb-4">Additional proof, damage report, mileage, fuel, documents, signature and delivery verification.</p>

              <div className="grid grid-cols-2 gap-6">
                {/* Pickup Column */}
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <div className="bg-blue-500 p-3 text-white">
                      <p className="font-bold">Pickup</p>
                      <p className="text-[10px] opacity-80">{pickupDate}</p>
                    </div>
                    <div className="p-4 space-y-3 bg-white">
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Damage Report</p>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Damage Status</span>
                          <span className="font-bold text-gray-900">{pickupDamage}</span>
                        </div>
                        {request.details?.pickupInspection?.damageReport?.damageDescription && (
                          <div className="mt-1 p-2 bg-gray-50 rounded text-gray-600 text-[11px]">
                            {request.details.pickupInspection.damageReport.damageDescription}
                          </div>
                        )}
                        {request.details?.pickupInspection?.damageReport?.damagePhotos && (
                          <div className="flex gap-2 mt-2 overflow-x-auto">
                            {request.details.pickupInspection.damageReport.damagePhotos.map((p: string, i: number) => (
                              <a key={i} href={p} target="_blank" rel="noreferrer">
                                <img src={p} className="h-10 w-10 object-cover rounded shadow-sm" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <hr className="border-gray-100" />
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Mileage & Fuel Proof</p>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Mileage</span>
                          <span className="font-bold text-gray-900">{pickupMileage} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Fuel Level</span>
                          <span className="font-bold text-gray-900">{pickupFuel}</span>
                        </div>
                        {request.details?.pickupInspection?.mileageAndFuel?.dashboardPhoto && (
                          <a href={request.details.pickupInspection.mileageAndFuel.dashboardPhoto} target="_blank" rel="noreferrer" className="text-blue-500 mt-1 block">View Dashboard Photo</a>
                        )}
                      </div>
                      <hr className="border-gray-100" />
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Customer Signature</p>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Customer Name</span>
                          <span className="font-bold text-gray-900">{request.details?.pickupInspection?.signatureAndConfirmation?.customerName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Signature Status</span>
                          <span className={`${request.details?.pickupInspection?.signatureAndConfirmation?.signaturePhoto ? 'text-green-600' : 'text-gray-400'} font-medium`}>
                            {request.details?.pickupInspection?.signatureAndConfirmation?.signaturePhoto ? 'Signed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Column */}
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <div className="bg-green-500 p-3 text-white">
                      <p className="font-bold">Delivery</p>
                      <p className="text-[10px] opacity-80">{deliveryDate}</p>
                    </div>
                    <div className="p-4 space-y-3 bg-white">
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Delivery Damage Report</p>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status</span>
                          <span className="font-bold text-gray-900">{deliveryDamage}</span>
                        </div>
                        {request.details?.deliveryInspection?.damageReport?.damageDescription && (
                          <div className="mt-1 p-2 bg-yellow-50 rounded text-gray-600 text-[11px]">
                            {request.details.deliveryInspection.damageReport.damageDescription}
                          </div>
                        )}
                        {request.details?.deliveryInspection?.damageReport?.damagePhotos && (
                          <div className="flex gap-2 mt-2 overflow-x-auto">
                            {request.details.deliveryInspection.damageReport.damagePhotos.map((p: string, i: number) => (
                              <a key={i} href={p} target="_blank" rel="noreferrer">
                                <img src={p} className="h-10 w-10 object-cover rounded shadow-sm" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <hr className="border-gray-100" />
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Final Mileage & Fuel</p>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Mileage</span>
                          <span className="font-bold text-gray-900">{deliveryMileage} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Fuel Level</span>
                          <span className="font-bold text-gray-900">{deliveryFuel}</span>
                        </div>
                        <div className="flex justify-between text-blue-600 font-medium mt-1">
                          <span>Mileage Change</span>
                          <span>+{mileageDiff > 0 ? mileageDiff : 0} km</span>
                        </div>
                      </div>
                      <hr className="border-gray-100" />
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Customer Signature</p>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Customer Name</span>
                          <span className="font-bold text-gray-900">{request.details?.deliveryInspection?.customerSignature?.customerName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Signature Status</span>
                          <span className={`${request.details?.deliveryInspection?.customerSignature?.signaturePhoto ? 'text-green-600' : 'text-gray-400'} font-medium`}>
                            {request.details?.deliveryInspection?.customerSignature?.signaturePhoto ? 'Signed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Info & Proof Overview */}
              <div className="grid grid-cols-2 gap-6 text-xs mt-4">
                {/* Vehicle Info */}
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <p className="font-bold text-gray-900 mb-3">Vehicle Info</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vehicle:</span>
                      <span className="font-bold text-gray-900">{vehicle}</span>
                    </div>
                    {request.type === 'TRANSPORT' && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">License Plate:</span>
                        <span className="font-bold text-gray-900">{request.details?.licensePlate || 'N/A'}</span>
                      </div>
                    )}
                    {request.type === 'INSPECTION' && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">VIN:</span>
                        <span className="font-bold text-gray-900">{request.details?.vin || 'N/A'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Proof Overview */}
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col justify-center items-center gap-2">
                  <p className="font-bold text-gray-900">Overall Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    request.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-white">
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={tabs.indexOf(activeTab) === 0}
              className={`px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${tabs.indexOf(activeTab) === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={handleNext}
              disabled={tabs.indexOf(activeTab) === tabs.length - 1}
              className={`px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${tabs.indexOf(activeTab) === tabs.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1">
            <Download className="w-4 h-4" /> Download Report
          </button>
        </div>
      </div>
    </div>
  );
}