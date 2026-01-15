# Xtrema - Fully Connected Frontend + Backend

A complete waste management and recycling tracking system with frontend HTML/CSS/JS and Django REST backend.

## Features

✅ **User Authentication** - Login/Register with email and password stored in CSV  
✅ **Pickup Scheduling** - Book pickups with automatic CSV export  
✅ **Points System** - Earn points based on waste contribution  
✅ **Data Export** - Automatic CSV export for both login and pickup data  
✅ **Responsive Design** - Mobile-friendly frontend  
✅ **REST API** - Full backend API with Django REST Framework  

## Project Structure

```
xtrema_backend/
├── frontend/
│   ├── index.html
│   ├── login.html          # Login page (email/password)
│   ├── upload.html         # Image upload page
│   ├── report.html         # Waste analysis report
│   ├── pickup.html         # Pickup scheduling
│   ├── profile.html        # User profile
│   ├── points.html         # Points display
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js         # All frontend logic + API calls
│   └── assets/
│       └── xtrema-logo.png
├── pickup/
│   ├── models.py           # UserLogin + PickupRequest models
│   ├── views.py            # API endpoints (login, pickup)
│   ├── serializers.py      # REST serializers
│   ├── urls.py             # URL routing
│   └── utils.py            # CSV export functions
├── xtrema_backend/
│   ├── settings.py         # CORS enabled
│   ├── urls.py
│   └── wsgi.py
├── manage.py
└── db.sqlite3
```

## Setup & Installation

### Backend Setup

1. **Install dependencies:**
```bash
pip install django djangorestframework django-cors-headers
```

2. **Apply migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

3. **Run Django server:**
```bash
python manage.py runserver
```
Server runs at: `http://127.0.0.1:8000`

### Frontend Setup

1. Open `frontend/login.html` in a browser or serve with a local server:
```bash
python -m http.server 8001 --directory frontend
```
Frontend runs at: `http://localhost:8001/login.html`

## API Endpoints

### 1. User Login/Register
**POST** `/api/login/`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "status": "success",
  "message": "Login successful",
  "user_id": 1,
  "email": "user@example.com"
}
```

Exports login data to: `login_data.csv`

### 2. Schedule Pickup
**POST** `/api/pickup/`

Request:
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "address": "123 Main St",
  "pincode": "560001",
  "pickup_date": "2026-01-15",
  "plastic_kg": 3,
  "metal_kg": 1,
  "glass_kg": 0.5,
  "wood_kg": 0.2,
  "trash_kg": 0.3
}
```

Response:
```json
{
  "status": "success",
  "points": 60,
  "message": "Pickup scheduled successfully"
}
```

Exports pickup data to: `pickup_data.csv`

## Data Files Generated

### login_data.csv
```
Email,Created At
user@example.com,2026-01-09 10:30:45
another@example.com,2026-01-09 11:15:20
```

### pickup_data.csv
```
Name,Phone,Address,Pincode,Pickup Date,Plastic,Metal,Glass,Wood,Trash,Points,Created At
John Doe,9876543210,123 Main St,560001,2026-01-15,3.0,1.0,0.5,0.2,0.3,60,2026-01-09 12:00:00
```

## User Flow

1. **Login Page** → User enters email/password
2. **Upload Page** → User uploads waste images
3. **Report Page** → Shows waste breakdown
4. **Pickup Page** → Schedule pickup with address details
5. **Success Modal** → Confirmation popup
6. **Points Page** → Display earned points
7. **Profile Page** → View user details

## Features Breakdown

### Login System
- Sign up/Sign in with email
- Passwords stored in database (plain text for demo - hash in production)
- Automatic CSV export after each login
- Data stored in `UserLogin` model

### Pickup Booking
- Fill pickup details (name, phone, address, pincode, date)
- Automatic points calculation (plastic_kg × 20)
- Data validation before submission
- CSV export on successful booking
- Success popup with confirmation

### Data Storage
- SQLite database (production: PostgreSQL)
- Automatic CSV exports in project root
- Both endpoints auto-trigger exports

## CORS Configuration

Backend is configured to accept requests from any origin:
```python
CORS_ALLOWED_ORIGINS = ["*"]
```

## Notes

- **Passwords**: Currently stored plain text (hash with `werkzeug.security` or Django's hashing in production)
- **CSRF**: CORS middleware enabled, CSRF tokens can be added if needed
- **Image Upload**: Currently stubbed; integrate Google Vision API for waste classification
- **Authentication**: Add JWT tokens for stateless auth
- **Email**: Add email verification for registered users

## Testing the Flow

1. Navigate to login.html
2. Enter email: `test@example.com` and password: `password123`
3. Upload page loads
4. Generate Report (generates static data)
5. Click "Pick up" → Pickup page
6. Fill details and click "Scheduled Pick up"
7. Modal appears → Click "OK" → Profile page with points

Both `login_data.csv` and `pickup_data.csv` files are created in the project root after each action.

## Future Enhancements

- Integrate Google Vision API for image analysis
- Add JWT authentication
- Implement email verification
- Add payment gateway integration
- Mobile app version
- Admin dashboard for analytics
