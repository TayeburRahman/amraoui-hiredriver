"use client";

import React from 'react';
import { X, User, Mail, Phone, Building, MapPin, Calendar, Clock, FileText, CheckCircle2, Download, Car, Copy, ExternalLink, File, Truck, Wrench, UserPlus, FileCheck } from 'lucide-react';

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: any;
}

export const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({ isOpen, onClose, request }) => {
  if (!isOpen || !request) return null;

  const renderContent = () => {
    const type = request.type?.toLowerCase();
    if (type?.includes("transport")) {
      return renderTransportRequest();
    } else if (type?.includes("inspection")) {
      return renderTechnicalInspection();
    } else if (type?.includes("driver")) {
      return renderHireADriver();
    }
    return <div>Unknown request type</div>;
  };

  const renderTransportRequest = () => {
    return (
      <div className="space-y-6 text-sm">
        {/* Header Info */}
        <div className="border-b border-gray-100 pb-4">
          <p className="text-gray-400 text-xs">Submitted: Today, 09:40 AM</p>
          <p className="font-bold text-lg text-gray-900 mt-1">Paris → Lyon</p>
        </div>

        {/* Customer Details */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Customer Details</h3>
          <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Customer Name</p>
                <p className="font-medium text-gray-900">{request.customer || "Amraoui"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-medium text-gray-900">amraoui@premiumMotors.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="font-medium text-gray-900">+33 6 12 34 56 78</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Company</p>
                <p className="font-medium text-gray-900">{request.company || "Premium Motors"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pickup Information */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Pickup Information</h3>
          <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Address</p>
                <p className="font-medium text-gray-900">123 Avenue des Champs-Élysées, Paris 75008</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600"><Copy className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Contact</p>
                <p className="font-medium text-gray-900">Jean Dupont - +33 6 11 22 33 44</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Time Slot</p>
                <p className="font-medium text-gray-900">09:00 - 12:00</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Instructions</p>
                <p className="font-medium text-gray-900">Call 30 minutes before arrival</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Delivery Information</h3>
          <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Address</p>
                <p className="font-medium text-gray-900">456 Rue de la République, Lyon 69002</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600"><Copy className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Contact</p>
                <p className="font-medium text-gray-900">Marie Laurent - +33 6 55 66 77 88</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Time Slot</p>
                <p className="font-medium text-gray-900">14:00 - 18:00</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Instructions</p>
                <p className="font-medium text-gray-900">Contact receiver first</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Vehicle Details</h3>
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <Car className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-bold text-gray-900">{request.vehicle || "BMW X5"}</p>
                <p className="text-xs text-gray-500">License Plate: AB-123-CD</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-400">VIN</p>
                <p className="font-medium text-gray-900">WBADE6320XBW00123</p>
              </div>
              <div>
                <p className="text-gray-400">Engine</p>
                <p className="font-medium text-gray-900">Gasoline</p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Special Instructions</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Call before pickup</span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Handle carefully</span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Documents inside vehicle</span>
          </div>
        </div>

        {/* Documents & Photos */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Documents & Photos</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">vehicle-photo-front.jpg</p>
                  <p className="text-xs text-gray-400">image/jpeg • 2.3 MB</p>
                </div>
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">Uploaded</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">registration-document.pdf</p>
                  <p className="text-xs text-gray-400">application/pdf • 1.1 MB</p>
                </div>
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">Uploaded</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">insurance-proof.pdf</p>
                  <p className="text-xs text-gray-400">application/pdf • 850 KB</p>
                </div>
              </div>
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-lg">Missing</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTechnicalInspection = () => {
    return (
      <div className="space-y-6 text-sm">
        {/* Header Info */}
        <div className="border-b border-gray-100 pb-4">
          <p className="text-gray-400 text-xs">Submitted: Today, 09:40 AM</p>
          <p className="font-bold text-lg text-gray-900 mt-1">Technical Inspection Request</p>
        </div>

        {/* Customer Details */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Customer Details</h3>
          <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Customer Name</p>
                <p className="font-medium text-gray-900">{request.customer || "Amraoui"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="font-medium text-gray-900">+33 6 12 34 56 78</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-medium text-gray-900">amraoui@premiumMotors.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Vehicle Details</h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <div>
              <p className="text-xs text-gray-400">Vehicle Brand</p>
              <p className="font-medium text-gray-900">BMW</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Vehicle Model</p>
              <p className="font-medium text-gray-900">X5</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">License Plate</p>
              <p className="font-medium text-gray-900">AB-123-CD</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">VIN Number</p>
              <p className="font-medium text-gray-900">WBADE6320XBW00123</p>
            </div>
          </div>
        </div>

        {/* Inspection Type */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Inspection Type</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Yearly inspection
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Re-inspection</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Towbar inspection</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Inspection after accident</span>
          </div>
        </div>

        {/* Inspection Location & Date */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Inspection Location & Date</h3>
          <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Inspection Location</p>
                <p className="font-medium text-gray-900">Premium Motors Inspection Center, Paris</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Inspection Date</p>
                <p className="font-medium text-gray-900">24 Apr 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Preferred Time</p>
                <p className="font-medium text-gray-900">09:00 - 12:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Notes</h3>
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs text-gray-600">
            Please perform a full technical inspection. Check brakes, tires, lights, suspension, steering, and emissions. Customer also requested extra attention after a recent warning light issue.
          </div>
        </div>
      </div>
    );
  };

  const renderHireADriver = () => {
    return (
      <div className="space-y-6 text-sm">
        {/* Header Info */}
        <div className="border-b border-gray-100 pb-4">
          <p className="text-gray-400 text-xs">Submitted: Today, 10:15 AM</p>
          <p className="font-bold text-lg text-gray-900 mt-1">Hire a Driver Request</p>
          <p className="text-gray-500 text-xs">Driver service required for vehicle pickup and delivery support</p>
        </div>

        {/* Driver Requirement */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Driver Requirement</h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <div>
              <p className="text-xs text-gray-400">Number of Drivers</p>
              <p className="font-medium text-gray-900">1 Driver</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Service Type</p>
              <p className="font-medium text-gray-900">Hire a Driver</p>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Schedule</h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <div>
              <p className="text-xs text-gray-400">Start Date</p>
              <p className="font-medium text-gray-900">24 Apr 2026</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Start Time</p>
              <p className="font-medium text-gray-900">09:00</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">End Date</p>
              <p className="font-medium text-gray-900">24 Apr 2026</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">End Time</p>
              <p className="font-medium text-gray-900">12:00</p>
            </div>
          </div>
        </div>

        {/* Driver Reporting Location */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Driver Reporting Location</h3>
          <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Location Address</p>
                <p className="font-medium text-gray-900">123 Avenue des Champs-Élysées, Paris 75008</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">City</p>
                <p className="font-medium text-gray-900">Paris</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Postal Code</p>
                <p className="font-medium text-gray-900">75008</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400">Location Note</p>
              <p className="font-medium text-gray-900">Meet at dealership reception.</p>
            </div>
          </div>
        </div>

        {/* Driver Task */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Driver Task</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Vehicle pickup
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Vehicle delivery
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Move vehicles inside lot</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Test drive</span>
          </div>
        </div>

        {/* Special Requirements */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Special Requirements</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Experienced driver only
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Premium vehicle handling
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Manual transmission
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 relative">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">{request.requestId}</h2>
            <div className="flex gap-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${request.status === "Pending" ? "bg-yellow-100 text-yellow-700" : request.status === "Accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {request.status}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${request.priority === "Urgent" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                {request.priority}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-600">
                {request.type}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {renderContent()}

          {/* Admin Note (Common to all) */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Admin Note</h3>
            <textarea 
              placeholder="Add internal note for this request..."
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            ></textarea>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">Internal only — not visible to customer or driver.</p>
              <button className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                Save Note
              </button>
            </div>
          </div>

          {/* Request Timeline (Common to all) */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Request Timeline</h3>
            <div className="space-y-4 relative before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              <div className="relative pl-7">
                <span className="absolute left-0 top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
                <p className="text-sm font-medium text-gray-900">Request submitted</p>
                <p className="text-xs text-gray-400">Today, 09:40 AM</p>
              </div>
              <div className="relative pl-7">
                <span className="absolute left-0 top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></span>
                <p className="text-sm font-medium text-gray-900">Admin reviewing</p>
                <p className="text-xs text-gray-400">Current step</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium text-sm transition-colors">
            Reject Request
          </button>
          <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">
            Accept Request
          </button>
        </div>
      </div>
    </div>
  );
};
