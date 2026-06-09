"use client";

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Pagination } from '../mission-monitoring/components/Pagination';
import { OrderDocumentModal } from './components/OrderDocumentModal';

interface VehicleDocument {
  id: string;
  brandModel: string;
  type: string;
  licensePlate: string;
  vin: string;
  engine: string;
  customer: string;
  mission: string;
  status: string;
  updated: string;
}

const mockVehicles: VehicleDocument[] = [
  { 
    id: 'V-20458', 
    brandModel: 'BMW X5 xDrive40i', 
    type: 'SUV', 
    licensePlate: 'AB-123-CD', 
    vin: '5UXCR6C84L9C12345', 
    engine: 'Hybrid', 
    customer: 'Amraoui', 
    mission: '#MS-20458', 
    status: 'Complete', 
    updated: 'Today' 
  },
  { 
    id: 'V-20467', 
    brandModel: 'Mercedes E-Class', 
    type: 'Sedan', 
    licensePlate: 'ABC-1234', 
    vin: 'WDDHF8JB8CA123456', 
    engine: 'Diesel', 
    customer: 'Auto Palace SA', 
    mission: '#MS-20467', 
    status: 'Missing fuel proof', 
    updated: 'Today' 
  },
  { 
    id: 'V-20412', 
    brandModel: 'Audi A4', 
    type: 'Sedan', 
    licensePlate: 'XY-988-KL', 
    vin: 'WAUZZZF44KA123456', 
    engine: 'Petrol', 
    customer: 'Premium Motors SAS', 
    mission: '#MS-20412', 
    status: 'Verified', 
    updated: '18 Apr 2026' 
  },
];

const metrics = [
  { title: "Total Vehicles", value: "1,420", subtitle: "Linked to customer requests", color: "text-gray-900" },
  { title: "Mission Documents", value: "3,840", subtitle: "Uploaded files", color: "text-blue-600" },
  { title: "Missing Documents", value: "38", subtitle: "Need re-upload", color: "text-red-500" },
  { title: "Verified Documents", value: "2,960", subtitle: "Admin checked", color: "text-green-500" },
  { title: "Needs Review", value: "74", subtitle: "Awaiting verification", color: "text-amber-500" },
  { title: "Recent Uploads", value: "126", subtitle: "Last 7 days", color: "text-indigo-500" },
];

const OrderDocumentsPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleOpenModal = (vehicle: VehicleDocument) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const filteredVehicles = mockVehicles.filter(v => 
    v.brandModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-auto pb-12 min-h-screen bg-[#F8F9FA] px-2 sm:px-4 lg:px-6">
      {/* Header Section */}
      <div className="mb-8 pt-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Documents</h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Search vehicles, manage mission documents, verify proof files, and download transport documentation.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow h-[140px] flex flex-col justify-center">
            <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider text-[11px]">{metric.title}</h3>
            <div className={`text-3xl font-extrabold mb-1 ${metric.color}`}>{metric.value}</div>
            <p className="text-[11px] text-gray-400 font-medium">{metric.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Table Section Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-5">
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search VIN, license plate, mission ID, customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" 
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors text-sm shadow-sm">
            <Filter className="w-4 h-4 text-gray-500" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-xl border border-gray-50">
          <table className="w-full min-w-[1200px] text-left text-sm text-gray-600">
            <thead className="bg-slate-50/50 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">Vehicle ID</th>
                <th className="px-5 py-4">Brand / Model</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">License Plate</th>
                <th className="px-5 py-4">VIN</th>
                <th className="px-5 py-4">Engine</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Mission</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Updated</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50/50 transition-colors bg-white">
                  <td className="px-5 py-6 whitespace-nowrap font-bold text-blue-600">{v.id}</td>
                  <td className="px-5 py-6 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{v.brandModel.split(' ')[0]}</span>
                      <span className="text-[11px] text-gray-400 font-medium">{v.brandModel.split(' ').slice(1).join(' ')}</span>
                    </div>
                  </td>
                  <td className="px-5 py-6 whitespace-nowrap font-medium text-gray-400 text-xs">{v.type}</td>
                  <td className="px-5 py-6 whitespace-nowrap font-bold text-gray-900 text-xs">{v.licensePlate}</td>
                  <td className="px-5 py-6 whitespace-nowrap text-gray-400 text-[11px] font-medium tracking-tight uppercase">{v.vin}</td>
                  <td className="px-5 py-6 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">{v.engine}</span>
                  </td>
                  <td className="px-5 py-6 whitespace-nowrap font-bold text-gray-900">{v.customer}</td>
                  <td className="px-5 py-6 whitespace-nowrap font-bold text-blue-600">{v.mission}</td>
                  <td className="px-5 py-6 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      v.status === 'Complete' ? 'bg-green-50 text-green-600' : 
                      v.status === 'Verified' ? 'bg-green-50 text-green-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-5 py-6 whitespace-nowrap text-gray-400 text-xs font-medium">{v.updated}</td>
                  <td className="px-5 py-6 whitespace-nowrap">
                    <button 
                      onClick={() => handleOpenModal(v)}
                      className="text-gray-900 font-bold hover:text-blue-600 transition-colors text-xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden">
          <Pagination 
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <OrderDocumentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        vehicle={selectedVehicle} 
      />
    </div>
  );
};

export default OrderDocumentsPage;