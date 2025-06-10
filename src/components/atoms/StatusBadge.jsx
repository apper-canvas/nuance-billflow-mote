import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'paid':
      case 'completed':
        return 'bg-accent/10 text-accent';
      case 'paused':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'overdue':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-surface-100 text-surface-600';
      default:
        return 'bg-surface-100 text-surface-600';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;