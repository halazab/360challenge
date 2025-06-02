from datetime import datetime, timedelta, date
from dateutil.relativedelta import relativedelta
import calendar


class RecurrenceGenerator:
    def __init__(self, event):
        self.event = event
    
    def generate_occurrences(self, start_date=None, end_date=None, max_count=100):
        if self.event.recurrence_type == 'none':
            return [self.event]
        
        occurrences = []
        current_date = self.event.start_datetime
        
        if start_date and current_date.date() < start_date:
            current_date = self._find_next_occurrence_after(start_date)
        
        count = 0
        while count < max_count:
            if self.event.recurrence_count and count >= self.event.recurrence_count:
                break
            
            if self.event.recurrence_end_date and current_date.date() > self.event.recurrence_end_date:
                break
            
            if end_date and current_date.date() > end_date:
                break
            
            if not start_date or current_date.date() >= start_date:
                duration = self.event.end_datetime - self.event.start_datetime
                occurrence = {
                    'id': f"{self.event.id}_{count}",
                    'event_id': self.event.id,
                    'title': self.event.title,
                    'description': self.event.description,
                    'start_datetime': current_date,
                    'end_datetime': current_date + duration,
                    'is_recurring': True,
                    'occurrence_index': count
                }
                occurrences.append(occurrence)
            
            current_date = self._get_next_occurrence(current_date)
            if not current_date:
                break
            
            count += 1
        
        return occurrences
    
    def _get_next_occurrence(self, current_date):
        if self.event.recurrence_type == 'daily':
            return current_date + timedelta(days=self.event.recurrence_interval)
        
        elif self.event.recurrence_type == 'weekly':
            if self.event.weekdays:
                return self._get_next_weekday_occurrence(current_date)
            else:
                return current_date + timedelta(weeks=self.event.recurrence_interval)
        
        elif self.event.recurrence_type == 'monthly':
            return self._get_next_monthly_occurrence(current_date)
        
        elif self.event.recurrence_type == 'yearly':
            return current_date + relativedelta(years=self.event.recurrence_interval)
        
        return None
    
    def _get_next_weekday_occurrence(self, current_date):
        weekdays = sorted(self.event.weekdays)
        current_weekday = current_date.weekday()
        
        next_weekday = None
        for wd in weekdays:
            if wd > current_weekday:
                next_weekday = wd
                break
        
        if next_weekday is not None:
            days_ahead = next_weekday - current_weekday
            return current_date + timedelta(days=days_ahead)
        else:
            days_ahead = (7 - current_weekday) + weekdays[0]
            if self.event.recurrence_interval > 1:
                days_ahead += (self.event.recurrence_interval - 1) * 7
            return current_date + timedelta(days=days_ahead)
    
    def _get_next_monthly_occurrence(self, current_date):
        if self.event.monthly_pattern == 'date':
            try:
                next_month = current_date + relativedelta(months=self.event.recurrence_interval)
                return next_month.replace(day=self.event.start_datetime.day)
            except ValueError:
                next_month = current_date + relativedelta(months=self.event.recurrence_interval)
                last_day = calendar.monthrange(next_month.year, next_month.month)[1]
                return next_month.replace(day=min(self.event.start_datetime.day, last_day))
        
        elif self.event.monthly_pattern == 'weekday':
            return self._get_nth_weekday_of_month(current_date)
        
        elif self.event.monthly_pattern == 'last_weekday':
            return self._get_last_weekday_of_month(current_date)
        
        return current_date + relativedelta(months=self.event.recurrence_interval)
    
    def _get_nth_weekday_of_month(self, current_date):
        start_date = self.event.start_datetime
        weekday = start_date.weekday()
        
        week_of_month = (start_date.day - 1) // 7 + 1
        
        next_month = current_date + relativedelta(months=self.event.recurrence_interval)
        first_day = next_month.replace(day=1)
        
        first_weekday = first_day.weekday()
        days_to_target = (weekday - first_weekday) % 7
        target_date = first_day + timedelta(days=days_to_target + (week_of_month - 1) * 7)
        
        if target_date.month != next_month.month:
            target_date -= timedelta(days=7)
        
        return target_date.replace(
            hour=start_date.hour,
            minute=start_date.minute,
            second=start_date.second,
            microsecond=start_date.microsecond
        )
    
    def _get_last_weekday_of_month(self, current_date):
        start_date = self.event.start_datetime
        weekday = start_date.weekday()
        
        next_month = current_date + relativedelta(months=self.event.recurrence_interval)
        last_day = calendar.monthrange(next_month.year, next_month.month)[1]
        last_date = next_month.replace(day=last_day)
        
        days_back = (last_date.weekday() - weekday) % 7
        target_date = last_date - timedelta(days=days_back)
        
        return target_date.replace(
            hour=start_date.hour,
            minute=start_date.minute,
            second=start_date.second,
            microsecond=start_date.microsecond
        )
    
    def _find_next_occurrence_after(self, target_date):
        current = self.event.start_datetime
        while current.date() < target_date:
            current = self._get_next_occurrence(current)
            if not current:
                break
        return current
