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

## Setup and Installation

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 16+ and npm (for frontend)
- PostgreSQL (or use Docker)
- Git

### Option 1: Docker Setup (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd 360challenge
```

2. Start the application with Docker:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- PostgreSQL: localhost:5432

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database (PostgreSQL)
# Create database 'event_scheduler' in PostgreSQL
# Update DATABASES in settings.py if needed

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Environment Variables

Create `.env` files for configuration:

**Backend (.env in backend/ directory):**
```
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/event_scheduler
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Frontend (.env in frontend/ directory):**
```
REACT_APP_API_URL=http://localhost:8000
```

### First Time Setup

1. Access the frontend at http://localhost:3000
2. Create a user account by clicking "Register"
3. Start creating events with various recurrence patterns
4. View your events in the calendar or list view

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

## Architectural Decisions

### Backend Architecture

**Django 5 + Django REST Framework**
- **Decision**: Use Django as the backend framework
- **Rationale**:
  - Mature ecosystem with excellent ORM for complex data relationships
  - Built-in admin interface for debugging and data management
  - DRF provides robust API serialization and authentication
  - Strong security features out of the box
- **Trade-offs**: Slightly heavier than FastAPI, but provides more built-in functionality

**Database Design**
- **Decision**: Single Event model with recurrence fields vs separate RecurrenceRule model
- **Rationale**: Simpler queries and better performance for most use cases
- **Implementation**: Event model contains all recurrence information as fields
- **Trade-offs**: Some data duplication, but avoids complex joins

**Recurrence Engine**
- **Decision**: Custom Python recurrence generator vs external library (rrule)
- **Rationale**:
  - Full control over recurrence logic
  - Easier to customize for specific requirements
  - No external dependencies for core functionality
- **Implementation**: `RecurrenceGenerator` class with pattern-specific methods
- **Trade-offs**: More code to maintain, but better suited to requirements

### Frontend Architecture

**React 18 + TypeScript**
- **Decision**: React with TypeScript vs Vue.js or Angular
- **Rationale**:
  - Large ecosystem and community support
  - TypeScript provides compile-time type checking
  - Component-based architecture fits well with event management UI
  - Excellent tooling and development experience
- **Trade-offs**: Steeper learning curve, but better long-term maintainability

**State Management**
- **Decision**: React Context + useState vs Redux/Zustand
- **Rationale**:
  - Application state is relatively simple
  - Context API sufficient for authentication and basic state
  - Avoids additional complexity and dependencies
- **Trade-offs**: May need refactoring if state becomes more complex

**Styling Approach**
- **Decision**: CSS-in-JS (styled-components) vs CSS Modules vs Tailwind
- **Rationale**:
  - Custom CSS for full design control
  - Consistent with existing codebase patterns
  - No additional build dependencies
- **Trade-offs**: More CSS to write, but better performance and control

### Authentication & Security

**JWT with Refresh Tokens**
- **Decision**: JWT vs Session-based authentication
- **Rationale**:
  - Stateless authentication suitable for API-first architecture
  - Refresh tokens provide security with convenience
  - Easy to scale across multiple servers
- **Implementation**: Access tokens (15 min) + Refresh tokens (7 days)
- **Trade-offs**: More complex token management, but better scalability

**CORS Configuration**
- **Decision**: Explicit CORS setup vs proxy
- **Rationale**: Clear separation between frontend and backend
- **Implementation**: Django CORS middleware with specific origins
- **Trade-offs**: Additional configuration, but better for production deployment

### Development & Deployment

**Docker Containerization**
- **Decision**: Docker Compose for development vs native setup
- **Rationale**:
  - Consistent development environment across team
  - Easy database setup with PostgreSQL
  - Simplified deployment process
- **Trade-offs**: Additional Docker knowledge required, but better consistency

**Database Choice: PostgreSQL**
- **Decision**: PostgreSQL vs MySQL vs SQLite
- **Rationale**:
  - ACID compliance for data integrity
  - JSON field support for flexible data storage
  - Excellent performance with complex queries
  - Production-ready with good Django support
- **Trade-offs**: More complex setup than SQLite, but better for production

## Shortcuts and Technical Debt

### Known Shortcuts

1. **Error Handling**
   - Limited error boundary implementation in React
   - Basic error messages without detailed user guidance
   - **Impact**: Poor user experience on errors
   - **Future**: Implement comprehensive error boundaries and user-friendly messages

2. **Testing Coverage**
   - Limited unit tests for complex recurrence logic
   - No integration tests for API endpoints
   - No end-to-end tests for user workflows
   - **Impact**: Potential bugs in production
   - **Future**: Add comprehensive test suite with >80% coverage

3. **Performance Optimization**
   - No caching for recurring event calculations
   - No pagination for large event lists
   - No lazy loading for calendar views
   - **Impact**: Slow performance with many events
   - **Future**: Implement Redis caching and pagination

4. **Security Hardening**
   - Basic CORS configuration
   - No rate limiting on API endpoints
   - No input sanitization beyond Django defaults
   - **Impact**: Potential security vulnerabilities
   - **Future**: Add rate limiting, input validation, and security headers

5. **Mobile Responsiveness**
   - Desktop-first design with basic mobile support
   - Calendar view not optimized for mobile
   - **Impact**: Poor mobile user experience
   - **Future**: Implement mobile-first responsive design

6. **Data Validation**
   - Basic form validation without advanced rules
   - No server-side validation for complex recurrence patterns
   - **Impact**: Potential data inconsistencies
   - **Future**: Add comprehensive validation rules

### Technical Debt

1. **Code Organization**
   - Some large components that could be split
   - Repeated styling patterns that could be abstracted
   - **Refactoring needed**: Extract reusable components and styles

2. **API Design**
   - Inconsistent response formats across endpoints
   - No API versioning strategy
   - **Refactoring needed**: Standardize API responses and add versioning

3. **Configuration Management**
   - Hardcoded configuration values in some places
   - No environment-specific configuration files
   - **Refactoring needed**: Centralize configuration management

### Assumptions Made

1. **User Behavior**
   - Users will primarily create events for the current/future dates
   - Most users will have < 1000 events
   - Events are personal (no sharing/collaboration required initially)

2. **Technical Constraints**
   - Single timezone support (UTC) is sufficient initially
   - English language only
   - Desktop-primary usage pattern

3. **Business Logic**
   - Events can be edited/deleted without complex approval workflows
   - No payment or booking system integration required
   - Simple category system is sufficient for organization

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

## Running the Application

### Development Mode

**Backend:**
```bash
cd backend
source venv/bin/activate  # If using virtual environment
python manage.py runserver
# Server runs on http://localhost:8000
```

**Frontend:**
```bash
cd frontend
npm start
# Server runs on http://localhost:3000
```

### Production Mode

**Using Docker:**
```bash
docker-compose -f docker-compose.prod.yml up --build
```

**Manual Production Setup:**
```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py collectstatic
gunicorn event_scheduler.wsgi:application

# Frontend
cd frontend
npm run build
# Serve build/ directory with nginx or similar
```

## Testing

### Backend Tests
```bash
cd backend
source venv/bin/activate

# Run all tests
python manage.py test

# Run specific app tests
python manage.py test events
python manage.py test authentication

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Generates htmlcov/ directory
```

### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- EventForm.test.tsx
```

### API Testing
```bash
# Test authentication endpoints
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123","first_name":"Test","last_name":"User"}'

curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'

# Test events endpoints (requires authentication token)
curl -X GET http://localhost:8000/api/events/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
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
