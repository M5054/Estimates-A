import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateAppointment } from '../../lib/api/appointments';
import AppointmentFormFields from './AppointmentFormFields';
import MeasurementForm from './MeasurementForm';
import Button from '../shared/Button';
import type { Appointment, Client, AppointmentFormData } from '../../types/appointments';
import { parseMeasurements } from '../../utils/measurements';

interface EditAppointmentModalProps {
  appointment: Appointment;
  clients: Client[];
  onClose: () => void;
  onSuccess: () => void;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  appointment,
  clients,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<AppointmentFormData>({
    client_id: appointment.client.id,
    title: appointment.title,
    date: appointment.date,
    start_time: appointment.start_time,
    end_time: appointment.end_time,
    location: appointment.location || '',
    notes: appointment.notes || '',
    status: appointment.status,
    measurements: parseMeasurements(appointment.measurements)
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMeasurementsChange = (measurements: any[]) => {
    setFormData(prev => ({ ...prev, measurements }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);
      setError(null);

      const appointmentData = {
        ...formData,
        user_id: user.id,
        measurements: JSON.stringify(formData.measurements)
      };

      await updateAppointment(appointment.id, appointmentData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError('Failed to update appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Edit Appointment
              </h3>
              <button
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-300">
                  <p className="text-sm text-red-700">{error}</p>
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
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  disabled={submitting}
                >
                  Update Appointment
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAppointmentModal;