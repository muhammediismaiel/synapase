# API Documentation

## Base URL
```
http://localhost:3000
```

## Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

## Authentication
Protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### Login
```http
POST /admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

## Appointments

### Create Appointment
```http
POST /appointments
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St, City, State",
  "serviceType": "web",
  "appointmentDate": "2024-12-01T10:00:00.000Z"
}
```

### Get All Appointments
```http
GET /appointments?page=1&limit=10&status=pending&serviceType=web&sortBy=createdAt&sortOrder=desc
```

Query Parameters:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (pending|confirmed|completed|cancelled)
- `serviceType` (string): Filter by service type (web|network|security|cameras)
- `sortBy` (string): Sort field (createdAt|appointmentDate|name|serviceType|status)
- `sortOrder` (string): Sort order (asc|desc)

### Get Appointment by ID
```http
GET /appointments/:id
```

### Update Appointment Status
```http
PATCH /appointments/:id/status
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "confirmed"
}
```

### Delete Appointment
```http
DELETE /appointments/:id
Authorization: Bearer <token>
```

### Get Today's Appointments
```http
GET /appointments/today?page=1&limit=10
Authorization: Bearer <token>
```

### Get Upcoming Appointments
```http
GET /appointments/upcoming?page=1&limit=10
Authorization: Bearer <token>
```

### Get Statistics
```http
GET /appointments/statistics
Authorization: Bearer <token>
```

## Utility Endpoints

### Health Check
```http
GET /health
```

### API Information
```http
GET /api
```

### Admin Dashboard
```http
GET /admin/dashboard
Authorization: Bearer <token>
```

## Service Types
- `web` - Web Development
- `network` - Network Solutions
- `security` - Security Systems
- `cameras` - Surveillance Cameras

## Status Values
- `pending` - Appointment created, awaiting confirmation
- `confirmed` - Appointment confirmed by admin
- `completed` - Service completed
- `cancelled` - Appointment cancelled

## Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "errors": [ ... ]
}
```
