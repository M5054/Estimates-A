import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, FileText, Edit2, Trash2, Grid } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import FloorPlanModal from './FloorPlanModal';
import { formatDate, formatTime } from '../../utils/date';
import type { Appointment } from '../../types/appointments';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment, e?: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  deletingId: string | null;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onDelete,
  deletingId
}) => {
  const [showFloorPlan, setShowFloorPlan] = useState(false);

  const getStatusColor = (status: string) => {
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

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking on a button or the floor plan section, don't trigger card click
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('[data-floor-plan-section]')
    ) {
      return;
    }
    onEdit(appointment);
  };

  const handleFloorPlanClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFloorPlan(true);
  };

  return (
    <>
      <div
        className="relative group cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="block hover:shadow-lg transition-shadow">
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                  {appointment.title}
                </h3>
                <span className={`
                  inline-flex rounded-full px-2 py-1 text-xs font-semibold
                  ${getStatusColor(appointment.status)}
                `}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  {formatDate(appointment.date)}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                  {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                </div>

                <div className="flex items-start text-sm text-gray-500">
                  <User className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{appointment.client?.name}</p>
                    <p className="text-xs">{appointment.client?.company}</p>
                  </div>
                </div>

                {appointment.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="line-clamp-1">{appointment.location}</span>
                  </div>
                )}

                {appointment.measurements && appointment.measurements.length > 0 && (
                  <div 
                    className="flex items-center justify-between text-sm text-gray-500"
                    data-floor-plan-section
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{appointment.measurements.length} measurements</span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Grid}
                      onClick={handleFloorPlanClick}
                      className="!py-1"
                    >
                      View Plan
                    </Button>
                  </div>
                )}

                {appointment.notes && (
                  <div className="text-sm text-gray-500 border-t border-gray-100 pt-2 mt-2">
                    <p className="line-clamp-2">{appointment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="sm"
            icon={Edit2}
            onClick={(e) => onEdit(appointment, e)}
            className="!p-2"
          >
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Trash2}
            onClick={(e) => onDelete(appointment.id, e)}
            loading={deletingId === appointment.id}
            className="!p-2 text-red-600 hover:text-red-700"
          >
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>

      {/* Floor Plan Modal */}
      {showFloorPlan && (
        <FloorPlanModal
          appointment={appointment}
          onClose={() => setShowFloorPlan(false)}
        />
      )}
    </>
  );
};

export default AppointmentCard;