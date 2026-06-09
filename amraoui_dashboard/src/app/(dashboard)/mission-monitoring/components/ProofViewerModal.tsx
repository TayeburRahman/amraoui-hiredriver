"use client";

import React, { useState } from 'react';
import { X, CheckCircle2, Download, Image as ImageIcon, FileText } from 'lucide-react';

interface ProofViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProofViewerModal: React.FC<ProofViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("Pickup Exterior");
  const [selectedThumb, setSelectedThumb] = useState(1);

  if (!isOpen) return null;

  const tabs = [
    "Pickup Exterior", "Pickup Interior", "Delivery Exterior", 
    "Delivery Interior", "Mileage/Fuel", "Damage", 
    "Signatures", "Driver Selfie", "Expense Receipts"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Proof Viewer</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-3 border-b border-gray-100 overflow-x-auto flex gap-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Thumbnails Sidebar */}
          <div className="w-40 border-r border-gray-100 p-4 space-y-3 overflow-y-auto">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Thumbnails</p>
            {[1, 2, 3, 4].map(num => (
              <div
                key={num}
                onClick={() => setSelectedThumb(num)}
                className={`aspect-video bg-gray-50 rounded-lg border flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 transition-colors ${
                  selectedThumb === num ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
                }`}
              >
                <ImageIcon className="w-5 h-5 text-gray-300 mb-1" />
                <span className="text-xs text-gray-400">Photo {num}</span>
              </div>
            ))}
          </div>

          {/* Main Preview */}
          <div className="flex-1 bg-gray-50/50 p-6 flex items-center justify-center overflow-auto">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-lg w-full text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Proof Image Preview</h3>
              <p className="text-xs text-gray-400">Select a thumbnail to view the image</p>
            </div>
          </div>

          {/* Metadata Sidebar */}
          <div className="w-64 border-l border-gray-100 p-6 space-y-4 overflow-y-auto text-xs">
            <p className="text-[10px] uppercase font-bold text-gray-400">Metadata</p>
            
            <div>
              <p className="text-gray-400 mb-1">File Label</p>
              <p className="font-bold text-gray-900">pickup_exterior_1.jpg</p>
            </div>
            
            <div>
              <p className="text-gray-400 mb-1">Uploaded By</p>
              <p className="font-bold text-gray-900">James Davis (Driver)</p>
            </div>
            
            <div>
              <p className="text-gray-400 mb-1">Upload Time</p>
              <p className="font-bold text-gray-900">14 May, 08:45 AM</p>
            </div>
            
            <div>
              <p className="text-gray-400 mb-1">GPS Location</p>
              <p className="font-bold text-gray-900">Casablanca, Morocco</p>
            </div>
            
            <div>
              <p className="text-gray-400 mb-1">Mission Stage</p>
              <p className="font-bold text-gray-900">Pickup Inspection</p>
            </div>
            
            <div>
              <p className="text-gray-400 mb-1">Verification Status</p>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Verified</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-white">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
              Mark Verified
            </button>
            <button className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
              Request Re-upload
            </button>
          </div>
          <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1">
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>
    </div>
  );
};
