import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Button from '../shared/Button';
import { AppointmentStatus } from '../../types/appointments';

interface AppointmentHeaderProps {
  title: string;
  status?: AppointmentStatus;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}

const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  title,
  status = 'pending',
  onEdit,
  onDelete,
  deleting
}) => {
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: AppointmentStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {title}
        </h1>
        <p className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(status)}`}>
          {formatStatus(status)}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="secondary"
          icon={Edit2}
          onClick={onEdit}
        >
          Edit
        </Button>
        <Button
          variant="outline"
          icon={Trash2}
          onClick={onDelete}
          loading={deleting}
          className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AppointmentHeader;