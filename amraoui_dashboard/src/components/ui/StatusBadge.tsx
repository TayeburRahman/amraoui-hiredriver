import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral' | 'info';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
  // Auto-determine variant based on status text if not explicitly provided
  let currentVariant = variant;
  
  if (!currentVariant) {
    const s = status.toLowerCase();
    if (s.includes('verified') || s.includes('available') || s.includes('good standing') || s.includes('paid')) {
      currentVariant = 'success';
    } else if (s.includes('pending') || s.includes('busy')) {
      currentVariant = 'warning';
    } else if (s.includes('offline') || s.includes('suspended')) {
      currentVariant = 'neutral';
    } else if (s.includes('failed') || s.includes('issue')) {
      currentVariant = 'error';
    } else {
      currentVariant = 'info';
    }
  }

  const styles = {
    success: 'bg-green-100 text-green-600',
    warning: 'bg-amber-100 text-amber-600',
    error: 'bg-red-100 text-red-600',
    neutral: 'bg-gray-100 text-gray-500',
    info: 'bg-blue-100 text-blue-600',
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${styles[currentVariant]}`}>
      {status}
    </span>
  );
};
