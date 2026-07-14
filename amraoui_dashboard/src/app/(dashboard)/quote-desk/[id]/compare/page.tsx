"use client";

import React, { useState, useEffect, use } from 'react';
import { Star, MapPin, Briefcase, Eye, ArrowLeft, Filter, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { DriverDetailsModal } from '@/app/(dashboard)/drivers/components/DriverDetailsModal';

const CompareDrivers = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const reqId = searchParams.get('reqId') || id; // Fallback to id if reqId is missing

    const [activeFilter, setActiveFilter] = useState("All");
    const [request, setRequest] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAssigning, setIsAssigning] = useState<string | null>(null);
    const [selectedDriver, setSelectedDriver] = useState<any>(null);
    const [sortBy, setSortBy] = useState("Lowest Quote");

    const filters = ["All", "Available Now", "Best Match"];

    useEffect(() => {
        const fetchRequest = async () => {
            setIsLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    filter: activeFilter,
                    sort: sortBy
                }).toString();
                
                const res = await apiFetch<any>(`/requests/${reqId}?${queryParams}`, { auth: true });
                if (res.data?.success) {
                    setRequest(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching request details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRequest();
    }, [reqId, activeFilter, sortBy]);

    const handleApprove = async (quoteId: string) => {
        try {
            setIsAssigning(quoteId);
            const res = await apiFetch<any>(`/requests/${reqId}/assign-driver`, { 
                method: 'PATCH', 
                auth: true, 
                body: JSON.stringify({ quoteId }) 
            });
            if (res.data?.success) {
                // Use the updated request from the backend which has the correct status and driver list
                setRequest(res.data.data);
            }
        } catch (error) {
            console.error("Error approving quote:", error);
            alert("Failed to assign driver. Please try again.");
        } finally {
            setIsAssigning(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!request || !request.driverQuotes || request.driverQuotes.length === 0) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <Link href={`/quote-desk/${id}?reqId=${reqId}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium text-sm w-fit">
                    <ArrowLeft className="w-4 h-4" /> Back to Request Details
                </Link>
                <div className="text-center text-gray-500 py-12">No quotes received yet for this request.</div>
            </div>
        );
    }

    const sortedQuotes = request.driverQuotes || [];
    const isMissionAssigned = request.status === 'ASSIGNED';

    return (
        <div className="p-6 max-w-7xl mx-auto overflow-auto">
            {/* Back Button */}
            <Link href={`/quote-desk/${id}?reqId=${reqId}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium text-sm w-fit">
                <ArrowLeft className="w-4 h-4" /> Back to Request Details
            </Link>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Driver Quotations</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Sort by:</span>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white cursor-pointer outline-none text-gray-900 font-medium"
                        >
                            <option>Lowest Quote</option>
                            <option>Highest Rating</option>
                        </select>
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
                    {sortedQuotes.map((quote: any) => {
                            const driver = quote.driverId || {};
                        const name = driver.name || "Unknown Driver";
                        const avatar = name.substring(0, 2).toUpperCase();
                        // Use real data if available, else placeholders
                        const rating = driver.rating || "4.8";
                        const jobs = driver.jobsCompleted || "24";
                        const distance = driver.distance || "10";
                        const isVerified = driver.isVerified !== false;
                        
                        const isAcceptedQuote = quote.status === 'ACCEPTED';
                        const isRejectedQuote = quote.status === 'REJECTED' || (isMissionAssigned && !isAcceptedQuote);

                        return (
                            <div key={quote._id} className={`bg-white rounded-xl border ${isAcceptedQuote ? 'border-green-400 bg-green-50/10' : 'border-gray-200'} p-6 hover:border-blue-300 transition-colors flex flex-col h-full opacity-${isRejectedQuote ? '60' : '100'}`}>
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                            {avatar}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <h3 className="font-bold text-gray-900">{name}</h3>
                                                {isVerified && <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                                <div className="flex items-center gap-0.5">
                                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                    <span className="font-medium text-gray-700">{rating}</span>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                    <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>{jobs} jobs</span>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>{distance} km</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${isAcceptedQuote ? "bg-green-100 text-green-700" : isRejectedQuote ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
                                        {isAcceptedQuote ? 'Accepted' : isRejectedQuote ? 'Rejected' : 'Pending'}
                                    </span>
                                </div>

                                {/* Pricing */}
                                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 mb-4">
                                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                                        <span>Estimated Service price</span>
                                        <span className="font-bold text-gray-900">€{quote.servicePrice || quote.amount}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mb-3">
                                        <span>Estimated Extra costs</span>
                                        <span className="font-bold text-gray-900">€{(quote.fuelCost || 0) + (quote.tollCharges || 0) + (quote.travelCost || 0) + (quote.taxiCost || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                        <span className="font-bold text-gray-900 text-sm">Total Quote</span>
                                        <span className="text-xl font-bold text-blue-600">€{quote.amount}</span>
                                    </div>
                                </div>

                                {/* Driver Comment */}
                                <div className="mb-6">
                                    <p className="text-xs text-gray-400 font-medium mb-1">Driver Note</p>
                                    <p className="text-xs text-gray-600">{quote.message || 'No additional comments provided.'}</p>
                                </div>

                                {/* Actions */}
                                <div className="mt-auto space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href={`/quote-desk/${quote._id}?reqId=${reqId}`} className="py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                                            <Eye className="w-3.5 h-3.5" /> View Full details
                                        </Link>
                                        <button onClick={() => setSelectedDriver(driver)} className="py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                                            <Eye className="w-3.5 h-3.5" /> View Documents
                                        </button>
                                    </div>
                                    {!isMissionAssigned && !isAcceptedQuote && !isRejectedQuote && (
                                        <button 
                                            onClick={() => handleApprove(quote._id)}
                                            disabled={isAssigning === quote._id}
                                            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isAssigning === quote._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Approve Quote'}
                                        </button>
                                    )}
                                    {isAcceptedQuote && (
                                        <div className="w-full py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-medium flex items-center justify-center gap-2">
                                            <CheckCircle className="w-4 h-4" /> Driver Assigned Successfully
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <DriverDetailsModal 
                isOpen={!!selectedDriver}
                onClose={() => setSelectedDriver(null)}
                driver={selectedDriver}
                onApprove={async () => {}}
                onDecline={async () => {}}
                loading={false}
            />
        </div>
    );
};

export default CompareDrivers;
