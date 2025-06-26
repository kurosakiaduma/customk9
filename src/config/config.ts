
// Debug environment variables in production
if (typeof window === 'undefined') {
  console.log('🔍 Server Environment Check:', {
    NODE_ENV: process.env.NODE_ENV,
    odoo_url: process.env.NEXT_PUBLIC_ODOO_BASE_URL,
    odoo_db: process.env.NEXT_PUBLIC_ODOO_DATABASE,
    has_admin_user: !!process.env.NEXT_PUBLIC_ODOO_ADMIN_USERNAME,
    has_admin_pass: !!process.env.NEXT_PUBLIC_ODOO_ADMIN_PASSWORD,
  });
} else {
  console.log('🔍 Client Environment Check:', {
    NODE_ENV: process.env.NODE_ENV,
    odoo_url: process.env.NEXT_PUBLIC_ODOO_BASE_URL,
    odoo_db: process.env.NEXT_PUBLIC_ODOO_DATABASE,
    has_admin_user: !!process.env.NEXT_PUBLIC_ODOO_ADMIN_USERNAME,
    has_admin_pass: !!process.env.NEXT_PUBLIC_ODOO_ADMIN_PASSWORD,
  });
}

export const config = {
  odoo: {
    baseUrl: process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'https://erp.vuna.io',
    database: process.env.NEXT_PUBLIC_ODOO_DATABASE || 'Customk9',
    // Admin credentials for server-side operations
    adminUsername: process.env.NEXT_PUBLIC_ODOO_ADMIN_USERNAME || 'info@customk9kenya.com',
    adminPassword: process.env.NEXT_PUBLIC_ODOO_ADMIN_PASSWORD || 'Qwerty@254'
  }
};