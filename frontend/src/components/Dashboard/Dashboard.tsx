import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../../services/api';
import { EventOccurrence } from '../../types';
import Layout from '../Layout/Layout';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<EventOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        console.log('Fetching upcoming events...');
        const events = await eventsAPI.getUpcomingEvents(5);
        console.log('Upcoming events received:', events);
        setUpcomingEvents(events);
      } catch (err: any) {
        console.error('Error fetching events:', err);
        console.error('Error response:', err.response);
        setError('Failed to load upcoming events');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Layout title="Booking Schedule">
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading dashboard...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Booking Schedule">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/events/new" className="btn btn-primary">
                Create New Event
              </Link>
              <Link to="/calendar" className="btn btn-outline">
                View Calendar
              </Link>
              <Link to="/events" className="btn btn-outline">
                All Events
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Event Statistics</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '600', color: '#ff6b35' }}>{upcomingEvents.length}</div>
                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>Upcoming Events</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Upcoming Events</h3>
        </div>
        <div className="card-body">
          {error && <div className="error-message">{error}</div>}
          {upcomingEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
              <p>No upcoming events. <Link to="/events/new" className="btn btn-primary btn-sm">Create your first event</Link></p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Category</th>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: '500' }}>{event.title}</div>
                          {event.description && (
                            <div style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '4px' }}>
                              {event.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-secondary">General</span>
                      </td>
                      <td>{formatDateTime(event.start_datetime)}</td>
                      <td>
                        {event.is_recurring ? (
                          <span className="badge badge-info">Recurring</span>
                        ) : (
                          <span className="badge badge-secondary">One-time</span>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-success">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
