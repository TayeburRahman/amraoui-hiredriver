"use client";

import React, { useState } from 'react';
import PageTitle from '@/components/PageTitle/PageTitle';
import img1 from "../../asstes/img1.png";
import img2 from "../../asstes/img2.png";
import img3 from "../../asstes/img3.png";
import img4 from "../../asstes/img4.png";
import img5 from "../../asstes/img5.png";
import img6 from "../../asstes/img6.png";
import Image from 'next/image';
import { Search, Filter, ArrowUpDown, MapPin, Car, Calendar } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';


const mockRequests = [
  {
    id: "REQ-20458",
    title: "Amraoui / Premium Motors",
    route: "Paris → Lyon",
    car: "BMW X5",
    pickup: "12 May, 10:30 AM",
    quotes: 4,
    price: 430,
    status: "Pending Assignment",
  },
  {
    id: "REQ-20461",
    title: "Auto Palace SA",
    route: "Marseille → Nice",
    car: "Audi A4",
    pickup: "13 May, 2:00 PM",
    quotes: 2,
    price: 385,
    status: "Quotes Received",
  },
  {
    id: "REQ-20470",
    title: "Luxury Cars Marrakech",
    route: "Casablanca → Marrakech",
    car: "Mercedes E-Class",
    pickup: "14 May, 9:00 AM",
    quotes: 5,
    price: 520,
    status: "Urgent",
  },
  {
    id: "REQ-20471",
    title: "Luxury Cars Marrakech",
    route: "Casablanca → Marrakech",
    car: "Mercedes E-Class",
    pickup: "14 May, 9:00 AM",
    quotes: 5,
    price: 520,
    status: "Assigned",
  }
];

const tabs = ["All", "Waiting for Quotes", "Quotes Received", "Pending Assignment", "Assigned", "Urgent"];

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [activeTab, setActiveTab] = useState("All");

  const metrics = [
    {
      title: "New Quotes",
      description: "New driver submissions",
      value: "18",
      icon: img1,
    },
    {
      title: "Pending Review",
      description: "Waiting for admin decision",
      value: "24",
      icon: img2,
    },
    {
      title: "Accepted Quotes",
      description: "Driver assigned",
      value: "09",
      icon: img3,
    },
    {
      title: "Rejected Quotes",
      description: "Declined by admin",
      value: "07",
      icon: img4,
    },
    {
      title: "Urgent Quotes",
      description: "Urgent mission quotes",
      value: "128",
      icon: img5,
    },
    {
      title: "Average Quote",
      description: "Average submitted quote",
      value: "128",
      icon: img6,
    },
  ];

  const filteredRequests = activeTab === "All" 
    ? mockRequests 
    : mockRequests.filter(req => req.status === activeTab);

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
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredRequests.map(req => (
            <Link href={`/quote-desk/${req.id}`} key={req.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors block cursor-pointer">
              <div className="text-blue-600 font-bold text-sm mb-1">{req.id}</div>
              <div className="font-bold text-gray-900 mb-4">{req.title}</div>
              
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
              
              <div className="flex items-start justify-between mt-auto">
                <div className="flex flex-col gap-2.5">
                  <div className="text-xs text-gray-600 font-medium">{req.quotes} quotes received</div>
                  <div className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit ${
                    req.status === 'Pending Assignment' ? 'bg-yellow-50 text-yellow-600' :
                    req.status === 'Quotes Received' ? 'bg-yellow-50 text-yellow-600' :
                    req.status === 'Urgent' ? 'bg-red-50 text-red-600' :
                    req.status === 'Assigned' ? 'bg-green-50 text-green-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {req.status}
                  </div>
                </div>
                <div className="text-green-500 font-bold text-[15px] whitespace-nowrap">
                  $ €{req.price}
                </div>
              </div>
            </Link>

          ))}
        </div>
      </div>
    </div>
  );
};

export default page;