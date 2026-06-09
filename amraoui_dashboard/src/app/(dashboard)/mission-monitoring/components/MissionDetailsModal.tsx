"use client";

import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Car, FileText, CheckCircle2, Clock, Plus, Eye, Download } from 'lucide-react';
import { ProofViewerModal } from './ProofViewerModal';
import { AddExpenseModal } from './AddExpenseModal';


interface MissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: any;
}

export const MissionDetailsModal: React.FC<MissionDetailsModalProps> = ({ isOpen, onClose, mission }) => {
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  if (!isOpen || !mission) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 relative">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-gray-900">{mission.id || "MS-20458"}</h2>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">In Transit</span>
          </div>
          <p className="text-xs text-gray-400">Request ID: {mission.requestId || "REQ-20458"}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Car className="w-3.5 h-3.5" /> {mission.vehicle || "BMW X5"}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {mission.route || "Paris → Lyon"}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          
          {/* Mission Summary */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Mission Summary</h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
              <div>
                <p className="text-gray-400">Customer</p>
                <p className="font-bold text-gray-900">{mission.customer || "Amraoui"}</p>
              </div>
              <div>
                <p className="text-gray-400">Driver</p>
                <p className="font-bold text-gray-900">{mission.driver || "Marc Dubois"}</p>
              </div>
              <div>
                <p className="text-gray-400">Priority</p>
                <p className="font-bold text-gray-900">Normal</p>
              </div>
              <div>
                <p className="text-gray-400">Assigned Quote</p>
                <p className="font-bold text-gray-900">€450</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Contact */}
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
              <h4 className="font-bold text-gray-900 mb-3">Customer Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">Amraoui</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">customer@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">+33 6 12 34 56 78</span>
                </div>
              </div>
            </div>
            {/* Driver Contact */}
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
              <h4 className="font-bold text-gray-900 mb-3">Driver Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">Marc Dubois</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">driver@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">+33 6 98 76 54 32</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Status Timeline */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Mission Status Timeline</h3>
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="space-y-3 relative before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-green-500">
                <div className="relative pl-7 text-xs flex items-center justify-between">
                  <span className="absolute left-0 top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </span>
                  <span className="font-medium text-gray-900">Request accepted</span>
                </div>
                <div className="relative pl-7 text-xs flex items-center justify-between">
                  <span className="absolute left-0 top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </span>
                  <span className="font-medium text-gray-900">Driver assigned</span>
                </div>
                <div className="relative pl-7 text-xs flex items-center justify-between">
                  <span className="absolute left-0 top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </span>
                  <span className="font-medium text-gray-900">Pickup started</span>
                </div>
                <div className="relative pl-7 text-xs flex items-center justify-between">
                  <span className="absolute left-0 top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </span>
                  <span className="font-medium text-gray-900">Vehicle verified</span>
                </div>
                <div className="relative pl-7 text-xs flex items-center justify-between">
                  <span className="absolute left-0 top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Clock className="w-2.5 h-2.5 text-white" />
                  </span>
                  <span className="font-medium text-gray-900">In transit</span>
                  <span className="text-gray-400">Current step</span>
                </div>
              </div>
            </div>
          </div>

          {/* Proof & Report Status */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Proof & Report Status</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                <span className="text-gray-600">Pickup Photos</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                <span className="text-gray-600">Pickup Signature</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                <span className="text-gray-600">Delivery Photos</span>
                <span className="text-gray-400">Pending</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                <span className="text-gray-600">Damage Report</span>
                <span className="text-green-600 font-medium">No Damage</span>
              </div>
            </div>
          </div>

          {/* Extra Expenses & Final Invoice */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Extra Expenses & Final Invoice</h3>
            <p className="text-xs text-gray-400 mb-3">Review driver-submitted receipts, approve extra charges, and update the customer's final invoice.</p>
            
            <div className="grid grid-cols-4 gap-2 mb-4 text-xs">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-600 font-bold text-lg">3</p>
                <p className="text-gray-500">Submitted Receipts</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-yellow-600 font-bold text-lg">2</p>
                <p className="text-gray-500">Pending Approval</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-green-600 font-bold text-lg">€72</p>
                <p className="text-gray-500">Approved Expenses</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-gray-900 font-bold text-lg">Draft</p>
                <p className="text-gray-500">Invoice Status</p>
              </div>
            </div>

            {/* Expenses Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px]">
                  <tr>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">Amount</th>
                    <th className="px-3 py-2 text-left">Proof</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-3 py-2">Toll</td>
                    <td className="px-3 py-2">€15</td>
                    <td className="px-3 py-2 text-blue-600">toll_receipt_0424.jpg</td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">Pending</span></td>
                    <td className="px-3 py-2"><button className="text-blue-600 font-medium">View</button></td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Fuel</td>
                    <td className="px-3 py-2">€35</td>
                    <td className="px-3 py-2 text-blue-600">fuel_receipt_0424.jpg</td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">Pending</span></td>
                    <td className="px-3 py-2"><button className="text-blue-600 font-medium">View</button></td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Parking</td>
                    <td className="px-3 py-2">€22</td>
                    <td className="px-3 py-2 text-blue-600">parking_receipt.jpg</td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Approved</span></td>
                    <td className="px-3 py-2"><button className="text-blue-600 font-medium">View</button></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button 
              onClick={() => setIsExpenseModalOpen(true)}
              className="w-full mt-3 py-2 border border-blue-200 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Extra Expense
            </button>

          </div>

          {/* Final Invoice Summary */}
          <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 text-xs">
            <h3 className="font-bold text-gray-900 mb-3">Final Invoice Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Base transport fee</span>
                <span className="font-bold text-gray-900">€450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Approved extra expenses</span>
                <span className="font-bold text-gray-900">€72</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-green-200 mt-2">
                <span className="font-bold text-gray-900 text-sm">Final Total</span>
                <span className="text-xl font-bold text-blue-600">€522</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Preview Invoice
              </button>
              <button className="py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                Send to Customer
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3 text-sm">
          <button 
            onClick={() => setIsProofModalOpen(true)}
            className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center justify-center gap-1"
          >
            <Download className="w-4 h-4" /> View Proof
          </button>

          <button className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center justify-center gap-1">
            Cancel Mission
          </button>
        </div>
      </div>

      <ProofViewerModal 
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
      />

      <AddExpenseModal 
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />
    </div>
  );
};

