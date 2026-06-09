"use client";

import React, { useState } from 'react';
import { X, Image as ImageIcon, ArrowLeft, ArrowRight, Download, CheckCircle2, Clock, AlertTriangle, FileText, User } from 'lucide-react';
import Link from 'next/link';

const tabs = [
  "Front", "Front Right", "Rear Right", "Rear", "Rear Left", "Front Left", 
  "Dashboard", "Driver Seat", "Passenger", "Back seat", "Others"
];

const InspectionDetails = () => {
  const [activeTab, setActiveTab] = useState("Front");

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 relative">
          <Link href="/inspections-reports" className="absolute right-6 top-6 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Link>
          <h2 className="text-xl font-bold text-gray-900">Compare Pickup vs Delivery Photos</h2>
          <p className="text-xs text-gray-400">Mission #MS-20458 • BMW X5</p>
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
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {activeTab !== "Others" ? (
            /* Layout 1: Photos */
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Pickup */}
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-4 text-white">
                    <p className="text-sm font-bold">Pickup</p>
                    <p className="text-xs opacity-80">May 1, 2026 • 09:15 AM</p>
                  </div>
                  <div className="p-8 bg-gray-50/50 flex flex-col items-center justify-center min-h-[250px]">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-3">
                      <ImageIcon className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{activeTab}</p>
                    <p className="text-xs text-gray-400">Pickup Photo</p>
                  </div>
                </div>

                {/* Delivery */}
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-400 p-4 text-white">
                    <p className="text-sm font-bold">Delivery</p>
                    <p className="text-xs opacity-80">May 5, 2026 • 04:30 PM</p>
                  </div>
                  <div className="p-8 bg-gray-50/50 flex flex-col items-center justify-center min-h-[250px]">
                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-3">
                      <ImageIcon className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{activeTab}</p>
                    <p className="text-xs text-gray-400">Delivery Photo</p>
                  </div>
                </div>
              </div>

              {/* Comparison Notes */}
              <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-900 mb-3">Comparison Notes</p>
                <div className="flex gap-4">
                  <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors">
                    Mark No Change
                  </button>
                  <button className="flex-1 py-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-medium hover:bg-amber-100 transition-colors">
                    Flag Possible Damage
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Layout 2: Others */
            <div className="space-y-6 text-xs">
              <p className="text-xs font-bold text-gray-900 mb-1">Other Inspection Details</p>
              <p className="text-xs text-gray-400 mb-4">Additional proof, damage report, mileage, fuel, documents, signature and delivery verification.</p>

              <div className="grid grid-cols-2 gap-6">
                {/* Pickup Column */}
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <div className="bg-blue-500 p-3 text-white">
                      <p className="font-bold">Pickup</p>
                      <p className="text-[10px] opacity-80">May 1, 2026 • 09:15 AM</p>
                    </div>
                    <div className="p-4 space-y-3 bg-white">
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Damage Report</p>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Damage Status</span>
                          <span className="font-bold text-gray-900">Damage found</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Damaged Component</span>
                          <span className="font-bold text-gray-900">Front bumper</span>
                        </div>
                        <div className="mt-1 p-2 bg-gray-50 rounded text-gray-600 text-[11px]">
                          Small scratch noticed before pickup.
                        </div>
                      </div>
                      <hr className="border-gray-100" />
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Mileage & Fuel Proof</p>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Mileage</span>
                          <span className="font-bold text-gray-900">1,245 km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Fuel Level</span>
                          <span className="font-bold text-gray-900">1/2</span>
                        </div>
                      </div>
                      <hr className="border-gray-100" />
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Uploaded Documents</p>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">PV_document.jpg</span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium text-[10px]">Uploaded</span>
                        </div>
                      </div>
                      <hr className="border-gray-100" />
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Customer Signature</p>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Customer Name</span>
                          <span className="font-bold text-gray-900">Amraoui</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Signature Status</span>
                          <span className="text-green-600 font-medium">Signed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Column */}
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <div className="bg-green-500 p-3 text-white">
                      <p className="font-bold">Delivery</p>
                      <p className="text-[10px] opacity-80">May 5, 2026 • 02:30 PM</p>
                    </div>
                    <div className="p-4 space-y-3 bg-white">
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Delivery Inspection Progress</p>
                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between items-center"><span className="text-gray-500">Exterior Photos</span><span className="text-green-600 font-medium flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Completed</span></div>
                          <div className="flex justify-between items-center"><span className="text-gray-500">Interior Photos</span><span className="text-green-600 font-medium flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Completed</span></div>
                          <div className="flex justify-between items-center"><span className="text-gray-500">Delivery Damage Report</span><span className="text-green-600 font-medium flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Completed</span></div>
                          <div className="flex justify-between items-center"><span className="text-gray-500">Final Mileage & Fuel</span><span className="text-green-600 font-medium flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Completed</span></div>
                        </div>
                      </div>
                      <hr className="border-gray-100" />
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Final Mileage & Fuel</p>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Mileage</span>
                          <span className="font-bold text-gray-900">1,278 km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Fuel Level</span>
                          <span className="font-bold text-gray-900">1/2</span>
                        </div>
                        <div className="flex justify-between text-green-600 font-medium mt-1">
                          <span>Mileage Change</span>
                          <span>+33 km</span>
                        </div>
                      </div>
                      <hr className="border-gray-100" />
                      <div>
                        <p className="font-bold text-gray-900 mb-1">Delivery Damage Report</p>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status</span>
                          <span className="text-amber-600 font-medium">Possible damage</span>
                        </div>
                        <div className="mt-1 p-2 bg-yellow-50 rounded text-gray-600 text-[11px]">
                          Small scratch on front bumper detected
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Comparison Summary */}
              <div>
                <p className="font-bold text-gray-900 mb-3">Other Comparison Summary</p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                    <p className="text-[10px] text-yellow-700 uppercase font-bold">Overall Status</p>
                    <p className="text-lg font-bold text-yellow-700">Needs Review</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-[10px] text-blue-700 uppercase font-bold">Mileage Difference</p>
                    <p className="text-lg font-bold text-blue-700">+33 km</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <p className="text-[10px] text-green-700 uppercase font-bold">Fuel Difference</p>
                    <p className="text-lg font-bold text-green-700">No Change</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <p className="text-[10px] text-purple-700 uppercase font-bold">Document Status</p>
                    <p className="text-lg font-bold text-purple-700">All Uploaded</p>
                  </div>
                </div>
              </div>

              {/* Detailed Other Comparison */}
              <div>
                <p className="font-bold text-gray-900 mb-3">Detailed Other Comparison</p>
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-xs text-gray-600">
                    <thead className="bg-gray-50 text-gray-500 font-bold">
                      <tr>
                        <th className="px-4 py-3 text-left">ITEM</th>
                        <th className="px-4 py-3 text-left">PICKUP</th>
                        <th className="px-4 py-3 text-left">DELIVERY</th>
                        <th className="px-4 py-3 text-left">STATUS</th>
                        <th className="px-4 py-3 text-left">NOTES</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-4 py-3 font-bold text-gray-900">Damage Report</td>
                        <td className="px-4 py-3">Damage found</td>
                        <td className="px-4 py-3">Possible damage</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium text-[10px]">Needs Review</span></td>
                        <td className="px-4 py-3 text-gray-500">Scratch should be compared with pickup damage photo.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-gray-900">Mileage</td>
                        <td className="px-4 py-3">1,245 km</td>
                        <td className="px-4 py-3">1,278 km</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium text-[10px]">Changed</span></td>
                        <td className="px-4 py-3 text-gray-500">+33 km during mission.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-gray-900">Fuel Level</td>
                        <td className="px-4 py-3">1/2</td>
                        <td className="px-4 py-3">1/2</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium text-[10px]">No Change</span></td>
                        <td className="px-4 py-3 text-gray-500">Fuel level remained same.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Vehicle Info & Proof Overview */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                {/* Vehicle Info */}
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <p className="font-bold text-gray-900 mb-3">Vehicle Info</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vehicle:</span>
                      <span className="font-bold text-gray-900">BMW X5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">License Plate:</span>
                      <span className="font-bold text-gray-900">AB-123-CD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">VIN:</span>
                      <span className="font-bold text-gray-900">WBADE6320XBW00123</span>
                    </div>
                  </div>
                </div>

                {/* Proof Overview */}
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <p className="font-bold text-gray-900 mb-3">Proof Overview</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-400">Pickup Proof:</p>
                      <p className="font-bold text-gray-900">Damage report, mileage, fuel, document, signature</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Delivery Proof:</p>
                      <p className="font-bold text-gray-900">Inspection checklist, mileage, documents, signatures, receiver ID</p>
                    </div>
                    <div className="pt-2 border-t border-gray-100 mt-2 flex justify-between items-center">
                      <span className="text-gray-400">Overall:</span>
                      <span className="text-green-600 font-bold">Ready for admin review</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-white">
          <div className="flex gap-2">
            <button 
              onClick={handlePrev}
              disabled={tabs.indexOf(activeTab) === 0}
              className={`px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                tabs.indexOf(activeTab) === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            <button 
              onClick={handleNext}
              disabled={tabs.indexOf(activeTab) === tabs.length - 1}
              className={`px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                tabs.indexOf(activeTab) === tabs.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1">
            <Download className="w-4 h-4" /> Download Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspectionDetails;