"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface EditMissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: any;
  onSaveSuccess: () => void;
}

export const EditMissionDetailsModal: React.FC<EditMissionDetailsModalProps> = ({ isOpen, onClose, mission, onSaveSuccess }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && mission && mission.raw?.details) {
      // Copy only primitive fields to formData
      const excludedFields = [
        'documents', 'pickupInspection', 'deliveryInspection',
        'pickupVerification', 'deliveryArrivalDeclared',
        'deliveryArrivalTime', 'deliveryArrivalLocation',
        'driverArrivals', 'firstName', 'lastName', 'email', 'phone', 'company',
        'vehiclePhotos', 'registrationDocumentName', 'referenceDocumentName', 'signature'
      ];
      
      const newFormData: Record<string, any> = {};
      Object.entries(mission.raw.details).forEach(([key, value]) => {
        if (!excludedFields.includes(key)) {
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
             newFormData[key] = value;
          }
        }
      });
      setFormData(newFormData);
    }
  }, [isOpen, mission]);

  if (!isOpen || !mission) return null;

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const res = await apiFetch(`/requests/${mission.realId}`, {
        method: 'PUT',
        body: JSON.stringify({ details: formData }),
        auth: true,
      });

      if (res.ok) {
        onSaveSuccess();
      } else {
        alert('Failed to save mission details');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatLabel = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Edit Mission Details</h2>
              <p className="text-xs text-gray-500 mt-0.5">Update details for this mission.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => {
              const label = formatLabel(key);
              const isBoolean = typeof value === 'boolean';
              const isNumber = typeof value === 'number';

              if (isBoolean) {
                return (
                  <div key={key} className="flex items-center gap-2 mt-4 sm:col-span-2">
                    <input 
                      type="checkbox"
                      id={`edit-${key}`}
                      checked={Boolean(value)}
                      onChange={(e) => handleChange(key, e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor={`edit-${key}`} className="text-sm font-medium text-gray-700">
                      {label}
                    </label>
                  </div>
                );
              }

              // Handle multiline strings (like addresses or messages)
              const isLongText = typeof value === 'string' && value.length > 50;

              return (
                <div key={key} className={isLongText ? "sm:col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {label}
                  </label>
                  {isLongText ? (
                    <textarea 
                      value={String(value)}
                      onChange={(e) => handleChange(key, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                  ) : (
                    <input 
                      type={isNumber ? "number" : "text"}
                      value={value}
                      onChange={(e) => handleChange(key, isNumber ? Number(e.target.value) : e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
};
