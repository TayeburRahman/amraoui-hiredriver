"use client";

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Pagination } from '../mission-monitoring/components/Pagination';
import Link from 'next/link';


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

const mockReports: InspectionReport[] = [
  { 
    id: 'RPT-20458', 
    mission: '#MS-20458', 
    vehicle: 'BMW X5', 
    driver: 'Marc Dubois', 
    customer: 'Amraoui', 
    pickup: 'May 1', 
    delivery: 'May 5', 
    completeness: 100, 
    damage: 'No Damage', 
    status: 'Reviewed' 
  },
  { 
    id: 'RPT-20467', 
    mission: '#MS-20467', 
    vehicle: 'Mercedes E-Class', 
    driver: 'Jean Dupont', 
    customer: 'Auto Palace SA', 
    pickup: 'Today', 
    delivery: 'Pending', 
    completeness: 60, 
    damage: 'Pending', 
    status: 'Needs Review' 
  },
  { 
    id: 'RPT-20412', 
    mission: '#MS-20412', 
    vehicle: 'Audi A4', 
    driver: 'James Davis', 
    customer: 'Premium Motors SAS', 
    pickup: 'Apr 18', 
    delivery: 'Apr 18', 
    completeness: 100, 
    damage: 'Damage Found', 
    status: 'Needs Review' 
  },
];

const metrics = [
  { title: "Total Reports", value: "1,128", color: "text-gray-900" },
  { title: "Pickup Proof Complete", value: "980", color: "text-emerald-500" },
  { title: "Delivery Proof Complete", value: "934", color: "text-emerald-500" },
  { title: "Damage Found", value: "26", color: "text-red-500" },
  { title: "Missing Proof", value: "41", color: "text-orange-500" },
  { title: "Verified Reports", value: "876", color: "text-blue-600" },
];

const tabs = ["All", "Pickup", "Delivery", "Damage", "No Damage", "Missing", "Verified"];

const InspectionsReportsPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
              {mockReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/50 transition-colors bg-white">
                  <td className="px-5 py-6 whitespace-nowrap font-bold text-blue-600">{report.id}</td>
                  <td className="px-5 py-6 whitespace-nowrap font-bold text-blue-600">{report.mission}</td>
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
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default InspectionsReportsPage;