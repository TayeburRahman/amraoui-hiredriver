"use client";

import React from 'react';
import { X, User, Mail, Phone, Building, MapPin, Clock, Car, FileText, CheckCircle2, Download, Eye } from 'lucide-react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 relative">
          <button onClick={onClose} className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-gray-900">REQ-20458</h2>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Pending</span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">Urgent</span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Transport Request</span>
          </div>
          <p className="text-xs text-gray-400">Submitted: Today, 09:40 AM</p>
          <p className="text-sm font-bold text-gray-900 mt-1">Paris → Lyon</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide text-sm">
          
          {/* Customer Details */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Customer Details</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-gray-900">Customer Name:</span> Amraoui
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-gray-900">Email:</span> amraoui@premiummotors.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-gray-900">Phone:</span> +33 6 12 34 56 78
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-gray-900">Company:</span> Premium Motors
              </div>
            </div>
          </div>

          {/* Pickup Information */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Pickup Information</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900">Address:</span>
                  <p>123 Avenue des Champs-Élysées, Paris 75008</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-gray-900">Contact:</span> Jean Dupont - +33 6 11 22 33 44
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-gray-900">Time Slot:</span> 09:00 - 12:00
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-gray-900">Instructions:</span> Call 30 minutes before arrival
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Delivery Information</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900">Address:</span>
                  <p>45 Rue de la République, Lyon 69002</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-gray-900">Contact:</span> Marie Laurent - +33 6 55 66 77 88
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-gray-900">Time Slot:</span> 14:00 - 18:00
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-gray-900">Instructions:</span> Contact receiver first
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Vehicle Details</h3>
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
              <div className="flex items-center gap-2 mb-2">
                <Car className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-gray-900 text-sm">BMW X5</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                <div><span className="font-bold text-gray-900">License Plate:</span> AB-123-CD</div>
                <div><span className="font-bold text-gray-900">VIN:</span> WBADE6320XBW00123</div>
                <div><span className="font-bold text-gray-900">Engine:</span> Gasoline</div>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Special Instructions</h3>
            <div className="flex gap-2 flex-wrap text-xs">
              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-medium">Call before pickup</span>
              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-medium">Handle carefully</span>
              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-medium">Documents inside vehicle</span>
            </div>
          </div>

          {/* Documents & Photos */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Documents & Photos</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100 text-xs">
                <div>
                  <p className="font-bold text-gray-900">vehicle-photo-front.jpg</p>
                  <p className="text-gray-400">image/jpeg • 2.3 MB</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Uploaded</span>
                  <button className="text-blue-600 font-medium"><Eye className="w-4 h-4" /></button>
                  <button className="text-blue-600 font-medium"><Download className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100 text-xs">
                <div>
                  <p className="font-bold text-gray-900">registration-document.pdf</p>
                  <p className="text-gray-400">application/pdf • 1.1 MB</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Uploaded</span>
                  <button className="text-blue-600 font-medium"><Eye className="w-4 h-4" /></button>
                  <button className="text-blue-600 font-medium"><Download className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100 text-xs">
                <div>
                  <p className="font-bold text-gray-900">insurance-proof.pdf</p>
                  <p className="text-gray-400">application/pdf • 850 KB</p>
                </div>
                <div>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Missing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Note */}
          <div>
            <p className="font-bold text-gray-900 mb-2 text-xs">Admin Note</p>
            <textarea 
              className="w-full p-3 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add internal note for this request..."
            ></textarea>
            <button className="mt-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
              Save Note
            </button>
          </div>

          {/* Request Timeline */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Request Timeline</h3>
            <div className="space-y-4 relative before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-green-500">
              <div className="relative pl-7 text-xs flex flex-col gap-0.5">
                <span className="absolute left-0 top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </span>
                <span className="font-medium text-gray-900">Request submitted</span>
                <span className="text-gray-400">Today, 09:40 AM</span>
              </div>
              <div className="relative pl-7 text-xs flex flex-col gap-0.5">
                <span className="absolute left-0 top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Clock className="w-2.5 h-2.5 text-white" />
                </span>
                <span className="font-medium text-gray-900">Admin reviewing</span>
                <span className="text-gray-400">Current step</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3 text-xs">
          <button onClick={onClose} className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
            Reject Request
          </button>
          <button className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
            Accept Request
          </button>
        </div>
      </div>
    </div>
  );
};
