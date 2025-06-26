export const config = {
  odoo: {
    baseUrl: process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'https://erp.vuna.io',
    database: process.env.NEXT_PUBLIC_ODOO_DATABASE || 'Merican',
    defaultUsername: process.env.NEXT_PUBLIC_ODOO_USERNAME || 'sales@mericanltd.com',
    defaultPassword: process.env.NEXT_PUBLIC_ODOO_PASSWORD || 'Qwerty@254'
  }
};