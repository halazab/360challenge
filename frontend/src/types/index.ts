export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  user: User;
  category?: Category;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  recurrence_type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  recurrence_interval: number;
  recurrence_end_date?: string;
  recurrence_count?: number;
  weekdays: number[];
  monthly_pattern: 'date' | 'weekday' | 'last_weekday';
  created_at: string;
  updated_at: string;
}

export interface EventOccurrence {
  id: string;
  event_id: number;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  is_recurring: boolean;
  occurrence_index: number;
}

export interface EventFormData {
  category?: number | null;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  recurrence_type: string;
  recurrence_interval: number;
  recurrence_end_date?: string | null;
  recurrence_count?: number | null;
  weekdays: number[];
  monthly_pattern: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}
