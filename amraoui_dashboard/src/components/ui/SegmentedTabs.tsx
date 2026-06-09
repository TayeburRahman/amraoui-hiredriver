import React from 'react';

interface SegmentedTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="inline-flex p-1.5 bg-slate-50 rounded-xl mb-4 overflow-x-auto w-full md:w-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-5 py-2.5 text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-200 ${
            activeTab === tab
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
