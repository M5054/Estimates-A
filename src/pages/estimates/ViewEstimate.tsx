import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, Edit, Eye, AlertCircle, Share2, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getEstimate, updateEstimateStatus } from '../../lib/api/estimates';
import { getProfile } from '../../lib/api/profiles';
import { getClients } from '../../lib/api/clients';
import { generatePDF } from '../../utils/pdf';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import Button from '../../components/shared/Button';
import EstimatePreview from '../../components/estimates/EstimatePreview';
import EstimateForm from '../../components/estimates/EstimateForm';
import StatusChanger from '../../components/estimates/StatusChanger';

const ViewEstimate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'status'>('preview');
  const [estimate, setEstimate] = useState<any>(null);
  const [businessDetails, setBusinessDetails] = useState<any>({});
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const fetchData = async () => {
    if (!user || !id) return;

    try {
      setLoading(true);
      setError(null);
      
      const [estimateData, profileData, clientsData] = await Promise.all([
        getEstimate(id),
        getProfile(user.id),
        getClients(user.id)
      ]);

      if (!estimateData) {
        throw new Error('Estimate not found');
      }

      const parsedEstimate = {
        ...estimateData,
        items: typeof estimateData.items === 'string' 
          ? JSON.parse(estimateData.items) 
          : estimateData.items
      };

      setEstimate(parsedEstimate);
      setBusinessDetails(profileData);
      setClients(clientsData);
    } catch (err) {
      console.error('Error fetching estimate:', err);
      setError('Failed to load estimate');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/estimates');
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await generatePDF('estimate-content', {
        filename: `estimate-${estimate.estimate_number}.pdf`,
        margin: 10,
        scale: window.innerWidth <= 768 ? 3 : 2,
        enableLinks: true
      });
    } catch (err) {
      console.error('Error downloading PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const publicUrl = `${window.location.origin}/e/${id}`;
    
    try {
      if (navigator.share && window.innerWidth <= 768) {
        await navigator.share({
          title: `Estimate #${estimate.estimate_number}`,
          text: `View estimate for ${estimate.client?.company}`,
          url: publicUrl
        });
      } else {
        await navigator.clipboard.writeText(publicUrl);
        setShowShareTooltip(true);
        setTimeout(() => setShowShareTooltip(false), 2000);
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const handleStatusChange = async (newStatus: 'draft' | 'pending' | 'approved' | 'rejected') => {
    if (!id || !estimate) return;

    try {
      setUpdatingStatus(true);
      setError(null);

      const updatedEstimate = await updateEstimateStatus(id, newStatus);
      setEstimate({ ...estimate, ...updatedEstimate });
      setActiveTab('preview');
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleEditSuccess = () => {
    setActiveTab('preview');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!estimate) return <ErrorMessage message="Estimate not found" />;

  const tabs = [
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'edit', label: 'Edit', icon: Edit },
    { id: 'status', label: 'Status', icon: AlertCircle }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 text-gray-400 hover:text-gray-500"
            >
              <FileText className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Estimate #{estimate.estimate_number}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {estimate.client?.company} - {estimate.title}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="flex gap-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as 'preview' | 'edit' | 'status')}
                  className={`
                    flex-1 sm:flex-none inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${activeTab === id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-500 hover:text-gray-700 bg-white'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <Button
                  onClick={handleShare}
                  icon={navigator.share && window.innerWidth <= 768 ? Share2 : LinkIcon}
                  size="sm"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  {navigator.share && window.innerWidth <= 768 ? 'Share' : 'Copy Link'}
                </Button>
                {showShareTooltip && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded">
                    Link copied!
                  </div>
                )}
              </div>
              
              {activeTab === 'preview' && (
                <Button
                  onClick={handleDownload}
                  loading={downloading}
                  disabled={downloading}
                  icon={Download}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {activeTab === 'preview' && (
          <EstimatePreview
            estimate={estimate}
            businessDetails={businessDetails}
          />
        )}

        {activeTab === 'edit' && (
          <div className="bg-white shadow-lg rounded-lg">
            <EstimateForm
              estimate={estimate}
              isEditing={true}
              onSuccess={handleEditSuccess}
              clients={clients}
            />
          </div>
        )}

        {activeTab === 'status' && (
          <div className="bg-white shadow-lg rounded-lg">
            <StatusChanger
              currentStatus={estimate.status}
              onStatusChange={handleStatusChange}
              loading={updatingStatus}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEstimate;