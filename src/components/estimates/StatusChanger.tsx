import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, Save } from 'lucide-react';
import Button from '../shared/Button';

interface StatusChangerProps {
  currentStatus: 'draft' | 'pending' | 'approved' | 'rejected';
  onStatusChange: (newStatus: 'draft' | 'pending' | 'approved' | 'rejected') => void;
  loading?: boolean;
}

const StatusChanger: React.FC<StatusChangerProps> = ({ 
  currentStatus, 
  onStatusChange,
  loading 
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const statuses = [
    { 
      value: 'draft', 
      label: 'Draft',
      icon: AlertCircle,
      color: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    },
    { 
      value: 'pending', 
      label: 'Pending',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
    },
    { 
      value: 'approved', 
      label: 'Approved',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800 hover:bg-green-200'
    },
    { 
      value: 'rejected', 
      label: 'Rejected',
      icon: XCircle,
      color: 'bg-red-100 text-red-800 hover:bg-red-200'
    }
  ];

  const handleSave = () => {
    if (selectedStatus !== currentStatus) {
      onStatusChange(selectedStatus as any);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Change Status</h3>
        <p className="mt-1 text-sm text-gray-500">
          Select a new status for this estimate
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statuses.map(({ value, label, icon: Icon, color }) => (
          <button
            key={value}
            onClick={() => setSelectedStatus(value as any)}
            disabled={loading}
            className={`
              flex items-center px-4 py-3 rounded-lg transition-all
              ${selectedStatus === value ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}
              ${color}
            `}
          >
            <Icon className="h-5 w-5 mr-2" />
            {label}
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Button
          onClick={handleSave}
          disabled={loading || selectedStatus === currentStatus}
          loading={loading}
          icon={Save}
          className="w-full sm:w-auto"
        >
          Save Status
        </Button>
      </div>
    </div>
  );
};

export default StatusChanger;