"use client";

import { useState } from "react";
import PageTitle from "@/components/PageTitle/PageTitle";
import Image from "next/image";
import img1 from "../../asstes/c1.png";
import img2 from "../../asstes/c2.png";
import img3 from "../../asstes/c3.png";
import img4 from "../../asstes/c4.png";
import img5 from "../../asstes/c5.png";
import { Search, Eye } from "lucide-react";
import { ViewDetailsModal } from "./components/ViewDetailsModal";


const page = () => {
  const [activeTab, setActiveTab] = useState("All Requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const tabs = [
    "All Requests",
    "Pending",
    "Accepted",
    "Rejected",
    "Urgent",
  ];

  const getTabCount = (tab: string) => {
    if (tab === "All Requests") return tableData.length;
    if (tab === "Pending") return tableData.filter((item) => item.status === "Pending").length;
    if (tab === "Accepted") return tableData.filter((item) => item.status === "Accepted").length;
    if (tab === "Rejected") return tableData.filter((item) => item.status === "Rejected").length;
    if (tab === "Urgent") return tableData.filter((item) => item.priority === "Urgent").length;
    return 0;
  };

  const metrics = [
    {
      title: "Pending Requests",
      description: "Waiting for admin review",
      value: "18",
      icon: img1,
    },
    {
      title: "Accepted Requests",
      description: "Sent to quote flow",
      value: "24",
      icon: img2,
    },
    {
      title: "Rejected Requests",
      description: "Declined by admin",
      value: "09",
      icon: img3,
    },
    {
      title: "Today's Requests",
      description: "Submitted today",
      value: "07",
      icon: img4,
    },
    {
      title: "Urgent Requests",
      description: "Need faster review",
      value: "128",
      icon: img5,
    },
  ];

  const tableData = [
    {
      requestId: "#REQ-001",
      customer: "Marie Dupont",
      company: "LogiTrans France",
      route: "Paris → Lyon",
      vehicle: "Mercedes Sprinter",
      pickupDate: "2024-05-15",
      submitted: "2 hours ago",
      status: "Pending",
      priority: "Urgent",
      type: "Transport Request",
    },
    {
      requestId: "#REQ-002",
      customer: "Jean Martin",
      company: "AutoExpress SARL",
      route: "Marseille → Nice",
      vehicle: "Peugeot Boxer",
      pickupDate: "2024-05-16",
      submitted: "5 hours ago",
      status: "Accepted",
      priority: "Normal",
      type: "Transport Request",
    },
    {
      requestId: "#REQ-003",
      customer: "Sophie Bernard",
      company: "QuickMove Logistics",
      route: "Lille → Paris",
      vehicle: "Renault Master",
      pickupDate: "2024-05-17",
      submitted: "1 day ago",
      status: "Pending",
      priority: "Normal",
      type: "Technical Inspection",
    },
    {
      requestId: "#REQ-004",
      customer: "Pierre Leroy",
      company: "FastTrack Delivery",
      route: "Bordeaux → Toulouse",
      vehicle: "Ford Transit",
      pickupDate: "2024-05-18",
      submitted: "2 days ago",
      status: "Rejected",
      priority: "Normal",
      type: "Hire a Driver",
    },
    {
      requestId: "#REQ-005",
      customer: "Claire Moreau",
      company: "EcoTransport SA",
      route: "Nantes → Rennes",
      vehicle: "Volkswagen Crafter",
      pickupDate: "2024-05-19",
      submitted: "3 days ago",
      status: "Pending",
      priority: "Urgent",
      type: "Transport Request",
    },
    {
      requestId: "#REQ-006",
      customer: "Lucas Petit",
      company: "SwiftMove Ltd",
      route: "Strasbourg → Nancy",
      vehicle: "Iveco Daily",
      pickupDate: "2024-05-20",
      submitted: "4 days ago",
      status: "Accepted",
      priority: "Normal",
      type: "Transport Request",
    },
    {
      requestId: "#REQ-007",
      customer: "Emma Rousseau",
      company: "GreenLogistics",
      route: "Grenoble → Lyon",
      vehicle: "MAN TGE",
      pickupDate: "2024-05-21",
      submitted: "5 days ago",
      status: "Pending",
      priority: "Normal",
      type: "Technical Inspection",
    },
    {
      requestId: "#REQ-008",
      customer: "Thomas Girard",
      company: "ProDelivery Systems",
      route: "Toulouse → Montpellier",
      vehicle: "Fiat Ducato",
      pickupDate: "2024-05-22",
      submitted: "6 days ago",
      status: "Rejected",
      priority: "Normal",
      type: "Hire a Driver",
    },
  ];

  const filteredData = tableData.filter((item) => {
    const matchesTab =
      activeTab === "All Requests" ||
      (activeTab === "Pending" && item.status === "Pending") ||
      (activeTab === "Accepted" && item.status === "Accepted") ||
      (activeTab === "Rejected" && item.status === "Rejected") ||
      (activeTab === "Urgent" && item.priority === "Urgent");

    const matchesSearch =
      searchQuery === "" ||
      item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.route.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-700";
      case "Normal":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="overflow-auto">
      <PageTitle
        heading="Customer Requests"
        description="Review new transport requests submitted by customers before sending them to driver quotation."
      ></PageTitle>
      <div className="grid grid-cols-5 gap-4 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <Image
                src={metric.icon}
                alt="metric icon"
                height={50}
                width={50}
              ></Image>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {metric.value}
            </div>
            <div>
              <h1 className="font-semibold mt-1">{metric.title}</h1>
              <h1 className="text-sm text-gray-500">{metric.description}</h1>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Tabs and Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab} ({getTabCount(tab)})
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pickup Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((row) => (
              <tr key={row.requestId} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {row.requestId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {row.customer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {row.company}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {row.route}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {row.vehicle}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {row.pickupDate}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {row.submitted}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                      row.priority
                    )}`}
                  >
                    {row.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {row.type}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => {
                      setSelectedRequest(row);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No requests found</p>
          </div>
        )}
      </div>
      
      <ViewDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
      />
    </div>
  );
};

export default page;
