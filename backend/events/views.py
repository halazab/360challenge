from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from datetime import datetime, date, timedelta
from .models import Event, Category
from .serializers import EventSerializer, EventCreateSerializer, EventUpdateSerializer, CategorySerializer
from .recurrence import RecurrenceGenerator


class EventListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EventCreateSerializer
        return EventSerializer

    def get_queryset(self):
        return Event.objects.filter(user=self.request.user)


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return EventUpdateSerializer
        return EventSerializer

    def get_queryset(self):
        return Event.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calendar_events(request):
    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')

    if not start_date_str or not end_date_str:
        return Response(
            {'error': 'start_date and end_date parameters are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        start_date = parse_date(start_date_str)
        end_date = parse_date(end_date_str)
    except ValueError:
        return Response(
            {'error': 'Invalid date format. Use YYYY-MM-DD'},
            status=status.HTTP_400_BAD_REQUEST
        )

    events = Event.objects.filter(user=request.user)
    all_occurrences = []

    for event in events:
        if event.recurrence_type == 'none':
            if start_date <= event.start_datetime.date() <= end_date:
                all_occurrences.append({
                    'id': event.id,
                    'event_id': event.id,
                    'title': event.title,
                    'description': event.description,
                    'start_datetime': event.start_datetime,
                    'end_datetime': event.end_datetime,
                    'is_recurring': False,
                    'occurrence_index': 0
                })
        else:
            generator = RecurrenceGenerator(event)
            occurrences = generator.generate_occurrences(start_date, end_date)
            all_occurrences.extend(occurrences)

    all_occurrences.sort(key=lambda x: x['start_datetime'])

    return Response(all_occurrences)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upcoming_events(request):
    limit = int(request.GET.get('limit', 10))
    today = date.today()
    end_date = today + timedelta(days=30)

    events = Event.objects.filter(user=request.user)
    all_occurrences = []

    for event in events:
        if event.recurrence_type == 'none':
            if event.start_datetime.date() >= today:
                all_occurrences.append({
                    'id': event.id,
                    'event_id': event.id,
                    'title': event.title,
                    'description': event.description,
                    'start_datetime': event.start_datetime,
                    'end_datetime': event.end_datetime,
                    'is_recurring': False,
                    'occurrence_index': 0
                })
        else:
            generator = RecurrenceGenerator(event)
            occurrences = generator.generate_occurrences(today, end_date, limit)
            all_occurrences.extend(occurrences)

    all_occurrences.sort(key=lambda x: x['start_datetime'])

    return Response(all_occurrences[:limit])


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
