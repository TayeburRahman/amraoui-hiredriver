"use client";

import React, { useState, useEffect, use } from 'react';
import { MapPin, Car, FileText, CheckCircle2, User, Mail, Phone, Building, ArrowLeft, Loader2, Paperclip, Trash2, Upload, Search, ShieldCheck, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ViewDetailsModal } from '@/app/(dashboard)/customer-request/components/ViewDetailsModal';
import { apiFetch, getProfileImageUrl } from '@/lib/api';
import { formatDate, formatDateTime, parseDateString } from '@/lib/dateUtils';
import { AssignDriverModal } from '../../mission-monitoring/components/AssignDriverModal';

const QuoteDetails = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const reqId = searchParams.get('reqId') || id; // Fallback to id if reqId is missing

    const getDocumentLabel = (docUrl: string, details: any, index: number) => {
        if (!details) return 'Attached Document';
        if (details.vehiclePhotos && docUrl.includes(details.vehiclePhotos)) return 'Vehicle photos';
        if (details.registrationDocumentName && docUrl.includes(details.registrationDocumentName)) return 'Registration document';
        if (details.referenceDocumentName && docUrl.includes(details.referenceDocumentName)) return 'Reference document';
        
        // Fallback for older legacy requests (like the one in testing) where the backend didn't link the names
        if (details.documents && details.documents.length > 0) {
            // Attempt to guess by order if they uploaded all three originally
            if (index === 0 && details.vehiclePhotos) return 'Vehicle photos';
            if (index === 1 && details.registrationDocumentName) return 'Registration document';
            if (index === 2 && details.referenceDocumentName) return 'Reference document';
        }

        return 'Attached Document';
    };

    const renderDeliveryType = (type: string | undefined) => {
        if (!type) return 'N/A';
        const t = type.toLowerCase();
        if (t === 'license') return 'Use of dealer plates (Z or V green plates)';
        if (t === 'tow') return 'Transport with vehicle carrier (trailer)';
        if (t === 'drive') return 'Drive with car';
        return type;
    };

    const [request, setRequest] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAssigning, setIsAssigning] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showManualAssignModal, setShowManualAssignModal] = useState(false);
    
    // Document Upload State
    const [isUploadingDoc, setIsUploadingDoc] = useState(false);
    const [isDeletingDoc, setIsDeletingDoc] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await apiFetch<any>(`/requests/${reqId}`, { auth: true });
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
    }, [id, reqId]);

    const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        const file = e.target.files[0];
        setIsUploadingDoc(true);

        try {
            // ── Step 1: Upload directly to Cloudinary from the browser ──────────
            const cloudName = 'da1uxchgo';
            const uploadPreset = 'ml_default';

            const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
            const isOfficeDoc =
                file.type === 'application/msword' ||
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.type === 'application/vnd.ms-excel' ||
                file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'text/plain' ||
                file.type === 'text/csv' ||
                file.type === 'application/octet-stream';

            // PDFs → resource_type 'image' (Cloudinary serves with correct Content-Type for browser viewing)
            // Office docs → resource_type 'raw' (download only)
            // Other (images) → resource_type 'auto'
            const resourceType = isPdf ? 'image' : isOfficeDoc ? 'raw' : 'auto';

            const cloudFormData = new FormData();
            cloudFormData.append('file', file);
            cloudFormData.append('upload_preset', uploadPreset);
            cloudFormData.append('folder', 'amraoui/uploads');

            const cloudRes = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
                { method: 'POST', body: cloudFormData }
            );

            if (!cloudRes.ok) {
                const err = await cloudRes.json();
                throw new Error(err?.error?.message || 'Cloudinary upload failed');
            }

            const cloudData = await cloudRes.json();
            const fileUrl: string = cloudData.secure_url;

            // ── Step 2: Save the Cloudinary URL to the backend database ─────────
            const res = await apiFetch<any>(`/requests/${reqId}/documents`, {
                method: 'PATCH',
                auth: true,
                body: JSON.stringify({ fileUrl, documentType }),
            });

            if (res.data?.success) {
                setRequest(res.data.data);
            } else {
                throw new Error('Failed to save document reference');
            }
        } catch (error: any) {
            console.error('Error uploading document:', error);
            alert(`Failed to upload document: ${error?.message || 'Unknown error'}`);
        } finally {
            setIsUploadingDoc(false);
            e.target.value = '';
        }
    };


    const handleDeleteDocument = async (fileUrl: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return;
        
        setIsDeletingDoc(fileUrl);
        try {
            const res = await apiFetch<any>(`/requests/${reqId}/documents`, {
                method: 'DELETE',
                auth: true,
                body: JSON.stringify({ fileUrl })
            });
            if (res.data?.success) {
                setRequest(res.data.data);
            }
        } catch (error) {
            console.error("Error deleting document:", error);
            alert("Failed to delete document");
        } finally {
            setIsDeletingDoc(null);
        }
    };

    const handleApprove = async (overrideQuoteId?: string) => {
        setShowConfirmModal(false); // Close the modal
        const quoteId = overrideQuoteId || (quotesToDisplay && quotesToDisplay.length > 0 ? quotesToDisplay[0]._id : null);
        if (!quoteId) return;
        
        try {
            setActionLoading(quoteId + '-accept');
            setIsAssigning(true);
            const res = await apiFetch<any>(`/requests/${reqId}/assign-driver`, { 
                method: 'PATCH', 
                auth: true, 
                body: JSON.stringify({ quoteId }) 
            });
            if (res.data?.success) {
                // Fetch fresh request data to ensure all populated fields and statuses are up to date
                const fetchRes = await apiFetch<any>(`/requests/${reqId}`, { auth: true });
                if (fetchRes.data?.success) {
                    setRequest(fetchRes.data.data);
                } else {
                    setRequest(res.data.data);
                }
            }
        } catch (error) {
            console.error("Error approving quote:", error);
            alert("Failed to assign driver. Please try again.");
        } finally {
            setIsAssigning(false);
            setActionLoading(null);
        }
    };

    const handleQuoteAction = async (quoteId: string, actionType: 'reject-driver-quote' | 'request-new-offer') => {
        try {
            setActionLoading(quoteId + '-' + actionType);
            const res = await apiFetch<any>(`/requests/${reqId}/${actionType}`, { 
                method: 'PATCH', 
                auth: true, 
                body: JSON.stringify({ quoteId }) 
            });
            if (res.data?.success) {
                // Fetch fresh request data
                const fetchRes = await apiFetch<any>(`/requests/${reqId}`, { auth: true });
                if (fetchRes.data?.success) {
                    setRequest(fetchRes.data.data);
                } else {
                    setRequest(res.data.data);
                }
            } else {
                throw new Error(res.data?.message || 'Action failed');
            }
        } catch (error: any) {
            console.error(`Error performing ${actionType}:`, error);
            alert(`Failed: ${error?.message || 'Unknown error'}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleOpenManualAssign = () => {
        setShowManualAssignModal(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!request) {
        return <div className="p-6 text-center text-gray-500">Request not found.</div>;
    }

    const date = new Date(request.createdAt);
    const idString = request._id ? (typeof request._id === 'object' ? (request._id.$oid || String(request._id)) : String(request._id)) : 'UNKNOWN';
    const displayId = (request.missionId && request.missionId.trim() !== '') ? request.missionId : `MS-${idString.slice(-5).toUpperCase()}`;
    
    // Filter to only show the specific quote that was clicked
    const allQuotes = request.driverQuotes || [];
    const quotes = allQuotes.filter((q: any) => String(q._id) === String(id));
    
    // If quote not found by ID (maybe accessed directly), just show all or fallback
    const quotesToDisplay = quotes.length > 0 ? quotes : allQuotes;

    let lowestQuote = 0, highestQuote = 0, avgQuote = 0;
    if (allQuotes.length > 0) {
        lowestQuote = Math.min(...allQuotes.map((q: any) => q.amount));
        highestQuote = Math.max(...allQuotes.map((q: any) => q.amount));
        avgQuote = Math.round(allQuotes.reduce((acc: number, q: any) => acc + q.amount, 0) / allQuotes.length);
    }

    const proposedPrice = request.adminQuote?.amount || 0;
    let statusDisplay = request.status === 'ASSIGNED' ? 'Assigned' :
        request.status === 'ADMIN_REVIEWING_DRIVERS' ? 'Pending Assignment' :
            request.driverQuotes?.length > 0 ? 'Quotes Received' : 'Waiting for Quotes';

    return (
        <div className="p-6 max-w-7xl mx-auto overflow-auto">
            {/* Back Button */}
            <Link href="/quote-desk" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium text-sm w-fit">
                <ArrowLeft className="w-4 h-4" /> Back to Quote Desk
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 mb-6">Request Details</h1>

            {/* Driver Quotations List */}
            {quotesToDisplay.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Submitted Driver Quote
                    </h2>
                    <div className="flex flex-col gap-6">
                        {quotesToDisplay.map((quote: any, index: number) => {
                            const driver = quote.driverId || {};
                            let estimatedTime = quote.estimatedTime || 'N/A';
                            if (!quote.estimatedTime && quote.pickupDate && quote.dropoffDate) {
                                const start = parseDateString(quote.pickupDate, quote.pickupTime);
                                const end = parseDateString(quote.dropoffDate, quote.dropoffTime);
                                if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                                    const diffMs = end.getTime() - start.getTime();
                                    if (diffMs > 0) {
                                        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                                        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                        if (days > 0) {
                                            estimatedTime = hours > 0 ? `${days}d ${hours}h` : `${days}d`;
                                        } else {
                                            estimatedTime = `${hours}h`;
                                        }
                                    }
                                }
                            }
                            return (
                                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Driver Profile Section (Left) */}
                                        <div className="flex items-start gap-4 lg:w-1/3">
                                            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                                {driver.profile_image ? (
                                                    <img src={driver.profile_image} alt={driver.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <User className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{driver.name || 'Unknown Driver'}</h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                                                    <Car className="w-4 h-4" />
                                                    {driver.vehicle_plate || 'No Plate'} • {driver.vehicle_type || 'Standard'}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold border border-amber-100">
                                                        ★ {driver.rating || 'New'}
                                                    </span>
                                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
                                                        {driver.totalDeliveries || 0} Deliveries
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Driver Contact & Quote Details (Middle) */}
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Info</h4>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="w-4 h-4 text-gray-400"/>
                                                    <span className="font-medium text-gray-900">{driver.phone_number || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="w-4 h-4 text-gray-400"/>
                                                    <span className="font-medium text-gray-900">{driver.email || 'N/A'}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                                                    <span>Quote Details</span>
                                                    <span className="text-xs font-bold text-gray-500">Est. Time: <span className="text-gray-900">{estimatedTime}</span></span>
                                                </h4>
                                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-sm">
                                                    <div className="flex justify-between py-1 border-b border-gray-200/50">
                                                        <span className="text-gray-500 font-medium">Service Price</span>
                                                        <span className="font-bold text-gray-900">€{quote.servicePrice || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between py-1 border-b border-gray-200/50">
                                                        <span className="text-gray-500 font-medium">Fuel Cost</span>
                                                        <span className="font-bold text-gray-900">€{quote.fuelCost || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between py-1 border-b border-gray-200/50">
                                                        <span className="text-gray-500 font-medium">Toll Charges</span>
                                                        <span className="font-bold text-gray-900">€{quote.tollCharges || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between py-1 border-b border-gray-200/50">
                                                        <span className="text-gray-500 font-medium">Travel Cost</span>
                                                        <span className="font-bold text-gray-900">€{quote.travelCost || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between py-1 border-b border-gray-200/50">
                                                        <span className="text-gray-500 font-medium">Taxi Cost</span>
                                                        <span className="font-bold text-gray-900">€{quote.taxiCost || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between pt-2 mt-1">
                                                        <span className="text-gray-700 font-bold uppercase text-xs">Total Amount</span>
                                                        <span className="font-black text-blue-600 text-lg leading-none">€{quote.amount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status (Right) */}
                                        <div className="lg:w-1/6 flex flex-col items-start lg:items-end justify-start border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                quote.status === 'ACCEPTED' ? 'bg-green-50 text-green-600 border-green-200' :
                                                quote.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-200' :
                                                'bg-gray-50 text-gray-600 border-gray-200'
                                            }`}>
                                                {quote.status}
                                            </span>
                                            <span className="text-xs text-gray-400 mt-2">
                                                {formatDate(quote.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Driver Message & Actions */}
                                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Driver Message</p>
                                            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 italic min-h-[4rem]">
                                                "{quote.message || 'No additional message provided.'}"
                                            </p>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        {/* Action Buttons */}
                                        {quote.status !== 'ACCEPTED' && (
                                            <div className="flex flex-col gap-2 justify-end w-full md:w-auto md:min-w-[250px]">
                                                <div className="flex gap-2 w-full">
                                                    <button 
                                                        onClick={() => handleApprove(String(quote._id))}
                                                        disabled={actionLoading !== null}
                                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 text-center"
                                                    >
                                                        {actionLoading === quote._id + '-accept' ? 'Loading...' : 'Accept'}
                                                    </button>
                                                    {quote.status !== 'REJECTED' && (
                                                        <button 
                                                            onClick={() => handleQuoteAction(String(quote._id), 'reject-driver-quote')}
                                                            disabled={actionLoading !== null}
                                                            className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-bold rounded-lg transition-colors disabled:opacity-50 text-center"
                                                        >
                                                            {actionLoading === quote._id + '-reject-driver-quote' ? '...' : 'Reject'}
                                                        </button>
                                                    )}
                                                </div>
                                                <button 
                                                    onClick={() => handleQuoteAction(String(quote._id), 'request-new-offer')}
                                                    disabled={actionLoading !== null}
                                                    className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {actionLoading === quote._id + '-request-new-offer' ? 'Loading...' : 'Submit New Offer'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Request Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-4">Request Summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Request ID</span>
                                <span className="font-bold text-blue-600">{displayId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Status</span>
                                <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded-full text-xs font-medium">{statusDisplay}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Customer</span>
                                <span className="font-bold text-gray-900">
                                    {(request.customerId?.name ? `${request.customerId.name} ${request.customerId.family_name || ''}`.trim() : null) || 
                                     (request.details?.firstName ? `${request.details.firstName} ${request.details.lastName || ''}`.trim() : null) || 
                                     request.details?.customerName || 
                                     'Anonymous'}
                                </span>
                            </div>
                            {(request.customerId?.company || request.customerId?.company_name || request.details?.companyName || (request.details?.company && !request.details.company.includes(','))) && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Company</span>
                                    <span className="font-bold text-gray-900">{request.customerId?.company || request.customerId?.company_name || request.details?.companyName || request.details?.company}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-400">Submitted</span>
                                <span className="font-bold text-gray-900">{formatDateTime(date)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Contact Email</span>
                                <span className="font-bold text-gray-900">{request.customerId?.email || request.details?.customerEmail || request.details?.email || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Contact Phone</span>
                                <span className="font-bold text-gray-900">{request.customerId?.phone_number || request.details?.customerPhone || request.details?.phone || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Route & Schedule Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <h2 className="text-sm font-bold text-gray-900">Route & Schedule Information</h2>
                        </div>
                        <div className="space-y-4 text-sm">
                            {request.type === 'TRANSPORT' ? (
                                <>
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                            <span className="text-blue-600 font-bold">A</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-400 font-medium mb-1">Pickup</p>
                                            <p className="font-bold text-gray-900">{request.details?.pickupCity}</p>
                                            <p className="text-gray-500 text-xs">{request.details?.pickupAddress} {request.details?.pickupZip ? `(${request.details.pickupZip})` : ''}</p>
                                            <p className="text-gray-500 text-xs mt-1">{request.details?.pickupDate} at {request.details?.pickupTime}</p>
                                            {(request.details?.pickupContactName || request.details?.pickupContactPhone) && (
                                                <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-100 text-xs">
                                                    <p className="font-medium text-gray-700">Contact: {request.details?.pickupContactName || 'N/A'}</p>
                                                    <p className="text-gray-500">{request.details?.pickupContactPhone || 'N/A'}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="border-l-2 border-dashed border-gray-200 ml-5 h-6"></div>
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                            <span className="text-green-600 font-bold">B</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-400 font-medium mb-1">Delivery</p>
                                            <p className="font-bold text-gray-900">{request.details?.dropoffCity}</p>
                                            <p className="text-gray-500 text-xs">{request.details?.dropoffAddress} {request.details?.dropoffZip ? `(${request.details.dropoffZip})` : ''}</p>
                                            <p className="text-gray-500 text-xs mt-1">{request.details?.dropoffDate} at {request.details?.dropoffTime}</p>
                                            {(request.details?.dropoffContactName || request.details?.dropoffContactPhone) && (
                                                <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-100 text-xs">
                                                    <p className="font-medium text-gray-700">Contact: {request.details?.dropoffContactName || 'N/A'}</p>
                                                    <p className="text-gray-500">{request.details?.dropoffContactPhone || 'N/A'}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : request.type === 'HIRE_DRIVER' ? (
                                <>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-400">City/Location</span>
                                        <span className="font-bold text-gray-900 text-right">{request.details?.driverCity} <br /> <span className="text-xs font-normal text-gray-500">{request.details?.driverLocation}</span></span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-400">Start Time</span>
                                        <span className="font-bold text-gray-900">{request.details?.driverStartDate} at {request.details?.driverStartTime}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-400">End Time</span>
                                        <span className="font-bold text-gray-900">{request.details?.driverEndDate} at {request.details?.driverEndTime}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-400">Drivers Required</span>
                                        <span className="font-bold text-gray-900">{request.details?.driverCount || 1} Drivers</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Tasks</span>
                                        <span className="font-bold text-gray-900 max-w-[200px] text-right">{(request.details?.driverTasks || []).join(', ')}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-400">Location</span>
                                        <span className="font-bold text-gray-900">{request.details?.inspectionLocation}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-400">Date</span>
                                        <span className="font-bold text-gray-900">{request.details?.inspectionDate} at {request.details?.inspectionTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Type</span>
                                        <span className="font-bold text-gray-900">{request.details?.inspectionType}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Vehicle Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Car className="w-4 h-4 text-gray-400" />
                            <h2 className="text-sm font-bold text-gray-900">Vehicle / Request Details</h2>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Request Type</span>
                                <span className="font-bold text-gray-900">{request.type}</span>
                            </div>
                            {request.type === 'TRANSPORT' && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Make & Model</span>
                                        <span className="font-bold text-gray-900">{request.details?.make} {request.details?.model}</span>
                                    </div>
                                    {request.details?.year && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Year</span>
                                            <span className="font-bold text-gray-900">{request.details?.year}</span>
                                        </div>
                                    )}
                                    {request.details?.vin && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">VIN</span>
                                            <span className="font-bold text-gray-900">{request.details?.vin}</span>
                                        </div>
                                    )}
                                    {request.details?.plate && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Plate</span>
                                            <span className="font-bold text-gray-900">{request.details?.plate}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                                        <span className="text-gray-400">Vehicle Type</span>
                                        <span className="font-bold text-gray-900 capitalize">{request.details?.vehicleType || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Weight</span>
                                        <span className="font-bold text-gray-900">{request.details?.vehicleWeight ? `${request.details?.vehicleWeight} kg` : 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                                        <span className="text-gray-400">Delivery Type</span>
                                        <span className="font-bold text-blue-600 capitalize">
                                            {renderDeliveryType(request.details?.deliveryType)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Engine Type</span>
                                        <span className="font-bold text-gray-900 capitalize">{request.details?.engineType || 'N/A'}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Customer Instructions */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <h2 className="text-sm font-bold text-gray-900">Instructions & Notes</h2>
                        </div>
                        <div className="space-y-4">
                            {request.details?.specialInstructions && (
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Special Instructions</p>
                                    <p className="text-sm text-gray-700 bg-amber-50 border border-amber-100 p-3 rounded-lg">
                                        {request.details.specialInstructions}
                                    </p>
                                </div>
                            )}
                            {request.details?.dropoffInstructions && (
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Dropoff Instructions</p>
                                    <p className="text-sm text-gray-700 bg-blue-50 border border-blue-100 p-3 rounded-lg">
                                        {request.details.dropoffInstructions}
                                    </p>
                                </div>
                            )}
                            {(!request.details?.specialInstructions && !request.details?.dropoffInstructions && !request.details?.notes) && (
                                <p className="text-sm text-gray-500">No additional instructions provided.</p>
                            )}
                            {request.details?.notes && (
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">General Notes</p>
                                    <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 p-3 rounded-lg">
                                        {request.details.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Documents & Photos */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Paperclip className="w-5 h-5 text-gray-400" />
                            <h2 className="text-lg font-bold text-gray-900">Documents & Photos</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {/* Vehicle Photos */}
                            <label className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center flex flex-col items-center transition-all duration-200 w-full overflow-hidden ${isUploadingDoc ? 'opacity-50 cursor-not-allowed' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'}`}>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm mb-3 shrink-0">
                                    <UploadCloud className="h-5 w-5 text-blue-500" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">Vehicle photos</h3>
                                <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1 w-full truncate px-2">
                                    {request.details?.vehiclePhotos || "Add clear photos of the vehicle if available."}
                                </p>
                                <div className="rounded-full px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full max-w-[120px]">
                                    {isUploadingDoc ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : "Add Photo"}
                                </div>
                                <input type="file" className="hidden" onChange={(e) => handleUploadDocument(e, 'vehiclePhotos')} disabled={isUploadingDoc} />
                            </label>

                            {/* Registration Document */}
                            <label className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center flex flex-col items-center transition-all duration-200 w-full overflow-hidden ${isUploadingDoc ? 'opacity-50 cursor-not-allowed' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'}`}>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm mb-3 shrink-0">
                                    <UploadCloud className="h-5 w-5 text-blue-500" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">Registration document</h3>
                                <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1 w-full truncate px-2">
                                    {request.details?.registrationDocumentName || "Upload vehicle registration or ownership document."}
                                </p>
                                <div className="rounded-full px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full max-w-[120px]">
                                    {isUploadingDoc ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : "Add Document"}
                                </div>
                                <input type="file" className="hidden" onChange={(e) => handleUploadDocument(e, 'registrationDocumentName')} disabled={isUploadingDoc} />
                            </label>

                            {/* Reference Document */}
                            <label className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center flex flex-col items-center transition-all duration-200 w-full overflow-hidden ${isUploadingDoc ? 'opacity-50 cursor-not-allowed' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'}`}>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm mb-3 shrink-0">
                                    <UploadCloud className="h-5 w-5 text-blue-500" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">Reference document</h3>
                                <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1 w-full truncate px-2">
                                    {request.details?.referenceDocumentName || "Add any extra file for the driver or admin."}
                                </p>
                                <div className="rounded-full px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full max-w-[120px]">
                                    {isUploadingDoc ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : "Add File"}
                                </div>
                                <input type="file" className="hidden" onChange={(e) => handleUploadDocument(e, 'referenceDocumentName')} disabled={isUploadingDoc} />
                            </label>
                        </div>
                        
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Attached Files</h3>
                        <div className="space-y-3">
                            {(!request.details?.documents || request.details.documents.length === 0) ? (
                                <p className="text-sm text-gray-500 text-center py-4">No documents attached.</p>
                            ) : (
                                request.details.documents.map((doc: any, idx: number) => {
                                    const docUrl = typeof doc === 'string' ? doc : doc?.url || '';
                                    const docOrig = typeof doc === 'object' ? doc?.originalName : '';
                                    const rawUrl = docUrl.startsWith('http') ? docUrl : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://backend.vehiqqo.com'}${docUrl.startsWith('/') ? '' : '/'}${docUrl}`;
                                    const filename = docOrig || decodeURIComponent(docUrl.split('/').pop() || `Document ${idx + 1}`);
                                    const docLabel = getDocumentLabel(docUrl, request.details, idx);
                                    const isDeleting = isDeletingDoc === docUrl || isDeletingDoc === doc;
                                    const isPdf = filename.toLowerCase().endsWith('.pdf');
                                    const openUrl = isPdf
                                        ? `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}&embedded=false`
                                        : rawUrl;
                                    return (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <a href={openUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 overflow-hidden group">
                                                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center shrink-0">
                                                    <FileText className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-0.5">{docLabel}</span>
                                                    <span className="text-sm font-medium text-gray-700 truncate group-hover:text-blue-600 transition-colors">
                                                        {filename}
                                                    </span>
                                                </div>
                                            </a>
                                            <button 
                                                onClick={() => handleDeleteDocument(doc)}
                                                disabled={isDeleting || isUploadingDoc}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                            >
                                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Quote Summary */}
                    <div className="bg-blue-50/30 rounded-xl border border-blue-100 p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-4">Quote Summary</h2>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                            <div>
                                <p className="text-gray-400 text-xs font-medium">Quotes Received</p>
                                <p className="text-2xl font-bold text-blue-600">{allQuotes.length}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-medium">Average Quote</p>
                                <p className="text-2xl font-bold text-amber-500">€{avgQuote}</p>
                            </div>
                            <div className="border-t border-blue-100 pt-3">
                                <p className="text-gray-400 text-xs font-medium">Base Admin Price</p>
                                <p className="text-2xl font-bold text-blue-600">€{proposedPrice}</p>
                            </div>
                            <div className="border-t border-blue-100 pt-3">
                                <p className="text-gray-400 text-xs font-medium">Extra Expenses</p>
                                <p className="text-2xl font-bold text-red-500">€{request.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0}</p>
                            </div>
                            <div className="col-span-2 pt-2">
                                <p className="text-gray-400 text-xs font-medium">Total Billed to Customer</p>
                                <p className="text-3xl font-black text-gray-900">€{proposedPrice + (request.expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Admin Note */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-2">Admin Note</h2>
                        <p className="text-xs text-gray-400 mb-3">Internal only — not visible to customer or driver.</p>
                        <textarea
                            placeholder="Add internal note..."
                            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        ></textarea>
                    </div>
                </div>
            </div>


            {/* Action Buttons */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href={`/quote-desk/${id}/compare?reqId=${reqId}`} className="py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    Compare Drivers
                </Link>

                <button
                    onClick={handleOpenManualAssign}
                    disabled={isAssigning || request?.status === 'ASSIGNED'}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 ${
                        request?.status === 'ASSIGNED'
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-white border border-gray-200 text-blue-600 hover:bg-gray-50'
                    }`}
                >
                    Manual Assign
                </button>

                <button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={isAssigning || request?.status === 'ASSIGNED' || quotesToDisplay[0]?.status === 'ACCEPTED'}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 ${
                        quotesToDisplay[0]?.status === 'ACCEPTED'
                            ? 'bg-green-600 text-white cursor-not-allowed'
                            : request?.status === 'ASSIGNED' 
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : isAssigning
                                    ? 'bg-blue-400 text-white cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {isAssigning && <Loader2 className="w-4 h-4 animate-spin" />}
                    {quotesToDisplay[0]?.status === 'ACCEPTED' ? 'Quote Accepted' : request?.status === 'ASSIGNED' ? 'Mission Full' : 'Accept Quote'}
                </button>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Assignment</h3>
                            <p className="text-gray-600 text-sm mb-6">
                                Are you sure you want to assign this driver to the mission? This will notify the driver and you cannot undo this action.
                            </p>
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleApprove()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Confirm Assignment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Manual Assign Modal Component */}
            <AssignDriverModal
                isOpen={showManualAssignModal}
                onClose={() => setShowManualAssignModal(false)}
                missionId={request?._id || reqId}
            />
        </div>
    );
};

export default QuoteDetails;