import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../../services/api';
import { Event } from '../../types';
import Layout from '../Layout/Layout';

const ListView: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      console.log('Fetching all events...');
      const eventsData = await eventsAPI.getEvents();
      console.log('All events received:', eventsData);
      setEvents(eventsData);
    } catch (err: any) {
      console.error('Error fetching all events:', err);
      console.error('Error response:', err.response);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.deleteEvent(id);
        setEvents(events.filter(event => event.id !== id));
      } catch (err: any) {
        setError('Failed to delete event');
      }
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  const getRecurrenceText = (event: Event) => {
    if (event.recurrence_type === 'none') return 'No recurrence';
    
    let text = `Every ${event.recurrence_interval} ${event.recurrence_type}`;
    if (event.recurrence_interval === 1) {
      text = `${event.recurrence_type.charAt(0).toUpperCase() + event.recurrence_type.slice(1)}`;
    }
    
    if (event.recurrence_type === 'weekly' && event.weekdays.length > 0) {
      const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const selectedDays = event.weekdays.map(day => weekdayNames[day]).join(', ');
      text += ` on ${selectedDays}`;
    }
    
    if (event.recurrence_type === 'monthly') {
      if (event.monthly_pattern === 'weekday') {
        text += ' (same weekday)';
      } else if (event.monthly_pattern === 'last_weekday') {
        text += ' (last weekday)';
      }
    }
    
    return text;
  };

  if (loading) {
    return (
      <Layout title="Season events">
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading events...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Season events">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="date"
            defaultValue="2023-03-05"
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}
          />
          <Link to="/events/new" className="btn btn-primary">
            Add Event
          </Link>
        </div>
        <div>
          <select
            defaultValue="Weekly Events"
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.875rem',
              minWidth: '150px'
            }}
          >
            <option>Weekly Events</option>
            <option>Monthly Events</option>
            <option>All Events</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Cp</th>
              <th>Category</th>
              <th>Event Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
              <th>Attendance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                  No events found. <Link to="/events/new" className="btn btn-primary btn-sm">Create your first event</Link>
                </td>
              </tr>
            ) : (
              events.map((event, index) => (
                <tr key={event.id}>
                  <td>{String(index + 1).padStart(2, '0')}</td>
                  <td>
                    {event.category ? (
                      <span
                        className="badge"
                        style={{ backgroundColor: event.category.color, color: 'white' }}
                      >
                        {event.category.name}
                      </span>
                    ) : (
                      <span className="badge badge-secondary">No Category</span>
                    )}
                  </td>
                  <td>{event.title}</td>
                  <td>{event.description || 'No description'}</td>
                  <td>{new Date(event.start_datetime).toLocaleDateString('en-GB')}</td>
                  <td>{new Date(event.start_datetime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>
                    <Link to={`/events/${event.id}/attendance`} className="badge badge-info">
                      Attendance
                    </Link>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/events/${event.id}/edit`} className="btn btn-sm btn-outline">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ListView;
