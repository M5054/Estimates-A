import React, { useEffect, useState } from 'react';
import { Plus, Search, Mail, Phone, Building2, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getClients, deleteClient } from '../lib/api/clients';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import ClientModal from '../components/clients/ClientModal';

const Clients: React.FC = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  useEffect(() => {
    fetchClients();
  }, [user]);

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

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return;
    }

    try {
      await deleteClient(clientId);
      await fetchClients();
    } catch (err) {
      console.error('Failed to delete client:', err);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
    fetchClients();
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
          <button
            onClick={handleAddClient}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Client
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                      <p className="text-sm text-gray-500">{client.company}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClient(client)}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-2" />
                    {client.email}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-2" />
                    {client.phone}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <ClientModal
            client={selectedClient}
            onClose={handleModalClose}
            userId={user?.id}
          />
        )}
      </div>
    </div>
  );
};

export default Clients;