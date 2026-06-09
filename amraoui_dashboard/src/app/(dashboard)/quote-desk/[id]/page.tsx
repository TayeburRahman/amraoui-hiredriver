"use client";

import React, { useState } from 'react';
import { MapPin, Car, FileText, CheckCircle2, User, Mail, Phone, Building, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ViewDetailsModal } from '@/app/(dashboard)/customer-request/components/ViewDetailsModal';


const QuoteDetails = ({ params }: { params: { id: string } }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="p-6 max-w-7xl mx-auto overflow-auto">
            {/* Back Button */}
            <Link href="/quote-desk" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium text-sm w-fit">
                <ArrowLeft className="w-4 h-4" /> Back to Quote Desk
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 mb-6">Request Details</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Request Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-4">Request Summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Request ID</span>
                                <span className="font-bold text-blue-600">REQ-20458</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Mission ID</span>
                                <span className="font-bold text-gray-900">MISS-10245</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Status</span>
                                <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded-full text-xs font-medium">Pending Assignment</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Priority</span>
                                <span className="font-bold text-gray-900">Normal</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Customer</span>
                                <span className="font-bold text-gray-900">Amraoui / Premium Motors</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Submitted</span>
                                <span className="font-bold text-gray-900">10 May, 3:20 PM</span>
                            </div>
                        </div>
                    </div>

                    {/* Route Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <h2 className="text-sm font-bold text-gray-900">Route Information</h2>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-xs text-gray-400 font-medium mb-1">Pickup</p>
                                <p className="font-bold text-gray-900">Paris</p>
                                <p className="text-gray-500 text-xs">15 Rue de la Paix, 75002 Paris</p>
                                <p className="text-gray-500 text-xs">Contact: Jean Martin • +33 1 23 45 67 89</p>
                                <p className="text-blue-600 text-xs mt-1">12 May, 10:30 AM</p>
                            </div>
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs text-gray-400 font-medium mb-1">Delivery</p>
                                <p className="font-bold text-gray-900">Lyon</p>
                                <p className="text-gray-500 text-xs">42 Avenue Victor Hugo, 69003 Lyon</p>
                                <p className="text-gray-500 text-xs">Contact: Marie Dupont • +33 4 78 90 12 34</p>
                                <p className="text-blue-600 text-xs mt-1">12 May, 6:00 PM</p>
                            </div>
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs text-gray-400">Estimated Distance: 465 km</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Vehicle Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Car className="w-4 h-4 text-gray-400" />
                            <h2 className="text-sm font-bold text-gray-900">Vehicle Information</h2>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Vehicle Type</span>
                                <span className="font-bold text-gray-900">SUV</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Brand</span>
                                <span className="font-bold text-gray-900">BMW</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Model</span>
                                <span className="font-bold text-gray-900">X5</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">License Plate</span>
                                <span className="font-bold text-gray-900">AB-123-CD</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Engine Type</span>
                                <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs font-medium">Electric</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Instructions */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <h2 className="text-sm font-bold text-gray-900">Customer Instructions</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Please handle the vehicle carefully. Call before pickup. Vehicle has documents inside.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Call before pickup</span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Documents inside vehicle</span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Handle carefully</span>
                        </div>
                    </div>

                    {/* Quote Summary */}
                    <div className="bg-blue-50/30 rounded-xl border border-blue-100 p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-4">Quote Summary</h2>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                            <div>
                                <p className="text-gray-400 text-xs font-medium">Quotes Received</p>
                                <p className="text-2xl font-bold text-blue-600">4</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-medium">Lowest Quote</p>
                                <p className="text-2xl font-bold text-green-500">€430</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-medium">Highest Quote</p>
                                <p className="text-2xl font-bold text-red-500">€500</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-medium">Average Quote</p>
                                <p className="text-2xl font-bold text-amber-500">€462</p>
                            </div>
                            <div className="border-t border-blue-100 pt-3">
                                <p className="text-gray-400 text-xs font-medium">Our Proposed Price</p>
                                <p className="text-2xl font-bold text-blue-600">€462</p>
                            </div>
                            <div className="border-t border-blue-100 pt-3">
                                <p className="text-gray-400 text-xs font-medium">Our Max Price</p>
                                <p className="text-2xl font-bold text-blue-600">€500</p>
                            </div>
                        </div>
                    </div>

                    {/* Admin Note */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-2">Admin Note</h2>
                        <p className="text-xs text-gray-400 mb-3">Internal only — not visible to customer or driver.</p>
                        <textarea 
                            placeholder="Add internal note..."
                            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                            rows={3}
                        ></textarea>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Save Note
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                    View Full Request
                </button>

                <Link href={`/quote-desk/${params.id}/compare`} className="py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    Compare Drivers
                </Link>

                <button className="py-2.5 bg-white border border-amber-300 text-amber-600 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors">
                    Put On Hold
                </button>
                <button className="py-2.5 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                    Cancel Request
                </button>
            </div>
            <ViewDetailsModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                request={{
                    requestId: "REQ-20458",
                    status: "Pending",
                    priority: "Urgent",
                    type: "Transport Request",
                    customer: "Amraoui",
                    company: "Premium Motors",
                    vehicle: "BMW X5",
                }}
            />
        </div>
    );
};


export default QuoteDetails;