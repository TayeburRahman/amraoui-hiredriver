"use client";

import PageTitle from "@/components/PageTitle/PageTitle";

import img1 from "../../asstes/Container.png";
import img2 from "../../asstes/Container (1).png";
import img3 from "../../asstes/Container (2).png";
import img4 from "../../asstes/Container (3).png";
import img5 from "../../asstes/Container (4).png";
import img6 from "../../asstes/Container (5).png";

import Image from "next/image";

export default function Overview() {
  const metrics = [
    {
      title: "New Customer Requests",
      value: "18",
      change: "+12%",
      changeType: "positive",
      icon: img1,
    },
    {
      title: "Pending Driver Quotes",
      value: "24",
      change: "+8 new",
      changeType: "neutral",
      icon: img2,
    },
    {
      title: "Pickup Due Today",
      value: "09",
      change: "~2 urgent",
      changeType: "warning",
      icon: img3,
    },
    {
      title: "Delivery Due Today",
      value: "07",
      change: "~1 delayed",
      changeType: "warning",
      icon: img4,
    },
    {
      title: "Completed Missions",
      value: "128",
      change: "+18%",
      changeType: "positive",
      icon: img5,
    },
    {
      title: "Cancelled Missions",
      value: "04",
      change: "~2%",
      changeType: "negative",
      icon: img6,
    },
  ];

  const recentActivities = [
    {
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
      iconPath: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "New quote submitted",
      description: "Jean Dupont submitted a €72 quote for #MS-20458.",
      time: "5 min ago",
      hasNotification: true,
      action: "Review",
    },
    {
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      iconPath: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Quote accepted",
      description: "Admin accepted quote #QT-1042 for Paris → Lyon.",
      time: "18 min ago",
      hasNotification: false,
      action: "View mission",
    },
    {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      iconPath: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      title: "Driver assigned",
      description: "Marc Dubois assigned to #MS-20412.",
      time: "35 min ago",
      hasNotification: false,
      action: "Open",
    },
    {
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      iconPath: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Pickup completed",
      description: "Pickup inspection completed for BMW X5.",
      time: "1h ago",
      hasNotification: false,
      action: "View proof",
    },
    {
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      iconPath: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: "Delivery completed",
      description: "Delivery report generated for #HF-20412.",
      time: "2h ago",
      hasNotification: false,
      action: "View report",
    },
    {
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      iconPath: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      title: "Report generated",
      description: "Final PDF report is ready for download.",
      time: "2h ago",
      hasNotification: false,
      action: "Download",
    },
  ];

  const tableData = [
    {
      id: "#MS-20458",
      route: "Paris -> Lyon",
      vehicle: "BMW X5",
      driver: "Marc Dubois",
      timeWindow: "Pickup @ 10:30 AM",
      status: "Pickup due",
      priority: "High",
      action: "Open",
    },
    {
      id: "#MS-20461",
      route: "Marseille -> Nice",
      vehicle: "Audi A4",
      driver: "Pending driver",
      timeWindow: "Quote review",
      status: "Needs quote decision",
      priority: "Urgent",
      action: "Review Quote",
    },
    {
      id: "#MS-20388",
      route: "Lille -> Paris",
      vehicle: "Tesla Model 3",
      driver: "James Davis",
      timeWindow: "Delivery @ 4:00 PM",
      status: "Delivery due",
      priority: "Normal",
      action: "Track",
    },
    {
      id: "#MS-20372",
      route: "Lyon -> Bordeaux",
      vehicle: "Renault Clio",
      driver: "Jean Dupont",
      timeWindow: "Delayed 32 min",
      status: "Delayed",
      priority: "High",
      action: "Contact Driver",
    },
  ];

  const trendHeights = [40, 55, 45, 70, 60, 85, 75];
  const trendDays = ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];

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
                className={`text-xs font-medium ${
                  metric.changeType === "positive"
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
                  <button className="mt-1 text-xs text-blue-500 font-medium flex items-center gap-1 hover:text-blue-700">
                    {activity.action}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote & Finance Snapshot */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quote & Finance Snapshot</h3>

          {/* Top stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-600">24</div>
              <div className="text-xs text-gray-500 mt-1">Pending Quotes</div>
            </div>
            <div className="bg-pink-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-pink-600">€3,840</div>
              <div className="text-xs text-gray-500 mt-1">Pending Payouts</div>
            </div>
          </div>

          {/* Avg Response & Best Margin */}
          <div className="border border-gray-100 rounded-xl divide-y divide-gray-100 mb-4">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500">Avg Response Time</span>
              <span className="text-sm font-semibold text-gray-900">18 min</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500">Best Margin</span>
              <span className="text-sm font-semibold text-green-600">#MS-20461</span>
            </div>
          </div>

          {/* Quote Distribution */}
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-500 mb-2">Quote Distribution</div>
            <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
              <div className="flex-[2] bg-green-500 flex items-center justify-center text-xs text-white font-semibold rounded-l-lg">
                Accepted
              </div>
              <div className="flex-[1.2] bg-red-500 flex items-center justify-center text-xs text-white font-semibold">
                Rejected
              </div>
              <div className="flex-[1.5] bg-amber-400 flex items-center justify-center text-xs text-white font-semibold rounded-r-lg">
                Pending
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
                  points={trendHeights
                    .map((h, i) => `${(i / (trendHeights.length - 1)) * 240 + 10},${60 - (h / 100) * 50}`)
                    .join(" ")}
                />
                {trendHeights.map((h, i) => (
                  <circle
                    key={i}
                    cx={(i / (trendHeights.length - 1)) * 240 + 10}
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

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">14</div>
              <div className="text-xs text-gray-500 mt-0.5">In Transit</div>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-red-500">2</div>
              <div className="text-xs text-gray-500 mt-0.5">Delayed</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-green-600">7</div>
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
              <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                Needs Action
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
                Pickups
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
                Deliveries
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
                Delayed
              </button>
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
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      row.status === "Delayed"
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
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      row.priority === "Urgent" || row.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {row.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    {row.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}