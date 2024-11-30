import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart2, 
  FileText, 
  Plus, 
  Calendar,
  Clock,
  Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getEstimates } from '../lib/api/estimates';
import { getAppointments } from '../lib/api/appointments';
import { getClients } from '../lib/api/clients';
import { formatCurrency } from '../utils/currency';
import { formatDate, formatTime } from '../utils/date';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import Card from '../components/shared/Card';
import EditAppointmentModal from '../components/appointments/EditAppointmentModal';
import type { Appointment, Client } from '../types/appointments';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estimates, setEstimates] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      const [estimatesData, appointmentsData, clientsData] = await Promise.all([
        getEstimates(user.id),
        getAppointments(user.id),
        getClients(user.id)
      ]);

      // Filter approved estimates and sort by creation date
      const approvedEstimates = estimatesData
        .filter(estimate => estimate.status === 'approved')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5); // Get only the 5 most recent

      // Filter pending appointments and sort by date
      const pendingAppointments = appointmentsData
        .filter(appointment => appointment.status === 'pending')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5); // Get only the 5 most recent

      setEstimates(approvedEstimates);
      setAppointments(pendingAppointments);
      setClients(clientsData);
    } catch (err) {
      console.error('Dashboard data error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

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

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          <Link
            to="/estimates/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Estimate
          </Link>
          <Link
            to="/appointments/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Calendar className="h-5 w-5 mr-2" />
            New Appointment
          </Link>
        </div>
      </div>

      {/* Recent Estimates & Appointments */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Recent Approved Estimates */}
        <div>
          <div className="sm:flex sm:items-center sm:justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Approved Estimates</h2>
            <Link
              to="/estimates"
              className="mt-4 sm:mt-0 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <div className="min-w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Estimate #
                    </th>
                    <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                      Client
                    </th>
                    <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {estimates.length > 0 ? (
                    estimates.map((estimate) => (
                      <tr key={estimate.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/estimates/${estimate.id}`)}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="font-medium text-gray-900">{estimate.estimate_number}</div>
                            <div className="ml-4 lg:hidden">
                              <div className="font-medium text-gray-900">{estimate.client?.company}</div>
                              <div className="text-gray-500">{formatDate(estimate.created_at)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                          {estimate.client?.company}
                        </td>
                        <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                          {formatDate(estimate.created_at)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-500">
                          <span className="font-medium text-gray-900">
                            {formatCurrency(estimate.total)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-sm text-center text-gray-500">
                        No approved estimates yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Pending Appointments */}
        <div>
          <div className="sm:flex sm:items-center sm:justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Pending Appointments</h2>
            <Link
              to="/appointments"
              className="mt-4 sm:mt-0 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="block cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleEditAppointment(appointment)}
                >
                  <Card>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-gray-900">
                          {appointment.title}
                        </h3>
                        <span className={`
                          inline-flex rounded-full px-2 py-1 text-xs font-semibold
                          ${getStatusColor(appointment.status)}
                        `}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(appointment.date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-2" />
                          {appointment.client?.name}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <div className="text-center py-6 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-500">No pending appointments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Appointment Modal */}
      {editingAppointment && (
        <EditAppointmentModal
          appointment={editingAppointment}
          clients={clients}
          onClose={() => setEditingAppointment(null)}
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};

export default Dashboard;