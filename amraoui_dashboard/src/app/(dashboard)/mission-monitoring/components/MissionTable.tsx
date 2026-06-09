import React from 'react';

export interface Mission {
  id: string;
  requestId: string;
  customer: string;
  driver: string;
  vehicle: string;
  route: string;
  status: string;
  proof: string;
  expense: string;
  invoice: string;
  issue: string;
}

interface MissionTableProps {
  missions: Mission[];
  onViewMission: (mission: Mission) => void;
}


export const MissionTable: React.FC<MissionTableProps> = ({ missions, onViewMission }) => {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit': return 'bg-blue-800 text-white';
      case 'Pickup Started': return 'bg-cyan-400 text-white';
      case 'Completed': return 'bg-green-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExpenseColor = (expense: string) => {
    switch (expense) {
      case 'None': return 'bg-slate-400 text-white';
      case 'Pending Review': return 'bg-orange-400 text-white';
      case 'Approved': return 'bg-green-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvoiceColor = (invoice: string) => {
    switch (invoice) {
      case 'Not Generated': return 'bg-slate-400 text-white';
      case 'Draft': return 'bg-orange-500 text-white';
      case 'Sent': return 'bg-purple-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl border border-gray-200">
      <table className="w-full min-w-[1200px] text-left text-sm text-gray-600">
        <thead className="bg-gray-50/50 text-xs text-gray-500 font-semibold uppercase border-b border-gray-200">
          <tr>
            <th className="px-4 py-4">Mission ID</th>
            <th className="px-4 py-4">Request ID</th>
            <th className="px-4 py-4">Customer</th>
            <th className="px-4 py-4">Driver</th>
            <th className="px-4 py-4">Vehicle</th>
            <th className="px-4 py-4">Route</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-4 py-4">Proof</th>
            <th className="px-4 py-4">Expense</th>
            <th className="px-4 py-4">Invoice</th>
            <th className="px-4 py-4">Issue</th>
            <th className="px-4 py-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {missions.map((mission) => (
            <tr key={mission.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 whitespace-nowrap font-semibold text-blue-600">{mission.id}</td>
              <td className="px-4 py-4 whitespace-nowrap text-gray-500">{mission.requestId}</td>
              <td className="px-4 py-4 whitespace-nowrap font-bold text-gray-900">{mission.customer}</td>
              <td className="px-4 py-4 whitespace-nowrap font-bold text-gray-900">{mission.driver}</td>
              <td className="px-4 py-4 whitespace-nowrap">{mission.vehicle}</td>
              <td className="px-4 py-4 whitespace-nowrap">{mission.route}</td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(mission.status)}`}>
                  {mission.status}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-xs">{mission.proof}</td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getExpenseColor(mission.expense)}`}>
                  {mission.expense}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getInvoiceColor(mission.invoice)}`}>
                  {mission.invoice}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">{mission.issue}</td>
              <td className="px-4 py-4 whitespace-nowrap text-center">
                <button 
                  onClick={() => onViewMission(mission)}
                  className="text-gray-900 font-bold hover:text-blue-600 transition-colors"
                >
                  View
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
