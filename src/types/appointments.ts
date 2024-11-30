export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Measurement {
  area: string;
  width: string;
  length: string;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location?: string;
  notes?: string;
  status: AppointmentStatus;
  client: Client;
  measurements: Measurement[];
  created_at: string;
  updated_at?: string;
}

export interface AppointmentFormData {
  client_id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  notes: string;
  status: AppointmentStatus;
  measurements: Measurement[];
}