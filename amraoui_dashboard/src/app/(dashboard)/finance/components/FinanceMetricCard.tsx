import React from 'react';

interface FinanceMetricCardProps {
  title: string;
  amount: string;
  subtitle?: string;
  amountColor?: string;
}

export const FinanceMetricCard: React.FC<FinanceMetricCardProps> = ({
  title,
  amount,
  subtitle,
  amountColor = "text-gray-900"
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-center hover:shadow-md transition-shadow h-[120px]">
      <h3 className="font-semibold text-sm text-gray-700 mb-2">{title}</h3>
      <div className={`text-3x1 lg:text-3x1 font-bold mb-1 ${amountColor}`}>{amount}</div>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
};
