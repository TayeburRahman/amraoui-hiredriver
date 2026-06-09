"use client";

import React from 'react';
import { X, CheckCircle2, Clock } from 'lucide-react';

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 relative">
          <button onClick={onClose} className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-gray-900">INV-C-20458</h2>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">Paid</span>
          </div>
          <p className="text-xs text-gray-400">#MS-20458 • Amraoui • 22 Apr 2026</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide text-sm">
          
          {/* Big Blue Card */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 rounded-2xl shadow-md">
            <p className="text-xs opacity-80 mb-1">Total Amount</p>
            <p className="text-4xl font-extrabold mb-4">€450</p>
            <div className="flex justify-between text-xs opacity-80">
              <span>Visa 4242</span>
              <span>TXN-8472</span>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Payment Details</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Invoice ID</span>
                <span className="font-bold text-blue-600">INV-C-20458</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mission ID</span>
                <span className="font-bold text-blue-600">#MS-20458</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Customer</span>
                <span className="font-bold text-gray-900">Amraoui</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vehicle</span>
                <span className="font-bold text-gray-900">BMW X5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Route</span>
                <span className="font-bold text-gray-900">Paris → Lyon</span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Price Breakdown</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Base transport fee</span>
                <span className="font-bold text-gray-900">€380.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Insurance coverage</span>
                <span className="font-bold text-gray-900">€35.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Service fee</span>
                <span className="font-bold text-gray-900">€20.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">VAT (20%)</span>
                <span className="font-bold text-gray-900">€15.00</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t mt-2">
                <span className="font-bold text-gray-900 text-sm">Total</span>
                <span className="text-lg font-bold text-green-600">€450</span>
              </div>
            </div>
          </div>

          {/* Payment Timeline */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Payment Timeline</h3>
            <div className="space-y-4 relative before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-green-500">
              <div className="relative pl-7 text-xs flex flex-col">
                <span className="absolute left-0 top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
                <span className="font-medium text-gray-900">Invoice created</span>
                <span className="text-gray-400">22 Apr 2026, 09:15</span>
              </div>
              <div className="relative pl-7 text-xs flex flex-col">
                <span className="absolute left-0 top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </span>
                <span className="font-medium text-gray-900">Payment received</span>
                <span className="text-gray-400">22 Apr 2026, 09:17</span>
              </div>
              <div className="relative pl-7 text-xs flex flex-col">
                <span className="absolute left-0 top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </span>
                <span className="font-medium text-gray-900">Receipt sent</span>
                <span className="text-gray-400">22 Apr 2026, 09:18</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
