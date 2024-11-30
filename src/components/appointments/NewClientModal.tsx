import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createClient } from '../../lib/api/clients';
import Button from '../shared/Button';
import Input from '../shared/Input';

interface NewClientModalProps {
  userId?: string;
  onClose: () => void;
  onSuccess: (newClient: any) => void;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ userId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setSubmitting(true);
      setError(null);

      const newClient = await createClient({
        ...formData,
        user_id: userId,
      });

      onSuccess(newClient);
      onClose();
    } catch (err) {
      console.error('Failed to create client:', err);
      setError('Failed to create client');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Add New Client
                </h3>

                {error && (
                  <div className="mt-2 p-2 text-sm text-red-600 bg-red-100 rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <Input
                    label="Full Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />

                  <Input
                    label="Company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />

                  <Input
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={submitting}
                      disabled={submitting}
                      className="w-full sm:ml-3 sm:w-auto"
                    >
                      Add Client
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      className="mt-3 w-full sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewClientModal;