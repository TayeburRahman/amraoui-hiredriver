"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Pagination } from '../mission-monitoring/components/Pagination';
import { OrderDocumentModal } from './components/OrderDocumentModal';
import { apiFetch } from '@/lib/api';
import { formatDate, formatDateTime } from '@/lib/dateUtils';

interface VehicleDocument {
  id: string;
  brandModel: string;
  type: string;
  missionType: string;
  licensePlate: string;
  vin: string;
  engine: string;
  customer: string;
  mission: string;
  status: string;
  updated: string;
  rawDocsCount?: number;
  documents?: { url: string; type: string }[];
  documentChecklist?: { name: string; status: string }[];
}

const OrderDocumentsPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch<any>('/requests?limit=1000', { auth: true });
        if (res.ok && res.data?.success) {
          setRequests(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch requests", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const dynamicVehicles: VehicleDocument[] = requests
    .filter(r => r.type === 'TRANSPORT' || r.type === 'INSPECTION')
    .map(r => {
      let brandModel = 'N/A';
      let type = 'N/A';
      let licensePlate = 'N/A';
      let vin = 'N/A';
      let engine = 'N/A';

      if (r.type === 'TRANSPORT') {
        brandModel = `${r.details?.make || ''} ${r.details?.model || ''}`.trim() || 'N/A';
        type = r.details?.vehicleType || 'N/A';
        licensePlate = r.details?.plate || 'N/A';
        vin = r.details?.vin || 'N/A';
        engine = r.details?.engineType || 'N/A';
      } else if (r.type === 'INSPECTION') {
        brandModel = `${r.details?.vehicleBrand || ''} ${r.details?.vehicleModel || ''}`.trim() || 'N/A';
        type = 'N/A';
        licensePlate = r.details?.licensePlate || 'N/A';
        vin = r.details?.vinNumber || 'N/A';
        engine = 'N/A';
      }

      const pDocs = (r.details?.pickupInspection?.uploadDocuments || []).length;
      const dDocs = (r.details?.deliveryInspection?.uploadDocuments || []).length;
      const totalDocs = pDocs + dDocs;
      
      let status = 'Complete';
      if (totalDocs === 0) status = 'Missing proof';
      else if (r.status === 'COMPLETED') status = 'Verified';

      const documents: { url: string; type: string }[] = [];
      const documentChecklist = [
        { name: 'Vehicle Photos', status: 'Pending' },
        { name: 'Registration Document', status: 'Pending' },
        { name: 'Pickup Inspection Photos', status: 'Pending' },
        { name: 'Delivery Inspection Photos', status: 'Pending' },
        { name: 'Mileage/Fuel Proof', status: 'Pending' },
        { name: 'Signature Report', status: 'Pending' },
      ];

      if (r.details?.registrationDocument) {
         documents.push({ url: r.details.registrationDocument, type: 'Registration_Document' });
         documentChecklist[1].status = 'Complete';
      }
      if (r.details?.pickupInspection?.uploadDocuments?.length > 0) {
         r.details.pickupInspection.uploadDocuments.forEach((url: string) => {
           documents.push({ url, type: 'Pickup_Inspection' });
         });
         documentChecklist[2].status = 'Complete';
      }
      if (r.details?.deliveryInspection?.uploadDocuments?.length > 0) {
         r.details.deliveryInspection.uploadDocuments.forEach((url: string) => {
           documents.push({ url, type: 'Delivery_Inspection' });
         });
         documentChecklist[3].status = 'Complete';
      }
      if (r.details?.pickupInspection?.odometerPhoto) {
         documents.push({ url: r.details.pickupInspection.odometerPhoto, type: 'Pickup_Odometer' });
         documentChecklist[4].status = 'Complete';
      }
      if (r.details?.pickupInspection?.fuelGaugePhoto) {
         documents.push({ url: r.details.pickupInspection.fuelGaugePhoto, type: 'Pickup_Fuel' });
         documentChecklist[4].status = 'Complete';
      }
      if (r.details?.pickupInspection?.driverSignature) {
         documents.push({ url: r.details.pickupInspection.driverSignature, type: 'Pickup_Signature' });
         documentChecklist[5].status = 'Complete';
      }
      if (r.details?.deliveryInspection?.driverSignature) {
         documents.push({ url: r.details.deliveryInspection.driverSignature, type: 'Delivery_Signature' });
         documentChecklist[5].status = 'Complete';
      }

      // Add actual Vehicle Photos if any
      if (r.details?.vehiclePhotos) {
         const vPhotos = Array.isArray(r.details.vehiclePhotos) ? r.details.vehiclePhotos : [r.details.vehiclePhotos];
         vPhotos.forEach((url: string) => documents.push({ url, type: 'Vehicle_Photo' }));
         documentChecklist[0].status = 'Complete';
      } else if (documents.length > 0) {
         documentChecklist[0].status = 'Complete'; 
      }

      return {
        id: r._id,
        brandModel,
        type,
        missionType: r.type,
        licensePlate,
        vin,
        engine,
        customer: r.customerId?.name || 'N/A',
        mission: r.missionId || 'N/A',
        status,
        updated: formatDate(r.updatedAt),
        rawDocsCount: totalDocs,
        documents,
        documentChecklist
      };
  });

  const totalVehicles = dynamicVehicles.length;
  const missionDocuments = dynamicVehicles.reduce((sum, v: any) => sum + (v.rawDocsCount || 0), 0);
  const missingDocuments = dynamicVehicles.filter(v => v.status === 'Missing proof').length;
  const verifiedDocuments = dynamicVehicles.filter(v => v.status === 'Verified').length;
  const needsReview = dynamicVehicles.filter(v => v.status === 'Complete' && (v.rawDocsCount || 0) > 0).length;
  const recentUploads = dynamicVehicles.filter(v => (new Date().getTime() - new Date(v.updated).getTime()) < 7 * 24 * 60 * 60 * 1000).length;

  const metrics = [
    { title: "Total Vehicles", value: totalVehicles.toString(), subtitle: "Linked to customer requests", color: "text-gray-900" },
    { title: "Mission Documents", value: missionDocuments.toString(), subtitle: "Uploaded files", color: "text-blue-600" },
    { title: "Missing Documents", value: missingDocuments.toString(), subtitle: "Need re-upload", color: "text-red-500" },
    { title: "Verified Documents", value: verifiedDocuments.toString(), subtitle: "Admin checked", color: "text-green-500" },
    { title: "Needs Review", value: needsReview.toString(), subtitle: "Awaiting verification", color: "text-amber-500" },
    { title: "Recent Uploads", value: recentUploads.toString(), subtitle: "Last 7 days", color: "text-indigo-500" },
  ];

  const handleOpenModal = (vehicle: VehicleDocument) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const filteredVehicles = dynamicVehicles.filter(v => 
    v.brandModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.mission.toLowerCase().includes(searchQuery.toLowerCase())
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
              {filteredVehicles.slice((currentPage - 1) * 10, currentPage * 10).map((v) => (
                <tr key={v.id} className="hover:bg-gray-50/50 transition-colors bg-white">
                  <td className="px-5 py-6 whitespace-nowrap font-bold text-blue-600">{v.id.substring(0, 8)}...</td>
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
            totalPages={Math.ceil(filteredVehicles.length / 10) || 1}
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