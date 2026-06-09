"use client";

import React, { useState } from 'react';
import { X, Fuel, Clock, ClipboardList, Upload, Car } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState("Toll");
  const [uploadedBy, setUploadedBy] = useState("Driver");

  if (!isOpen) return null;

  const expenseTypes = [
    { name: "Toll", icon: Car },
    { name: "Fuel", icon: Fuel },
    { name: "Parking", icon: Car }, // Using Car as placeholder for Parking if ParkingCircle not found
    { name: "Waiting charge", icon: Clock },
    { name: "Other", icon: ClipboardList }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Add / Approve Extra Expense</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide text-sm">
          
          {/* Mission Info Summary */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
            <div>
              <p className="text-gray-400">Mission ID</p>
              <p className="font-bold text-gray-900">MS-20470</p>
            </div>
            <div>
              <p className="text-gray-400">Driver</p>
              <p className="font-bold text-gray-900">James Davis</p>
            </div>
            <div>
              <p className="text-gray-400">Customer</p>
              <p className="font-bold text-gray-900">Luxury Cars Marrakech</p>
            </div>
            <div>
              <p className="text-gray-400">Route</p>
              <p className="font-bold text-gray-900">Casablanca → Marrakech</p>
            </div>
          </div>

          {/* Expense Type */}
          <div>
            <p className="font-bold text-gray-900 mb-3 text-xs">Expense Type</p>
            <div className="grid grid-cols-3 gap-2">
              {expenseTypes.map(type => (
                <button
                  key={type.name}
                  onClick={() => setSelectedType(type.name)}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${
                    selectedType === type.name
                      ? 'border-blue-500 bg-blue-50/50 text-blue-600 font-bold'
                      : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <type.icon className={`w-5 h-5 ${selectedType === type.name ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className="text-xs">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <p className="font-bold text-gray-900 mb-2 text-xs">Amount (€)</p>
            <input 
              type="text" 
              placeholder="0.00"
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Uploaded By */}
          <div>
            <p className="font-bold text-gray-900 mb-2 text-xs">Uploaded By</p>
            <div className="flex gap-2">
              <button
                onClick={() => setUploadedBy("Driver")}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  uploadedBy === "Driver"
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Driver
              </button>
              <button
                onClick={() => setUploadedBy("Admin")}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  uploadedBy === "Admin"
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Receipt / Proof */}
          <div>
            <p className="font-bold text-gray-900 mb-2 text-xs">Receipt / Proof</p>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-blue-300 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-900">Upload Receipt</p>
              <p className="text-xs text-gray-400 mt-1">Click or drag file to upload</p>
            </div>
          </div>

          {/* Driver Note */}
          <div>
            <p className="font-bold text-gray-900 mb-2 text-xs">Driver Note</p>
            <textarea 
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Driver's note..."
            ></textarea>
          </div>

          {/* Admin Note */}
          <div>
            <p className="font-bold text-gray-900 mb-2 text-xs">Admin Note</p>
            <textarea 
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Add internal admin note (optional)"
            ></textarea>
          </div>

          {/* Checkbox text */}
          <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 flex items-center gap-2">
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            Approve for invoice (expense will be added to final invoice)
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3 text-sm">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Save Draft
          </button>
          <button className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
            Approve Expense
          </button>
        </div>
      </div>
    </div>
  );
};
