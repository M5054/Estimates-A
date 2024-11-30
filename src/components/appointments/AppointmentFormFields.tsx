import React from 'react';
import { Calendar, Clock, MapPin, FileText } from 'lucide-react';
import Select from '../shared/Select';
import Input from '../shared/Input';
import { Client } from '../../types/appointments';

interface AppointmentFormFieldsProps {
  formData: {
    client_id: string;
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    notes: string;
    status: string;
  };
  clients: Client[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const AppointmentFormFields: React.FC<AppointmentFormFieldsProps> = ({
  formData,
  clients,
  onChange
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <Select
            label="Client"
            name="client_id"
            value={formData.client_id}
            onChange={onChange}
            options={[
              { value: '', label: 'Select a client' },
              ...clients.map(client => ({
                value: client.id,
                label: `${client.company} - ${client.name}`
              }))
            ]}
            required
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <Input
            label="Title"
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            icon={FileText}
            required
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={onChange}
              icon={Calendar}
              required
            />

            <Input
              label="Start Time"
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={onChange}
              icon={Clock}
              required
            />

            <Input
              label="End Time"
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={onChange}
              icon={Clock}
              required
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <Input
            label="Location"
            type="text"
            name="location"
            value={formData.location}
            onChange={onChange}
            icon={MapPin}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={onChange}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'cancelled', label: 'Cancelled' }
            ]}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentFormFields;