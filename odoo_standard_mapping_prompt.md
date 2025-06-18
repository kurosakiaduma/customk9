# CustomK9 to Odoo Standard Modules Mapping Prompt

## Context
CustomK9 is a dog training business with a custom client area. The goal is to map all client area features to standard Odoo modules for data separation between clients and admins, where clients use a custom UI and admins use the Odoo backend.

## Client Area Features

1. User Management & Authentication
   - Client portal login/registration
   - Profile management
   - Access control (client vs admin)
   
   Map to:
   - `res.users` - Standard user management
   - `res.partner` - Contact information
   - Portal user group for client access

2. Dog Profiles
   - Basic information (name, breed, age)
   - Medical history
   - Training progress
   - Behavior notes
   
   Map to:
   - `res.partner` with type="contact" and parent_id linking to owner
   - Use `function` field to identify as "Dog"
   - Store details in standard fields or `comment` field
   - Link to owner using parent/child relationship

3. Training Sessions
   - Session scheduling
   - Progress tracking
   - Attendance management
   
   Map to:
   - `calendar.event` for scheduling
   - `sale.order` for booking/payment
   - `calendar.attendee` for participants

4. Training Plans
   - Custom plans per dog
   - Progress tracking
   - Milestone management
   
   Map to:
   - `product.template` for training packages
   - `sale.order.line` for active services
   - Use product variants for different training levels

5. Client Intake Form
   - Comprehensive dog assessment
   - Medical history
   - Behavior evaluation
   
   Map to:
   - `res.partner` custom fields or comments
   - Standard CRM fields for tracking
   - Partner attachments for documents

## Data Access Rules

1. Client Access (Portal Users):
   - Can only view their own dogs
   - Can only see their own appointments
   - Can only access their own training plans
   - Use Odoo's built-in portal access rules

2. Admin Access:
   - Full access to all records
   - Manage all clients and dogs
   - Schedule and oversee all training sessions
   - Standard Odoo admin permissions

## Implementation Guidelines

1. Use Standard Models:
   - Avoid custom models where possible
   - Leverage existing Odoo functionality
   - Use standard fields before adding custom ones

2. Data Structure:
   - Dogs as contacts under owner partners
   - Training sessions as calendar events
   - Services as products
   - Bookings as sales orders

3. API Integration:
   - Use standard Odoo external API endpoints
   - Leverage existing CRUD operations
   - Maintain proper access control

## Example API Endpoints

1. Authentication:
```http
POST /web/session/authenticate
Content-Type: application/json
{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
        "db": "database_name",
        "login": "user@example.com",
        "password": "password"
    }
}
```

2. Create/Update Dog Profile:
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
            "type": "contact",
            "comment": "Breed, age, and other details"
        }],
        "kwargs": {}
    }
}
```

3. Schedule Training Session:
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
            "partner_ids": [trainer_id, dog_id, owner_id]
        }],
        "kwargs": {}
    }
}
```

## Security Considerations

1. Portal Access:
   - Use Odoo's built-in portal user group
   - Leverage record rules for data separation
   - Maintain proper parent/child relationships

2. Data Isolation:
   - Each client only sees their records
   - Dogs linked to owners via parent_id
   - Calendar events filtered by participant

3. API Security:
   - Use proper authentication
   - Validate all inputs
   - Respect access rights

## Success Criteria

1. All client area features mapped to standard Odoo models
2. Data properly separated between clients and admins
3. All functionality accessible via standard API endpoints
4. Security and access control properly maintained
5. No custom models required

## Optional Custom Model Extensions

While the core functionality can be achieved with standard models, certain business-specific features might benefit from custom models:

1. Training Progress Tracking
   ```python
   class DogTrainingProgress(models.Model):
       _name = 'dog.training.progress'
       _description = 'Dog Training Progress'
       
       partner_id = fields.Many2one('res.partner', string='Dog', domain=[('function', '=', 'Dog')])
       training_date = fields.Date('Training Date')
       skill_level = fields.Selection([
           ('beginner', 'Beginner'),
           ('intermediate', 'Intermediate'),
           ('advanced', 'Advanced')
       ])
       notes = fields.Text('Progress Notes')
       trainer_id = fields.Many2one('res.users', string='Trainer')
   ```
   
   API Access:
   ```http
   POST /web/dataset/call_kw/dog.training.progress/create
   Content-Type: application/json
   {
       "jsonrpc": "2.0",
       "method": "call",
       "params": {
           "model": "dog.training.progress",
           "method": "create",
           "args": [{
               "partner_id": dog_partner_id,
               "training_date": "2024-03-20",
               "skill_level": "intermediate",
               "notes": "Progress details..."
           }]
       }
   }
   ```

2. Behavior Assessment
   ```python
   class DogBehaviorAssessment(models.Model):
       _name = 'dog.behavior.assessment'
       _description = 'Dog Behavior Assessment'
       
       partner_id = fields.Many2one('res.partner', string='Dog', domain=[('function', '=', 'Dog')])
       assessment_date = fields.Date('Assessment Date')
       behavior_categories = fields.Selection([
           ('socialization', 'Socialization'),
           ('obedience', 'Basic Obedience'),
           ('aggression', 'Aggression Management')
       ])
       assessment_score = fields.Integer('Score')
       recommendations = fields.Text('Recommendations')
   ```

3. Training Milestones
   ```python
   class TrainingMilestone(models.Model):
       _name = 'training.milestone'
       _description = 'Training Milestone'
       
       partner_id = fields.Many2one('res.partner', string='Dog')
       milestone = fields.Char('Milestone Name')
       completed = fields.Boolean('Completed')
       completion_date = fields.Date('Completion Date')
       verified_by = fields.Many2one('res.users', string='Verified By')
   ```

## Integration with Standard Models

Custom models should:
1. Always link to standard models via relationship fields
2. Use standard security mechanisms
3. Follow Odoo's API patterns

Example Integration:
```python
class ResPartner(models.Model):
    _inherit = 'res.partner'
    
    training_progress_ids = fields.One2many('dog.training.progress', 'partner_id', string='Training Progress')
    behavior_assessment_ids = fields.One2many('dog.behavior.assessment', 'partner_id', string='Behavior Assessments')
    milestone_ids = fields.One2many('training.milestone', 'partner_id', string='Training Milestones')
```

## API Access Control

1. Portal User Access:
   ```python
   class DogTrainingProgress(models.Model):
       _name = 'dog.training.progress'
       
       @api.model
       def search_read(self, domain=None, fields=None, offset=0, limit=None, order=None):
           if self.env.user.has_group('base.group_portal'):
               # Ensure portal users only see their dogs' progress
               domain = domain or []
               domain += [('partner_id.parent_id', '=', self.env.user.partner_id.id)]
           return super().search_read(domain, fields, offset, limit, order)
   ```

2. Record Rules:
   ```xml
   <record id="dog_progress_portal_rule" model="ir.rule">
       <field name="name">Portal User: Own Dog Progress Only</field>
       <field name="model_id" ref="model_dog_training_progress"/>
       <field name="domain_force">[('partner_id.parent_id','=',user.partner_id.id)]</field>
       <field name="groups" eval="[(4, ref('base.group_portal'))]"/>
   </record>
   ```

## When to Use Custom Models

Consider custom models when:
1. The data structure doesn't fit standard models
2. You need specialized business logic
3. Performance optimization is required
4. Complex reporting is needed

Example Use Cases:
1. Detailed training progress tracking
2. Specialized behavior assessments
3. Custom milestone tracking
4. Training package customization

## API Endpoint Patterns

Custom models follow the same API patterns as standard models:

1. Create Record:
```http
POST /web/dataset/call_kw/[custom.model]/create
```

2. Read Records:
```http
POST /web/dataset/call_kw/[custom.model]/search_read
```

3. Update Record:
```http
POST /web/dataset/call_kw/[custom.model]/write
```

4. Delete Record:
```http
POST /web/dataset/call_kw/[custom.model]/unlink
```

## Security Best Practices

1. Model-Level Security:
   ```python
   _security = {
       'read': ['base.group_portal', 'base.group_user'],
       'write': ['base.group_user'],
       'create': ['base.group_user'],
       'unlink': ['base.group_user'],
   }
   ```

2. Field-Level Security:
   ```python
   trainer_notes = fields.Text('Trainer Notes', groups='base.group_user')
   ```

3. Method-Level Security:
   ```python
   @api.model
   def create(self, vals):
       if self.env.user.has_group('base.group_portal'):
           # Restrict certain fields for portal users
           restricted_fields = ['trainer_notes', 'internal_rating']
           for field in restricted_fields:
               vals.pop(field, None)
       return super().create(vals)
   ```

## Custom Model Implementation Requirements

IMPORTANT: Custom models require creating a custom Odoo module on the server side. This means:

1. Module Structure:
   ```
   customk9_module/
   ├── __init__.py
   ├── __manifest__.py
   ├── models/
   │   ├── __init__.py
   │   ├── training_progress.py
   │   ├── behavior_assessment.py
   │   └── training_milestone.py
   ├── security/
   │   ├── ir.model.access.csv
   │   └── security_rules.xml
   └── views/
       └── views.xml
   ```

2. Module Installation:
   - Module must be installed on the Odoo server
   - Requires server restart after installation
   - Cannot be done via API - needs server admin access

3. Development Process:
   a. Create module files on Odoo server
   b. Install module through Odoo admin interface
   c. Configure security and access rights
   d. Then use the API endpoints

Example Module Files:

1. `__manifest__.py`:
```python
{
    'name': 'CustomK9 Training',
    'version': '1.0',
    'category': 'Services',
    'depends': ['base', 'mail', 'calendar', 'sale'],
    'data': [
        'security/ir.model.access.csv',
        'security/security_rules.xml',
        'views/views.xml',
    ],
    'installable': True,
    'application': True,
}
```

2. `models/training_progress.py`:
```python
from odoo import models, fields, api

class DogTrainingProgress(models.Model):
    _name = 'dog.training.progress'
    _description = 'Dog Training Progress'
    _inherit = ['mail.thread']
    
    partner_id = fields.Many2one('res.partner', string='Dog', domain=[('function', '=', 'Dog')])
    training_date = fields.Date('Training Date')
    skill_level = fields.Selection([
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ])
    notes = fields.Text('Progress Notes')
    trainer_id = fields.Many2one('res.users', string='Trainer')
```

3. `security/ir.model.access.csv`:
```csv
id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_dog_training_progress_portal,dog.training.progress.portal,model_dog_training_progress,base.group_portal,1,0,0,0
access_dog_training_progress_user,dog.training.progress.user,model_dog_training_progress,base.group_user,1,1,1,1
```

4. `security/security_rules.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <record id="dog_progress_portal_rule" model="ir.rule">
        <field name="name">Portal User: Own Dog Progress Only</field>
        <field name="model_id" ref="model_dog_training_progress"/>
        <field name="domain_force">[('partner_id.parent_id','=',user.partner_id.id)]</field>
        <field name="groups" eval="[(4, ref('base.group_portal'))]"/>
    </record>
</odoo>
```

## Important Considerations

1. Server Access Required:
   - Custom models CANNOT be created via API
   - Need direct access to Odoo server
   - Requires development in Python
   - Must follow Odoo module structure

2. Deployment Process:
   - Develop module locally
   - Test in development environment
   - Deploy to production server
   - Install via Odoo admin interface
   - Restart Odoo service

3. Alternative Approaches:
   If server-side customization is not possible:
   - Use standard models with custom fields
   - Store additional data in JSON fields
   - Use existing model relationships
   - Leverage computed fields

4. Maintenance:
   - Custom modules need maintenance
   - Must be updated with Odoo versions
   - Requires ongoing development support
   - Consider long-term maintenance costs

## Recommendation

1. Start with Standard Models:
   - Use standard models first
   - Add custom fields to existing models
   - Use JSON fields for flexibility
   - Leverage existing functionality

2. Custom Models Only When:
   - Have server access
   - Can maintain code
   - Complex requirements
   - Performance critical

3. Hybrid Approach:
   - Mix standard and custom models
   - Minimize custom development
   - Focus on maintainability
   - Plan for upgrades 