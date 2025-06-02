import React from 'react';
import { EventFormData } from '../../types';

interface RecurrenceSelectorProps {
  formData: EventFormData;
  onChange: (data: Partial<EventFormData>) => void;
}

const RecurrenceSelector: React.FC<RecurrenceSelectorProps> = ({ formData, onChange }) => {
  const weekdays = [
    { value: 0, label: 'Monday' },
    { value: 1, label: 'Tuesday' },
    { value: 2, label: 'Wednesday' },
    { value: 3, label: 'Thursday' },
    { value: 4, label: 'Friday' },
    { value: 5, label: 'Saturday' },
    { value: 6, label: 'Sunday' },
  ];

  const handleRecurrenceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const recurrence_type = e.target.value;
    onChange({
      recurrence_type,
      weekdays: recurrence_type === 'weekly' ? formData.weekdays : [],
    });
  };

  const handleWeekdayChange = (weekday: number, checked: boolean) => {
    const newWeekdays = checked
      ? [...formData.weekdays, weekday]
      : formData.weekdays.filter(w => w !== weekday);
    
    onChange({ weekdays: newWeekdays });
  };

  const handleChange = (field: keyof EventFormData, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="recurrence_type" className="form-label">
          Recurrence
        </label>
        <select
          id="recurrence_type"
          name="recurrence_type"
          className="form-control"
          value={formData.recurrence_type}
          onChange={handleRecurrenceTypeChange}
        >
          <option value="none">No Recurrence</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {formData.recurrence_type !== 'none' && (
        <>
          <div className="form-group">
            <label htmlFor="recurrence_interval" className="form-label">
              Repeat every
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="number"
                id="recurrence_interval"
                name="recurrence_interval"
                className="form-control"
                style={{ width: '80px' }}
                min="1"
                value={formData.recurrence_interval}
                onChange={(e) => handleChange('recurrence_interval', parseInt(e.target.value))}
              />
              <span>
                {formData.recurrence_type === 'daily' && 'day(s)'}
                {formData.recurrence_type === 'weekly' && 'week(s)'}
                {formData.recurrence_type === 'monthly' && 'month(s)'}
                {formData.recurrence_type === 'yearly' && 'year(s)'}
              </span>
            </div>
          </div>

          {formData.recurrence_type === 'weekly' && (
            <div className="form-group">
              <label className="form-label">Repeat on</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {weekdays.map((day) => (
                  <label key={day.value} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="checkbox"
                      checked={formData.weekdays.includes(day.value)}
                      onChange={(e) => handleWeekdayChange(day.value, e.target.checked)}
                    />
                    {day.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {formData.recurrence_type === 'monthly' && (
            <div className="form-group">
              <label htmlFor="monthly_pattern" className="form-label">
                Monthly Pattern
              </label>
              <select
                id="monthly_pattern"
                name="monthly_pattern"
                className="form-control"
                value={formData.monthly_pattern}
                onChange={(e) => handleChange('monthly_pattern', e.target.value)}
              >
                <option value="date">Same date each month</option>
                <option value="weekday">Same weekday each month</option>
                <option value="last_weekday">Last weekday of month</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">End Recurrence</label>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  name="end_type"
                  checked={!formData.recurrence_end_date && !formData.recurrence_count}
                  onChange={() => onChange({ recurrence_end_date: null, recurrence_count: null })}
                />
                Never
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  name="end_type"
                  checked={Boolean(formData.recurrence_end_date)}
                  onChange={() => onChange({ recurrence_end_date: new Date().toISOString().split('T')[0], recurrence_count: null })}
                />
                On date
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  name="end_type"
                  checked={Boolean(formData.recurrence_count)}
                  onChange={() => onChange({ recurrence_end_date: null, recurrence_count: 10 })}
                />
                After occurrences
              </label>
            </div>
          </div>

          {formData.recurrence_end_date && (
            <div className="form-group">
              <label htmlFor="recurrence_end_date" className="form-label">
                End Date
              </label>
              <input
                type="date"
                id="recurrence_end_date"
                name="recurrence_end_date"
                className="form-control"
                value={formData.recurrence_end_date || ''}
                onChange={(e) => handleChange('recurrence_end_date', e.target.value)}
              />
            </div>
          )}

          {formData.recurrence_count && (
            <div className="form-group">
              <label htmlFor="recurrence_count" className="form-label">
                Number of Occurrences
              </label>
              <input
                type="number"
                id="recurrence_count"
                name="recurrence_count"
                className="form-control"
                style={{ width: '120px' }}
                min="1"
                value={formData.recurrence_count || ''}
                onChange={(e) => handleChange('recurrence_count', parseInt(e.target.value))}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecurrenceSelector;
