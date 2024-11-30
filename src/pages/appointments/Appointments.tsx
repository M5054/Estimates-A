import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAppointments, deleteAppointment } from '../../lib/api/appointments';
import { getClients } from '../../lib/api/clients';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import EditAppointmentModal from '../../components/appointments/EditAppointmentModal';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import AppointmentStats from '../../components/appointments/AppointmentStats';
import type { Appointment, Client } from '../../types/appointments';

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [appointmentsData, clientsData] = await Promise.all([
        getAppointments(user.id),
        getClients(user.id)
      ]);

      // Sort appointments by date (most recent first)
      const sortedAppointments = appointmentsData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setAppointments(sortedAppointments);
      setClients(clientsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (appointment: Appointment, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingAppointment(appointment);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteAppointment(id);
      await fetchData();
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError('Failed to delete appointment');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
        <Link
          to="/appointments/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Appointment
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mt-8">
        <AppointmentStats appointments={appointments} />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        ))}

        {appointments.length === 0 && (
          <div className="col-span-full text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new appointment.
            </p>
            <div className="mt-6">
              <Link
                to="/appointments/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Appointment
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          clients={clients}
          onClose={() => setEditingAppointment(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default Appointments;