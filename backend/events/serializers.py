from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event, Category


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'color', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class EventSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'user', 'category', 'title', 'description', 'start_datetime', 'end_datetime',
            'recurrence_type', 'recurrence_interval', 'recurrence_end_date',
            'recurrence_count', 'weekdays', 'monthly_pattern', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def validate(self, data):
        if data['end_datetime'] <= data['start_datetime']:
            raise serializers.ValidationError("End time must be after start time")
        
        if data.get('recurrence_type') != 'none':
            if not data.get('recurrence_end_date') and not data.get('recurrence_count'):
                raise serializers.ValidationError(
                    "Recurring events must have either an end date or occurrence count"
                )
        
        return data
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'category', 'title', 'description', 'start_datetime', 'end_datetime',
            'recurrence_type', 'recurrence_interval', 'recurrence_end_date',
            'recurrence_count', 'weekdays', 'monthly_pattern'
        ]
    
    def validate(self, data):
        if data['end_datetime'] <= data['start_datetime']:
            raise serializers.ValidationError("End time must be after start time")
        
        if data.get('recurrence_type') != 'none':
            if not data.get('recurrence_end_date') and not data.get('recurrence_count'):
                raise serializers.ValidationError(
                    "Recurring events must have either an end date or occurrence count"
                )
        
        return data
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return Event.objects.create(**validated_data)


class EventUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'title', 'description', 'start_datetime', 'end_datetime',
            'recurrence_type', 'recurrence_interval', 'recurrence_end_date', 
            'recurrence_count', 'weekdays', 'monthly_pattern'
        ]
    
    def validate(self, data):
        if data['end_datetime'] <= data['start_datetime']:
            raise serializers.ValidationError("End time must be after start time")
        
        if data.get('recurrence_type') != 'none':
            if not data.get('recurrence_end_date') and not data.get('recurrence_count'):
                raise serializers.ValidationError(
                    "Recurring events must have either an end date or occurrence count"
                )
        
        return data
