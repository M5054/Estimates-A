import React from 'react';

interface EstimateStatusProps {
  status: 'draft' | 'pending' | 'approved' | 'rejected';
}

const EstimateStatus: React.FC<EstimateStatusProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyles()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default EstimateStatus;