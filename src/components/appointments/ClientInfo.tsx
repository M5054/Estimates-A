import React from 'react';
import { User, Building2, Mail, Phone } from 'lucide-react';
import { Client } from '../../types/appointments';

interface ClientInfoProps {
  client: Client;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ client }) => {
  if (!client) return null;

  return (
    <div className="border-t border-gray-200 pt-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Client Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start text-gray-500">
          <User className="h-5 w-5 mr-3 mt-0.5" />
          <span className="font-medium">{client.name}</span>
        </div>
        <div className="flex items-start text-gray-500">
          <Building2 className="h-5 w-5 mr-3 mt-0.5" />
          <span>{client.company}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <Mail className="h-5 w-5 mr-3" />
          <span>{client.email}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <Phone className="h-5 w-5 mr-3" />
          <span>{client.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default ClientInfo;