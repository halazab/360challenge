# Event Scheduler with Complex Recurrence

A full-stack web application for creating, viewing, editing, and deleting calendar events with complex recurrence patterns.

## Features

### Core Functionality
- **User Authentication**: Register, login, logout with JWT tokens
- **Event Management**: Create, read, update, delete events
- **Complex Recurrence Patterns**:
  - Single occurrence events
  - Daily, weekly, monthly, yearly recurrence
  - Custom intervals (every N days/weeks/months/years)
  - Weekday selection for weekly events
  - Monthly patterns: same date, same weekday, last weekday of month
  - Recurrence end conditions: never, end date, or occurrence count

### User Interface
- **Dashboard**: Overview with upcoming events and quick actions
- **Calendar View**: Monthly calendar displaying all events
- **List View**: Detailed list of all events with recurrence information
- **Event Forms**: Comprehensive forms for creating/editing events with recurrence options

### Technical Features
- **Backend**: Django 5 + Django REST Framework
- **Frontend**: React 18 + TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT with refresh tokens
- **Containerization**: Docker Compose for easy deployment

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Running the Application

1. Clone the repository:
```bash
git clone <repository-url>
cd 360challenge
```

2. Start the application:
```bash
docker-compose up
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

The application will automatically:
- Set up the PostgreSQL database
- Run Django migrations
- Start both backend and frontend servers

### First Time Setup

1. Create a user account by clicking "Register" on the login page
2. Start creating events with various recurrence patterns
3. View your events in the calendar or list view

## User Stories Implemented

### Authentication (US-11, US-12, US-13)
- ✅ User registration with username, email, password
- ✅ User login with username/password
- ✅ User logout with token invalidation

### Event Creation (US-01 through US-05)
- ✅ **US-01**: Single occurrence events
- ✅ **US-02**: Standard recurrence (daily, weekly, monthly, yearly)
- ✅ **US-03**: Interval patterns (every N-th day/week/month)
- ✅ **US-04**: Weekday selection for weekly events
- ✅ **US-05**: Relative-date patterns (e.g., second Friday of each month, last weekday)

### Event Viewing (US-06, US-07)
- ✅ **US-06**: Calendar view showing events in monthly grid
- ✅ **US-07**: List view showing all events with details

### Event Management (US-08, US-09)
- ✅ **US-08**: Edit existing events and their recurrence patterns
- ✅ **US-09**: Delete events (with confirmation)

### Form Validation (US-10)
- ✅ **US-10**: Comprehensive form validation with error messages

## Architecture

### Backend Structure
```
backend/
├── event_scheduler/          # Django project settings
├── events/                   # Events app
│   ├── models.py            # Event model with recurrence fields
│   ├── serializers.py       # DRF serializers
│   ├── views.py             # API views
│   ├── recurrence.py        # Recurrence logic engine
│   └── urls.py              # Event API routes
├── authentication/          # Authentication app
│   ├── views.py             # Auth API views
│   └── urls.py              # Auth API routes
└── requirements.txt         # Python dependencies
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/            # Login/Register components
│   │   ├── Dashboard/       # Dashboard component
│   │   ├── Events/          # Event-related components
│   │   └── Layout/          # Navigation and layout
│   ├── context/             # React context for auth
│   ├── services/            # API client
│   └── types/               # TypeScript interfaces
└── package.json             # Node.js dependencies
```

### Key Components

#### Recurrence Engine
The `RecurrenceGenerator` class handles complex recurrence patterns:
- Calculates event occurrences based on recurrence rules
- Supports all standard patterns plus complex ones like "last Friday of each month"
- Efficiently generates occurrences for date ranges
- Handles edge cases like month-end dates and leap years

#### Event Model
Comprehensive event model supporting:
- Basic event information (title, description, start/end times)
- Recurrence type and interval
- Weekday selection for weekly events
- Monthly pattern specification
- End conditions (date or count)

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile

### Events
- `GET /api/events/` - List user's events
- `POST /api/events/` - Create new event
- `GET /api/events/{id}/` - Get specific event
- `PUT/PATCH /api/events/{id}/` - Update event
- `DELETE /api/events/{id}/` - Delete event
- `GET /api/events/calendar/?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Get calendar events
- `GET /api/events/upcoming/?limit=N` - Get upcoming events

## Technology Choices

### Backend: Django 5 + Django REST Framework
- **Pros**: Mature, well-documented, excellent ORM, built-in admin
- **Cons**: Can be heavyweight for simple APIs
- **Why chosen**: Rapid development, excellent for complex data models, strong ecosystem

### Frontend: React 18 + TypeScript
- **Pros**: Component-based, large ecosystem, TypeScript for type safety
- **Cons**: Learning curve, build complexity
- **Why chosen**: Modern, maintainable, excellent for complex UIs

### Database: PostgreSQL
- **Pros**: ACID compliance, JSON support, excellent performance
- **Cons**: More complex than SQLite
- **Why chosen**: Production-ready, supports complex queries, JSON fields for recurrence data

## Development

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Running Tests
```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm test
```

## Future Enhancements

- Event notifications and reminders
- Calendar sharing and collaboration
- Import/export functionality (iCal, Google Calendar)
- Time zone support
- Event categories and tags
- Advanced search and filtering
- Mobile responsive design improvements
- Real-time updates with WebSockets

## License

This project is created for the 360 Coding Challenge and is intended for evaluation purposes.
