import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getClients } from '../../lib/api/clients';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import Button from '../../components/shared/Button';
import NewClientModal from '../../components/appointments/NewClientModal';

const NewAppointment: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewClientModal, setShowNewClientModal] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [user]);

  const fetchClients = async () => {
    if (!user) return;

    try {
      const data = await getClients(user.id);
      setClients(data);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    navigate('/appointments');
  };

  const handleNewClientSuccess = (newClient: any) => {
    setClients(prevClients => [...prevClients, newClient]);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">New Appointment</h1>
        <Button
          variant="secondary"
          icon={Plus}
          onClick={() => setShowNewClientModal(true)}
        >
          Add New Client
        </Button>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first client to create an appointment.
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowNewClientModal(true)}
            >
              Add Client
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <AppointmentForm
            clients={clients}
            onSuccess={handleSuccess}
          />
        </div>
      )}

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

export default NewAppointment;