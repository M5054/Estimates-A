import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAppointment, deleteAppointment } from '../../lib/api/appointments';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import Card from '../../components/shared/Card';
import { formatDate, formatTime } from '../../utils/date';
import AppointmentHeader from '../../components/appointments/AppointmentHeader';
import ClientInfo from '../../components/appointments/ClientInfo';
import MeasurementDisplay from '../../components/appointments/MeasurementDisplay';
import type { Appointment } from '../../types/appointments';

const AppointmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAppointment();
  }, [id, user]);

  const fetchAppointment = async () => {
    if (!user || !id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getAppointment(id);
      
      if (!data) {
        throw new Error('Appointment not found');
      }
      
      // Parse measurements if they're stored as a string
      const parsedData = {
        ...data,
        measurements: typeof data.measurements === 'string' 
          ? JSON.parse(data.measurements) 
          : (data.measurements || [])
      };
      
      setAppointment(parsedData);
    } catch (err) {
      console.error('Error fetching appointment:', err);
      setError('Failed to load appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/appointments/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      setDeleting(true);
      await deleteAppointment(id);
      navigate('/appointments');
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError('Failed to delete appointment');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!appointment) return <ErrorMessage message="Appointment not found" />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <div className="p-6 space-y-8">
          <AppointmentHeader
            title={appointment.title}
            status={appointment.status}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deleting={deleting}
          />

          {/* Date and Time */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Date & Time</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-500">
                <Calendar className="h-5 w-5 mr-3" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Clock className="h-5 w-5 mr-3" />
                <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
              </div>
            </div>
          </div>

          <ClientInfo client={appointment.client} />

          {/* Location */}
          {appointment.location && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>
              <div className="flex items-start text-gray-500">
                <MapPin className="h-5 w-5 mr-3 mt-0.5" />
                <span>{appointment.location}</span>
              </div>
            </div>
          )}

          <MeasurementDisplay measurements={appointment.measurements} />

          {/* Notes */}
          {appointment.notes && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 mr-3 mt-0.5 text-gray-400" />
                  <p className="text-gray-600 whitespace-pre-wrap">{appointment.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AppointmentDetails;