# Odoo API Integration Guide for CustomK9 Client Area

## Authentication & User Management

### 1. User Login
```http
POST /web/session/authenticate
Content-Type: application/json

{
    "jsonrpc": "2.0",
    "params": {
        "db": "your_database_name",
        "login": "user@email.com",
        "password": "userpassword"
    }
}
```

### 2. User Registration
```http
POST /api/v1/res.partner
Content-Type: application/json
X-API-Key: your_api_key

{
    "data": {
        "type": "res.partner",
        "attributes": {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "1234567890",
            "customer_rank": 1
        }
    }
}
```

Then create user account:
```http
POST /api/v1/res.users
Content-Type: application/json
X-API-Key: your_api_key

{
    "data": {
        "type": "res.users",
        "attributes": {
            "login": "john@example.com",
            "password": "securepassword",
            "partner_id": "PARTNER_ID_FROM_PREVIOUS_RESPONSE"
        }
    }
}
```

## Dog Profile Management

### 1. Create Dog Profile
```http
POST /api/v1/customk9.dog
Content-Type: application/json
X-API-Key: your_api_key

{
    "data": {
        "type": "customk9.dog",
        "attributes": {
            "name": "Max",
            "breed": "German Shepherd",
            "age": 3,
            "owner_id": USER_PARTNER_ID,
            "training_level": "beginner",
            "notes": "Friendly with other dogs"
        }
    }
}
```

### 2. Update Dog Profile
```http
PATCH /api/v1/customk9.dog/DOG_ID
Content-Type: application/json
X-API-Key: your_api_key

{
    "data": {
        "type": "customk9.dog",
        "id": "DOG_ID",
        "attributes": {
            "training_level": "intermediate",
            "notes": "Updated training notes"
        }
    }
}
```

### 3. List Dogs for User
```http
GET /api/v1/customk9.dog?filter=[("owner_id","=",USER_PARTNER_ID)]
Content-Type: application/json
X-API-Key: your_api_key
```

## Training Plans

### 1. Create Training Plan
```http
POST /api/v1/customk9.training.plan
Content-Type: application/json
X-API-Key: your_api_key

{
    "data": {
        "type": "customk9.training.plan",
        "attributes": {
            "name": "Basic Obedience",
            "dog_id": DOG_ID,
            "start_date": "2024-03-15",
            "end_date": "2024-04-15",
            "objectives": "Master basic commands"
        },
        "relationships": {
            "exercises": {
                "data": [
                    {
                        "type": "customk9.training.exercise",
                        "attributes": {
                            "name": "Sit Command",
                            "description": "Train dog to sit on command",
                            "completed": false
                        }
                    }
                ]
            }
        }
    }
}
```

### 2. Update Training Progress
```http
PATCH /api/v1/customk9.training.exercise/EXERCISE_ID
Content-Type: application/json
X-API-Key: your_api_key

{
    "data": {
        "type": "customk9.training.exercise",
        "id": "EXERCISE_ID",
        "attributes": {
            "completed": true,
            "completion_date": "2024-03-20"
        }
    }
}
```

### 3. Get Training Plan Progress
```http
GET /api/v1/customk9.training.plan/PLAN_ID?include=exercises
Content-Type: application/json
X-API-Key: your_api_key
```

## Calendar & Appointments

### 1. Create Appointment
```http
POST /api/v1/calendar.event
Content-Type: application/json
X-API-Key: your_api_key

{
    "data": {
        "type": "calendar.event",
        "attributes": {
            "name": "Training Session",
            "start": "2024-03-20 14:00:00",
            "stop": "2024-03-20 15:00:00",
            "partner_ids": [CLIENT_PARTNER_ID, TRAINER_PARTNER_ID],
            "description": "Basic obedience training session"
        }
    }
}
```

### 2. List Upcoming Appointments
```http
GET /api/v1/calendar.event?filter=[("start",">","2024-03-15"),("partner_ids","in",[USER_PARTNER_ID])]&sort=start
Content-Type: application/json
X-API-Key: your_api_key
```

### 3. Update Appointment
```http
PATCH /api/v1/calendar.event/EVENT_ID
Content-Type: application/json
X-API-Key: your_api_key

{
    "data": {
        "type": "calendar.event",
        "id": "EVENT_ID",
        "attributes": {
            "start": "2024-03-20 15:00:00",
            "stop": "2024-03-20 16:00:00"
        }
    }
}
```

## Progress Tracking

### 1. Create Progress Note
```http
POST /api/v1/customk9.progress.note
Content-Type: application/json
X-API-Key: your_api_key

{
    "data": {
        "type": "customk9.progress.note",
        "attributes": {
            "dog_id": DOG_ID,
            "date": "2024-03-15",
            "note": "Excellent progress with sit command",
            "rating": 5
        }
    }
}
```

### 2. Get Progress History
```http
GET /api/v1/customk9.progress.note?filter=[("dog_id","=",DOG_ID)]&sort=-date
Content-Type: application/json
X-API-Key: your_api_key
```

## Billing & Payments

### 1. Create Invoice
```http
POST /api/v1/account.move
Content-Type: application/json
X-API-Key: your_api_key

{
    "data": {
        "type": "account.move",
        "attributes": {
            "partner_id": CLIENT_PARTNER_ID,
            "move_type": "out_invoice",
            "invoice_line_ids": [
                {
                    "product_id": TRAINING_SERVICE_PRODUCT_ID,
                    "quantity": 1,
                    "price_unit": 100.00,
                    "name": "Training Session - Basic Obedience"
                }
            ]
        }
    }
}
```

### 2. Get Invoice List
```http
GET /api/v1/account.move?filter=[("partner_id","=",CLIENT_PARTNER_ID),("move_type","=","out_invoice")]
Content-Type: application/json
X-API-Key: your_api_key
```

## User Settings

### 1. Update User Preferences
```http
PATCH /api/v1/res.users/USER_ID
Content-Type: application/json
X-API-Key: your_api_key

{
    "data": {
        "type": "res.users",
        "id": "USER_ID",
        "attributes": {
            "lang": "en_US",
            "tz": "America/New_York",
            "notification_type": "email"
        }
    }
}
```

### 2. Get User Settings
```http
GET /api/v1/res.users/USER_ID?fields=lang,tz,notification_type
Content-Type: application/json
X-API-Key: your_api_key
```

## Documents & Files

### 1. Upload Training Document
```http
POST /api/v1/ir.attachment
Content-Type: multipart/form-data
X-API-Key: your_api_key

{
    "data": {
        "type": "ir.attachment",
        "attributes": {
            "name": "training_guide.pdf",
            "res_model": "customk9.dog",
            "res_id": DOG_ID,
            "datas": BASE64_ENCODED_FILE,
            "mimetype": "application/pdf"
        }
    }
}
```

### 2. Get Documents List
```http
GET /api/v1/ir.attachment?filter=[("res_model","=","customk9.dog"),("res_id","=",DOG_ID)]
Content-Type: application/json
X-API-Key: your_api_key
```

## Error Responses

All endpoints may return the following error structures:

### Authentication Error
```json
{
    "error": {
        "code": 401,
        "message": "Authentication failed"
    }
}
```

### Validation Error
```json
{
    "error": {
        "code": 400,
        "message": "Validation error",
        "details": {
            "field": "error description"
        }
    }
}
```

### Server Error
```json
{
    "error": {
        "code": 500,
        "message": "Internal server error"
    }
}
``` 