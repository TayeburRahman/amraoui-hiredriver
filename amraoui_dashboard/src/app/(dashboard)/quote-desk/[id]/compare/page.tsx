"use client";

import React, { useState } from 'react';
import { Star, MapPin, Briefcase, X, Eye, ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';

const drivers = [
  {
    id: 1,
    name: "Marc Dubois",
    avatar: "MD",
    rating: 4.9,
    jobs: 152,
    distance: 12,
    status: "New",
    availability: "Available Today • No active mission",
    skills: ["Vehicle Inspection", "EV Vehicle Handling", "Premium Vehicle Transfer"],
    servicePrice: 400,
    extraCosts: 52,
    totalQuote: 452,
    comment: "Available same day. Route includes toll roads. I have experience with BMW electric vehicles.",
    isVerified: true,
  },
  {
    id: 2,
    name: "Jean Dupont",
    avatar: "JD",
    rating: 4.7,
    jobs: 98,
    distance: 8,
    status: "Reviewing",
    availability: "Available Now • No active mission",
    skills: ["Long-distance Transfer", "EV Vehicle Handling"],
    servicePrice: 380,
    extraCosts: 50,
    totalQuote: 430,
    comment: "Can start immediately. Best price guaranteed.",
    isVerified: true,
  },
  {
    id: 3,
    name: "Pierre Martin",
    avatar: "PM",
    rating: 4.8,
    jobs: 124,
    distance: 15,
    status: "New",
    availability: "Busy • Has active mission",
    availabilityAlert: "Driver has active mission during pickup time",
    skills: ["Premium Vehicle Transfer", "Multi-Vehicle Transport"],
    servicePrice: 420,
    extraCosts: 55,
    totalQuote: 475,
    comment: "Premium service with insurance included.",
    isVerified: true,
  },
  {
    id: 4,
    name: "Sophie Laurent",
    avatar: "SL",
    rating: 4.9,
    jobs: 186,
    distance: 10,
    status: "New",
    availability: "Available Today • No active mission",
    skills: ["Vehicle Inspection", "Long-distance Transfer", "Premium Vehicle Transfer"],
    servicePrice: 440,
    extraCosts: 60,
    totalQuote: 500,
    comment: "Experienced driver with perfect safety record.",
    isVerified: true,
  }
];

const CompareDrivers = ({ params }: { params: { id: string } }) => {
    const [activeFilter, setActiveFilter] = useState("All");

    const filters = ["All", "Verified", "Available Now", "Best Match", "No Active Mission"];

    return (
        <div className="p-6 max-w-7xl mx-auto overflow-auto">
            {/* Back Button */}
            <Link href={`/quote-desk/${params.id}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium text-sm w-fit">
                <ArrowLeft className="w-4 h-4" /> Back to Request Details
            </Link>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Driver Quotations</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Sort by:</span>
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <Filter className="w-4 h-4" /> Lowest Quote
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {filters.map(filter => (
                        <button 
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                                activeFilter === filter 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Driver Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {drivers.map(driver => (
                        <div key={driver.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 transition-colors flex flex-col h-full">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-3">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                        {driver.avatar}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <h3 className="font-bold text-gray-900">{driver.name}</h3>
                                            {driver.isVerified && <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                            <div className="flex items-center gap-0.5">
                                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                <span className="font-medium text-gray-700">{driver.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                                <span>{driver.jobs} jobs</span>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                <span>{driver.distance} km from pickup</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${driver.status === "New" ? "bg-blue-50 text-blue-600" : "bg-yellow-50 text-yellow-600"}`}>
                                    {driver.status}
                                </span>
                            </div>

                            {/* Availability */}
                            <div className={`mb-4 px-3 py-1.5 rounded-lg text-xs font-medium ${driver.availability.includes("Busy") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                                {driver.availability}
                            </div>
                            
                            {driver.availabilityAlert && (
                                <div className="mb-4 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium flex items-center gap-1">
                                    <span className="w-1 h-1 bg-red-600 rounded-full"></span> {driver.availabilityAlert}
                                </div>
                            )}

                            {/* Skills */}
                            <div className="mb-4">
                                <p className="text-xs text-gray-400 font-medium mb-2">Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {driver.skills.map(skill => (
                                        <span key={skill} className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 mb-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-2">
                                    <span>Service price</span>
                                    <span className="font-bold text-gray-900">€{driver.servicePrice}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mb-3">
                                    <span>Extra costs</span>
                                    <span className="font-bold text-gray-900">€{driver.extraCosts}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="font-bold text-gray-900 text-sm">Total Quote</span>
                                    <span className="text-xl font-bold text-blue-600">€{driver.totalQuote}</span>
                                </div>
                            </div>

                            {/* Driver Comment */}
                            <div className="mb-6">
                                <p className="text-xs text-gray-400 font-medium mb-1">Driver Comment</p>
                                <p className="text-xs text-gray-600">{driver.comment}</p>
                            </div>

                            {/* Actions */}
                            <div className="mt-auto space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                                        <Eye className="w-3.5 h-3.5" /> View Profile
                                    </button>
                                    <button className="py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                                        <Eye className="w-3.5 h-3.5" /> View Quote
                                    </button>
                                </div>
                                <button className="w-full py-2 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-1">
                                    <X className="w-3.5 h-3.5" /> Reject
                                </button>
                                <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                                    Approve Quote
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompareDrivers;
