from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from datetime import datetime, timedelta
import json


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#007bff')  # Hex color code
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Event(models.Model):
    RECURRENCE_TYPES = [
        ('none', 'No Recurrence'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
        ('custom', 'Custom Pattern'),
    ]

    WEEKDAYS = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()

    recurrence_type = models.CharField(max_length=20, choices=RECURRENCE_TYPES, default='none')
    recurrence_interval = models.PositiveIntegerField(default=1)
    recurrence_end_date = models.DateField(null=True, blank=True)
    recurrence_count = models.PositiveIntegerField(null=True, blank=True)

    weekdays = models.JSONField(default=list, blank=True)

    monthly_pattern = models.CharField(max_length=20, choices=[
        ('date', 'Same Date Each Month'),
        ('weekday', 'Same Weekday Each Month'),
        ('last_weekday', 'Last Weekday of Month'),
    ], default='date', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_datetime']

    def __str__(self):
        return f"{self.title} - {self.start_datetime}"

    def clean(self):
        if self.end_datetime <= self.start_datetime:
            raise ValidationError("End time must be after start time")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
