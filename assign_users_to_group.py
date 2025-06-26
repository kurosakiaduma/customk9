#!/usr/bin/env python3
"""
Simplified script to assign existing users to CustomK9 Client group.
Run this if the main setup script is too complex.
"""

import logging
from odoo import api, SUPERUSER_ID
from odoo.exceptions import UserError

_logger = logging.getLogger(__name__)

def assign_users_to_customk9_group(cr, registry):
    """Assign existing users to CustomK9 Client group."""
    with api.Environment.manage():
        env = api.Environment(cr, SUPERUSER_ID, {})
        
        try:
            # Find or create CustomK9 Client group
            group_name = 'CustomK9 Client'
            customk9_group = env['res.groups'].search([('name', '=', group_name)])
            
            if not customk9_group:
                _logger.error(f"Group '{group_name}' not found. Please run setup_customk9_group.py first.")
                return
            
            _logger.info(f"Found CustomK9 Client group with ID: {customk9_group.id}")
            
            # List of known client users
            client_emails = [
                'tevin74@live.com',
                # Add other client email addresses here
            ]
            
            for email in client_emails:
                user = env['res.users'].search([('login', '=', email), ('active', '=', True)], limit=1)
                if user:
                    if customk9_group not in user.groups_id:
                        user.groups_id = [(4, customk9_group.id)]
                        _logger.info(f"✅ Added {email} to CustomK9 Client group")
                    else:
                        _logger.info(f"✅ {email} already in CustomK9 Client group")
                else:
                    _logger.warning(f"⚠️ User {email} not found in system")
            
            # Also assign all portal users who are customers
            portal_users = env['res.users'].search([
                ('groups_id', 'in', [env.ref('base.group_portal').id]),
                ('partner_id.customer_rank', '>', 0),
                ('active', '=', True),
            ])
            
            assigned_count = 0
            for user in portal_users:
                if customk9_group not in user.groups_id:
                    user.groups_id = [(4, customk9_group.id)]
                    assigned_count += 1
                    _logger.info(f"✅ Added portal user {user.login} to CustomK9 Client group")
            
            env.cr.commit()
            _logger.info(f"✅ Successfully assigned {assigned_count} portal users to CustomK9 Client group")
            _logger.info("User assignment completed successfully!")
            
        except Exception as e:
            env.cr.rollback()
            _logger.error(f"❌ Error assigning users to CustomK9 Client group: {e}")
            raise

# Execute the function
if __name__ == "__main__":
    import odoo
    from odoo.tools import config
    
    # Read the configuration
    config.parse_config()
    
    # Get database name from environment or config
    import os
    db_name = os.environ.get('DB_NAME', config.get('db_name'))
    
    if not db_name:
        print("Error: Database name not found. Set DB_NAME environment variable.")
        exit(1)
    
    print(f"Assigning users to CustomK9 Client group in database: {db_name}")
    
    # Get database registry and cursor
    registry = odoo.registry(db_name)
    
    with registry.cursor() as cr:
        assign_users_to_customk9_group(cr, registry)
    
    print("Assignment completed!")
else:
    # When run through odoo shell
    assign_users_to_customk9_group(env.cr, env.registry)
