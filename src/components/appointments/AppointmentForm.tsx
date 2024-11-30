import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createAppointment, updateAppointment } from '../../lib/api/appointments';
import AppointmentFormFields from './AppointmentFormFields';
import MeasurementForm from './MeasurementForm';
import Button from '../shared/Button';
import { Client, Measurement, AppointmentFormData } from '../../types/appointments';
import { parseMeasurements } from '../../utils/measurements';

interface AppointmentFormProps {
  appointment?: any;
  clients: Client[];
  isEditing?: boolean;
  onSuccess?: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  clients,
  isEditing = false,
  onSuccess
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AppointmentFormData>({
    client_id: appointment?.client_id || '',
    title: appointment?.title || '',
    date: appointment?.date || '',
    start_time: appointment?.start_time || '',
    end_time: appointment?.end_time || '',
    location: appointment?.location || '',
    notes: appointment?.notes || '',
    status: appointment?.status || 'pending',
    measurements: parseMeasurements(appointment?.measurements || [])
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): string | null => {
    if (!formData.client_id) return 'Please select a client';
    if (!formData.title) return 'Please enter a title';
    if (!formData.date) return 'Please select a date';
    if (!formData.start_time) return 'Please select a start time';
    if (!formData.end_time) return 'Please select an end time';
    
    // Validate measurements
    if (formData.measurements.length > 0) {
      const invalidMeasurements = formData.measurements.filter(
        m => !m.area || !m.width || !m.length
      );

      if (invalidMeasurements.length > 0) {
        const missingFields = invalidMeasurements.map((m, index) => {
          const missing = [];
          if (!m.area) missing.push('Area');
          if (!m.width) missing.push('Width');
          if (!m.length) missing.push('Length');
          return `Measurement ${index + 1}: Missing ${missing.join(', ')}`;
        });
        return `Please complete all measurement fields:\n${missingFields.join('\n')}`;
      }
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMeasurementsChange = (measurements: Measurement[]) => {
    setFormData(prev => ({ ...prev, measurements }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const appointmentData = {
        ...formData,
        user_id: user.id,
        measurements: JSON.stringify(formData.measurements)
      };

      if (isEditing && appointment) {
        // Only include changed fields when updating
        const changedFields = Object.entries(appointmentData).reduce((acc, [key, value]) => {
          if (appointment[key] !== value) {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, any>);

        await updateAppointment(appointment.id, changedFields);
      } else {
        await createAppointment(appointmentData);
      }

      onSuccess?.();
      navigate('/appointments');
    } catch (err) {
      console.error('Error saving appointment:', err);
      setError('Failed to save appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-300">
          <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
        </div>
      )}

      <AppointmentFormFields
        formData={formData}
        clients={clients}
        onChange={handleChange}
      />

      <MeasurementForm
        measurements={formData.measurements}
        onChange={handleMeasurementsChange}
      />

      <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/appointments')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={submitting}
          disabled={submitting}
        >
          {isEditing ? 'Update Appointment' : 'Create Appointment'}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;