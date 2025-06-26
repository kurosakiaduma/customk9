#!/usr/bin/env python3
"""
Script to create CustomK9 Client group and set up proper permissions in Odoo.
This script should be run in the Odoo environment.
"""

#!/usr/bin/env python3
"""
Script to create CustomK9 Client group and set up proper permissions in Odoo.
Modified for Odoo shell execution.
"""

import logging

_logger = logging.getLogger(__name__)

# Get the current environment (should be available in odoo shell)
current_env = env

try:
    # 1. Create or get CustomK9 Client group
    group_name = 'CustomK9 Client'
    existing_group = current_env['res.groups'].search([('name', '=', group_name)])
    
    if existing_group:
        _logger.info(f"Group '{group_name}' already exists with ID: {existing_group.id}")
        customk9_group = existing_group
    else:
        # Get base category for groups
        base_category = current_env.ref('base.module_category_hidden', raise_if_not_found=False)
        if not base_category:
            base_category = current_env['ir.module.category'].search([('name', '=', 'Hidden')], limit=1)
        
        customk9_group = current_env['res.groups'].create({
            'name': group_name,
            'category_id': base_category.id if base_category else False,
            'comment': 'Clients with access to training plans and calendar events for CustomK9',
        })
        print(f"✅ Created group '{group_name}' with ID: {customk9_group.id}")
    
    # 2. Set up access rights for the group
    access_rights = [
        # Project access - read only
        {
            'name': 'CustomK9 Client Project Read',
            'model_id': current_env.ref('project.model_project_project').id,
            'group_id': customk9_group.id,
            'perm_read': True,
            'perm_write': False,
            'perm_create': False,
            'perm_unlink': False,
        },
        # Project Task access - read only
        {
            'name': 'CustomK9 Client Task Read',
            'model_id': current_env.ref('project.model_project_task').id,
            'group_id': customk9_group.id,
            'perm_read': True,
            'perm_write': False,
            'perm_create': False,
            'perm_unlink': False,
        },
        # Calendar Event access - read and create
        {
            'name': 'CustomK9 Client Calendar Access',
            'model_id': current_env.ref('calendar.model_calendar_event').id,
            'group_id': customk9_group.id,
            'perm_read': True,
            'perm_write': True,  # Allow editing their own events
            'perm_create': True,  # Allow creating bookings
            'perm_unlink': False,  # Don't allow deletion
        },
        # Partner access - for their own record
        {
            'name': 'CustomK9 Client Partner Access',
            'model_id': current_env.ref('base.model_res_partner').id,
            'group_id': customk9_group.id,
            'perm_read': True,
            'perm_write': True,  # Allow updating their own info
            'perm_create': False,
            'perm_unlink': False,
        },
    ]
    
    for access_data in access_rights:
        # Check if access rule already exists
        existing_access = current_env['ir.model.access'].search([
            ('model_id', '=', access_data['model_id']),
            ('group_id', '=', access_data['group_id']),
        ])
        
        if existing_access:
            existing_access.write(access_data)
            print(f"✅ Updated access rule: {access_data['name']}")
        else:
            current_env['ir.model.access'].create(access_data)
            print(f"✅ Created access rule: {access_data['name']}")
    
    # 3. Create record rules for data isolation
    record_rules = [
        # Project record rule - only see projects where they are the customer
        {
            'name': 'CustomK9 Client Project Access Rule',
            'model_id': current_env.ref('project.model_project_project').id,
            'groups': [(4, customk9_group.id)],
            'domain_force': "[('partner_id', '=', user.partner_id.id)]",
            'perm_read': True,
            'perm_write': False,
            'perm_create': False,
            'perm_unlink': False,
        },
        # Task record rule - only see tasks from their projects
        {
            'name': 'CustomK9 Client Task Access Rule',
            'model_id': current_env.ref('project.model_project_task').id,
            'groups': [(4, customk9_group.id)],
            'domain_force': "[('project_id.partner_id', '=', user.partner_id.id)]",
            'perm_read': True,
            'perm_write': False,
            'perm_create': False,
            'perm_unlink': False,
        },
        # Calendar record rule - only see events they're invited to or own
        {
            'name': 'CustomK9 Client Calendar Access Rule',
            'model_id': current_env.ref('calendar.model_calendar_event').id,
            'groups': [(4, customk9_group.id)],
            'domain_force': "['|', ('partner_ids', 'in', [user.partner_id.id]), ('user_id', '=', user.id)]",
            'perm_read': True,
            'perm_write': True,
            'perm_create': True,
            'perm_unlink': False,
        },
        # Partner record rule - only access their own record
        {
            'name': 'CustomK9 Client Partner Access Rule',
            'model_id': current_env.ref('base.model_res_partner').id,
            'groups': [(4, customk9_group.id)],
            'domain_force': "[('id', '=', user.partner_id.id)]",
            'perm_read': True,
            'perm_write': True,
            'perm_create': False,
            'perm_unlink': False,
        },
    ]
    
    for rule_data in record_rules:
        # Check if rule already exists
        existing_rule = current_env['ir.rule'].search([
            ('name', '=', rule_data['name']),
            ('model_id', '=', rule_data['model_id']),
        ])
        
        if existing_rule:
            existing_rule.write(rule_data)
            print(f"✅ Updated record rule: {rule_data['name']}")
        else:
            current_env['ir.rule'].create(rule_data)
            print(f"✅ Created record rule: {rule_data['name']}")
    
    # 4. Assign existing customer users to the group
    # Find users who are customers but not admins
    customer_users = current_env['res.users'].search([
        ('partner_id.customer_rank', '>', 0),
        ('groups_id', 'not in', [current_env.ref('base.group_system').id]),  # Not system users
        ('active', '=', True),
    ])
    
    for user in customer_users:
        if customk9_group not in user.groups_id:
            user.groups_id = [(4, customk9_group.id)]
            print(f"✅ Added user {user.login} to CustomK9 Client group")
    
    # 5. Specifically assign known client users by email
    client_emails = [
        'tevin74@live.com',
        # Add other known client emails here
    ]
    
    for email in client_emails:
        user = current_env['res.users'].search([('login', '=', email), ('active', '=', True)], limit=1)
        if user:
            if customk9_group not in user.groups_id:
                user.groups_id = [(4, customk9_group.id)]
                print(f"✅ Specifically added {email} to CustomK9 Client group")
            else:
                print(f"✅ {email} already in CustomK9 Client group")
        else:
            print(f"⚠️ User {email} not found in system")
    
    current_env.cr.commit()
    print("✅ CustomK9 Client group setup completed successfully!")
    
except Exception as e:
    current_env.cr.rollback()
    print(f"❌ Error setting up CustomK9 Client group: {e}")
    import traceback
    traceback.print_exc()
