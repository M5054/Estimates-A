import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Eye, History } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getEstimate } from '../../lib/api/estimates';
import { getClients } from '../../lib/api/clients';
import { getProfile } from '../../lib/api/profiles';
import EstimateForm from '../../components/estimates/EstimateForm';
import EstimatePreview from '../../components/estimates/EstimatePreview';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

const EditEstimate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'history'>('edit');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [businessDetails, setBusinessDetails] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !id) return;
      
      try {
        const [estimateData, clientsData, profileData] = await Promise.all([
          getEstimate(id),
          getClients(user.id),
          getProfile(user.id)
        ]);

        setEstimate(estimateData);
        setClients(clientsData);
        setBusinessDetails(profileData);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load estimate data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleTabChange = (tab: 'edit' | 'preview' | 'history') => {
    if (tab === 'preview' && id) {
      navigate(`/estimates/${id}`);
    } else {
      setActiveTab(tab);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const tabs = [
    { id: 'edit', label: 'Edit', icon: Edit },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'history', label: 'History', icon: History }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-400 hover:text-gray-500"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Estimate</h1>
        </div>

        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id as 'edit' | 'preview' | 'history')}
              className={`
                inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                ${activeTab === id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 hover:text-gray-700 bg-white'
                }
              `}
            >
              <Icon className="h-5 w-5 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'edit' && (
        <div className="bg-white rounded-lg border border-black">
          <EstimateForm
            clients={clients}
            estimate={estimate}
            isEditing={true}
            onSuccess={() => navigate(`/estimates/${id}`)}
          />
        </div>
      )}

      {activeTab === 'preview' && (
        <EstimatePreview
          estimate={estimate}
          businessDetails={businessDetails}
        />
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-lg border border-black p-6">
          <p className="text-gray-500 text-center">No history available yet</p>
        </div>
      )}
    </div>
  );
};

export default EditEstimate;