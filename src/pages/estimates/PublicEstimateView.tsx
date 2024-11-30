import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import EstimatePreview from '../../components/estimates/EstimatePreview';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import { Download } from 'lucide-react';
import Button from '../../components/shared/Button';
import { generatePDF } from '../../utils/pdf';

const PublicEstimateView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [estimate, setEstimate] = useState<any>(null);
  const [businessDetails, setBusinessDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchEstimate();
  }, [id]);

  const fetchEstimate = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const { data: estimateData, error: estimateError } = await supabase
        .from('estimates')
        .select(`
          id,
          estimate_number,
          created_at,
          valid_until,
          title,
          description,
          items,
          subtotal,
          tax_rate,
          tax_amount,
          total,
          notes,
          terms,
          expires_at,
          public_enabled,
          client:clients (
            name,
            company,
            email,
            phone
          ),
          user:profiles!estimates_user_id_fkey (
            business_name,
            business_email,
            business_phone,
            business_address,
            business_city,
            business_state,
            business_zip,
            business_website,
            business_logo
          )
        `)
        .eq('id', id)
        .single();

      if (estimateError) throw estimateError;
      if (!estimateData) throw new Error('Estimate not found');

      // Check if estimate is accessible
      if (!estimateData.public_enabled) {
        throw new Error('This estimate is no longer available');
      }

      // Check if estimate has expired
      if (estimateData.expires_at && new Date(estimateData.expires_at) < new Date()) {
        throw new Error('This estimate has expired');
      }

      // Extract business details
      const businessDetails = {
        business_name: estimateData.user.business_name,
        business_email: estimateData.user.business_email,
        business_phone: estimateData.user.business_phone,
        business_address: estimateData.user.business_address,
        business_city: estimateData.user.business_city,
        business_state: estimateData.user.business_state,
        business_zip: estimateData.user.business_zip,
        business_website: estimateData.user.business_website,
        business_logo: estimateData.user.business_logo,
      };

      // Parse items if stored as string
      const parsedEstimate = {
        ...estimateData,
        items: typeof estimateData.items === 'string' 
          ? JSON.parse(estimateData.items) 
          : estimateData.items
      };

      setEstimate(parsedEstimate);
      setBusinessDetails(businessDetails);
    } catch (err) {
      console.error('Error fetching estimate:', err);
      setError(err instanceof Error ? err.message : 'This estimate is no longer available');
    } finally {
      setLoading(false);
    }
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

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <ErrorMessage message={error} />
    </div>
  );
  
  if (!estimate) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <ErrorMessage message="Estimate not found" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-end">
          <Button
            onClick={handleDownload}
            loading={downloading}
            disabled={downloading}
            icon={Download}
            size="sm"
          >
            Download PDF
          </Button>
        </div>

        <EstimatePreview
          estimate={estimate}
          businessDetails={businessDetails}
        />
      </div>
    </div>
  );
};

export default PublicEstimateView;