"use client";

import PageTitle from "@/components/PageTitle/PageTitle";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

import img1 from "../../asstes/Container.png";
import img2 from "../../asstes/Container (1).png";
import img3 from "../../asstes/Container (2).png";
import img4 from "../../asstes/Container (3).png";
import img5 from "../../asstes/Container (4).png";
import img6 from "../../asstes/Container (5).png";

import Image from "next/image";

export default function Overview() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All Missions");

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

  const countStatus = (status: string) => requests.filter((r) => r.status === status).length;

  const newCustomerRequests = countStatus("PENDING_ADMIN_QUOTE");
  const pendingDriverQuotes = countStatus("PENDING_DRIVER_QUOTE");
  const completedMissions = countStatus("COMPLETED");
  const cancelledMissions = countStatus("CANCELLED");
  const inTransitCount = countStatus("IN_TRANSIT");

  const todayStr = new Date().toISOString().split("T")[0];
  let pickupDueToday = 0;
  let deliveryDueToday = 0;
  requests.forEach(r => {
    if (r.details?.pickupDate && r.details.pickupDate.startsWith(todayStr) && !r.details?.pickupVerification?.verifiedAt) pickupDueToday++;
    if (r.details?.dropoffDate && r.details.dropoffDate.startsWith(todayStr) && !r.details?.deliveryArrivalTime) deliveryDueToday++;
  });
  const metrics = [
    {
      title: "New Customer Requests",
      value: newCustomerRequests.toString(),
      change: "Pending",
      changeType: "warning",
      icon: img1,
    },
    {
      title: "Pending Driver Quotes",
      value: pendingDriverQuotes.toString(),
      change: "Action Needed",
      changeType: "warning",
      icon: img2,
    },
    {
      title: "Pickup Due Today",
      value: pickupDueToday.toString(),
      change: pickupDueToday > 0 ? "~ Urgent" : "On track",
      changeType: pickupDueToday > 0 ? "warning" : "positive",
      icon: img3,
    },
    {
      title: "Delivery Due Today",
      value: deliveryDueToday.toString(),
      change: deliveryDueToday > 0 ? "~ Urgent" : "On track",
      changeType: deliveryDueToday > 0 ? "warning" : "positive",
      icon: img4,
    },
    {
      title: "Completed Missions",
      value: completedMissions.toString(),
      change: "Success",
      changeType: "positive",
      icon: img5,
    },
    {
      title: "Cancelled Missions",
      value: cancelledMissions.toString(),
      change: "Stopped",
      changeType: "negative",
      icon: img6,
    },
  ];

  const sortedRequests = [...requests].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const recentActivities = sortedRequests.slice(0, 5).map(r => {
    let title = "Status Updated";
    let desc = `Mission ${r.missionId} was updated.`;
    let iconColor = "text-blue-600";
    let iconBg = "bg-blue-100";

    if (r.status === 'COMPLETED') {
      title = "Delivery Completed";
      desc = `Mission ${r.missionId} has been successfully delivered.`;
      iconColor = "text-green-600";
      iconBg = "bg-green-100";
    } else if (r.status === 'PENDING_ADMIN_QUOTE') {
      title = "New Request";
      desc = `Customer submitted request ${r.missionId}.`;
      iconColor = "text-orange-500";
      iconBg = "bg-orange-100";
    } else if (r.status === 'ASSIGNED' || r.status === 'DRIVER_ASSIGNED') {
      title = "Driver Assigned";
      desc = `Driver assigned to ${r.missionId}.`;
      iconColor = "text-purple-600";
      iconBg = "bg-purple-100";
    } else if (r.status === 'VEHICLE_PICKED_UP') {
      title = "Pickup Completed";
      desc = `Pickup inspection done for ${r.missionId}.`;
      iconColor = "text-teal-600";
      iconBg = "bg-teal-100";
    } else if (r.status === 'OPEN_FOR_DRIVERS') {
      title = "Quote Accepted";
      desc = `Customer accepted the quote for ${r.missionId}.`;
      iconColor = "text-emerald-600";
      iconBg = "bg-emerald-100";
    } else if (r.status === 'CUSTOMER_REVIEWING_QUOTE') {
      title = "Quote Sent";
      desc = `Admin sent a quote for ${r.missionId} to customer.`;
      iconColor = "text-sky-600";
      iconBg = "bg-sky-100";
    } else if (r.status === 'REJECTED_BY_CUSTOMER') {
      title = "Quote Rejected";
      desc = `Customer rejected the quote for ${r.missionId}.`;
      iconColor = "text-red-600";
      iconBg = "bg-red-100";
    } else if (r.status === 'PENDING_DRIVER_QUOTE' || r.status === 'ADMIN_REVIEWING_DRIVERS') {
      title = "Driver Quoted";
      desc = `A driver submitted a quote for ${r.missionId}.`;
      iconColor = "text-indigo-600";
      iconBg = "bg-indigo-100";
    } else if (r.status === 'IN_PROGRESS' || r.status === 'IN_TRANSIT') {
      title = "Mission Started";
      desc = `Driver started mission ${r.missionId}.`;
      iconColor = "text-amber-600";
      iconBg = "bg-amber-100";
    } else if (r.status === 'DELIVERY_ARRIVAL') {
      title = "Arrived at Delivery";
      desc = `Driver arrived at delivery for ${r.missionId}.`;
      iconColor = "text-cyan-600";
      iconBg = "bg-cyan-100";
    } else if (r.status === 'CANCELLED') {
      title = "Mission Cancelled";
      desc = `Mission ${r.missionId} was cancelled.`;
      iconColor = "text-red-600";
      iconBg = "bg-red-100";
    }

    const timeDiff = Math.floor((new Date().getTime() - new Date(r.updatedAt).getTime()) / 60000);
    const timeStr = timeDiff < 60 ? `${timeDiff} min ago` : `${Math.floor(timeDiff / 60)}h ago`;

    return {
      id: r._id,
      iconBg,
      iconColor,
      iconPath: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title,
      description: desc,
      time: timeStr,
      hasNotification: false,
      action: "View",
    };
  });

  let filteredTableRequests = sortedRequests;
  if (activeFilter === "Needs Quote") {
    filteredTableRequests = sortedRequests.filter(r => r.status === 'PENDING_ADMIN_QUOTE');
  } else if (activeFilter === "Open for Bidding") {
    filteredTableRequests = sortedRequests.filter(r => r.status === 'OPEN_FOR_DRIVERS');
  } else if (activeFilter === "Active") {
    const activeStatuses = ['ASSIGNED', 'IN_PROGRESS', 'IN_TRANSIT', 'VEHICLE_PICKED_UP', 'DELIVERY_ARRIVAL'];
    filteredTableRequests = sortedRequests.filter(r => activeStatuses.includes(r.status));
  }

  const tableData = filteredTableRequests.slice(0, 8).map(r => {
    let route = 'Single Location';
    if (r.type === 'TRANSPORT') {
      const p = (r.details?.pickupAddress || "").split(",")[0];
      const d = (r.details?.dropoffAddress || "").split(",")[0];
      route = p && d ? `${p} -> ${d}` : 'N/A';
    } else if (r.type === 'INSPECTION') {
      route = (r.details?.inspectionLocation || "").split(",")[0] || 'N/A';
    } else if (r.type === 'HIRE_DRIVER') {
      route = (r.details?.driverLocation || "").split(",")[0] || 'N/A';
    }

    let vehicle = 'N/A';
    if (r.type === 'TRANSPORT') vehicle = `${r.details?.make || ''} ${r.details?.model || ''}`.trim() || 'N/A';
    if (r.type === 'INSPECTION') vehicle = `${r.details?.vehicleBrand || ''} ${r.details?.vehicleModel || ''}`.trim() || 'N/A';

    return {
      id: r.missionId || 'N/A',
      realId: r._id,
      route,
      vehicle,
      driver: r.assignedDriverId?.name || "Pending driver",
      timeWindow: r.details?.pickupTime ? `Pickup @ ${r.details.pickupTime}` : 'N/A',
      status: r.status.replace(/_/g, " "),
      priority: r.status === 'PENDING_ADMIN_QUOTE' ? 'High' : 'Normal',
      action: "Open",
    };
  });

  // Compute dynamic stats
  let bestMarginReq: any = null;
  let maxMargin = -1;
  requests.forEach(r => {
    if (r.adminQuote?.amount && r.adminQuote?.driverPrice) {
      const margin = Number(r.adminQuote.amount) - Number(r.adminQuote.driverPrice);
      if (margin > maxMargin) {
        maxMargin = margin;
        bestMarginReq = r;
      }
    }
  });
  const bestMarginStr = bestMarginReq ? (bestMarginReq.missionId || "N/A") : "N/A";

  const acceptedQuotes = requests.filter(r => ['ASSIGNED', 'IN_PROGRESS', 'IN_TRANSIT', 'VEHICLE_PICKED_UP', 'DELIVERY_ARRIVAL', 'COMPLETED'].includes(r.status)).length;
  const rejectedQuotes = requests.filter(r => ['CANCELLED', 'REJECTED_BY_CUSTOMER'].includes(r.status)).length;
  const pendingQuotesDist = requests.filter(r => ['OPEN_FOR_DRIVERS', 'PENDING_DRIVER_QUOTE', 'ADMIN_REVIEWING_DRIVERS', 'CUSTOMER_REVIEWING_QUOTE', 'PENDING_ADMIN_QUOTE'].includes(r.status)).length;
  const totalQuotes = (acceptedQuotes + rejectedQuotes + pendingQuotesDist) || 1; // avoid div by 0

  // 7-Day Trend
  const trendHeights = Array(7).fill(0);
  const trendDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    trendDays.push(d.toLocaleDateString('en-US', { weekday: 'short' }));

    const dStr = d.toISOString().split('T')[0];
    const dailyTotal = requests.filter(r => r.status === 'COMPLETED' && r.updatedAt.startsWith(dStr)).reduce((sum, r) => sum + Number(r.adminQuote?.amount || 0), 0);
    trendHeights[6 - i] = dailyTotal;
  }
  // Normalize heights to 0-85 for the chart
  const maxTrend = Math.max(...trendHeights, 1);
  const normalizedTrendHeights = trendHeights.map(h => (h / maxTrend) * 85);

  return (
    <div className="overflow-auto">
      <PageTitle
        heading="Overview"
        description="Monitor transport requests, driver quotes, missions, payouts, and support activity."
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <Image src={metric.icon} alt="metric icon" height={50} width={50} />
              <span
                className={`text-xs font-medium ${metric.changeType === "positive"
                  ? "text-green-600"
                  : metric.changeType === "negative"
                    ? "text-red-600"
                    : "text-gray-600"
                  }`}
              >
                {metric.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
            <div className="font-semibold text-gray-500 mt-1">{metric.title}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        {/* Recent Activity */}
        <div className="col-span-1 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-0">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 py-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${activity.iconBg} ${activity.iconColor}`}
                >
                  {activity.iconPath}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1 shrink-0">
                      {activity.time}
                      {activity.hasNotification && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {activity.description}
                  </p>
                  <Link href={`/quote-desk/${activity.id}`} className="mt-1 w-fit text-xs text-blue-500 font-medium flex items-center gap-1 hover:text-blue-700">
                    {activity.action}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote & Finance Snapshot */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quote & Finance Snapshot</h3>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-1x5 lg:text-1x5 tracking-tight font-bold text-blue-600">{pendingDriverQuotes}</div>
              <div className="text-[11px] lg:text-xs text-gray-500 mt-1">Pending Quotes</div>
            </div>
            <div className="bg-pink-50 rounded-xl p-4">
              <div className="text-1x10 lg:text-1x10 tracking-tight font-bold text-pink-600">€{requests.reduce((sum, r) => sum + (r.status === 'COMPLETED' ? Number(r.adminQuote?.amount || 0) : 0), 0).toLocaleString()}</div>
              <div className="text-[11px] lg:text-xs text-gray-500 mt-1 leading-tight">Total Revenue <br className="hidden xl:block" />(Completed)</div>
            </div>
          </div>

          {/* Avg Response & Best Margin */}
          <div className="border border-gray-100 rounded-xl divide-y divide-gray-100 mb-4">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500">Total Missions</span>
              <span className="text-sm font-semibold text-gray-900">{requests.length}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500">Best Margin</span>
              <span className="text-sm font-semibold text-green-600">{bestMarginStr}</span>
            </div>
          </div>

          {/* Quote Distribution */}
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-500 mb-2">Quote Distribution</div>
            <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
              <div style={{ flex: Math.max(acceptedQuotes / totalQuotes, 0.1) }} className="bg-green-500 flex items-center justify-center text-xs text-white font-semibold rounded-l-lg overflow-hidden whitespace-nowrap px-1">
                {acceptedQuotes > 0 ? `Accepted (${acceptedQuotes})` : ''}
              </div>
              <div style={{ flex: Math.max(rejectedQuotes / totalQuotes, 0.1) }} className="bg-red-500 flex items-center justify-center text-xs text-white font-semibold overflow-hidden whitespace-nowrap px-1">
                {rejectedQuotes > 0 ? `Rejected (${rejectedQuotes})` : ''}
              </div>
              <div style={{ flex: Math.max(pendingQuotesDist / totalQuotes, 0.1) }} className="bg-amber-400 flex items-center justify-center text-xs text-white font-semibold rounded-r-lg overflow-hidden whitespace-nowrap px-1">
                {pendingQuotesDist > 0 ? `Pending (${pendingQuotesDist})` : ''}
              </div>
            </div>
          </div>

          {/* 7-Day Payout Trend */}
          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">7-Day Payout Trend</div>
            <div className="bg-gray-50 rounded-xl p-3">
              {/* Line chart SVG */}
              <svg viewBox="0 0 260 70" className="w-full" style={{ height: 70 }}>
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={normalizedTrendHeights
                    .map((h, i) => `${(i / (normalizedTrendHeights.length - 1)) * 240 + 10},${60 - (h / 100) * 50}`)
                    .join(" ")}
                />
                {normalizedTrendHeights.map((h, i) => (
                  <circle
                    key={i}
                    cx={(i / (normalizedTrendHeights.length - 1)) * 240 + 10}
                    cy={60 - (h / 100) * 50}
                    r="3.5"
                    fill="#3B82F6"
                  />
                ))}
              </svg>
              <div className="flex justify-between mt-1">
                {trendDays.map((d) => (
                  <span key={d} className="text-[10px] text-gray-400 flex-1 text-center">{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Route Health */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Live Route Health</h3>
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          </div>

          {/* Route Map */}
          <div className="bg-blue-50 rounded-xl overflow-hidden mb-4" style={{ height: 140 }}>
            <svg width="100%" height="140" viewBox="0 0 320 140" preserveAspectRatio="xMidYMid meet">
              {/* Road paths */}
              <path
                d="M20 100 Q80 40 140 70 Q190 100 255 50 Q280 32 308 55"
                stroke="#93c5fd"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="5,3"
                opacity="0.6"
              />
              <path
                d="M20 75 Q70 105 130 60 Q180 22 245 65 Q272 82 308 42"
                stroke="#6366f1"
                strokeWidth="3"
                fill="none"
              />
              {/* Origin pin left */}
              <circle cx="20" cy="75" r="10" fill="white" stroke="#6366f1" strokeWidth="2" />
              <circle cx="20" cy="75" r="4" fill="#6366f1" />
              {/* Truck 1 */}
              <circle cx="135" cy="60" r="11" fill="white" stroke="#3B82F6" strokeWidth="2" />
              <text x="135" y="65" textAnchor="middle" fontSize="11" fill="#3B82F6">🚚</text>
              {/* Truck 2 */}
              <circle cx="245" cy="65" r="11" fill="white" stroke="#3B82F6" strokeWidth="2" />
              <text x="245" y="70" textAnchor="middle" fontSize="11" fill="#3B82F6">🚚</text>
              {/* Destination pin right */}
              <circle cx="308" cy="42" r="10" fill="white" stroke="#22c55e" strokeWidth="2" />
              <circle cx="308" cy="42" r="4" fill="#22c55e" />
              {/* Warning marker */}
              <circle cx="190" cy="108" r="10" fill="white" stroke="#f59e0b" strokeWidth="2" />
              <text x="190" y="113" textAnchor="middle" fontSize="11" fill="#f59e0b">⚠</text>
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{inTransitCount}</div>
              <div className="text-xs text-gray-500 mt-0.5">In Transit</div>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-red-500">{cancelledMissions}</div>
              <div className="text-xs text-gray-500 mt-0.5">Cancelled</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{pickupDueToday + deliveryDueToday}</div>
              <div className="text-xs text-gray-500 mt-0.5">Due Today</div>
            </div>
          </div>

          {/* On schedule + ring */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-extrabold text-gray-900">86%</div>
              <div className="text-sm text-gray-500 mt-0.5">On Schedule</div>
            </div>
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                <circle cx="28" cy="28" r="22" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="5"
                  strokeDasharray="138.2"
                  strokeDashoffset="19.3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
              <span className="text-xs text-gray-600">On time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <span className="text-xs text-gray-600">Delayed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="text-xs text-gray-600">Needs action</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Needs Action</h3>
            <div className="flex gap-2">
              {['All Missions', 'Needs Quote', 'Open for Bidding', 'Active'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeFilter === filter
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Mission ID", "Route", "Vehicle", "Driver", "Time Window", "Status", "Priority", "Action"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tableData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.route}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.vehicle}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.driver}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.timeWindow}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${row.status === "Delayed"
                      ? "bg-red-100 text-red-700"
                      : row.priority === "Urgent"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${row.priority === "Urgent" || row.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {row.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/quote-desk/${row.realId}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    {row.action}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}