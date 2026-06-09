"use client";

import React from 'react';
import { X, FileText, CheckCircle2, Download } from 'lucide-react';

interface OrderDocumentModalProps {
  vehicle: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDocumentModal: React.FC<OrderDocumentModalProps> = ({ vehicle, isOpen, onClose }) => {
  if (!isOpen || !vehicle) return null;

  const documentChecklist = [
    { name: 'Vehicle Photos', status: 'Complete' },
    { name: 'Registration Document', status: 'Complete' },
    { name: 'Pickup Inspection Photos', status: 'Complete' },
    { name: 'Delivery Inspection Photos', status: 'Complete' },
    { name: 'Mileage/Fuel Proof', status: 'Complete' },
    { name: 'Signature Report', status: 'Complete' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-8 pb-4 relative">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Vehicle Details</h2>
          <p className="text-sm text-gray-400">View vehicle information and documents</p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
          
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
              {documentChecklist.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold text-gray-700">{doc.name}</span>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-green-50 text-green-600 rounded-lg">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase">{doc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions - Removed Upload Document as requested */}
          <div className="pt-2">
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-colors border border-gray-100">
              <Download className="w-4 h-4" />
              Download All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
