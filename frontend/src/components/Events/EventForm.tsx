import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsAPI, categoriesAPI } from '../../services/api';
import { EventFormData, Category } from '../../types';
import Layout from '../Layout/Layout';
import RecurrenceSelector from './RecurrenceSelector';

const EventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<EventFormData>({
    category: null,
    title: '',
    description: '',
    start_datetime: '',
    end_datetime: '',
    recurrence_type: 'none',
    recurrence_interval: 1,
    recurrence_end_date: null,
    recurrence_count: null,
    weekdays: [],
    monthly_pattern: 'date',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoriesAPI.getCategories();
        setCategories(categoriesData);
      } catch (err: any) {
        console.error('Failed to load categories:', err);
      }
    };

    fetchCategories();

    if (isEditing && id) {
      const fetchEvent = async () => {
        try {
          const event = await eventsAPI.getEvent(parseInt(id));
          setFormData({
            category: event.category?.id || null,
            title: event.title,
            description: event.description,
            start_datetime: event.start_datetime.slice(0, 16),
            end_datetime: event.end_datetime.slice(0, 16),
            recurrence_type: event.recurrence_type,
            recurrence_interval: event.recurrence_interval,
            recurrence_end_date: event.recurrence_end_date || null,
            recurrence_count: event.recurrence_count || null,
            weekdays: event.weekdays,
            monthly_pattern: event.monthly_pattern,
          });
        } catch (err: any) {
          setError('Failed to load event');
        }
      };
      fetchEvent();
    }
  }, [isEditing, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'category' ? (value ? parseInt(value) : null) : value,
    }));
  };

  const handleRecurrenceChange = (recurrenceData: Partial<EventFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...recurrenceData,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        category: formData.category || null,
        start_datetime: new Date(formData.start_datetime).toISOString(),
        end_datetime: new Date(formData.end_datetime).toISOString(),
        recurrence_end_date: formData.recurrence_end_date || null,
        recurrence_count: formData.recurrence_count || null,
      };

      if (isEditing && id) {
        await eventsAPI.updateEvent(parseInt(id), submitData);
      } else {
        await eventsAPI.createEvent(submitData);
      }

      navigate('/events');
    } catch (err: any) {
      console.error('Event save error:', err);
      console.error('Error response:', err.response);

      if (err.response?.data) {
        // Handle validation errors
        if (typeof err.response.data === 'object') {
          const errorMessages = Object.entries(err.response.data)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          setError(errorMessages);
        } else {
          setError(err.response.data.error || err.response.data || 'Failed to save event');
        }
      } else {
        setError('Failed to save event. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={isEditing ? 'Edit Event' : 'Create New Event'}>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{isEditing ? 'Edit Event' : 'Create New Event'}</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="form-control"
              value={formData.category || ''}
              onChange={handleChange}
            >
              <option value="">Select a category (optional)</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label htmlFor="start_datetime" className="form-label">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                id="start_datetime"
                name="start_datetime"
                className="form-control"
                value={formData.start_datetime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_datetime" className="form-label">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                id="end_datetime"
                name="end_datetime"
                className="form-control"
                value={formData.end_datetime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <RecurrenceSelector
            formData={formData}
            onChange={handleRecurrenceChange}
          />

            {error && <div className="error-message">{error}</div>}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/events')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EventForm;
