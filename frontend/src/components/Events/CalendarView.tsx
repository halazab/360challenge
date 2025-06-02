import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../../services/api';
import { EventOccurrence } from '../../types';
import Layout from '../Layout/Layout';
import './CalendarView.css';

const CalendarView: React.FC = () => {
  const [events, setEvents] = useState<EventOccurrence[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCalendarEvents();
  }, [currentDate]);

  const fetchCalendarEvents = async () => {
    setLoading(true);
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const startDate = startOfMonth.toISOString().split('T')[0];
      const endDate = endOfMonth.toISOString().split('T')[0];

      const eventsData = await eventsAPI.getCalendarEvents(startDate, endDate);
      setEvents(eventsData);
    } catch (err: any) {
      setError('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getEventsForDay = (day: number) => {
    if (!day) return [];

    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayString = dayDate.toISOString().split('T')[0];

    return events.filter(event => {
      const eventDate = new Date(event.start_datetime).toISOString().split('T')[0];
      return eventDate === dayString;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <Layout title="Message">
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading calendar...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Message">
      <div className="calendar-container">
      <div className="calendar-header">
        <h1 className="calendar-title">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h1>
        <div className="calendar-nav">
          <button onClick={() => navigateMonth('prev')} className="nav-btn">
            ← Previous
          </button>
          <button onClick={() => navigateMonth('next')} className="nav-btn">
            Next →
          </button>
        </div>
      </div>

      {error && <div className="error-calendar">{error}</div>}

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {weekDays.map(day => (
            <div key={day} className="weekday-header">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-days">
          {getDaysInMonth().map((day, index) => {
            const isToday = day &&
              new Date().getDate() === day &&
              new Date().getMonth() === currentDate.getMonth() &&
              new Date().getFullYear() === currentDate.getFullYear();

            return (
              <div
                key={index}
                className={`calendar-day ${!day ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
              >
                {day && (
                  <>
                    <div className="day-number">{day}</div>
                    <div className="day-events">
                      {getEventsForDay(day).slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className={`event-item ${event.is_recurring ? 'recurring' : ''}`}
                          title={`${event.title} - ${formatTime(event.start_datetime)}`}
                        >
                          {formatTime(event.start_datetime)} {event.title}
                        </div>
                      ))}
                      {getEventsForDay(day).length > 3 && (
                        <div className="more-events">
                          +{getEventsForDay(day).length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color single"></div>
          <span>Single Events</span>
        </div>
        <div className="legend-item">
          <div className="legend-color recurring"></div>
          <span>Recurring Events</span>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default CalendarView;
