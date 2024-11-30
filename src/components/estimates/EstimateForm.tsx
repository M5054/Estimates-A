import React, { useState, useCallback } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createEstimate, updateEstimate } from '../../lib/api/estimates';
import Select from '../shared/Select';
import Button from '../shared/Button';

interface EstimateFormProps {
  clients: any[];
  estimate?: any;
  isEditing?: boolean;
  onSuccess?: () => void;
}

const EstimateForm: React.FC<EstimateFormProps> = ({
  clients,
  estimate,
  isEditing = false,
  onSuccess
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedClientId, setSelectedClientId] = useState(
    estimate?.client?.id || estimate?.client_id || ''
  );
  const [title, setTitle] = useState(estimate?.title || '');
  const [description, setDescription] = useState(estimate?.description || '');
  const [items, setItems] = useState(
    estimate?.items ? (typeof estimate.items === 'string' ? JSON.parse(estimate.items) : estimate.items) : []
  );
  const [validUntil, setValidUntil] = useState(estimate?.valid_until || '');
  const [notes, setNotes] = useState(estimate?.notes || '');
  const [terms, setTerms] = useState(estimate?.terms || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'description' ? value : Number(value)
    };
    setItems(newItems);
  };

  const calculateSubtotal = useCallback(() => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  }, [items]);

  const calculateTaxAmount = useCallback((subtotal: number) => {
    return (subtotal * (estimate?.tax_rate || 0)) / 100;
  }, [estimate?.tax_rate]);

  const calculateTotal = useCallback(() => {
    const subtotal = calculateSubtotal();
    const taxAmount = calculateTaxAmount(subtotal);
    return subtotal + taxAmount;
  }, [calculateSubtotal, calculateTaxAmount]);

  const validateForm = () => {
    if (!selectedClientId) return 'Please select a client';
    if (!title) return 'Please enter a title';
    if (!validUntil) return 'Please select a valid until date';
    if (items.length === 0) return 'Please add at least one item';

    const invalidItems = items.filter(item => !item.description || item.quantity <= 0 || item.rate <= 0);
    if (invalidItems.length > 0) {
      return 'Please complete all item fields with valid values';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedClientId) return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const subtotal = calculateSubtotal();
      const taxAmount = calculateTaxAmount(subtotal);
      const total = calculateTotal();

      const estimateData = {
        user_id: user.id,
        client_id: selectedClientId,
        title,
        description,
        items: JSON.stringify(items),
        subtotal,
        tax_rate: estimate?.tax_rate || 0,
        tax_amount: taxAmount,
        total,
        valid_until: validUntil,
        notes,
        terms,
        status: estimate?.status || 'draft'
      };

      if (isEditing && estimate?.id) {
        await updateEstimate(estimate.id, estimateData);
      } else {
        await createEstimate(estimateData);
      }

      onSuccess?.();
      navigate('/estimates');
    } catch (err) {
      console.error('Error saving estimate:', err);
      setError('Failed to save estimate');
    } finally {
      setSubmitting(false);
    }
  };

  const clientOptions = [
    { value: '', label: 'Select a client' },
    ...clients.map(client => ({
      value: client.id,
      label: `${client.company} - ${client.name}`
    }))
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-300">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="border border-black rounded-lg p-4">
          <Select
            label="Client"
            name="client"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            options={clientOptions}
            required
          />
        </div>

        <div className="border border-black rounded-lg p-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="border border-black rounded-lg p-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="border border-black rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Items
            </label>
            <Button
              type="button"
              onClick={handleAddItem}
              variant="secondary"
              size="sm"
              icon={Plus}
            >
              Add Item
            </Button>
          </div>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-grow">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Description"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    placeholder="Qty"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                    min="1"
                  />
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                    placeholder="Rate"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="w-32 pt-2 text-right text-sm text-gray-700">
                  ${(item.quantity * item.rate).toFixed(2)}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Minus className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-black rounded-lg p-4">
          <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 mb-2">
            Valid Until
          </label>
          <input
            type="date"
            id="validUntil"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="border border-black rounded-lg p-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="border border-black rounded-lg p-4">
          <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-2">
            Terms & Conditions
          </label>
          <textarea
            id="terms"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={submitting}
          disabled={submitting}
        >
          {isEditing ? 'Update Estimate' : 'Create Estimate'}
        </Button>
      </div>
    </form>
  );
};

export default EstimateForm;