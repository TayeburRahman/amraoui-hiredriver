"use client";

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
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




const MissionMonitoringPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMission, setSelectedMission] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [missionsData, setMissionsData] = useState<any[]>([]);

  // Simulate loading state
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setIsLoading(true);
        const { ok, data } = await apiFetch<any>('/requests', { auth: true });
        if (ok && data?.success) {
          const mapped = data.data.map((req: any) => {
            let status = 'Pending';

            if (req.status === 'PENDING_ADMIN_QUOTE') {
              status = 'Pending Quote';
            } else if (req.status === 'CUSTOMER_REVIEWING_QUOTE') {
              status = 'Customer Reviewing';
            } else if (req.status === 'OPEN_FOR_DRIVERS') {
              status = 'Open for Drivers';
            } else if (req.status === 'ADMIN_REVIEWING_DRIVERS') {
              status = 'Reviewing Drivers';
            } else if (req.status === 'ASSIGNED') {
              status = 'Assigned';
            } else if (req.status === 'IN_PROGRESS') {
              status = 'In Transit';
            } else if (req.status === 'COMPLETED') {
              status = 'Completed';
            } else if (req.status === 'REJECTED_BY_CUSTOMER' || req.status === 'CANCELLED') {
              status = 'Cancelled';
            }

            let vehicleStr = "Vehicle";
            let routeStr = "N/A";

            if (req.type === 'TRANSPORT') {
              vehicleStr = `${req.details?.make || ''} ${req.details?.model || ''}`.trim() || 'Transport';
              routeStr = `${req.details?.pickupCity || 'N/A'} → ${req.details?.dropoffCity || 'N/A'}`;
            } else if (req.type === 'HIRE_DRIVER') {
              vehicleStr = `Driver Request (${req.details?.driverCount || 1})`;
              routeStr = req.details?.driverCity || 'N/A';
            } else if (req.type === 'INSPECTION') {
              vehicleStr = `${req.details?.vehicleBrand || ''} ${req.details?.vehicleModel || ''}`.trim() || 'Inspection';
              routeStr = req.details?.inspectionLocation || 'N/A';
            }

            return {
              id: req.missionId || `MS-${req._id.slice(-5).toUpperCase()}`,
              type: req.type === 'HIRE_DRIVER' ? 'Hire Driver' : 
                    req.type === 'TRANSPORT' ? 'Transport' : 
                    req.type === 'INSPECTION' ? 'Inspection' : (req.type || 'Unknown'),
              realId: req._id,
              customer: req.customerId?.name || req.details?.customerName || req.details?.firstName || 'Guest',
              driver: req.assignedDriverId?.name || 'Unassigned',
              vehicle: vehicleStr,
              route: routeStr,
              status,
              proof: 'Pending',
              expense: 'None',
              invoice: 'Not Generated',
              issue: 'None',
              raw: req
            };
          });
          setMissionsData(mapped);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMissions();
  }, []);

  // Filter missions based on active tab and search query
  const filteredMissions = missionsData.filter(mission => {
    // Basic mapping for tabs if needed
    const matchesTab = activeTab === "All" ? true : mission.status === activeTab || (activeTab === "New request" && mission.status === "Pending");
    const matchesSearch =
      mission.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.vehicle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const dynamicTabsData: TabOption[] = [
    {
      id: "All",
      label: "All Missions",
      count: missionsData.length
    },
    {
      id: "New request",
      label: "New request",
      count: missionsData.filter(m => m.status === 'Pending').length
    },
    {
      id: "Pending Quote",
      label: "Pending Quote",
      count: missionsData.filter(m => m.status === 'Pending Quote').length
    },
    {
      id: "Open for Drivers",
      label: "Open for Drivers",
      count: missionsData.filter(m => m.status === 'Open for Drivers').length
    },
    {
      id: "Assigned",
      label: "Assigned",
      count: missionsData.filter(m => m.status === 'Assigned').length
    },
    {
      id: "Pickup Started",
      label: "Pickup Started",
      count: missionsData.filter(m => m.status === 'Pickup Started').length
    },
    {
      id: "Vehicle Picked Up",
      label: "Vehicle Picked Up",
      count: missionsData.filter(m => m.status === 'Vehicle Picked Up').length
    },
    {
      id: "In Transit",
      label: "In Transit",
      count: missionsData.filter(m => m.status === 'In Transit').length
    },
    {
      id: "Completed",
      label: "Completed",
      count: missionsData.filter(m => m.status === 'Completed').length
    },


  ];

  const dynamicMetricsData = [
    {
      title: "Assigned Missions",
      value: missionsData.filter(m => m.status === 'Assigned').length.toString(),
      description: "Driver assigned, not started",
      icon: ClipboardList,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Pickup Started",
      value: missionsData.filter(m => m.status === 'Pickup Started').length.toString(),
      description: "Pickup process active",
      icon: PlayCircle,
      iconBgColor: "bg-cyan-100",
      iconColor: "text-cyan-600"
    },
    {
      title: "Vehicle Picked Up",
      value: missionsData.filter(m => m.status === 'Vehicle Picked Up').length.toString(),
      description: "Pickup inspection done",
      icon: CheckCircle2,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "In Transit",
      value: missionsData.filter(m => m.status === 'In Transit').length.toString(),
      description: "Vehicle on the way",
      icon: Truck,
      iconBgColor: "bg-indigo-100",
      iconColor: "text-indigo-600"
    },
    {
      title: "New request",
      value: missionsData.filter(m => m.status === 'Pending').length.toString(),
      description: "Newly submitted request",
      icon: PackageCheck,
      iconBgColor: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      title: "Completed",
      value: missionsData.filter(m => m.status === 'Completed').length.toString(),
      description: "Mission fully completed",
      icon: CheckCheck,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Pending Expenses",
      value: "0",
      description: "Driver receipts need admin review",
      icon: Clock,
      iconBgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      title: "Needs Attention",
      value: "0",
      description: "Missing proof / issue found",
      icon: AlertCircle,
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600"
    }
  ];

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
        {dynamicMetricsData.map((metric, index) => (
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
            tabs={dynamicTabsData}
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