"use client";

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface ProofViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission?: any;
}

type ProofImage = {
  url: string;
  label: string;
};

type TabData = {
  id: string;
  images: ProofImage[];
};

export const ProofViewerModal: React.FC<ProofViewerModalProps> = ({ isOpen, onClose, mission }) => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedThumb, setSelectedThumb] = useState<number>(0);
  const [tabsData, setTabsData] = useState<TabData[]>([]);

  useEffect(() => {
    if (isOpen && mission?.raw?.details) {
      const d = mission.raw.details;
      const tabs: TabData[] = [];

      const addTab = (id: string, images: ProofImage[]) => {
        const validImages = images.filter(img => img.url && img.url !== 'null' && img.url !== '');
        if (validImages.length > 0) {
          tabs.push({ id, images: validImages });
        }
      };

      if (d.pickupInspection?.exteriorPhotos) {
        addTab("Pickup Exterior", Object.entries(d.pickupInspection.exteriorPhotos)
          .filter(([k]) => k !== 'updatedAt')
          .map(([k, v]) => ({ url: v as string, label: k })));
      }
      if (d.pickupInspection?.interiorPhotos) {
        addTab("Pickup Interior", Object.entries(d.pickupInspection.interiorPhotos)
          .filter(([k]) => k !== 'updatedAt')
          .map(([k, v]) => ({ url: v as string, label: k })));
      }
      if (d.deliveryInspection?.exteriorPhotos) {
        addTab("Delivery Exterior", Object.entries(d.deliveryInspection.exteriorPhotos)
          .filter(([k]) => k !== 'updatedAt')
          .map(([k, v]) => ({ url: v as string, label: k })));
      }
      if (d.deliveryInspection?.interiorPhotos) {
        addTab("Delivery Interior", Object.entries(d.deliveryInspection.interiorPhotos)
          .filter(([k]) => k !== 'updatedAt')
          .map(([k, v]) => ({ url: v as string, label: k })));
      }

      const mileageImgs: ProofImage[] = [];
      if (d.pickupInspection?.mileageAndFuel?.odometerPhoto) mileageImgs.push({ url: d.pickupInspection.mileageAndFuel.odometerPhoto, label: "Odometer (Pickup)" });
      if (d.pickupInspection?.mileageAndFuel?.fuelGaugePhoto) mileageImgs.push({ url: d.pickupInspection.mileageAndFuel.fuelGaugePhoto, label: "Fuel Gauge (Pickup)" });
      if (d.deliveryInspection?.mileageAndFuel?.odometerPhoto) mileageImgs.push({ url: d.deliveryInspection.mileageAndFuel.odometerPhoto, label: "Odometer (Delivery)" });
      if (d.deliveryInspection?.mileageAndFuel?.fuelGaugePhoto) mileageImgs.push({ url: d.deliveryInspection.mileageAndFuel.fuelGaugePhoto, label: "Fuel Gauge (Delivery)" });
      addTab("Mileage/Fuel", mileageImgs);

      const damageImgs: ProofImage[] = [];
      if (d.pickupInspection?.damageReport?.photo) damageImgs.push({ url: d.pickupInspection.damageReport.photo, label: "Damage (Pickup)" });
      if (d.deliveryInspection?.damageReport?.photo) damageImgs.push({ url: d.deliveryInspection.damageReport.photo, label: "Damage (Delivery)" });
      addTab("Damage", damageImgs);

      const sigImgs: ProofImage[] = [];
      if (d.pickupInspection?.customerSignature?.signaturePhoto) sigImgs.push({ url: d.pickupInspection.customerSignature.signaturePhoto, label: "Customer (Pickup)" });
      if (d.deliveryInspection?.customerSignature?.signaturePhoto) sigImgs.push({ url: d.deliveryInspection.customerSignature.signaturePhoto, label: "Customer (Delivery)" });
      if (d.pickupInspection?.driverConfirmation?.driverSignaturePhoto) sigImgs.push({ url: d.pickupInspection.driverConfirmation.driverSignaturePhoto, label: "Driver (Pickup)" });
      if (d.deliveryInspection?.driverConfirmation?.driverSignaturePhoto) sigImgs.push({ url: d.deliveryInspection.driverConfirmation.driverSignaturePhoto, label: "Driver (Delivery)" });
      addTab("Signatures", sigImgs);

      const selfieImgs: ProofImage[] = [];
      if (d.pickupInspection?.driverConfirmation?.driverSelfiePhoto) selfieImgs.push({ url: d.pickupInspection.driverConfirmation.driverSelfiePhoto, label: "Driver Selfie (Pickup)" });
      if (d.deliveryInspection?.driverConfirmation?.driverSelfiePhoto) selfieImgs.push({ url: d.deliveryInspection.driverConfirmation.driverSelfiePhoto, label: "Driver Selfie (Delivery)" });
      addTab("Driver Selfie", selfieImgs);

      const docImgs: ProofImage[] = [];
      if (Array.isArray(d.pickupInspection?.uploadDocuments)) {
        d.pickupInspection.uploadDocuments.forEach((doc: string, i: number) => docImgs.push({ url: doc, label: `Doc (Pickup) ${i + 1}` }));
      }
      if (Array.isArray(d.deliveryInspection?.uploadDocuments)) {
        d.deliveryInspection.uploadDocuments.forEach((doc: string, i: number) => docImgs.push({ url: doc, label: `Doc (Delivery) ${i + 1}` }));
      }
      addTab("Documents", docImgs);

      const idImgs: ProofImage[] = [];
      if (d.deliveryInspection?.receiverIdVerification?.idFront) idImgs.push({ url: d.deliveryInspection.receiverIdVerification.idFront, label: "ID Front" });
      if (d.deliveryInspection?.receiverIdVerification?.idBack) idImgs.push({ url: d.deliveryInspection.receiverIdVerification.idBack, label: "ID Back" });
      addTab("ID Verification", idImgs);

      setTabsData(tabs);
      if (tabs.length > 0) {
        setActiveTab(tabs[0].id);
        setSelectedThumb(0);
      }
    }
  }, [isOpen, mission]);

  if (!isOpen) return null;

  const activeTabData = tabsData.find(t => t.id === activeTab);
  const safeThumbIndex = activeTabData && selectedThumb < activeTabData.images.length ? selectedThumb : 0;
  const selectedImage = activeTabData?.images[safeThumbIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Mission Proof Viewer</h2>
            {/* <p className="text-sm text-gray-500 mt-1">Request ID: {mission?.requestId || mission?.id || 'Unknown'}</p> */}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        {tabsData.length > 0 ? (
          <div className="px-6 py-4 border-b border-gray-100 overflow-x-auto flex gap-3 scrollbar-hide bg-gray-50">
            {tabsData.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedThumb(0);
                }}
                className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
              >
                {tab.id} <span className="ml-1.5 opacity-80 text-xs">({tab.images.length})</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500 text-lg">
            No valid proof images have been submitted for this mission yet.
          </div>
        )}

        {/* Content Area */}
        {tabsData.length > 0 && activeTabData && selectedImage && (
          <div className="flex-1 flex flex-col md:flex-row min-h-[500px] overflow-hidden bg-white">

            {/* Thumbnails */}
            <div className="w-full md:w-56 border-r border-gray-200 p-4 overflow-y-auto flex md:flex-col gap-3 bg-gray-50">
              <p className="text-xs uppercase font-bold text-gray-500 mb-2 hidden md:block px-1">Images ({activeTabData.images.length})</p>
              {activeTabData.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedThumb(idx)}
                  className={`relative aspect-video w-32 md:w-full bg-white rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-200 ${selectedThumb === idx ? 'border-2 border-blue-600 shadow-md scale-100' : 'border border-gray-200 hover:border-blue-400 hover:shadow-sm scale-95'
                    }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-end justify-center p-2 opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-xs text-white font-bold text-center truncate w-full">{img.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Preview */}
            <div className="flex-1 bg-gray-900 flex flex-col items-center justify-center relative p-6">
              <img
                src={selectedImage.url}
                alt={selectedImage.label}
                className="max-w-full max-h-full object-contain rounded-md"
              />
            </div>

            {/* Metadata */}
            <div className="w-full md:w-72 border-l border-gray-200 p-6 space-y-6 overflow-y-auto bg-white">
              <p className="text-sm uppercase font-bold text-blue-700 border-b pb-2">Image Details</p>

              <div>
                <p className="text-gray-500 text-xs mb-1 uppercase font-semibold">Label</p>
                <p className="font-bold text-gray-900 text-lg">{selectedImage.label}</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs mb-1 uppercase font-semibold">Category</p>
                <span className="px-3 py-1.5 bg-blue-50 text-blue-800 rounded-md font-medium text-sm inline-block">{activeTabData.id}</span>
              </div>

              <div>
                <p className="text-gray-500 text-xs mb-2 uppercase font-semibold">Driver</p>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{mission?.driver || mission?.raw?.assignedDriverId?.name || 'Unknown'}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-xs mb-2 uppercase font-semibold">Status</p>
                <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg font-bold flex items-center w-fit gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Verified
                </span>
              </div>

              <div className="pt-4 mt-6 border-t border-gray-100">
                <a
                  href={selectedImage.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Open Full Image
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
