import { supabaseClient } from './base';
import type { Database } from '../../types/supabase';
import type { Appointment } from '../../types/appointments';
import { parseMeasurements } from '../../utils/measurements';

type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
type AppointmentUpdate = Database['public']['Tables']['appointments']['Update'];

export async function getAppointments(userId: string): Promise<Appointment[]> {
  const appointments = await supabaseClient.select<Appointment[]>(
    'appointments',
    `
      *,
      client:clients (
        id,
        name,
        company,
        email,
        phone
      )
    `,
    'getAppointments',
    { user_id: userId }
  );

  return appointments.map(appointment => ({
    ...appointment,
    measurements: parseMeasurements(appointment.measurements)
  }));
}

export async function getAppointment(appointmentId: string): Promise<Appointment> {
  const appointment = await supabaseClient.select<Appointment>(
    'appointments',
    `
      *,
      client:clients (
        id,
        name,
        company,
        email,
        phone
      )
    `,
    'getAppointment',
    { id: appointmentId }
  );

  return {
    ...appointment,
    measurements: parseMeasurements(appointment.measurements)
  };
}

export async function createAppointment(appointment: AppointmentInsert): Promise<Appointment> {
  // Ensure measurements is stringified before saving
  const preparedAppointment = {
    ...appointment,
    measurements: typeof appointment.measurements === 'string' 
      ? appointment.measurements 
      : JSON.stringify(appointment.measurements)
  };

  return supabaseClient.insert<Appointment>(
    'appointments',
    preparedAppointment,
    'createAppointment'
  );
}

export async function updateAppointment(appointmentId: string, appointment: AppointmentUpdate): Promise<Appointment> {
  // Remove client field if present as it's a join field
  const { client, ...updateData } = appointment;

  // Ensure measurements is stringified before saving
  const preparedAppointment = {
    ...updateData,
    measurements: typeof updateData.measurements === 'string'
      ? updateData.measurements
      : JSON.stringify(updateData.measurements)
  };

  return supabaseClient.update<Appointment>(
    'appointments',
    { id: appointmentId },
    preparedAppointment,
    'updateAppointment'
  );
}

export async function deleteAppointment(appointmentId: string): Promise<boolean> {
  return supabaseClient.delete<boolean>(
    'appointments',
    { id: appointmentId },
    'deleteAppointment'
  );
}