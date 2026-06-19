"use client";

import React, { useState } from 'react';
import { X, Fuel, Clock, ClipboardList, Upload, Car, CheckCircle2, Ticket, Wrench, Droplet, Coffee, AlertTriangle, Home } from 'lucide-react';

import { apiFetch } from '@/lib/api';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: any;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, mission }) => {
  const [selectedType, setSelectedType] = useState("Toll");
  const [uploadedBy, setUploadedBy] = useState<"Admin" | "Driver">("Admin");
  const [amount, setAmount] = useState('');
  const [driverNote, setDriverNote] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const expenseTypes = [
    { name: "Toll", icon: Ticket },
    { name: "Fuel", icon: Fuel },
    { name: "Parking", icon: Car },
    { name: "Hotel", icon: Home },
    { name: "Maintenance", icon: Wrench },
    { name: "Cleaning", icon: Droplet },
    { name: "Meals", icon: Coffee },
    { name: "Fines", icon: AlertTriangle },
    { name: "Other", icon: ClipboardList }
  ];

  const handleApproveExpense = async () => {
    if (!amount || isNaN(Number(amount))) return;
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('type', selectedType);
      formData.append('amount', amount);
      formData.append('uploadedBy', uploadedBy);
      formData.append('driverNote', driverNote);
      formData.append('adminNote', adminNote);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const res = await apiFetch(`/requests/${mission.realId}/expenses`, {
        method: 'POST',
        body: formData,
        auth: true,
      });
      if (res.ok) {
        const result: any = res.data;
        // The backend returns the updated request in result.data
        if (result?.data?.expenses) {
           mission.raw.expenses = result.data.expenses;
        } else {
           if (!mission.raw.expenses) mission.raw.expenses = [];
           mission.raw.expenses.push({
             ...result.data, // use the returned object which has the actual proofUrl
           });
        }
        setAmount('');
        setDriverNote('');
        setAdminNote('');
        setProofUrl(null);
        setSelectedFile(null);
        onClose();
      } else {
        const err: any = res.data || {};
        alert('Failed to add expense: ' + (err.message || JSON.stringify(err)));
      }
    } catch (e) {
      console.error(e);
      alert('Error adding expense');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <p className="font-bold text-gray-900">{mission?.id || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Driver</p>
              <p className="font-bold text-gray-900">{mission?.driver || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Customer</p>
              <p className="font-bold text-gray-900">{mission?.customer || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400">Route</p>
              <p className="font-bold text-gray-900">{mission?.route || 'N/A'}</p>
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>



          {/* Receipt / Proof */}
          <div>
            <p className="font-bold text-gray-900 mb-2 text-xs">Receipt / Proof</p>
            <label className={`border-2 border-dashed ${proofUrl ? 'border-green-400 bg-green-50' : 'border-gray-200'} rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-blue-300 transition-colors cursor-pointer relative overflow-hidden`}>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  // Instead of uploading directly to Cloudinary from the client,
                  // we just hold onto the file and upload it securely via the backend.
                  setSelectedFile(file);
                  setProofUrl(URL.createObjectURL(file)); // for preview purposes
                }}
              />
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <p className="text-sm font-medium text-green-700">Receipt Selected</p>
                  <p className="text-xs text-green-600 underline">Click to change</p>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Upload Receipt</p>
                  <p className="text-xs text-gray-400 mt-1">Click or drag file to upload</p>
                </>
              )}
            </label>
          </div>



          {/* Admin Note */}
          <div>
            <p className="font-bold text-gray-900 mb-2 text-xs">Admin Note</p>
            <textarea 
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Add internal admin note (optional)"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
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
          <button onClick={onClose} disabled={isSubmitting} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button 
            disabled={isSubmitting || !amount || isUploading}
            onClick={handleApproveExpense}
            className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
            Approve Expense
          </button>
        </div>
      </div>
    </div>
  );
};
