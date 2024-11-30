import React from 'react';

interface ClientInfoProps {
  client: any;
  title: string;
  description?: string;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ client, title, description }) => {
  return (
    <div className="px-4 sm:px-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">To:</h3>
          <div className="mt-2 space-y-1">
            {client?.company && (
              <p className="text-gray-900 font-medium">{client.company}</p>
            )}
            {client?.name && (
              <p className="text-gray-600">{client.name}</p>
            )}
            {client?.email && (
              <p className="text-gray-600">{client.email}</p>
            )}
            {client?.phone && (
              <p className="text-gray-600">{client.phone}</p>
            )}
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-gray-600">Project:</p>
          <p className="text-gray-900 font-medium mt-2">{title}</p>
          {description && (
            <p className="text-gray-600 mt-1 max-w-xs whitespace-pre-wrap">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientInfo;