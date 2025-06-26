export const config = {
  odoo: {
    baseUrl: process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'https://erp.vuna.io',
    database: process.env.NEXT_PUBLIC_ODOO_DATABASE || 'Customk9',
    defaultUsername: process.env.NEXT_PUBLIC_ODOO_USERNAME || 'info@customk9kenya.com',
    defaultPassword: process.env.NEXT_PUBLIC_ODOO_PASSWORD || 'Qwerty@254'
  }
};