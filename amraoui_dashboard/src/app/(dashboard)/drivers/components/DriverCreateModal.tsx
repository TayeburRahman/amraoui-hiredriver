"use client";

import React, { useState } from 'react';
import { X, Loader2, UploadCloud, Trash2 } from 'lucide-react';
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
    company_name: '',
    tax_number: '',
  });

  const [isVehicleCarrier, setIsVehicleCarrier] = useState(false);
  const [isDealerPlate, setIsDealerPlate] = useState(false);
  const [vehicleCarrierImage, setVehicleCarrierImage] = useState<File | null>(null);
  const [dealerPlateImage, setDealerPlateImage] = useState<File | null>(null);
  const [carrierPreview, setCarrierPreview] = useState<string | null>(null);
  const [platePreview, setPlatePreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'carrier' | 'plate') => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (type === 'carrier') {
        setVehicleCarrierImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setCarrierPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setDealerPlateImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setPlatePreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const uploadData = new FormData();
      uploadData.append('data', JSON.stringify(formData));

      if (isVehicleCarrier && vehicleCarrierImage) {
        uploadData.append('vehicle_carrier_image', vehicleCarrierImage);
      }
      if (isDealerPlate && dealerPlateImage) {
        uploadData.append('dealer_plate_image', dealerPlateImage);
      }

      await adminCreateDriver(uploadData);
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

          <h3 className="pt-2 font-bold text-gray-900 border-t border-gray-100">Company & Special Credentials</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Company Name</label>
              <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Tax Number Company (Optional)</label>
              <input type="text" name="tax_number" value={formData.tax_number} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">Vehicle Carrier?</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsVehicleCarrier(true)}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-semibold text-center transition-all ${isVehicleCarrier
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsVehicleCarrier(false);
                    setVehicleCarrierImage(null);
                    setCarrierPreview(null);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-semibold text-center transition-all ${!isVehicleCarrier
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">Dealer Plates?</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsDealerPlate(true)}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-semibold text-center transition-all ${isDealerPlate
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDealerPlate(false);
                    setDealerPlateImage(null);
                    setPlatePreview(null);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-semibold text-center transition-all ${!isDealerPlate
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle Carrier Image Upload */}
          {isVehicleCarrier && (
            <div className="space-y-1 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-xs font-bold text-gray-700">Vehicle Carrier Image</label>
              {carrierPreview ? (
                <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-2">
                  <img src={carrierPreview} alt="Vehicle Carrier Preview" className="w-full h-32 object-contain rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setVehicleCarrierImage(null);
                      setCarrierPreview(null);
                    }}
                    className="absolute top-4 right-4 bg-red-600 text-white p-1.5 rounded-full shadow hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500 font-semibold">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'carrier')}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          {/* Dealer Plate Image Upload */}
          {isDealerPlate && (
            <div className="space-y-1 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-xs font-bold text-gray-700">Dealer Plate Image</label>
              {platePreview ? (
                <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-2">
                  <img src={platePreview} alt="Dealer Plate Preview" className="w-full h-32 object-contain rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setDealerPlateImage(null);
                      setPlatePreview(null);
                    }}
                    className="absolute top-4 right-4 bg-red-600 text-white p-1.5 rounded-full shadow hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500 font-semibold">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'plate')}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

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
