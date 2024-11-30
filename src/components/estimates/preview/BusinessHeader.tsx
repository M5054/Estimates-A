import React from 'react';
import { FileText } from 'lucide-react';
import { formatDate } from '../../../utils/date';

interface BusinessHeaderProps {
  businessDetails: any;
  estimate: any;
}

const BusinessHeader: React.FC<BusinessHeaderProps> = ({ businessDetails, estimate }) => {
  return (
    <div className="bg-red-600 text-white w-full">
      <div className="p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {businessDetails?.business_logo ? (
              <img
                src={businessDetails.business_logo}
                alt="Business Logo"
                className="h-16 sm:h-20 w-16 sm:w-20 object-contain bg-white rounded-lg p-2"
              />
            ) : (
              <div className="h-16 sm:h-20 w-16 sm:w-20 bg-white rounded-lg flex items-center justify-center">
                <FileText className="h-8 sm:h-10 w-8 sm:w-10 text-red-600" />
              </div>
            )}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {businessDetails?.business_name || 'Your Business Name'}
              </h2>
              <div className="mt-1 text-sm sm:text-base text-red-100 space-y-1">
                {businessDetails?.business_address && (
                  <p>{businessDetails.business_address}</p>
                )}
                <p>
                  {businessDetails?.business_city && businessDetails.business_city}
                  {businessDetails?.business_state && `, ${businessDetails.business_state}`}
                  {businessDetails?.business_zip && ` ${businessDetails.business_zip}`}
                </p>
                {businessDetails?.business_phone && (
                  <p>{businessDetails.business_phone}</p>
                )}
                {businessDetails?.business_email && (
                  <p>{businessDetails.business_email}</p>
                )}
                {businessDetails?.business_website && (
                  <p>{businessDetails.business_website}</p>
                )}
              </div>
            </div>
          </div>
          <EstimateInfo estimate={estimate} />
        </div>
      </div>
    </div>
  );
};

const EstimateInfo: React.FC<{ estimate: any }> = ({ estimate }) => {
  return (
    <div className="text-left sm:text-right">
      <p className="text-sm font-medium text-red-100">ESTIMATE</p>
      <p className="text-xl sm:text-2xl font-bold mt-1">#{estimate.estimate_number || 'New'}</p>
      <div className="mt-2 space-y-1 text-sm text-red-100">
        <p>
          <span className="sm:inline-block sm:w-24 text-red-200">Date:</span>{' '}
          {formatDate(estimate.created_at)}
        </p>
        <p>
          <span className="sm:inline-block sm:w-24 text-red-200">Valid Until:</span>{' '}
          {formatDate(estimate.valid_until)}
        </p>
        <p>
          <span className="sm:inline-block sm:w-24 text-red-200">Status:</span>{' '}
          <span className="capitalize">{estimate.status}</span>
        </p>
      </div>
    </div>
  );
};

export default BusinessHeader;