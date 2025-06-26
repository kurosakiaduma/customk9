import { NextRequest, NextResponse } from 'next/server';
import { OdooServerService } from '@/services/odoo/OdooServerService';
import { config } from '@/config/config';

// This API route acts as a proxy for Odoo API calls.
// It receives requests from the frontend, forwards them to the actual Odoo server,
// and sends back the response.
export async function POST(req: NextRequest) {
  const path = req.nextUrl.pathname.replace('/api/odoo', ''); // Get the original Odoo path
  const payload = await req.json();  console.log('🔍 API Route Debug:', {
    path,
    baseUrl: config.odoo.baseUrl,
    database: config.odoo.database,
    username: config.odoo.adminUsername,
    hasPassword: !!config.odoo.adminPassword
  });

  try {    // Initialize OdooServerService here to ensure it uses the full Odoo URL
    const odooServerService = new OdooServerService({
      baseUrl: config.odoo.baseUrl,
      database: config.odoo.database,
      defaultUsername: config.odoo.adminUsername,
      defaultPassword: config.odoo.adminPassword,
    });

    // Forward cookies from the client request to Odoo if available (for session)
    const cookieHeader = req.headers.get('cookie');
    let sessionId: string | null = null;

    if (cookieHeader) {
      const sessionIdMatch = cookieHeader.match(/session_id=([^;]+)/);
      if (sessionIdMatch && sessionIdMatch[1]) {
        sessionId = sessionIdMatch[1];
      }
    }

    // Note: The callOdoo method in OdooServerService will handle setting X-Openerp-Session-Id
    // based on this sessionId if provided, or manage its own if authenticate is called.
    // For /web/dataset/call_kw, the session_id is typically managed by Odoo itself once logged in.    // If the call is for authentication, we need to handle the session ID specifically
    if (path === '/web/session/authenticate') {
      console.log('🔍 API Route: Handling authentication request');
      const authResponse = await odooServerService.authenticate(payload.params.login, payload.params.password);
      console.log('✅ API Route: Authentication successful');
      
      const response = NextResponse.json({ result: authResponse });

      // Forward set-cookie headers from Odoo to the client
      const odooSetCookie = authResponse.headers ? authResponse.headers['set-cookie'] : null;

      if (odooSetCookie) {
        if (Array.isArray(odooSetCookie)) {
            odooSetCookie.forEach(cookie => response.headers.append('Set-Cookie', cookie));
        } else if (typeof odooSetCookie === 'string') {
            response.headers.append('Set-Cookie', odooSetCookie);
        }
      }

      return response;

    } else {
      console.log('🔍 API Route: Handling regular Odoo call:', path);
      const odooResponse = await odooServerService.callOdoo(path, payload, sessionId);
      console.log('✅ API Route: Odoo call successful');
      return NextResponse.json(odooResponse);
    }
  } catch (error: unknown) {
    const err = error as { message?: string; response?: { data?: unknown; status?: number } };    console.error('❌ API Proxy Error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      path: path,
      config: {
        baseUrl: config.odoo.baseUrl,
        database: config.odoo.database,
        username: config.odoo.adminUsername
      }
    });
    
    // Forward Odoo-specific error messages if available
    const errorMessage = err.message || 'An unknown error occurred';
    const statusCode = err.response?.status || 500;

    return NextResponse.json({ 
      error: { 
        message: errorMessage, 
        code: statusCode,
        details: err.response?.data || 'No additional details'
      } 
    }, { status: statusCode });
  }
}

// We might need to handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });
    // CORS headers will be handled by Vercel for API routes typically
    return response;
} 