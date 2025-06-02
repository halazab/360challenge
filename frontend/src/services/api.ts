import axios from 'axios';
import { AuthResponse, LoginData, RegisterData, Event, EventFormData, EventOccurrence, Category } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login/', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await api.post('/auth/logout/', { refresh: refreshToken });
    }
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },
};

export const eventsAPI = {
  getEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events/');
    return response.data;
  },

  createEvent: async (data: EventFormData): Promise<Event> => {
    const response = await api.post('/events/', data);
    return response.data;
  },

  updateEvent: async (id: number, data: Partial<EventFormData>): Promise<Event> => {
    const response = await api.patch(`/events/${id}/`, data);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}/`);
  },

  getEvent: async (id: number): Promise<Event> => {
    const response = await api.get(`/events/${id}/`);
    return response.data;
  },

  getCalendarEvents: async (startDate: string, endDate: string): Promise<EventOccurrence[]> => {
    const response = await api.get(`/events/calendar/?start_date=${startDate}&end_date=${endDate}`);
    return response.data;
  },

  getUpcomingEvents: async (limit: number = 10): Promise<EventOccurrence[]> => {
    const response = await api.get(`/events/upcoming/?limit=${limit}`);
    return response.data;
  },
};

export const categoriesAPI = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/events/categories/');
    return response.data;
  },

  createCategory: async (data: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
    const response = await api.post('/events/categories/', data);
    return response.data;
  },

  updateCategory: async (id: number, data: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>): Promise<Category> => {
    const response = await api.patch(`/events/categories/${id}/`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/events/categories/${id}/`);
  },

  getCategory: async (id: number): Promise<Category> => {
    const response = await api.get(`/events/categories/${id}/`);
    return response.data;
  },
};

export default api;
