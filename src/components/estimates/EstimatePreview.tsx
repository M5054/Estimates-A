import React from 'react';
import BusinessHeader from './preview/BusinessHeader';
import ClientInfo from './preview/ClientInfo';
import ItemsTable from './preview/ItemsTable';
import NotesAndTerms from './preview/NotesAndTerms';

interface EstimatePreviewProps {
  estimate: any;
  businessDetails: any;
}

const EstimatePreview: React.FC<EstimatePreviewProps> = ({ estimate, businessDetails }) => {
  const parsedItems = React.useMemo(() => {
    if (!estimate?.items) return [];
    
    try {
      // Handle both string and array formats
      if (typeof estimate.items === 'string') {
        const parsed = JSON.parse(estimate.items);
        return Array.isArray(parsed) ? parsed : [];
      }
      return Array.isArray(estimate.items) ? estimate.items : [];
    } catch (err) {
      console.error('Error parsing estimate items:', err);
      return [];
    }
  }, [estimate?.items]);

  if (!estimate) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">No estimate data available</p>
      </div>
    );
  }

  return (
    <div 
      id="estimate-content" 
      className="bg-white w-full max-w-[210mm] mx-auto print:max-w-none rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.1)] overflow-hidden border border-black/10"
    >
      <div className="divide-y divide-gray-200">
        <BusinessHeader 
          businessDetails={businessDetails} 
          estimate={estimate}
        />
        
        <div>
          <ClientInfo
            client={estimate.client}
            title={estimate.title}
            description={estimate.description}
          />
        </div>
        
        <div>
          <ItemsTable
            items={parsedItems}
            subtotal={parseFloat(estimate.subtotal) || 0}
            taxRate={parseFloat(estimate.tax_rate) || 0}
            taxAmount={parseFloat(estimate.tax_amount) || 0}
            total={parseFloat(estimate.total) || 0}
          />
        </div>
        
        <div>
          <NotesAndTerms
            notes={estimate.notes}
            terms={estimate.terms}
          />
        </div>
      </div>
    </div>
  );
};

export default EstimatePreview;