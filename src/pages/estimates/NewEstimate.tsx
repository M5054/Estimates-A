import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getClients } from '../../lib/api/clients';
import EstimateForm from '../../components/estimates/EstimateForm';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

const NewEstimate: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      if (!user) return;
      
      try {
        const data = await getClients(user.id);
        setClients(data);
      } catch (err) {
        setError('Failed to load clients');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [user]);

  const handleSuccess = () => {
    navigate('/estimates');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  if (clients.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
          <p className="mt-1 text-sm text-gray-500">
            You need to add at least one client before creating an estimate.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/clients')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Client
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Create New Estimate</h1>
      <div className="mt-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <EstimateForm clients={clients} onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default NewEstimate;