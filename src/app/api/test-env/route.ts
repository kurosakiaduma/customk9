import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🔍 Environment Variables Test Route Called');
  
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    odoo_url: process.env.NEXT_PUBLIC_ODOO_BASE_URL,
    odoo_db: process.env.NEXT_PUBLIC_ODOO_DATABASE,
    has_admin_username: !!process.env.NEXT_PUBLIC_ODOO_ADMIN_USERNAME,
    has_admin_password: !!process.env.NEXT_PUBLIC_ODOO_ADMIN_PASSWORD,
    timestamp: new Date().toISOString(),
  };
  
  console.log('🔍 Environment Check Result:', envCheck);
  
  return NextResponse.json(envCheck);
}
