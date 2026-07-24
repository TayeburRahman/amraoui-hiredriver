import React, { useState, useEffect } from 'react';
import { Search, Loader2, User, X } from 'lucide-react';
import { apiFetch, getProfileImageUrl } from '@/lib/api';

interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: string;
}

export const AssignDriverModal: React.FC<AssignDriverModalProps> = ({ isOpen, onClose, missionId }) => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [driverSearch, setDriverSearch] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [isFetchingDrivers, setIsFetchingDrivers] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDrivers();
    }
  }, [isOpen]);

  const fetchDrivers = async () => {
    try {
      setIsFetchingDrivers(true);
      const res = await apiFetch('/drivers', { auth: true });
      if (res.ok) {
        const responseData = res.data as any;
        setDrivers(responseData?.data?.drivers || responseData?.drivers || []);
      }
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    } finally {
      setIsFetchingDrivers(false);
    }
  };

  const handleManualAssign = async () => {
    if (!selectedDriverId) return;
    try {
      setIsAssigning(true);
      const payload: any = { driverId: selectedDriverId };
      if (amount && !isNaN(Number(amount))) {
        payload.amount = Number(amount);
      }
      
      const res = await apiFetch(`/requests/${missionId}/assign-driver`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
        auth: true,
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const responseData = res.data as any;
        alert(responseData?.message || 'Failed to assign driver');
      }
    } catch (error) {
      console.error('Failed to assign driver', error);
      alert('Failed to assign driver');
    } finally {
      setIsAssigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Assign Driver</h3>
            <p className="text-gray-500 text-sm mt-1">Select a driver for this mission.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={driverSearch}
              onChange={(e) => setDriverSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {isFetchingDrivers ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
          ) : (
            <div className="space-y-3">
              {drivers.filter(d =>
                (d.name || d.firstName + ' ' + d.lastName)?.toLowerCase().includes(driverSearch.toLowerCase()) ||
                (d.email || d.authId?.email)?.toLowerCase().includes(driverSearch.toLowerCase()) ||
                d._id.toLowerCase().includes(driverSearch.toLowerCase()) ||
                (d.phone_number || d.phone)?.toLowerCase().includes(driverSearch.toLowerCase())
              ).map(driver => (
                <label key={driver._id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${selectedDriverId === driver._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                  <input type="radio" name="driver" value={driver._id} checked={selectedDriverId === driver._id} onChange={() => setSelectedDriverId(driver._id)} className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                    {driver.profile_image ? (
                      <img src={getProfileImageUrl(driver.profile_image) || ''} alt={driver.name || 'Driver'} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{driver.name || driver.firstName + ' ' + driver.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{driver.phone_number || driver.phone || driver.email || driver.authId?.email}</p>
                  </div>
                </label>
              ))}
              {drivers.length > 0 && drivers.filter(d =>
                (d.name || d.firstName + ' ' + d.lastName)?.toLowerCase().includes(driverSearch.toLowerCase()) ||
                (d.email || d.authId?.email)?.toLowerCase().includes(driverSearch.toLowerCase()) ||
                d._id.toLowerCase().includes(driverSearch.toLowerCase()) ||
                (d.phone_number || d.phone)?.toLowerCase().includes(driverSearch.toLowerCase())
              ).length === 0 && <p className="text-center text-gray-500 py-4">No drivers match your search.</p>}
              {drivers.length === 0 && <p className="text-center text-gray-500 py-4">No drivers found.</p>}
            </div>
          )}
        </div>
        
        {/* Amount Input Section */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Manual Quote Price (€) (Optional)</label>
          <input
            type="number"
            placeholder="Enter price..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">If provided, this will create an accepted quote for the driver.</p>
        </div>

        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleManualAssign} disabled={!selectedDriverId || isAssigning} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors">
            {isAssigning && <Loader2 className="w-4 h-4 animate-spin" />}
            Assign Driver
          </button>
        </div>
      </div>
    </div>
  );
};
