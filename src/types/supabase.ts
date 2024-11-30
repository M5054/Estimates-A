// ... existing types ...

type Appointment = {
  id: string;
  created_at: string;
  user_id: string;
  client_id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  measurements: {
    area: string;
    width: string;
    length: string;
    notes: string;
  }[];
};

// ... rest of the file ...