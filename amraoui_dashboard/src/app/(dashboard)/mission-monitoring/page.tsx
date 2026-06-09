"use client";

import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  PlayCircle, 
  CheckCircle2, 
  Truck, 
  PackageCheck, 
  CheckCheck, 
  Clock, 
  AlertCircle,
  MapPin,
  Download,
  RefreshCw,
  Search,
  Filter,
  RotateCcw
} from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { FilterTabs, TabOption } from './components/FilterTabs';
import { MissionTable, Mission } from './components/MissionTable';
import { Pagination } from './components/Pagination';
import { MissionDetailsModal } from './components/MissionDetailsModal';


const metricsData = [
  {
    title: "Assigned Missions",
    value: "12",
    description: "Driver assigned, not started",
    icon: ClipboardList,
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    title: "Pickup Started",
    value: "6",
    description: "Pickup process active",
    icon: PlayCircle,
    iconBgColor: "bg-cyan-100",
    iconColor: "text-cyan-600"
  },
  {
    title: "Vehicle Picked Up",
    value: "9",
    description: "Pickup inspection done",
    icon: CheckCircle2,
    iconBgColor: "bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    title: "In Transit",
    value: "14",
    description: "Vehicle on the way",
    icon: Truck,
    iconBgColor: "bg-indigo-100",
    iconColor: "text-indigo-600"
  },
  {
    title: "Delivered",
    value: "5",
    description: "Delivery done, final review pending",
    icon: PackageCheck,
    iconBgColor: "bg-emerald-100",
    iconColor: "text-emerald-600"
  },
  {
    title: "Completed",
    value: "28",
    description: "Mission fully completed",
    icon: CheckCheck,
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    title: "Pending Expenses",
    value: "4",
    description: "Driver receipts need admin review",
    icon: Clock,
    iconBgColor: "bg-orange-100",
    iconColor: "text-orange-600"
  },
  {
    title: "Needs Attention",
    value: "4",
    description: "Missing proof / issue found",
    icon: AlertCircle,
    iconBgColor: "bg-red-100",
    iconColor: "text-red-600"
  }
];

const tabsData: TabOption[] = [
  { id: "All", label: "All Missions", count: 78 },
  { id: "Assigned", label: "Assigned", count: 12 },
  { id: "Pickup Started", label: "Pickup Started", count: 6 },
  { id: "Vehicle Picked Up", label: "Vehicle Picked Up", count: 9 },
  { id: "In Transit", label: "In Transit", count: 14 },
  { id: "Delivered", label: "Delivered", count: 5 },
  { id: "Completed", label: "Completed", count: 28 }
];

const mockMissions: Mission[] = [
  {
    id: "MS-20458",
    requestId: "REQ-20458",
    customer: "Amraoui",
    driver: "Marc Dubois",
    vehicle: "BMW X5",
    route: "Paris → Lyon",
    status: "In Transit",
    proof: "Pickup Proof Uploaded",
    expense: "None",
    invoice: "Not Generated",
    issue: "No Issue"
  },
  {
    id: "MS-20461",
    requestId: "REQ-20461",
    customer: "Auto Palace SA",
    driver: "Jean Dupont",
    vehicle: "Audi A4",
    route: "Marseille → Nice",
    status: "Pickup Started",
    proof: "Vehicle Verification Pending",
    expense: "None",
    invoice: "Not Generated",
    issue: "Needs Attention"
  },
  {
    id: "MS-20470",
    requestId: "REQ-20470",
    customer: "Luxury Cars Marrakech",
    driver: "James Davis",
    vehicle: "Mercedes E-Class",
    route: "Casablanca → Marrakech",
    status: "Completed",
    proof: "Report Ready",
    expense: "Pending Review",
    invoice: "Draft",
    issue: "Extra Expense Pending"
  },
  {
    id: "MS-20480",
    requestId: "REQ-20480",
    customer: "Premium Motors",
    driver: "Sarah Keller",
    vehicle: "Tesla Model 3",
    route: "Lille → Paris",
    status: "Completed",
    proof: "Verified",
    expense: "Approved",
    invoice: "Sent",
    issue: "No Issue"
  }
];

const MissionMonitoringPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter missions based on active tab and search query
  const filteredMissions = mockMissions.filter(mission => {
    const matchesTab = activeTab === "All" ? true : mission.status === activeTab;
    const matchesSearch = 
      mission.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="overflow-auto pb-8 min-h-screen bg-[#F8F9FA]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pt-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mission Monitoring</h1>
          <p className="text-sm text-gray-500 max-w-xl">
            Track assigned missions, driver progress, pickup/delivery proof, completion status, extra expenses, and final invoices.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors text-sm">
            <PlayCircle className="w-4 h-4" />
            Live Mission Tracking
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-sm">
            <MapPin className="w-4 h-4" />
            Map View
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-sm">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
        {metricsData.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Search and Filters */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by mission ID, request ID, customer, driver, VIN, vehicle..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" 
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors text-sm">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
            <button 
              onClick={() => { setSearchQuery(""); setActiveTab("All"); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4 text-gray-500" />
              Reset
            </button>
          </div>
        </div>

        {/* Tabs and Table container */}
        <div className="p-5">
          <FilterTabs 
            tabs={tabsData} 
            activeTab={activeTab} 
            onTabChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1); // Reset page on tab change
            }} 
          />
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Loading missions data...</p>
            </div>
          ) : (
            <>
              {filteredMissions.length > 0 ? (
                <div className="animate-in fade-in duration-500">
                  <MissionTable 
                    missions={filteredMissions} 
                    onViewMission={(mission) => {
                      setSelectedMission(mission);
                      setIsModalOpen(true);
                    }}
                  />

                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={1} 
                    onPageChange={setCurrentPage} 
                  />
                </div>
              ) : (
                <div className="text-center py-20 border border-gray-100 rounded-xl bg-gray-50">
                  <p className="text-gray-500 font-medium">No missions found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <MissionDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mission={selectedMission}
      />
    </div>
  );
};

export default MissionMonitoringPage;