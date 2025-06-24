# Odoo Calendar API Integration Guide

This guide provides working examples of interacting with the Odoo Calendar API for the CustomK9 application.

## Authentication Flow

First, authenticate with Odoo to get a session cookie:

```bash
curl -X POST "https://erp.vuna.io/web/session/authenticate" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "db": "Merican",
      "login": "sales@mericanltd.com",
      "password": "Qwerty@254"
    }
  }' \
  -c cookies.txt
```

## Calendar Operations

### 1. List Calendar Events

#### List Individual Training Events

```bash
curl -X POST "https://erp.vuna.io/web/dataset/call_kw" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "model": "calendar.event",
      "method": "search_read",
      "args": [],
      "kwargs": {
        "fields": ["id", "name", "start", "stop", "allday", "attendee_ids", "partner_ids"],
        "domain": [
          ["start", ">=", "2024-03-01"],
          ["start", "<=", "2024-03-31"],
          ["categ_ids", "in", [1]],
          ["name", "ilike", "Individual Training"]
        ]
      }
    }
  }'
```

#### List Group Training Events

```bash
curl -X POST "https://erp.vuna.io/web/dataset/call_kw" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "model": "calendar.event",
      "method": "search_read",
      "args": [],
      "kwargs": {
        "fields": ["id", "name", "start", "stop", "allday", "attendee_ids", "partner_ids"],
        "domain": [
          ["start", ">=", "2024-03-01"],
          ["start", "<=", "2024-03-31"],
          ["categ_ids", "in", [2]],
          ["name", "ilike", "Group Training"]
        ]
      }
    }
  }'
```

### 2. Create Calendar Event

#### Create Individual Training Session

```bash
curl -X POST "https://erp.vuna.io/web/dataset/call_kw" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "model": "calendar.event",
      "method": "create",
      "args": [{
        "name": "Individual Training - Basic Obedience",
        "start": "2024-03-28 14:00:00",
        "stop": "2024-03-28 15:00:00",
        "allday": false,
        "partner_ids": [[6, 0, [3]]],
        "categ_ids": [[6, 0, [1]]],
        "duration": 1.0,
        "location": "Training Room 1",
        "description": "One-on-one training session focusing on basic obedience commands"
      }],
      "kwargs": {}
    }
  }'
```

#### Create Group Training Session

```bash
curl -X POST "https://erp.vuna.io/web/dataset/call_kw" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "model": "calendar.event",
      "method": "create",
      "args": [{
        "name": "Group Training - Socialization Class",
        "start": "2024-03-28 16:00:00",
        "stop": "2024-03-28 17:30:00",
        "allday": false,
        "partner_ids": [[6, 0, [3, 4, 5, 6]]],
        "categ_ids": [[6, 0, [2]]],
        "duration": 1.5,
        "location": "Training Hall",
        "description": "Group training session focusing on dog socialization and basic commands",
        "max_attendees": 8
      }],
      "kwargs": {}
    }
  }'
```

### 3. Update Calendar Event

#### Update Individual Training

```bash
curl -X POST "https://erp.vuna.io/web/dataset/call_kw" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "model": "calendar.event",
      "method": "write",
      "args": [[EVENT_ID], {
        "name": "Individual Training - Advanced Obedience",
        "stop": "2024-03-28 15:30:00",
        "location": "Training Room 2",
        "description": "Advanced one-on-one training session"
      }],
      "kwargs": {}
    }
  }'
```

#### Update Group Training

```bash
curl -X POST "https://erp.vuna.io/web/dataset/call_kw" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "model": "calendar.event",
      "method": "write",
      "args": [[EVENT_ID], {
        "name": "Group Training - Advanced Socialization",
        "stop": "2024-03-28 18:00:00",
        "partner_ids": [[6, 0, [3, 4, 5, 6, 7]]],
        "location": "Outdoor Training Area",
        "max_attendees": 10
      }],
      "kwargs": {}
    }
  }'
```

### 4. Delete Calendar Event

The delete operation is the same for both individual and group events:

```bash
curl -X POST "https://erp.vuna.io/web/dataset/call_kw" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "model": "calendar.event",
      "method": "unlink",
      "args": [[EVENT_ID]],
      "kwargs": {}
    }
  }'
```

## Key Differences Between Individual and Group Events

1. **Category IDs**
   - Individual Training: `categ_ids": [[6, 0, [1]]]`
   - Group Training: `categ_ids": [[6, 0, [2]]]`

2. **Partner IDs**
   - Individual: Usually one trainer and one client
   - Group: Multiple participants (trainer + multiple clients)

3. **Duration**
   - Individual: Typically 1 hour
   - Group: Usually 1.5 to 2 hours

4. **Location**
   - Individual: Smaller training rooms
   - Group: Larger training halls or outdoor areas

5. **Additional Fields**
   - Group events have `max_attendees` field
   - Group events may have different pricing structure
   - Group events typically have more complex descriptions

## Important Notes

1. **Authentication**
   - Always authenticate first to get a valid session
   - Store the session cookie for subsequent requests
   - Session cookies may expire; handle re-authentication when needed

2. **Date Formats**
   - Use UTC format: "YYYY-MM-DD HH:MM:SS"
   - Server will handle timezone conversions

3. **Relationships**
   - For partner_ids and other many2many fields, use format: [[6, 0, [IDs]]]
   - 6 means "replace all"
   - Second parameter (0) is a placeholder
   - Third parameter is array of IDs

4. **Required Fields**
   - name: Event title
   - start: Start datetime
   - stop: End datetime
   - allday: Boolean for all-day events
   - partner_ids: List of attendees
   - categ_ids: Training category (1 for Individual, 2 for Group)

5. **Response Handling**
   - All responses are in JSON-RPC 2.0 format
   - Check for "error" key in response
   - Success responses include "result" key

## Common Error Codes

- 100: Authentication failed
- 101: Access rights error
- 200: Server error (check error message for details)

## Testing Flow

1. Authenticate and save session cookie
2. List existing events to verify authentication
3. Create a new event (individual or group)
4. Update the created event
5. Verify the update by listing events
6. Delete the test event
7. Verify deletion by listing events 