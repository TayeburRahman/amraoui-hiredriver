"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Pagination } from '../mission-monitoring/components/Pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { formatDate, formatDateTime } from '@/lib/dateUtils';


interface InspectionReport {
  id: string;
  mission: string;
  vehicle: string;
  driver: string;
  customer: string;
  pickup: string;
  delivery: string;
  completeness: number;
  damage: string;
  status: string;
}
const InspectionsReportsPage = () => {
  const [activeTab, setActiveTab] = useState("All");
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

  const dynamicReports: InspectionReport[] = requests.map(r => {
    let vehicle = 'N/A';
    if (r.type === 'TRANSPORT') vehicle = `${r.details?.make || ''} ${r.details?.model || ''}`.trim() || 'N/A';
    else if (r.type === 'INSPECTION') vehicle = `${r.details?.vehicleBrand || ''} ${r.details?.vehicleModel || ''}`.trim() || 'N/A';

    let pickupDate = r.details?.pickupVerification?.verifiedAt ? formatDate(r.details.pickupVerification.verifiedAt) : 'Pending';
    if (r.type === 'INSPECTION') pickupDate = 'N/A'; // Inspections don't have pickup

    const deliveryDate = r.details?.deliveryArrivalTime || r.details?.deliveryInspection?.driverConfirmation?.updatedAt;
    const deliveryStr = deliveryDate ? formatDate(deliveryDate) : 'Pending';

    let completeness = 0;
    let expectedSteps = 2; // Default for TRANSPORT
    if (r.type === 'INSPECTION' || r.type === 'HIRE_DRIVER') expectedSteps = 1; // Only delivery/completion proofs

    let completedSteps = 0;
    if (r.details?.pickupVerification?.verifiedAt) completedSteps++;
    if (deliveryDate) completedSteps++;

    completeness = Math.round((completedSteps / expectedSteps) * 100);
    if (completeness > 100) completeness = 100;

    let damage = 'No Damage';
    const pickupDamage = r.details?.pickupInspection?.damageReport?.status;
    const deliveryDamage = r.details?.deliveryInspection?.damageReport?.status;
    
    if ((pickupDamage && !pickupDamage.toLowerCase().includes('no damage')) || 
        (deliveryDamage && !deliveryDamage.toLowerCase().includes('no damage'))) {
      damage = 'Damage Found';
    } else if (!r.details?.pickupInspection && !r.details?.deliveryInspection) {
      damage = 'Pending';
    }

    let status = 'Needs Review';
    if (r.status === 'COMPLETED') status = 'Reviewed';

    return {
      id: r._id,
      mission: r.missionId || 'N/A',
      vehicle,
      driver: r.assignedDriverId?.name || "Pending driver",
      customer: r.customerId?.name || "N/A",
      pickup: pickupDate,
      delivery: deliveryStr,
      completeness,
      damage,
      status
    };
  });

  const totalReports = dynamicReports.length;
  const pickupComplete = requests.filter(r => r.details?.pickupVerification?.verifiedAt).length;
  const deliveryComplete = requests.filter(r => r.details?.deliveryArrivalTime || r.details?.deliveryInspection?.driverConfirmation?.updatedAt).length;
  const damageFound = dynamicReports.filter(r => r.damage === 'Damage Found').length;
  const missingProof = dynamicReports.filter(r => r.completeness < 100).length;
  const verifiedReports = dynamicReports.filter(r => r.status === 'Reviewed').length;

  const metrics = [
    { title: "Total Reports", value: totalReports.toString(), color: "text-gray-900" },
    { title: "Pickup Proof Complete", value: pickupComplete.toString(), color: "text-emerald-500" },
    { title: "Delivery Proof Complete", value: deliveryComplete.toString(), color: "text-emerald-500" },
    { title: "Damage Found", value: damageFound.toString(), color: "text-red-500" },
    { title: "Missing Proof", value: missingProof.toString(), color: "text-orange-500" },
    { title: "Verified Reports", value: verifiedReports.toString(), color: "text-blue-600" },
  ];

const tabs = ["All", "Pickup", "Delivery", "Damage", "No Damage", "Missing", "Verified"];

  return (
    <div className="overflow-auto pb-12 min-h-screen bg-[#F8F9FA] px-2 sm:px-4 lg:px-6">
      {/* Header Section */}
      <div className="mb-8 pt-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Inspections & Reports</h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Review pickup and delivery proof, damage reports, mileage/fuel data, signatures, and final delivery reports.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-center h-[140px] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider leading-tight">{metric.title}</h3>
            <div className={`text-3xl font-extrabold ${metric.color}`}>{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Main Table Section Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-5">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100 mb-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-semibold transition-all relative ${
                activeTab === tab
                  ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search mission ID, vehicle, driver, customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-100 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" 
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors text-sm shadow-sm outline-none">
              <Filter className="w-4 h-4 text-gray-500" />
              Filters
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setActiveTab("Pickup")}>Pickup Complete</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("Delivery")}>Delivery Complete</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("Damage")}>Damage Found</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("Missing")}>Missing Proof</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-xl border border-gray-50">
          <table className="w-full min-w-[1200px] text-left text-sm text-gray-600">
            <thead className="bg-slate-50/50 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">REPORT ID</th>
                <th className="px-5 py-4">MISSION</th>
                <th className="px-5 py-4">VEHICLE</th>
                <th className="px-5 py-4">DRIVER</th>
                <th className="px-5 py-4">CUSTOMER</th>
                <th className="px-5 py-4">PICKUP</th>
                <th className="px-5 py-4">DELIVERY</th>
                <th className="px-5 py-4">COMPLETENESS</th>
                <th className="px-5 py-4">DAMAGE</th>
                <th className="px-5 py-4">STATUS</th>
                <th className="px-5 py-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dynamicReports
                .filter(r => {
                  if (activeTab === "Pickup") return r.pickup !== 'Pending' && r.pickup !== 'N/A';
                  if (activeTab === "Delivery") return r.delivery !== 'Pending' && r.delivery !== 'N/A';
                  if (activeTab === "Damage") return r.damage === 'Damage Found';
                  if (activeTab === "No Damage") return r.damage === 'No Damage';
                  if (activeTab === "Missing") return r.completeness < 100;
                  if (activeTab === "Verified") return r.status === 'Reviewed';
                  return true;
                })
                .filter(r => r.mission.toLowerCase().includes(searchQuery.toLowerCase()) || r.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) || r.driver.toLowerCase().includes(searchQuery.toLowerCase()) || r.customer.toLowerCase().includes(searchQuery.toLowerCase()))
                .slice((currentPage - 1) * 10, currentPage * 10)
                .map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/50 transition-colors bg-white">
                  <td className="px-5 py-6 whitespace-nowrap font-bold text-blue-600">{report.id.substring(0, 8)}...</td>
                  <td className="px-5 py-6 whitespace-nowrap font-bold text-blue-600">
                    <Link href={`/inspections-reports/${report.id}`} className="hover:underline">{report.mission}</Link>
                  </td>
                  <td className="px-5 py-6 whitespace-nowrap font-bold text-gray-900">{report.vehicle}</td>
                  <td className="px-5 py-6 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{report.driver.split(' ')[0]}</span>
                      <span className="text-[11px] text-gray-400 font-medium">{report.driver.split(' ').slice(1).join(' ')}</span>
                    </div>
                  </td>
                  <td className="px-5 py-6 whitespace-nowrap font-medium text-gray-700">{report.customer}</td>
                  <td className="px-5 py-6 whitespace-nowrap text-gray-400 text-xs font-medium">{report.pickup}</td>
                  <td className="px-5 py-6 whitespace-nowrap text-gray-400 text-xs font-medium">{report.delivery}</td>
                  <td className="px-5 py-6 whitespace-nowrap min-w-[120px]">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${report.completeness}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-900">{report.completeness}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-6 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      report.damage === 'No Damage' ? 'bg-green-50 text-green-600' : 
                      report.damage === 'Pending' ? 'bg-orange-50 text-orange-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {report.damage}
                    </span>
                  </td>
                  <td className="px-5 py-6 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      report.status === 'Reviewed' ? 'bg-green-50 text-green-600' : 
                      'bg-red-50 text-red-600'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-5 py-6 whitespace-nowrap text-center">
                    <Link 
                      href={`/inspections-reports/${report.id}`}
                      className="text-gray-900 font-bold hover:text-blue-600 transition-colors text-xs"
                    >
                      View
                    </Link>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="mt-6 border border-gray-100 rounded-xl overflow-hidden">
          <Pagination 
            currentPage={currentPage}
            totalPages={Math.ceil(dynamicReports.filter(r => {
                  if (activeTab === "Pickup") return r.pickup !== 'Pending' && r.pickup !== 'N/A';
                  if (activeTab === "Delivery") return r.delivery !== 'Pending' && r.delivery !== 'N/A';
                  if (activeTab === "Damage") return r.damage === 'Damage Found';
                  if (activeTab === "No Damage") return r.damage === 'No Damage';
                  if (activeTab === "Missing") return r.completeness < 100;
                  if (activeTab === "Verified") return r.status === 'Reviewed';
                  return true;
                }).filter(r => r.mission.toLowerCase().includes(searchQuery.toLowerCase()) || r.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) || r.driver.toLowerCase().includes(searchQuery.toLowerCase()) || r.customer.toLowerCase().includes(searchQuery.toLowerCase())).length / 10) || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default InspectionsReportsPage;