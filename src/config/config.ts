export const config = {
  odoo: {
    baseUrl: process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'https://erp.vuna.io',
    database: process.env.NEXT_PUBLIC_ODOO_DATABASE || 'Customk9',
    // Remove hardcoded admin credentials - users will provide their own
    adminUsername: process.env.NEXT_PUBLIC_ODOO_ADMIN_USERNAME || 'info@customk9kenya.com',
    adminPassword: process.env.NEXT_PUBLIC_ODOO_ADMIN_PASSWORD || 'Qwerty@254'
  }
};