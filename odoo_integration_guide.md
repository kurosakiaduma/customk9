# Odoo Integration Guide for CustomK9

This guide details how to implement customer/admin separation using standard Odoo models.

## Model Mapping

We'll use these standard Odoo models:

1. `res.partner` - For both owners and dogs (using contact types)
2. `product.template` - For training services/packages
3. `sale.order` - For training bookings
4. `calendar.event` - For training sessions

## Authentication & User Management

### Customer Portal Login
```http
POST /web/session/authenticate
Content-Type: application/json

{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
        "db": "Merican",
        "login": "customer@email.com",
        "password": "password"
    }
}
```

### Create Portal User (Two-Step Process)

1. First, create a partner:
```http
POST /web/dataset/call_kw/res.partner/create
Content-Type: application/json

{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
        "model": "res.partner",
        "method": "create",
        "args": [{
            "name": "Customer Name",
            "email": "customer@email.com",
            "phone": "+1234567890"
        }],
        "kwargs": {}
    }
}
```

2. Then convert partner to portal user:
```http
POST /web/dataset/call_kw/res.partner/action_portal_ensure_user
Content-Type: application/json

{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
        "model": "res.partner",
        "method": "action_portal_ensure_user",
        "args": [[partner_id]],
        "kwargs": {}
    }
}
```

### List Partner's Dogs (Child Contacts)
```http
POST /web/dataset/call_kw/res.partner/search_read
Content-Type: application/json

{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
        "model": "res.partner",
        "method": "search_read",
        "args": [[["parent_id", "=", partner_id], ["function", "=", "Dog"]]],
        "kwargs": {
            "fields": ["name", "comment", "date_of_birth", "function"]
        }
    }
}
```

### Create Dog Profile (as Child Contact)
```http
POST /web/dataset/call_kw/res.partner/create
Content-Type: application/json

{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
        "model": "res.partner",
        "method": "create",
        "args": [{
            "name": "Dog Name",
            "parent_id": owner_partner_id,
            "function": "Dog",
            "comment": "Breed: German Shepherd\nAge: 2 years\nTraining Level: Beginner",
            "type": "contact"
        }],
        "kwargs": {}
    }
}
```

### Book Training Session
```http
POST /web/dataset/call_kw/calendar.event/create
Content-Type: application/json

{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
        "model": "calendar.event",
        "method": "create",
        "args": [{
            "name": "Training Session - [Dog Name]",
            "start": "2024-03-20 10:00:00",
            "stop": "2024-03-20 11:00:00",
            "partner_ids": [trainer_partner_id, dog_partner_id, owner_partner_id]
        }],
        "kwargs": {}
    }
}
```

### List Training Sessions
```http
POST /web/dataset/call_kw/calendar.event/search_read
Content-Type: application/json

{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
        "model": "calendar.event",
        "method": "search_read",
        "args": [[["partner_ids", "in", partner_id]]],
        "kwargs": {
            "fields": ["name", "start", "stop", "partner_ids", "state"]
        }
    }
}
```

## Security Notes

1. Portal users automatically have restricted access to their own data
2. The standard Odoo record rules ensure users only see their own records
3. Calendar events are automatically filtered by participant
4. Child contacts (dogs) are automatically associated with the owner

## Implementation Notes

1. Use the standard `res.partner` model for both owners and dogs
   - Set `function` field to "Dog" for dog profiles
   - Use `parent_id` to link dogs to owners
   - Store dog details in the `comment` field

2. Use `calendar.event` for training sessions
   - Add both owner and dog as attendees
   - Use standard calendar features for scheduling

3. Use `product.template` for training packages
   - Create products for different training services
   - Use standard pricing and inventory features

4. Use `sale.order` for bookings
   - Create sales orders for training packages
   - Link to calendar events for scheduling

## Training Services/Packages (using product.template)

#### List Available Training Services
```http
POST /web/dataset/call_kw/product.template/search_read
Content-Type: application/json

{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
        "model": "product.template",
        "method": "search_read",
        "args": [],
        "kwargs": {
            "domain": [["categ_id.name", "=", "Dog Training"]],
            "fields": ["name", "list_price", "description", "description_sale"]
        }
    }
}
```

### Book Training Package (using sale.order)

```http
POST /web/dataset/call_kw/sale.order/create
Content-Type: application/json

{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
        "model": "sale.order",
        "method": "create",
        "args": [{
            "partner_id": owner_partner_id,
            "order_line": [[0, 0, {
                "product_id": training_product_id,
                "product_uom_qty": 1
            }]]
        }]
    }
}
```

## Advantages of This Approach

1. No custom models needed
2. Uses Odoo's tested and stable features
3. Automatic portal access management
4. Standard API endpoints
5. Built-in calendar integration
6. Ready-to-use sales/invoicing flow