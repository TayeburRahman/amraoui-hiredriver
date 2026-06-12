"use client";

import React, { useState, useEffect } from 'react';
import PageTitle from '@/components/PageTitle/PageTitle';
import img1 from "../../asstes/img1.png";
import img2 from "../../asstes/img2.png";
import img3 from "../../asstes/img3.png";
import img4 from "../../asstes/img4.png";
import img5 from "../../asstes/img5.png";
import img6 from "../../asstes/img6.png";
import Image from 'next/image';
import { Search, Filter, ArrowUpDown, MapPin, Car, Calendar, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { apiFetch, getProfileImageUrl } from '@/lib/api';

const tabs = ["All", "Waiting for Quotes", "Quotes Received", "Pending Assignment", "Assigned", "Urgent"];

const QuoteDeskPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await apiFetch<any>('/requests', { auth: true });
        if (res.data?.success) {
          // Filter out requests that are still pending admin quote etc.
          // Quote desk is for OPEN_FOR_DRIVERS, ADMIN_REVIEWING_DRIVERS, ASSIGNED
          const relevantStatuses = ['OPEN_FOR_DRIVERS', 'ADMIN_REVIEWING_DRIVERS', 'ASSIGNED'];
          const relevantRequests = res.data.data.filter((req: any) =>
            relevantStatuses.includes(req.status) &&
            req.driverQuotes &&
            req.driverQuotes.length > 0
          );

          const mapped: any[] = [];
          relevantRequests.forEach((req: any) => {
            const date = new Date(req.createdAt);
            const pickupStr = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

            let route = 'N/A';
            if (req.type === 'TRANSPORT') {
              route = `${req.details?.pickupCity || 'N/A'} → ${req.details?.dropoffCity || 'N/A'}`;
            } else if (req.type === 'HIRE_DRIVER') {
              route = req.details?.driverCity || 'N/A';
            } else if (req.type === 'INSPECTION') {
              route = req.details?.inspectionLocation || 'N/A';
            }

            const idString = req._id ? (typeof req._id === 'object' ? (req._id.$oid || String(req._id)) : String(req._id)) : 'UNKNOWN';
            const finalMissionId = (req.missionId && req.missionId.trim() !== '') ? req.missionId : `MS-${idString.slice(-5).toUpperCase()}`;

            if (req.driverQuotes && req.driverQuotes.length > 0) {
              req.driverQuotes.forEach((quote: any) => {
                let status = quote.status === 'PENDING' ? 'Pending Quote' : 
                             quote.status === 'ACCEPTED' ? 'Assigned' : 'Rejected';

                mapped.push({
                  id: quote._id,
                  reqId: req._id,
                  missionId: finalMissionId,
                  title: req.customerId?.name || req.details?.customerName || req.details?.firstName || req.details?.name || 'Anonymous Customer',
                  type: req.type,
                  driver: quote.driverId,
                  route: route,
                  car: req.type === 'TRANSPORT' ? `${req.details?.make} ${req.details?.model}` : req.type,
                  pickup: pickupStr,
                  quoteAmount: quote.amount,
                  estimatedTime: quote.estimatedTime,
                  status: status,
                });
              });
            }
          });
          setRequests(mapped);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const metrics = [
    {
      title: "New Quotes",
      description: "New driver submissions",
      value: requests.length.toString(),
      icon: img1,
    },
    {
      title: "Pending Review",
      description: "Waiting for admin decision",
      value: requests.filter(r => r.status === 'Pending Quote').length.toString(),
      icon: img2,
    },
    {
      title: "Accepted Quotes",
      description: "Driver assigned",
      value: requests.filter(r => r.status === 'Assigned').length.toString(),
      icon: img3,
    },
    {
      title: "Rejected Quotes",
      description: "Declined by admin",
      value: requests.filter(r => r.status === 'Rejected').length.toString(),
      icon: img4,
    },
    {
      title: "Urgent Quotes",
      description: "Urgent mission quotes",
      value: "0",
      icon: img5,
    },
    {
      title: "Average Quote",
      description: "Average submitted quote",
      value: "€" + (requests.length ? Math.round(requests.reduce((sum, r) => sum + (r.quoteAmount || 0), 0) / requests.length) : 0),
      icon: img6,
    },
  ];

  const filteredRequests = activeTab === "All"
    ? requests.filter(req => req.status !== "Assigned")
    : requests.filter(req => req.status === activeTab);

  return (
    <div className="overflow-auto pb-8">
      <PageTitle
        heading="Quote Desk"
        description="Review multiple driver quotations for each accepted customer request and assign the best driver."
      ></PageTitle>

      <div className="grid grid-cols-6 gap-4 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <Image
                src={metric.icon}
                alt="metric icon"
                height={40}
                width={40}
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

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Accepted Requests</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search request, customer, route..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 bg-white transition-colors outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
                <Filter className="w-4 h-4 text-gray-500" /> Filter
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>Status</DropdownMenuItem>
                <DropdownMenuItem>Date</DropdownMenuItem>
                <DropdownMenuItem>Route</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 bg-white transition-colors outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
                <ArrowUpDown className="w-4 h-4 text-gray-500" /> Sort
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>Newest First</DropdownMenuItem>
                <DropdownMenuItem>Oldest First</DropdownMenuItem>
                <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No requests found for this status.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredRequests.map(req => (
              <div key={req.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors flex flex-col h-full">
                <div className="flex justify-between items-start mb-1">
                    <div className="text-blue-600 font-bold text-sm">Mission ID: {req.missionId}</div>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.status === 'Pending Quote' ? 'bg-yellow-50 text-yellow-600' :
                        req.status === 'Assigned' ? 'bg-green-50 text-green-600' :
                        'bg-gray-100 text-gray-600'
                    }`}>
                        {req.status}
                    </div>
                </div>
                <div className="font-bold text-gray-900 mb-4">Customer: {req.title}</div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
                    <span className="truncate">{req.route}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Car className="w-4 h-4 shrink-0 text-gray-400" />
                    <span className="truncate">{req.car}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 shrink-0 text-gray-400" />
                    <span className="truncate">Pickup: {req.pickup}</span>
                  </div>
                </div>

                {req.driver && (
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Submitted By</p>
                    <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      {req.driver.profile_image ? (
                        <img src={getProfileImageUrl(req.driver.profile_image) || ''} alt={req.driver.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                          {req.driver.name?.substring(0, 2).toUpperCase() || 'DR'}
                        </div>
                      )}
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-bold text-gray-900 truncate">{req.driver.name}</span>
                        <span className="text-[10px] text-gray-500 truncate">{req.driver.vehicle_plate || 'No Plate'}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-4">
                  <div className="flex flex-col">
                    <div className="text-[10px] text-gray-500 font-medium">Est. Time</div>
                    <div className="text-xs font-bold text-gray-900">{req.estimatedTime || 'N/A'}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-[10px] text-gray-500 font-medium">Quote Amount</div>
                    <div className="text-blue-600 font-black text-lg whitespace-nowrap">
                        €{req.quoteAmount}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <Link href={`/quote-desk/${req.id}?reqId=${req.reqId}`} className="flex-1 text-center py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors border border-gray-200">
                    View Details
                  </Link>
                  <Link href={`/quote-desk/${req.id}/compare?reqId=${req.reqId}`} className="flex-1 text-center py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100">
                    Compare Quotes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteDeskPage;