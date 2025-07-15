import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosRequestConfig } from 'axios';

// Define interfaces for the request data
interface OdooRequestParams {
  db?: string;
  login?: string;
  password?: string;
  context?: Record<string, unknown>;
  [key: string]: unknown;
}

interface OdooRequestData {
  jsonrpc: string;
  method: string;
  params: OdooRequestParams;
  [key: string]: unknown;
}

// Use the environment variable or fallback to the default Odoo URL
const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_BASE_URL || 'https://erp.nehemiahandwilliams.com/';

// Log the ODOO_URL for debugging
console.log('🔌 ODOO_URL:', ODOO_URL);

// Combined handler for both GET and POST requests

// Next.js App Router expects the second argument to be context: { params: { [key: string]: string | string[] } }
export async function GET(
  request: NextRequest,
  context: { params: { path: string[] } }
) {
  return handleRequest('GET', request, context.params);
}

export async function POST(
  request: NextRequest,
  context: { params: { path: string[] } }
) {
  return handleRequest('POST', request, context.params);
}

async function handleRequest(
  method: 'GET' | 'POST',
  request: NextRequest,
  { path = [] }: { path: string[] }
) {
  try {
    const endpoint = `/${path.join('/')}`;
    
    // Don't forward sensitive endpoints except for authentication
    if (endpoint.includes('web/database/manager') || 
        (endpoint.includes('web/session/change_password') && !endpoint.includes('web/session/authenticate'))) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get the full URL
    const url = `${ODOO_URL}${endpoint}`.replace(/([^:]\/)\/+/g, '$1'); // Remove double slashes
    console.log(`🌐 Forwarding ${method} request to:`, url);
    
    // Prepare request data for POST requests
    let requestData: OdooRequestData = {
      jsonrpc: '2.0',
      method: 'call',
      params: {}
    };
    if (method === 'POST') {
      const rawData = await request.json();
      // Merge the raw data with our typed object
      requestData = {
        ...requestData,
        ...rawData,
        params: {
          ...requestData.params,
          ...(rawData.params || {})
        }
      };
      
      // For authentication endpoint, ensure we're using the correct database
      if (endpoint.includes('/web/session/authenticate')) {
        console.log('🔑 Handling authentication request');
        if (requestData?.params?.db) {
          console.log('🔑 Using database from request:', requestData.params.db);
        } else {
          // If no database is specified, use the default
          requestData.params = requestData.params || {};
          requestData.params.db = process.env.NEXT_PUBLIC_ODOO_DATABASE || 'customk9';
          console.log('🔑 Using default database:', requestData.params.db);
        }
      }
    }
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
    };

    // Add session cookie if it exists
    const sessionId = request.cookies.get('session_id')?.value;
    if (sessionId) {
      headers['Cookie'] = `session_id=${sessionId}`;
    }

    // Add X-Openerp-Session-Id header if present in request
    const openerpSessionId = request.headers.get('X-Openerp-Session-Id');
    if (openerpSessionId) {
      headers['X-Openerp-Session-Id'] = openerpSessionId;
    }
    
    // Prepare request config
    const config: AxiosRequestConfig = {
      method,
      url,
      headers,
      withCredentials: true,
      responseType: 'json',
    };

    // Add request data to config if this is a POST request
    if (method === 'POST') {
      config.data = requestData;
    }
    
    // Forward the request to Odoo
    console.log('📤 Request config:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data
    });
    
    const response = await axios(config).catch(error => {
      console.error('❌ Odoo API error:', error.response?.data || error.message);
      throw error;
    });
    
    console.log('📥 Odoo response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });

    // Forward the response from Odoo
    const responseHeaders = new Headers({
      'Content-Type': 'application/json',
    });
    
    // Forward any set-cookie headers from Odoo to the client
    if (response.headers['set-cookie']) {
      const cookies = Array.isArray(response.headers['set-cookie']) 
        ? response.headers['set-cookie'] 
        : [response.headers['set-cookie']];
      
      cookies.forEach(cookie => {
        if (cookie) {
          // Extract session_id from the cookie
          const sessionMatch = cookie.match(/session_id=([^;]+)/);
          if (sessionMatch) {
            // Set the session cookie with proper attributes
            responseHeaders.append(
              'Set-Cookie',
              `session_id=${sessionMatch[1]}; Path=/; HttpOnly; SameSite=Lax`
            );
          }
        }
      });
    }

    // For session info endpoint, ensure we return the expected format
    if (endpoint.includes('/web/session/authenticate') || 
        endpoint.includes('/web/session/get_session_info')) {
      return NextResponse.json({
        jsonrpc: '2.0',
        id: null,
        result: response.data.result || response.data
      }, { 
        status: 200,
        headers: responseHeaders
      });
    }

    return new NextResponse(JSON.stringify(response.data), {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: unknown) {
    console.error('Odoo API error:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Odoo API error response:', error.response.data);
        return NextResponse.json(
          { 
            jsonrpc: '2.0',
            error: {
              code: error.response.status,
              message: error.response.data?.message || 'Error from Odoo server',
              data: error.response.data
            }
          },
          { status: error.response.status }
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from Odoo server');
        return NextResponse.json(
          { 
            jsonrpc: '2.0',
            error: {
              code: 504,
              message: 'Odoo server not responding'
            }
          },
          { status: 504 }
        );
      }
    }
    
    // Something happened in setting up the request that triggered an Error
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        jsonrpc: '2.0',
        error: {
          code: 500,
          message: errorMessage
        }
      },
      { status: 500 }
    );
  }
}
