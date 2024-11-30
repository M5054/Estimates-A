import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAppointment } from '../../lib/api/appointments';
import { getClients } from '../../lib/api/clients';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import Button from '../../components/shared/Button';
import Card from '../../components/shared/Card';
import NewClientModal from '../../components/appointments/NewClientModal';

const EditAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewClientModal, setShowNewClientModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const fetchData = async () => {
    if (!user || !id) return;

    try {
      setLoading(true);
      setError(null);

      const [appointmentData, clientsData] = await Promise.all([
        getAppointment(id),
        getClients(user.id)
      ]);

      if (!appointmentData) {
        throw new Error('Appointment not found');
      }

      const parsedAppointment = {
        ...appointmentData,
        measurements: appointmentData.measurements 
          ? typeof appointmentData.measurements === 'string'
            ? JSON.parse(appointmentData.measurements)
            : appointmentData.measurements
          : []
      };

      setAppointment(parsedAppointment);
      setClients(clientsData);
    } catch (err) {
      console.error('Error fetching appointment data:', err);
      setError('Failed to load appointment data');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    navigate(`/appointments/${id}`);
  };

  const handleNewClientSuccess = (newClient: any) => {
    setClients(prevClients => [...prevClients, newClient]);
  };

  const handleBack = () => {
    navigate(`/appointments/${id}`);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message="Appointment not found" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Appointment
          </button>
          <Button
            variant="secondary"
            icon={Plus}
            onClick={() => setShowNewClientModal(true)}
          >
            Add New Client
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Appointment</h1>
          
          <AppointmentForm
            appointment={appointment}
            clients={clients}
            isEditing={true}
            onSuccess={handleSuccess}
          />
        </div>
      </Card>

      {showNewClientModal && (
        <NewClientModal
          userId={user?.id}
          onClose={() => setShowNewClientModal(false)}
          onSuccess={handleNewClientSuccess}
        />
      )}
    </div>
  );
};

export default EditAppointment;