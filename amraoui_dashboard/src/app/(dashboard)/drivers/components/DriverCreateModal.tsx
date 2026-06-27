"use client";

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { adminCreateDriver } from '@/lib/drivers.api';

interface DriverCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DriverCreateModal: React.FC<DriverCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    license_number: '',
    vehicle_type: '',
    vehicle_plate: '',
    address: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminCreateDriver(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create driver');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 relative">
          <button onClick={onClose} className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">Create New Driver</h2>
          <p className="text-xs text-gray-400">Add a new driver account with access credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Full Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Email Address</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Password</label>
            <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Phone Number (Optional)</label>
            <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Address (Optional)</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <h3 className="pt-2 font-bold text-gray-900 border-t border-gray-100">Vehicle & License Details</h3>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">License Number (Optional)</label>
            <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Vehicle Type (Optional)</label>
              <input type="text" name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} placeholder="e.g. Van, Truck" className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Vehicle Plate (Optional)</label>
              <input type="text" name="vehicle_plate" value={formData.vehicle_plate} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
