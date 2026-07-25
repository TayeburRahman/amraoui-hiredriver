"use client";

import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Download, Eye, ArrowLeft, ImageIcon } from 'lucide-react';
import { getProfileImageUrl } from '@/lib/api';

interface OrderDocumentModalProps {
  vehicle: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const categoryTypeMap: Record<string, string[]> = {
  'Vehicle Photos': ['Vehicle_Photo'],
  'Registration Document': ['Registration_Document'],
  'Pickup Inspection Photos': ['Pickup_Inspection', 'Pickup_Exterior_Photo', 'Pickup_Interior_Photo', 'Pickup_Damage_Photo', 'Pickup_Damage_Component'],
  'Delivery Inspection Photos': ['Delivery_Inspection', 'Delivery_Exterior_Photo', 'Delivery_Interior_Photo', 'Delivery_Damage_Photo', 'Delivery_Damage_Component'],
  'Mileage/Fuel Proof': ['Pickup_Odometer', 'Pickup_Fuel'],
  'Signature Report': ['Pickup_Signature', 'Delivery_Signature']
};

export const OrderDocumentModal: React.FC<OrderDocumentModalProps> = ({ vehicle, isOpen, onClose }) => {
  const [viewingCategory, setViewingCategory] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  if (!isOpen || !vehicle) return null;

  const documentChecklist = vehicle.documentChecklist || [
    { name: 'Vehicle Photos', status: 'Pending' },
    { name: 'Registration Document', status: 'Pending' },
    { name: 'Pickup Inspection Photos', status: 'Pending' },
    { name: 'Delivery Inspection Photos', status: 'Pending' },
    { name: 'Mileage/Fuel Proof', status: 'Pending' },
    { name: 'Signature Report', status: 'Pending' },
  ];

  const getMatchedDocs = (categoryName: string) => {
    const types = categoryTypeMap[categoryName] || [];
    return vehicle.documents?.filter((d: any) => typeof d === 'object' && types.includes(d.type)) || [];
  };

  const handleDownloadCategory = async (categoryName: string) => {
    const matchedDocs = getMatchedDocs(categoryName);
    if (matchedDocs.length === 0) return;

    setIsDownloading(categoryName);
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow z-[9999]';
    toast.innerText = `Preparing ${categoryName} downloads...`;
    document.body.appendChild(toast);

    for (let i = 0; i < matchedDocs.length; i++) {
      const docItem = matchedDocs[i];
      const url = docItem?.url || '';
      const docType = docItem?.type || 'Document';
      const fullUrl = getProfileImageUrl(url);
      
      if (!fullUrl) continue;

      try {
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error("Network response was not ok");
        const blob = await response.blob();
        
        let ext = fullUrl.split('.').pop()?.split(/[#?]/)[0] || 'pdf';
        if (ext.length > 5) ext = 'pdf'; 
        
        const mType = vehicle.missionType || 'MISSION';
        const mId = vehicle.mission || 'ID';
        const fileName = `${mType}_${mId}_${docType}_${i+1}.${ext}`.replace(/\s+/g, '_');
        
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        
        await new Promise(res => setTimeout(res, 400));
      } catch (error) {
        console.error("Failed to download via fetch, opening tab instead", error);
        window.open(fullUrl, '_blank');
      }
    }
    
    document.body.removeChild(toast);
    setIsDownloading(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-8 pb-4 relative">
          <button 
            onClick={() => {
              if (viewingCategory) setViewingCategory(null);
              else onClose();
            }}
            className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {viewingCategory ? (
            <div className="flex items-center gap-3">
              <button onClick={() => setViewingCategory(null)} className="p-1 -ml-1 rounded hover:bg-gray-100 text-gray-500">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{viewingCategory}</h2>
                <p className="text-xs text-gray-400">{getMatchedDocs(viewingCategory).length} document(s)</p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Vehicle Details</h2>
              <p className="text-sm text-gray-400">View vehicle information and documents</p>
            </>
          )}
        </div>

        {/* Content */}
        <div className="px-8 pb-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
          
          {!viewingCategory ? (
            <>
              {/* Vehicle Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">{vehicle.brandModel} 2023</h3>
                <p className="text-sm text-gray-500 font-medium">{vehicle.licensePlate}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-50/50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Type</p>
                  <p className="text-sm font-bold text-gray-900">{vehicle.type}</p>
                </div>
                <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-50/50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Engine</p>
                  <p className="text-sm font-bold text-gray-900">{vehicle.engine}</p>
                </div>
              </div>

              <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-50/50">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">VIN</p>
                <p className="text-sm font-bold text-gray-900 tracking-wider">{vehicle.vin}</p>
              </div>

              <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-50/50">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Customer</p>
                <p className="text-sm font-bold text-gray-900">{vehicle.customer}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-1">Mission: {vehicle.mission}</p>
              </div>

              {/* Document Checklist */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4">Document Checklist</h4>
                <div className="space-y-2">
                  {documentChecklist.filter((d: any) => d.status === 'Complete').length === 0 && (
                    <p className="text-sm text-gray-500 italic">No documents available yet.</p>
                  )}
                  {documentChecklist.filter((d: any) => d.status === 'Complete').map((doc: any, index: number) => {
                    const matched = getMatchedDocs(doc.name);
                    const hasDocs = matched.length > 0;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-white hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-semibold text-gray-700">{doc.name}</span>
                        </div>
                        
                        {hasDocs ? (
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => setViewingCategory(doc.name)}
                              className="px-2.5 py-1.5 text-[10px] font-bold uppercase bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> View
                            </button>
                            <button 
                              onClick={() => handleDownloadCategory(doc.name)}
                              disabled={isDownloading === doc.name}
                              className="px-2.5 py-1.5 text-[10px] font-bold uppercase bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                              {isDownloading === doc.name ? (
                                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Download className="w-3 h-3" />
                              )}
                              Download
                            </button>
                          </div>
                        ) : (
                          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-400`}>
                            <span className="text-[10px] font-bold uppercase">No Files</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Document Viewer Grid */
            <div className="grid grid-cols-2 gap-4">
              {getMatchedDocs(viewingCategory).map((doc: any, idx: number) => {
                const fullUrl = getProfileImageUrl(doc.url) || '';
                if (!fullUrl) return null;
                const isPdf = fullUrl.toLowerCase().includes('.pdf');
                
                return (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-square flex flex-col items-center justify-center">
                    {isPdf ? (
                      <div className="flex flex-col items-center gap-2 text-red-400">
                        <FileText className="w-12 h-12" />
                        <span className="text-xs font-medium">PDF Document</span>
                      </div>
                    ) : (
                      <img src={fullUrl} alt={doc.type} className="w-full h-full object-cover" />
                    )}
                    
                    <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <a 
                        href={fullUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-white text-gray-900 text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-gray-100"
                      >
                        <Eye className="w-3 h-3" /> Full Size
                      </a>
                      <p className="text-[9px] text-white/80 uppercase font-medium mt-2 max-w-[90%] truncate text-center">
                        {doc.type.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
